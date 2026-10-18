---
id: D034
date: 2026-10-17
time: 22:55
kind: reading
title: Comparison WR read (21:31 rule): W fails the guard narrowly, W-spec passes; W-spec is the chosen wall rule
---
**2026-10-17 ≈ 22:55 UTC — Comparison WR read (21:31 rule): W fails
the guard narrowly, W-spec passes; W-spec is the chosen wall rule.**
Run `wr-20261017T213410Z` ok (48 min, ended ≈ 22:23; 44 runs);
`logs/wr/agg.txt` (`wrAgg.py`). m_arm / m_baseline per quantity (pass ≤
1.10; bootstrap 95 %):

| quantity | W | W-spec |
|---|---|---|
| exits light | 0.684 [0.660, 0.761] | 0.809 [0.775, 0.843] |
| exits dark | 0.682 [0.652, 0.720] | 0.774 [0.750, 0.795] |
| moving fraction light | **1.104** [0.998, 1.121] FAIL | 1.090 [0.983, 1.107] pass (uncertain) |
| moving fraction dark | **1.104** [1.085, 1.122] FAIL | 1.084 [1.069, 1.099] |
| light / dark moving fraction | 1.000 | 0.995 |
| light / dark moving contacts | 1.006 | 1.005 |
| wall-band share (baseline 0.524) | 0.160 | **0.108** |

Mismatches behind the ratios (baseline → W-spec): exits 1.70 → 1.38
(light), 1.77 → 1.37 (dark); moving fraction 1.10 → 1.19, 1.50 → 1.62;
light / dark moving fraction 1.37 → 1.36; light / dark moving contacts
1.52 → 1.53. **W-spec is acceptable for the next comparison** (not a
reproduction of these quantities). The packing follow-up uses W-spec as
its wall control; its design is pre-registered separately.
