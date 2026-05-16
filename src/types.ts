export type UnitSystem = 'imperial' | 'metric';
export type PressureUnit = 'ft_head' | 'psig' | 'kpa';
export type FluidType = 'water';

export type PipeMaterial = 'copper_m' | 'copper_l' | 'pex' | 'black_iron';
export type PipeSize = '1/2' | '3/4' | '1' | '1-1/4' | '1-1/2' | '2' | '2-1/2' | '3';

export type FittingType =
  | 'elbow_90'
  | 'elbow_45'
  | 'tee_run'
  | 'tee_branch'
  | 'ball_valve'
  | 'gate_valve'
  | 'globe_valve'
  | 'swing_check'
  | 'spring_check'
  | 'reducer';

export interface PipeSegment {
  id: string;
  kind: 'pipe';
  material: PipeMaterial;
  size: PipeSize;
  length: number; // ft (imperial) or m (metric) — stored in display units
}

export interface FittingSegment {
  id: string;
  kind: 'fitting';
  fittingType: FittingType;
  size: PipeSize;
  quantity: number;
}

export type LineItem = PipeSegment | FittingSegment;

export interface CalcResults {
  totalEquivLengthFt: number;
  headLossFt: number;
  pressurePsi: number;
  heatBtuHr: number;
  velocityFps: number; // at the dominant (first) pipe size
  valid: boolean;
  error?: string;
}
