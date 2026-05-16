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
  // ── Grundfos Alpha 15-58 ─────────────────────────────────────────────────
  // Max head 5.8 m / 19 ft, max flow ~14 GPM. PP curves follow the
  // proportional-pressure control line (H = H₀ + slope × Q) until the
  // pump's physical max-speed curve is reached, then fall with the max curve.
  {
    id: 'grundfos_alpha1558_max',
    brand: 'Grundfos',
    model: 'Alpha 15-58 (Max Speed)',
    curve: [
      { gpm: 0,   headFt: 19.0 },
      { gpm: 2,   headFt: 18.5 },
      { gpm: 4,   headFt: 17.0 },
      { gpm: 6,   headFt: 15.0 },
      { gpm: 8,   headFt: 12.0 },
      { gpm: 10,  headFt: 8.5  },
      { gpm: 12,  headFt: 4.5  },
      { gpm: 14,  headFt: 0    },
    ],
  },
  {
    id: 'grundfos_alpha1558_pp3',
    brand: 'Grundfos',
    model: 'Alpha 15-58 (PP3)',
    // PP line H = 8.0 + 1.0·Q, meets max-speed curve at ≈ (6.5, 14 ft)
    curve: [
      { gpm: 0,   headFt: 8.0  },
      { gpm: 3.5, headFt: 11.5 },
      { gpm: 6.5, headFt: 14.0 }, // ← kink: PP line meets max-speed curve
      { gpm: 8,   headFt: 12.0 },
      { gpm: 10,  headFt: 8.5  },
      { gpm: 12,  headFt: 4.5  },
      { gpm: 14,  headFt: 0    },
    ],
  },
  {
    id: 'grundfos_alpha1558_pp2',
    brand: 'Grundfos',
    model: 'Alpha 15-58 (PP2)',
    // PP line H = 5.5 + 0.60·Q, meets max-speed curve at ≈ (9.0, 10.5 ft)
    curve: [
      { gpm: 0,   headFt: 5.5  },
      { gpm: 3,   headFt: 7.3  },
      { gpm: 6,   headFt: 9.1  },
      { gpm: 9,   headFt: 10.5 }, // ← kink
      { gpm: 10,  headFt: 8.5  },
      { gpm: 12,  headFt: 4.5  },
      { gpm: 14,  headFt: 0    },
    ],
  },
  {
    id: 'grundfos_alpha1558_pp1',
    brand: 'Grundfos',
    model: 'Alpha 15-58 (PP1)',
    // PP line H = 3.0 + 0.45·Q, meets max-speed curve at ≈ (10.5, 7.5 ft)
    curve: [
      { gpm: 0,   headFt: 3.0  },
      { gpm: 3.5, headFt: 4.5  },
      { gpm: 7,   headFt: 6.0  },
      { gpm: 10.5,headFt: 7.5  }, // ← kink
      { gpm: 12,  headFt: 4.5  },
      { gpm: 14,  headFt: 0    },
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
