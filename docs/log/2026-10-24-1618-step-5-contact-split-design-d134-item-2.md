---
id: D135
date: 2026-10-24
time: 16:18
kind: design
title: Step-5 contact split design (D134 item 2): the D106 base arm rerun on the judge seeds with a contact log; observed contacts classed by onset relative to the recruiter's bouts; what would count as an implementation mismatch, what needs the paper
---
- **2026-10-24 ≈ 16:18 UTC — Step-5 contact split design (D134 item 2): the D106 base arm rerun on the judge seeds with a contact log; observed contacts classed by onset relative to the recruiter's bouts; what would count as an implementation mismatch, what needs the paper.**
  - **Purpose (D134 item 2):** an observer diagnostic. It locates the model's excess contacts from the main bout on
    (D106: model ≈ 5.8 per day, data 3.1 / 2.3 / 2.3), and says whether any of them could be an implementation or
    observation mismatch. It does not reopen the 1999 work by itself (stopping rule, D094 / D107).
  - **Run:** D106's base arm exactly: the D103 fit (`colony-m1999-c2-main-shared.json`), `seedFor(1999, 'judge')`,
    240 recruiters per day, shared warm-ups 4 per nest, the fit's dt, warm-up, lazy rests and followNestmates.
    - It adds a diagnostic switch `contactLog` to `M1999Options`: off by default, output only, bit-identical when off,
      with a test. When on, the recruiter's result also carries every contact episode (nestmate, start, end; no
      duration cut), its bouts (start, end, partner, clipped as for trophTotal) and its exit time.
    - **Check:** contact means at contactMin 0.04 s must equal D106's (8.2 / 6.9 / 7.3); at 1 s, the contact1 arm's.
    - Local, `scripts/scratch/contactSplit1999.ts`, ≈ 10 min with the pool.
  - **Classes** (observed contacts, ≥ 0.04 s as judged and ≥ 1 s as the sensitivity; by onset time; M = the longest
    bout, as `contactsBefore`):
    - **pre:** onset before M's start (Table 2a's "contacts before", plus the main partner's onset if it falls there);
    - **partner-first:** the main partner's first episode with onset in M or later (its onset if not before M);
    - **partner-repeat:** further episodes of the main partner, split into those starting inside M (the bout continues
      while the contact count restarts) and those after M ends;
    - **third-during-M:** other nestmates with onset inside M (passers-by during the main trophallaxis);
    - **other-bout:** onset inside another bout (that bout's partner, or a third party);
    - **walk:** onset after M's start, outside every bout.
    - Also: episodes per distinct nestmate, and same-nestmate gaps < 1 s (fragmentation).
  - **Excess:** model post-M (all classes but pre) minus the data's contacts − contacts-before (3.1 / 2.3 / 2.3, which
    include the main partner's contact).
  - **Reading rule (fixed before the run):**
    1. **Implementation-mismatch candidate (decidable from the code):** a partner counted more than once within one
       continuous bout (partner-repeat inside its bout). If that carries at least half the excess on 4 d or 8 d, it is
       reported as a candidate bug. Whether to fix it and rerun the judgment is the user's decision.
    2. **Needs the paper:** if third-during-M, other-bout third parties or walk carry most of the excess, whether
       Mailleux scored such contacts is not determinable from our extraction (it records only "filmed for 20 min at
       ×2"). The lead then asks the user to clear Mailleux 1999, for the Methods' contact definition. Nothing reopens
       before that.
    3. **Otherwise** (excess spread across classes, or in classes an observer would plainly score): no mismatch is
       indicated. The excess stays the structural limitation in F093.
