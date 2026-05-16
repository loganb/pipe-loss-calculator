import { useComputed } from '@preact/signals';
import { pumpOperatingPoint, unitSystem, selectedPumpId } from '../store';

export function OperatingPointCard() {
  const sys   = useComputed(() => unitSystem.value);
  const pumpId = useComputed(() => selectedPumpId.value);
  const op    = useComputed(() => pumpOperatingPoint.value);

  if (!pumpId.value) return null;

  if (!op.value) {
    return (
      <div class="results-panel op-no-intersect">
        <sl-icon name="exclamation-triangle" style="color: var(--color-accent); font-size: 1.2rem;" />
        <p style="font-size: .85rem; color: var(--color-muted); margin-top: .4rem;">
          No operating point — pump curve does not intersect the system curve.
          The pump may be undersized for this circuit.
        </p>
      </div>
    );
  }

  const { gpm, headFt } = op.value;

  const flowStr = sys.value === 'metric'
    ? `${(gpm * 227.124).toFixed(0)} L/hr`
    : `${gpm.toFixed(1)} GPM`;

  const headStr = sys.value === 'metric'
    ? `${(headFt * 0.3048).toFixed(2)} m`
    : `${headFt.toFixed(1)} ft`;

  return (
    <div class="results-panel">
      <h2>Operating Point</h2>
      <div class="results-grid">
        <div class="result-card highlight">
          <span class="result-label">Flow rate</span>
          <span class="result-value">{flowStr}</span>
        </div>
        <div class="result-card highlight">
          <span class="result-label">Head</span>
          <span class="result-value">{headStr}</span>
        </div>
      </div>
    </div>
  );
}
