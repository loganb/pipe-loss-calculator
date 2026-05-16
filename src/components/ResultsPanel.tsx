import { useComputed } from '@preact/signals';
import { results, unitSystem } from '../store';
import {
  formatHeat, formatVelocity, formatHeadLoss, formatEquivLength,
} from '../units';

export function ResultsPanel() {
  const res = useComputed(() => results.value);
  const sys = useComputed(() => unitSystem.value);

  const r = res.value;
  const s = sys.value;

  return (
    <div class="results-panel">
      <h2>Results</h2>

      {!r.valid ? (
        <div class="results-error">
          <sl-icon name="exclamation-triangle" />
          <span>{r.error ?? 'Add pipe segments to calculate.'}</span>
        </div>
      ) : (
        <div class="results-grid">
          <div class="result-card">
            <div class="result-label">Equiv. Length</div>
            <div class="result-value">{formatEquivLength(r.totalEquivLengthFt, s)}</div>
          </div>

          <div class="result-card highlight">
            <div class="result-label">Head Loss</div>
            <div class="result-value">{formatHeadLoss(r.headLossFt, s)}</div>
          </div>

          <div class="result-card highlight">
            <div class="result-label">Pressure Drop</div>
            <div class="result-value">
              {s === 'metric'
                ? `${(r.pressurePsi * 6.89476).toFixed(1)} kPa`
                : `${r.pressurePsi.toFixed(2)} psi`}
            </div>
          </div>

          <div class="result-card accent">
            <div class="result-label">Heat Output</div>
            <div class="result-value">{formatHeat(r.heatBtuHr, s)}</div>
          </div>

          <div class="result-card">
            <div class="result-label">Peak Velocity</div>
            <div class="result-value">{formatVelocity(r.velocityFps, s)}</div>
            {r.velocityFps > 4 && (
              <div class="result-warn">
                <sl-icon name="exclamation-triangle" /> Exceeds 4 ft/s — noise risk
              </div>
            )}
            {r.velocityFps < 1 && r.velocityFps > 0 && (
              <div class="result-warn">
                <sl-icon name="exclamation-triangle" /> Below 1 ft/s — air separation risk
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
