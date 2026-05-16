import { signal, computed } from '@preact/signals';
import type { UnitSystem, PressureUnit, LineItem, PipeMaterial, PipeSize, FittingType } from './types';
import { calculate } from './calculations';
import { flowToGpm, tempToF, lengthToFt } from './units';

// ── Persistence helper ────────────────────────────────────────────────────

function savedSignal<T>(key: string, defaultVal: T) {
  const stored = localStorage.getItem(key);
  const init = stored !== null ? (JSON.parse(stored) as T) : defaultVal;
  const sig = signal<T>(init);
  (sig as any).subscribe((v: T) => localStorage.setItem(key, JSON.stringify(v)));
  return sig;
}

// ── Unit preferences ──────────────────────────────────────────────────────

export const unitSystem    = savedSignal<UnitSystem>('unitSystem', 'imperial');
export const pressureUnit  = savedSignal<PressureUnit>('pressureUnit', 'ft_head');

// ── Flow & temperature inputs ─────────────────────────────────────────────

export const flowRateDisplay   = savedSignal<number>('flowRate', 5);
export const supplyTempDisplay = savedSignal<number>('supplyTemp', 160);
export const returnTempDisplay = savedSignal<number>('returnTemp', 140);

// ── Circuit line items ────────────────────────────────────────────────────

export const lineItems = savedSignal<LineItem[]>('lineItems', []);

// Last-used material/size — new rows default to these so repeated entries are fast.
export const lastMaterial = savedSignal<PipeMaterial>('lastMaterial', 'copper_m');
export const lastSize     = savedSignal<PipeSize>('lastSize', '3/4');

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function addPipe() {
  lineItems.value = [
    ...lineItems.value,
    { id: uid(), kind: 'pipe', material: lastMaterial.value, size: lastSize.value, length: 10 },
  ];
}

export function addFitting() {
  lineItems.value = [
    ...lineItems.value,
    { id: uid(), kind: 'fitting', fittingType: 'elbow_90', size: lastSize.value, quantity: 1 },
  ];
}

// Keep lastMaterial/lastSize in sync whenever an item's material or size changes.
export function updateItem(id: string, patch: Partial<LineItem>) {
  lineItems.value = lineItems.value.map(item => {
    if (item.id !== id) return item;
    const updated = { ...item, ...patch } as LineItem;
    if (updated.kind === 'pipe' && 'material' in patch) lastMaterial.value = updated.material;
    if ('size' in patch) lastSize.value = updated.size;
    return updated;
  });
}

export function removeItem(id: string) {
  lineItems.value = lineItems.value.filter(item => item.id !== id);
}

export function moveItem(id: string, direction: 'up' | 'down') {
  const items = [...lineItems.value];
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return;
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= items.length) return;
  [items[idx], items[swapIdx]] = [items[swapIdx], items[idx]];
  lineItems.value = items;
}

// ── Computed results ───────────────────────────────────────────────────────

export const results = computed(() => {
  const sys = unitSystem.value;
  const flowGpm  = flowToGpm(flowRateDisplay.value, sys);
  const supplyF  = tempToF(supplyTempDisplay.value, sys);
  const returnF  = tempToF(returnTempDisplay.value, sys);

  const itemsInFt: LineItem[] = lineItems.value.map(item => {
    if (item.kind === 'pipe') {
      return { ...item, length: lengthToFt(item.length, sys) };
    }
    return item;
  });

  return calculate(itemsInFt, flowGpm, supplyF, returnF);
});
