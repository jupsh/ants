---
id: F080
title: Step-5 fit with C2's motion transferred: the search runs into density's lower end (2 /cm²) and returnRate's upper end; no run converged in the default budget
topic: colony-1999
status: indicated
date: 2026-10-22
data: Mailleux 1999 Table 2a (fit)
evidence: docs/log/2026-10-22-1315-step-5-fit-finished-d102-step5fit.md
bears_on: step 5 adoption (bound condition fails); the stopping rule; E6's best step-5 fit
related: F043, F077
supersedes:
superseded_by:
depends:
---
Best of three CMA-ES runs (selection loss 301.4; others 605.3, 384.0), dt 0.025, warm-up 7200 s, roles mix: density 2.03 /cm²
(unit 0.018 of the 2–4 box), returnRate 0.887 /s (unit 0.983 of 1/1200–1, log); shareRate, receiveReserve, reserveSd interior.
Every run stopped at the 120-generation cap; the IPOP restart's last-30-generation drift is +1.29 (returnRate) and −1.28
(density) encoded units, so the search was still moving into both walls. Within 5 % on the unit scale (step 4's convention);
on the value scale only density is a hit. Rows not yet judged; no causal reading (which C2 property drives it is untested).
