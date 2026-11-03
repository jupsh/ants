---
id: D265
date: 2026-11-03
time: 09:01
kind: review
title: T060 Stage 0 brief 2 built and checked (extraction, Scope B, reproduction, speed bound, stage0 CLI): the reproduction passes (onsets, PDCs, Test B, grid and bins equal in all 22 colonies; F009 nurse endpoints 3.861 and 0.161) and the speed bound passes (0.0002 % of steps above 20 mm/s); but the Scope B smoke shows Scope B's rules cannot be met for a reason in the design (P166): under the frozen detection chain every interval is unknown from its first frame by the partner blind-opportunity rule, so 0a and 0b have no support, and 4.6-7.1 % of accepted onsets are spurious against a 1 % rule; back to the user
---
- **2026-11-03 ≈ 09:01 UTC — T060 Stage 0 brief 2 built and checked (extraction, Scope B, reproduction, speed bound, stage0 CLI): the reproduction passes (onsets, PDCs, Test B, grid and bins equal in all 22 colonies; F009 nurse endpoints 3.861 and 0.161) and the speed bound passes (0.0002 % of steps above 20 mm/s); but the Scope B smoke shows Scope B's rules cannot be met for a reason in the design (P166): under the frozen detection chain every interval is unknown from its first frame by the partner blind-opportunity rule, so 0a and 0b have no support, and 4.6-7.1 % of accepted onsets are spurious against a 1 % rule; back to the user.**
  - **What was built** (implementer, brief `logs/handoff/20261103-0655-t060-s0-extract/brief.md`, details in D243's
    2026-11-03 ≈ 06:51 block, gate `run:t060-s0-brief2`; report saved beside it): in `scripts/scratch/t060/` (scratch
    until frozen) `extract.ts` (the extraction pass, one code path for tracks and Scope B, primary and the v10, bridge,
    plain and nodeath variants; CLI with a required `--out` and a `--repro` mode), `scopeB.ts` (generator, truth,
    scoring, end to end through `readStage0`), `repro.ts`, `stage0.ts` (reads a folder of event tables, labels the
    primary only), `argvGuard.ts` (stops the frozen H6 extractor's CLI from running on import), 26 new tests;
    `events.ts` changed only as the block allows (the relaxed `validateColony`, an optional descriptive field).
    SHA-256 prefixes: extract.ts 30245cb4 (the runs used bd5200bc; three EDGE comment lines differ), scopeB.ts 3610bc4a,
    repro.ts e43a2113, stage0.ts 751f67e9, argvGuard.ts fad6e77f, events.ts bec9264b, t060.extract.test.ts f2e1757f;
    reader.ts (01d574a3) and scopeA.ts (ca53b396) unchanged; nothing under `scripts/frozen/` or `src/` changed.
  - **The lead's check:** file and output hashes match the report; `npx tsc --noEmit -p .` clean; T060 tests 56/56;
    `npm test` passed in the implementer's run (292). The Scope A identity check: the seven `brief2-scopeA` files equal
    `logs/t060-synthetic/scopeA/`'s once the wall-clock `seconds` field is masked (3 lines per file differ, nothing
    else), so the `events.ts` change leaves Scope A's results unchanged. The blind-opportunity code (`pairHit`) and the
    relaxed validation were read against the 06:51 block and match it.
  - **Reproduction (P164's condition; D243 amendment 1): passes.** In every one of the 22 colonies the light-phase plain
    onsets equal OnsetStats' (and `logs/contacts/data-c<i>.json`), the PDCs between `roles()` ants equal ContactOnset's
    frame by frame (0 mismatched), Test B's onset counts equal `logs/contacts/tb-c<i>.json` in light and dark, and the
    grid and bins equal H6's frozen intermediates. F009's nurse hazard from the pass's bounded still runs: 3.861 (10–20 s)
    and 0.161 /min (> 640 s), against cbAgg's 3.862 and 0.161 on the original files; both round to F009's 3.86 and 0.16.
    The other bins agree to within 0.001 (foragers likewise). The real event tables were built in memory and passed
    `validateColony`; none was written or printed (P164).
  - **Speed-bound check (P165): passes.** 295 of 152,646,548 light-phase in-nest steps (0.0002 %) and 295 of 3,988,617
    moving steps (0.0074 %) exceed 20 mm/s, both far below 0.1 %. So the 20-mm/s bound is not set by the data's own
    fast steps, and P165's condition is not triggered.
  - **Scope B smoke (one data set per case; not V0): its rules cannot be met, for a reason in the design (P166).**
    - Case a / case c: 89,177 / 93,531 pipeline intervals; **every one unknown from its own first frame** (unknown frame
      = start at the 10th, 50th and 90th percentiles), cause `partnerBlind` in all but 8 / 8 (`partnerUnbracketed`). So
      rules (1) and (2) have no denominator; 0a counts 0/22 colonies; 0b has no entering colony; the label is "not
      established" (support) and Stage 0 "not identifiable". The four sensitivities (v = 10 mm/s, bridging, plain onset,
      no death record) are the same.
    - **Why:** the design's own partner rule (ii) with v = 20 mm/s makes any partner within about 14 mm that is unread
      for a single frame a blind contact opportunity. Under the frozen detection chain (92.7 % detected, mean gap 2 s)
      and the real colonies' numbers of ants in the real nest areas, some 25–30 partners are that close, so on most
      frames at least one of them is unread (1 − 0.927^25 ≈ 0.85). The lead's focal-side blind frames (06:51 block)
      add to this but are not needed for it. Independently of partners, focal breaks (an unread run of 3 or more frames,
      about once a minute per ant under that chain) end most intervals: only 14.1 % (a) and 8.4 % (c) end in an observed
      onset, and 373,520 / 363,597 still runs reaching 120 frames were not recorded because their start followed a
      break.
    - **Rule (3)** (at most 1 % of accepted onsets at frames where the ant is truly still) fails as well: 574 of 12,575
      (4.56 %, a) and 552 of 7,825 (7.05 %, c). By mechanism (pooled a / c): a misread 1–3 frames before the candidate
      after a 2–3-frame gap, whose step divided by the gap falls under 0.6 mm/frame and is classed still, so the step
      back becomes a candidate measured from the misread position (208 / 232); misreads both at the candidate and in
      the +3 … +6 check window (148 / 155); a misread just before a true onset, accepting it up to 6 frames early
      (212 / 157). These follow from the sustained-onset rule as written (D243 amendment 1 point 5, 06:51 block).
    - Cost: about 720 s and about 1 GB per data set; the full 50 + 50 would be about 2 h at `--par 10` on an otherwise
      idle machine.
  - **What it means:** under D243's complete-history rule (P153) and Scope B's frozen observation model, no inactive
    interval of at least 60 s has a complete PDC history, so the three-interval comparison cannot be supported by these
    tracks' kind of detection. That is a synthetic result: it shows what the extraction gives under the generated
    detection, not the real share of unknown histories. Whether the real tracks differ (clustered gaps, fewer nearby
    partners) is not known; the real event tables stay unbuilt and sealed (P164). Since Scope B's rules (and with them
    V0) cannot pass, D243's order says nothing empirical is read and the user decides (P166); question raised on T060.
  - **Accepted by the lead as implementation details:** the report's `// EDGE:` readings (a break is a gap of more than
    3 frames between reads, i.e. 3 or more unread frames, the step rule's own tolerance; events at or after 18:00
    censor at 18:00; a run starting at the accepted onset's own read is not recorded and its bout is incomplete;
    the +3 … +6 check uses any read; ties between causes in CAUSES order; (ii)'s unknown frame is floor(a) clamped to the
    span; the Scope B truth definitions; and the rest as listed in the report). Pending with the question: the
    colony-237 old tag 52 (in `retagged_ants.txt`, not in its tag file), added as a partner; if unread, every
    colony-237 interval is unknown.
  - **Exposure:** PostTreatment tag-file header lines and line counts were printed while locating `retagged_ants.txt`,
    by the lead and the implementer; header only (X029).
