import { useComputed } from '@preact/signals';
import {
  selectedPumpId, pumpOperatingPoint,
  lineItems, unitSystem,
  supplyTempDisplay, returnTempDisplay,
} from '../store';
import { headLossAtFlow } from '../calculations';
import { tempToF, lengthToFt, lengthFromFt, flowFromGpm, flowToGpm } from '../units';
import { getPumpById } from '../data/pumps';
import { evalPumpHead, catmullRomPath, niceCeil, axisTicks } from '../data/pumpCurve';

// ── SVG layout constants ──────────────────────────────────────────────────
const VW   = 560;
const VH   = 310;
const ML   = 56;   // left margin  (Y-axis labels)
const MT   = 14;   // top margin
const MR   = 16;   // right margin
const MB   = 48;   // bottom margin (X-axis labels)
const CW   = VW - ML - MR;   // chart area width  = 488
const CH   = VH - MT - MB;   // chart area height = 248
const X0   = ML;
const Y0   = MT;
const X1   = ML + CW;
const Y1   = MT + CH;

// ── Helpers ───────────────────────────────────────────────────────────────
function xSvg(gpm: number, maxGpm: number): number {
  return X0 + (gpm / maxGpm) * CW;
}
function ySvg(head: number, maxHead: number): number {
  return Y1 - (head / maxHead) * CH;
}
function fmtTick(n: number): string {
  // Show integer if whole, else 1 decimal
  return n % 1 === 0 ? String(n) : n.toFixed(1);
}

// ── Component ─────────────────────────────────────────────────────────────
export function PumpChart() {
  const pumpId = useComputed(() => selectedPumpId.value);
  const sys    = useComputed(() => unitSystem.value);
  const op     = useComputed(() => pumpOperatingPoint.value);

  const chartData = useComputed(() => {
    const id = selectedPumpId.value;
    if (!id) return null;

    const pump = getPumpById(id);
    if (!pump) return null;

    const s         = unitSystem.value;
    const supplyF   = tempToF(supplyTempDisplay.value, s);
    const returnF   = tempToF(returnTempDisplay.value, s);
    const avgTempF  = (supplyF + returnF) / 2;

    const itemsInFt = lineItems.value.map(item =>
      item.kind === 'pipe' ? { ...item, length: lengthToFt(item.length, s) } : item
    );
    const hasCircuit = itemsInFt.length > 0;

    // Axis ranges — pump's native gpm/ft data; we convert for display labels
    const pumpMaxGpm  = pump.curve[pump.curve.length - 1].gpm;
    const pumpMaxHead = pump.curve[0].headFt;

    // ── Compute axis max in display units so ticks are "nice" regardless of unit system ──
    // Display-unit max → niceCeil → convert back to internal GPM/ft for scaling
    const rawDisplayMaxGpm  = s === 'metric' ? flowFromGpm(pumpMaxGpm  * 1.08, s) : pumpMaxGpm  * 1.08;
    const rawDisplayMaxHead = s === 'metric' ? lengthFromFt(pumpMaxHead * 1.12, s) : pumpMaxHead * 1.12;
    const displayAxisMaxGpm  = niceCeil(rawDisplayMaxGpm);
    const displayAxisMaxHead = niceCeil(rawDisplayMaxHead);
    // Internal (GPM/ft) axis limits used for all SVG scaling
    const axisMaxGpm  = s === 'metric' ? flowToGpm(displayAxisMaxGpm, s)         : displayAxisMaxGpm;
    const axisMaxHead = s === 'metric' ? displayAxisMaxHead / 0.3048             : displayAxisMaxHead;

    // ── Sample system curve (native GPM/ft) ──
    const SAMPLES = 80;
    const sysPts: Array<{ gpm: number; headFt: number }> = [];
    if (hasCircuit) {
      for (let i = 0; i <= SAMPLES; i++) {
        const gpm    = (i / SAMPLES) * axisMaxGpm;
        const headFt = headLossAtFlow(itemsInFt, gpm, avgTempF);
        sysPts.push({ gpm, headFt });
      }
    }

    // ── Pump curve Catmull-Rom path ──
    const pumpSvgPts = pump.curve.map(pt => ({
      x: xSvg(pt.gpm, axisMaxGpm),
      y: ySvg(pt.headFt, axisMaxHead),
    }));
    const pumpPath = catmullRomPath(pumpSvgPts);

    // ── System curve polyline ──
    const sysPolyline = sysPts
      .map(pt => `${xSvg(pt.gpm, axisMaxGpm).toFixed(1)},${ySvg(pt.headFt, axisMaxHead).toFixed(1)}`)
      .join(' ');

    // ── Operating point (SVG coords) ──
    const opPoint = pumpOperatingPoint.value;
    const opSvg = opPoint
      ? { x: xSvg(opPoint.gpm, axisMaxGpm), y: ySvg(opPoint.headFt, axisMaxHead) }
      : null;

    // ── Axis ticks: display-unit value for labels + internal value for SVG position ──
    type Tick = { display: number; internal: number };
    const xTicks: Tick[] = axisTicks(displayAxisMaxGpm, 5).map(d => ({
      display:  d,
      internal: s === 'metric' ? flowToGpm(d, s) : d,
    }));
    const yTicks: Tick[] = axisTicks(displayAxisMaxHead, 4).map(d => ({
      display:  d,
      internal: s === 'metric' ? d / 0.3048 : d,
    }));

    return {
      pump,
      axisMaxGpm, axisMaxHead,
      pumpPath, sysPolyline, sysPts, hasCircuit,
      opSvg, opPoint,
      xTicks, yTicks,
    };
  });

  if (!pumpId.value) {
    return (
      <div class="pump-chart-card pump-chart-placeholder">
        <sl-icon name="graph-up" style="font-size: 3rem; color: var(--sl-color-neutral-300)" />
        <p>Select a circulator to see the pump curve.</p>
      </div>
    );
  }

  const d = chartData.value;
  if (!d) return null;

  const s = sys.value;
  const flowAxisLabel  = s === 'metric' ? 'Flow (L/hr)' : 'Flow (GPM)';
  const headAxisLabel  = s === 'metric' ? 'Head (m)'   : 'Head (ft)';

  return (
    <div class="pump-chart-card">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        class="pump-svg"
        role="img"
        aria-label="Pump curve chart"
      >
        {/* ── Defs ── */}
        <defs>
          <clipPath id="chart-clip">
            <rect x={X0} y={Y0} width={CW} height={CH} />
          </clipPath>
        </defs>

        {/* ── Grid lines ── */}
        <g class="chart-grid">
          {d.yTicks.slice(1).map(t => {
            const y = ySvg(t.internal, d.axisMaxHead);
            return <line key={t.display} x1={X0} x2={X1} y1={y} y2={y} />;
          })}
          {d.xTicks.slice(1).map(t => {
            const x = xSvg(t.internal, d.axisMaxGpm);
            return <line key={t.display} x1={x} x2={x} y1={Y0} y2={Y1} />;
          })}
        </g>

        {/* ── Chart border ── */}
        <rect x={X0} y={Y0} width={CW} height={CH} class="chart-border" />

        {/* ── Y-axis ticks & labels ── */}
        <g class="chart-axis-labels">
          {d.yTicks.map(t => {
            const y     = ySvg(t.internal, d.axisMaxHead);
            const label = fmtTick(t.display);
            return (
              <g key={t.display}>
                <line x1={X0 - 4} x2={X0} y1={y} y2={y} class="chart-tick" />
                <text x={X0 - 7} y={y} text-anchor="end" dominant-baseline="middle">{label}</text>
              </g>
            );
          })}
          {/* Y-axis title */}
          <text
            x={10}
            y={Y0 + CH / 2}
            text-anchor="middle"
            dominant-baseline="middle"
            transform={`rotate(-90, 10, ${Y0 + CH / 2})`}
            class="chart-axis-title"
          >
            {headAxisLabel}
          </text>
        </g>

        {/* ── X-axis ticks & labels ── */}
        <g class="chart-axis-labels">
          {d.xTicks.map(t => {
            const x     = xSvg(t.internal, d.axisMaxGpm);
            const label = fmtTick(t.display);
            return (
              <g key={t.display}>
                <line x1={x} x2={x} y1={Y1} y2={Y1 + 4} class="chart-tick" />
                <text x={x} y={Y1 + 14} text-anchor="middle">{label}</text>
              </g>
            );
          })}
          {/* X-axis title */}
          <text
            x={X0 + CW / 2}
            y={VH - 4}
            text-anchor="middle"
            class="chart-axis-title"
          >
            {flowAxisLabel}
          </text>
        </g>

        {/* ── Curves (clipped) ── */}
        <g clip-path="url(#chart-clip)">
          {/* System curve */}
          {d.hasCircuit && d.sysPolyline && (
            <polyline
              points={d.sysPolyline}
              class="system-curve"
            />
          )}

          {/* Pump curve */}
          <path d={d.pumpPath} class="pump-curve" />

          {/* Operating point */}
          {d.opSvg && (
            <g>
              {/* Cross-hair dashed lines */}
              <line
                x1={d.opSvg.x} x2={d.opSvg.x}
                y1={d.opSvg.y} y2={Y1}
                class="op-crosshair"
              />
              <line
                x1={X0} x2={d.opSvg.x}
                y1={d.opSvg.y} y2={d.opSvg.y}
                class="op-crosshair"
              />
              {/* Dot */}
              <circle cx={d.opSvg.x} cy={d.opSvg.y} r="6" class="op-dot" />
              <circle cx={d.opSvg.x} cy={d.opSvg.y} r="3" class="op-dot-inner" />
            </g>
          )}
        </g>

        {/* ── Legend ── */}
        <g class="chart-legend">
          <line x1={X0 + 8}  x2={X0 + 28} y1={Y0 + 12} y2={Y0 + 12} class="pump-curve" />
          <text x={X0 + 33} y={Y0 + 12} dominant-baseline="middle">Pump curve</text>
          {d.hasCircuit && (
            <>
              <line x1={X0 + 8}  x2={X0 + 28} y1={Y0 + 27} y2={Y0 + 27} class="system-curve" />
              <text x={X0 + 33} y={Y0 + 27} dominant-baseline="middle">System curve</text>
            </>
          )}
        </g>
      </svg>

      {!d.hasCircuit && (
        <p class="chart-hint">
          Add pipe segments in the Circuit tab to see the system curve.
        </p>
      )}
    </div>
  );
}
