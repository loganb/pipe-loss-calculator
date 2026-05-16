import type { PipeMaterial, PipeSize } from '../types';

// Inside diameters in inches.
// Copper M/L: ASTM B88. PEX: ASTM F876 (SDR-9). Black iron: Schedule 40 ASTM A53.
export const PIPE_ID_IN: Record<PipeMaterial, Partial<Record<PipeSize, number>>> = {
  copper_m: {
    '1/2':   0.569,
    '3/4':   0.811,
    '1':     1.055,
    '1-1/4': 1.291,
    '1-1/2': 1.527,
    '2':     1.985,
    '2-1/2': 2.465,
    '3':     2.981,
  },
  copper_l: {
    '1/2':   0.545,
    '3/4':   0.785,
    '1':     1.025,
    '1-1/4': 1.265,
    '1-1/2': 1.505,
    '2':     1.959,
    '2-1/2': 2.435,
    '3':     2.945,
  },
  pex: {
    '1/2':   0.475,
    '3/4':   0.671,
    '1':     0.862,
    '1-1/4': 1.076,
    '1-1/2': 1.276,
    '2':     1.554,
  },
  black_iron: {
    '1/2':   0.622,
    '3/4':   0.824,
    '1':     1.049,
    '1-1/4': 1.380,
    '1-1/2': 1.610,
    '2':     2.067,
    '2-1/2': 2.469,
    '3':     3.068,
  },
};

// Absolute roughness in feet.
export const PIPE_ROUGHNESS_FT: Record<PipeMaterial, number> = {
  copper_m:   5e-6,   // drawn tubing — hydraulically smooth
  copper_l:   5e-6,
  pex:        5e-6,   // smooth plastic
  black_iron: 1.5e-4, // commercial steel, ε ≈ 0.046 mm
};

export const MATERIAL_LABELS: Record<PipeMaterial, string> = {
  copper_m:   'Copper Type M',
  copper_l:   'Copper Type L',
  pex:        'PEX',
  black_iron: 'Black Iron (Sch 40)',
};

export const SIZE_LABELS: Record<PipeSize, string> = {
  '1/2':   '½"',
  '3/4':   '¾"',
  '1':     '1"',
  '1-1/4': '1¼"',
  '1-1/2': '1½"',
  '2':     '2"',
  '2-1/2': '2½"',
  '3':     '3"',
};

export const ALL_SIZES: PipeSize[] = ['1/2', '3/4', '1', '1-1/4', '1-1/2', '2', '2-1/2', '3'];
export const ALL_MATERIALS: PipeMaterial[] = ['copper_m', 'copper_l', 'pex', 'black_iron'];

export function availableSizes(material: PipeMaterial): PipeSize[] {
  return ALL_SIZES.filter(s => PIPE_ID_IN[material][s] !== undefined);
}
