---
id: D161
date: 2026-10-25
time: 16:44
kind: decision
title: User: Q17 answered (pasted, adopted): D160 approved with amendments; seeds from RNG.stream(0xc4c3, colony).int(2 ** 31), mapping frozen first; 20-h runs, 14-20 h primary, 2-6 h early-to-late descriptive with 2-4 h vs 4-6 h; five rows and margins as bounded diagnostic criteria, relative margins bootstrapped as a ratio of means; all-five pass rule, larger-half gate withdrawn; D160's history corrected with A003's multi-seed check; a pass limited to five colony means at C2 base in the late window; Stage 1 proceeds now
authority: user
scope: Q17 T015 P49
---
- **2026-10-25 ≈ 16:44 UTC — User: Q17 answered (pasted, adopted): D160 approved with amendments; seeds from RNG.stream(0xc4c3, colony).int(2 ** 31), mapping frozen first; 20-h runs, 14-20 h primary, 2-6 h early-to-late descriptive with 2-4 h vs 4-6 h; five rows and margins as bounded diagnostic criteria, relative margins bootstrapped as a ratio of means; all-five pass rule, larger-half gate withdrawn; D160's history corrected with A003's multi-seed check; a pass limited to five colony means at C2 base in the late window; Stage 1 proceeds now.**
  - **User (pasted, adopted as given):** "Q17: approve D160 with the amendments below. Stage 1 may proceed now;
    Stage 2a waits for the recheck reading."
    1. **Approve the starts, settings and paired design.** Compare the production initialization with the original
       initialization—every ant's body water uniform between its thirst threshold and 1, all crops empty—at C2 base
       settings, across the 22 colonies. Use one seed per colony, shared between starts. Generate the numeric seed
       with `RNG.stream(0xc4c3, colony).int(2 ** 31)` and freeze the colony-to-seed mapping before running.
    2. **Approve the duration and windows.** Run each start for 20 h, with 14–20 h as the primary comparison window.
       Keep the production window, 2–6 h, descriptive. Its difference from 14–20 h is an **early-to-late
       difference**; to describe drift within 2–6 h, also report 2–4 h versus 4–6 h.
    3. **Approve the five rows and tolerances as bounded diagnostic criteria:** nurse mean body water ±0.005; bouts
       to nurses per hour ±10%; largest resting-cluster share ±0.03; nurse active fraction ±10%; forager outside
       share ±0.02.
       - Retain the paired colony bootstrap, 2,000 resamples and 90% intervals. For the absolute margins, bootstrap
         the mean paired difference, original minus revised. For the percentage margins, bootstrap `(mean original −
         mean revised) / mean revised`, recomputing both means in every resample. Preserve the original/revised
         pairing when resampling colonies.
    4. **Approve the all-five pass rule.** A row is equivalent when its interval lies entirely within its margins,
       outside when the interval lies wholly beyond either margin, and unresolved otherwise. A missing required
       statistic or undefined relative effect prevents a pass. Any outside or unresolved result returns for a
       decision before changing settings, tolerances or run length.
       - **Withdraw my previously proposed mandatory "larger half" gate.** Report paired differences by colony and
         colony size descriptively, including the 143-ant colony. These do not add a second pass rule.
    5. **Correct D160's historical summary.** A003 includes a later check with three seeds for the 143-ant colony and
       two for the 70-ant colony, read as convergence in behavioural quantities within seed spread at that earlier
       start point. Include that result alongside the earlier single-seed uncertainty. The C2 recheck remains due
       because the settings subsequently changed.
    6. **Limit the interpretation of a pass.** It supports equivalence of these five colony-averaged measurements in
       the specified late window at C2 base settings. It does not establish stationarity, equivalence in every
       individual colony, adequacy of the 2-h production warm-up, or convergence for every new mechanism. The
       descriptive early-to-late results remain part of the reading.
    - Freeze the amended design and the runner and reader before the recheck. Proceed with the already approved
      Stage 1 implementation and synthetic checks independently.
    - (The reviewer reports reviewing the records and relevant code, changing no files, and running no analyses or
      simulations.)
  - **Effect (lead):**
    - Q17 is answered by this entry. D160 is approved as amended here; D160 is corrected in place for item 5 (a dated
      line in its file) and otherwise stands as the proposal this entry amends.
    - Before the run: the colony-to-seed mapping, the runner and the reader are written and frozen (md5) in their own
      entry; the original start goes in behind a diagnostic switch, off by default and bit-identical when off.
    - A "larger half" gate does not appear in D160; item 4 withdraws it from the reviewer's earlier proposal, so the
      frozen rule has none.
    - Stage 2a still waits on the recheck reading (P49). Stage 1 implementation and synthetic checks proceed (T033).
