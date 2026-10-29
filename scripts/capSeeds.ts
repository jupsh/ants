// Part D capability datasets and null pool (D174 Part A as amended by D175): one seed per arm, run and colony on the
// new key 0xc4b3, apart from Stage 2a (`diag` 0xc4b0, `judge` 0xc4b1) and Stage 2b (`judge` 0xc4b2). Arms are the
// MEMBERS index in partD2.ts (0–10) and CAP_BASE for the base-arm null pool; a member's runs are 2k, 2k + 1 for
// dataset k (k < 6), the pool's 0 … 15. Members do not share seeds: each dataset is independent of every other.
import { seedFor } from './lib';

export const CAP_KEY = 0xc4b3;
export const CAP_BASE = 11;
export const CAP_K = 6;
export const CAP_POOL = 16;
export const capSeed = (arm: number, run: number, colony: number) => seedFor(2018, 'judge', CAP_KEY, arm, run, colony);
