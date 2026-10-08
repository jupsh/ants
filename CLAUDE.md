# Ant colony simulator — working notes for Claude

Research-grade, browser-based simulation of ant colonies. Milestone M1:
*Lasius niger* as the single validated reference species. **Start every
session with `docs/STATUS.md` (▶ RESUME HERE) and keep it current** — update it
when a step starts or finishes, and log decisions there before acting on them.

## Run
- Dev server: the user runs `npx vite` (http://localhost:5173; pages `#e1`,
  `#e2`, `#e6`, `#status`). Never start a second one.
- `npm test` (~35 s) · `npx tsc --noEmit -p .` · `npm run build` (GitHub Pages
  workflow runs test + build on push to `main`).
- Scripts run with `npx vite-node scripts/<name>.ts`; shared helpers (args,
  data loading, JSON) in `scripts/lib.ts`. Simulation-heavy scripts use the
  process pool `scripts/pool.ts` (one vite-node child per core − 1, override
  with `SIM_WORKERS=n`; ~2 s start-up). Pooled results are bit-identical to
  serial ones — keep it that way: new parallel work goes in
  `src/sim/parallel/tasks.ts` as pure functions of cloneable arguments with
  per-individual RNG streams, joined in order.
  - Fits (write `data/fits/*.json`): `fitE1.ts`, `fitE2.ts --variant
    Ma|Mb|Mc|Mc0|Md`, `fitE6TEC.ts` — minutes with the pool.
  - Judge without writing: `reportE1.ts` (~9 s), `reportE2.ts` (~9 s),
    `reportE6.ts [--fit]` (~4 s), `compareE2.ts`, `identifyE2.ts --variant X`.
  - Profiling: `node --cpu-prof node_modules/.bin/vite-node <script>` and sum
    self time per function from the `.cpuprofile`.
- Headless page check: `node scripts/probe.mjs '#e6' out.png 'text to wait for'`
  (prints console errors and page text; `WAIT=ms` lets animations run,
  `CANVAS=1` screenshots only the arena canvas).

## Conventions that matter
- **Evidence policy** (STATUS.md § Evidence policy): every data set has a role
  — fit, development (inspected) or held-out. Never fit to a development or
  held-out target; log any inspection in the contamination log.
- **Two z-scores** (`src/sim/analysis/compare.ts`): fitting uses `fitZ`
  (SE_data only); judging uses `combinedZ` (SE_data ⊕ SE_sim, SE_sim from seed
  blocks or ant bootstraps). |z| ≤ 2 ok, ≤ 3 marginal. Spread (SD) is compared
  separately from means.
- **Observation models are part of the comparison**: E6 scan observer
  (`observeContacts`), E2 volume-estimate noise (`volumeSd`), E1 tracking
  noise (planned). Apply the same statistics code to data and simulations.
- **Randomness**: only `RNG` (`src/sim/core/rng.ts`); per-agent/per-purpose
  streams via `RNG.stream(seed, ...keys)` so adding a draw elsewhere never
  shifts existing results; fits use common random numbers.
- **Perception boundary**: behaviour (`src/sim/behavior/`) reads only percepts,
  mind and interoception — enforced by `test/architecture.test.ts`.
- **Parameters** carry provenance (`src/sim/core/param.ts`: measured / fitted
  / derived / estimated). Fit files are applied with `applyFit`, so records
  show the value actually used. `data/fits/e2-drinking.json` is the adopted E2
  fit; `e2-<variant>.json` are step-3 candidates.
- Reference models of other authors live in `src/sim/reference/` (e.g. Bles et
  al. TEC); they are baselines, not part of our ant.
- Commits: plain messages, **no Claude co-author/attribution lines**. Ask
  before committing unless told to. `side-projects/` is the user's; leave it
  alone (excluded via `.git/info/exclude`).

## Code map
- `src/sim/core/` rng, math, param · `src/sim/analysis/` trajectory stats
  (per-track accumulate + combine), Khuong parser, trophallaxis stats +
  observer, Nelder–Mead, compare (z, KS, blocks, bootstrap, OLS, Spearman).
- `src/sim/models/walk.ts` motor program · `perception/` the only bridge from
  world to behaviour · `mind/` traits and state · `behavior/lasiusForager.ts`
  policy · `physics/` (antPhysics: walls, PI, drinking, trail, metabolism;
  ledger: conserved quantities) · `world/` apparatus, food, surface, fields.
- `src/sim/experiments/` E1 (`e1Exploration`, `e1Compare`), E2
  (`e2Mailleux` protocol, `e2Targets` targets + roles, `e2Variants` step-3
  models), E6 (`e6Bles`). Targets are defined once and shared by fits, tests,
  scripts and UI.
- `src/sim/species/lasiusM1.ts` M1 parameters (+ fits), `refs.ts` references.
  Reserved, not yet reachable from app/scripts/tests: `nest/`, `env/` (except
  soilHeat tests), the 8 draft species, `world/terrain|items|spatialHash`.
- UI `src/main.ts`, `src/ui/` (pages, `dom.ts`, `lineChart.ts`,
  `antSprite.ts`), `src/worker/` (one worker per page).
- Data `data/khuong2013/`, `data/bles2022/`, `data/fits/`. Research notes and
  source extractions `docs/research/` (with Python diagnostics in
  `docs/research/scripts/`). Architecture `docs/DESIGN.md`. `attic/` is
  pre-rework code, excluded from the build.

## Gotchas
- Never `pkill -f`/`pgrep -f` a pattern that appears in your own command (it
  kills the tool shell). Use `ps -eo pid,args | grep '[f]itE2'` then
  `kill -9 <pid>` (vite-node ignores SIGTERM).
- Don't run two fits writing the same log/JSON; a non-monotone "best loss" in
  a Nelder–Mead log means two processes are running.
- Vite dev serves `.gz` with `Content-Encoding: gzip`; loaders check gzip magic
  bytes before decompressing.
- Animation clocks must persist across frames (advance by real dt × speed).
- The STATUS page imports `docs/STATUS.md?raw`; keep it plain Markdown.
