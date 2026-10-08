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

**Notation.** Mathematics is written in LaTeX, inline as `$…$` and displayed
in fenced code blocks with the language `math`; GitHub and the VS Code
Markdown preview render both. Two GitHub rules: never put a math block
inside a list item (it shows as plain code), and inside `$…$` avoid
backslash-punctuation such as `\,` or `\!` (GitHub's Markdown strips the
backslash before the math is rendered). Angles are in rad and headings $h$ in the surface's own
coordinates. $\sigma(x) = 1/(1+e^{-x})$ is the
logistic function (a $\sigma$ with a subscript is a standard deviation).
$\mathcal N(\mu, s^2)$ is a normal with SD $s$, $\mathrm{Exp}(m)$ an
exponential with mean $m$, $\mathcal U(a, b)$ a uniform,
$\mathrm{WC}(\rho)$ the wrapped Cauchy (§5.2), and
$\Delta(a, b) \in (-\pi, \pi]$ the signed angle from $b$ to $a$.
Code names of parameters are given in backticks where they first appear.

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
   `estimated`), its sources and conditions (`src/sim/core/param.ts`, §10.5).
   An `estimated` parameter is an open invitation to find better data.
5. **Local information only.** Behaviour reads only what the ant can sense
   (percepts), its own memory and its own physiology (§2.1). This is
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
($\Delta t$ = 0.02 s for E1 fits, 0.05–0.1 s for E2 and the colony):

1. **perceive** (all ants see the same state),
2. **decide** (policy → action),
3. **act**: physics moves ants in index order, then resolves pairwise
   actions (food sharing), then metabolism,
4. **observe**: the experiment records what the experimenters recorded.

Stochastic events inside a step are timed exactly where it matters (§3.2),
so results converge as $\Delta t$ shrinks; `test/slow/*.convergence.test.ts`
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
streams are derived by hashing a seed with integer keys $k_1, k_2, \dots$:

```math
s_0 = \mathrm{mix32}(\text{seed} \oplus \mathtt{0x9e3779b9}), \qquad
s_j = \mathrm{mix32}\bigl(s_{j-1} \oplus \mathrm{mix32}(k_j + \mathtt{0x7f4a7c15})\bigr)
```

where $\mathrm{mix32}$ is a splitmix-style finaliser. The project uses
streams at three levels:

- **per individual**: ant $a$ of a run uses `RNG.stream(seed, a)`, so its
  draws do not depend on how many ants ran before it or in which order ants
  are updated;
- **per purpose** within an ant: the walker draws speed noise, distance
  clock, time clock, turn angles, jitter, pauses and stop resets from seven
  separate streams. A parameter change that alters how many turns or pauses
  occur leaves the other streams aligned, and the $k$-th turn keeps its
  angle;
- **per observer**: tracking noise (`OBSERVER_KEY`), the experimenter's
  volume estimates and the scan phase use their own streams, so adding an
  observer never changes the behaviour it observes.

Individual traits are drawn as standard normals $z_i$ and *then* scaled by
the parameters (e.g. $I_i = e^{\sigma_b z_i}$), with a fixed number of draws
whatever the parameter values. Together these give **common random
numbers**: two parameter vectors evaluated with the same seed differ only
through the parameters, which makes fit objectives smooth and paired
comparisons sharp.

Samplers: Marsaglia polar normals; $\mathrm{Exp}(m) = -m \ln(1-U)$
with $U \sim \mathcal U(0,1)$; wrapped Cauchy by inversion (§5.2). A
constant hazard $r$ over $\Delta t$ fires with probability
$1 - e^{-r \Delta t}$, never the first-order $r \Delta t$.

### 3.2 Event-exact timing

Rates are defined per unit time or per unit distance, never per step:

- **Distance events** (reorientation): the distance to the next event is
  drawn as $\mathrm{Exp}(\lambda)$ and the walk is cut exactly there,
  even inside a step.
- **Time events** (pause onset, time-based turns): a *unit-rate exposure
  clock* $E \sim \mathrm{Exp}(1)$ is consumed at the current rate
  $r(t)$; the event happens at the first $t$ with
  $\int_0^t r(t') dt' = E$. This is exact even if $r$ changes between steps
  (e.g. with incline), and the remaining exposure carries over.
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
  more than 95 % of real ones.
- `blesApparatus`: covered chamber 56 × 41 mm, passage 4 × 3 mm, arena
  61 × 49 mm (2 mm height ignored); drop at the arena centre (position not
  reported).
- `PlaneSurface` has incline $\theta$ and in-surface downhill heading
  $h_\downarrow$, the same everywhere. E1 uses $h_\downarrow = -\pi/2$,
  i.e. **+y is uphill**.

**Walls.** A walked segment is advanced in ≤ 0.5 mm pieces while the next
piece stays inside the apparatus (checking only end points let long steps
jump the 4 mm wall between the Bles nest and arena). At an edge the ant
turns by the smallest $\pm k \cdot 0.26$ rad ($k \le 12$) whose next 0.5 mm
stays inside, else reverses.

### 4.2 Food

A `SugarDroplet` is a hemisphere of volume $V$ (1 µL = 1 mm³) and radius

```math
r_{\text{drop}} = \left(\frac{3V}{2\pi}\right)^{1/3}.
```

Only a fraction $a$ of the initial volume $V_0$ can be imbibed (a drop on a
micropipette retracts into the tip): accessible volume
$\max\bigl(0, V - V_0(1-a)\bigr)$. This is an apparatus property, fitted
for the Mailleux pipettes (§7). Sucrose solution of molarity $M$ contains
$0.3423 M$ mg sugar per µL and has density $0.998 + 0.1335 M$ mg/µL;
water is the difference.

### 4.3 Pheromone field

`PheromoneField` is a grid with exponential decay
$C(t) = C_0 e^{-(t-t_0)/\tau}$. Decay is applied **lazily**: a deposit at
time $t_{\text{dep}}$ is stored multiplied by
$e^{(t_{\text{dep}} - t_{\text{base}})/\tau}$, so the true field is

```math
C(\mathbf x, t) = \text{stored}(\mathbf x) \cdot s(t), \qquad s(t) = e^{-(t - t_{\text{base}})/\tau},
```

one global factor. A step costs $O(1)$ whatever the grid size; the grid is
renormalised (and $t_{\text{base}}$ reset) when $s < e^{-30}$. Deposits and
samples are bilinear, in units per mm of trail. Antennae sample the field
0.6 rad either side of the body axis at antennal reach (§6.2).

Trail **laying** is built and conserved. Trail **following** (the response
to `trailL`/`trailR`) is not implemented yet (STATUS backlog), so in M1
trail is an output measured as the experimenters did, not yet an input to
behaviour.

### 4.4 Conservation ledger

Sugar, water and protein (mg) are tracked in accounts: `external` (the
experimenter / environment), `food`, `crop`, `reserve`, `brood`, `store`,
`respired`, `evaporated`, `waste`. Every physical transfer is applied to the
entities **and** recorded as `ledger.move(q, from, to, amount)`. With
$B_{q,c}$ the balance of quantity $q$ in account $c$, two invariants are
tested:

```math
\sum_{c} B_{q,c} = 0 \quad \text{(closed bookkeeping)}, \qquad
B_{q,c} = \sum_{e \in c} q_e \quad \text{(each account equals what its entities hold)},
```

so nothing is created or destroyed silently.

---

## 5. Walking: the motor program (`models/walk.ts`)

### 5.1 Why this structure

The Khuong et al. (2013) tracks show heading decorrelation **per distance
walked**, not per time, and heavy-tailed turn angles. That is the signature
of a **Boltzmann walker**: straight runs ended by reorientation events that
occur per mm, with new headings drawn from a phase function of mean cosine
$g$. Khuong et al.'s own segmentation gives a mean free path
$\lambda \approx 10$ mm and $g \approx 0.6$; our pattern-oriented fit found
10.1 mm and 0.60 independently. The other terms below each answer a specific
misfit (STATUS step 5); several are switched off in the adopted fit.

### 5.2 Reorientation

Reorientation events come from two independent Poisson clocks:

- a **distance clock** with mean free path $\lambda$ (`meanFreePath`;
  $1/\lambda$ events per mm),
- a **time clock** with rate $\mu_t$ (`turnRateTime`, per s), which also
  runs during pauses.

Both are scaled by the same run-length modulation (below). At an event the
heading turns by a wrapped Cauchy angle:

```math
h \leftarrow h + \phi, \qquad
\phi \sim \mathrm{WC}(\rho = g), \qquad
f(\phi) = \frac{1-\rho^2}{2\pi\,(1 + \rho^2 - 2\rho\cos\phi)}, \qquad
\langle \cos\phi \rangle = g,
```

sampled by inversion:

```math
\phi = 2 \arctan\!\left( \frac{1-\rho}{1+\rho} \tan\bigl(\pi (U - \tfrac12)\bigr) \right), \qquad U \sim \mathcal U(0,1).
```

**Heading correlation.** For a distance-clock walker with heading diffusion
$D_s$ (rad²/mm) and no slope, homing or time-based terms, turns and
diffusion are independent, so the characteristic functions multiply over $s$
mm of path:

```math
\langle \cos \Delta h(s) \rangle = \exp\!\left( -s \left[ \frac{1-g}{\lambda} + \frac{D_s}{2} \right] \right).
```

The persistence length is therefore $\approx \lambda/(1-g) \approx 25$ mm for
$\lambda = 10$ mm, $g = 0.6$. The data's path-lag heading correlations
(§8.1) measure this directly.

**Run-length modulation.** The effective mean free path is

```math
\lambda_{\text{eff}} = \lambda \cdot \gamma_{\text{run}} \cdot
\exp\!\bigl( G\,\theta \cos 2(h - h_\downarrow) \bigr) \cdot
\exp\!\bigl( H\, w \cos(h - h_{\text{home}}) \bigr), \qquad
w = e^{-r_{\text{PI}}/R_{\text{home}}},
```

with $r_{\text{PI}}$ the distance of the path-integration estimate from its
origin ($w = 0$ when behaviour switches the homing bias off):

- $\gamma_{\text{run}}$ (`runScale`) is set by behaviour (searching ants
  have shorter runs, homing ants straighter ones);
- the $G$ term (`geoRunGain`) is **geomenotaxis**: on an incline, runs
  along the steepest line (either direction) are longer;
- the $H$ term (`homeRunBias`) is the **homing bias** of isolated ants
  (Bonavita et al. 2026): runs heading back towards the release point are
  longer, fading with distance over $R_{\text{home}}$ (`homeRange`).

The time clock is scaled by the same factor: its rate is
$\mu_t \lambda / \lambda_{\text{eff}}$.

**After-turn pulls.** Following each turn, the heading is pulled part way
towards the nearest end of the slope axis, $h_{\text{axis}}$, and towards
home:

```math
\begin{aligned}
h &\leftarrow h + \min(1,\, P_g\,\theta)\; \Delta(h_{\text{axis}}, h), \\
h &\leftarrow h + \min(1,\, P_h\, w)\; \Delta(h_{\text{home}}, h),
\end{aligned}
```

with $P_g$ = `geoHeadingPull` and $P_h$ = `homeHeadingPull`.

### 5.3 Continuous heading terms

Between events, over a walked piece of length $\ell$ taking time $t$:

**Heading diffusion**:

```math
h \leftarrow h + \sqrt{D_s(\theta)\,\ell + D_t\, t}\; \xi, \qquad \xi \sim \mathcal N(0,1), \qquad D_s(\theta) = D_s\, e^{k_j \theta},
```

with $D_s$ = `jitter` per distance and $D_t$ = `jitterTime` per time
(also while paused).

**Continuous geomenotaxis** (candidate C), with
$\psi = \Delta(h, h_\downarrow)$ the heading relative to downhill and $s$
the path length:

```math
\begin{aligned}
\text{axial:} \quad \frac{d\psi}{ds} &= -a \sin\theta \, \sin 2\psi &&\Longrightarrow\quad \tan\psi(s) = \tan\psi_0 \; e^{-2a \sin\theta\, s}, \\
\text{polar:} \quad \frac{d\psi}{ds} &= -b \sin\theta \, \sin \psi &&\Longrightarrow\quad \tan\frac{\psi(s)}{2} = \tan\frac{\psi_0}{2} \; e^{-b \sin\theta\, s}.
\end{aligned}
```

The axial torque ($a$ = `geoTorque`) pulls towards the nearest end of the
slope axis (applied after folding $\psi$ onto $(-\pi/2, \pi/2]$); the
polar torque ($b$ = `geoPolar`) pulls downhill. Both are integrated
exactly, one after the other (operator splitting).

**Goal steering** (from behaviour, e.g. the home vector), first-order
relaxation with gain $k$, exact for a constant goal:

```math
h \leftarrow h + \Delta(h_{\text{goal}}, h)\,\bigl(1 - e^{-k t}\bigr).
```

### 5.4 Speed

```math
v = v_0 \; I_i \; \exp\!\Bigl(X - \tfrac12 \sigma_w(\theta)^2\Bigr) \; s_i(\theta) \; (1 - u) \; \gamma_{\text{speed}}
```

- $v_0$ (`speed`): population median speed on flat ground at the reference
  temperature.
- $I_i = e^{\sigma_b z_i}$: the individual's log-normal speed factor, with
  between-ant SD $\sigma_b$ (`speedSdBetween`).
- $X$: within-ant log-speed fluctuation, an Ornstein–Uhlenbeck process with
  stationary SD $\sigma_w(\theta) = \sigma_w e^{k_{sd}\theta}$
  (`speedSdWithin`, `slopeSpeedSdK`) and correlation time $\tau_v$
  (`speedTau`); see below.
- $s_i(\theta) = \max\bigl(0.05, 1 - k_\theta \kappa_i \theta\bigr)$:
  slope slowing, independent of walking direction (as Khuong et al. found),
  with $k_\theta$ = `slopeSpeedK` and $\kappa_i$ an individual log-normal
  multiplier with mean 1 (candidate D, `slopeSpeedKSd`, SD 0 in the adopted
  fit).
- $u$: turn-linked slowing (below).
- $\gamma_{\text{speed}}$: from behaviour and physiology (load, §6.5).

**Within-ant fluctuation.** $X$ is updated exactly over a walking interval
$t$:

```math
X \leftarrow a X + \sigma_w(\theta) \sqrt{1 - a^2}\; \xi, \qquad a = e^{-t/\tau_v}, \qquad \xi \sim \mathcal N(0,1).
```

Since $\mathbb E e^{X} = e^{\sigma_w^2/2}$ in the stationary state, the
$-\tfrac12\sigma_w^2$ term keeps the mean multiplier at 1.

**Pauses.** Pause onsets form a Poisson process with rate
$p(\theta) = p_0 e^{k_p \theta}$ (`pauseRate`, `slopePauseK`), placed
exactly with the exposure clock (§3.2); pause durations are
$\mathrm{Exp}(\bar t_{\text{pause}})$ (`pauseMean`). Time-based
turning and diffusion continue while paused.

**Turn-linked slowing** (candidate T). A turn by $\phi$ deepens a slowing
state,

```math
u \leftarrow \max\!\left(u,\; u_{\max} \frac{1 - \cos\phi}{2}\right),
```

so a reversal nearly halts the ant ($u_{\max}$ = `turnDip`); $u$ decays as
$e^{-t/\tau_u}$ (`turnDipTau`). The distance walked $t$ seconds into an
interval that starts at $u_0$ is

```math
x(t) = v \left( t - u_0 \tau_u \bigl(1 - e^{-t/\tau_u}\bigr) \right),
```

which is convex in $t$, so the time to reach the next distance event is
found by Newton's method and event positions stay exact.

**Stop reset** (candidate T). When a pause starts the heading is redrawn,
$h \leftarrow h + \mathrm{WC}(g_{\text{stop}})$, then pulled home by
$\min(1, P_{\text{stop}} w)$ (`stopTurnG`, `stopHomePull`). This addresses
the data's near-zero heading correlation across stops.

### 5.5 Variants and parameters

| Group | Parameters (`WalkParams`) | In adopted fit |
|---|---|---|
| Speed | $v_0$ `speed`, $\sigma_b$ `speedSdBetween`, $\sigma_w$ `speedSdWithin`, $\tau_v$ `speedTau` | yes |
| Pauses | $p_0$ `pauseRate`, $\bar t_{\text{pause}}$ `pauseMean` | yes |
| Reorientation (distance) | $\lambda$ `meanFreePath`, $g$ `g`, $D_s$ `jitter` | yes |
| Homing bias | $H$ `homeRunBias`, $P_h$ `homeHeadingPull`, $R_{\text{home}}$ `homeRange` | yes |
| Slope | $k_\theta$ `slopeSpeedK`, $k_p$ `slopePauseK`, $k_j$ `slopeJitterK`, $k_{sd}$ `slopeSpeedSdK`, $G$ `geoRunGain`, $P_g$ `geoHeadingPull` | yes |
| B: time-based turning | $D_t$ `jitterTime`, $\mu_t$ `turnRateTime` | 0 |
| T: turn coupling | $u_{\max}$ `turnDip`, $\tau_u$ `turnDipTau`, $g_{\text{stop}}$ `stopTurnG`, $P_{\text{stop}}$ `stopHomePull` | off |
| C: continuous geotaxis | $a$ `geoTorque`, $b$ `geoPolar` | 0 |
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
| trailL, trailR | field sampled at the antenna tips, $h \pm 0.6$ rad at antennal reach, divided by the detection threshold |
| edge | first of the probes at $h$, $h + 0.6$, $h - 0.6$ rad that falls outside the apparatus |
| food | a drop whose edge is within antennal reach (sucrose is not volatile: contact only) |
| nestCue | within $R = 8$ mm of the entrance: bearing and strength $R/\max(d, 1)$ at distance $d$ |
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

The path integrator $\mathbf p = (p_x, p_y)$ estimates the position relative
to the trip origin. For each walked piece of length $\ell$ along the true
heading $h$:

```math
\hat h = h + b_{\text{trip}} + \sqrt{c\,\ell}\;\xi, \qquad
\mathbf p \leftarrow \mathbf p + g_{\text{PI}}\, \ell\, (\cos\hat h, \sin\hat h), \qquad
b_{\text{trip}} \sim \mathcal N(0, \sigma_c^2),\ \xi \sim \mathcal N(0,1),
```

with $b_{\text{trip}}$ drawn once per trip ($\sigma_c$ = `compassBias`),
$c$ = `compassNoise` (rad²/mm) and odometer gain $g_{\text{PI}}$. The error
thus has a per-trip systematic part and a random-walk part whose variance
grows with distance. The home heading is
$h_{\text{home}} = \mathrm{atan2}(-p_y, -p_x)$.

### 6.5 Physiology (`physics/antPhysics.ts`)

Temperature dependence uses the Arrhenius factor relative to a reference
temperature (temperatures in K, activation energy $E_a$ in eV, $k_B$ the
Boltzmann constant):

```math
A(T; T_{\text{ref}}, E_a) = \exp\!\left( \frac{E_a}{k_B} \left( \frac{1}{T_{\text{ref}}} - \frac{1}{T} \right) \right).
```

**Drinking.** The drinking ant is held at the drop edge
($r_{\text{drop}}$ + 0.35 body lengths from its centre). Intake per step:

```math
\Delta V = \min\!\left( \dot V_0\, f_i\, \Delta t\; \frac{A(T;\, 22\,^\circ\text{C},\, 0.3\,\text{eV})}{e^{1.05\,(M - 0.6)}},\;\; V_{\text{accessible}},\;\; V_{\text{crop}}^{\max} - V_{\text{crop}} \right)
```

with $\dot V_0$ = 0.0095 µL/s for 0.6 M sucrose and $f_i$ the individual
intake factor (log-normal with mean 1 and log-SD $\sigma_r$, fitted in E2).
The exponential term is the rise of viscosity with concentration.

**Metabolism.** With body mass $m_b$, sugar is burnt at

```math
\text{rate} = m_0\; m_b^{0.75}\; A(T;\, 25\,^\circ\text{C},\, 0.65\,\text{eV}) \times \begin{cases} 3 & \text{walking} \\ 1 & \text{otherwise} \end{cases} \quad (\text{mg/h}),
```

drawn first from the crop (absorbed into the reserve together with a slow
refill of 0.1 % of the reserve deficit per second) and then from the
reserve. Oxidation releases 0.579 mg water per mg sucrose. The maximum
reserve is the resting need for `reserveDays` $=14$ d at 25 °C,

```math
R_{\max} = m_0\, m_b^{0.75} \cdot 24 \cdot \text{reserveDays},
```

and an ant starved for $n$ days starts at reserve fraction
$\max(0.02, 1 - n/\text{reserveDays})$. The desired volume reads this
through interoception (§7.1).

**Water.** Cuticular loss follows the vapour-pressure deficit:

```math
\text{loss (mg/s)} = \frac{P \cdot (A_{\text{body}}/100) \cdot \text{VPD}}{1000 \cdot 3600}, \qquad
\text{VPD} = e_s(T) \left(1 - \frac{\text{RH}}{100}\right), \qquad
e_s(T) = 4.5808 \exp\!\left( \frac{17.27\, T}{T + 237.3} \right)\ \text{mmHg}
```

(Magnus–Tetens, $T$ in °C), with $P$ the cuticular permeability
(µg cm⁻² h⁻¹ mmHg⁻¹) and $A_{\text{body}}$ in mm². An ant dies when its
reserve is exhausted or its body water falls below 60 % of the maximum
($0.7 m_b$).

**Load.** A laden ant walks at

```math
\gamma_{\text{speed}} = \frac{1}{1 + k_{\text{load}} \cdot 1.08\, V_{\text{crop}} / m_b}
```

(≈ 1.08 mg per µL of 0.6 M sucrose; $k_{\text{load}}$ = `loadSlowdown`).

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

With $\chi$ the hunger level read from the reserve fraction (interoception)
and $F_i$ an individual factor fixed for life:

```math
\chi = \mathrm{clamp}\!\left( \frac{1 - \text{reserve}}{\text{hungerScale}},\, 0,\, 1 \right), \qquad
V_d = \bigl( V_{\text{fed}} + (V_{\text{hungry}} - V_{\text{fed}})\,\chi \bigr)\, F_i, \qquad
F_i = e^{\sigma_d z_i}.
```

### 7.2 Leaving the food (the stopping rule)

With $V$ the satiation signal (volume ingested on this trip), the per-second
leaving hazard $\nu$ is one of the step-3 variants:

| Variant | Hazard | Notes |
|---|---|---|
| $M_a$ (adopted) | $\nu(V) = \nu_{\max} \sigma\bigl(\eta (V - V_d)\bigr)$ | per-second hazard with a low maximum $\nu_{\max}$ (`stopHazard`); individual $V_d$ |
| $M_b$ | $\nu = \eta \sigma\bigl(\eta (V - V_c)\bigr) \dot V$ | the published rule, per µL ingested; shared $V_c$ |
| $M_d$ | as $M_a$, but $V$ grows by $\bar{\dot V} \Delta t$ per step of actual ingestion | satiation measures drinking time |

For $M_b$ the hazard per µL gives a closed-form stopping-volume
distribution. The survival to volume $V$ is

```math
S(V) = \exp\!\left( -\int_0^V \eta\, \sigma\bigl(\eta (v - V_c)\bigr)\, dv \right)
= \frac{1 + e^{-\eta V_c}}{1 + e^{\eta (V - V_c)}},
```

which is logistic with location $V_c$ and scale $1/\eta$ (when
$\eta V_c \gg 1$), whatever the intake rate. That is why the per-volume form
is used rather than the published per-second form
$\eta \Delta V \sigma(\cdot)$, which matches it only at a fixed intake
rate.

A full crop (≥ 98 % of capacity) always ends drinking as satiated. A drop
that gives nothing for `emptyPatience` s (or is no longer touched) is left
unsatisfied.

### 7.3 Trail decision and search

- **Satiated**: lays trail on the way home unless the ant is a never-layer
  (fraction 0.12, measured).
- **Unsatisfied** (source exhausted): lays trail with probability $q$
  (`unsatisfiedLayProb`; needed because layers and non-layers drank the
  same volume at a 0.7 µL drop), otherwise performs area-restricted search
  for $\mathrm{Exp}(\bar t_{\text{ars}})$ s (`arsMean`) with shorter
  runs ($\gamma_{\text{run}} = 0.4$) and steering back to the food site when
  more than 15 mm from it. An ant that later reaches its desired volume
  becomes satiated and lays.

### 7.4 Returning and marking

The returning ant steers to the home vector with gain $k_{\text{home}}$
(doubled when the nest odour is sensed), walks straighter
($\gamma_{\text{run}} = 3$) and slower when laden (§6.5). Gaster contacts
are a two-state Markov process with mean contact duration $\tau_g$ and an
on-rate chosen so that the stationary fraction of time with the gaster down
equals the individual's lay intensity $\ell_i$:

```math
r_{\text{on}} = \frac{\ell_i}{(1 - \ell_i)\,\tau_g}, \qquad
r_{\text{off}} = \frac{1}{\tau_g}
\quad\Longrightarrow\quad
P(\text{down}) = \frac{r_{\text{on}}}{r_{\text{on}} + r_{\text{off}}} = \ell_i.
```

$\ell_i$ is log-normal with the measured mean 0.13 and SD 0.08 (capped at
0.95). Pheromone is deposited along the walked path in ≤ 1 mm pieces while
the gaster is down.

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
SDs $\sigma_x$ and $\sigma_y$ (along the slope axis) per incline, from the
ant's own observer stream. The values were deconvolved from the data: the
second-difference noise estimate while ants are nearly still, minus what
slow movement of noise-free simulated ants contributes to the same
estimator,

```math
\sigma^2 = \sigma^2_{\text{data}} - \sigma^2_{\text{moving}}.
```

$\sigma_y$ rises with incline roughly as $1/\cos\theta$ (a camera viewing a
tilted canvas).

**Track preparation** (as Khuong et al., applied to both): resample at
0.04 s, 3-point centred moving average, discard the start until 10 mm from
the first point, truncate on first leaving 200 mm.

**Statistics** (`analysis/trajectory.ts`, `walkDiagnostics.ts`). Velocity and
heading come from displacements over 0.2 s; a sample is *stopped* below
2 mm/s.

| Statistic | Definition |
|---|---|
| speed $q_{10}, q_{50}, q_{90}$ | quantiles of moving speeds (0.05 mm/s histogram, linear within bins) |
| stopped | fraction of samples below 2 mm/s |
| heading correlation | $\langle \cos(h(s + L) - h(s)) \rangle$ at path lags $L$ = 5, 10, 20, 30, 50 mm |
| turn SD, kurtosis | heading increments between consecutive non-overlapping 0.2 s windows |
| radial velocity | mean velocity away from the release point in 20 mm bins, 0–160 mm |
| alignment | $-\langle \cos 2h \rangle$ over moving samples (0 isotropic, +1 along the slope axis) |
| straightness | net / path displacement over consecutive 50 mm windows of path |
| speed spread | $\ln$ SD of per-ant mean moving speed |
| per-ant speed, exit time | two-sample KS on per-ant values |
| big-turn fraction, median turn | $P(\lvert\Delta h\rvert > 0.5)$ and median $\lvert\Delta h\rvert$ per 2.5 mm chord, in 5 speed bins (2–8 … 40–80 mm/s) |
| per-ant turning–speed slope | OLS slope of $\ln\bigl(1 - \langle\cos\rangle_{10\text{ mm}}\bigr)$ on $\ln$ median speed, across ants |
| stop reorientation | $\langle\cos\rangle$ of heading into vs out of stops < 0.4 s and 0.4–1.2 s |

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
the papers (e.g. trail after drop 1 = any gaster contact on the first 3 cm
of the bridge). Volumes were gaster-ellipsoid estimates, so the simulated
observer reports

```math
\hat V = \max\bigl(0,\; V_{\text{true}} + \epsilon\bigr), \qquad \epsilon \sim \mathcal N(0, \sigma_m^2),
```

from its own stream; $\sigma_m$ is fitted together with the intake-rate SD
$\sigma_r$ on the 2009 volume–time regression (slope and Spearman $r_s$).

**Targets** (`e2Targets.ts`): means with $\mathrm{SE} = \mathrm{SD}/\sqrt n$,
proportions with binomial $\mathrm{SE} = \sqrt{p(1-p)/n}$, each with its
evidence role. Only scouts that found the first drop are observed, as in the
experiments. $\mathrm{SE}_{\text{sim}}$ comes from independent seed blocks
(§10.2).

### 8.3 E6: food sharing in the nest (Bles et al. 2022)

**Protocol**: 5 colonies of 50 workers; a sucrose source offered at minute
30; scans every minute from minute 30 to 90.

**Observer** (`analysis/trophallaxis.ts`): a contact is recorded at scan $k$
if mouth contact lasts more than 5 s in total and is in progress at the scan
instant

```math
\tau_k = \varphi + 60\,k\ \text{s}, \qquad k = 0, \dots, 60, \qquad \varphi \sim \mathcal U(0, 60)\ \text{s},
```

with the phase $\varphi$ drawn per colony because the real one is unknown.
The same donor → receiver pair on consecutive minutes is merged into one
event. Applying this merge rule to the raw scans reproduces the published
event count, which checks the observer.

**Statistics** (per colony, then mean and SD over colonies):

- events, participants, forager count, the four pair types F/NF → F/NF, and
  the share of donation events made by non-foragers;
- $T_{50}$: the (lower) median start minute of events after food
  introduction;
- the Gini coefficient $G$ of events per participant;
- network (one secondary family): fraction with both roles, and the global
  efficiency $\mathcal E$ of the undirected interaction graph.

With $x_{(1)} \le \dots \le x_{(n)}$ the sorted event counts of the $n$
participants, and $d_{ij}$ the shortest-path length between participants
$i$ and $j$ ($1/d_{ij} = 0$ if disconnected) among the $N$ in the graph:

```math
G = \frac{\sum_{i=1}^{n} (2i - n - 1)\, x_{(i)}}{n \sum_{i=1}^{n} x_i}, \qquad
\mathcal E = \frac{1}{N(N-1)} \sum_{i \ne j} \frac{1}{d_{ij}}.
```

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

With body length $L_b$, antennal reach $R_a$ and head point
$\mathbf c + 0.4 L_b (\cos h, \sin h)$ for body centre $\mathbf c$:

- **Antennal contact**: one ant's head within $R_a$ of the other's head or
  body centre (either way round).
- **Mouth contact**: heads within $0.3 L_b$ and headings roughly opposed,
  $\cos(h_1 - h_2) < -0.5$, the posture of trophallaxis.

Contacts are found with a spatial hash and reported in a fixed $(a, b)$
order, so results do not depend on hash internals.

### 9.2 Food transfer (`physics/trophallaxis.ts`)

Food moves only when the donor acts "give" to B **and** B acts "receive"
from the donor. The pair is then held face to face and the donor's crop
flows at

```math
\Delta V = \min\bigl( r_{\text{share}}\, \Delta t,\; V_{\text{donor}},\; V_{\text{crop}}^{\max} - V_{\text{receiver}} \bigr), \qquad
r_{\text{share}} = V_{\text{crop}}^{\max} / 120\ \text{s}
```

(from the TEC model's unit), with sugar and water in the donor crop's
proportions. Crop-to-crop transfers leave the ledger's account totals
unchanged; tests compare per-ant sums with the ledger and the transfer log.

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

```math
z_{\text{judge}} = \frac{m_{\text{sim}} - m_{\text{data}}}{\sqrt{\mathrm{SE}_{\text{data}}^2 + \mathrm{SE}_{\text{sim}}^2}} \quad (\mathtt{combinedZ}), \qquad
z_{\text{fit}} = \frac{m_{\text{sim}} - m_{\text{data}}}{\mathrm{SE}_{\text{data}}} \quad (\mathtt{fitZ}).
```

Judging needs both sampling errors. Fitting uses fixed weights: with
$\mathrm{SE}_{\text{sim}}$ in the objective, an optimiser could lower the
loss by making the simulation noisier. Verdicts: $\lvert z\rvert \le 2$
consistent, $\le 3$ marginal, else off. A calibration test (model vs itself,
480 z-scores) gives $\mathrm{SD}(z) = 1.05$ and 6 % beyond 2.

Other comparisons:

**Spread** (between-ant or between-colony SD), separately from means:

```math
z = \frac{\ln(s_{\text{sim}} / s_{\text{data}})}{\sqrt{\dfrac{1}{2(n_{\text{sim}} - 1)} + \dfrac{1}{2(n_{\text{data}} - 1)}}}.
```

This uses $\mathrm{SE}(\ln s) \approx 1/\sqrt{2(n-1)}$, exact only for
normal samples, so it is read as indicative for skewed times; E1 uses
bootstrap SEs instead.

**Distributions** of per-individual values: two-sample KS statistic $D$
with sample sizes $n, m$; p-value from the Kolmogorov distribution with
Stephens' correction, reported as the equivalent two-sided normal $z$
(capped at 8) and signed by the direction of the median difference:

```math
n_e = \frac{nm}{n+m}, \qquad
p = Q_{\text{KS}}\!\Bigl( \bigl(\sqrt{n_e} + 0.12 + 0.11/\sqrt{n_e}\bigr) D \Bigr), \qquad
Q_{\text{KS}}(x) = 2 \sum_{k \ge 1} (-1)^{k-1} e^{-2k^2 x^2}, \qquad
\lvert z\rvert = \Phi^{-1}(1 - p/2).
```

### 10.2 Standard errors

**Cluster bootstrap over ants** (E1, data and simulation): resample ants
with replacement $B = 200$ times, recompute every statistic $\hat\vartheta$
from the summed per-ant sufficient statistics, and take
$\mathrm{SE} = \mathrm{SD}_b\bigl(\hat\vartheta^{*b}\bigr)$. Ants are the
independent units (each simulated ant has its own stream).

**Seed blocks** (E2, E6): $R$ independent blocks of possibly unequal size
$n_b$ with means $m_b$; batch-means ratio estimator around the pooled
mean $m$, with $\bar n$ the mean block size:

```math
\mathrm{SE}^2 = \frac{1}{R(R-1)} \sum_{b=1}^{R} \left( \frac{n_b}{\bar n} \right)^2 (m_b - m)^2.
```

### 10.3 Losses

**E1**: statistics are grouped into **families** $f$ of correlated
statistics (speed quantiles, heading-correlation lags, radial bins,
big-turn fractions by speed, …), 15 in all, and

```math
\mathcal L_{\text{E1}} = \sum_{f} \frac{1}{\lvert f\rvert} \sum_{i \in f} z_i^2,
```

so a family counts once however many lags it has. In judging, a statistic
the simulation cannot estimate scores $z^2 = 100$; in fitting, a candidate
with any inestimable statistic ranks below every candidate that estimates
all of them ($+10^7$ each).

**E2**: $\mathcal L_{\text{E2}} = \sum_{i \in \text{fit}} z_i^2$ over the
targets with role *fit* (inestimable: 100). Model comparison reports $k$
and $\mathcal L + 2k$ (a heuristic AIC-like penalty).

### 10.4 Fitting procedure

**Parameter transforms.** Each fitted parameter has a plausibility range
$[\text{lo}, \text{hi}]$, wide enough never to bind, and the optimiser works
on an unbounded $x$ with $u = \sigma(x)$:

```math
p = \text{lo} \left( \frac{\text{hi}}{\text{lo}} \right)^{u} \quad \text{(log scale)}, \qquad
p = \text{lo} + (\text{hi} - \text{lo})\, u \quad \text{(linear)}.
```

A fit ending within 1 % of a limit is reported (`atLimit`).

**E1: CMA-ES** (`analysis/cmaes.ts`; Hansen 2016), the
$(\mu/\mu_w, \lambda)$ strategy with default settings for $n$ parameters:
population $\lambda = 4 + \lfloor 3 \ln n \rfloor$, parents
$\mu = \lfloor\lambda/2\rfloor$. Each generation samples and recombines

```math
\mathbf x_k = \mathbf m + \sigma\, \mathbf B \mathbf D \mathbf z_k,\ \ \mathbf z_k \sim \mathcal N(\mathbf 0, \mathbf I), \qquad
\mathbf m \leftarrow \mathbf m + \sigma \sum_{i=1}^{\mu} w_i\, \mathbf y_{i:\lambda}, \qquad
w_i \propto \ln\!\left(\mu + \tfrac12\right) - \ln i,
```

where $\mathbf C = \mathbf B \mathbf D^2 \mathbf B^\top$ and
$\mathbf y_{i:\lambda}$ is the step of the $i$-th best candidate. The step
size follows cumulative step-size adaptation,
$\sigma \leftarrow \sigma \exp \bigl( \tfrac{c_\sigma}{d_\sigma} ( \lVert \mathbf p_\sigma \rVert / \mathbb E\lVert \mathcal N(\mathbf 0, \mathbf I)\rVert - 1 ) \bigr)$,
and $\mathbf C$ gets rank-one (evolution path $\mathbf p_c$) and rank-$\mu$
updates.

- Every generation uses fresh seeds, shared by all its candidates (common
  random numbers within a generation, no accumulated seed luck across
  generations). Each evaluation simulates 640 ants per incline.
- The estimate is the **final distribution mean** $\mathbf m$, not the best
  point seen (which is biased towards lucky evaluations).
- Initial per-coordinate SDs come from the local curvature at the start
  (below), so the first generations are not wasted on steps far too large in
  the sensitive coordinates.
- Each stage runs from two starts plus IPOP restarts (population doubled
  per restart) from the best; runs stop at a generation cap or when
  $\sigma$ times the largest axis of the distribution falls below `tolX`.
- **Selection vs judgement**: the runs are compared on one common batch,
  which is therefore selection data. The chosen fit is judged only on
  independent batches (5 × 1000 flat-ground ants; 300 per incline for the
  report).

**Initial step sizes.** At the start $\mathbf x_0$, with step
$\Delta x = 0.2$ and target loss rise $\delta = 10$:

```math
c_i = \frac{f(\mathbf x_0 + \Delta x\, \mathbf e_i) + f(\mathbf x_0 - \Delta x\, \mathbf e_i) - 2 f(\mathbf x_0)}{\Delta x^2}, \qquad
\sigma_i = \mathrm{clip}\!\left( \sqrt{\delta / c_i},\, 0.02,\, 0.3 \right),
```

so a 1-SD step raises the loss by about $\delta$.

**Strategies**: *staged* (default): stage 1 fits speed, pauses, turning and
homing on flat ground; stage 2 fits the slope terms on 30° and 60° (mean
loss). *Joint*: one CMA-ES over all parameters on 0°, 30° and 60°. 20° and
45° are development inclines, never fitted.

**Parameter recovery** (`--recover`): the data are replaced by tracks
simulated from known parameters. A large synthetic reference of $n$ ants is
scored as 69 ants (SEs multiplied by $\sqrt{n/69}$, KS with an effective
sample size), so only the reference's sampling error changes, which
separates optimiser failure from data noise. The truth's own loss on the same
fresh batches is the noise floor.

**E2: Nelder–Mead** (`analysis/optimize.ts`) on log, logit or bounded
transforms, with a fixed budget (160 evaluations, 150 scouts per condition,
common random numbers), the same for every variant compared.

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

**TEC / one-caste (Bles et al. 2022)**, `blesTEC.ts`. A non-spatial model;
1 tick = 1 s, crop $q$ in units (1 unit = 1 s of feeding or transfer). Each
agent has give and receive propensities $\theta_i, \Upsilon_i$ (drawn around
forager or worker means: two emergent castes) and a source-leaving
propensity $\alpha_i = U^{30}$, $U \sim \mathcal U(0,1)$ (a power-function
distribution with shape 1/30). With the Hill functions

```math
g(q) = \frac{q^2}{q^2 + k^2}, \qquad \bar g(q) = 1 - g(q) = \frac{k^2}{q^2 + k^2}, \qquad k = 120\ \text{units},
```

the per-tick probabilities are:

```math
\begin{aligned}
P(\text{offer}) &= \theta_i\, g(q_i), & P(\text{accept}) &= \Upsilon_j\, \bar g(q_j), \\
P(\text{go to source}) &= \alpha_i\, \bar g(q_i)\ \ (\alpha' = 1/50 \text{ for foragers}), & P(\text{leave source}) &= \beta = 1/120,
\end{aligned}
```

pairs transfer 1 unit/s and separate with probability 1/260 per member per
tick, and an ant leaving the source carries the time it spent feeding. Full
specification and quirks: [`research/bles-tec-spec.md`](research/bles-tec-spec.md).
Refitted through our scan observer: `data/fits/e6-tec.json`.

**Sectored Boltzmann walkers (Khuong et al. 2013; Bonavita et al. 2026)**,
`sectoredWalker.ts`. Non-parametric. Recorded tracks are segmented into
straight runs (Khuong's algorithm; output committed in `data/reference/`).
Each vertex gives a row $(\omega, l, \Delta t)$: the turn at the vertex and
the length and duration of the next segment. Rows are pooled by the sector
of the incoming heading $\varphi$,

```math
k(\varphi) = \left\lfloor \frac{\varphi + \pi + \pi/8}{\pi/4} \right\rfloor \bmod 8,
```

measured in the arena frame (`xy`) or relative to the direction home
(`start`). The walker repeatedly draws a row from its current sector's pool
until it is more than 200 mm from the origin. Its tracks go through the same
tracking observer and statistics as ours.

---

## 12. Longer-term design

M1 deliberately simulates flat laboratory apparatus. The design below is
the target for later milestones; items marked *reserved* exist as code
under `src/sim/` but are not yet used or validated, the rest is not started.
Order and scope are set in STATUS § Milestones.

### 12.1 World

**One 3D coordinate system** (mm, +z up): a heightmap surface for
foraging (2.5D; pheromone lives on it) and a **sparse 3D voxel nest**
under (or, for mound builders, above) the entrance, walked continuously
from the surface down the shaft. Chamber floor area, helical shafts,
vertical temperature gradients and crowding are intrinsically 3D
(Tschinkel's casts). *Reserved:* `world/terrain.ts` (heightmap; spoil
relaxes to the 34° angle of repose), `nest/` (voxel grid with
26-neighbour BFS navigation fields, chamber detection, species
architecture templates excavated pellet by pellet).

**Climate** (*reserved:* `env/climate.ts`, `env/soilHeat.ts`). Diel air
and soil-surface temperature by Parton & Logan (1981): with day length
$D$ (sunrise $t_r$, sunset $t_s$), night length $N = 24 - D$, hours $n$
since sunset and lag/decay coefficients $a, b$,

```math
T_{\text{day}}(t) = T_{\min} + (T_{\max} - T_{\min}) \sin\frac{\pi (t - t_r)}{D + 2a}, \qquad
T_{\text{night}}(n) = T_{\min} + \bigl(T_{\text{day}}(t_s) - T_{\min}\bigr) \frac{e^{-b n/N} - e^{-b}}{1 - e^{-b}}
```

(air $a$ = 1.86 h, $b$ = 2.2; soil surface $a$ = 1.0 h, $b$ = 1.8).
Soil temperature at depth follows the 1D heat equation, forced at the
surface. For a sinusoidal surface wave of frequency $\omega$ in a deep
soil it gives exponential damping and a linear phase lag with depth:

```math
\frac{\partial T}{\partial t} = \kappa \frac{\partial^2 T}{\partial z^2}, \qquad
T(z, t) = \bar T + A_0\, e^{-z/z_d} \sin\!\left(\omega t - \frac{z}{z_d}\right), \qquad
z_d = \sqrt{\frac{2\kappa}{\omega}} \approx 10\text{–}13\ \text{cm}.
```

Body temperature lies between air and surface temperature according to
how high the body is held: $T_b = T_{\text{air}} + (T_{\text{surf}} - T_{\text{air}}) e^{-z_{\text{body}}/2.5\text{ mm}}$.

**Chemical signals.** Multiple trail channels per species (e.g. Pharaoh
ant attractive and repellent). Trail following by osmotropotaxis
(Hangartner 1967): steer to reduce the bilateral difference between the
antennae, Weber-normalised. The grid, decay and antennal sampling exist
(§4.3); the response does not. Alarm pheromone as instantaneous point
releases of amount $Q$ in a half-space (Bossert & Wilson 1963), with
response threshold $K$, calibrated from the active-space radius $R$ and
fade time $t_{\text{fade}}$ (*reserved:* `world/plumes.ts`):

```math
C(r, t) = \frac{2Q}{(4\pi D t)^{3/2}} \exp\!\left( -\frac{r^2}{4 D t} \right), \qquad
D = \frac{e\, R^2}{6\, t_{\text{fade}}}, \qquad
\frac{Q}{K} = \frac{(4\pi D\, t_{\text{fade}})^{3/2}}{2}.
```

### 12.2 Individuals

- Size distributions per species (monomorphic to strongly polymorphic),
  with mass, speed, carrying capacity and crop volume scaling
  allometrically.
- Locomotion: speed $\propto A(T; T_{\text{ref}}, E_a) m_b^{0.25}$ ×
  load × slope terms (Hurlbert et al. 2008); chill coma below
  $\mathrm{CT}_{\min}$, heat death above $\mathrm{CT}_{\max}$.
- Navigation beyond path integration: systematic search around the fictive
  nest (Wehner & Srinivasan 1981), visual route memory, site fidelity.

### 12.3 Colony

- Brood: egg → larva → pupa → adult by degree-day development; caste and
  size by larval nutrition.
- Nutrition: carbohydrate and protein flows (the ledger already tracks
  protein, brood and store accounts); colony hunger feeding back on
  foraging and recruitment.
- Task allocation: response thresholds (Bonabeau, Theraulaz & Deneubourg
  1996), $P(\text{engage}) = s^2/(s^2 + \Theta_i^2)$ for stimulus $s$ and
  individual threshold $\Theta_i$, with reinforcement and age polyethism;
  many workers inactive.
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
