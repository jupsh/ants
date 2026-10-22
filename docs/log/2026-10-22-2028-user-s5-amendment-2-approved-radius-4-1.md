---
id: D119
date: 2026-10-22
time: 20:28
kind: decision
title: User: S5 amendment 2 approved (radius 4.1 mm, every other definition and eligibility rule fixed) with three qualifications; resume guard for an interruptible box
---
- **2026-10-22 ≈ 20:28 UTC — User: S5 amendment 2 approved (radius 4.1 mm, every other definition and eligibility rule fixed) with three qualifications; resume guard for an interruptible box.**
  - **User (pasted, adopted):** "Yes—approve amendment 2: use 4.1 mm for S5 and keep every other definition and
    eligibility rule fixed. The simulated coverage supports that change, and 4.1 mm is an existing physical scale in the
    design."
  - **D115 amendment 2 (S5):** a neighbour is another tracked in-nest ant within **4.1 mm** (centre distance) at the bin's
    first frame; strata isolated (0) vs crowded (≥ 3), the 4 × 2 cells, the 10- / 20-bin minimums, the ≥ 5-ant rule and
    every other part of S5 / S6 unchanged (D115 amendment 1, D117).
  - **Qualifications recorded (user):**
    - the original 10-mm definition was unestimable **in the two simulated colonies checked** (D118: colonies 4 and 10,
      C2 base, ≈ 0.7 % of bins isolated); that feasibility result stands as recorded;
    - revised S5 measures dependence on **contact-range neighbours**. It does not directly measure neighbourhood
      dependence over 10–20 mm (the range of P10 / P20, E_l10 / E_l20). The same definition is applied to every
      mechanism and to the data;
    - if the data or any simulation arm lacks sufficient eligible observations, S5 is reported **unestimable for that
      comparison**, exclusions visible; no further radius or eligibility adjustment.
  - **Toy calibration output (D118):** appropriately disclosed; no evidence about full-size calibration or mechanism
    sufficiency.
  - **Applied:** `S5_R = 4.1` in scripts/scratch/s5Stats.ts (scratch). Synthetic checks rerun: P-like dependence 1.73,
    null 0.01, position-only 0.00, the driven-cluster case −0.21 (colony primary over all ants; D118's −1.5 was for the ants alone at the cluster, not rechecked). Nothing run on
    the data (s5Data.ts still refuses without `--after-screen`).
  - **Resume guard (no effect on results):** partC.ts now counts a run as done only if its output file parses
    (writeJson is not atomic), so an interruptible box can be stopped and resumed: runs in flight are redone, a
    selection not yet frozen is recomputed from the same seeds' files, a frozen one is kept.
  - **Next:** time a few runs locally for the box estimate (base, P10, E_l20, base with the separation recorders;
    seed 4242, outputs not read), then request the box.
  - **Timing (local, 4 runs at once on the 8-core laptop, colony 5, outputs deleted unread):** base 208 s, E_l20
    216 s, P10 272 s, base with the separation recorders 218 s; 300–420 MB each. The old box at full load (B1 rerun,
    66 runs on 64 vCPUs) took ≈ 270 s per base run.
  - **Box estimate, written before renting:** at most 1,452 calibration runs and 308 separation runs. A 64-vCPU Zen 3
    box at full load takes ≈ 5.3 min on average per calibration run (P ≈ 1.3 × base) and ≈ 4.8 min per separation run,
    so calibration ≈ 2.2 h and separation ≈ 0.5 h. With ≈ 0.5 h for set-up and copying back, ≈ 3–3.5 h, with a 4-h budget.
    The Test A dump, the screen and everything on the data side run locally. **Stop rule:** if the first wave of runs takes
    > 1.5 × the expected time, report before continuing. Script: scripts/scratch/box/run-partC.sh.
  - **Box (rented by the user, interruptible):** vast.ai Threadripper PRO 5995WX, $0.359/h, `ssh -p 34721
    root@ssh9.vast.ai`; CPU quota 61.4 (cgroup), so **60 jobs**. Worktree `/root/ants-w7`, copied from the working tree
    (the tracked and untracked files plus scripts/scratch; not data/stroeymeyt2018/, literature, logs or the
    local-only CeCILL port); Node 22.22.1, `npm ci`. Checksums of src/sim, src/worker, data/fits, data/reference and
    the run scripts match local. simHash differs (b88c… vs f57a…) only because the CeCILL port
    src/sim/reference/khuongSegmentation.ts is absent; the runs don't use it. The old box (EPYC 9534, Zen 4) timed the
    estimate; this one is Zen 3, so the first-wave check decides.
  - **Launch bug, fixed before any result:** the first launch (20:48 UTC) started ≈ 790 runs at once. Each grid point's
    `runAll` had its own pool of 60, and calibration runs every variant's grid points concurrently; the smoke chain was
    too small to show it. Killed after ≈ 1 min (risk of running out of memory), with no output files. partC.ts now shares one limit of
    `--jobs` processes across all calls (checked locally: exactly 4 at `--jobs 4`). Results don't depend on scheduling
    (each run's seed fixes it). Relaunched 20:50 UTC (`partC-20261022T205049Z`), 60 at a time.
  - **Box unreachable from ≈ 21:06 UTC** (the connection resets before login; still so at 21:17), about 15 min into the
    relaunch; presumably the interruptible instance stopped. Progress unknown: the watcher's counts were inconsistent
    (a first file seen at 20:51:56, none counted at 21:06), to be checked on the box. Runs resume on restart.
  - **Box changed (user: the interruptible box was outbid; destroyed):** the UK E5-2673 v4 offer was taken while being
    rented (instance created stopped, "resources unavailable"; destroyed at once). Rented instead **EPYC 7742 (Zen 2),
    64 vCPU, Michigan, on demand, $0.522/h with 40 GB disk** (`ssh -p 12228 root@ssh8.vast.ai`). Revised estimate for
    Zen 2: about 3.5–5 h, about $1.85–2.60. **Stop rule for this CPU:** the first wave (P4 runs) is expected in ≈ 8 min;
    > 12 min ⇒ report before continuing.
  - **Box tooling (user request):** `scripts/box.mjs` (offers, rent, setup, ssh, status, pace, market, fetch, push,
    destroy; `--env` for a second box), `scripts/boxCpus.json`, guide `docs/BOX.md`, a pointer in CLAUDE.md.
    The first `market` check found an EPYC 7713 (Zen 3, Thailand, $0.404/h). **User: switch to it, also to try the
    tools.** Results don't depend on the box (each run is fixed by its seed, same Node version), so finished runs and
    any frozen selection are copied over and the new box resumes; runs in flight are redone.
  - **Switched (21:50 UTC):** EPYC 7742 measured at ≈ 351 s per run on average at 60 jobs (speed ≈ 0.77; boxCpus.json).
    Run stopped there with 91 calibration runs done and no selection frozen; fetched and pushed (md5-checked) to the
    **EPYC 7713, $0.404/h** (`ssh -p 54156 root@183.89.209.74`, quota 61.4, 60 jobs); relaunched as
    `partC-20261022T215119Z`. It picked up at the unfinished grid points, rerunning none of the 91. The old box was
    destroyed after 0.31 h (≈ $0.16). Tool fixes found by the switch: a buffer-size overflow in fetch, `--env` and
    `push` added, run.sh honours BOX_SSH from the environment.
  - **User: a single `switch` command and an automatic end-of-run step.** Added `box.mjs switch` (rent, set up, stop,
    carry outputs md5-checked, relaunch, destroy the old box) and `box.mjs finish` (wait, then if the run exited 0, fetch
    with md5 checks and destroy; any failure keeps the box). `finish` was tested on the box with two throwaway runs: a
    failing one kept the box and fetched nothing; a good one fetched and kept the box without `--destroy`. Started
    for Part C: `partc-finish-20261022T220208Z` (local), fetching logs/short and logs/partc, then destroying the box.
    `switch` is untested as a whole; its steps are the commands used in the hand switch.
