import { useComputed } from '@preact/signals';
import { unitSystem, flowRateDisplay, supplyTempDisplay, returnTempDisplay } from '../store';
import { flowLabel, tempLabel, tempStep } from '../units';

export function FlowHeatPanel() {
  const sys = useComputed(() => unitSystem.value);

  return (
    <div class="flow-heat-panel">
      <h2>Flow &amp; Temperatures</h2>
      <div class="fh-grid">
        <label class="fh-label">
          Flow Rate
          <div class="input-with-unit">
            <input
              type="number"
              class="sl-input-native"
              min="0"
              step={sys.value === 'metric' ? 10 : 0.5}
              value={flowRateDisplay.value}
              onChange={e => { flowRateDisplay.value = parseFloat((e.target as HTMLInputElement).value) || 0; }}
            />
            <span class="unit-label">{flowLabel(sys.value)}</span>
          </div>
        </label>

        <label class="fh-label">
          Supply Temp
          <div class="input-with-unit">
            <input
              type="number"
              class="sl-input-native"
              step={tempStep(sys.value)}
              value={supplyTempDisplay.value}
              onChange={e => { supplyTempDisplay.value = parseFloat((e.target as HTMLInputElement).value) || 0; }}
            />
            <span class="unit-label">{tempLabel(sys.value)}</span>
          </div>
        </label>

        <label class="fh-label">
          Return Temp
          <div class="input-with-unit">
            <input
              type="number"
              class="sl-input-native"
              step={tempStep(sys.value)}
              value={returnTempDisplay.value}
              onChange={e => { returnTempDisplay.value = parseFloat((e.target as HTMLInputElement).value) || 0; }}
            />
            <span class="unit-label">{tempLabel(sys.value)}</span>
          </div>
        </label>
      </div>
    </div>
  );
}
