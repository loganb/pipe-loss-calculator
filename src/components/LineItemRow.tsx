import { useComputed } from '@preact/signals';
import { unitSystem } from '../store';
import { updateItem, removeItem, moveItem } from '../store';
import { ALL_FITTING_TYPES, FITTING_LABELS, getEquivLength } from '../data/fittings';
import { MATERIAL_LABELS, SIZE_LABELS, availableSizes } from '../data/pipeDimensions';
import { ALL_MATERIALS } from '../data/pipeDimensions';
import { formatEquivLength, lengthLabel } from '../units';
import type { LineItem, PipeMaterial, PipeSize, FittingType } from '../types';

interface Props {
  item: LineItem;
  isFirst: boolean;
  isLast: boolean;
}

export function LineItemRow({ item, isFirst, isLast }: Props) {
  const sys = useComputed(() => unitSystem.value);

  const equivLengthDisplay =
    item.kind === 'fitting'
      ? formatEquivLength(getEquivLength(item.fittingType, item.size) * item.quantity, sys.value)
      : null;

  return (
    <div class={`li-card ${item.kind}`}>
      {/* ── Row 1: kind badge / type / size / actions ── */}
      <div class="li-row1">
        <sl-badge variant={item.kind === 'pipe' ? 'primary' : 'neutral'} pill class="li-kind">
          {item.kind === 'pipe' ? 'Pipe' : 'Fitting'}
        </sl-badge>

        <select
          class="sl-select-native li-type"
          value={item.kind === 'pipe' ? item.material : item.fittingType}
          onChange={e => {
            const val = (e.target as HTMLSelectElement).value;
            updateItem(item.id, item.kind === 'pipe'
              ? { material: val as PipeMaterial }
              : { fittingType: val as FittingType });
          }}
        >
          {item.kind === 'pipe'
            ? ALL_MATERIALS.map(m => <option key={m} value={m}>{MATERIAL_LABELS[m]}</option>)
            : ALL_FITTING_TYPES.map(f => <option key={f} value={f}>{FITTING_LABELS[f]}</option>)}
        </select>

        <select
          class="sl-select-native li-size"
          value={item.size}
          onChange={e => updateItem(item.id, { size: (e.target as HTMLSelectElement).value as PipeSize })}
        >
          {availableSizes(item.kind === 'pipe' ? item.material : 'copper_m').map(s => (
            <option key={s} value={s}>{SIZE_LABELS[s]}</option>
          ))}
        </select>

        <div class="li-actions">
          <sl-icon-button name="arrow-up"   label="Move up"   disabled={isFirst || undefined} onClick={() => moveItem(item.id, 'up')} />
          <sl-icon-button name="arrow-down" label="Move down" disabled={isLast  || undefined} onClick={() => moveItem(item.id, 'down')} />
          <sl-icon-button name="trash"      label="Remove"    class="delete-btn"              onClick={() => removeItem(item.id)} />
        </div>
      </div>

      {/* ── Row 2: quantity/length + equiv length ── */}
      <div class="li-row2">
        {item.kind === 'pipe' ? (
          <label class="li-field">
            <span class="li-field-label">Length</span>
            <div class="input-with-unit">
              <input
                type="number" class="sl-input-native" min="0" step="0.5"
                value={item.length}
                onChange={e => updateItem(item.id, { length: parseFloat((e.target as HTMLInputElement).value) || 0 })}
              />
              <span class="unit-label">{lengthLabel(sys.value)}</span>
            </div>
          </label>
        ) : (
          <label class="li-field">
            <span class="li-field-label">Qty</span>
            <input
              type="number" class="sl-input-native qty-input" min="1" step="1"
              value={item.quantity}
              onChange={e => updateItem(item.id, { quantity: parseInt((e.target as HTMLInputElement).value) || 1 })}
            />
          </label>
        )}

        {equivLengthDisplay && (
          <div class="li-equiv">
            <span class="li-field-label">Equiv. length</span>
            <span class="equiv-value">{equivLengthDisplay}</span>
          </div>
        )}
      </div>
    </div>
  );
}
