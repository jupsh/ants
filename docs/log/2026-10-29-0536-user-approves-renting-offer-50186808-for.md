---
id: D179
date: 2026-10-29
time: 05:36
kind: decision
title: User approves renting offer 50186808 for Part D Stage 2b and the capability runs (32 vCPU EPYC 7742, $0.143/h, 9.7-11.8 h, $1.38-1.68 estimated; 3,256 runs)
authority: user
scope: T033
---
- **2026-10-29 ≈ 05:36 UTC — User approves renting offer 50186808 for Part D Stage 2b and the capability runs (32 vCPU EPYC 7742, $0.143/h, 9.7-11.8 h, $1.38-1.68 estimated; 3,256 runs).**
  - **Estimate (D169's bench, the lead's sizing):** reference seconds per run = base 212.5 s (132 s × colony factor
    1.61) × the arm factor.
    - Stage 2b: 528 runs (9 members, Eu, El20, base × 44), × 0.91 for its flags, ≈ 34 h;
    - capability datasets: 2,376 runs, ≈ 173 h;
    - null pool: 352 runs, ≈ 21 h.
    - In all, 3,256 runs and ≈ 228 reference job-hours (252 s per run). The same method gave Stage 2a 229.5 h, which
      ran in 3.7 h at D172's measured speed.
  - **Offers** (`box.mjs offers --runs 3256 --run-s 252`, on-demand, 20 GB, 2026-10-29 ≈ 05:35 UTC): the lead
    recommended 50186808: 32 vCPU AMD EPYC 7742 (speed 0.77 measured on this CPU type), 31 jobs, $0.143/h, Michigan,
    9.7–11.8 h, $1.38–1.68. Also shown:
    - 51326867, cheaper on a guessed speed, which failed to start in D172;
    - 44685302 (128 vCPU, guessed 0.85, likely optimistic).
    Resources: ≈ 350 MB per job, 20 GB disk. The audit post-processing (`partD2.ts capfiles`, ≈ 2 h or more) runs
    locally after the fetch, outside this estimate.
  - **User (in conversation, verbatim):** "do 50186808".
  - **Scope:** this offer only, for these 3,256 runs only. If it fails to start, the question returns to the user.
    - Launcher `scripts/scratch/box/run-partD2b.sh` (md5 `b06b4291`): assess, then cap, then capnull. Code hashes:
      partD2.ts `4a454ad5`, partDMembers.ts `15edeb88`, capSeeds.ts `9ea9474c`, tmpShortSim.ts `6c85d31c`, C2 fit
      `bccbe886` (the last two as in D172).
    - Stage 2a's 22 calibration and verification files are pushed to the box before launch; the launcher refuses
      unless 9 members are calibrated.
  - **Stop rule (docs/BOX.md):** the first wave is the first 31 runs, all base-arm Stage 2b runs. Expected time: the
    slowest base colony ≈ 347 reference s (D172) × 0.91 ÷ 0.77 ≈ 410 s; limit 1.5 × ≈ 10 min. So 31 `pd-as-`
    outputs are due within ≈ 11 min of launch, else stop and report to the user. Thereafter, hourly market checks;
    `box.mjs finish` fetches `logs/partd2` and `logs/short`, then destroys the box.
  - **Sealed from launch:**
    - the Stage 2b outputs, until their reader is built (P64);
    - the members' capability outputs, until c is frozen (P63).
    Only counts and file times are checked during the run.
- **2026-10-29 — Gate passed; rented, `box.env` written by hand.** `plied review T033 --action rent:partd2b-20261029
  --gate` passed after 15 dispositions; the six commitments that govern only commit and publish were left out.
  Before renting, `vastai show instances` listed none. `box.mjs rent 50186808 --yes` was killed (exit 137) with no
  output, after vast.ai had created instance 58203242 (EPYC 7742, $0.143/h, started 05:38:12 UTC, running) but
  before the tool wrote `logs/box.env`. The lead found the instance with `vastai show instances` and wrote
  `logs/box.env` by hand with the fields `rent` writes (direct SSH `-p 10244 root@152.160.36.243`, offer 50186808,
  rented at the instance's start time). The first SSH attempt failed host-key verification. A verbose retry found no
  stale entry; it accepted the new ED25519 key and connected. `box.mjs status` then reached the box. Setup follows.
- **2026-10-29 ≈ 05:45 UTC — Set up and launched.** `box.mjs setup`: Node 22.22.1, `npm ci` ok, checksums match (286
  files). The CPU quota is 30.7, so 29 jobs instead of the estimate's 31: about 7 % longer, ≈ 10.4–12.6 h and
  ≈ $1.48–1.80, slightly above the approved range's upper end ($1.68), reported to the user. Stage 2a's 22 calib and
  verify files were pushed (md5-checked); the box shows 9 calibrated members and no outputs.
  - `plied review T033 --action run:partd2b-20261029 --gate` passed after fresh dispositions. Run
    `partd2b-20261029T054430Z` (`run-partD2b.sh auto`) started on the box ≈ 05:44:30 UTC, assess first, with 29
    simulations running.
  - Auto-finish `partd2b-finish-20261029T054509Z` fetches `logs/partd2` and `logs/short`, then destroys the box. It
    was started without `--node`, since it only waits, fetches and destroys. A first try with `--node T033` was
    refused by the gate under its own action name.
  - `market` at launch: stay. `logs/box.env` was given `BOX_JOBS=29` by hand.
  - **Stop rule, at 29 jobs:** 29 `pd-as-` outputs by ≈ 05:55 UTC (≈ 410 s expected, × 1.5).
- **2026-10-29 ≈ 05:55 UTC — Stop rule passed.** 65 Stage 2b outputs by 05:55:28 UTC (limit 29), counted with `ls |
  grep -c` on the box; nothing else was read. Hourly watcher `partd2b-watch` started locally (`box.mjs watch`; file
  counts and times only; notifies if the projected total passes $2.50).
- **2026-10-29 ≈ 14:45 UTC — Run failed: box disk full.** `partd2b-20261029T054430Z` exited 1 after 1 h 19 min (≈ 07:04
  UTC), in `assess`: a write failed, "11 runs failed", and the launcher stopped before `cap` and `capnull`. The
  20 GB disk was at 100 % (2 MB free); memory was not short (99 GB available). The finish step failed by design
  without fetching and kept the box, so instance 58203242 is still billing (9.1 h, ≈ $1.30 at 14:44 UTC). The watcher
  sent no notification (to check).
  - **Seen, to find the cause:** the stage log's error lines (a failed `write`, "11 runs failed"), the count of
    Stage 2b output files (528, some truncated), and directory totals (`du -sh`: 20 GB for the box's outputs, 2.2 MB
    for its partd2 logs). Nothing else; no file's content or individual size.
  - **Cause, the lead's planning error:** at ≈ 38 MB per output (with the `--ydist` series), the 2,728 capability runs
    would need ≈ 95 GB more. The launcher kept every raw output on the box, although D169's resource note said
    outputs would be reduced there, as in Part C. A recovery plan and its cost go to the user before anything resumes.
