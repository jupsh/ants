---
id: D167
date: 2026-10-26
time: 01:25
kind: reading
title: Part D precision forecast read (D166 method; P56, P57): of 20 rows, S3₁ and S3₂ precise, three S2 / S2-J near-band rows marginal, 15 forecast unresolved under the proxy-spread rule; on S1 D_w forager 10 min a perfect model's half-width exceeds the tolerance (h/tol 1.03), so joint reproduction on all 20 rows is very unlikely at this sample size even for a perfect model; the data's spread dominates; reported, never a filter
---
- **2026-10-26 ≈ 01:25 UTC — Part D precision forecast read (D166 method; P56, P57): of 20 rows, S3₁ and S3₂ precise, three S2 / S2-J near-band rows marginal, 15 forecast unresolved under the proxy-spread rule; on S1 D_w forager 10 min a perfect model's half-width exceeds the tolerance (h/tol 1.03), so joint reproduction on all 20 rows is very unlikely at this sample size even for a perfect model; the data's spread dominates; reported, never a filter.**
  - **Run:** `scripts/scratch/partDForecast.ts` (md5 `75e43baa…`) → `logs/partd/forecast.json` (md5 `03ad9146…`), 41 s
    local. Sources as D166; no Part D member output read. Continuity: the data column reproduces D158's targets (S2
    0.104 / 0.060 / 0.030 / 0.014 / −0.001; S2-J 0.088 / 0.052 / 0.030 / 0.017 / 0.010; 20 estimable colonies) and
    D130's S3₂ (0.189).
  - **One choice made in the code before it ran, inside D166:** labels use h; the S2-J half-width with Monte Carlo
    error (h_MC) is reported beside it. h_MC exceeds h by at most 0.0001, so no label depends on it.
  - **Per row** (tol; data value, n; SE_data; SE_sim base / Eu / El20; h; h / tol; P_eq; label):

    | Row | tol | data (n) | SE_data | SE_sim b / Eu / El20 | h | h / tol | P_eq | label |
    |---|---|---|---|---|---|---|---|---|
    | S1 D_w all 5 s | 0.525 | 2.626 (22) | 0.135 | 0.006 / 0.092 / 0.118 | 0.295 | 0.56 | 0.80 | unresolved (ratio 20.6) |
    | S1 D_w all 10 min | 1.255 | 6.276 (22) | 0.435 | 0.058 / 0.350 / 0.234 | 0.925 | 0.74 | 0.45 | unresolved (6.1) |
    | S1 D_w nurse 5 s | 0.457 | 2.284 (22) | 0.156 | 0.006 / 0.081 / 0.113 | 0.325 | 0.71 | 0.53 | unresolved (19.5) |
    | S1 D_w nurse 1 min | 0.734 | 3.670 (22) | 0.289 | 0.015 / 0.166 / 0.205 | 0.584 | 0.80 | 0.33 | unresolved (13.5) |
    | S1 D_w nurse 10 min | 1.023 | 5.117 (22) | 0.402 | 0.053 / 0.276 / 0.223 | 0.802 | 0.78 | 0.35 | unresolved (5.2) |
    | S1 D_w forager 5 s | 0.316 | 1.582 (22) | 0.080 | 0.007 / 0.069 / 0.063 | 0.177 | 0.56 | 0.82 | unresolved (10.4) |
    | S1 D_w forager 1 min | 0.425 | 2.124 (22) | 0.158 | 0.018 / 0.146 / 0.119 | 0.365 | 0.86 | 0.26 | unresolved (8.1) |
    | S1 D_w forager 10 min | 0.624 | 3.122 (22) | 0.346 | 0.056 / 0.181 / 0.125 | 0.643 | **1.03** | **0.00** | unresolved (3.2) |
    | S2 C < 5 mm | 0.015 | 0.104 (20) | 0.0056 | 0.0040 / 0.0044 / 0.0034 | 0.0117 | 0.78 | 0.36 | marginal |
    | S2 C 5–10 mm | 0.015 | 0.060 (20) | 0.0044 | 0.0017 / 0.0031 / 0.0020 | 0.0092 | 0.61 | 0.75 | marginal |
    | S2 C 10–20 mm | 0.015 | 0.030 (20) | 0.0027 | 0.0006 / 0.0018 / 0.0018 | 0.0053 | 0.35 | 1.00 | unresolved (2.9) |
    | S2 C 20–40 mm | 0.015 | 0.014 (20) | 0.0022 | 0.0005 / 0.0016 / 0.0014 | 0.0045 | 0.30 | 1.00 | unresolved (3.4) |
    | S2 C ≥ 40 mm | 0.015 | −0.001 (20) | 0.0070 | 0.0006 / 0.0014 / 0.0012 | 0.0117 | 0.78 | 0.35 | unresolved (2.3) |
    | S2-J < 5 mm | 0.015 | 0.088 (20) | 0.0052 | 0.0027 / 0.0038 / 0.0032 | 0.0106 | 0.70 | 0.51 | marginal |
    | S2-J 5–10 mm | 0.015 | 0.052 (20) | 0.0040 | 0.0011 / 0.0027 / 0.0019 | 0.0080 | 0.53 | 0.85 | unresolved (2.5) |
    | S2-J 10–20 mm | 0.015 | 0.030 (20) | 0.0027 | 0.0005 / 0.0018 / 0.0018 | 0.0054 | 0.36 | 1.00 | unresolved (3.4) |
    | S2-J 20–40 mm | 0.015 | 0.017 (20) | 0.0023 | 0.0003 / 0.0017 / 0.0014 | 0.0047 | 0.32 | 1.00 | unresolved (4.9) |
    | S2-J ≥ 40 mm | 0.015 | 0.010 (20) | 0.0056 | 0.0005 / 0.0014 / 0.0012 | 0.0094 | 0.63 | 0.67 | unresolved (2.7) |
    | S3₁ | 1.0 | 0.266 (22) | 0.089 | 0.029 / 0.036 / 0.041 | 0.161 | 0.16 | 1.00 | precise |
    | S3₂ | 1.0 | 0.189 (22) | 0.084 | 0.029 / 0.027 / 0.038 | 0.153 | 0.15 | 1.00 | precise |

    Every proxy arm has 22 estimable colonies on every row; the data 22 (S1, S3) and 20 (S2, S2-J). The S2-J Monte
    Carlo SE is ≤ 0.0003 on every band.
  - **Reading, as D166 fixed it:** 2 rows precise (S3₁, S3₂), 3 marginal (S2 < 5 and 5–10 mm, S2-J < 5 mm), 15 forecast
    unresolved, all by the proxy-spread rule: base, with no coupling, spreads far less across colonies than Eu or El20
    (on S1 by factors 3–21), so these proxies do not forecast a new member's spread. No row is unresolved for
    estimability. No row is labelled "not attainable", because the unresolved label takes precedence; on the computed
    numbers, though, **S1 D_w forager 10 min has h ≥ tol (1.03)**: with the largest proxy spread, a perfect model could
    not be shown equivalent on it.
  - **What follows for the all-20 rule:** the chance that a perfect model is equivalent on every row is at most its
    chance on any one row. Under the normal approximation that is 0.00 on forager 10 min, and 0.26 on forager 1 min.
    Joint reproduction on all 20 rows is therefore very unlikely to be demonstrated at this sample size, even by a
    perfect model, if a member spreads as Eu or El20 do. A member that spreads less (as base) would have a higher
    chance; the forecast cannot say which members do. Every row stays in the requirement (P57); nothing here selects,
    drops or tunes a member.
  - **Where the imprecision comes from:** on every row, SE_data is larger than every
    proxy SE_sim. Supplemental arithmetic, outside D166's method: with SE_sim = 0 (unlimited simulation), 1.645 ·
    SE_data / tol is 0.91 on forager 10 min and 0.42–0.65 on the other S1 rows, so more simulated runs per colony would
    narrow these intervals only partly; the 22 data colonies set most of the width.
  - **Limits (D166):** a perfect model's spread is taken as the largest of three Part C arms, and members with stronger
    coupling may spread more; P47's common support is not fixed (each set used its own estimable colonies); the S1
    tolerance uses the data's point value; P_eq is a normal approximation; duration enters only through the observed
    SEs.
  - **Consequences:** P56 is fulfilled: the forecast is done before any further Part D member simulation. P57 stays
    open for the stages it governs (no row removed; the smoke's strengths not carried into Stage 2a). The next step is
    the bench under P50. Whether Stage 2 proceeds as designed given this forecast is the user's (Q19); the forecast
    itself changes no rule.
