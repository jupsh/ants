---
id: D209
date: 2026-10-30
time: 21:56
kind: correction
title: Three defects in the Part 2 item 1(a) script (lead-written, before D208): all inputs held in memory (machine crash), light blocks keyed by hour (self-check failure, P88), a 12-bin threshold fixed for every window (guard stop); each caught before any value was read, fixed in D207's amendments 1-3
---
- **2026-10-30 ≈ 21:56 UTC — Three defects in the Part 2 item 1(a) script (lead-written, before D208): all inputs held in memory (machine crash), light blocks keyed by hour (self-check failure, P88), a 12-bin threshold fixed for every window (guard stop); each caught before any value was read, fixed in D207's amendments 1-3.**
  - **Logged for D208's defect count** (code defects as `--kind correction`). The details, causes and fixes are in
    D207's amendments 1-3; this entry only counts them. The lead wrote `scripts/scratch/partDBlocks.py` before D208
    handed implementation to the implementer.
    1. **Memory** (amendment 1): the script held all ~550 inputs whole (~23 GB of JSON) and the machine crashed. Caught
       by the crash; no output.
    2. **Block keying** (amendment 2): light blocks keyed by start hour, so a second-morning 06-10 fragment overwrote
       the first-day block in 8 colonies. Caught by P88's self-check (data pooled 6.3191 against 6.2762); the output
       was set aside unread.
    3. **Threshold** (amendment 3): "half a block" written as a fixed 12 bins, right only at 10 min. Caught by the
       guard added in amendment 2; no output.
  - **Lead's account of the cause:** a new script instead of the Stage 2b reader's tested `dwOf`; coverage checked
    on two of nine cells before the design; no smoke test on one or two colonies, and input sizes not checked.
  - **Also a code-reading defect, logged earlier:** D204 (the S1 window keys read as seconds in D194).
