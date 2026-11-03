---
id: D266
date: 2026-11-03
time: 15:16
kind: decision
title: User: Q37 answered (D265): a support-only empirical audit of T060 Stage 0 through an explicitly restricted support reader that outputs only the agreed counts and unknown-history causes; the result described as support retained by the frozen extraction, not as the true number of intervals or triplets, and not as evidence against contact resetting; tag 52 kept conservative, colony 237's retag ambiguity flagged separately; if support fails, the comparison closes as unsupported by this extraction and observation rule, any redesign a separate decision; a gated commit of the current records
authority: user
scope: Q37 T060 P164
---
- **2026-11-03 ≈ 15:16 UTC — User: Q37 answered (D265): a support-only empirical audit of T060 Stage 0 through an explicitly restricted support reader that outputs only the agreed counts and unknown-history causes; the result described as support retained by the frozen extraction, not as the true number of intervals or triplets, and not as evidence against contact resetting; tag 52 kept conservative, colony 237's retag ambiguity flagged separately; if support fails, the comparison closes as unsupported by this extraction and observation rule, any redesign a separate decision; a gated commit of the current records.**
  - **The user's answer (in the session, verbatim):**

    > In response to Q37: I favor the support-only empirical audit. It would establish whether this extraction retains enough usable histories in the real recordings. Scope B alone establishes failure under its synthetic observation settings.
    >
    > This does **not** count against contact resetting as a biological mechanism. Scope A shows the statistical reader works on suitable event tables; Scope B shows that obtaining those tables is the problem.
    >
    > I would make two corrections to the proposed go-ahead:
    >
    > - **The counts are affected by extraction failures.** Spurious onsets can split intervals and change triplet counts. Describe the result as “support retained by the frozen extraction,” without treating it as the true number of biological intervals or triplets.
    > - **Use an explicitly restricted support reader.** The current [Stage 0 CLI](/home/norma/repos/ants/scripts/scratch/t060/stage0.ts:60) prints regularity estimates and labels. The audit should output only the agreed counts and unknown-history causes, returning to you if support unexpectedly passes.
    >
    > Keep tag 52’s conservative treatment for this audit and flag colony 237’s retag ambiguity separately.
    >
    > If support fails, close this comparison as **unsupported by this extraction and observation rule**. Any redesign should remain a separate decision.
    >
    > A gated commit of the current records is also reasonable now.
  - **Effect:**
    - Q37 is answered with its first option (the support-only empirical reading), as corrected above. Scope B's
      acceptance (P164's "V0 pass") is waived for this support reading only; P164 stands for everything else, and
      nothing beyond support is read.
    - The reading is done by a new, explicitly restricted support reader, not by `stage0.ts` (which prints 0b's
      estimates and labels and is never run on tracks). The lead's details (what it outputs, what it may not compute,
      the colony-237 flag, the freeze, the stop rules) are in D243's dated block of 2026-11-03 ≈ 15:18 UTC.
    - The result is worded as support retained by the frozen extraction; Scope B's spurious accepted onsets (D265 rule
      3) can split intervals, so the counts are not the true numbers of biological intervals or triplets. Neither a
      failure nor a pass counts against, or for, contact resetting as a biological mechanism.
    - If support fails, T060 closes with the comparison unsupported by this extraction and observation rule; a
      redesign (Q37's third option) is not opened by that close and would need its own decision.
    - The records as they stand are committed now, gated.
