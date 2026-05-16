import type { FittingType, PipeSize } from '../types';

// Equivalent lengths in feet for copper tubing.
// 3/4" values are anchored to Idronics 12 Fig. 5-13.
// Other sizes scaled by (D_new / D_3/4)^1.1 and rounded to match standard tables.
// Black iron and PEX use the same table — equivalent lengths are primarily geometry-driven
// and any material correction is negligible for HVAC design purposes.
export const EQUIV_LENGTH_FT: Record<FittingType, Partial<Record<PipeSize, number>>> = {
  elbow_90: {
    '1/2':   1.2,
    '3/4':   2.0,
    '1':     2.5,
    '1-1/4': 3.5,
    '1-1/2': 4.0,
    '2':     5.5,
    '2-1/2': 6.5,
    '3':     8.0,
  },
  elbow_45: {
    '1/2':   0.7,
    '3/4':   1.0,
    '1':     1.3,
    '1-1/4': 1.8,
    '1-1/2': 2.1,
    '2':     2.8,
    '2-1/2': 3.3,
    '3':     4.0,
  },
  tee_run: {
    '1/2':   0.3,
    '3/4':   0.4,
    '1':     0.5,
    '1-1/4': 0.7,
    '1-1/2': 0.8,
    '2':     1.0,
    '2-1/2': 1.2,
    '3':     1.5,
  },
  tee_branch: {
    '1/2':   1.8,
    '3/4':   3.0,
    '1':     3.7,
    '1-1/4': 5.2,
    '1-1/2': 6.0,
    '2':     7.7,
    '2-1/2': 9.2,
    '3':    11.0,
  },
  ball_valve: {
    '1/2':   1.3,
    '3/4':   2.2,
    '1':     2.7,
    '1-1/4': 3.8,
    '1-1/2': 4.4,
    '2':     5.7,
    '2-1/2': 6.7,
    '3':     8.2,
  },
  gate_valve: {
    '1/2':   0.3,
    '3/4':   0.5,
    '1':     0.6,
    '1-1/4': 0.9,
    '1-1/2': 1.0,
    '2':     1.3,
    '2-1/2': 1.6,
    '3':     2.0,
  },
  globe_valve: {
    '1/2':  14.0,
    '3/4':  20.0,
    '1':    28.0,
    '1-1/4': 38.0,
    '1-1/2': 42.0,
    '2':    57.0,
    '2-1/2': 67.0,
    '3':    83.0,
  },
  swing_check: {
    '1/2':   2.0,
    '3/4':   3.0,
    '1':     4.0,
    '1-1/4': 5.5,
    '1-1/2': 6.5,
    '2':     8.0,
    '2-1/2': 9.5,
    '3':    11.5,
  },
  spring_check: {
    '1/2':   4.0,
    '3/4':   6.0,
    '1':     7.5,
    '1-1/4': 10.0,
    '1-1/2': 12.0,
    '2':    15.0,
    '2-1/2': 18.0,
    '3':    22.0,
  },
  reducer: {
    '1/2':   0.2,
    '3/4':   0.4,
    '1':     0.5,
    '1-1/4': 0.6,
    '1-1/2': 0.7,
    '2':     0.9,
    '2-1/2': 1.1,
    '3':     1.3,
  },
};

export const FITTING_LABELS: Record<FittingType, string> = {
  elbow_90:    '90° Elbow',
  elbow_45:    '45° Elbow',
  tee_run:     'Tee (straight run)',
  tee_branch:  'Tee (branch)',
  ball_valve:  'Ball Valve',
  gate_valve:  'Gate Valve',
  globe_valve: 'Globe Valve',
  swing_check: 'Swing Check Valve',
  spring_check:'Spring Check Valve',
  reducer:     'Reducer / Coupling',
};

export const ALL_FITTING_TYPES: FittingType[] = Object.keys(FITTING_LABELS) as FittingType[];

export function getEquivLength(fittingType: FittingType, size: PipeSize): number {
  return EQUIV_LENGTH_FT[fittingType][size] ?? 0;
}
