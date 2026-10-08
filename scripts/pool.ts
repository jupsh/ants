/**
 * Process pool for simulation scripts: one vite-node child per core (minus
 * one, fewer if memory is short), each running scripts/poolWorker.ts. Tasks
 * are pure (see
 * src/sim/parallel/tasks.ts), and results come back in submission order, so
 * pooled runs are bit-identical to serial ones.
 *
 *   const pool = await SimPool.create();
 *   const results = await pool.map('scouts', chunks.map((c) => [P, c]));
 *   pool.close();
 */
import { fork, type ChildProcess } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import type { Track } from '../src/sim/analysis/trajectory';
import type { E1Sample } from '../src/sim/experiments/e1Compare';
import type { E1Options } from '../src/sim/experiments/e1Exploration';
import type { ScoutOptions, ScoutResult, LasiusParams } from '../src/sim/experiments/e2Mailleux';
import type { E6Metrics } from '../src/sim/experiments/e6Bles';
import type { WalkParams } from '../src/sim/models/walk';
import type { BlesParams } from '../src/sim/reference/blesTEC';
import type { SectoredOptions, SectorPools } from '../src/sim/reference/sectoredWalker';
import type { TaskArgs, TaskName, TaskResult } from '../src/sim/parallel/tasks';

/** Memory per worker: measured RSS ≈ 270 MB during E1 fits, plus headroom. */
const WORKER_MB = 350;
/** Memory left for everything else. */
const RESERVE_MB = 1024;

/**
 * Default pool size: cores − 1, capped so the workers fit in available memory
 * (os.freemem() is MemAvailable on Linux), at least 1. A swapping pool is
 * slower than a smaller one; results do not depend on the size.
 */
export function defaultWorkers(): number {
  const cores = Math.max(1, os.availableParallelism() - 1);
  const availMb = os.freemem() / 2 ** 20;
  const fit = Math.max(1, Math.floor((availMb - RESERVE_MB) / WORKER_MB));
  if (fit < cores) console.error(`pool: ${fit} workers instead of ${cores} (${(availMb / 1024).toFixed(1)} GB available; SIM_WORKERS=n overrides)`);
  return Math.min(cores, fit);
}

interface Job {
  id: number;
  name: TaskName;
  args: unknown[];
  resolve: (v: unknown) => void;
  reject: (e: Error) => void;
}

export class SimPool {
  private queue: Job[] = [];
  private idle: ChildProcess[] = [];
  private busy = new Map<ChildProcess, Job>();
  private nextId = 0;

  private constructor(private readonly workers: ChildProcess[]) {}

  get size(): number {
    return this.workers.length;
  }

  /** Start `n` workers (default: `defaultWorkers()`; env SIM_WORKERS overrides). */
  static async create(n = Number(process.env.SIM_WORKERS ?? defaultWorkers())): Promise<SimPool> {
    const bin = path.resolve('node_modules/.bin/vite-node');
    const script = path.resolve('scripts/poolWorker.ts');
    const workers = Array.from({ length: n }, () => fork(bin, [script], { serialization: 'advanced', stdio: ['ignore', 'inherit', 'inherit', 'ipc'] }));
    const pool = new SimPool(workers);
    await Promise.all(workers.map((w) => new Promise<void>((res, rej) => {
      w.once('message', () => res());
      w.once('exit', (code) => rej(new Error(`pool worker exited (${code}) before starting`)));
    })));
    for (const w of workers) {
      w.on('message', (m: { id: number; result?: unknown; error?: string }) => pool.done(w, m));
      w.on('exit', (code) => {
        const job = pool.busy.get(w);
        if (job) job.reject(new Error(`pool worker exited (${code}) during ${job.name}`));
      });
      pool.idle.push(w);
    }
    return pool;
  }

  run<K extends TaskName>(name: K, ...args: TaskArgs<K>): Promise<TaskResult<K>> {
    return new Promise((resolve, reject) => {
      this.queue.push({ id: this.nextId++, name, args, resolve: resolve as (v: unknown) => void, reject });
      this.pump();
    });
  }

  /** Run one task per argument list; results in the same order. */
  map<K extends TaskName>(name: K, argLists: TaskArgs<K>[]): Promise<TaskResult<K>[]> {
    return Promise.all(argLists.map((a) => this.run(name, ...a)));
  }

  /** E2 scouts, chunked across the pool; results in input order. */
  async scouts(P: LasiusParams, opts: ScoutOptions[]): Promise<ScoutResult[]> {
    const size = Math.max(4, Math.ceil(opts.length / (2 * this.size)));
    const chunks: ScoutOptions[][] = [];
    for (let i = 0; i < opts.length; i += size) chunks.push(opts.slice(i, i + size));
    return (await this.map('scouts', chunks.map((c) => [P, c] as TaskArgs<'scouts'>))).flat();
  }

  /** E1 ants 0 … o.ants − 1 (from o.firstAnt), chunked across the pool; tracks in ant order. */
  async e1(p: WalkParams, o: E1Options): Promise<Track[]> {
    const first = o.firstAnt ?? 0;
    const size = Math.max(4, Math.ceil(o.ants / (2 * this.size)));
    const parts: TaskArgs<'e1'>[] = [];
    for (let a = 0; a < o.ants; a += size) parts.push([p, { ...o, firstAnt: first + a, ants: Math.min(size, o.ants - a) }]);
    return (await this.map('e1', parts)).flat();
  }

  /** E1 comparison sample for ants 0 … o.ants − 1: statistics are computed in the workers, only per-ant summaries come back. */
  async e1Sample(p: WalkParams, o: E1Options): Promise<E1Sample> {
    const first = o.firstAnt ?? 0;
    const size = Math.max(4, Math.ceil(o.ants / (2 * this.size)));
    const parts: TaskArgs<'e1Summary'>[] = [];
    for (let a = 0; a < o.ants; a += size) parts.push([p, { ...o, firstAnt: first + a, ants: Math.min(size, o.ants - a) }]);
    return { acc: (await this.map('e1Summary', parts)).flat() };
  }

  /** E1 reference-walker ants 0 … o.ants − 1 (from o.firstAnt), chunked across the pool; tracks in ant order. */
  async sectored(pools: SectorPools, o: SectoredOptions): Promise<Track[]> {
    return (await this.map('sectored', this.antChunks(o).map((c) => [pools, c] as TaskArgs<'sectored'>))).flat();
  }

  /** The same ants as per-ant comparison summaries (computed in the workers). */
  async sectoredSample(pools: SectorPools, o: SectoredOptions): Promise<E1Sample> {
    return { acc: (await this.map('sectoredSummary', this.antChunks(o).map((c) => [pools, c] as TaskArgs<'sectoredSummary'>))).flat() };
  }

  private antChunks<O extends { ants: number; firstAnt?: number }>(o: O): O[] {
    const first = o.firstAnt ?? 0;
    const size = Math.max(4, Math.ceil(o.ants / (2 * this.size)));
    const parts: O[] = [];
    for (let a = 0; a < o.ants; a += size) parts.push({ ...o, firstAnt: first + a, ants: Math.min(size, o.ants - a) });
    return parts;
  }

  /** E6 Bles-model colonies 0 … count − 1, chunked across the pool; metrics in colony order. */
  async blesColonies(P: BlesParams, count: number, seed: number): Promise<E6Metrics[]> {
    const size = Math.max(2, Math.ceil(count / (2 * this.size)));
    const parts: TaskArgs<'blesColonies'>[] = [];
    for (let c = 0; c < count; c += size) parts.push([P, seed, c, Math.min(size, count - c)]);
    return (await this.map('blesColonies', parts)).flat();
  }

  close(): void {
    for (const w of this.workers) w.kill('SIGKILL');
  }

  private pump(): void {
    while (this.idle.length && this.queue.length) {
      const w = this.idle.pop()!;
      const job = this.queue.shift()!;
      this.busy.set(w, job);
      w.send({ id: job.id, name: job.name, args: job.args });
    }
  }

  private done(w: ChildProcess, m: { id: number; result?: unknown; error?: string }): void {
    const job = this.busy.get(w);
    this.busy.delete(w);
    this.idle.push(w);
    if (job) {
      if (m.error) job.reject(new Error(m.error));
      else job.resolve(m.result);
    }
    this.pump();
  }
}
