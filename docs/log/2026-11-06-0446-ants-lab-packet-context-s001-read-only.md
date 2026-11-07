---
id: D319
date: 2026-11-06
time: 04:46
kind: run
title: ants-lab packet context (S001), read-only plied in the boxes, suggestion commands and carried outputs built and checked; 571 + 11 tests; the lead's readings of the deviations
---
- **2026-11-06 ≈ 04:46 UTC — ants-lab packet context (S001), read-only plied in the boxes, suggestion commands and carried outputs built and checked; 571 + 11 tests; the lead's readings of the deviations.**
  - **Brief and report:** `logs/handoff/20261106-0425-lab-packet-plied/` (with follow-up 1, D317's fix). Gate
    `run:lab-packet-plied`. Tree `823c84db` → `394ecda9`. Lead's check: 571/571, tsc 0, Docker 11/11, the wrapper read.
  - **Built:** `context/` (the ids the node and its governing entries cite, one hop, whole, hashed, cap 250 KB, sealed
    withheld by id); on T064 the dry run carries 54 files (243,146 bytes), S001's ids all included. `lab suggestions
    show|approve [--implemented-by D…]|decline`. plied in every box: the host binary read-only behind
    `bin/plied-in-box` (read subcommands only; `--as`, `--session`, `--expect`, `-C` refused; runtime on tmpfs);
    in-image `ldd` resolves. Declared outputs carried into `packets/<step>/outputs/` and ask packets, and into later
    steps' `prior/`.
  - **Lead's readings of the deviations:**
    - The clerk keeps an unwrapped plied: DESIGN (Roles) gives the clerk record writes; they land in its workspace and
      reach the checkout only through review and the conductor, so D316's "agents never write" holds for the checkout.
    - `messages` is a read (`prompts/researcher.md` tells the researcher to run it): added to the wrapper in the
      rehearsal brief.
    - `prior/` has its own budget of the same size: kept.
    - The 250 KB cap stays: the packet makes the records available; the prompt says to read what the step needs.
    - L0004's draft is not in any step packet: a journaled one-off backfill carries the recovered file (sha256
      `4079cf20…`) into `packets/L0004/outputs/`, so the next T064 step sees it under `prior/`. No commit.
