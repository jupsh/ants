---
id: D131
date: 2026-10-24
time: 15:53
kind: design
title: Part D Stage 0 sensitivity (c) follow-up design: displacement between the initiator's frame and each participant's onset, snapshot coverage, and a sample-vs-position decomposition of S3₂ and S3₁ (data only, descriptive)
---
- **2026-10-24 ≈ 15:53 UTC — Part D Stage 0 sensitivity (c) follow-up design: displacement between the initiator's frame and each participant's onset, snapshot coverage, and a sample-vs-position decomposition of S3₂ and S3₁ (data only, descriptive).**
  - **User (2026-10-24): "Go ahead with (c)"**, option (iii)'s local part (D130): measure how far participants move
    between the initiator's onset frame f0 and their own onsets. Descriptive, data only, outside the gate; D130's
    gate reading is unchanged by it.
  - **Why (c) can differ from the primary, from the code (before any number is read):**
    1. **Sample:** (c) drops every participant absent from the f0 snapshot (no in-nest detection ≤ 3 frames back),
       so its episodes and participants differ from the primary's.
    2. **Positions before the still run:** D130 assumed f0 and onset positions nearly coincide because participants
       are still ≥ 20 frames before onset. That covers lag ≤ 20 frames only: a participant whose still run
       (`still frames before`, the event's 5th field) is shorter than its lag may have been moving at f0.
    3. **Creep and snapshot timing:** within a still run each step is < 0.6 mm/frame, so creep can add up over
       long runs. The f0 snapshot is taken after f0's update, so tied initiators (lag 0) are recorded after their
       first step. Their own event position stays the reference in (c).
  - **Measured** (`scripts/scratch/s3SensC.py`, on `logs/contacts/data-c*.json` and `snap-c*.json`; episodes as in
    `s3Audit.py`, primary-eligible only, non-reference participants):
    - **Coverage:** share present in the f0 snapshot, by lag (0, 1–20, 21–60, > 60 frames) and episode size (3,
      4–15, > 15).
    - **Displacement** δ = |position at f0 − onset position| for those present: quantiles (50, 90, 99 %) and
      shares > 0.6, 2, 5 mm. Split by lag class and by still-run cover (still frames before ≥ lag, or < lag).
    - **Decomposition of S3₂ and S3₁** (excess over null 2 and null 1, as in `s3Audit.py`):
      - A: all participants at onset positions (the primary);
      - B: participants present at f0, at onset positions (sample effect A − B);
      - C: present at f0, at f0 positions (= (c); position effect B − C);
      - C-cover: as C, but only participants whose still run covers the lag (if B − C vanishes there, (c)'s loss
        comes from positions taken before the still run).
      - Common reference draws and permutations across variants per episode: `random.Random(531)`, 20 references,
        200 permutations for null 1 (not 1,000: diagnostic, minutes).
      - Colony mean (≥ 5 episodes) and set mean, 95 % colony bootstrap (2,000 draws, `random.Random(0x5ea0)`).
        The differences A − B and B − C are paired per episode.
    - **Expected checks:** A ≈ D130's +0.19 and C ≈ −0.15 (different draws, so not exact).
  - **Reading rule:** descriptive. It says which of 1–3 accounts for (c), and does not reopen gate G. If C-cover's
    B − C is near 0 while C's is not, (c) mixes in positions from before the still run and is not a clean robustness
    check of the primary. Otherwise (c) stays unexplained and is carried with (d).
  - **2026-10-24 — Read: D132.**
