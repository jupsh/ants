---
id: D001
date: 2026-10-17
time: 13:10
kind: reading
title: Overnight results read against their logged rules (box queue finished 10:28 UTC; the hourly watchers had not yet fired; read in the logged order)
---
**2026-10-17 ≈ 13:10 UTC — Overnight results read against their logged
rules (box queue finished 10:28 UTC; the hourly watchers had not yet
fired; read in the logged order).**

*Slow-episode what-if (05:43 item 3): no arm supports it.* (i) nurse
brief-still 0.3–0.6 share 0.223 / 0.242 / 0.252 vs control 0.194 (bar
0.40); (ii) only forager P2 improves (|z| 51.1 → 50.0–50.5); nurse P2 and
P10 get worse (P10 59.1 → 61.3–64.3); (iii) persistence kept (nurse 6-h
0.52, control 0.49). Gains beside: speedMove (nurse |z| 4.7 → 1.8–3.1,
forager 7.9 → 2.7–5.0) and still.nurse (5.4 → 2.9–4.3); loss rises
(21 316 → 21 982 / 22 856 / 23 373). Discrete slowing does not produce
the short stills either; recorded, no further slow-episode arms.

*Contact check (05:43 item 1): contacts NOT adequate.* Model / data
contacts per ant-hour at 4.1 mm, control: light 0.50 [0.45, 0.56], dark
0.64 [0.56, 0.74] (6 mm: 0.44, 0.56). The data's contacts involve a moving
ant in 48 % (light) / 42 % (dark), the model's in 73 %; near share data
0.95, model 0.80. So the model has ≈ 0.76 of the data's contacts that
involve a mover but ≈ 0.26 of those between still ants. In-nest motion
matters downstream. Arms moving contacts toward the data beyond the
CI half-width: only the latent-state arms with SD 1 (light 0.60 / 0.59,
dark 0.77 / 0.76); speed and slow-episode arms move away (0.35–0.47),
C1 0.42 (near share 0.73), oracle arms unchanged. Reading (not a
criterion): the missing contacts are mainly among non-moving ants, which
points at the unreproduced slow sub-threshold displacement in still
periods (00:25 / checks A, B) and at closer packing in the data.

*Dark-phase oracle synchrony (05:43 item 2, secondary):* data dark blocks
2.52 / 3.99 (1 / 10 min), control 1.22 / 1.48; κ 0.5 1.43 / 1.93; κ 1 2.07
/ 3.25 (≈ 70 % of the gap at both, so in dark κ 1 meets the half-gap
bar); placebos 1.20–1.23 / 1.53–1.55, at the control's level. The
primary (light) verdict stands (not met); dark adds that the global
coupling gets closer when the data's own synchrony is weaker.

*Latent-state follow-up (06:22): the reading is supported in three arms,
with a design confound disclosed.* Paired nurse T2 arm − control (Fisher
z): SD 0.53 τ 60 s +0.012 [+0.005, +0.018]; SD 1 τ 60 s +0.033 [+0.023,
+0.041]; SD 0.53 τ 600 s +0.018 [+0.010, +0.025]; SD 1 τ 600 s +0.058
[+0.051, +0.065] (control +0.068, data +0.121). Loss 18 197 / 14 109 /
18 248 / 13 901 (control 21 316); nurse P2 and P10 |z| fall in all (SD 1:
34.3 → 20.3–20.4, 59.1 → 30.3–31.2). Nurse 6-h persistence 0.49 / 0.50 /
0.43 / **0.32** (control 0.49; the last fails the 0.10 bound). So SD 0.53
τ 60, SD 1 τ 60 and SD 0.53 τ 600 meet (1)–(3). Foragers: T2 unchanged in
every arm (−0.004 to +0.005), forager rows unchanged — nurse-only.
Cost: still.nurse |z| 5.4 → 7.3–13.5. **Confound found at reading, not
controlled in the design:** the switch multiplies walk-on by exp(x), x
OU with mean 0, so the mean multiplier is exp(SD²/2) — ×1.15 at SD 0.53,
×1.65 at SD 1. Part of the row gain (shorter rests, worse still.nurse) can
come from the raised mean rate alone. T2 is the part a constant rate
change cannot produce, and it moves; but the size of the row gain
attributable to variability is not identified. **Candidate model element
for the user, conditional on a mean-matched check** (x with mean
−SD²/2, or the control's walk-on scaled by exp(SD²/2)).

*Step size (06:23 E2): not an artefact.* dt 0.025, SD 0.53 τ 60 s vs its
own control: loss 21 299 → 18 201 (dt 0.05: 21 316 → 18 197); nurse P10
59.1 → 49.3, P2 34.4 → 30.1 (identical to dt 0.05).

*C-b (06:38): no refractory signature.* Hazard of a movement onset by
time since the last moving run (per min; light; complete runs): data
nurses 3.86 / 1.76 / 0.67 / 0.33 / 0.24 / 0.19 / 0.16 (10–20, 20–40,
40–80, 80–160, 160–320, 320–640, > 640 s), model 3.10 / 2.09 / 1.29 /
0.83 / 0.52 / 0.34 / 0.21; foragers alike in shape. Both fall
(bout-clustering, Lomax-like); the data's falls more steeply (×24 vs
×14), higher at 10–20 s and about half the model's at 40–160 s.
Description only: a steeper fall is what mixing high- and low-propensity
states gives, the same direction as the latent-state result.

*C-a data side (06:38):* light autocorrelation of colony moving
fraction 0.74 / 0.52 / 0.37 / 0.18 / 0.02 at 1 / 2 / 3 / 5 / 10 min, small
bumps at 17–28 min (+0.06–0.07, rise ≈ 1.2× the bootstrap half-width);
dark bumps at 55 and 82 min. The literal rule says "periodic" in both,
but the rule scans 115 lags for any local maximum, which makes a marginal
pass likely by chance (a weakness of the rule as written, noted before
the model side is read). Verdict waits for the control, read through the
same code (box runs, the model's 12-h activity series was not recorded
overnight; the 06:38 entry assumed it was).
Spread analysis (05:57): running (1000 permutations per episode).
