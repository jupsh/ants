# Ant colony simulation — design

Goal: a browser-based simulation of real ant colonies that is as faithful to
the biology as current literature allows, built so that accuracy can keep
being improved for years without rewrites.

This file explains **how the model works and why**: the architecture, the
mathematics of every mechanism that is built, the observation models and
statistics that connect it to data, and how parameters are fitted. Progress,
results, the evidence policy and the decisions log are in
[`STATUS.md`](STATUS.md); run instructions and the code map are in
[`CLAUDE.md`](../CLAUDE.md). Sections 1–11 describe milestone M1 (*Lasius
niger*) as it is built. Section 12 is the longer-term design, part of which
exists as reserved code.

Notation: angles in rad, headings in the surface's own coordinates; σ(x) =
1/(1 + e^{−x}) is the logistic function; N(μ, s) a normal, Exp(m) an
exponential with mean m; WC(ρ) the wrapped Cauchy (§5.2); Δ(a, b) the signed
angle from b to a, wrapped to (−π, π].

---

## 1. Principles

1. **Mechanism over appearance.** Behaviour comes from mechanisms described
   in the literature (Boltzmann-walker reorientation, response-threshold
   stopping, path integration with error), not from game heuristics.
2. **Validation is part of the code base.** Published experiments are
   reproduced in `src/sim/experiments/`, and the comparison with their data
   is code (`src/sim/analysis/compare.ts`), run by tests and scripts.
3. **Observation models are part of the comparison.** A simulation is never
   compared with data directly. It goes through a model of how the data were
   recorded (tracking noise, an experimenter's volume estimate, a scan
   observer), and then through the *same* statistics code as the data.
4. **Every biological number has provenance.** Each parameter records its
   value, unit, how it was obtained (`measured` / `fitted` / `derived` /
   `estimated`), its sources and conditions (`src/sim/core/param.ts`, §10.4).
   An `estimated` parameter is an open invitation to find better data.
5. **Local information only.** Behaviour reads only what the ant can sense
   (percepts), its own memory and its own physiology (§2.2). This is
   enforced by a test.
6. **Real units everywhere.** mm, s, °C, mg, µL. Speeding up the display
   never changes the biology.
7. **Pure, deterministic core.** `src/sim/` has no DOM dependencies, draws
   all randomness from seeded per-purpose streams (§3), and gives
   bit-identical results in a browser worker, in Node tests and across a
   process pool.
8. **Evidence roles.** Every data set is *fit*, *development* (inspected
   while choosing structure) or *held-out*. Only fit data enter an
   objective (STATUS § Evidence policy).

---

## 2. Architecture

### 2.1 Layers

```
            ┌──────────── world truth (world/, agent/body.ts) ───────────┐
            │ apparatus, surface, food, pheromone field, bodies, ledger  │
            └───────┬──────────────────────────────────────────▲────────┘
     perception/    │ percept + interoception          physics/ │ (walls,
     perceive.ts    ▼                                           │  drinking,
            ┌──────────────────────┐   action   ┌───────────────┴──────┐
            │ behaviour (policy)   │──────────► │ physics: execute the │
            │ + mind (memory,      │            │ action, move mass    │
            │   traits, PI, walk)  │            │ through the ledger   │
            └──────────────────────┘            └──────────────────────┘
```

- **World** (`world/`, `agent/body.ts`): ground truth: positions, crop
  contents, food, pheromone, the conservation ledger. Behaviour never reads
  it.
- **Perception** (`perception/`): the only bridge from world to behaviour.
  It builds a `SurfacePercept` (gravity, light, antennal trail samples,
  surface edge ahead, food touched, nest odour, nestmates in contact) and an
  `Interoception` (reserve, crop fill, body water, mass, flow through the
  mouthparts).
- **Mind and behaviour** (`mind/`, `behavior/`, `models/walk.ts`): traits,
  mode, path integrator, walking state; policies map percepts to an
  *action* (walk with a motor modulation, stand, drink, lower the gaster,
  give or receive food, enter the nest).
- **Physics** (`physics/`): executes actions: walking with walls, path
  integration, trail deposition, drinking, food transfer, metabolism, water
  loss. All mass transfers are recorded in the ledger.

`test/architecture.test.ts` fails if any file in `behavior/`, `models/` or
`mind/` imports from `world/`, `nest/`, `env/`, `physics/`, `experiments/`
or a simulation orchestrator.

### 2.2 Directory layout (built)

```
src/sim/
  core/         rng (seeded streams), math (Arrhenius, angles), param (provenance)
  agent/        Body: physical ant (position, morphology, crop, reserve, water)
  perception/   percept types, perceive() and interocept()
  mind/         traits, mode, path integrator, walking state
  models/       walk.ts: exploratory walking motor program
  behavior/     lasiusForager (scout → drink → decide → return),
                lasiusNestWorker (in-nest, provisional)
  physics/      antPhysics (walking, PI, drinking, metabolism), contacts,
                trophallaxis (crop-to-crop transfer), ledger (conservation)
  world/        apparatus (planar lab set-ups), surface, food, field
                (pheromone grid), world (truth container)
  experiments/  E1 (Khuong), E2 (Mailleux), E6 (Bles), colony runner
  analysis/     trajectory stats, walk diagnostics, trophallaxis observer and
                stats, compare (z, KS, bootstrap, blocks), CMA-ES, Nelder–Mead
  reference/    other authors' models: Bles TEC, Khuong/Bonavita sectored walkers
  species/      lasiusM1 (M1 parameters + fits), refs (bibliography)
  parallel/     tasks.ts: pure work units for the process pool
src/worker/     one Web Worker per page; e*Compute.ts shared with precompute
src/ui/         pages (#e1, #e2, #e6, #colony, #status), 2D canvas/SVG charts
scripts/        fits, reports, diagnostics, process pool, precompute
test/           unit, numerics, conservation, architecture and validation tests
```

Reserved (present, not reachable from pages, scripts or M1 tests): `nest/`
(voxel nest), `env/` (climate, soil heat), `world/terrain|items|plumes|
spatialHash`, and seven draft species. See §12.

### 2.3 Running a simulation

There is no global scheduler yet. Each experiment owns a fixed-step loop
(`dt` 0.02 s for E1 fits, 0.05–0.1 s for E2 and the colony):

1. **perceive** (all ants see the same state),
2. **decide** (policy → action),
3. **act**: physics moves ants in index order, then resolves pairwise
   actions (food sharing), then metabolism,
4. **observe**: the experiment records what the experimenters recorded.

Stochastic events inside a step are timed exactly where it matters (§3.2),
so results converge as `dt` shrinks; `test/slow/*.convergence.test.ts`
checks this for E1 (8× smaller step) and E2.

### 2.4 Browser, workers and precomputed results

Each page posts a request to its own Web Worker, which runs
`src/worker/e*Compute.ts`. The same compute functions run at build time
(`scripts/precompute.ts`) for the default settings
(`src/ui/pageDefaults.ts`) and write `public/precomputed/*.json`. Each file
stores the request and a hash of all simulation inputs (`scripts/simHash.ts`:
`src/sim`, `src/worker`, the three fits the pages use, the data). A page uses
a stored result only if both match; otherwise it simulates live. So a stale
result is never shown as the current model's output.

### 2.5 Process pool

Simulation-heavy scripts use `scripts/pool.ts` (one `vite-node` child per
core − 1, limited by free memory). Work units in `src/sim/parallel/tasks.ts`
are pure functions of structured-cloneable arguments, every individual has
its own RNG stream, and results are joined in submission order, so pooled
output is **bit-identical** to serial output. Reductions happen in the
worker where possible (e.g. per-ant E1 summaries instead of tracks).

---

## 3. Randomness, determinism and exact timing

### 3.1 Streams

All randomness comes from `RNG` (`core/rng.ts`, mulberry32). Independent
streams are derived by hashing a seed with integer keys:

```
RNG.stream(seed, k1, k2, …):  h = mix32(seed ⊕ 0x9e3779b9);  h = mix32(h ⊕ mix32(k + 0x7f4a7c15)) for each key
```

(`mix32` is a splitmix-style finaliser.) The project uses streams at three
levels:

- **per individual**: ant *a* of run *seed* uses `RNG.stream(seed, a)`, so
  its draws do not depend on how many ants ran before it or in which order
  ants are updated;
- **per purpose** within an ant: the walker draws speed noise, distance
  clock, time clock, turn angles, jitter, pauses and stop resets from seven
  separate streams. A parameter change that alters how many turns or pauses
  occur leaves the other streams aligned, and the *k*-th turn keeps its
  angle;
- **per observer**: tracking noise (`OBSERVER_KEY`), the experimenter's
  volume estimates and the scan phase use their own streams, so adding an
  observer never changes the behaviour it observes.

Individual traits are drawn as standard normals and *then* scaled by the
parameters (e.g. `indiv = exp(σ_b·z)`), with a fixed number of draws whatever
the parameter values. Together these give **common random numbers**: two
parameter vectors evaluated with the same seed differ only through the
parameters, which makes fit objectives smooth and paired comparisons
sharp.

Samplers: Marsaglia polar normals; Exp(m) = −m·ln(1 − U); wrapped Cauchy
by inversion (§5.2); a constant hazard *r* over Δt fires with probability
1 − e^{−rΔt} (never the first-order *r*Δt).

### 3.2 Event-exact timing

Rates are defined per unit time or per unit distance, never per step:

- **Distance events** (reorientation): the distance to the next event is
  drawn as Exp(λ) and the walk is cut exactly there, even inside a step.
- **Time events** (pause onset, time-based turns): a *unit-rate exposure
  clock* E ~ Exp(1) is consumed at the current rate r; the event happens
  when ∫r dt reaches E. This is exact even if r changes between steps (e.g.
  with incline), and the remaining exposure carries over.
- **Continuous processes** (speed fluctuation, heading diffusion,
  geotactic torque, goal steering, turn-linked slowing) use their exact
  solutions over the interval (§5).

---

## 4. World model (M1, as built)

### 4.1 Apparatus and surface

M1 reproduces laboratory experiments, so the world is a **planar
apparatus**: a union of axis-aligned rectangles (nest, bridge, arena), each
open or covered (dark). Positions are intrinsic surface coordinates (mm
measured along the surface), so a path length is a true distance walked even
on a tilted plane.

- `mailleuxApparatus`: covered nest 250 × 200 mm, bridge 120 × 5 mm, arena
  60 × 60 mm; drop 1 at the arena centre, drop 2 mid-bridge (90 mm from
  drop 1). The bridge width is not reported; 5 mm is chosen because with
  10 mm only ~40 % of simulated scouts touched the mid-bridge drop versus
  > 95 % of real ones.
- `blesApparatus`: covered chamber 56 × 41 mm, passage 4 × 3 mm, arena
  61 × 49 mm (2 mm height ignored); drop at the arena centre (position not
  reported).
- `PlaneSurface(incline θ, downhill d)` reports the same slope sense
  everywhere. E1 uses d = −π/2, i.e. **+y is uphill**.

**Walls.** A walked segment is advanced in ≤ 0.5 mm pieces while the next
piece stays inside the apparatus (checking only end points let long steps
jump the 4 mm wall between the Bles nest and arena). At an edge the ant
turns to the smallest heading change k·0.26 rad (k ≤ 12, either side) whose
next 0.5 mm stays inside, else reverses.

### 4.2 Food

A `SugarDroplet` is a hemisphere of volume V (1 µL = 1 mm³), radius
r = (3V / 2π)^{1/3}. Only a fraction *a* of the initial volume V₀ can be
imbibed (a drop on a micropipette retracts into the tip):
accessible = max(0, V − V₀(1 − a)). This is an apparatus property, fitted
for the Mailleux pipettes (§7). Sucrose solution of molarity M contains
0.3423·M mg sugar per µL; density 0.998 + 0.1335·M mg/µL; water is the
difference.

### 4.3 Pheromone field

`PheromoneField` is a grid with exponential decay C(t) = C₀ e^{−(t − t₀)/τ}.
Decay is applied **lazily**: values are stored multiplied by
e^{(t_dep − t_base)/τ}, so the true field is `stored · s(t)` with one global
factor s(t) = e^{−(t − t_base)/τ}. A step costs O(1) whatever the grid size;
the grid is renormalised when s < e^{−30}. Deposits and samples are bilinear,
in units per mm of trail. Antennae sample it 0.6 rad either side of the body
axis at antennal reach (§6.2).

Trail **laying** is built and conserved. Trail **following** (the response
to trailL/trailR) is not implemented yet (STATUS backlog), so in M1 trail is
an output measured as the experimenters did, not yet an input to behaviour.

### 4.4 Conservation ledger

Sugar, water and protein (mg) are tracked in accounts: `external` (the
experimenter / environment), `food`, `crop`, `reserve`, `brood`, `store`,
`respired`, `evaporated`, `waste`. Every physical transfer is applied to the
entities **and** recorded as `ledger.move(q, from, to, amount)`. Two
invariants are tested:

- the sum over all accounts of each quantity is 0 (closed bookkeeping);
- each account equals the sum held by the entities it represents (food
  drops, crops, reserves), so nothing is created or destroyed silently.

---

## 5. Walking: the motor program (`models/walk.ts`)

### 5.1 Why this structure

The Khuong et al. (2013) tracks show heading decorrelation **per distance
walked**, not per time, and heavy-tailed turn angles. That is the signature
of a **Boltzmann walker**: straight runs ended by reorientation events that
occur per mm, with new headings drawn from a phase function of mean cosine
g. Khuong et al.'s own segmentation gives a mean free path ≈ 10 mm and
g ≈ 0.6; our pattern-oriented fit found 10.1 mm and 0.60 independently. The
other terms below each answer a specific misfit (STATUS step 5); several
are switched off (0) in the adopted fit.

### 5.2 Reorientation

Reorientation events come from two independent Poisson clocks:

- a **distance clock** with mean free path λ (events per mm = 1/λ),
- a **time clock** with rate μ_t (per s), which also runs during pauses.

Both are scaled by the same run-length modulation (below). At an event
the heading changes by a wrapped Cauchy turn:

```
h ← h + φ,   φ ~ WC(ρ = g),   f(φ) = (1 − ρ²) / (2π (1 + ρ² − 2ρ cos φ)),   ⟨cos φ⟩ = g
sampling:   φ = 2·atan( (1 − ρ)/(1 + ρ) · tan(π(U − ½)) )
```

**Heading correlation.** For a distance-clock walker with heading diffusion
D_s (rad²/mm) and no slope, homing or time-based terms, the expected heading
correlation after s mm of path is

```
⟨cos Δh(s)⟩ = exp( −s · [ (1 − g)/λ + D_s/2 ] )
```

so the persistence length is ≈ λ/(1 − g) ≈ 25 mm for λ = 10 mm, g = 0.6. The
data's path-lag heading correlations (§8.1) measure this directly.

**Run-length modulation.** The effective mean free path is

```
λ_eff = λ · runScale · exp(G·θ·cos 2(h − d)) · exp(H·w·cos(h − h_home))
w = exp(−r / R_home)        (r = |PI vector|, 0 when the homing bias is off)
```

- the first factor is set by behaviour (searching ants have shorter runs,
  homing ants straighter ones);
- the second is **geomenotaxis**: on an incline θ, runs along the steepest
  line (either direction) are longer;
- the third is the **homing bias** of isolated ants (Bonavita et al. 2026):
  runs heading back towards the release point are longer, fading with
  distance over R_home.

The time clock's rate is scaled by the same factor (rate = μ_t · λ/λ_eff).

**After-turn pulls.** Following each turn, the heading is pulled part way
towards the nearest end of the slope axis and towards home:

```
h ← h + min(1, P_g·θ) · Δ(axis(h), h)
h ← h + min(1, P_h·w) · Δ(h_home, h)
```

### 5.3 Continuous heading terms

Between events, over a walked piece of length ℓ taking time t:

- **Heading diffusion**: h ← h + √(D_s(θ)·ℓ + D_t·t) · N(0, 1), with
  D_s(θ) = D_s·e^{k_j θ} (per distance) and D_t (per time, also while
  paused).
- **Continuous geomenotaxis** (candidate C), with ψ the heading relative to
  downhill:

  ```
  axial:  dψ/ds = −a·sin θ·sin 2ψ   ⇒   tan ψ(s)     = tan ψ₀ · e^{−2a·sin θ·s}
  polar:  dψ/ds = −b·sin θ·sin ψ    ⇒   tan(ψ(s)/2) = tan(ψ₀/2) · e^{−b·sin θ·s}
  ```

  The axial torque pulls towards the nearest end of the slope axis (applied
  after folding ψ onto (−π/2, π/2]); the polar torque pulls downhill. Both
  are integrated exactly, one after the other (operator splitting).
- **Goal steering** (from behaviour, e.g. the home vector): first-order
  relaxation, exact for a constant goal: h ← h + Δ(goal, h)·(1 − e^{−k t}).

### 5.4 Speed

```
v = v₀ · I_i · exp(X − σ_w(θ)²/2) · s_i(θ) · (1 − u) · speedScale
```

- v₀: population median speed on flat ground (at the reference
  temperature).
- I_i = e^{σ_b z_i}: the individual's log-normal speed factor
  (between-ant SD σ_b).
- X: within-ant log-speed fluctuation, an Ornstein–Uhlenbeck process with
  stationary SD σ_w(θ) = σ_w·e^{k_sd θ} and correlation time τ_v, updated
  exactly over a walking interval t:
  X ← aX + σ_w√(1 − a²)·N(0, 1), a = e^{−t/τ_v}. The −σ_w²/2 term keeps the
  mean multiplier at 1.
- s_i(θ) = max(0.05, 1 − k_θ·κ_i·θ): slope slowing, independent of walking
  direction (as Khuong et al. found); κ_i is an individual log-normal
  multiplier with mean 1 (candidate D, SD 0 in the adopted fit).
- u: turn-linked slowing (below).
- speedScale: from behaviour and physiology (load, §6.5).

**Pauses.** Pause onsets form a Poisson process with rate
p(θ) = p₀·e^{k_p θ}, placed exactly with the exposure clock (§3.2); pause
durations are Exp(pause mean). Time-based turning and diffusion continue
while paused.

**Turn-linked slowing** (candidate T). A turn by Δ deepens a slowing state,
u ← max(u, U·(1 − cos Δ)/2), so a reversal nearly halts the ant; u decays
as e^{−t/τ_u}. The distance walked t seconds into an interval starting at
u₀ is

```
x(t) = v · ( t − u₀ τ_u (1 − e^{−t/τ_u}) )
```

which is convex in t, and the time to reach the next distance event is found
by Newton's method, so event positions stay exact.

**Stop reset** (candidate T). When a pause starts the heading is redrawn,
h ← h + WC(g_stop), then pulled home by min(1, P_stop·w). This addresses
the data's near-zero heading correlation across stops.

### 5.5 Variants and parameters

| Group | Parameters (`WalkParams`) | In adopted fit |
|---|---|---|
| Speed | `speed` v₀, `speedSdBetween` σ_b, `speedSdWithin` σ_w, `speedTau` τ_v | yes |
| Pauses | `pauseRate` p₀, `pauseMean` | yes |
| Reorientation (distance) | `meanFreePath` λ, `g`, `jitter` D_s | yes |
| Homing bias | `homeRunBias` H, `homeHeadingPull` P_h, `homeRange` R_home | yes |
| Slope | `slopeSpeedK` k_θ, `slopePauseK` k_p, `slopeJitterK` k_j, `slopeSpeedSdK` k_sd, `geoRunGain` G, `geoHeadingPull` P_g | yes |
| B: time-based turning | `jitterTime` D_t, `turnRateTime` μ_t | 0 |
| T: turn coupling | `turnDip` U, `turnDipTau` τ_u, `stopTurnG` g_stop, `stopHomePull` P_stop | off |
| C: continuous geotaxis | `geoTorque` a, `geoPolar` b | 0 |
| D: slope sensitivity | `slopeSpeedKSd` | 0 |

The adopted fit (`data/fits/e1-walk.json`) has the session-2 structure
(called A0). B and T are fitted candidates (`e1-B*.json`, `e1-T.json`); the
comparison between them and the choice of fitting strategy are in progress
(STATUS step 5).

---

## 6. The ant

### 6.1 Body and morphology

`Body` holds world truth for one ant: position, heading, crop (µL, sugar
mg, water mg), energy reserve (mg sucrose-equivalent), body water (mg),
gaster state, and physical traits (`intakeFactor`). M1 morphology: length
4.1 mm (measured), mass 2.0 mg, crop capacity 2.0 µL (derived), antennal
reach 2.6 mm (estimated).

### 6.2 Perception

| Percept | How it is computed |
|---|---|
| incline, downhill | slope sense of the surface (gravity receptors) |
| light, inNest | region under the ant (covered regions are dark) |
| trailL, trailR | field sampled at the antenna tips, ±0.6 rad off the body axis at antennal reach, divided by the detection threshold |
| edge | first of the probes at 0, +0.6, −0.6 rad that falls outside the apparatus |
| food | a drop whose edge is within antennal reach (sucrose is not volatile: contact only) |
| nestCue | within 8 mm of the entrance: bearing and strength R/max(d, 1) |
| contacts | nestmates in antennal contact (§9.1), with cues: laying trail, carrying (crop > 20 % of capacity), mouth contact |

Interoception: reserve fraction, crop volume and capacity, body water
fraction, body mass, and the volume that passed the mouthparts this step
(+ in, − out).

### 6.3 Mind

`Mind` holds traits fixed for life (desired-volume factor, never-layer flag,
lay intensity, forage drive), the current mode and time in it, the walking
state, the path integrator, trip memory (volume ingested, desired volume,
satisfied, laying, last food site, search time) and sharing state. It never
contains world truth.

### 6.4 Path integration

The path integrator estimates the position relative to the trip origin. For
each walked piece of length ℓ along true heading h:

```
ĥ = h + b_trip + √(c·ℓ)·N(0, 1)         b_trip ~ N(0, compassBias), drawn at trip start
PI ← PI + gain · ℓ · (cos ĥ, sin ĥ)
```

so the error has a per-trip systematic part and a random-walk part whose
variance grows with distance (c = `compassNoise`, rad²/mm). The home
heading is atan2(−PI_y, −PI_x).

### 6.5 Physiology (`physics/antPhysics.ts`)

Temperature dependence uses the Arrhenius factor relative to a reference
temperature:

```
A(T; T_ref, E) = exp( (E/k_B) · (1/T_ref − 1/T) )     (T in K, E in eV)
```

**Drinking.** The drinking ant is held at the drop edge (r + 0.35 body
lengths from its centre). Intake per step:

```
ΔV = min( r₀ · f_i · Δt · A(T; 22 °C, 0.3 eV) / e^{1.05(M − 0.6)},  accessible,  crop room )
```

r₀ = 0.0095 µL/s for 0.6 M sucrose; f_i is the individual intake factor
(log-normal, mean 1, SD σ_r fitted in E2); the exponential term is the rise of
viscosity with concentration.

**Metabolism.** Sugar is burnt at

```
rate = m₀ · mass^{0.75} · A(T; 25 °C, 0.65 eV) · (3 if walking else 1)     (mg/h)
```

drawn first from the crop (absorbed into the reserve together with a slow
refill of 0.1 % of the reserve deficit per second) and then from the reserve.
Oxidation releases 0.579 mg water per mg sucrose. The maximum reserve is the
resting need for `reserveDays` (14 d) at 25 °C:
reserveMax = m₀ · mass^{0.75} · 24 · reserveDays. An ant starved for n days
starts at reserve fraction max(0.02, 1 − n/reserveDays). The desired volume
reads this through interoception (§7.1).

**Water.** Cuticular loss follows the vapour-pressure deficit:

```
loss (mg/s) = P · (A_body/100) · VPD / 1000 / 3600,    VPD = e_s(T)·(1 − RH/100)
e_s(T) = 4.5808 · exp(17.27 T / (T + 237.3))  mmHg   (Magnus–Tetens)
```

with P the cuticular permeability (µg cm⁻² h⁻¹ mmHg⁻¹) and A_body in mm².
An ant dies when its reserve is exhausted or its body water falls below 60 %
of the maximum (0.7 × mass).

**Load.** A laden ant walks at speedScale = 1 / (1 + k_load · 1.08·V_crop /
mass) (≈ 1.08 mg per µL of 0.6 M sucrose).

---

## 7. Forager behaviour (`behavior/lasiusForager.ts`)

The policy follows Mailleux et al. (1999–2009): each forager has a desired
volume; it leaves the food when satiated and then recruits by laying trail,
or leaves an exhausted source unsatisfied and searches nearby.

```
explore ──touch food──► drink ──satiated / crop full──────────────► return (lays trail
                          │                                           ▲    unless never-layer)
                          └─source empty─► search ──time out / lays──┘
                                (lays with prob. q)
```

### 7.1 Desired volume

```
h   = clamp( (1 − reserve) / hungerScale, 0, 1 )                (hunger from interoception)
V_d = ( V_fed + (V_hungry − V_fed)·h ) · F_i,      F_i = e^{σ_d z_i}   (individual, fixed for life)
```

### 7.2 Leaving the food (the stopping rule)

With V the satiation signal (volume ingested on this trip), the per-second
leaving hazard is one of the step-3 variants:

| Variant | Hazard | Notes |
|---|---|---|
| M_a (adopted) | r(V) = r_max · σ(η(V − V_d)) | per-second hazard with a low maximum; individual V_d |
| M_b | η · σ(η(V − V_c)) · dV/dt | the published rule, per µL ingested; shared V_c |
| M_d | as M_a, but V grows by r̄·Δt per step of actual ingestion | satiation measures drinking time |

For M_b the hazard per µL gives a closed-form stopping-volume distribution.
The survival to volume V is

```
S(V) = exp( −∫₀^V η σ(η(v − V_c)) dv ) = (1 + e^{−ηV_c}) / (1 + e^{η(V − V_c)})
```

which is logistic with location V_c and scale 1/η (when ηV_c ≫ 1), whatever
the intake rate. That is why the per-volume form is used rather than the
published per-second form ηΔV·σ(…), which matches it only at a fixed intake
rate.

A full crop (≥ 98 % of capacity) always ends drinking as satiated. A drop
that gives nothing for `emptyPatience` s (or is no longer touched) is left
unsatisfied.

### 7.3 Trail decision and search

- **Satiated**: lays trail on the way home unless the ant is a never-layer
  (fraction 0.12, measured).
- **Unsatisfied** (source exhausted): lays trail with probability q
  (`unsatisfiedLayProb`; needed because layers and non-layers drank the same
  volume at a 0.7 µL drop), otherwise performs area-restricted search for
  Exp(`arsMean`) s with shorter runs (runScale 0.4) and steering back to the
  food site when > 15 mm from it. An ant that later reaches its desired
  volume becomes satiated and lays.

### 7.4 Returning and marking

The returning ant steers to the home vector with gain k_home (doubled when
the nest odour is sensed), walks straighter (runScale 3) and slower when
laden (§6.5). Gaster contacts are a two-state Markov process with mean
contact duration τ_g and on-rate chosen so that the stationary fraction of
time with the gaster down equals the individual's lay intensity ℓ_i:

```
rate_on = ℓ_i / ((1 − ℓ_i)·τ_g),   rate_off = 1/τ_g    ⇒   P(down) = rate_on/(rate_on + rate_off) = ℓ_i
```

ℓ_i is log-normal with the measured mean 0.13 and SD 0.08 (capped at 0.95).
Pheromone is deposited along the walked path in ≤ 1 mm pieces while the
gaster is down.

---

## 8. Experiments, observation models and statistics

Every experiment has three parts: the **protocol** (apparatus, conditions,
what is simulated), the **observer** (how the data were recorded) and the
**statistics** (computed by the same code for data and simulation).

### 8.1 E1: exploratory walking (Khuong et al. 2013)

**Protocol** (`e1Exploration.ts`): isolated workers released one at a time
at the centre of a plane inclined at 0, 20, 30, 45 or 60°, 26 °C; uniform
initial heading; walked until 205 mm from the release point (or 600 s);
recorded at 25 Hz. 69 ants per incline in the data.

**Observer** (tracking error): white Gaussian position error per sample,
SD σ_x and σ_y (along the slope axis) per incline, from the ant's own
observer stream. The values were deconvolved from the data: the
second-difference noise estimate while ants are nearly still, minus what
slow movement of noise-free simulated ants contributes to the same estimator
(σ² = σ²_data − σ²_moving). σ_y rises with incline as ≈ 1/cos θ (a camera
viewing a tilted canvas).

**Track preparation** (as Khuong et al., applied to both): resample at
0.04 s, 3-point centred moving average, discard the start until 10 mm from
the first point, truncate on first leaving 200 mm.

**Statistics** (`analysis/trajectory.ts`, `walkDiagnostics.ts`). Velocity and
heading come from displacements over 0.2 s; a sample is *stopped* below
2 mm/s.

| Statistic | Definition |
|---|---|
| speed q10/q50/q90 | quantiles of moving speeds (0.05 mm/s histogram, linear within bins) |
| stopped | fraction of samples below 2 mm/s |
| heading correlation | ⟨cos(h(s + L) − h(s))⟩ at path lags L = 5, 10, 20, 30, 50 mm |
| turn SD, kurtosis | heading increments between consecutive non-overlapping 0.2 s windows |
| radial velocity | mean velocity away from the release point in 20 mm bins, 0–160 mm |
| alignment | −⟨cos 2h⟩ over moving samples (0 isotropic, +1 along the slope axis) |
| straightness | net/path displacement over consecutive 50 mm windows of path |
| speed spread | log SD of per-ant mean moving speed |
| per-ant speed, exit time | two-sample KS on per-ant values |
| big-turn fraction, median turn | P(\|turn\| > 0.5 rad) and median \|turn\| per 2.5 mm chord, in 5 speed bins (2–8 … 40–80 mm/s) |
| per-ant turning–speed slope | OLS slope of log(1 − ⟨cos⟩ at 10 mm) on log median speed, across ants |
| stop reorientation | ⟨cos⟩ of heading into vs out of stops < 0.4 s and 0.4–1.2 s |

Instantaneous speeds are autocorrelated within a track, so their
distribution is compared through quantiles with bootstrap SEs, never with a
KS test. Every statistic is accumulated per ant as sufficient statistics
(sums, sparse histograms, moments), so resampling ants is just summing.

### 8.2 E2: drinking and the trail decision (Mailleux et al. 1999, 2009, 2003)

**Protocol** (`e2Mailleux.ts`): one scout at a time, starved 1, 4 or 8
days, 22 °C. The papers observe scouts from their arrival in the foraging
area, so the scout starts at the arena end of the bridge with the path
integrator it would have after walking the bridge (true displacement read
through its compass bias). Conditions: a 3 µL drop (1999); two 0.7 µL
drops, the second set out mid-bridge once the scout is at the first (2009);
six 0.3 µL drops (2003, used once as a held-out test).

**Observer**: drinking times and trail marks are recorded as defined in
the papers (e.g. trail after drop 1 = any gaster contact on the first 3 cm of
the bridge). Volumes were gaster-ellipsoid estimates, so the simulated
observer reports max(0, V_true + N(0, σ_m)) from its own stream; σ_m is
fitted together with the intake-rate SD σ_r on the 2009 volume–time
regression (slope and Spearman r).

**Targets** (`e2Targets.ts`): means with SE = SD/√n, proportions with
binomial SE, each with its evidence role. Only scouts that found the first
drop are observed, as in the experiments. SE_sim comes from independent seed
blocks (§10.2).

### 8.3 E6: food sharing in the nest (Bles et al. 2022)

**Protocol**: 5 colonies of 50 workers; a sucrose source offered at minute
30; scans every minute from minute 30 to 90.

**Observer** (`analysis/trophallaxis.ts`): a contact is recorded at scan k
if mouth contact lasts > 5 s in total and is in progress at the scan
instant τ_k = φ + 60k s (k = 0 … 60). The scan phase φ ~ U(0, 60) s is
drawn per colony because the real one is unknown. The same donor → receiver
pair on consecutive minutes is merged into one event. Applying this merge
rule to the raw scans reproduces the published event count, which checks
the observer.

**Statistics** (per colony, then mean and SD over colonies):

- events, participants, forager count, the four pair types F/NF → F/NF, and
  the share of donation events made by non-foragers;
- T50: the (lower) median start minute of events after food introduction;
- Gini of events per participant: G = Σᵢ (2i − n − 1)·x₍ᵢ₎ / (n·Σx), with x sorted;
- network (one secondary family): fraction with both roles, global
  efficiency E = Σ_{i≠j} 1/d_ij / (N(N − 1)) on the undirected interaction
  graph.

A simulated ant counts as a forager after ≥ 5 consecutive seconds of feeding
at the source (the paper's definition).

---

## 9. Colony runner and in-nest workers (step 4, provisional)

The colony runner (`experiments/colonyBles.ts`) puts 50 ants in the Bles
lab nest (§4.1) to inspect movement, contacts and food flow. Its geometry,
contact detection and conservation are tested; **its behavioural parameters
are placeholders** (`LASIUS_NEST_DEF`, all `estimated`), and it is not
compared with E6 until the walking decision (STATUS step 5) is settled.

### 9.1 Contact geometry (`physics/contacts.ts`)

- Head point: 0.4 body lengths ahead of the body centre.
- **Antennal contact**: one ant's head within antennal reach of the other's
  head or body centre (either way round).
- **Mouth contact**: heads within 0.3 body lengths and headings roughly
  opposed (cos Δh < −0.5), the posture of trophallaxis.

Contacts are found with a spatial hash and reported in a fixed (a, b)
order, so results do not depend on hash internals.

### 9.2 Food transfer (`physics/trophallaxis.ts`)

Food moves only when the donor acts "give" to B **and** B acts "receive"
from the donor. The pair is then held face to face and the donor's crop
flows at a fixed rate (crop capacity per 120 s, from the TEC model's unit),
with sugar and water in the donor crop's proportions, limited by what the
donor holds and the receiver's room. Crop-to-crop transfers leave the
ledger's account totals unchanged; tests compare per-ant sums with the ledger
and the transfer log.

### 9.3 Step order and policy

Per step: all ants perceive; inside the nest they run `lasiusNestWorker`
(rest ↔ active switching; offer food when carrying more than 10 % of crop
capacity; accept when the reserve is below 80 %; bouts end when the donor is
empty, the receiver is full or no longer hungry, flow stalls for 3 s, or at a
fixed hazard; hungry ants with an empty crop leave to forage at a rate scaled
by an individual forage drive). Outside they run the forager policy. Then
movement in index order, then sharing in donor-index order, then metabolism
and hand-overs between the two policies. Sharing bouts are written as
`ContactInterval`s, the form the E6 observer takes.

---

## 10. Comparing with data and fitting

### 10.1 Two z-scores

```
judging:  z = (m_sim − m_data) / √(SE_data² + SE_sim²)       (combinedZ)
fitting:  z = (m_sim − m_data) / SE_data                     (fitZ)
```

Judging needs both sampling errors. Fitting uses fixed weights: with SE_sim
in the objective, an optimiser could lower the loss by making the
simulation noisier. Verdicts: |z| ≤ 2 consistent, ≤ 3 marginal, else off.
A calibration test (model vs itself, 480 z-scores) gives SD(z) = 1.05 and
6 % beyond 2.

Other comparisons:

- **Spread** (between-ant or between-colony SD), separately from means:
  z = ln(s_sim/s_data) / √(1/(2(n_sim − 1)) + 1/(2(n_data − 1))). This is
  exact only for normal samples, so it is read as indicative for skewed
  times; E1 uses bootstrap SEs instead.
- **Distributions** of per-individual values: two-sample KS, p from the
  Kolmogorov distribution with Stephens' correction
  (λ = (√n_e + 0.12 + 0.11/√n_e)·D, n_e = nm/(n + m)), reported as the
  equivalent two-sided normal z (capped at 8) and signed by the direction of
  the median difference.

### 10.2 Standard errors

- **Cluster bootstrap over ants** (E1, data and simulation): resample ants
  with replacement 200 times, recompute every statistic from the summed
  per-ant sufficient statistics, take the SD. Ants are the independent units
  (each simulated ant has its own stream).
- **Seed blocks** (E2, E6): R independent blocks of possibly unequal size
  n_b; batch-means ratio estimator around the pooled mean m:

  ```
  SE² = Σ_b (n_b / n̄)² (m_b − m)² / (R (R − 1))
  ```

### 10.3 Losses

- **E1**: statistics are grouped into **families** of correlated statistics
  (speed quantiles, heading-correlation lags, radial bins, big-turn
  fractions by speed, …). The loss is Σ over families of the mean z² within
  the family, so a family counts once however many lags it has. There are 15
  families. In judging, a statistic the simulation cannot estimate scores
  z² = 100; in fitting a candidate with any inestimable statistic ranks below
  every candidate that estimates all of them (+10⁷ each).
- **E2**: Σ z² over the targets with role *fit* (inestimable: 100).
  Model comparison reports k and loss + 2k (a heuristic AIC-like penalty).

### 10.4 Fitting procedure

**Parameter transforms.** Each fitted parameter has a plausibility range
[lo, hi], wide enough never to bind, and the optimiser works on an
unbounded x with u = σ(x):

```
log scale:     p = lo · (hi/lo)^u           linear: p = lo + (hi − lo)·u
```

A fit ending within 1 % of a limit is reported (`atLimit`).

**E1: CMA-ES** (`analysis/cmaes.ts`; Hansen 2016): (μ/μ_w, λ) with
cumulative step-size adaptation and rank-one plus rank-μ covariance
updates, default λ = 4 + ⌊3 ln n⌋.

- Every generation uses fresh seeds, shared by all its candidates (common
  random numbers within a generation, no accumulated seed luck across
  generations). Each evaluation simulates 640 ants per incline.
- The estimate is the **final distribution mean**, not the best point seen
  (which is biased towards lucky evaluations).
- Initial per-coordinate SDs come from the local curvature at the start:
  c_i = (f(x + h e_i) + f(x − h e_i) − 2f(x)) / h² with h = 0.2, and
  σ_i = clip(√(Δ/c_i), 0.02, 0.3) with Δ = 10, so a 1-SD step raises the loss
  by about Δ.
- Each stage runs from two starts plus IPOP restarts (population doubled
  per restart) from the best; runs stop at a generation cap or when σ ×
  the largest axis < tolX.
- **Selection vs judgement**: the runs are compared on one common batch,
  which is therefore selection data. The chosen fit is judged only on
  independent batches (5 × 1000 flat-ground ants; 300 per incline for the
  report).

**Strategies**: *staged* (default): stage 1 fits speed, pauses, turning and
homing on flat ground; stage 2 fits the slope terms on 30° and 60° (mean
loss). *Joint*: one CMA-ES over all parameters on 0°, 30° and 60°. 20° and
45° are development inclines, never fitted.

**Parameter recovery** (`--recover`): the data are replaced by tracks
simulated from known parameters. With a large synthetic reference scored as
69 ants (SEs × √(n/69), KS with an effective sample size), only the
reference's sampling error changes, which separates optimiser failure from
data noise. The truth's own loss on the same fresh batches is the noise
floor.

**E2: Nelder–Mead** (`analysis/optimize.ts`) on log/logit/bounded
transforms, fixed budget (160 evaluations, 150 scouts per condition, common
random numbers), the same for every variant compared.

### 10.5 Parameters and provenance

Species parameters are `Sourced` records (`core/param.ts`): value, unit,
confidence (`measured` / `fitted` / `derived` / `estimated`), sources (keys
into `species/refs.ts`), note, conditions, sample size, transform,
uncertainty and, for fitted values, the fit procedure. Parameter
uncertainty and between-individual variation are kept apart: variation is a
parameter of its own (e.g. `desiredSd`). Fit files are applied with
`applyFit`, which writes the fitted value into the record and marks it
`fitted`, so the provenance always shows the value actually used. `resolve`
strips provenance for the simulation. `species/lasiusM1.ts` holds the M1 set.

---

## 11. Reference models (`src/sim/reference/`)

Other authors' models are ported as **baselines**: a mechanism of ours has
to beat them on the same observer and statistics. They are not part of our
ant and do not use the perception boundary. A `compat` flag reproduces the
authors' code exactly, quirks included; `compat: false` fixes the quirks.

- **TEC / one-caste (Bles et al. 2022)**, `blesTEC.ts`: a non-spatial
  model, 1 tick = 1 s, crop in units (1 unit = 1 s of feeding or transfer).
  Each agent has give and receive propensities θ_i, ϒ_i (drawn around
  forager or worker means: two emergent castes) and a source-leaving
  propensity α_i ~ Power(1/30). Per tick, a carrying agent offers with
  probability θ_i·q²/(q² + k²), an agent accepts with probability
  ϒ_i·k²/(q² + k²) (k = 120 units), pairs transfer 1 unit/s and separate at
  1/260 s⁻¹ per member, and foragers at the source leave at β = 1/120 s⁻¹
  carrying the time spent feeding. Full specification and quirks:
  [`research/bles-tec-spec.md`](research/bles-tec-spec.md). Refitted
  through our scan observer: `data/fits/e6-tec.json`.
- **Sectored Boltzmann walkers (Khuong et al. 2013; Bonavita et al.
  2026)**, `sectoredWalker.ts`: non-parametric. Recorded tracks are
  segmented into straight runs (Khuong's algorithm; output committed in
  `data/reference/`). Each vertex gives a row (turn ω, length and duration of
  the next segment), pooled by the sector (8 × π/4) of the incoming heading,
  in the arena frame (`xy`) or relative to the direction home (`start`). The
  walker repeatedly draws a row from its current sector's pool until 200 mm
  from the origin. Its tracks go through the same tracking observer and
  statistics as ours.

---

## 12. Longer-term design

M1 deliberately simulates flat laboratory apparatus. The design below is
the target for later milestones; items marked *reserved* exist as code
under `src/sim/` but are not yet used or validated, the rest is not started.
Order and scope are set in STATUS § Milestones.

### 12.1 World

- **One 3D coordinate system** (mm, +z up): a heightmap surface for
  foraging (2.5D; pheromone lives on it) and a **sparse 3D voxel nest**
  under (or, for mound builders, above) the entrance, walked continuously
  from the surface down the shaft. Chamber floor area, helical shafts,
  vertical temperature gradients and crowding are intrinsically 3D
  (Tschinkel's casts). *Reserved:* `world/terrain.ts` (heightmap; spoil
  relaxes to the 34° angle of repose), `nest/` (voxel grid with
  26-neighbour BFS navigation fields, chamber detection, species
  architecture templates excavated pellet by pellet).
- **Climate.** Diel air and soil-surface temperature by Parton & Logan
  (1981): a truncated sine by day with the maximum lagging solar noon,
  exponential decay at night. Soil temperature at depth by the 1D heat
  equation ∂T/∂t = κ ∂²T/∂z², forced at the surface, which gives damping
  and phase lag with depth (damping depth √(2κ/ω) ≈ 10–13 cm). Body
  temperature between air and surface temperature by leg length (boundary
  layer). *Reserved:* `env/climate.ts`, `env/soilHeat.ts`.
- **Chemical signals.** Multiple trail channels per species (e.g. Pharaoh
  ant attractive and repellent). Trail following by osmotropotaxis
  (Hangartner 1967): steer to reduce the bilateral difference between the
  antennae, Weber-normalised. Alarm pheromone as instantaneous point
  releases in a half-space (Bossert & Wilson 1963),
  C(r, t) = 2Q/(4πDt)^{3/2}·exp(−r²/4Dt), calibrated from the active-space
  radius R and fade time: D = e·R²/(6 t_fade), Q/K = (4πD t_fade)^{3/2}/2.
  *Reserved:* `world/plumes.ts`. The grid, decay and antennal sampling exist
  (§4.3); the response does not.

### 12.2 Individuals

- Size distributions per species (monomorphic to strongly polymorphic),
  with mass, speed, carrying capacity and crop volume scaling
  allometrically.
- Locomotion: speed × Arrhenius temperature term (Hurlbert et al. 2008) ×
  mass^{0.25} × load × slope; chill coma below CT_min, heat death above
  CT_max.
- Navigation beyond path integration: systematic search around the fictive
  nest (Wehner & Srinivasan 1981), visual route memory, site fidelity.

### 12.3 Colony

- Brood: egg → larva → pupa → adult by degree-day development; caste and
  size by larval nutrition.
- Nutrition: carbohydrate and protein flows (the ledger already tracks
  protein, brood and store accounts); colony hunger feeding back on
  foraging and recruitment.
- Task allocation: response thresholds (Bonabeau, Theraulaz & Deneubourg
  1996) with reinforcement and age polyethism; many workers inactive.
- Recruitment modes: mass recruitment, tandem running (*Temnothorax*),
  interaction-rate regulation (*Pogonomyrmex*), trunk trails (*Atta*),
  solitary foraging (*Cataglyphis*). Draft species files exist for these
  (*reserved*, v1 provenance, unvalidated).
- Nest construction scaling with colony size (Buhl et al. 2004; Rasse &
  Deneubourg 2001); brood moved along the vertical temperature profile.
- Mortality: age, starvation, heat, predation; corpse removal.

### 12.4 Rendering

The M1 pages use 2D canvas and SVG. The plan is a three.js renderer that
receives compact snapshots (transferable typed arrays) from the worker and
sends commands back (place food, disturb, select ant, change speed), and
never mutates simulation state.

### 12.5 Roadmap beyond that

- Fully emergent excavation (pheromone/crowding-driven digging rules
  replacing templates, validated against casts).
- Climbable vegetation (aphids on stems, *Atta* cutting in the canopy).
- Competition, territoriality and raids; predators and parasitoids.
- Seasons, overwintering, sexual brood, nuptial flights, colony founding.
- Rain, humidity and desiccation.
- Army ants (*Eciton*): bivouacs and swarm raids.
- Validated aggregation, or a WebGPU back end, for very large colonies.
