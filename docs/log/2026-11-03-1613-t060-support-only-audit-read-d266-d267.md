---
id: D269
date: 2026-11-03
time: 16:13
kind: reading
title: T060 support-only audit read (D266, D267; frozen code 0e13c45): support retained by the frozen extraction fails in the primary and in every sensitivity (0a 0/22 colonies counting, 0b entry 0/22; no light-phase inactive interval has a complete history: 46,928 recorded, all unknown, 42,569 by partnerBlind and 4,359 by partnerUnbracketed); the stop rule applies, so the three-interval comparison is unsupported by this extraction and observation rule and T060 closes; colony 237's tag 52 is read on 77,486 light-phase frames and is not pivotal
---
- **2026-11-03 ≈ 16:13 UTC — T060 support-only audit read (D266, D267; frozen code 0e13c45): support retained by the frozen extraction fails in the primary and in every sensitivity (0a 0/22 colonies counting, 0b entry 0/22; no light-phase inactive interval has a complete history: 46,928 recorded, all unknown, 42,569 by partnerBlind and 4,359 by partnerUnbracketed); the stop rule applies, so the three-interval comparison is unsupported by this extraction and observation rule and T060 closes; colony 237's tag 52 is read on 77,486 light-phase frames and is not pivotal.**
  - **What ran:** the frozen `scripts/frozen/t060/` code (commit 0e13c45; SHA-256s in D243's freeze block), run
    `t060-support-audit-20261103` (`logs/runs/t060-support-audit-20261103-20261103T160635Z`, gate
    `run:t060-support-audit-20261103`, exit 0, about 7 min): per colony the extraction in memory, no event table written,
    and the restricted support reader; outputs `logs/t060-support/support-c<i>.json` and `pooled.json` (whitelisted
    counts only). Data: the 22 Stroeymeyt fit colonies, PreTreatment, light phase 06–18 UTC (development use).
  - **Support retained by the frozen extraction** (D266's wording; these are the extraction's counts, not the true
    numbers of biological intervals or triplets, since spurious accepted onsets can split intervals, D265 rule 3):

    | variant | 0a colonies counting | 0b colonies entering | light intervals | with observed onset | no unknown frame | complete | unknown: partnerBlind / partnerUnbracketed |
    |---|---|---|---|---|---|---|---|
    | primary | 0 / 22 | 0 / 22 | 46,928 | 18,975 | 0 | 0 | 42,569 / 4,359 |
    | v10 (v = 10 mm/s) | 0 / 22 | 0 / 22 | 46,928 | 18,975 | 0 | 0 | 41,790 / 5,138 |
    | bridge (focal bridging) | 0 / 22 | 0 / 22 | 80,582 | 58,270 | 0 | 0 | 73,931 / 6,651 |
    | plain (plain onset) | 0 / 22 | 0 / 22 | 44,329 | 21,963 | 0 | 0 | 40,220 / 4,109 |
    | nodeath (no death record) | 0 / 22 | 0 / 22 | 46,928 | 18,975 | 0 | 0 | 42,569 / 4,359 |

    - **Primary verdict:** "support retained by the frozen extraction: fails" (0a fails, 0b entry fails).
    - No interval in any variant is free of an unknown frame, so there are no contact or reference triplets, no
      triplet candidates with an observed pattern, no matched triplets, and no supplying ants or uncensored intervals
      for 0b. Every unknown interval's earliest cause is a partner: `partnerBlind` (rules (i) and (ii) of the 06:51
      block, not separated in the output) or `partnerUnbracketed` (iii). No interval became unknown first by a focal
      gap, an exit or an unknown onset status.
    - Bouts after a light interval with an observed onset (primary): 18,473, of which 4,507 complete; incomplete by
      cause: focal gap 11,236, unknown onset status 2,729, exit 1.
    - Tags on the colonies' lists 2,553, of which 115 unseen in the light phase; no interval was made unknown only by
      unseen tags, with or without the death record.
  - **Colony 237, flagged separately (P181):** tag 52 (from `retagged_ants.txt`, kept as a partner, unseen unless read)
    is read on 77,486 light-phase frames, so it is not an unseen tag; colony 237 has no interval made unknown only by
    unseen tags, does not count for 0a and does not enter 0b, and is pivotal for neither (no other colony counts or
    enters). The retag ambiguity cannot change this result.
  - **The reading, by the stop rule (D266, D267; P182, P185):** the primary's support fails and no sensitivity's counts
    would pass the same rule (all are 0 / 22 on both parts). So **the three-interval comparison is unsupported by this
    extraction and observation rule**, and T060 closes. Nothing beyond support was computed: 0b's estimator, its
    reference and Stage 1 were never run on these tracks.
  - **What it means, and what it does not:**
    - It agrees with Scope B's synthetic forecast (D265): under D243's complete-history rule (P153), with every tag a
      possible partner and v = 20 mm/s (or 10 mm/s), these tracks' detection leaves no inactive interval of at least
      60 s with a complete PDC history. Scope A (D264) showed the reader works on suitable event tables; this shows the
      real tracks do not yield them under this rule.
    - It does **not** count against contact resetting as a biological mechanism (D266; P179), and it says nothing for
      it either. It is a statement about this extraction and observation rule on these recordings.
    - A redesign (a different completeness rule, a corrected sustained-onset rule) is not opened by this close; it
      would be a separate decision (P183).
