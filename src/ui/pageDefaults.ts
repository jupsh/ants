/**
 * Default settings of the pages, shared with scripts/precompute.ts so the
 * precomputed results are exactly what a page would request on opening.
 */
export const E1_DEFAULTS = { ants: 300, seed: 1 };

export const E2_DEFAULTS = { scouts: 150, seed: 1 };
export const E2_CONDITIONS = [
  { id: 'two', label: 'Two 0.7 µL drops (Mailleux 2009)' },
  { id: 'd1', label: '3 µL drop, 1 day starved (1999)' },
  { id: 'd4', label: '3 µL drop, 4 days starved (1999)' },
  { id: 'd8', label: '3 µL drop, 8 days starved (1999)' },
];

export const E6_DEFAULTS = { colonies: 200, seed: 6_000_000 };

/** Colony page (step 4, provisional): one Bles et al. colony. */
export const COLONY_DEFAULTS = { seed: 1, ants: 50, minutes: 90, foodMinute: 30, frameDt: 0.5 };
