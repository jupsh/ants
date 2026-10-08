import type { Track } from '../analysis/trajectory';
import { runE1, type E1Options } from '../experiments/e1Exploration';
import { runScout, type LasiusParams, type ScoutOptions, type ScoutResult } from '../experiments/e2Mailleux';
import { simulateColonies, type E6Metrics } from '../experiments/e6Bles';
import type { WalkParams } from '../models/walk';
import { runBles, type BlesParams } from '../reference/blesTEC';

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
  /** E6: colonies [first, first + count) of the Bles et al. reference model, observed and summarised. */
  blesColonies: (P: BlesParams, seed: number, first: number, count: number): E6Metrics[] => simulateColonies((rng) => runBles(P, rng), count, seed, first),
};

export type TaskName = keyof typeof TASKS;
export type TaskArgs<K extends TaskName> = Parameters<(typeof TASKS)[K]>;
export type TaskResult<K extends TaskName> = ReturnType<(typeof TASKS)[K]>;
