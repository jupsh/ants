import e1fit from '../../../data/fits/e1-walk.json';
import e2fit from '../../../data/fits/e2-drinking.json';
import { applyFit, derived, estimated, fitted, measured, resolve } from '../core/param';
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

/**
 * The adopted E2 fit (data/fits/e2-drinking.json). Variant fits written by
 * scripts/fitE2.ts list their free parameters as "group.key"; older fits
 * list only the fitted forager values.
 */
interface E2Fit {
  variant?: string;
  free?: Record<string, number>;
  forager?: Record<string, number>;
  phys?: Record<string, number>;
  pipetteAccessible?: number;
  observer?: { volumeSd?: number };
}
const E2FIT = e2fit as E2Fit;
const e2Free = (group: string) => (E2FIT.free ? Object.keys(E2FIT.free).filter((k) => k.startsWith(`${group}.`)).map((k) => k.slice(group.length + 1)) : undefined);
const E2_FIT_LABEL = `E2 fit${E2FIT.variant ? ` (variant ${E2FIT.variant})` : ''}, data/fits/e2-drinking.json`;

const LASIUS_FORAGER_BASE = {
  desiredFed: fitted(0.65, 'µL', ['mailleux1999', 'mailleux2009'], 'Median desired volume of a recently fed forager.', { ...MAILLEUX, fit: 'E2 (scripts/fitE2.ts) on 1-, 4-, 8-day starvation drinking times and trail-laying proportions', uncertainty: { kind: 'to be estimated by profile likelihood' } }),
  desiredHungry: fitted(1.06, 'µL', ['mailleux1999', 'mailleux2009'], 'Median desired volume of a strongly starved forager (Vc ≈ 1 µL after 4 days).', { ...MAILLEUX, fit: 'E2' }),
  hungerScale: estimated(0.3, '', 'Reserve deficit at which the desired volume saturates; tied to the starvation→reserve mapping (reserveDays).'),
  desiredSd: fitted(0.4, 'log units', 'mailleux2005', 'Between-individual variation of desired volume; the individual value is constant across trips.', { ...MAILLEUX, fit: 'E2' }),
  stopHazard: fitted(0.05, '1/s', 'mailleux2009', 'Maximum per-second probability of leaving the food once the desired volume is exceeded.', { ...MAILLEUX, fit: 'E2' }),
  stopEta: derived(4.3, '1/µL', ['mailleux2003', 'mailleux2009'], 'Sensitivity η of the response-threshold function S(V) = ηΔV/(1 + e^{−η(V − Vc)}) (Mailleux et al. 2003 eq. 2.1; docs/research/mailleux-rules.md).', MAILLEUX),
  stopPerVolume: estimated(0, '', 'Stopping rule: 0 = per-second hazard (M_a), 1 = per-µL response threshold (M_b). Chosen by the step-3 mechanism comparison.'),
  satiationOnTime: estimated(0, '', 'Satiation signal: 0 = volume ingested (M_a), 1 = drinking time in µL-equivalents (M_d, step 3b).'),
  nominalIntake: derived(0.0095, 'µL/s', ['mailleux2009'], 'Population mean intake rate (= phys.intakeRate); converts M_d’s drinking-time signal into µL-equivalents.', MAILLEUX),
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

const LASIUS_PHYS_BASE = {
  intakeRate: fitted(0.0095, 'µL/s', ['mailleux2009'], '0.47 µL ingested in 51 s at a 0.7 µL drop of 0.6 M sucrose; Mailleux et al. model uses 0.01 µL/s.', { ...MAILLEUX, transform: 'volume ÷ drinking time' }),
  intakeSd: estimated(0, 'log units', 'Between-worker SD of log intake rate; intake rate is an individual trait (Mailleux et al. 2009). Set by the step-3 fits.'),
  metabolic: derived(1.2e-3, 'mg/h/mg^0.75', 'gillooly2001', 'Resting ant metabolism ≈1 µL O2 h⁻¹ mg⁻¹ converted to sucrose equivalents.'),
  activeFactor: estimated(3, '×', 'Walking raises metabolic rate several-fold.'),
  cropAbsorption: estimated(0, '1/s', 'Crop → reserve transfer beyond the metabolic need, per s, times the reserve room (mg). Unsourced: set to 0 (STATUS 2026-10-09 amendment; replaces a hard-coded 0.001 /s); value to come from the literature on crop emptying before the E6 calibration, on which it bears (forager crop available for sharing).'),
  permeability: estimated(20, 'µg cm⁻² h⁻¹ mmHg⁻¹', 'Mid-range cuticular permeability of mesic ants (≈5–60).'),
  surfaceArea: estimated(16, 'mm²', 'Body surface of a ~2 mg worker (≈10·m^(2/3)).'),
  depositPerMm: estimated(1, 'units/mm', 'Normalisation of trail units: one gaster-contact millimetre deposits 1 unit.'),
  compassNoise: estimated(0.0005, 'rad²/mm', 'Small random PI heading error per mm walked.'),
};

export const LASIUS_FORAGER_DEF = applyFit(LASIUS_FORAGER_BASE, E2FIT.forager, { fit: E2_FIT_LABEL, free: e2Free('forager') });
export const LASIUS_PHYS_DEF = applyFit(LASIUS_PHYS_BASE, E2FIT.phys, { fit: E2_FIT_LABEL, free: e2Free('phys') });

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

/** Complete M1 parameter set (fitted values from data/fits already applied to the definitions). */
export const LASIUS_PARAMS = { walk: LASIUS_WALK, forager: LASIUS_FORAGER, phys: LASIUS_PHYS, morph: LASIUS_MORPH };
export const MAILLEUX_PIPETTE_ACCESSIBLE: number = E2FIT.pipetteAccessible ?? 0.75;
/** Mailleux apparatus and observer settings fitted with the E2 model (volume-estimate SD in µL). */
export const MAILLEUX_SETUP = { accessible: MAILLEUX_PIPETTE_ACCESSIBLE, volumeSd: E2FIT.observer?.volumeSd ?? 0 };

/**
 * Khuong et al. 2013 tracking error (E1 observer model A, step 5): white
 * Gaussian position error per 25 Hz sample, per incline (0, π/9, π/6, π/4,
 * π/3), along x and along the slope axis y. Derived with scripts/diagE1.ts:
 * the data's second-difference estimate while ants are nearly still, minus
 * the part that slow movement of noise-free simulated ants contributes to the
 * same estimator. The y error grows roughly as 1/cos θ (camera viewing a
 * tilted canvas).
 */
const KHUONG_TRACKING_META = { conditions: KHUONG.conditions, n: KHUONG.n, transform: 'σ² = σ²(2nd differences, speed < 3 mm/s) − σ²(same estimator on the noise-free model)', uncertainty: { sd: 0.006, kind: 'bootstrap SE over ants of the data estimate' } };
export const KHUONG_TRACKING_DEF = {
  sx: derived([0.149, 0.142, 0.141, 0.139, 0.133], 'mm', 'khuongTrajectories', 'Tracking-error SD along x, per incline.', KHUONG_TRACKING_META),
  sy: derived([0.167, 0.159, 0.187, 0.228, 0.357], 'mm', 'khuongTrajectories', 'Tracking-error SD along the slope axis y, per incline.', KHUONG_TRACKING_META),
};
/** Tracking-error SDs for Khuong incline k = 1…5. */
export const khuongTracking = (k: number): { sx: number; sy: number } => ({ sx: KHUONG_TRACKING_DEF.sx.v[k - 1], sy: KHUONG_TRACKING_DEF.sy.v[k - 1] });

/**
 * In-nest worker policy (step 4, bounded version, STATUS 2026-10-08):
 * PROVISIONAL placeholders for inspecting movement, contacts and food flow.
 * None is calibrated; none may be compared with E6 before the step-4
 * calibration (after the E1 walking decision).
 */
const PROVISIONAL = 'Provisional placeholder (step 4, not calibrated).';
export const LASIUS_NEST_DEF = {
  restToActive: estimated(1 / 120, '1/s', `${PROVISIONAL} Resting → walking.`),
  activeToRest: estimated(1 / 180, '1/s', `${PROVISIONAL} Walking → resting.`),
  giveFrac: estimated(0.1, '', `${PROVISIONAL} Crop fill above which an ant offers food.`),
  receiveReserve: estimated(0.8, '', `${PROVISIONAL} Reserve fraction below which an ant accepts food.`),
  shareEnd: estimated(1 / 60, '1/s', `${PROVISIONAL} Ending hazard of a sharing bout.`),
  stallTime: estimated(3, 's', `${PROVISIONAL} A bout ends after this long without flow.`),
  shareRate: estimated(2 / 120, 'µL/s', `${PROVISIONAL} Crop capacity per 120 s (Bles et al. TEC: 1 unit = 1 s of transfer, mean load 120 units).`),
  leaveRate: estimated(1 / 300, '1/s', `${PROVISIONAL} Rate at which a hungry ant with an empty crop leaves to forage.`),
  forageDriveSd: estimated(1, '', `${PROVISIONAL} SD of log individual foraging propensity.`),
  leaveGain: estimated(1.5, '1/s', `${PROVISIONAL} Steering gain towards the entrance while leaving, or returning after straying out.`),
};
export const LASIUS_NEST = resolve(LASIUS_NEST_DEF);
