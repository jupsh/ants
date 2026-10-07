import e1fit from '../../../data/fits/e1-walk.json';
import e2fit from '../../../data/fits/e2-drinking.json';
import { derived, estimated, fitted, measured, resolve } from '../core/param';
import { walkParams, type WalkParams } from '../models/walk';

/**
 * Lasius niger parameter set for milestone M1, with provenance v2.
 * Values marked `fitted` are produced by scripts under scripts/ and stored in
 * data/fits/; the starting values here are used only before a fit exists.
 */
const KHUONG = { conditions: '26 °C, 50 % RH, isolated workers on a 0.5 × 0.5 m canvas, 5 inclines', n: '345 trajectories (69 per incline), 3 colonies', fit: 'E1 (scripts/fitE1.ts): pattern-oriented fit of trajectory statistics on inclines 0, π/6, π/3', validatedBy: 'E1 withheld inclines π/9, π/4' };

const walk = walkParams(e1fit.params as Partial<WalkParams>);
export const LASIUS_WALK_DEF = Object.fromEntries(
  Object.entries(walk).map(([k, v]) => [k, fitted(v, '', 'khuongTrajectories', 'Fitted walking-model parameter; see src/sim/models/walk.ts for definition and units.', KHUONG)]),
) as { [K in keyof WalkParams]: ReturnType<typeof fitted<number>> };

const MAILLEUX = { conditions: '22 ± 3 °C, colonies of 1000–2000 workers, 0.6 M sucrose, nest–bridge–6 × 6 cm area' };

export const LASIUS_FORAGER_DEF = {
  desiredFed: fitted(0.65, 'µL', ['mailleux1999', 'mailleux2009'], 'Median desired volume of a recently fed forager.', { ...MAILLEUX, fit: 'E2 (scripts/fitE2.ts) on 1-, 4-, 8-day starvation drinking times and trail-laying proportions', uncertainty: { kind: 'to be estimated by profile likelihood' } }),
  desiredHungry: fitted(1.06, 'µL', ['mailleux1999', 'mailleux2009'], 'Median desired volume of a strongly starved forager (Vc ≈ 1 µL after 4 days).', { ...MAILLEUX, fit: 'E2' }),
  hungerScale: estimated(0.3, '', 'Reserve deficit at which the desired volume saturates; tied to the starvation→reserve mapping (reserveDays).'),
  desiredSd: fitted(0.4, 'log units', 'mailleux2005', 'Between-individual variation of desired volume; the individual value is constant across trips.', { ...MAILLEUX, fit: 'E2' }),
  stopHazard: fitted(0.05, '1/s', 'mailleux2009', 'Maximum per-second probability of leaving the food once the desired volume is exceeded.', { ...MAILLEUX, fit: 'E2' }),
  stopEta: derived(4.3, '1/µL', 'mailleux2009', 'Sensitivity η of the response-threshold function in Mailleux et al.’s model (formula transcribed from the PDF text layer; interpretation as logistic in η(V − Vd)).', MAILLEUX),
  emptyPatience: estimated(3, 's', 'Time an ant keeps probing an exhausted drop before leaving.'),
  neverLayFraction: measured(0.12, '', ['mailleux2005', 'mailleux2009'], '14 % of foragers never lay trail (2005); 10–20 % in 2009.', { ...MAILLEUX, uncertainty: { range: [0.1, 0.2] } }),
  unsatisfiedLayProb: fitted(0.3, '', 'mailleux2009', 'Probability that a scout leaving an exhausted drop before reaching its desired volume still lays trail. Needed because trail layers and non-layers drank the same volume at a 0.7 µL drop (0.49 vs 0.46 µL); identified from the 38 % drop-1 trail fraction.', { ...MAILLEUX, fit: 'E2' }),
  layIntensity: measured(0.13, 'fraction of time', ['mailleux1999', 'mailleux2009'], 'Gaster-contact fraction on the return trip: 0.11–0.14 (1999), 0.16 ± 0.07 then 0.11 ± 0.08 (2009).', { ...MAILLEUX, uncertainty: { sd: 0.02, kind: 'between studies' } }),
  layIntensitySd: measured(0.08, 'fraction of time', ['mailleux1999', 'mailleux2009'], 'Between-individual SD of gaster-contact fraction (0.07–0.12).', MAILLEUX),
  gasterBout: estimated(0.25, 's', 'Mean duration of one gaster contact (marks are brief dabs).'),
  arsMean: fitted(80, 's', 'mailleux2009', 'Mean area-restricted search time of unsatisfied ants around the first drop (between-drop time 134 s vs 58 s for satisfied ants).', { ...MAILLEUX, fit: 'E2' }),
  arsRunScale: estimated(0.4, '', 'Searching ants turn more (shorter runs) than exploring ones.'),
  homeGain: fitted(1.0, '1/s', 'mailleux1999', 'Steering gain towards the home vector; constrained by return times (110–156 s).', { ...MAILLEUX, fit: 'E2' }),
  homeRunScale: estimated(3, '', 'Homing ants walk straighter than exploring ones.'),
  compassBias: estimated(0.08, 'rad', 'Per-trip compass bias for an ant using path integration in the lab (no strong visual cues).'),
  loadSlowdown: fitted(1.0, '', 'mailleux1999', 'Return times rise with starvation (110 → 137 → 156 s) as ingested volume rises (≈0.65 → 0.9 µL).', { ...MAILLEUX, fit: 'E2 return times' }),
};

export const LASIUS_PHYS_DEF = {
  intakeRate: fitted(0.0095, 'µL/s', ['mailleux2009'], '0.47 µL ingested in 51 s at a 0.7 µL drop of 0.6 M sucrose; Mailleux et al. model uses 0.01 µL/s.', { ...MAILLEUX, transform: 'volume ÷ drinking time' }),
  metabolic: derived(1.2e-3, 'mg/h/mg^0.75', 'gillooly2001', 'Resting ant metabolism ≈1 µL O2 h⁻¹ mg⁻¹ converted to sucrose equivalents.'),
  activeFactor: estimated(3, '×', 'Walking raises metabolic rate several-fold.'),
  permeability: estimated(20, 'µg cm⁻² h⁻¹ mmHg⁻¹', 'Mid-range cuticular permeability of mesic ants (≈5–60).'),
  surfaceArea: estimated(16, 'mm²', 'Body surface of a ~2 mg worker (≈10·m^(2/3)).'),
  depositPerMm: estimated(1, 'units/mm', 'Normalisation of trail units: one gaster-contact millimetre deposits 1 unit.'),
  compassNoise: estimated(0.0005, 'rad²/mm', 'Small random PI heading error per mm walked.'),
};

export const LASIUS_MORPH_DEF = {
  len: measured(4.1, 'mm', 'khuong2016', '4.1 ± 0.14 mm.', { uncertainty: { sd: 0.14, kind: 'between workers' } }),
  mass: derived(2.0, 'mg', 'bles2022', 'A 0.1 mg tag was "< 5 % of the average mass of an adult worker" ⇒ ≥ 2 mg (weak constraint).', { uncertainty: { range: [1.2, 2.5] } }),
  cropCapacity: derived(2.0, 'µL', ['mailleux2000', 'bles2022'], '3 and 6 µL drops exceed the crop (Mailleux 2000); workers carry > 1 mg (Bles 2022).', { uncertainty: { range: [1.2, 3] } }),
  antennaReach: estimated(2.6, 'mm', 'Antenna tips ≈ 0.6 body lengths from the body centre.'),
  reserveDays: estimated(14, 'd', 'Days a fed worker survives without food at 22 °C; maps starvation duration to reserve level.'),
};

export const LASIUS_WALK = resolve(LASIUS_WALK_DEF);
export const LASIUS_FORAGER = resolve(LASIUS_FORAGER_DEF);
export const LASIUS_PHYS = resolve(LASIUS_PHYS_DEF);
export const LASIUS_MORPH = resolve(LASIUS_MORPH_DEF);

/** Complete M1 parameter set (fitted values merged from data/fits where present). */
export const LASIUS_PARAMS = {
  walk: LASIUS_WALK,
  forager: { ...LASIUS_FORAGER, ...((e2fit as { forager?: Partial<typeof LASIUS_FORAGER> }).forager ?? {}) },
  phys: LASIUS_PHYS,
  morph: LASIUS_MORPH,
};
export const MAILLEUX_PIPETTE_ACCESSIBLE: number = (e2fit as { pipetteAccessible?: number }).pipetteAccessible ?? 0.75;
