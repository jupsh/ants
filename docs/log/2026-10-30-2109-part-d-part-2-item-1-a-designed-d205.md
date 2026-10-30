---
id: D207
date: 2026-10-30
time: 21:09
kind: design
title: Part D Part 2 item 1(a) designed (D205, D206; P81-P83): the data's D_w by 4-h light block (06-10, 10-14, 14-18 UTC) on 22 colonies, each colony weighted equally, beside every Stage 2b arm's per-run value; joint colony bootstrap (2,000 draws); blocks with >= 12 of 24 bins, full blocks as a sensitivity; descriptive, Stage 2b's classes copied beside, nothing simulated
---
- **2026-10-30 ≈ 21:09 UTC — Part D Part 2 item 1(a) designed (D205, D206; P81-P83): the data's D_w by 4-h light block (06-10, 10-14, 14-18 UTC) on 22 colonies, each colony weighted equally, beside every Stage 2b arm's per-run value; joint colony bootstrap (2,000 draws); blocks with >= 12 of 24 bins, full blocks as a sensitivity; descriptive, Stage 2b's classes copied beside, nothing simulated.**
  - **What:** D205 Part 2 item 1(a), approved by the user as the next step (D206): where in the light phase the data's
    slow synchrony sits, and how the Stage 2b arms' values compare with each block. Descriptive: no rule, no new class,
    no placement. Development data only (the 22 Stroeymeyt fit colonies, light). Nothing is simulated.
  - **Inputs (existing, already inspected):**
    - data `logs/short/data-c{0..21}.json` (`sync`, as Stage 2b read them);
    - the 12 Stage 2b arms (T20f, T20m, Eu-M, El20-M, Ed2, Ed5, Ed20, Ew5, Es, controls Eu and El20, base),
      `logs/short/pd-as-<arm>-r{0,1}-c{0..21}.json`;
    - `logs/partd2/assess/read.json`, only to copy the Stage 2b row classes beside.
  - **Statistic:** `syncStats`'s D_w per block, num / den of that block (each ant's mean taken within the block).
    - Groups all ants, nurses, foragers. Windows **10 min (primary)**, 1 min and 5 s beside (D204).
    - Data blocks follow the clock: the light blocks start at 06, 10 and 14 UTC. Each simulated run is one 4-h block
      with no clock, after the 2-h warm-up.
  - **Coverage (P81), fixed before computing:**
    - Every data colony has the three light blocks. Only bin counts were looked at (no num, den or D): the 10-14 and
      14-18 blocks have 24 or 25 ten-minute bins in every colony, and the 06-10 block is partial in 8 colonies (14-23
      bins). **Incomplete (amendment 2):** the same 8 colonies also have a second-morning 06-10
      block of 1-10 bins. Every simulated run has one block of 24 bins.
    - **Primary:** a block enters with >= 12 of its 24 bins (every light block qualifies). **Sensitivity:** full blocks
      only (>= 24 bins), which drops the 8 partial 06-10 blocks; a contrast then uses the colonies that have both blocks.
    - The pooled light value is the Stage 2b reader's (all light blocks, Sum num / Sum den), so the check below holds.
  - **Colony weighting (P81):** each colony counts once. A set's value is the mean over colonies of the colony values,
    as the Stage 2b rows. An arm's colony value pools its two runs (Sum num / Sum den), as the reader does.
  - **Uncertainty (P81):** one joint colony bootstrap: 2,000 draws of the 22 colony labels with replacement, the same
    colonies for the data and every arm in each draw (D203's practice). 95 % percentile intervals (sorted index
    0.025 B and 0.975 B - 1). Seed `random.Random(0xD207)`, draws generated once and shared by every cell. An interval
    is reported only if >= 99 % of draws are defined.
  - **Reported, per group and window:**
    - **data by block:** the colony mean D_w of each light block (06, 10, 14) and the paired contrasts 10 - 06,
      14 - 06 and 14 - 10, with intervals;
    - **block-to-block spread:** per colony, the mean absolute difference between its blocks' D_w (data: its 3 light
      blocks, 3 pairs; arms: its 2 runs, 1 pair), averaged over colonies, and arm minus data. Under exchangeable blocks
      the mean pairwise absolute difference does not depend on the number of blocks. The data's blocks are consecutive
      in one colony, the arms' runs are independent starts, so shared colony state would make the data's spread smaller,
      not larger;
    - **each arm:** its pooled value, and its difference from the data's pooled value and from each data block, with
      intervals;
    - beside, Stage 2b's row class for each arm (copied from `read.json`, unchanged).
  - **Self-check before reading:** the pooled data and arm values at all ants 10 min must equal D194's (data 6.28;
    T20f 3.81, …, base 1.20; F104) to the printed precision. If not, nothing is read and the cause is logged.
  - **Reading rules (D206; P80, P82, P83), fixed now:**
    - A difference whose interval includes 0 is "unresolved", never "matches". A block contrast is not called a trend.
    - Stage 2b's outside and unresolved classes are kept as they are (P82): this descriptive never reclassifies a row,
      and a per-block difference is not a class.
    - A block pattern in the data shows variation the members do not represent; it does not distinguish an external
      driver from an internal rhythm, changing colony composition or recording effects (P83).
    - Time of day is confounded here with time since the recording started (handling, settling): every colony starts
      its light phase in the 06-10 block, so the two cannot be separated with these data.
    - The shortfall at 10 min does not establish a 10-min oscillator (P80). 9 contrasts per window (3 per group) and
      12 arms are reported in full; no selection.
  - **Script:** `scripts/scratch/partDBlocks.py` (md5 ~~`5dfdcc9f`~~ ~~`db6a9535`~~ ~~`14977bd0`~~ `7ebffa33`, amendments below), `python3 -I`,
    output `logs/partd2/blocks.json` (absent now). Gated as `run:partdblocks` on T033. ~~About a minute~~ (see the
    amendment); no seal, since the reading follows at once.
- **2026-10-30 ≈ 21:25 UTC — Amendment (implementation only), before any output exists.** The first run
  (`partdblocks-20261030T211023Z`, gated `run:partdblocks`) exhausted the machine's memory and the computer crashed. The
  script held every input whole: ~550 files, ~23 GB of JSON (the runs' files carry tracks and bins besides `sync`).
  It wrote no output and no exit record; nothing was read. **Fix:** each file is parsed alone and only `colony` and
  `sync` are kept (`slim`); peak ≈ 0.5 GB for the largest file, measured on memory alone. Statistic, coverage,
  weighting, bootstrap, seed and reading rules are unchanged. New md5 `db6a9535`; ≈ 20–40 min locally, gated afresh as
  `run:partdblocks-2`.
- **2026-10-30 ≈ 21:40 UTC — Amendment 2: the self-check failed (P88); cause found and fixed; nothing else read.**
  - **Run:** `partdblocks-2-20261030T212231Z` (gated `run:partdblocks-2`), exit 0 after ≈ 9.5 min, peak ≈ 330 MB.
    Output md5 `c91854ee`, moved aside unread to `logs/partd2/blocks-selfcheck-failed-c91854ee.json`.
  - **Self-check (P88):** only the pooled all-ants 10-min values were printed. All 12 arms equal `read.json`'s
    exactly (and D194's to the printed precision). The data's did not: 6.3191 against 6.2762. Nothing else in the file
    was read.
  - **Cause:** the script keyed each colony's light blocks by start hour. The 8 colonies whose 06-10 block is partial
    were recorded into the next morning, so they also have a second 06-10 block of 1-10 bins (labels day x 100 + hour,
    e.g. colony112: 1637906 with 19 bins and 1638006 with 5). The later block overwrote the earlier one, so the
    first-day 06-10 block was missing from the pooled value, and its per-block value was dropped by the >= 12-bin rule.
    Found from block labels and bin counts only. D207's coverage statement had missed these fragments (marked above).
  - **Fix:** blocks keyed by label. Per-block values use blocks with >= 12 bins, at most one per start hour, and the
    script stops if two qualify (none of the fragments does). The pooled value keeps every light block, as the reader
    does, so the fragments stay in it. md5 `14977bd0`; everything else as designed. Rerun gated as
    `run:partdblocks-3`; the self-check (P88) opens its reading again.
- **2026-10-30 ≈ 21:55 UTC — Amendment 3: the coverage threshold scales with the window; nothing read.**
  - **Run:** `partdblocks-3-20261030T213338Z` (gated `run:partdblocks-3`) stopped on amendment 2's guard: "colony112:
    two light blocks at 06 UTC with >= 12 bins". It wrote no output.
  - **Cause:** the threshold was fixed at 12 bins, which is half a block only at 10 min. A 4-h block has 24 bins at
    10 min, 240 at 1 min and 2,880 at 5 s, so at the finer windows a second-morning fragment cleared 12 bins.
  - **Fix, as the design meant it:** a block enters with >= half its window's bins (12, 120, 1,440), and the
    sensitivity keeps full blocks only (24, 240, 2,880). md5 `7ebffa33`.
  - **Coverage, from bin counts only** (no num, den or D), every group and window: each colony has exactly one
    qualifying block at each light hour (06, 10, 14), so 22 colonies per block and the guard cannot fire. Full blocks:
    10-14 and 14-18 in all 22; 06-10 in 14 colonies at 10 min and 11 at 1 min and 5 s.
  - Rerun gated as `run:partdblocks-4`; P88's self-check opens the reading.
