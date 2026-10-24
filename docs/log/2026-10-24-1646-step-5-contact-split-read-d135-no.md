---
id: D139
date: 2026-10-24
time: 16:46
kind: reading
title: Step-5 contact split read (D135): no implementation mismatch indicated (the main partner is never counted twice within its bout); the excess sits in contacts made while walking after the main bout began and with third parties, which only the paper's contact definition can settle; clearance of Mailleux 1999 requested
---
- **2026-10-24 ≈ 16:46 UTC — Step-5 contact split read (D135): no implementation mismatch indicated (the main partner is never counted twice within its bout); the excess sits in contacts made while walking after the main bout began and with third parties, which only the paper's contact definition can settle; clearance of Mailleux 1999 requested.**
  - **Run:** `contactsplit-20261024T162235Z`, local, ok, 18 m 50 s
    (`scripts/scratch/contactSplit1999.ts`). D106's base arm on the judge seeds, 240 recruiters per day, with
    `contactLog`. Output: `logs/step5/contactSplit.json`.
  - **Checks (all pass):**
    - **Reproduction:** contact means equal D106's arms to three decimals: base 8.217 / 6.846 / 7.267 at ≥ 0.04 s,
      contact1 6.525 / 5.446 / 5.842 at ≥ 1 s.
    - **Classes anchored:** the "pre" class equals contactsBefore (2.468 / 1.069 / 1.410 at ≥ 0.04 s).
    - **Switch bit-identical when off:** the new `test/m1999.test.ts` case passes, and the 1999 identity hash
      `dddbafeb…` is unchanged. simHash b88c5026… → 27482bdb…; 9 results re-stamped (`scripts/scratch/restampD135.ts`,
      `provenance.restamped`, reason D135). `npm test` and tsc clean.
  - **Classes** (mean per recruiter with a bout, 201 / 232 / 234 of 240; 1 / 4 / 8 d):

    | Class | ≥ 0.04 s (judged) | ≥ 1 s |
    |---|---|---|
    | pre (= contacts before) | 2.47 / 1.07 / 1.41 | 2.06 / 0.89 / 1.22 |
    | partner-first | 1.00 / 1.00 / 1.00 | 1.00 / 1.00 / 1.00 |
    | partner-repeat inside M | **0.00 / 0.00 / 0.00** | 0.00 / 0.00 / 0.00 |
    | partner-repeat after M | 0.45 / 0.54 / 0.63 | 0.31 / 0.38 / 0.41 |
    | third party during M | 0.58 / 0.99 / 0.96 | 0.47 / 0.82 / 0.83 |
    | other bout: its partner | 0.26 / 0.51 / 0.43 | 0.25 / 0.50 / 0.43 |
    | other bout: third party | 0.19 / 0.30 / 0.27 | 0.18 / 0.27 / 0.23 |
    | **walk** (after M began, outside bouts) | **3.87 / 2.59 / 2.67** | 2.77 / 1.70 / 1.85 |
    | **post-M total** (± SE) | 6.35 ± 0.32 / 5.93 ± 0.23 / 5.96 ± 0.26 | 4.99 / 4.68 / 4.75 |
    | data post-M (contacts − before) | 3.1 / 2.3 / 2.3 | (same) |
    | **excess** | 3.25 / 3.63 / 3.66 | 1.89 / 2.38 / 2.45 |

    - Same-nestmate re-contacts within 1 s of the previous episode: 1.08 / 0.78 / 0.93 at ≥ 0.04 s, 0.48 / 0.30 /
      0.39 at ≥ 1 s. Descriptive, outside the rule.
  - **Reading (D135's fixed rule; D138 item 1 on what counts as a bug):**
    - **Rule 1, implementation mismatch: does not fire.** The main partner is never counted a second time while its
      bout continues (0.00 on every day, both thresholds). Nothing here is shown wrong by a test of our own code.
    - **Rule 2 applies.** Walk, third-party-during-M and other-bout third-party contacts total 4.64 / 3.88 / 3.90 at
      ≥ 0.04 s, against an excess of 3.25 / 3.63 / 3.66. Walk alone is 3.87 / 2.59 / 2.67, and it stays the largest
      class at ≥ 1 s. Whether Mailleux scored such contacts (brief antennations while walking, passers-by during a
      trophallaxis) cannot be settled from our extraction, which records only "filmed for 20 min at ×2".
      - **Clearance of Mailleux 1999 is requested** (the user's decision), for its Methods' contact definition.
      - **Nothing reopens before that.** Under D138 item 1, a mismatch becomes a bug only when a test encodes the
        paper's stated definition and our observer fails it.
    - **Also disclosed:**
      - The model stays shorter than the data (79 / 66 / 66 s vs 113 / 80 / 82) yet makes about twice the post-M
        contacts. So its contact rate while walking in the nest is high even with density at its floor (F093's
        trade-off).
      - Re-contacts of the same nestmate within 1 s (≤ 1.1 per recruiter) could at most explain about a third of the
        excess even if a scorer merged them. That too is a definition question for the paper.
    - **If the paper scores every antennal contact**, the excess is structural: encounters while walking, as F093
      describes. No mismatch, and the stopping rule stands.
