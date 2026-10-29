---
id: D169
date: 2026-10-26
time: 02:37
kind: reading
title: Part D timing bench read (D168 rule): 55 of 55 runs ok in 1 h 04 min; Stage 2 = 3,520 runs, 272 reference job-hours (278 s per run, members 1.05-1.66 x base, colony factor 1.61); cheapest suitable offer 64 vCPU EPYC 7B12, 5.7-9.4 h, $0.90-1.50 (guessed speed); for the user's approval with Q19, nothing rented
---
- **2026-10-26 ≈ 02:37 UTC — Part D timing bench read (D168 rule): 55 of 55 runs ok in 1 h 04 min; Stage 2 = 3,520 runs, 272 reference job-hours (278 s per run, members 1.05-1.66 x base, colony factor 1.61); cheapest suitable offer 64 vCPU EPYC 7B12, 5.7-9.4 h, $0.90-1.50 (guessed speed); for the user's approval with Q19, nothing rented.**
  - **Run:** `partd-bench-20261026-20261026T013134Z`, 55 of 55 exit 0, 1 h 04 min at 4 jobs. Read only
    `logs/partd2-bench/times.json` (wall-clock seconds and exit codes) with `scripts/scratch/partDBenchRead.ts`, which
    applies D168's rule → `logs/partd2-bench/estimate.json`. Simulation outputs were deleted unread by the driver as
    each run ended.
  - **Measured:**
    - local speed 1.03 of the reference (standard run 129 s against 132 s);
    - colony factor 1.61 (base on the 22 colonies, 72–339 s locally);
    - arm factors (member ÷ base, mean of colonies 1 and 3): T10f 1.64, T20f 1.37, T10m 1.66, T20m 1.52, Eu-M 1.12,
      El20-M 1.20, Ed2 1.16, Ed5 1.11, Ed20 1.11, Ew5 1.05, Es 1.49; controls Eu 1.05, El20 1.15;
    - assessment factor 0.91 (Stage 2b flags ÷ Stage 2a flags, base, T10f and Es pooled). A value below 1 is not
      expected from extra output flags and is taken as timing noise at 4 jobs; the estimate uses it as D168 fixed.
  - **Estimate (D168 rule):** Stage 2a 2,904 runs, 229.5 reference job-hours; Stage 2b 616 runs, 42.5; **3,520 runs,
    272 reference job-hours, 278 s per run** (D158's planning basis was ≈ 270 s per run, the slowest colony).
  - **Offers** (`box.mjs offers --runs 3520 --run-s 279`, on-demand, 20 GB, 2026-10-26 ≈ 02:37 UTC; prices move):
    cheapest 51326867, 64 vCPU AMD EPYC 7B12 (Zen 2, speed 0.70 guessed), 63 jobs, $0.159/h, **5.7–9.4 h,
    $0.90–1.50**; next, 32-vCPU boxes at 9–19 h, $1.6–2.9. All speeds guessed by CPU generation (−20 % / +35 % on
    time). D158's $9–11 was a planning estimate at earlier prices.
  - **Resource assumptions:** one job per vCPU less one; ≈ 350 MB per job (≈ 22 GB at 63 jobs); 20 GB disk; outputs
    reduced on the box as Part C's were; the S2-J J draws run locally afterwards (≈ 5 min per 150 files, D156), outside
    the box estimate. Stop rule at launch (docs/BOX.md): the first wave's expected time on the box's CPU, limit 1.5 ×.
  - **Limits (D168):** one strength (2); members timed on two colonies; laptop timing at 4 jobs; the assessment factor
    below 1. The box's own pace is checked against the stop rule.
  - **For the user:** the runtime, resources and cost above, for approval before any rental (P50). Whether Stage 2
    proceeds at all is Q19. Nothing is rented.
