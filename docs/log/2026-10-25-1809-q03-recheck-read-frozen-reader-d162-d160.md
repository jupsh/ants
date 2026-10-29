---
id: D163
date: 2026-10-25
time: 18:09
kind: reading
title: Q03 recheck read (frozen reader, D162; D160 as amended by D161): pass, all five rows equivalent in 14-20 h at C2 base (22 colonies, paired); in 2-6 h the original start still differs (bouts to nurses -32 %, nurse water +0.011), the revised start does not drift beyond the margins; read as P54 limits it
---
- **2026-10-25 ≈ 18:09 UTC — Q03 recheck read (frozen reader, D162; D160 as amended by D161): pass, all five rows equivalent in 14-20 h at C2 base (22 colonies, paired); in 2-6 h the original start still differs (bouts to nurses -32 %, nurse water +0.011), the revised start does not drift beyond the margins; read as P54 limits it.**
  - **Run:** `q03-recheck-20261025-20261025T165512Z` (D162), ok in 1 h 12 min, ended ≈ 18:08 UTC. All 44 runs
    present (22 colonies × 2 starts), no missing run, every ant alive at 20 h in both starts. Before reading, the six
    frozen files of D162 were checked: all md5s match (runner `84c25636…`, reader `e4503749…`, seeds `7e07d8c0…`,
    switch `b89e71a4…`, C2 fit `bccbe886…`, trips `6ea0f3ad…`). The frozen reader wrote `logs/q03/reading.json`
    (md5 `758b40b873de1df3e63a1872390f2e74`).
  - **Primary (14–20 h, original − revised, paired by colony; 90 % colony bootstrap, 2,000 resamples):**

    | Row | Original | Revised | Effect | 90 % interval | Margin | Class |
    |---|---|---|---|---|---|---|
    | 1 nurse mean body water | 0.9331 | 0.9334 | −0.0003 | [−0.0014, 0.0009] | ±0.005 | equivalent |
    | 2 bouts to nurses per h | 62.00 | 60.63 | +2.3 % | [−2.2 %, +7.5 %] | ±10 % | equivalent |
    | 3 largest resting-cluster share | 0.2971 | 0.3025 | −0.0054 | [−0.0179, 0.0065] | ±0.03 | equivalent |
    | 4 nurse active fraction | 0.0378 | 0.0381 | −0.9 % | [−2.4 %, +0.7 %] | ±10 % | equivalent |
    | 5 forager outside share | 0.2329 | 0.2301 | +0.0028 | [−0.0073, 0.0138] | ±0.02 | equivalent |

    - **Verdict (frozen rule): pass.** "all five rows equivalent: the starts are equivalent in these five
      colony-averaged measurements in 14-20 h at C2 base settings (D161 item 6 limits this reading)". No row is outside,
      unresolved or missing, so P53's return for a decision is not triggered.
    - **Scope (P54):** the pass supports equivalence of these five colony means in 14–20 h at C2 base settings. It does
      not establish stationarity, equivalence in every colony, adequacy of the 2-h production warm-up, or convergence
      for any new mechanism (P49).
  - **Descriptive (not gated; same bootstrap, 90 %):**
    - **2–6 h, original − revised:** rows 1 and 2 lie outside their margins. Nurse water +0.0111 [0.0076, 0.0141];
      bouts to nurses −32.0 % [−37.1 %, −25.7 %] (42.3 against 62.2 per h). Rows 3–5 lie inside: cluster share
      +0.0156 [0.0016, 0.0289]; nurse active −5.0 % [−6.7 %, −3.2 %]; forager outside +0.0033 [−0.0082, 0.0156].
    - **Early to late (2–6 h − 14–20 h), per start:**
      - original: nurse water +0.0110 [0.0077, 0.0137]; bouts −19.7 per h [−24.1, −15.1]; cluster share +0.0160
        [0.0005, 0.0306]; nurse active −0.0016 [−0.0025, −0.0007]; forager outside −0.0019 [−0.0167, 0.0142].
      - revised: nurse water −0.0004 [−0.0013, 0.0006]; bouts +1.6 per h [−1.3, 4.6]; cluster share −0.0050
        [−0.0233, 0.0126]; nurse active 0.0000 [−0.0010, 0.0010]; forager outside −0.0025 [−0.0143, 0.0089].
    - **Within 2–6 h (4–6 h − 2–4 h):** original nurse water −0.0042 [−0.0070, −0.0011] and cluster share −0.0166
      [−0.0336, −0.0006], the rest with intervals across 0; revised: every interval across 0 (bouts −3.6 per h
      [−7.3, 0.3]).
    - **Reading of the descriptives:** the original start (full water, empty crops) is still settling in 2–6 h,
      mostly through fewer bouts to nurses and fuller nurses; by 14–20 h it matches the revised start. The revised
      start's colony means in 2–6 h are close to its own 14–20 h means, each difference inside the row's margin. This
      is descriptive only: it is not an equivalence test of the warm-up and does not establish its adequacy (P54).
    - Per-colony 14–20 h differences by size and hourly means per start are in `reading.json`, not read further here.
  - **Disclosed gap in the reader:** D162 row 3 says samples with no resting ant are "counted (`noRest`) and
    reported", but the frozen reader does not print or write that count. Read from the 44 run files directly: `noRest`
    is 0 in all 880 run-hours, so no sample entered row 3 as a zero share. The reader was not changed.
  - **Consequences:** P02's recheck at C2 settings is done and passes for these rows; Q03 needs no further action;
    Stage 2a (T033) is no longer held by the recheck (P49). The limitation "the C2 warm-up shortcut is unrechecked" in
    F095 and D156 is now rechecked within P54's scope. P02's standing condition (recheck if walk-on rates or water
    parameters change) stays in force for later changes.
