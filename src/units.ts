import type { UnitSystem, PressureUnit } from './types';

// ── Unit conversion utilities ──────────────────────────────────────────────
// All internal calculations use imperial (ft, GPM, °F, BTU/hr, psi).
// These functions convert to/from display units.

export function tempToF(val: number, sys: UnitSystem): number {
  return sys === 'metric' ? (val * 9) / 5 + 32 : val;
}
export function tempFromF(valF: number, sys: UnitSystem): number {
  return sys === 'metric' ? ((valF - 32) * 5) / 9 : valF;
}
export function tempLabel(sys: UnitSystem): string {
  return sys === 'metric' ? '°C' : '°F';
}
export function tempStep(sys: UnitSystem): number {
  return sys === 'metric' ? 0.5 : 1;
}

export function flowToGpm(val: number, sys: UnitSystem): number {
  return sys === 'metric' ? val / 227.124 : val; // L/hr → GPM
}
export function flowFromGpm(gpm: number, sys: UnitSystem): number {
  return sys === 'metric' ? gpm * 227.124 : gpm;
}
export function flowLabel(sys: UnitSystem): string {
  return sys === 'metric' ? 'L/hr' : 'GPM';
}

export function lengthToFt(val: number, sys: UnitSystem): number {
  return sys === 'metric' ? val * 3.28084 : val; // m → ft
}
export function lengthFromFt(ft: number, sys: UnitSystem): number {
  return sys === 'metric' ? ft / 3.28084 : ft;
}
export function lengthLabel(sys: UnitSystem): string {
  return sys === 'metric' ? 'm' : 'ft';
}

export function equivLengthLabel(sys: UnitSystem): string {
  return sys === 'metric' ? 'm' : 'ft';
}

export function formatPressure(
  headLossFt: number,
  pressurePsi: number,
  unit: PressureUnit,
  sys: UnitSystem,
): string {
  if (unit === 'ft_head') {
    if (sys === 'metric') {
      const kpa = headLossFt * 0.298907; // ft head of water → kPa
      return `${kpa.toFixed(1)} kPa`;
    }
    return `${headLossFt.toFixed(2)} ft`;
  }
  if (unit === 'psig') return `${pressurePsi.toFixed(2)} psi`;
  // kpa
  const kpa = pressurePsi * 6.89476;
  return `${kpa.toFixed(1)} kPa`;
}

export function pressureUnitLabel(unit: PressureUnit, sys: UnitSystem): string {
  if (unit === 'ft_head') return sys === 'metric' ? 'kPa' : 'ft head';
  if (unit === 'psig') return 'psi';
  return 'kPa';
}

export function formatHeat(btuHr: number, sys: UnitSystem): string {
  if (sys === 'metric') {
    const kw = btuHr * 0.000293071;
    return `${kw.toFixed(2)} kW`;
  }
  return `${Math.round(btuHr).toLocaleString()} BTU/hr`;
}

export function formatVelocity(fps: number, sys: UnitSystem): string {
  if (sys === 'metric') return `${(fps * 0.3048).toFixed(2)} m/s`;
  return `${fps.toFixed(2)} ft/s`;
}

export function formatEquivLength(ft: number, sys: UnitSystem): string {
  if (sys === 'metric') return `${(ft / 3.28084).toFixed(1)} m`;
  return `${ft.toFixed(1)} ft`;
}

export function formatHeadLoss(ft: number, sys: UnitSystem): string {
  if (sys === 'metric') return `${(ft * 0.3048).toFixed(2)} m`;
  return `${ft.toFixed(2)} ft`;
}
