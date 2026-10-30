---
id: D192
date: 2026-10-30
time: 04:47
kind: decision
title: User: run T057's paired L0S1 judge on a rented box (offer 48540476) instead of locally after partd2b-read; D191's arms, seeds and reading unchanged
authority: user
scope: P77 T057
---
- **2026-10-30 ≈ 04:47 UTC — User: run T057's paired L0S1 judge on a rented box (offer 48540476) instead of locally after partd2b-read; D191's arms, seeds and reading unchanged.**
  - **Source:** the lead recommended a box (local cores held by `partd2b-read`, then capfiles; about 70 reference runs,
    scaled from D105, uncertain by a factor of about 2) and proposed offer 48540476 (EPYC 7763, 32 vCPU, 31 jobs,
    $0.159/h, estimate 0.4–0.5 h, $0.07–0.09, speed guessed by generation), with the stop rule below and the record
    changes listed here. User: "Go for it".
  - **Decided:** the T057 judge (D191) runs on that box, now, rather than locally after `partd2b-read`. The arms
    (`l0s1c`, `l0s1`), seeds, candidate, swap and reading in D191 are unchanged.
  - **Replaces P77's timing clause.** P77 quoted D191's local condition (start only after `partd2b-read` has finished).
    It is superseded. Its other clause is kept, adapted to the box: the box's src/sim tree must not change between
    launch and the end of both arms, and the box simHash must equal the local one at launch.
  - **Stop rule:** each arm is expected to take about 5–10 min there; if the first arm has not finished within 15 min of
    launch, the lead stops and reports to the user. The box is destroyed as soon as the T057 outputs are fetched and
    their md5 checked.
  - **Seal narrowed (lead, same step):** `.claude/sealed-paths.txt` now holds the output files (`judge-` prefix in the
    T057 log folder) and the run's log folder, not the whole T057 folder, so the outputs can be fetched, md5-checked
    and counted without being read.
