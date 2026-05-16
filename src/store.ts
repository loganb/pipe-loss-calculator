import { signal, computed } from '@preact/signals';
import type { UnitSystem, PressureUnit, LineItem, PipeMaterial, PipeSize, FittingType } from './types';
import { calculate } from './calculations';
import { flowToGpm, tempToF, lengthToFt } from './units';

// ── Persistent unit preferences ───────────────────────────────────────────

function savedSignal<T>(key: string, defaultVal: T) {
  const stored = localStorage.getItem(key);
  const init = stored !== null ? (JSON.parse(stored) as T) : defaultVal;
  const sig = signal<T>(init);
  // persist on change
  (sig as any).subscribe((v: T) => localStorage.setItem(key, JSON.stringify(v)));
  return sig;
}

export const unitSystem  = savedSignal<UnitSystem>('unitSystem', 'imperial');
export const pressureUnit = savedSignal<PressureUnit>('pressureUnit', 'ft_head');

// ── Flow & temperature inputs ─────────────────────────────────────────────
// Stored in display units; converted to imperial on demand.

export const flowRateDisplay  = signal<number>(5);    // GPM or L/hr
export const supplyTempDisplay = signal<number>(160);  // °F or °C
export const returnTempDisplay = signal<number>(140);  // °F or °C

// ── Circuit line items ────────────────────────────────────────────────────

export const lineItems = signal<LineItem[]>([]);

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function addPipe(material: PipeMaterial = 'copper_m', size: PipeSize = '3/4') {
  lineItems.value = [
    ...lineItems.value,
    { id: uid(), kind: 'pipe', material, size, length: 10 },
  ];
}

export function addFitting(fittingType: FittingType = 'elbow_90', size: PipeSize = '3/4') {
  lineItems.value = [
    ...lineItems.value,
    { id: uid(), kind: 'fitting', fittingType, size, quantity: 1 },
  ];
}

export function updateItem(id: string, patch: Partial<LineItem>) {
  lineItems.value = lineItems.value.map(item =>
    item.id === id ? ({ ...item, ...patch } as LineItem) : item,
  );
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

  // Convert pipe lengths from display units to feet for the engine
  const itemsInFt: LineItem[] = lineItems.value.map(item => {
    if (item.kind === 'pipe') {
      return { ...item, length: lengthToFt(item.length, sys) };
    }
    return item;
  });

  return calculate(itemsInFt, flowGpm, supplyF, returnF);
});
