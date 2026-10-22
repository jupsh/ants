---
id: D074
date: 2026-10-19
time: 22:13
kind: reading
title: Backlog B014 done: lazy resting ants, bit-identical switch (proposal, unapplied); V8 pretenuring finding filed as B022
---
- **2026-10-19 ≈ 22:13 UTC — Backlog B014 done: lazy resting ants, bit-identical switch (proposal, unapplied); V8 pretenuring finding filed as B022.**
  - **User decisions (this session, in the item's Progress):**
    - DESIGN rev 1 (event skipping, drive clock) was approved in direction, with three defects:
      - encounter expiry was reversed;
      - timestamps change decisions (100 × 0.05 summed is 4.99999999999999);
      - the drive-clock boundary was unspecified.
    - Rev 2 (an exact per-step rest tick handing every other branch back to the original policy) was approved, with
      implementation before step 5 as long as the C2 fit is not affected. Nothing ran on the box, and the main tree
      is unchanged.
  - **Result** (`backlog/B014-…/README.md` Findings; `proposal.patch` unapplied):
    - `lazyRest` (`newColonySim` → `LazyColonySim`) is **bit-identical** to stepping. Hashes are equal for D048's
      three byte-for-byte checks, Mailleux at both motions (days 1/4/8, independent and shared warm-ups, followed
      nestmates) and the 22 colonies through the pool, in all three arms: main checkout, switch off, switch on.
    - The per-step verification mode (the original policy run on a copy at every tick) found no difference.
    - Boundary tests against the original policy are in the patch; mutation checks showed they catch late and early
      hand-backs.
  - **Speed** (medians of 3, back to back):

    | Workload | Speed-up |
    |---|---|
    | colony122 | 1.37× |
    | Mailleux C2-proxy, 138 nestmates | 1.40× |
    | Mailleux C2-proxy, 53 nestmates | 1.15× |
    | Mailleux pilot motion | none |

    Below the design's 1.6–1.8× estimate: the tick costs about what `decide` did. For step 5 it is a small lever
    beside B008's.
  - **Correction of B014's motivation:** the simulated 1999 nests hold 23–138 nestmates; the "10×" applied to the
    real colonies. Corrected in the item's README and GUIDE, dated.
  - **Found on the way:**
    - Stepped colony runs are bimodal in time, ≈ 30 s or 35–38 s on colony122, depending on incidental heap layout.
      Unpatched main shows it when it merely retains memory.
    - It is V8 allocation-site pretenuring: gone with `node --no-allocation-site-pretenuring` (main and patched,
      9/9 fast).
    - The patch keeps the stepped modules' runtime code unchanged, after a first layout made the switched-off path
      fall into the slow regime more often.
    - May cost box fit time: **B022** (unscoped).
  - **When applied:** the simHash moves, so `npm test`'s findings check flags F058–F062 stale (their code paths are
    bit-identical) until re-stamped. Script flags (`--lazyRest` in the fit and judging scripts) are not part of the
    patch.
  - Finding F066.
