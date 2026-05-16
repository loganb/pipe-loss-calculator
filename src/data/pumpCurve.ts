import type { PumpCurvePoint } from './pumps';

/**
 * Linear interpolation of pump head at an arbitrary flow rate.
 * Returns 0 for flows beyond the pump's max flow.
 */
export function evalPumpHead(curve: PumpCurvePoint[], flowGpm: number): number {
  if (flowGpm <= 0) return curve[0]?.headFt ?? 0;
  const last = curve[curve.length - 1];
  if (flowGpm >= last.gpm) return 0;

  for (let i = 1; i < curve.length; i++) {
    const p0 = curve[i - 1];
    const p1 = curve[i];
    if (flowGpm <= p1.gpm) {
      const t = (flowGpm - p0.gpm) / (p1.gpm - p0.gpm);
      return p0.headFt + t * (p1.headFt - p0.headFt);
    }
  }
  return 0;
}

/**
 * Find the operating point (intersection of pump curve and system curve).
 * systemFn(gpm) → system head loss in ft.
 * Returns null if the pump cannot overcome system resistance.
 */
export function findOperatingPoint(
  curve: PumpCurvePoint[],
  systemFn: (gpm: number) => number,
): { gpm: number; headFt: number } | null {
  const maxGpm = curve[curve.length - 1].gpm;
  const N = 400;
  const step = maxGpm / N;

  let prevDiff: number | null = null;
  let prevGpm = 0;

  for (let i = 1; i <= N; i++) {
    const gpm    = i * step;
    const pumpH  = evalPumpHead(curve, gpm);
    const sysH   = systemFn(gpm);
    const diff   = pumpH - sysH;

    if (prevDiff !== null && prevDiff > 0 && diff <= 0) {
      // Zero crossing found — interpolate for precision
      const t      = prevDiff / (prevDiff - diff);
      const opGpm  = prevGpm + t * step;
      const opHead = evalPumpHead(curve, opGpm);
      return { gpm: opGpm, headFt: opHead };
    }

    prevDiff = diff;
    prevGpm  = gpm;
  }
  return null;
}

/**
 * Convert an array of {x, y} screen-space points to a smooth SVG cubic Bezier
 * path using the Catmull-Rom → Bezier conversion.
 */
export function catmullRomPath(points: Array<{ x: number; y: number }>): string {
  if (points.length < 2) return '';

  const n = points.length;
  let d = `M ${fmt(points[0].x)} ${fmt(points[0].y)}`;

  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, n - 1)];

    // Catmull-Rom tangent → cubic Bezier control points
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${fmt(cp1x)} ${fmt(cp1y)}, ${fmt(cp2x)} ${fmt(cp2y)}, ${fmt(p2.x)} ${fmt(p2.y)}`;
  }

  return d;
}

function fmt(n: number): string {
  return n.toFixed(2);
}

/**
 * Round val up to a "nice" number using the 1–1.5–2–2.5–5–10 × 10^n sequence.
 * Used for axis max values — gives tighter ceilings than the classic 1-2-5 pattern.
 */
export function niceCeil(val: number): number {
  if (val <= 0) return 10;
  const exp  = Math.pow(10, Math.floor(Math.log10(val)));
  const frac = val / exp;
  if (frac <= 1)   return exp;
  if (frac <= 1.5) return 1.5 * exp;
  if (frac <= 2)   return 2 * exp;
  if (frac <= 2.5) return 2.5 * exp;
  if (frac <= 5)   return 5 * exp;
  return 10 * exp;
}

/**
 * Generate evenly-spaced tick values from 0 to max (inclusive).
 * Picks the number of divisions that yields a whole-number step.
 */
export function axisTicks(max: number, preferredDivisions = 5): number[] {
  // Try preferred count first, then ±1, looking for integer steps
  for (const n of [preferredDivisions, preferredDivisions - 1, preferredDivisions + 1, 4, 6]) {
    if (n < 2) continue;
    const step = max / n;
    if (Math.abs(step - Math.round(step)) < 1e-9) {
      return Array.from({ length: n + 1 }, (_, i) => i * step);
    }
  }
  // Fall back: just use preferred, even if steps aren't whole
  const step = max / preferredDivisions;
  return Array.from({ length: preferredDivisions + 1 }, (_, i) => i * step);
}
