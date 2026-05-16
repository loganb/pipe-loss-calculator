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

  const equivLengthDisplay = useComputed(() => {
    if (item.kind === 'fitting') {
      const totalFt = getEquivLength(item.fittingType, item.size) * item.quantity;
      return formatEquivLength(totalFt, sys.value);
    }
    return '—';
  });

  return (
    <tr class="line-item-row">
      {/* kind badge */}
      <td>
        <sl-badge variant={item.kind === 'pipe' ? 'primary' : 'neutral'} pill>
          {item.kind === 'pipe' ? 'Pipe' : 'Fitting'}
        </sl-badge>
      </td>

      {/* type / material selector */}
      <td>
        {item.kind === 'pipe' ? (
          <select
            class="sl-select-native"
            value={item.material}
            onChange={e => updateItem(item.id, { material: (e.target as HTMLSelectElement).value as PipeMaterial })}
          >
            {ALL_MATERIALS.map(m => (
              <option key={m} value={m}>{MATERIAL_LABELS[m]}</option>
            ))}
          </select>
        ) : (
          <select
            class="sl-select-native"
            value={item.fittingType}
            onChange={e => updateItem(item.id, { fittingType: (e.target as HTMLSelectElement).value as FittingType })}
          >
            {ALL_FITTING_TYPES.map(f => (
              <option key={f} value={f}>{FITTING_LABELS[f]}</option>
            ))}
          </select>
        )}
      </td>

      {/* size selector */}
      <td>
        <select
          class="sl-select-native"
          value={item.size}
          onChange={e => updateItem(item.id, { size: (e.target as HTMLSelectElement).value as PipeSize })}
        >
          {(item.kind === 'pipe' ? availableSizes(item.material) : availableSizes('copper_m')).map(s => (
            <option key={s} value={s}>{SIZE_LABELS[s]}</option>
          ))}
        </select>
      </td>

      {/* quantity / length */}
      <td>
        {item.kind === 'pipe' ? (
          <div class="input-with-unit">
            <input
              type="number"
              class="sl-input-native"
              min="0"
              step="0.5"
              value={item.length}
              onChange={e => updateItem(item.id, { length: parseFloat((e.target as HTMLInputElement).value) || 0 })}
            />
            <span class="unit-label">{lengthLabel(sys.value)}</span>
          </div>
        ) : (
          <input
            type="number"
            class="sl-input-native qty-input"
            min="1"
            step="1"
            value={item.quantity}
            onChange={e => updateItem(item.id, { quantity: parseInt((e.target as HTMLInputElement).value) || 1 })}
          />
        )}
      </td>

      {/* equiv length (fittings only) */}
      <td class="equiv-col">
        {item.kind === 'fitting' ? (
          <span class="equiv-value">{equivLengthDisplay}</span>
        ) : (
          <span class="muted">—</span>
        )}
      </td>

      {/* actions */}
      <td class="actions-col">
        <div class="row-actions">
          <sl-icon-button
            name="arrow-up"
            label="Move up"
            disabled={isFirst || undefined}
            onClick={() => moveItem(item.id, 'up')}
          />
          <sl-icon-button
            name="arrow-down"
            label="Move down"
            disabled={isLast || undefined}
            onClick={() => moveItem(item.id, 'down')}
          />
          <sl-icon-button
            name="trash"
            label="Remove"
            class="delete-btn"
            onClick={() => removeItem(item.id)}
          />
        </div>
      </td>
    </tr>
  );
}
