import { useComputed } from '@preact/signals';
import { unitSystem } from '../store';

export function Header() {
  const sys = useComputed(() => unitSystem.value);

  return (
    <header class="app-header">
      <div class="header-title">
        <sl-icon name="droplet-half" class="header-icon" />
        <span>Hydronic Pipe Loss Calculator</span>
      </div>

      <div class="header-controls">
        <div class="unit-toggle-group">
          <button
            class={`unit-btn ${sys.value === 'imperial' ? 'active' : ''}`}
            onClick={() => { unitSystem.value = 'imperial'; }}
          >
            Imperial
          </button>
          <button
            class={`unit-btn ${sys.value === 'metric' ? 'active' : ''}`}
            onClick={() => { unitSystem.value = 'metric'; }}
          >
            Metric
          </button>
        </div>
      </div>
    </header>
  );
}
