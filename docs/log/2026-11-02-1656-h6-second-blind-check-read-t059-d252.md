---
id: D256
date: 2026-11-02
time: 16:56
kind: reading
title: H6 second blind check read (T059; D252, D255): under the reachability clause S1 is still mostly unknown (0.784 onsets, 0.897 reference, zone condition met; first check 0.783, 0.896), so by P173 S1 is reported as it falls, labelled coverage-limited, and the freeze proceeds after V1-V4; the neighbour clause is not what drives the unknowns, contrary to D251's guess
---
- **2026-11-02 ≈ 16:56 UTC — H6 second blind check read (T059; D252, D255): under the reachability clause S1 is still mostly unknown (0.784 onsets, 0.897 reference, zone condition met; first check 0.783, 0.896), so by P173 S1 is reported as it falls, labelled coverage-limited, and the freeze proceeds after V1-V4; the neighbour clause is not what drives the unknowns, contrary to D251's guess.**
  - **What ran:** the second and last blind check D252 allows (gate `run:h6-blindcheck2-20261102`), at 16:55 UTC, on
    the intermediates rebuilt under the reachability clause (`scripts/scratch/h6-next/extract.ts` `ea889e9d…`, v =
    9.427 mm/s, ring neighbours, exact form; D253, D255). The rebuild was checked by the lead: 22 files whose hashes
    match the report, h6-next tests 44/44, `tsc` exit 0, the blind-check script byte-identical to the first check's,
    and the reproduction (read-only against the repro files) PASS with Test A ρ +0.015. Exposure X028.
  - **Output (all of it):** onsets 0.784; at-risk reference 0.897; zone condition "yes" (first check, D251: 0.783,
    0.896, yes).
  - **Reading against P173:** D249's cutoff is met again, so "No further tuning: S1 is reported under the new rule,
    labelled coverage-limited, with its unknown shares. The freeze proceeds." The coverage rule frozen with the reader
    is the reachability clause; the freeze waits only for V1–V4 to pass.
  - **D251's guess is wrong:** replacing the 25 mm neighbour clause by the much tighter reachability clause left the
    pooled shares unchanged to the third decimal, so the neighbour clause is not what makes S1 mostly unknown. The
    remaining clause is the focal's own detection on at least 90 % of the window's frames. That is consistent with
    `c15.json` coming out byte-identical under both rules (both return unknown whenever the focal clause fails, before
    any neighbour is checked), but which clause drives the unknowns is not established by anything printed, and under
    P173 the rule is not tuned further.
  - **For the S1 reading:** S1 will rest on about a fifth of the onsets and a tenth of the reference, filtered at
    different rates; the two unknown sensitivities (as contact, as no contact) and the unknown fractions by role, zone
    and context (P148) are reported with it.
