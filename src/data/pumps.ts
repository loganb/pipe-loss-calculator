export interface PumpCurvePoint {
  gpm: number;
  headFt: number;
}

export interface PumpModel {
  id: string;
  brand: string;
  model: string;
  /** Curve points sorted ascending by gpm; first point must have gpm=0 */
  curve: PumpCurvePoint[];
}

export const PUMP_DB: PumpModel[] = [
  {
    id: 'taco_006',
    brand: 'Taco',
    model: '006-B4',
    curve: [
      { gpm: 0,  headFt: 18.0 },
      { gpm: 2,  headFt: 17.5 },
      { gpm: 4,  headFt: 16.5 },
      { gpm: 6,  headFt: 15.0 },
      { gpm: 8,  headFt: 13.0 },
      { gpm: 10, headFt: 10.5 },
      { gpm: 12, headFt: 7.5  },
      { gpm: 14, headFt: 4.0  },
      { gpm: 16, headFt: 0    },
    ],
  },
  {
    id: 'taco_007',
    brand: 'Taco',
    model: '007-F5',
    curve: [
      { gpm: 0,  headFt: 24.0 },
      { gpm: 2,  headFt: 23.5 },
      { gpm: 4,  headFt: 22.0 },
      { gpm: 6,  headFt: 19.5 },
      { gpm: 8,  headFt: 16.0 },
      { gpm: 10, headFt: 12.0 },
      { gpm: 12, headFt: 7.5  },
      { gpm: 14, headFt: 2.5  },
      { gpm: 15, headFt: 0    },
    ],
  },
  {
    id: 'taco_0010',
    brand: 'Taco',
    model: '0010-F4',
    curve: [
      { gpm: 0,  headFt: 35.0 },
      { gpm: 5,  headFt: 34.0 },
      { gpm: 10, headFt: 30.0 },
      { gpm: 15, headFt: 23.5 },
      { gpm: 20, headFt: 15.0 },
      { gpm: 25, headFt: 5.0  },
      { gpm: 27, headFt: 0    },
    ],
  },
  // ── Grundfos Alpha2 15-55F ───────────────────────────────────────────────
  // Per brochure: max 19 ft head, max 21 GPM. ECM variable-speed with 3
  // constant-pressure (CP) settings. Each CP curve is flat at the setpoint
  // head until the pump hits its physical max-speed curve, then falls with it.
  // Max-speed curve estimated from brochure chart:
  //   (0,19)→(4,18)→(8,16)→(12,13)→(15,10)→(18,6.5)→(20,3)→(21,0)
  // CP kinks (where flat line meets max-speed curve):
  //   12 ft → Q ≈ 13 GPM | 9 ft → Q ≈ 16 GPM | 6 ft → Q ≈ 18.3 GPM
  {
    id: 'grundfos_alpha2_max',
    brand: 'Grundfos',
    model: 'Alpha2 15-55F (Max Speed)',
    curve: [
      { gpm: 0,   headFt: 19.0 },
      { gpm: 2,   headFt: 18.5 },
      { gpm: 4,   headFt: 18.0 },
      { gpm: 8,   headFt: 16.0 },
      { gpm: 12,  headFt: 13.0 },
      { gpm: 15,  headFt: 10.0 },
      { gpm: 18,  headFt: 6.5  },
      { gpm: 20,  headFt: 3.0  },
      { gpm: 21,  headFt: 0    },
    ],
  },
  {
    id: 'grundfos_alpha2_cp12',
    brand: 'Grundfos',
    model: 'Alpha2 15-55F (CP 12 ft)',
    // Flat at 12 ft → kink at Q≈13 GPM → falls with max-speed curve
    curve: [
      { gpm: 0,   headFt: 12.0 },
      { gpm: 4,   headFt: 12.0 },
      { gpm: 8,   headFt: 12.0 },
      { gpm: 12,  headFt: 12.0 },
      { gpm: 13,  headFt: 12.0 }, // ← kink
      { gpm: 15,  headFt: 10.0 },
      { gpm: 18,  headFt: 6.5  },
      { gpm: 20,  headFt: 3.0  },
      { gpm: 21,  headFt: 0    },
    ],
  },
  {
    id: 'grundfos_alpha2_cp9',
    brand: 'Grundfos',
    model: 'Alpha2 15-55F (CP 9 ft)',
    // Flat at 9 ft → kink at Q≈16 GPM → falls with max-speed curve
    curve: [
      { gpm: 0,   headFt: 9.0  },
      { gpm: 4,   headFt: 9.0  },
      { gpm: 8,   headFt: 9.0  },
      { gpm: 12,  headFt: 9.0  },
      { gpm: 16,  headFt: 9.0  }, // ← kink
      { gpm: 18,  headFt: 6.5  },
      { gpm: 20,  headFt: 3.0  },
      { gpm: 21,  headFt: 0    },
    ],
  },
  {
    id: 'grundfos_alpha2_cp6',
    brand: 'Grundfos',
    model: 'Alpha2 15-55F (CP 6 ft)',
    // Flat at 6 ft → kink at Q≈18.3 GPM → falls with max-speed curve
    curve: [
      { gpm: 0,    headFt: 6.0  },
      { gpm: 4,    headFt: 6.0  },
      { gpm: 8,    headFt: 6.0  },
      { gpm: 12,   headFt: 6.0  },
      { gpm: 16,   headFt: 6.0  },
      { gpm: 18,   headFt: 6.0  },
      { gpm: 18.3, headFt: 6.0  }, // ← kink (duplicate to suppress Catmull-Rom bulge)
      { gpm: 19.2, headFt: 4.5  },
      { gpm: 20,   headFt: 3.0  },
      { gpm: 21,   headFt: 0    },
    ],
  },

  // ── Grundfos UP15-42F (three fixed speeds) ────────────────────────────────
  {
    id: 'grundfos_up15_spd3',
    brand: 'Grundfos',
    model: 'UP15-42F (Speed 3)',
    curve: [
      { gpm: 0, headFt: 22.0 },
      { gpm: 1, headFt: 21.5 },
      { gpm: 2, headFt: 20.5 },
      { gpm: 3, headFt: 19.0 },
      { gpm: 4, headFt: 17.0 },
      { gpm: 5, headFt: 14.5 },
      { gpm: 6, headFt: 11.5 },
      { gpm: 7, headFt: 8.0  },
      { gpm: 8, headFt: 4.0  },
      { gpm: 9, headFt: 0    },
    ],
  },
  {
    id: 'grundfos_up15_spd2',
    brand: 'Grundfos',
    model: 'UP15-42F (Speed 2)',
    curve: [
      { gpm: 0, headFt: 14.0 },
      { gpm: 1, headFt: 13.5 },
      { gpm: 2, headFt: 12.5 },
      { gpm: 3, headFt: 11.0 },
      { gpm: 4, headFt: 9.0  },
      { gpm: 5, headFt: 6.5  },
      { gpm: 6, headFt: 3.5  },
      { gpm: 7, headFt: 0    },
    ],
  },
  {
    id: 'grundfos_up15_spd1',
    brand: 'Grundfos',
    model: 'UP15-42F (Speed 1)',
    curve: [
      { gpm: 0, headFt: 7.5 },
      { gpm: 1, headFt: 7.0 },
      { gpm: 2, headFt: 6.0 },
      { gpm: 3, headFt: 4.5 },
      { gpm: 4, headFt: 2.5 },
      { gpm: 5, headFt: 0   },
    ],
  },
  {
    id: 'bg_nrf22',
    brand: 'Bell & Gossett',
    model: 'NRF-22',
    curve: [
      { gpm: 0,  headFt: 14.0 },
      { gpm: 2,  headFt: 13.5 },
      { gpm: 4,  headFt: 12.5 },
      { gpm: 6,  headFt: 10.5 },
      { gpm: 8,  headFt: 7.5  },
      { gpm: 10, headFt: 4.0  },
      { gpm: 12, headFt: 0    },
    ],
  },
  {
    id: 'bg_pl36',
    brand: 'Bell & Gossett',
    model: 'PL-36',
    curve: [
      { gpm: 0,  headFt: 22.0 },
      { gpm: 3,  headFt: 21.5 },
      { gpm: 6,  headFt: 20.0 },
      { gpm: 9,  headFt: 17.5 },
      { gpm: 12, headFt: 14.0 },
      { gpm: 15, headFt: 9.5  },
      { gpm: 18, headFt: 4.0  },
      { gpm: 20, headFt: 0    },
    ],
  },
  {
    id: 'armstrong_astro230',
    brand: 'Armstrong',
    model: 'Astro 230',
    curve: [
      { gpm: 0,  headFt: 30.0 },
      { gpm: 5,  headFt: 29.0 },
      { gpm: 10, headFt: 26.0 },
      { gpm: 15, headFt: 21.0 },
      { gpm: 20, headFt: 14.0 },
      { gpm: 24, headFt: 5.0  },
      { gpm: 26, headFt: 0    },
    ],
  },
];

export const PUMP_BRANDS: string[] = [...new Set(PUMP_DB.map(p => p.brand))];

export function getPumpById(id: string): PumpModel | undefined {
  return PUMP_DB.find(p => p.id === id);
}

export function getPumpsByBrand(brand: string): PumpModel[] {
  return PUMP_DB.filter(p => p.brand === brand);
}
