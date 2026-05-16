import { useComputed } from '@preact/signals';
import { selectedPumpId } from '../store';
import { PUMP_DB, PUMP_BRANDS, getPumpsByBrand } from '../data/pumps';

export function PumpSelector() {
  const selId = useComputed(() => selectedPumpId.value);

  const selectedBrand = useComputed(() => {
    if (!selectedPumpId.value) return '';
    return PUMP_DB.find(p => p.id === selectedPumpId.value)?.brand ?? '';
  });

  const modelsForBrand = useComputed(() =>
    selectedBrand.value ? getPumpsByBrand(selectedBrand.value) : []
  );

  return (
    <div class="flow-heat-panel pump-selector">
      <h2>Circulator</h2>
      <div class="fh-grid">
        <label class="fh-label">
          Brand
          <select
            class="sl-select-native"
            value={selectedBrand.value}
            onChange={e => {
              const brand = (e.target as HTMLSelectElement).value;
              if (!brand) {
                selectedPumpId.value = null;
                return;
              }
              const models = getPumpsByBrand(brand);
              selectedPumpId.value = models.length > 0 ? models[0].id : null;
            }}
          >
            <option value="">— select brand —</option>
            {PUMP_BRANDS.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </label>

        <label class="fh-label">
          Model
          <select
            class="sl-select-native"
            value={selId.value ?? ''}
            disabled={!selectedBrand.value || undefined}
            onChange={e => {
              const val = (e.target as HTMLSelectElement).value;
              selectedPumpId.value = val || null;
            }}
          >
            <option value="">— select model —</option>
            {modelsForBrand.value.map(p => (
              <option key={p.id} value={p.id}>{p.model}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
