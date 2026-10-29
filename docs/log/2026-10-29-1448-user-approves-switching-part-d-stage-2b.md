---
id: D180
date: 2026-10-29
time: 14:48
kind: decision
title: User approves switching Part D Stage 2b/capability to offer 48597476 with an 80 GB disk after the disk-full failure (D179); total now about $2.5-3.2
authority: user
scope: T033
---
- **2026-10-29 ≈ 14:48 UTC — User approves switching Part D Stage 2b/capability to offer 48597476 with an 80 GB disk after the disk-full failure (D179); total now about $2.5-3.2.**
  - **Why:** run `partd2b-20261029T054430Z` failed with the box's 20 GB disk full (D179). The remaining work resumes
    from its outputs: about 11 broken Stage 2b runs plus 2,376 capability runs and 352 null-pool runs, ≈ 2,739 runs
    and ≈ 195 reference job-hours.
  - **Sizes:** Stage 2b outputs ≈ 38 MB each (directory total over the file count, D179). A Part C run with `--ydist`
    is 1.8 MB (one already-read file, timed locally for this estimate), so the capability outputs should be ≈ 2 MB
    each, ≈ 6 GB in all. A disk of 80 GB holds Stage 2b's 20 GB, the capability outputs, and room for error.
  - **Offers** (`box.mjs offers --runs 2739 --run-s 255 --disk 80`, 2026-10-29 ≈ 14:50 UTC): the lead recommended
    48597476, 32 vCPU AMD EPYC 7B13 (Zen 3, speed 0.85 guessed), 31 jobs, $0.156/h, Malaysia, 6.7–11.2 h,
    $1.05–1.74. Also shown: 51326867 (64 vCPU, $0.176/h, $0.72–1.19), which failed to start in D172. Spent on
    instance 58203242 so far ≈ $1.30, so the total is ≈ $2.5–3.2, above D179's approved $1.38–1.68. The alternative
    shown was to fetch Stage 2b's outputs, destroy the box and decide later.
  - **User (in conversation, verbatim):** "yes", to "Shall I switch to **48597476** (or another offer), or fetch and
    stop?"
  - **How:** `box.mjs switch 48597476 --disk 80`, carrying `logs/short` and `logs/partd2` (md5-checked), relaunching
    `run-partD2b.sh auto` (it resumes: parsed outputs are skipped, broken ones rerun, then `cap` and `capnull`), then
    destroying 58203242.
    - Bench gate: `--min-throughput 20` (jobs × speed). The current box gives 29 × 0.77 ≈ 22; the default, 1.2 × that,
      would reject an equal box, and the point is the disk, not speed.
    - A new finish step (fetch `logs/partd2` and `logs/short`, destroy) and the hourly watcher restart with the run.
    - If the offer is gone or fails to start or bench, the question returns to the user.
  - **Stop rule** for the relaunch: the first wave is the reruns and the first capability datasets. Pace is checked
    against the bench's speed 1 h after the relaunch; at less than 2/3 of the expected rate, stop and report.
  - **Unchanged:** code, seeds, flags and the frozen pipeline; outputs stay sealed (P63, P64).
- **2026-10-29 ≈ 14:50 UTC — Gate passed; `box.mjs` fetch and push made streaming; switch started.**
  - `plied review T033 --action rent:partd2b-switch-20261029 --gate` passed after fresh dispositions.
  - Fix before the switch: `box.mjs fetch` and `push` buffered the whole compressed archive (`maxBuffer` 2 GB), but
    Stage 2b's 20 GB compresses to ≈ 3 GB. Both now stream (`ssh | tar`, `tar | ssh`, with pipefail), keeping the
    md5 checks. Tested: a 2-file push and fetch round trip, md5-checked, and a fetch of a missing path fails. The
    change is tooling only; no run code was touched.
  - Switch run `partd2b-switch-20261029T145039Z`: `switch 48597476 --disk 80 --min-throughput 20`, carrying
    `logs/short` and `logs/partd2`, with a new finish (fetch both, destroy) and watch (budget $2.50).
  - The old watcher `partd2b-watch-20261029T055545Z` was killed (`run.sh kill`). Its log was empty after 8.9 h: it
    never completed a check, probably stuck on its first ssh call, which has no timeout. The failure was signalled by
    the run's own end notification and by the finish step's failure, as designed.
- **2026-10-29 ≈ 15:40 UTC — Switched.** The switch took 49.7 min.
  - New instance 58263882 (offer 48597476, EPYC 7B13, $0.156/h, 80 GB requested; set-up ok, checksums match, 29
    jobs). Benched at speed 1.51 (29 runs at once, median 87 s), against 0.85 guessed; throughput 43.9 ≥ 20.
  - Carried 1,081 files (5.3 GB compressed; streaming fetch and push, md5-checked both ways). Relaunched
    `partd2b-20261029T154020Z` (`run-partD2b.sh auto`), with finish `partd2b-finish-20261029T154020Z` and watch
    `partd2b-watch-20261029T154020Z`. Old instance 58203242 destroyed after 10.04 h, ≈ $1.43.
  - **Estimate now:** ≈ 2,739 runs × 255 reference s ÷ (1.51 × 29) ≈ 4.5–5 h, ≈ $0.75 on this box, ≈ $2.2 in all.
  - **Pace check:** at ≈ 16:45 UTC, by capability output count (expected ≈ 550 per h; stop and report below ≈ 2/3).
- **2026-10-29 ≈ 16:41 UTC — Pace check passed; the run continues.** Counts and disk only (blind; no log or output
  read).
  - Stage 2b (`assess`) finished at 15:46 (its 528 outputs complete); `cap` started at 15:46. At 16:41 (box clock),
    590 `pd-cap-` outputs in 54.5 min ≈ 650 per h, above the expected 550 (stop line ≈ 370).
  - Disk: 22 of 80 GB used. At ≈ 2 MB per capability output, ≈ 28 GB at the end.
  - Projection: `cap` (2,376) done ≈ 19:25, `capnull` (352) ≈ 20:00 UTC; then the finish step fetches and destroys.
