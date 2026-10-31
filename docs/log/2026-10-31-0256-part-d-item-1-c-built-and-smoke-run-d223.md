---
id: D225
date: 2026-10-31
time: 02:56
kind: run
title: Part D item 1(c) built and smoke-run (D223 amendment 1, D224): recorder, analysis and 22 synthetic checks pass; on the 2-colony smoke the stored D_w is rebuilt exactly (largest relative error 8e-16) and D − 1 = m · r holds to 2e-15; the lead settled two implementation points (run window = block 0, minutes 0-239; the 11-colony floor on survival rows only, as amendment 1 point 3 states); no result value read
---
- **2026-10-31 ≈ 02:56 UTC — Part D item 1(c) built and smoke-run (D223 amendment 1, D224): recorder, analysis and 22 synthetic checks pass; on the 2-colony smoke the stored D_w is rebuilt exactly (largest relative error 8e-16) and D − 1 = m · r holds to 2e-15; the lead settled two implementation points (run window = block 0, minutes 0-239; the 11-colony floor on survival rows only, as amendment 1 point 3 states); no result value read.**
  - **Built by the implementer (D208)** from the brief `logs/handoff/20261031-0240-foragers1c/brief.md`, gated
    `run:foragers1c-build-smoke` (25 commitments dispositioned); report `report.md` there, with one follow-up on the same
    brief. Scripts (local scratch):
    - `scripts/scratch/foragers1cData.ts` (md5 `40ac4434`): the data recorder, a class `MinuteRecorder` beside
      `YDistStats`. Per tracked ant and 1-min bin counted from the colony's first frame: `mv`, `st`, `np`, `no`, and per
      minute the `SyncStats` block label. `ydistStats.ts` is unchanged.
    - `scripts/scratch/foragers1c.py` (md5 `56d8b818`): the analysis, Parts A–D and amendment 1, with the self-check gate.
    - `scripts/scratch/foragers1cSyn.py` (md5 `2fa02168`): the synthetic checks, through the analysis's own functions.
  - **Synthetic checks (P112): 22 of 22 pass.** Among them:
    - **Coupling:** independent ants give r −0.00006 (SE 0.0006) and D 0.998. At ρ = 0.2, r is 0.2015 with K ≈ 1100
      and 0.1868 with K ≈ 6.6, the demeaning bias shrinking with K. As co-presence rises, m goes 4.4 → 26.1 and D − 1
      goes 0.85 → 5.39, while (D − 1) / m stays at 0.195–0.207.
    - **The identity** holds to 1.2e-15 on 20 toy colonies.
    - **Hand cases** match for D† and D‡, spells under both rules, Kaplan–Meier (events, censorings, at risk, the
      ≥ 5 support, "median not estimable"), the clustering benchmark (focal ant excluded, window edges, E_j) and the
      floor.
  - **Smoke** on colony265 and colony224 (indices 20 and 12), arms T20f and base, `logs/partd2/foragers-smoke/`:
    - **Recorder:** 6 s and 210 MB peak per colony.
    - **Analysis:** 6 s and 320 MB peak.
    - **Self-check 1:** the 24 data values (light blocks and all blocks) and 48 run values of stored D_w are rebuilt to
      a relative 8e-16.
    - **Self-check 2:** D − 1 = m · r on 42 cells, to 2e-15.
    - **Composition:** passes.
    - Self-check 3 runs only on the full set.
    - Only check values and counts were printed. No m, r, spell, entry or activity value was read.
    - `npm test` 292 of 292 and `tsc` clean (no TypeScript changed in the follow-up).
  - **Implementation points the lead settled** (the implementer's doubts; within the design, not changes to it):
    - **Run window:** a run's window is its `SyncStats` block 0, minutes 0–239. The frame at exactly 4 h falls in
      block 1 and in a 241st minute; counting it would turn every spell that runs to the end into a false exit. D_w is
      unaffected.
    - **The 11-colony floor** applies to the survival rows only (Kaplan–Meier S at each point and the medians, presence
      and absence spells, both rules), as amendment 1 point 3 places it. The first build applied it to every row. Every
      other row carries its colony count, as D223 requires.
    - **Accepted as built:**
      - two scopes, light-labelled bins for Part A and light-block windows of ≥ 120 minutes for the residence rows;
      - tracked counts from `data/reference/stroeymeyt2018-fit-rows.json` (ydist omits ants never seen in the nest);
      - restricted bootstrap draws keep the drawn support colonies with their multiplicity;
      - Kaplan–Meier at risk at t = spells of length ≥ t;
      - per-colony values computed before the self-check gate, but nothing printed or written until it passes.
  - **Next:** the 22-colony data pass and the read, via `run.sh`, each gated on T012.
