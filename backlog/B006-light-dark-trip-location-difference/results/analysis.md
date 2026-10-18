# B006 light/dark audit

Sources: `data/reference/stroeymeyt2018-fit-rows.json` (complete-trip medians and counts); `logs/q/guard-data.json` (moving fraction and moving-involved contact rate per detected ant-frame). All 22 are the designated fit colonies. Ratios point toward the phase with the larger observed value: trip duration = dark/light; activity and contacts = light/dark. No new statistic definitions.

| Colony | Complete trips light/dark | Trip duration D/L | Moving fraction L/D | Moving contacts L/D |
|---|---:|---:|---:|---:|
| colony020 | 169/170 | 2.113 | 1.645 | 2.103 |
| colony112 | 71/35 | 13.630 | 2.708 | 3.851 |
| colony114 | 239/218 | 1.205 | 0.987 | 1.067 |
| colony122 | 330/167 | 2.134 | 1.395 | 1.519 |
| colony201 | 150/200 | 1.611 | 1.160 | 1.364 |
| colony204 | 301/201 | 4.013 | 1.525 | 1.632 |
| colony208 | 355/358 | 2.454 | 1.269 | 1.396 |
| colony209 | 213/129 | 1.605 | 2.170 | 2.225 |
| colony213 | 167/326 | 3.441 | 1.024 | 1.032 |
| colony215 | 106/114 | 2.786 | 1.718 | 1.904 |
| colony220 | 97/89 | 1.201 | 1.523 | 1.718 |
| colony224 | 793/237 | 3.617 | 1.931 | 2.048 |
| colony226 | 275/167 | 2.112 | 1.363 | 1.480 |
| colony237 | 131/129 | 1.000 | 1.359 | 1.519 |
| colony241 | 644/835 | 3.789 | 1.477 | 1.600 |
| colony248 | 157/263 | 2.611 | 1.132 | 1.153 |
| colony250 | 209/212 | 2.634 | 1.318 | 1.518 |
| colony253 | 575/683 | 2.115 | 0.961 | 1.105 |
| colony260 | 315/319 | 1.493 | 1.165 | 1.192 |
| colony261 | 62/64 | 1.204 | 1.184 | 1.263 |
| colony265 | 25/32 | 3.294 | 1.172 | 1.397 |
| colony276 | 230/180 | 3.173 | 1.014 | 1.222 |

## Correlations of log ratios

Pearson r and Spearman ρ, unweighted by colony. Pairs are complete-case; the sparse-trip sensitivity requires ≥10 complete trips in each phase.

| Pair | Colonies | Pearson r | Spearman ρ |
|---|---:|---:|---:|
| All fit colonies: trip vs activity | 22 | 0.453 | 0.230 |
| All fit colonies: trip vs contacts | 22 | 0.522 | 0.202 |
| All fit colonies: activity vs contacts | 22 | 0.968 | 0.967 |
| Trip counts ≥10 each phase: trip vs activity | 22 | 0.453 | 0.230 |
| Trip counts ≥10 each phase: trip vs contacts | 22 | 0.522 | 0.202 |
| Trip counts ≥10 each phase: activity vs contacts | 22 | 0.968 | 0.967 |

## Leave-one-colony-out sensitivity

| Pair | Pearson r range | Spearman ρ range | Omission with lowest Pearson r |
|---|---:|---:|---|
| trip vs activity | 0.093 to 0.563 | 0.114 to 0.310 | colony112 |
| trip vs contacts | 0.095 to 0.597 | 0.082 to 0.294 | colony112 |
| activity vs contacts | 0.963 to 0.972 | 0.962 to 0.974 | colony112 |

Geometric mean trip ratio: 2.368 (22 colonies).

Geometric mean activity ratio: 1.368 (22 colonies).

Geometric mean contacts ratio: 1.528 (22 colonies).
