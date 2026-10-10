import type { Track } from '../analysis/trajectory';
import type { ObserverRule } from '../analysis/trophallaxis';
import { summarizeTrack, type Acc } from '../experiments/e1Compare';
import { runE1, type E1Options } from '../experiments/e1Exploration';
import { runScout, type LasiusParams, type ScoutOptions, type ScoutResult } from '../experiments/e2Mailleux';
import type { ColonyParams } from '../experiments/colonyBles';
import { runRecruiters1999, type M1999Options, type M1999Recruiter } from '../experiments/colonyMailleux1999';
import { simulateColonies, type E6Metrics } from '../experiments/e6Bles';
import type { WalkParams } from '../models/walk';
import { runBles, type BlesParams } from '../reference/blesTEC';
import { runSectored, type SectoredOptions, type SectorPools } from '../reference/sectoredWalker';

/**
 * Units of simulation work that can run on any worker. Each is a pure
 * function of its (structured-cloneable) arguments, and every individual in
 * it has its own RNG stream, so splitting a run into chunks and joining the
 * results in order gives bit-identical output to running it serially.
 */
export const TASKS = {
  /** E2: a batch of single-scout trips. */
  scouts: (P: LasiusParams, opts: ScoutOptions[]): ScoutResult[] => opts.map((o) => runScout(P, o)),
  /** E1: a contiguous range of ants (`firstAnt`, `ants`). */
  e1: (p: WalkParams, o: E1Options): Track[] => runE1(p, o),
  /** E1: the same ants, reduced in the worker to per-ant comparison summaries. */
  e1Summary: (p: WalkParams, o: E1Options): (Acc | null)[] => runE1(p, o).map(summarizeTrack),
  /** E1 reference walkers (Khuong / Bonavita): a contiguous range of ants. */
  sectored: (pools: SectorPools, o: SectoredOptions): Track[] => runSectored(pools, o),
  /** The same, reduced in the worker to per-ant comparison summaries. */
  sectoredSummary: (pools: SectorPools, o: SectoredOptions): (Acc | null)[] => runSectored(pools, o).map(summarizeTrack),
  /** E6: colonies [first, first + count) of the Bles et al. reference model, observed and summarised. */
  blesColonies: (P: BlesParams, seed: number, first: number, count: number, rule?: ObserverRule): E6Metrics[] => simulateColonies((rng) => runBles(P, rng), count, seed, first, rule),
  /** Mailleux 1999: recruiters [first, first + count) of one starvation day, observed and summarised. */
  m1999: (P: ColonyParams, o: M1999Options, first: number, count: number): M1999Recruiter[] => runRecruiters1999(P, o, first, count),
};

export type TaskName = keyof typeof TASKS;
export type TaskArgs<K extends TaskName> = Parameters<(typeof TASKS)[K]>;
export type TaskResult<K extends TaskName> = ReturnType<(typeof TASKS)[K]>;
