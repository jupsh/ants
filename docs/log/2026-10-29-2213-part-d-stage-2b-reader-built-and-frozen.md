---
id: D185
date: 2026-10-29
time: 22:13
kind: design
title: Part D Stage 2b reader built and frozen (P64; D174 Part B): the 20 rows, support, missing statistics, D117 equivalence, the S2-J MC rule with one extension, Stage 3a and the descriptive rows; dry run on Part C's files identical to the S2 audit and Stage 0; one gap in Part B for the user to confirm; no Stage 2b output read
---
- **2026-10-29 ≈ 22:13 UTC — Part D Stage 2b reader built and frozen (P64; D174 Part B): the 20 rows, support, missing statistics, D117 equivalence, the S2-J MC rule with one extension, Stage 3a and the descriptive rows; dry run on Part C's files identical to the S2 audit and Stage 0; one gap in Part B for the user to confirm; no Stage 2b output read.**
  - **What:** the reader P64 asks for, built before any Stage 2b output is read. `scripts/scratch/partD2b.ts`
    (md5 `1ff8b42c`), with `s3Snap2b.py` (`4c78768c`: one run through `s3Audit.py --snap` on the run's own light-phase
    snapshots) and `s3Read2b.py` (`a3efcf64`: `s3AuditRead.py` imported unchanged, its set list extended to the 2b
    arms). Stages: `files` (per run: the S2 audit file, 100 J and A draws, and the S3 audit file; spreadAgg.py's
    per-colony dump for S3-ρ), `ext --arms` (the one MC extension), `read`.
  - **Reused unchanged, hashes checked against their freezes:** `s2AuditFile.ts` `d888bb33`, `s2Audit.ts` `f9ef0fb4`,
    `s2AuditGate.ts` `47b8cb7d` (D153); `s3Audit.py` `9ce3f5a2`, `s3AuditRead.py` `c79bec04` (D129); also
    `spreadAgg.py` `964d6926`, `partDMembers.ts` `15edeb88`, `oracleStats.ts` `d78335b7`.
  - **Rules as approved (D158, D159, D174 Part B / D178), as coded:**
    - Rows: S1 D_w in the 8 cells other than all-ants 1 min (±20 % of the data's mean on the row's support); S2 C in the
      five bands and S2-J C − Ê_J[C] (±0.015); S3₁, S3₂ (±1.0 frame per 10 mm). Colony values pool a colony's two runs
      (S1 block sums as Part C; S2 accumulators summed, draw d with draw d; S3 episodes concatenated). Data: the light
      clock blocks, the S2 audit's data files, the Stage 0 S3 audit's per-colony values.
    - Estimable: S1 a finite D_w; S2 and S2-J `colonyStat(…).est` (D145 item 5, ≥ 90 % valid J draws); S3 ≥ 5
      episodes with the statistic defined (D129).
    - Support per row: colonies estimable in the data and in all 12 arms (9 calibrated members, Eu, El20, base); below
      15, data ∩ arm per arm, flagged. Missing (support < 15 or statistic undefined): never equivalent or outside;
      blocks joint reproduction.
    - Equivalence (D117 as `partC.ts`): sim − data, colonies resampled independently, 2,000 draws, [5 %, 95 %].
    - MC (S2-J): each endpoint's MC SE from 200 resamples of each support colony's stored valid J draws, colony
      resamples fixed; resolved beyond 2 MC SE of the nearer of ±0.015; else one extension to 400 draws for that arm and
      the data; still not resolved, "unresolved (MC)". `read` stops after writing only the list of arms needing the
      extension (`ext-needed.json`) and prints nothing else until it has run.
    - Stage 3a: an arm reproduces jointly only if all 20 rows are equivalent; a family reproduces if at least one
      calibrated member does, with its member count; T10f, T10m listed as not calibrated.
    - Descriptive (D158's list, no rule): the S2 audit's L, Ê_J, S2_J, Ê_A, Ê_J − Ê_A, block-mean and reference
      classing, role-pair rows; S3-pair, S3-raw, sensitivities (a)–(c), S3-p and gate G (as Stage 0's reader); S3-ρ;
      S5, S6, S7; mean moving fraction against base (> 20 % flag); the multipliers before and after clipping and the
      clipped fraction (P21, P46). S4 is reported as not recorded (the 2b runs have no `--tb`). Disclosures carried:
      duration, phase, Q03 (P54), P25/P52, S3's failed gate (P43), dependent bands (P51), and Es's clipping (D184).
  - **Specified by the code where the approvals are silent (the lead's):** null streams per file: set index 40 +
    member index (base 51, Eu 52, El20 53), file key run · 100 + colony; the data's extension on the S2 audit's own
    streams (set 0, file key = colony). Equivalence resamples `RNG.stream(0xd2b0 / 0xd2b1, row, arm)`; MC
    `RNG.stream(0xd2b2, m, set index, colony)`, the same draw indices for every band; descriptive 0xd2bd. The S3
    descriptives run one process per arm, each with the full set list, so every set keeps its Stage 0 bootstrap stream.
  - **Gap in Part B, filled provisionally for the user to confirm [confirm] (Q23):** how the extension meets the
    support.
    1. Support is fixed at 100 draws, so the extension never changes which colonies a row uses.
    2. An extended arm's five S2-J rows are all recomputed at 400 draws, arm and data alike; arms not extended are
       compared with the data at 100 draws.
    3. If a support colony has fewer than 90 % valid draws at 400, the row is "unresolved (MC)" for that arm.
  - **Checks:**
    - Self-test on synthetic numbers: class boundaries; MC SE positive; near-zero draw spread resolved; an endpoint
      0.0001 from a boundary with MC SE 0.001 not resolved.
    - Dry run (`--dry`) on Part C's base, Eu and El20 separation files, already read (D156, D166), on the S2 audit's own
      set indices and file keys: S2 accumulators (obs, J, A), S3 per-colony values and all S3 descriptives are
      identical to the S2 audit's files and Stage 0's `s3audit.json`. Two fixes were needed to get there: files read in
      sorted order, and Python's compensated `sum()` (3.12 and later) reproduced in the S3 colony mean. The
      extension path ran (one stand-in arm extended to 400 draws). Supports: 22 colonies for S1 and S3, 20 for S2 and
      S2-J (the data's 20 estimable, D156). The dry run's classes were written to `logs/partd2/dry/read.json` and not
      printed or opened.
    - `tsc` is clean.
  - **Unread:** no Stage 2b output has been opened or computed on. `logs/partd2/assess/` is added to the sealed paths
    until the user confirms Q23. The listing slip of D184 (file names only) is the one exposure.
  - **Next:** after Q23, `files`, then `read` (and `ext` if it asks), then the reading entry. Order relative to the
    capability reading (`partDCap.ts`, P59): independent; neither reads the other's outputs.
