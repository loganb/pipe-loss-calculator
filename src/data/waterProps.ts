// Water properties vs temperature.
// Sources: NIST / Engineering Toolbox / ASHRAE Fundamentals Handbook
//
// dynVisc: dynamic viscosity in lbm/(ft·s)  [= cP × 6.7197e-4]
// density: lbm/ft³
// cp: specific heat Btu/(lbm·°F)
//
// kinematic viscosity ν (ft²/s) = dynVisc / density
// Verified at 140°F: 3.135e-4 / 61.38 = 5.11e-6 ft²/s  (NIST: 5.12e-6 ✓)

interface WaterProps {
  tempF:   number;
  density: number;  // lbm/ft³
  dynVisc: number;  // lbm/(ft·s)
  cp:      number;  // Btu/(lbm·°F)
}

export const WATER_PROPS: WaterProps[] = [
  { tempF:  32, density: 62.42, dynVisc: 1.204e-3, cp: 1.008 },
  { tempF:  40, density: 62.43, dynVisc: 1.053e-3, cp: 1.005 },
  { tempF:  50, density: 62.41, dynVisc: 8.781e-4, cp: 1.002 },
  { tempF:  60, density: 62.37, dynVisc: 7.511e-4, cp: 1.000 },
  { tempF:  70, density: 62.30, dynVisc: 6.572e-4, cp: 0.999 },
  { tempF:  80, density: 62.22, dynVisc: 5.785e-4, cp: 0.998 },
  { tempF:  90, density: 62.11, dynVisc: 5.140e-4, cp: 0.998 },
  { tempF: 100, density: 62.00, dynVisc: 4.590e-4, cp: 0.998 },
  { tempF: 110, density: 61.86, dynVisc: 4.121e-4, cp: 0.998 },
  { tempF: 120, density: 61.71, dynVisc: 3.717e-4, cp: 0.999 },
  { tempF: 130, density: 61.55, dynVisc: 3.371e-4, cp: 1.000 },
  { tempF: 140, density: 61.38, dynVisc: 3.135e-4, cp: 1.001 },
  { tempF: 150, density: 61.20, dynVisc: 2.872e-4, cp: 1.002 },
  { tempF: 160, density: 61.00, dynVisc: 2.643e-4, cp: 1.003 },
  { tempF: 170, density: 60.80, dynVisc: 2.447e-4, cp: 1.004 },
  { tempF: 180, density: 60.57, dynVisc: 2.271e-4, cp: 1.006 },
  { tempF: 190, density: 60.35, dynVisc: 2.119e-4, cp: 1.008 },
  { tempF: 200, density: 60.13, dynVisc: 1.982e-4, cp: 1.010 },
  { tempF: 210, density: 59.88, dynVisc: 1.864e-4, cp: 1.012 },
  { tempF: 212, density: 59.83, dynVisc: 1.894e-4, cp: 1.013 },
];

function lerp(a: WaterProps, b: WaterProps, t: number): WaterProps {
  return {
    tempF:   a.tempF   + (b.tempF   - a.tempF)   * t,
    density: a.density + (b.density - a.density) * t,
    dynVisc: a.dynVisc + (b.dynVisc - a.dynVisc) * t,
    cp:      a.cp      + (b.cp      - a.cp)      * t,
  };
}

export function getWaterProps(tempF: number): WaterProps {
  const clamped = Math.max(32, Math.min(212, tempF));
  const idx = WATER_PROPS.findIndex(p => p.tempF >= clamped);
  if (idx === 0) return WATER_PROPS[0];
  if (idx === -1) return WATER_PROPS[WATER_PROPS.length - 1];
  const lo = WATER_PROPS[idx - 1];
  const hi = WATER_PROPS[idx];
  const t = (clamped - lo.tempF) / (hi.tempF - lo.tempF);
  return lerp(lo, hi, t);
}
