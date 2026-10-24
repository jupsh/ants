---
id: D132
date: 2026-10-24
time: 15:57
kind: reading
title: Part D sensitivity (c) read: its loss of the excess is not a sample or still-run effect; it comes from a few near-degenerate 4-ant episodes (per-episode B − C median +0.002 frames per 10 mm); 15 % of participants were not yet still at f0 (median shift 2.9 mm)
---
- **2026-10-24 ≈ 15:57 UTC — Part D sensitivity (c) read: its loss of the excess is not a sample or still-run effect; it comes from a few near-degenerate 4-ant episodes (per-episode B − C median +0.002 frames per 10 mm); 15 % of participants were not yet still at f0 (median shift 2.9 mm).**
  - **Run (D131 design):** `python3 -I scripts/scratch/s3SensC.py --out logs/partd/sensC.json --rows
    logs/partd/sensC-rows.json`, local, ≈ 1 min. Script md5 07338d14…. The `--rows` dump and the per-episode SD of
    distances were added after the first run, to read the tails; the summary statistics are unchanged by them.
    200 null-1 permutations, `random.Random(531)`.
  - **Reproduction:** variant A (the primary) S3₂ +0.179 [+0.045, +0.314] vs D130's +0.189. Variant C (= (c)) −0.209
    [−0.807, +0.229] vs D130's −0.154. The differences come from different draws.
  - **Coverage at f0** (158,754 non-reference participants in primary-eligible episodes): 98.0 % present in the f0
    snapshot. By lag: 1–20 frames 100 %, 21–60 frames 97.0 %, > 60 frames 92.6 %. By size: 4–15 ants 99.3 %, > 15
    ants 95.9 %.
  - **Displacement |f0 − onset position|** (155,542 present):

    | Participants | n | median | 90 % | 99 % | > 2 mm | > 5 mm |
    |---|---|---|---|---|---|---|
    | still run covers the lag | 132,667 | 0.72 | 2.17 | 4.10 | 12.1 % | 0.35 % |
    | of which lag 1–20 frames | 85,096 | 0.60 | 1.77 | 3.15 | 7.0 % | 0.02 % |
    | still run shorter than the lag | 22,875 (14.7 %) | 2.87 | 9.95 | 26.7 | 64.6 % | 27.6 % |
    | episodes of 4–15 ants | 97,221 | 0.70 | 2.17 | 5.03 | 12.1 % | 1.0 % |
    | episodes of > 15 ants | 58,321 | 1.24 | 4.98 | 19.4 | 32.8 % | 9.9 % |

    - D130's premise (still ≥ 10 s before onset ⇒ positions nearly coincide) holds only where the still run covers
      the lag. 14.7 % of participants had not yet settled at f0, mostly in long, large episodes.
  - **Decomposition** (colony means, 95 % colony bootstrap; differences paired per episode):

    | | S3₂ | S3₁ |
    |---|---|---|
    | A all, onset positions | +0.179 [+0.045, +0.314] | +0.264 [+0.092, +0.443] |
    | B present at f0, onset positions | +0.186 [+0.054, +0.318] | +0.274 [+0.101, +0.452] |
    | C present, f0 positions (= (c)) | −0.209 [−0.807, +0.229] | −0.014 [−0.493, +0.349] |
    | Cc as C, covered participants only | −0.077 [−0.646, +0.342] | +0.155 [−0.279, +0.491] |
    | A − B (sample) | −0.010 [−0.021, +0.002] | −0.011 [−0.024, +0.003] |
    | B − C (position) | +0.395 [−0.026, +1.005] | +0.288 [−0.091, +0.840] |
    | B − Cc | +0.276 [−0.142, +0.881] | +0.129 [−0.234, +0.656] |

    - **Sample: no effect** (A − B ≈ −0.01).
    - **By D131's rule, positions from before the still run do not account for it:** B − Cc is not near 0.
  - **Tails (post hoc, not in D131), per episode** (19,407 episodes):
    - B − C has median +0.002 (S3₂) and 0.000 (S3₁) frames per 10 mm. 1 % / 99 % quantiles are −8.7 / +9.3.
    - 129 episodes differ by more than 20, and the extremes are −252 and +1,240. All the extremes are 4-ant episodes
      whose three non-initiators lie at nearly equal distances from the initiator (distance SD often < 1 mm, e.g.
      0.77 → 0.03 mm for the +1,240 episode). There the OLS slope is a ratio over a near-zero variance.
    - Trimming 0.5 % per side of the B − C values leaves a mean of +0.029 (S3₂) and −0.032 (S3₁).
    - The primary has the same fragility: per-episode S3₂ (A) has a 1 % / 99 % range of −20.6 / +22.8 frames per 10 mm,
      2,283 of 19,409 episodes with |S3₂| > 10, mean +0.16, median +0.07.
  - **Reading:**
    - **(c)'s loss of the excess is not evidence that the primary is a position artefact.** Its sample is the same
      (98 % present, A − B ≈ 0), its typical episode is unchanged (median B − C ≈ 0), and its colony mean moves
      because sub-millimetre position changes in a few near-degenerate episodes swing their slopes by tens to
      hundreds of frames per 10 mm.
    - **Nor does it support the primary:** (c) is too noisy to confirm or refute an excess of +0.19.
    - **(c) is also not the clean check D130 assumed:** 14.7 % of participants were not yet still at f0.
    - **The same near-degeneracy sits in the primary statistic and in base.** D129 kept 1e−6 mm² as a numerical
      cutoff, not as evidence of a precise slope, so the heavy tails are by design. They widen gate G's CIs, and they
      may be why the 4–15 subset (sensitivity (a)) includes 0.
    - A robust variant (e.g. a minimum distance spread per episode, or a per-episode median) would be a new rule, and
      would have to be applied to the data and base alike. That is the user's call; gate G stays as read (D130).
    - (d) is still pending.
  - **Finding:** F092 updated (the "(c), unexplained" clause replaced by this reading).
