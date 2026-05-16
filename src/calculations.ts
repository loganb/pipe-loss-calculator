import { getWaterProps } from './data/waterProps';
import { PIPE_ID_IN, PIPE_ROUGHNESS_FT } from './data/pipeDimensions';
import { getEquivLength } from './data/fittings';
import type { LineItem, PipeMaterial, PipeSize, CalcResults } from './types';

const G_FPS2 = 32.174; // ft/s²
const GPM_TO_CFS = 1 / 448.831; // 1 gpm = 1/448.831 ft³/s

// Churchill (1977) friction factor — valid for all Re and ε/D (laminar + turbulent).
function churchillF(Re: number, relRoughness: number): number {
  if (Re < 1) return 64; // avoid divide-by-zero
  if (Re < 2300) return 64 / Re; // laminar
  const A = Math.pow(-2.457 * Math.log(Math.pow(7 / Re, 0.9) + 0.27 * relRoughness), 16);
  const B = Math.pow(37530 / Re, 16);
  return 8 * Math.pow(Math.pow(8 / Re, 12) + 1 / Math.pow(A + B, 1.5), 1 / 12);
}

interface SegmentLoss {
  headLossFt: number;
  equivLengthFt: number;
  velocityFps: number;
}

function pipeSegmentLoss(
  flowGpm: number,
  material: PipeMaterial,
  size: PipeSize,
  lengthFt: number,
  avgTempF: number,
): SegmentLoss {
  const id_in = PIPE_ID_IN[material][size];
  if (!id_in) return { headLossFt: 0, equivLengthFt: lengthFt, velocityFps: 0 };

  const id_ft = id_in / 12;
  const area_ft2 = Math.PI * Math.pow(id_ft / 2, 2);
  const vel_fps = (flowGpm * GPM_TO_CFS) / area_ft2;

  const { dynVisc, density } = getWaterProps(avgTempF);
  const kinVisc = dynVisc / density; // ft²/s
  const Re = (vel_fps * id_ft) / kinVisc;
  const relRough = PIPE_ROUGHNESS_FT[material] / id_ft;
  const f = churchillF(Re, relRough);

  const headLossFt = f * (lengthFt / id_ft) * Math.pow(vel_fps, 2) / (2 * G_FPS2);
  return { headLossFt, equivLengthFt: lengthFt, velocityFps: vel_fps };
}

function fittingSegmentLoss(
  flowGpm: number,
  material: PipeMaterial,
  size: PipeSize,
  fittingType: import('./types').FittingType,
  quantity: number,
  avgTempF: number,
): SegmentLoss {
  const equivLengthFt = getEquivLength(fittingType, size) * quantity;
  return pipeSegmentLoss(flowGpm, material, size, equivLengthFt, avgTempF);
}

export function calculate(
  lineItems: LineItem[],
  flowGpm: number,
  supplyTempF: number,
  returnTempF: number,
): CalcResults {
  if (flowGpm <= 0) {
    return { totalEquivLengthFt: 0, headLossFt: 0, pressurePsi: 0, heatBtuHr: 0, velocityFps: 0, valid: false, error: 'Flow rate must be > 0' };
  }
  if (supplyTempF <= returnTempF) {
    return { totalEquivLengthFt: 0, headLossFt: 0, pressurePsi: 0, heatBtuHr: 0, velocityFps: 0, valid: false, error: 'Supply temp must be > return temp' };
  }

  const avgTempF = (supplyTempF + returnTempF) / 2;
  const { density, cp } = getWaterProps(avgTempF);
  const deltaTF = supplyTempF - returnTempF;

  // Q = 8.01 × D × cp × GPM × ΔT  (Idronics Formula 5-2)
  const heatBtuHr = 8.01 * density * cp * flowGpm * deltaTF;

  let totalHeadLossFt = 0;
  let totalEquivLengthFt = 0;
  let maxVelocityFps = 0;

  // Track the last seen pipe material/size to use as context for fittings that
  // appear before any pipe segment in the list.
  let lastMaterial: PipeMaterial = 'copper_m';
  let lastSize: PipeSize = '3/4';

  for (const item of lineItems) {
    if (item.kind === 'pipe') {
      lastMaterial = item.material;
      lastSize = item.size;
      const lengthFt = item.length;
      const seg = pipeSegmentLoss(flowGpm, item.material, item.size, lengthFt, avgTempF);
      totalHeadLossFt += seg.headLossFt;
      totalEquivLengthFt += seg.equivLengthFt;
      if (seg.velocityFps > maxVelocityFps) maxVelocityFps = seg.velocityFps;
    } else {
      const seg = fittingSegmentLoss(flowGpm, lastMaterial, item.size, item.fittingType, item.quantity, avgTempF);
      totalHeadLossFt += seg.headLossFt;
      totalEquivLengthFt += seg.equivLengthFt;
    }
  }

  // Head → pressure: ΔP (psi) = HL × D / 144
  const pressurePsi = totalHeadLossFt * density / 144;

  return {
    totalEquivLengthFt,
    headLossFt: totalHeadLossFt,
    pressurePsi,
    heatBtuHr,
    velocityFps: maxVelocityFps,
    valid: true,
  };
}
