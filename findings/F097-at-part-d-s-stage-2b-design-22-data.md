---
id: F097
title: At Part D's Stage 2b design (22 data colonies, 2 runs x 22 simulated), a perfect model's 90 % half-width reaches the tolerance on S1 D_w forager 10 min (h/tol 1.03 with Eu's between-colony spread, 0.97 with El20's), so joint equivalence on all 20 rows is very unlikely even for a perfect model; the data's between-colony spread sets most of every row's width; S3 rows are precise
topic: synchrony
status: indicated
date: 2026-10-26
data: development (Stroeymeyt 22 fit colonies, light) and Part C simulation arms base, Eu, El20
evidence: docs/log/2026-10-26-0125-part-d-precision-forecast-read-d166.md
bears_on: Part D Stages 2-3 (T033): what the all-20 joint-reproduction rule can show
related: F095
supersedes:
superseded_by:
depends:
---
Method fixed before computing (D166): h = max(1.645 · √(SE_data² + max SE_sim²), D117 bootstrap half-widths), SE from
2,000 colony-bootstrap means, proxies Part C's base, Eu and El20 (2 runs × 22, 4 h light). Labels: S3₁, S3₂ precise; S2 < 5,
5–10 mm and S2-J < 5 mm marginal (P_eq 0.36–0.75); the other 15 unresolved because base spreads far less than Eu or El20, so
the proxies do not forecast a member's spread. P_eq ≤ 0.00 on forager 10 min and 0.26 on forager 1 min (normal approximation).
SE_data exceeds every proxy SE_sim on every row; with SE_sim = 0, 1.645 · SE_data / tol is still 0.91 on forager 10 min.
Not a filter: no row leaves the requirement (P57).
