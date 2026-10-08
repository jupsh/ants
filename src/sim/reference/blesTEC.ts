import { RNG } from '../core/rng';

/**
 * Reference model: the non-spatial trophallaxis models of Bles, Deneubourg,
 * Sueur & Nicolis (2022, Animals 12:2963), one-caste (OC) and two emergent
 * castes (TEC), ported from the authors' Simulations_Script.py (Zenodo
 * doi:10.5281/zenodo.6396637, CC BY 4.0) via the line-for-line Python port in
 * docs/research/scripts/bles/bles_port.py. Specification and every quirk:
 * docs/research/bles-tec-spec.md.
 *
 * This is *their* model, used as a baseline for E6. It is not part of our
 * mechanistic ant model and does not use the perception boundary.
 *
 * Units: 1 tick = 1 s; crop in "units" (1 unit = 1 s of feeding or of
 * transfer). t = 0 is food introduction.
 *
 * `compat: true` reproduces the authors' code exactly, including:
 *   - nothing happens on the first tick;
 *   - the forager-donor pair-ending branch is dead, so F-donor pairs end at
 *     ≈ 1/260 s⁻¹ and NF-donor pairs at ≈ 2/260 s⁻¹;
 *   - when a stock NF gives to another stock NF, the receiver's acceptance
 *     uses the donor's crop;
 *   - an NF donor whose pair ends through the receiver's check (receiver NF)
 *     returns to "empty" even if food is left.
 * `compat: false` fixes these four.
 */

export type BlesDist = 'delta' | 'unif' | 'exp';

export interface BlesParams {
  /** Mean per-second give/receive propensities (Table 1, as probabilities). */
  thetaF: number;
  thetaW: number;
  upsF: number;
  upsW: number;
  dist: BlesDist;
  /** One caste: the same individual values before and after foraging. */
  oneCaste: boolean;
  /** Agents (the code uses 52). */
  n: number;
  /** Ticks (s). */
  T: number;
  /** Hill threshold k and exponent. */
  k: number;
  hill: number;
  /** Prob/s of leaving the food source (β). */
  beta: number;
  /** Per-member per-second pair-separation check (code: 1/260). */
  sep: number;
  /** Prob/s for a forager in the nest to go back to the source (α′). */
  alphaF: number;
  /** Shape of the power-function distribution of α_i(0) (numpy.random.power). */
  alphaShape: number;
  compat: boolean;
}

const BASE = { n: 52, T: 3600, k: 120, hill: 2, beta: 1 / 120, sep: 1 / 260, alphaF: 1 / 50, alphaShape: 1 / 30, compat: true };

/** Table 1 of the paper (fitted means as 1/x per second). */
export const BLES_TABLE1: Record<string, BlesParams> = {
  OC_delta: { ...BASE, thetaF: 1 / 11, thetaW: 1 / 11, upsF: 1 / 60, upsW: 1 / 60, dist: 'delta', oneCaste: true },
  OC_unif: { ...BASE, thetaF: 1 / 10, thetaW: 1 / 10, upsF: 1 / 50, upsW: 1 / 50, dist: 'unif', oneCaste: true },
  OC_exp: { ...BASE, thetaF: 1 / 6, thetaW: 1 / 6, upsF: 1 / 56, upsW: 1 / 56, dist: 'exp', oneCaste: true },
  TEC_delta: { ...BASE, thetaF: 1 / 10, thetaW: 1 / 33, upsF: 1 / 11, upsW: 1 / 38, dist: 'delta', oneCaste: false },
  TEC_unif: { ...BASE, thetaF: 1 / 11, thetaW: 1 / 32, upsF: 1 / 9, upsW: 1 / 28, dist: 'unif', oneCaste: false },
  TEC_exp: { ...BASE, thetaF: 1 / 9, thetaW: 1 / 23, upsF: 1 / 9, upsW: 1 / 27, dist: 'exp', oneCaste: false },
};

/** One trophallactic pair as it happened in the model (s since food). */
export interface Contact {
  donor: number;
  receiver: number;
  start: number;
  /** Tick at which the pair ended (T if still open at the end). */
  end: number;
  /** Units transferred. */
  amount: number;
}

export interface BlesRun {
  contacts: Contact[];
  /** Agents that reached the food source at least once (final status). */
  forager: boolean[];
}

// States, as in the authors' code.
const NAIVE = 10;
const SOURCE = 1;
const FORAGER = 2;
const STOCK = 8;
const NF_RECV = 5;
const F_RECV = 66;
const F_DONOR = 100;
const NF_DONOR = 110;

export type BlesActivity = 'nest' | 'source' | 'giving' | 'receiving';

/** Coarse activity of an agent state, for display. */
export function blesActivity(state: number): BlesActivity {
  if (state === SOURCE) return 'source';
  if (state === F_DONOR || state === NF_DONOR) return 'giving';
  if (state === NF_RECV || state === F_RECV) return 'receiving';
  return 'nest';
}

/** Read-only view of the model state after each tick (for recording runs). */
export interface BlesTickView {
  t: number;
  state: readonly number[];
  crop: Float64Array;
  partner: Int32Array;
  forager: readonly boolean[];
}

export function runBles(p: BlesParams, rng: RNG, onTick?: (v: BlesTickView) => void): BlesRun {
  const N = p.n;
  const draw = (mean: number): number[] =>
    Array.from({ length: N }, () => (p.dist === 'delta' ? mean : p.dist === 'unif' ? rng.range(0, 2 * mean) : -mean * Math.log(1 - rng.next())));
  const kn = p.k ** p.hill;
  const give = (q: number) => {
    const qn = Math.max(0, q) ** p.hill;
    return qn / (qn + kn);
  };
  const recv = (q: number) => kn / (Math.max(0, q) ** p.hill + kn);
  const leave = recv;

  let e = draw(p.thetaF);
  const ee = draw(p.thetaW);
  let eR = draw(p.upsF);
  const eeR = draw(p.upsW);
  const r = Array.from({ length: N }, () => rng.next() ** (1 / p.alphaShape));
  if (p.oneCaste) {
    e = ee;
    eR = eeR;
  }

  const pop = new Array<number>(N).fill(NAIVE);
  // The code reads the previous row, which is all zeros on the first tick.
  let prev = p.compat ? new Array<number>(N).fill(0) : pop.slice();
  const food = new Float64Array(N);
  const arrival = new Int32Array(N);
  const partner = new Int32Array(N);
  const forager = new Array<boolean>(N).fill(false);
  const contacts: Contact[] = [];
  const open = new Map<number, number>(); // receiver → contact index
  const order = Array.from({ length: N }, (_, i) => i);
  const checked = new Uint8Array(N);

  const shuffle = (a: number[]) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = rng.int(i + 1);
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  };
  const pool = (states: number[], exclude: number): number[] => {
    const out: number[] = [];
    for (const st of states) for (let k = 0; k < N; k++) if (pop[k] === st && k !== exclude) out.push(k);
    return shuffle(out);
  };
  const start = (d: number, rc: number, t: number) => {
    partner[d] = rc;
    partner[rc] = d;
    open.set(rc, contacts.length);
    contacts.push({ donor: d, receiver: rc, start: t, end: p.T, amount: 0 });
  };
  const end = (rc: number, t: number) => {
    const k = open.get(rc);
    if (k !== undefined) {
      contacts[k].end = t;
      open.delete(rc);
    }
  };
  const transfer = (d: number, rc: number) => {
    if (checked[rc] || checked[d]) return;
    food[rc] += 1;
    food[d] -= 1;
    checked[rc] = checked[d] = 1;
    contacts[open.get(rc)!].amount += 1;
  };
  /** A receiver tries to find a donor among `states` (leading empty donors skipped). */
  const tryReceive = (i: number, states: number[], selfState: number, pr: number, t: number) => {
    const pl = pool(states, i);
    let h = 0;
    while (h < pl.length && food[pl[h]] <= 0) h++;
    if (h >= pl.length) return;
    const d = pl[h];
    if (pop[d] === FORAGER && prev[d] === FORAGER && pr < e[d] * give(food[d])) {
      pop[d] = F_DONOR;
      pop[i] = selfState;
      start(d, i, t);
    } else if (pop[d] === STOCK && prev[d] === STOCK && pr < ee[d] * give(food[d])) {
      pop[d] = NF_DONOR;
      pop[i] = selfState;
      start(d, i, t);
    }
  };
  /** A donor offers to the first agent of the shuffled pool. */
  const tryGive = (i: number, donorState: number, pr: number, t: number) => {
    if (food[i] <= 0) return;
    const pl = pool([NAIVE, FORAGER, STOCK], i);
    if (!pl.length) return;
    const rc = pl[0];
    if (pop[rc] === NAIVE && prev[rc] === NAIVE && pr < eeR[rc] * recv(food[rc])) {
      pop[rc] = NF_RECV;
      pop[i] = donorState;
      start(i, rc, t);
    } else if (pop[rc] === FORAGER && prev[rc] === FORAGER && pr < eR[rc] * recv(food[rc])) {
      pop[rc] = F_RECV;
      pop[i] = donorState;
      start(i, rc, t);
    } else if (pop[rc] === STOCK && prev[rc] === STOCK) {
      // Code quirk: stock→stock acceptance uses the donor's crop.
      const q = p.compat && donorState === NF_DONOR ? food[i] : food[rc];
      if (pr < eeR[rc] * recv(q)) {
        pop[rc] = NF_RECV;
        pop[i] = donorState;
        start(i, rc, t);
      }
    }
  };
  const afterDonor = (d: number) => (food[d] > 0 ? STOCK : NAIVE);

  for (let t = 0; t < p.T; t++) {
    checked.fill(0);
    shuffle(order);
    for (const i of order) {
      const s = pop[i];
      const W = rng.next();
      const pr = rng.next();
      const j = partner[i];
      if (prev[i] !== s) continue;
      switch (s) {
        case NF_RECV:
        case F_RECV: {
          transfer(j, i);
          if (food[j] <= 0 || W <= p.sep) {
            const recvAfter = s === NF_RECV ? STOCK : FORAGER;
            if (pop[j] === F_DONOR) {
              pop[i] = recvAfter;
              pop[j] = FORAGER;
              end(i, t);
            } else if (pop[j] === NF_DONOR) {
              pop[i] = recvAfter;
              pop[j] = p.compat ? (s === NF_RECV ? NAIVE : STOCK) : afterDonor(j);
              end(i, t);
            }
          }
          break;
        }
        case NF_DONOR:
        case F_DONOR: {
          // In the authors' code the F-donor branch never runs.
          if (s === F_DONOR && p.compat) break;
          transfer(i, j);
          if (food[i] <= 0 || W <= p.sep) {
            if (pop[j] === NF_RECV || pop[j] === F_RECV) {
              const recvAfter = pop[j] === NF_RECV ? STOCK : FORAGER;
              pop[i] = s === F_DONOR ? FORAGER : p.compat ? STOCK : afterDonor(i);
              pop[j] = recvAfter;
              end(j, t);
            }
          }
          break;
        }
        case NAIVE: {
          const L = r[i] * leave(food[i]);
          const Rc = eeR[i] * recv(food[i]);
          if (W > 0 && W <= L) {
            pop[i] = SOURCE;
            arrival[i] = t;
          } else if (W > L && W <= L + Rc) tryReceive(i, [FORAGER, STOCK], NF_RECV, pr, t);
          break;
        }
        case FORAGER: {
          const G = e[i] * give(food[i]);
          const Rc = eR[i] * recv(food[i]);
          const L = p.alphaF * leave(food[i]);
          if (W > 0 && W <= G) tryGive(i, F_DONOR, pr, t);
          else if (W > G && W <= G + Rc) tryReceive(i, [FORAGER, STOCK], F_RECV, pr, t);
          else if (W > G + Rc && W < G + Rc + L) {
            pop[i] = SOURCE;
            arrival[i] = t;
          }
          break;
        }
        case SOURCE: {
          if (W > 0 && W <= p.beta) {
            pop[i] = FORAGER;
            food[i] += t - arrival[i];
          }
          forager[i] = true;
          break;
        }
        case STOCK: {
          const G = ee[i] * give(food[i]);
          const Rc = eeR[i] * recv(food[i]);
          const L = r[i] * leave(food[i]);
          if (W > 0 && W <= G) tryGive(i, NF_DONOR, pr, t);
          else if (W > G && W <= G + Rc) tryReceive(i, [FORAGER, STOCK], NF_RECV, pr, t);
          else if (W > G + Rc && W <= G + Rc + L) {
            pop[i] = SOURCE;
            arrival[i] = t;
          }
          break;
        }
      }
    }
    prev = pop.slice();
    onTick?.({ t, state: pop, crop: food, partner, forager });
  }
  return { contacts, forager };
}
