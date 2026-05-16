import { useComputed } from '@preact/signals';
import { lineItems, addPipe, addFitting, results, unitSystem } from '../store';
import { LineItemRow } from './LineItemRow';
import { formatEquivLength } from '../units';

export function CircuitBuilder() {
  const items = useComputed(() => lineItems.value);
  const res   = useComputed(() => results.value);
  const sys   = useComputed(() => unitSystem.value);

  return (
    <div class="circuit-builder">
      <div class="section-header">
        <h2>Circuit</h2>
        <div class="add-buttons">
          <sl-button size="small" variant="primary" onClick={() => addPipe()}>
            <sl-icon slot="prefix" name="plus-circle" />
            Add Pipe
          </sl-button>
          <sl-button size="small" variant="neutral" onClick={() => addFitting()}>
            <sl-icon slot="prefix" name="plus-circle" />
            Add Fitting
          </sl-button>
        </div>
      </div>

      {items.value.length === 0 ? (
        <div class="empty-state">
          <sl-icon name="diagram-3" style="font-size: 2rem; color: var(--sl-color-neutral-400)" />
          <p>No segments yet. Add a pipe run or fitting to begin.</p>
        </div>
      ) : (
        <div class="circuit-list">
          {items.value.map((item, idx) => (
            <LineItemRow
              key={item.id}
              item={item}
              isFirst={idx === 0}
              isLast={idx === items.value.length - 1}
            />
          ))}

          <div class="circuit-totals">
            <span class="totals-label">Total equivalent length</span>
            <span class="totals-value">
              {res.value.valid ? formatEquivLength(res.value.totalEquivLengthFt, sys.value) : '—'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
