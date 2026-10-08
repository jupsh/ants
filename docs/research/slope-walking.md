# Lasius niger walking on slopes: literature, data checks and candidate model changes

Labels used throughout:
- **[S]** stated in the cited source.
- **[F]** read off a published figure by me (about ±5 % reading error).
- **[C]** computed by me from the Khuong et al. 2013 data in `data/khuong2013/*.csv.gz`. I used the repo's pipeline settings: 25 Hz, 3-point centred moving average, trim 10–200 mm, speed over 0.2 s, "moving" means ≥ 2 mm/s. Tracks are keyed by colony + ant ID. My pooled 60° quantiles match yours exactly (p50 10.8, p90 26.9 mm/s).
- **[I]** inferred by me; not stated anywhere.

_Compiled 2026-10-07 (session 2) by a research agent. [C] numbers come from the Python scripts in [`scripts/khuong-slope/`](scripts/khuong-slope/) (stdlib only; run e.g. `python3 -I docs/research/scripts/khuong-slope/diag3.py docs/research/scripts/khuong-slope data/khuong2013`). They have **not yet been reproduced with the TypeScript pipeline**; do that before relying on them._

_Conventions that differ from `src/sim/analysis/trajectory.ts`: the speed-binned kurtosis in §4 B is **raw** kurtosis (Gaussian = 3) of turn increments over 2.5 mm chords after 0.5 mm arc-length resampling, whereas our pipeline reports **excess** kurtosis (Gaussian = 0) of 0.2 s increments. The "kurtosis 3.1 at 60°" in §0 and §5 is our excess value. Slow-bin values are partly tracking noise (§4 A caveat). §0 gives the per-session flat alignment as 0.027–0.041; §H gives 0.015–0.041 (different heading windows)._

---

## 0. Key findings

1. **Your "short-scale tortuosity rises on slopes" is a speed-composition effect [C].** Compare samples at the same walking speed:
   - Persistence at 5 mm is *higher* on slopes than on flat ground.
   - Turn-increment kurtosis is Gaussian-like (2.5–4.5) for slow walking at every incline, and heavy-tailed (6–11) for fast walking.
   - The data show strongly speed-dependent tortuosity per unit distance. Your walker is speed-independent per distance by construction (events and jitter are per mm).
   - At 60° most samples are slow, so the pooled statistics look tortuous and Gaussian.
   - This one feature probably explains the 5 mm correlation, the kurtosis of 3.1 and the straightness gap together (§4, change B).
2. **In log terms the speed distribution does not narrow on slopes; it widens [C].**
   - p90/p50 rises from 1.66 (flat) to 2.50 (60°), while p10/p50 stays ≈ 0.3.
   - Within-ant log-speed SD is flat or slightly falling (0.68 → 0.62).
   - Between-ant log-SD grows (0.31 → 0.56), partly through session/colony effects.
   - Your model does the opposite: `slopeSpeedSdK = +0.3` inflates *within*-ant SD with slope, and the sim's p90/p50 at 60° is 3.2.
   - The pooled distribution is time-weighted, so slow ants, which stay longer, are over-represented.
3. **Median speed vs incline is linear in θ** [C]: v/v₀ = 1 − 0.737·θ (θ in rad), RMSE 0.018. This beats 1 − k·sin θ (0.028), exp(−kθ) (0.053) and cos^k θ (0.065). The slowdown is direction-independent [S, Khuong; confirmed C], so a mechanical work or power limit is excluded.
4. **The flat-ground y-alignment is real behaviour, not tracking noise [C].**
   - It is ≈ 0 for displacements under 2 mm and ≈ 0.03–0.04 for displacements of 4 mm or more.
   - It is present in every flat session (0.027–0.041).
   - Its axis is tilted ≈ 13–15° from the image y axis. At 20–45° the slope-alignment axis is also tilted 7–21°, and it snaps to ≈ 0–2° at 60°.
   - This looks like a fixed weak directional cue in the set-up added to gravity [I]. Khuong et al. report an unexplained "lower right" exit excess at intermediate inclines [S].
5. **Tracking noise is anisotropic and grows in y with incline [C].**
   - σx is about 0.14–0.18 mm at every incline. σy rises 0.19 → 0.18 → 0.20 → 0.24 → 0.36 mm across the five inclines, roughly as 1/cos θ.
   - This is consistent with a fixed camera viewing a tilted canvas (foreshortened y) [I].
   - Your simulations add no measurement noise, so every short-scale statistic at 60° is compared against noise-free sims.
6. **Release point [C]:**
   - The mean radial velocity in 10–40 mm is −3.5 mm/s (flat) and −2.2 mm/s (20°), but −0.65, −0.12 and −0.15 mm/s at 30°, 45° and 60°.
   - Returns inside 100 mm after first reaching 100 mm: 68 % of samples (flat, 20°) vs 53–55 % (30–60°).
   - Return-to-start behaviour on flat ground has been published by Bonavita et al. 2026, a reanalysis of the same flat data. It weakens on steep slopes.
7. **Downhill exit preference is substantial and polar [C].** Exits with final y < 0 (downhill, assuming +y is uphill as in Khuong's figures): 35/69 flat; 50, 46, 57 and 48 of 69 at 20, 30, 45 and 60°. Your geomenotaxis is purely axial (`nearestAxis`).

---

## 1. Khuong et al. 2013, PLoS ONE 8:e76531 (full text read)

### 1.1 Set-up [S]

| Item | Value |
|---|---|
| Arena | 0.5 × 0.5 m "virgin painting canvas" |
| Inclines | 0, π/9, π/6, π/4, π/3 rad |
| Conditions | 26 °C, 50 % RH, climatic room |
| Camera | HD 1920 × 1080, 50 Hz interlaced, subsampled to 25 Hz. Custom Core Image tracker (gamma, crop of 40 × 40 px, colour-threshold mask, centroid of largest blob), "sub-millimetre precision" |
| Tracking-noise estimate used for segmentation | σT = 0.3 mm |
| Release | 23 ants per colony per incline, kept in a Fluon bowl with sugar-water cotton. Picked up with a pig-hair paintbrush; the brush tip touched the canvas centre and the ant walked off "spontaneously" (usually about 1 min, up to 7 min) "to avoid an escape response" |
| Trimming | Data before the ant was 1 cm from the drop site were discarded. Track ends on exit from the 0.2 m radius circle |
| Data | 69 tracks per incline (3 colonies), 845,263 points. Segments per incline: 24456, 23801, 11663, 7318, 5985 |
| Orientation | The upper end of the steepest line points ENE (grid azimuth 73°). Magnetic North is drawn in Fig. 8 |
| Not reported | Lighting, camera mounting relative to the tilted canvas, whether the canvas or brush was renewed between ants or sessions |
| Sessions (Table 1) | Flat: D 2012-05-29, C 05-31, C 06-01, A 06-15. π/3: C 06-01, A 06-18, D 06-18. Sessions at different times of day |

Trail laying is stated to be absent in exploration, and passive footprint marking is stated to be negligible at this passage rate (citing Devigne & Detrain 2002). Bonavita et al. 2026 imply the brush was reused: they switched to "a tooth pick … to allow using an unmarked support for each ant". So the release point may have carried colony odour from the brush [I].

### 1.2 Model [S]
- **Structure.** Extended Boltzmann walker (velocity-jump process): c = c(γ, α), μ = 1/λ(γ, α), and a phase function P(α′ | α; γ). Here α is the current heading relative to the steepest line and γ the incline.
- **Three predictions.** (a) Orthokinesis: speed depends on alignment. (b) Klinokinesis: λ depends on alignment. (c) Taxis: the new heading favours up/down.
- **Gravity.** "We exclude a direct action of gravity": there is no drift or sliding term.
- **Speed.** Speed is treated as an independent process: "speed fluctuations … remain to be studied separately". Average speed is recommended "as a first order approximation, as long as typical speed variations are the same scale as the mean free path".
- **Simulation (Algorithm 3).** Non-parametric: 8 heading sectors per incline, with segment lengths and turns drawn from the empirical CDFs. It is a geometric walk with no time or speed.
- **Validation.** Only the exit-heading distribution was checked (Fig. 8). The KS test did not reject the model at any incline.
- **Flat-ground reference walker (Methods).** λ = 1.0 × 10⁻² m and g = 0.6 with the elliptical phase function: `dev = 2·sgn·atan(tan(U·π/2)·(1−g)/(1+g))`. Segmentation recovers λ̂ = 10.9 mm and ĝ = 0.609 from synthetic data.
- **Segmentation.** Bottom-up piecewise-linear; ε = 1.7 mm at σT = 0.3 mm.
  - On slopes ε is scaled as ε_γ = (c_{γ=0}/c_γ)·ε [S].
  - Read literally, ε is about 3.4× larger (≈ 5–6 mm) at π/3. That would merge small turns, so on slopes it would inflate λ and deflate g [I].
  - Treat Khuong's slope estimates of λ and g as pipeline-dependent. Your direct path-lag statistics are more trustworthy.

### 1.3 Numbers per incline

| Quantity | 0 | π/9 (20°) | π/6 (30°) | π/4 (45°) | π/3 (60°) | Source |
|---|---|---|---|---|---|---|
| Per-ant average speed (distance/time incl. stops), median [IQR] mm/s | 49 [42–61] | 38 [24–52] | 29 [22–36] | 20 [15–25] | 14 [9–20] | Fig. 3A [F] |
| Segment mean speed, by sector (isotropic) mm/s | ≈45 | ≈35 | ≈29 | ≈20 | ≈14 | Fig. 5B [F] |
| λ, horizontal sectors (mm) | ≈8.5 | ≈9 | ≈9.5 | ≈11–12 | ≈11.5–12 | Fig. 5C [F] |
| λ, up/down sectors (mm) | ≈8.8 | ≈9.6 | ≈9.4–10.3 | ≈13–13.4 | ≈15.5–16.6 | Fig. 5C [F] |
| g (mean cos of turn), up/down | ≈0.65 | ≈0.65 | ≈0.62 | ≈0.51–0.54 | ≈0.43–0.45 | Fig. 5D [F] |
| g, horizontal | ≈0.65 | ≈0.59 | ≈0.59 | ≈0.46 | ≈0.30–0.37 | Fig. 5D [F] |
| Residence time to r = 0.2 m, median (s) | ≈50 | ≈57 | ≈47 | ≈60 | ≈77 | Fig. 3B [F] |
| Walked distance, median (m) | ≈2.5 | ≈1.95 | ≈1.15 | ≈1.1 | ≈1.05 | Fig. 3C [F] |
| Hodges–Ajne P (heading uniformity, 1 s headings) | 0.692 | 0.013 | 0.011 | ≪10⁻³ | ≪10⁻³ | text [S] |
| Median moving speed p50 / p90 (mm/s) | 43.4 / 72.1 | 32.8 / 64.2 | 26.7 / 48.9 | 16.9 / 37.1 | 10.8 / 26.9 | [C] |
| p90/p50 ; p10/p50 | 1.66 ; 0.30 | 1.96 ; 0.25 | 1.83 ; 0.26 | 2.19 ; 0.27 | 2.50 ; 0.32 | [C] |
| Per-ant median moving speed, q25/q50/q75 | 43/53/64 | 27/41/53 | 24/30/37 | 14/20/26 | 9.4/14.2/20.7 | [C] |
| Between-ant SD(log) ; within-ant SD(log) | 0.31 ; 0.68 | 0.44 ; 0.72 | 0.41 ; 0.65 | 0.47 ; 0.69 | 0.56 ; 0.62 | [C] |
| Stopped fraction (< 2 mm/s) | 0.029 | 0.063 | 0.062 | 0.077 | 0.082 | [C] |
| Median speed up / horizontal / down (mm/s) | 43.3/42.9/44.7 | 32.6/32.1/34.0 | 24.8/27.0/28.2 | 17.4/16.2/17.6 | 11.1/9.9/11.6 | [C] |
| Exits downhill (final y < 0) | 35/69 | 50/69 | 46/69 | 57/69 | 48/69 | [C] |

Qualitative statements [S]:
- **Speed.** Speed is ≈ 3× lower at π/3 and is not affected by alignment with the steepest line at any incline.
- **Mean free path λ.** λ has "the same magnitude on average" across inclines but becomes anisotropic: segments are longer when aligned up or down (equally for both), and stay close to the flat value when horizontal.
- **Persistence g.** Persistence "decreases" with incline.
- **Phase function, vertical incoming headings.** Ants persist as on flat ground.
- **Phase function, horizontal incoming headings.** The phase function becomes broad and turns go up or down, "with a likely preference towards downhill".
- **Phase function, intermediate headings.** The phase function is asymmetric, concentrated towards the nearest vertical, "especially when it is downhill".
- **Compensation.** Lower speed is "more or less compensated for by straighter trajectories", so residence time is only mildly affected.

### 1.4 Flat-ground anisotropy and the release point in Khuong et al.
- **[S]** On flat ground, heading uniformity was not rejected (P = 0.692), nor was |X| vs |Y| dispersal (KS, P > 0.05). Fig. 5 shows flat parameters as isotropic.
- **[S]** Exit headings show an excess towards the lower right at π/9–π/4 that vanishes at π/3: "We have no explanation for this bias so far". Magnetic North does not match it. No lighting or camera discussion is given.
- **[F/I]** Two flat-ground details look slightly elongated along y: the flat λ octagon in Fig. 5C (top ≈ 8.8 mm vs side ≈ 8.4 mm), and the *predicted* flat exit rose in Fig. 8. This is consistent with your −⟨cos 2θ⟩ = 0.031, which Khuong's tests were not powerful enough to detect.
- **[S]** The release point and homing are not discussed. The first 1 cm is discarded "to avoid … the very first moments of ants experiencing a new surface".

### 1.5 Bonavita et al. 2026 (PLoS ONE e0327957): reanalysis of the same flat data
- **[S]** Segment parameters were analysed relative to the direction to the start point (the Φu frame):
  - Mean free path is shorter when heading away: odds ratio (OR) for λ = 0.46 [0.37–0.58].
  - Turns are narrower when heading back: effect size (ES) for g = −0.14.
  - Turn bias towards the start when heading perpendicular: mean sine sω ≈ ±0.1.
  - Median speed showed no bias in Khuong's data.
- **[S]** The image-frame (Φx) analysis showed no ±X/±Y bias in g, sω, λ or speed.
- **[S]** The MSD is bounded and sub-diffusive. The Φu simulation reproduces the time to a 200 mm net displacement (experimental/simulated ratio 0.83 ± 0.10). The isotropic walker is 3.4× too fast.
- **[S]** Their new experiment, a tooth-pick release, ran under white and red light:
  - The return bias persists under red light, for speed and λ only.
  - Ants walk faster when heading back: ES ≈ 1.7–2.3 mm/s.
  - Their candidate explanations are chemical cues (judged unlikely), path integration from idiothetic cues, or uneven curtain light.
- **[S]** Slopes were not analysed. This is the source of your homing terms.

---

## 2. Other quantitative studies of ants on inclines

| Study | Species / set-up | Speed vs slope | Gait, stride, variability | Notes |
|---|---|---|---|---|
| Seidl & Wehner 2008, Front Zool 5:8 | *Cataglyphis fortis*, *Formica pratensis*; channels at −60, −30, 0, +30, +60°; 250 fps; 876 steps | [S] Speeds 0.05–0.4 m/s. *C. fortis* is fastest downhill and slowest steep uphill. *F. pratensis* is "fairly constant … except steep downhill" (0.07 m/s at −60°). Both ≈ 0.1 m/s at +60°. Fig. 1 (box plots), no functional fit | [S] After removing speed, slope has only marginal effects. Step length = 29 mm per m/s of speed; stepping frequency ≈ 56 Hz per m/s; period −0.22 s per m/s. Duty factor 0.52 / 0.58 at all slopes. Tripod phase ≈ 0.5 unchanged. Slope effects on stance and swing are tiny (−0.00004 s per degree) | Speed is modulated through stride length and frequency together. Kinematics are speed-determined, not slope-determined |
| Wöhrl, Reinhardt & Blickhan 2017, JEB 220:1618 | *C. fortis*; level, ±30°, ±60°; ground reaction forces | (speed not in abstract) | [S] Hind legs act as the brake downhill; front legs become the motor on steep uphill. Normalised double-support durations are prolonged on steep slopes. Lateral force direction changes between 30° and 60°, implying different coordination programs | Abstract only (paywalled) |
| Weihmann & Blickhan 2009, JCPA 195:1011 | *C. fortis* vs *F. pratensis*; sagittal kinematics across 150° of slope | [S] *Cataglyphis* is faster on all slopes | [S] Only minor postural changes (head ≤ 25°, trunk pitch small). Body height varies more in *Cataglyphis* | Abstract |
| Humeau et al. 2019, Integr Org Biol obz020 | *Aphaenogaster subterranea* (1.7 mg); solid flat vs solid 36° incline (upward walkers only); 100 fps | [S] Table 2: smooth surface 19.9 → 19.2 mm/s; rough surface 25.6 → 26.5 mm/s. A 36° rigid slope did not slow them. Granular 28° slope: 5.7 mm/s | [S] Period 0.22 / 0.16 s; stride 3.7 → 3.5 mm; duty factor 66 → 69 %. On sand: duty factor 80 %, slipping. Flat ground shows body-yaw oscillation of ±15° at about 1 Hz; sliding ants decouple velocity from body axis | A small ant on a rigid slope is not mechanically speed-limited at 36° [I]. L. niger's 39 % slowdown at 30° is therefore probably behavioural |
| Holt & Askew 2012, JEB 215:2545 | *Acromyrmex octospinosus*; −90 … +90°; respirometry tube; preferred speed | [S] Fastest on level ground (2.0 ± 0.1 cm/s, N = 20), "increasingly slowly with increased gradient (both on an incline and a decline)" | [S] CO₂ rate constant at 1.7 ml g⁻¹ h⁻¹, so speed is adjusted to keep metabolic rate constant | Symmetric, direction-independent slowdown, like L. niger. Abstract only |
| Lipp, Wolf & Lehmann 2005, JEB 208:707 | *Camponotus* sp. (11.9 mg); ±30, ±60° | [S] Speeds 0–95 mm/s. Slope has only a small effect on metabolic rate (1.55 level to 1.89 at −30°) | — | Not *Atta*; this is Camponotus. Energy is not a likely limit for small ants |
| Lewis, Martin & Czaczkes 2008, Behav Ecol 19:805 | *Atta cephalotes*, laden; manipulated trail gradient | [S] Transport rate is lower uphill than downhill or horizontal. Smaller loads are carried uphill | — | Laden ants; load-dependent |
| Moll, Roces & Federle 2010 (JCPA) & 2013 (PLoS ONE 8:e52816) | *Atta vollenweideri*, laden | [S] Speed falls with fragment length. Static stability needs extra legs in stance | — | Stability, not slope per se |
| Stark & Yanoviak 2020, ICB | *Cephalotes atratus*, arboreal | [S] Speed varies minimally with incline except on a vertical surface, where they are faster down than up | — | Arboreal specialist |
| Wohlgemuth et al. 2001/2002 (as cited by Khuong) | *C. fortis* channels | [S, via Khuong] Speed is reduced in both the uphill and downhill channels compared with the flat channel. Khuong's PDF renders the angle as "+540"; I did not verify it | — | — |
| Wintergerst & Ronacher 2012, JCPA | *C. fortis* | — | [S] Discriminates slopes differing by 12.5° | Graviception resolution |
| Devigne & Detrain 2002 (Actes Coll. Ins. Soc. 15) | *L. niger* | [S] Faster on nestmate- or alien-marked areas: 2.99 / 3.03 vs 2.40 cm/s unmarked | — | Chemical context changes speed |
| Wahl, Pfeffer & Wittlinger 2015, JCPA (PMC4439428); Zollikofer 1994, JEB 192:95; Reinhardt & Blickhan 2014, JEB 217:2358 | *Cataglyphis*, *Formica*, *Lasius*, *Myrmica* (Zollikofer) | — | [S] Tripod gait over a wide speed range. Stride length increases linearly with speed; frequency increases too (Formica: both increase proportionally). Grounded running in wood ants | Basis for a per-stride noise model (§4 B) |

Synthesis:
- **[I] Functional form.** No ant study fits a formula for speed vs slope.
- **[I] Direction dependence.** The direction-independent slowdown in *L. niger*, *Acromyrmex* and Wohlgemuth's *Cataglyphis* points to a behavioural "caution" or stability policy. Mechanics would predict uphill slow and downhill fast; only *C. fortis* in Seidl & Wehner shows that.
- **[I] Data fit.** For L. niger the median is linear in θ: 1 − 0.737θ.
- **[I] Stride.** Stride length and frequency both scale with speed (Seidl; Wahl; Reinhardt). So at 10 mm/s an L. niger worker takes many more strides per mm than at 43 mm/s.
- **[I] Gap in the literature.** I found no study of speed *variability*, pausing or tortuosity of ants on slopes other than Khuong 2013 and its reanalysis.

---

## 3. Behaviour shortly after release

- **L. niger, flat ground.** Area-restricted search around the release point is documented (Bonavita et al. 2026, above).
- **Classic displacement studies.** Displaced or zero-vector ants run systematic searches centred on the fictive goal, with loops of increasing size: *Cataglyphis* (Wehner & Srinivasan 1981, JCP 142:315; Müller & Wehner 1994, JCPA 175:525) and *Melophorus bagoti* (Schultheiss & Cheng 2011, Anim Behav). These references are from memory and were not re-fetched.
- **Lecheval, Robinson & Mann 2024** (J R Soc Interface, PMC11289642). Random walks with resetting to the nest explain the exponential radial distribution of searching scouts.
- **Slopes.** I found no study of release or search behaviour on slopes.
- **[C] Your data on slopes:**

| r bin (mm) | 0° | 20° | 30° | 45° | 60° |
|---|---|---|---|---|---|
| ⟨v_r⟩ 10–40 (mm/s) | −3.47 | −2.24 | −0.65 | −0.12 | −0.15 |
| ⟨v_r⟩ 40–70 | −2.21 | −1.27 | +1.49 | +1.91 | +1.59 |
| ⟨v_r⟩ 70–100 | +0.12 | +1.15 | +4.01 | +3.24 | +2.78 |
| Fraction of samples back inside 100 mm after first reaching r > 100 mm | 0.68 | 0.68 | 0.55 | 0.53 | 0.56 |

Speeds differ by 3× across inclines, so the dimensionless ⟨v_r⟩/median speed is the fairer comparison. Flat: −0.08; 60°: −0.014. The return bias weakens more than speed alone explains [C/I].

---

## 4. Candidate model changes

Changes are ordered by what I would try first. "Params" counts new free parameters net of ones removed.

### A. Observation model: add tracking noise to the simulations (do first)
- **Mechanism.** The stats compare noise-free simulated positions with tracked data. The data noise per position is estimated [C] from raw second differences while the ant is near-stationary; these are upper bounds:

  | Incline | σx (mm) | σy (mm) |
  |---|---|---|
  | 0° | 0.176 | 0.194 |
  | 20° | 0.160 | 0.179 |
  | 30° | 0.153 | 0.199 |
  | 45° | 0.146 | 0.237 |
  | 60° | 0.137 | 0.359 |

  The excess in y scales roughly with 1/cos θ, which fits a fixed camera and a tilted canvas [I]. Khuong et al. assumed 0.3 mm [S].
- **Params.** 0 behavioural; σx and σy(θ) are measured.
- **Distinguishing observation.** Noise affects mainly the stopped fraction, p10, kurtosis and correlations at short lags in slow bins. It cannot change the 50 mm correlation or p50/p90 (at 0.2 s, noise adds only ≈ 1–1.5 mm/s of apparent speed).
- **Caveat.** Arc-length resampling at speeds under 8 mm/s inflates path length with noise, so the slow-bin values below are partly measurement.

### B. Speed-dependent turning per distance: per-time or per-stride heading noise
- **Observation [C].** Persistence and kurtosis by speed, matched across inclines:

  | Speed bin (mm/s) | ⟨cos Δh⟩ @ 5 mm, 0° → 60° | ⟨cos⟩ @ 50 mm, 0° → 60° | Kurtosis of 2.5 mm-chord turn increment, 0° → 60° |
  |---|---|---|---|
  | 2–8 | 0.23, 0.32, 0.46, 0.56, 0.56 | 0.01, 0.00, 0.08, 0.09, 0.11 | 2.5, 2.8, 3.3, 4.3, 4.4 |
  | 8–15 | 0.19, 0.33, 0.50, 0.58, 0.64 | −0.05, −0.02, 0.09, 0.11, 0.19 | 2.7, 3.2, 4.0, 4.7, 5.7 |
  | 15–25 | 0.40, 0.51, 0.62, 0.72, 0.78 | −0.06, −0.06, 0.07, 0.13, 0.22 | 5.0, 5.8, 6.2, 7.3, 7.3 |
  | 25–40 | 0.81, 0.87, 0.90, 0.93, 0.92 | −0.02, 0.04, 0.13, 0.23, 0.23 | 7.7, 7.4, 6.3, 5.5, 5.6 |
  | 40–80 | 0.95, 0.96, 0.97, 0.98, 0.97 | 0.17, 0.17, 0.25, 0.31, 0.16 | 10.5, 11.1, 7.0, 6.7, 5.8 |

  Tortuosity per mm falls steeply with speed at every incline. At equal speed, slopes are *straighter* at 5 mm, not more tortuous.
- **Mechanism (literature-supported).** Steering noise is generated per stride or per unit time, while the BW events are per distance.
  - Stride length grows with speed (Seidl & Wehner 2008; Wahl et al. 2015; Zollikofer 1994), so slow ants take more strides per mm and gather more heading variance per mm.
  - Body-yaw oscillation of about ±15° at about 1 Hz is reported for a similar-sized ant on flat ground (Humeau et al. 2019).
  - Continuous Gaussian diffusion then dominates at low speed (kurtosis → 3), and heavy-tailed events dominate at high speed. That matches the speed–kurtosis gradient.
- **Implementation.**
  - Per-distance heading variance = D_s + D_t / v, with D_t in rad²/s (or σ²_stride / L_stride(v), with L_stride = a + b·v).
  - Optionally let the event rate per mm be μ₀ + μ_t / v.
  - Drop `slopeJitterK`.
- **Params.** +1 (D_t), −1 (`slopeJitterK`), so net 0. Use +1 more if per-time events are included.
- **Distinguishing observation.** Re-run the table above on the simulations. The current model gives flat rows; B gives rows that rise with speed while columns stay unchanged. No slope term is needed for the short-scale effect. Then check whether B alone fixes the 60° pooled numbers (5 mm correlation 0.66, kurtosis 3.1, straightness 0.63) once the speed distribution is right.

### C. Geomenotaxis as a continuous axial restoring torque plus a polar (downhill) bias
- **Observation [C].** At matched speed, persistence at 50 mm rises with incline (0.07 → 0.22 in the 15–25 mm/s bin). Downhill exits are 46–57 of 69 on slopes.
- **Why the current pull loses persistence.** Your event-based pull snaps to the *nearest* axis with an up/down coin flip after a horizontal heading. That loses polar persistence: ⟨cos⟩ at 50 mm is 0.06 in sim vs 0.18 in data.
- **Proposed form.** A continuous torque dφ/ds = −κ·sin θ·sin 2(φ − φ_down) − β·sin θ·sin(φ − φ_down), plus noise.
  - The κ term keeps the ant in its current well (up or down) with rare hopping, giving long-lag polar correlation.
  - The β term gives the downhill excess, which Khuong et al. also state (§1.3).
- **Params.** +2 (κ, β), −2 (`geoHeadingPull`, possibly `geoRunGain`), so net 0 to +1.
- **Distinguishing observation.** Look at the conditional mean heading change over short windows (2–5 mm) as a function of angle to the steepest line. Restrict it to windows *without* large turns (|Δ| < 0.3 rad):
  - Continuous torque predicts a sin 2φ drift there.
  - Event-based taxis predicts none; all drift is in the large-jump tail.
  - Also check the asymmetry between up and down exits and the dwell distribution of time spent heading uphill vs downhill.

### D. Speed: between-ant (and session) heterogeneity that grows with slope; within-ant SD constant
- **Observation [C].** Within-ant log-SD is 0.68 → 0.62, while between-ant log-SD is 0.31 → 0.56. Session medians differ a lot: at 20°, A 33.5 vs C 53.0 mm/s; at 60°, D 10.6 vs A/C 16.5 mm/s. The pooled quantiles are time-weighted: at 60° the per-ant median of 14.2 compares with a pooled median of 10.8 mm/s.
- **Mechanism.** Individuals differ in slope sensitivity: v_i(θ) = v_i0·(1 − k_i·θ), with k_i ~ N(k, σ_k). Optionally add a random session effect on log speed.
- **Params.** +1 (σ_k) or +2 with σ_session; −1 by setting `slopeSpeedSdK` to 0 (the data do not support an increase).
- **Distinguishing observation.**
  - Between-ant log-SD *within session* vs θ: random k_i predicts it grows like θ·σ_k/(1 − kθ), while a session effect alone predicts no growth within session.
  - Per-ant statistics (one weight per ant) should be compared as well as pooled ones.

### E. Rejected alternative: mechanical or stability speed cap
- **Mechanism.** A soft speed ceiling v = (v_pref⁻ⁿ + v_cap(θ)⁻ⁿ)^(−1/n).
- **Params.** +2.
- **Predictions.** It compresses the upper tail (p90/p50 falls with θ), and a power limit would make the cap depend on direction.
- **Data [C].** p90/p50 rises from 1.66 to 2.50, and speed is direction-independent (within ±10 %, with horizontal slightly slower at 45–60°). Humeau et al. 2019 show no slowdown on a 36° rigid slope in a similar-sized ant. So this alternative is disfavoured.

### F. Two-state switching (fast-straight vs slow-tortuous) with slope-dependent occupancy
- **Mechanism.** A behavioural mode such as local search vs travel (Bonavita-type search) produces the speed–tortuosity covariance.
- **Params.** +4–6: two switching rates and state-specific speed, λ and g, of which the switching rates may depend on slope.
- **Distinguishing from B.**
  - F predicts bimodal within-ant log-speed and dwell times in a slow mode that are about exponential.
  - It also predicts hysteresis: tortuosity lags speed changes in the cross-correlation.
  - B predicts unimodal log-speed and tortuosity that follows instantaneous speed with no lag.

### G. Homing or search that weakens on slopes
- **Mechanism, two options.**
  - Cue competition: homing weight × (1 − w·sin θ). Path integration might also be less reliable when ground projection is needed (Wohlgemuth et al. 2001; Ronacher 2020).
  - Alternatively, homing is intact but masked by geomenotaxis, because elongated up/down runs carry ants out.
- **Params.** +1 (w) or 0.
- **Distinguishing observation.** Repeat the Bonavita Φu analysis (sω towards start, λ and g by direction-to-start) on slope data, using only segments heading roughly horizontally:
  - If the turn-back bias persists, homing is masked → no new parameter; C plus the existing homing should reproduce ⟨v_r⟩ ≈ 0.
  - If the bias is gone, homing is suppressed → add w.
- **Chemical-mark variant.** The release point may also carry a chemical mark from the reused brush [I]. Devigne & Detrain 2002 show marks change L. niger speed. If so, attraction to the start should decay across successive ants within a session, or vary with release order; the ant index within a session is available.

### H. Flat-ground axial anisotropy: a fixed weak environmental cue
- **Observation [C].** Alignment −⟨cos 2θ⟩ by displacement length on flat ground:

  | Displacement (mm) | −⟨cos 2θ⟩ | Axis angle from y |
  |---|---|---|
  | 0.4–1 | −0.006 | — |
  | 1–2 | −0.003 | — |
  | 2–4 | 0.017 | 13° |
  | 4–8 | 0.031 | 15° |
  | 8–16 | 0.029 | 15° |
  | 16–40 | 0.038 | 13° |

  - The noise artifact (≈ 1/d²) is excluded.
  - The effect appears in all four flat sessions and three colonies (0.015–0.041).
  - The slope-alignment axis is 9–21° at 20–45° and 1–2° at 60°.
  - It matches the "lower right" exit excess at intermediate slopes [S].
- **Mechanism.** A fixed weak axial cue in the room or on the canvas (e.g. light-fixture geometry or canvas texture) that adds to gravity's axial field [I]. Neither lighting nor camera geometry is reported.
- **Implementation.** An axial bias of strength ε along a fixed axis ψ (≈ 14° from y), added in doubled-angle space to the gravitational term at every incline.
- **Params.** +2 (ε, ψ), shared across inclines.
- **Distinguishing observations.**
  - (i) Vector-sum prediction: the axis rotation should shrink as gravity strengthens. Check it against 20/30/45/60°.
  - (ii) Canvas-weave hypothesis: predicts an axis exactly along the threads and a 4-fold component (⟨cos 4θ⟩ ≠ 0).
  - (iii) Residual tilt on the "flat" canvas: predicts a polar downhill component and exits skewed along the axis. Flat exits are 34 of 69 with y > 0, so there is no polar effect.
  - (iv) Light: predicts a polar bias and sensitivity to lighting conditions. Bonavita found light-dependent effects.

---

## 5. Quick-reference: what your 60° failures most likely mean

| Failure (data vs sim at 60°) | Most likely cause | First fix |
|---|---|---|
| Median 10.8 vs 17.9; p90 26.9 vs 57.2 | Within-ant SD is inflated by `slopeSpeedSdK > 0`; between-ant SD and time-weighting are under-modelled; the median slope is too shallow (data k = 0.737/rad, linear) | D |
| 5 mm correlation 0.66 vs 0.81; kurtosis 3.1 vs 6.4; straightness 0.63 vs 0.70 | Turning per distance must increase at low speed (per-stride or per-time noise); no tracking noise in the sims | A + B |
| 50 mm correlation 0.18 vs 0.06 | Event pull to the nearest axis randomises up/down; needs a continuous axial well plus a downhill polar term | C |
| ⟨v_r⟩ near release ≈ 0 vs negative | Homing is fitted on flat ground and not modulated by slope; test masked vs suppressed | G |
| Flat −⟨cos 2θ⟩ = 0.031 | A fixed environmental axial cue at about 14° from y, consistent across sessions | H |

---

## Sources
- Khuong et al. 2013, PLoS ONE 8:e76531 — https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0076531 (PDF text and Figs 3, 5, 7, 8 read)
- Bonavita et al. 2026, PLoS ONE e0327957 (PMC13419209) — https://doi.org/10.1371/journal.pone.0327957
- Seidl & Wehner 2008, Front Zool 5:8 — https://pmc.ncbi.nlm.nih.gov/articles/PMC2430559/
- Wöhrl, Reinhardt & Blickhan 2017, JEB 220:1618 — https://doi.org/10.1242/jeb.137505 (abstract)
- Weihmann & Blickhan 2009, JCPA 195:1011 — https://link.springer.com/article/10.1007/s00359-009-0475-y (abstract)
- Humeau et al. 2019, Integr Org Biol 1:obz020 — https://academic.oup.com/iob/article/1/1/obz020/5568295
- Holt & Askew 2012, JEB 215:2545 — https://doi.org/10.1242/jeb.057695 (abstract)
- Lipp, Wolf & Lehmann 2005, JEB 208:707 — https://dx.doi.org/10.1242/jeb.01434 (abstract)
- Lewis, Martin & Czaczkes 2008, Behav Ecol 19:805 — https://ideas.repec.org/a/oup/beheco/v19y2008i4p805-809.html
- Moll, Roces & Federle 2010, JCPA (https://doi.org/10.1007/s00359-010-0535-3); 2013, PLoS ONE 8:e52816 (PMC3534694)
- Stark & Yanoviak 2020, Integr Comp Biol — https://doi.org/10.1093/icb/icaa078 (abstract)
- Wintergerst & Ronacher 2012, JCPA — https://doi.org/10.1007/s00359-012-0714-5; Ronacher 2020 review (PMC7192874)
- Wahl, Pfeffer & Wittlinger 2015 (PMC4439428); Zollikofer 1994, JEB 192:95; Reinhardt & Blickhan 2014, JEB 217:2358
- Devigne & Detrain 2002 poster — https://dictionnaire-amoureux-des-fourmis.fr/Noms%20propres/Publis/2002/Actes-Colloques-Insectes-Sociaux-Vol15-Devigne-Detrain.pdf; Lenoir et al. 2009, J Chem Ecol (https://doi.org/10.1007/s10886-009-9669-6)
- Lecheval, Robinson & Mann 2024, J R Soc Interface (PMC11289642)
