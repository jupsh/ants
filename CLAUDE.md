# Ant colony simulator — working notes for Claude

Research-grade, browser-based simulation of ant colonies. Milestone M1:
*Lasius niger* as the single validated reference species. **Start every
session with `docs/STATUS.md` (▶ RESUME HERE) and keep it current** — update it
when a step starts or finishes, and log decisions there before acting on them.

## Run
- Dev server: the user runs `npx vite` (http://localhost:5173; pages `#e1`,
  `#e2`, `#e6`, `#status`). Never start a second one.
- `npm test` (fast tier, ~10 s; `npm run test:full` adds `test/slow/`) · `npx tsc --noEmit -p .` · `npm run build` (GitHub Pages
  workflow runs test + build on push to `main`).
- Scripts run with `npx vite-node scripts/<name>.ts`; shared helpers (args,
  data loading, JSON) in `scripts/lib.ts`. Simulation-heavy scripts use the
  process pool `scripts/pool.ts` (one vite-node child per core − 1, fewer if
  free memory is short — ~350 MB each; override with `SIM_WORKERS=n`, e.g.
  half the cores each when running two fits at once; ~2 s start-up). Pooled results are bit-identical to
  serial ones — keep it that way: new parallel work goes in
  `src/sim/parallel/tasks.ts` as pure functions of cloneable arguments with
  per-individual RNG streams, joined in order. Reduce in the worker where
  possible (e.g. `pool.e1Sample` returns per-ant summaries, not tracks):
  serial statistics on the main process were 60 % of E1 fit time.
  - Fits (write `data/fits/*.json`): `fitE1.ts --variant A0|B` (step-5
    candidates → `e1-<variant>.json`; `e1-walk.json` is the adopted fit),
    `fitE2.ts --variant
    Ma|Mb|Mc|Mc0|Md`, `fitE6TEC.ts` — minutes with the pool.
  - Judge without writing: `reportE1.ts [--fit f]` (~9 s), `diagE1.ts
    [--fit f]` (step-5 structure diagnostics, data vs model),
    `diagE1Stops.ts [--fits A0=f,B=g] [--clean]` (stop reorientation, within- vs
    between-ant speed–turning), `reportE1Ref.ts [--fits walk,A0,T]`
    (our walkers vs the Khuong/Bonavita reference walkers), `scanE1.ts` (loss on a 2-parameter grid), `selectE1.ts --a f --b g`
    (draft A0 vs T selection rule, real or recovery data; parked), `reportE2.ts [--walk f] [--seed s]` (~9 s),
    `reportE6.ts [--fit]` (~4 s), `compareE2.ts`, `identifyE2.ts --variant X`.
  - Profiling: `node --cpu-prof node_modules/.bin/vite-node <script>` and sum
    self time per function from the `.cpuprofile`.
- Pages open on **precomputed results** for their default settings
  (`npm run precompute` → `public/precomputed/*.json`, not committed; `npm
  run build` runs it first). Each file carries the request and a hash of the
  simulation inputs (`scripts/simHash.ts`: `src/sim`, `src/worker`, the
  three fits the pages use, data), and a page uses it only if both match, else it simulates live (the
  dev server serves the current hash at `/__sim_hash`, so after changing
  simulation code pages run live until `npm run precompute` is rerun). Page
  computations live in `src/worker/e*Compute.ts`, shared by the workers and
  the precompute script; defaults in `src/ui/pageDefaults.ts`.
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
  show the value actually used. The provisional E2 model is
  `data/fits/e2-3d-L0S1c.json` (baseline desired volumes; its 2009 cohort
  scale only in `MAILLEUX_SETUP`), with `e2-3d-L0S1.json` as the
  alternative (`LASIUS_PARAMS_E2_ALT`). `e2-drinking.json` is the legacy
  layer under every step-3 fit: scripts that rebuild those fits use
  `E2_LEGACY_FORAGER` / `E2_LEGACY_PHYS`, not `LASIUS_FORAGER` / `LASIUS_PHYS`.
- **Missing statistics when judging:** eligible = estimable from the reference
  data; a candidate missing one is unjudgeable and cannot win or pass
  (`compareE1(...).missing`, `judgedSumZ2`), never given a smaller sum. The
  fit objective ranks such candidates last separately (fitE1 `DEGENERATE`).
- Reference models of other authors live in `src/sim/reference/` (Bles et
  al. TEC for E6; Khuong/Bonavita sectored walkers for E1, built from
  `data/reference/khuong-segments.json`); they are baselines, not part of our
  ant.
- **Licence:** the repo is MIT (`LICENSE`); third-party data and adapted code
  keep their licences (`NOTICE.md`). The Khuong segmentation port
  (`src/sim/reference/khuongSegmentation.ts`, `scripts/segmentKhuong.ts`,
  `test/local/`) derives from CeCILL 2.1 code and is local only (excluded
  via `.git/info/exclude`): never commit it; commit only its output.
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
- **Pool workers of every running script share the name `poolWorker`:** never
  kill by that name (or any shared pattern). It killed a 7.5 h fit that was
  running beside a diagnostic (2026-10-09). Kill only by the pids under the
  one script you mean to stop.
- Don't run two fits writing the same log/JSON; a non-monotone "best loss" in
  a Nelder–Mead log means two processes are running.
- Vite dev serves `.gz` with `Content-Encoding: gzip`; loaders check gzip magic
  bytes before decompressing.
- Animation clocks must persist across frames (advance by real dt × speed).
- The STATUS page imports `docs/STATUS.md?raw`; keep it plain Markdown.
- **Rented containers (vast.ai):** `nproc`/`os.availableParallelism()` and
  free memory show the whole host, so always set `SIM_WORKERS` (check
  `/sys/fs/cgroup/cpu.max`), and cap Rolldown's per-process threads or
  hundreds of workers exceed the task limit: `RAYON_NUM_THREADS=2
  ROLLDOWN_WORKER_THREADS=2 ROLLDOWN_MAX_BLOCKING_THREADS=4
  UV_THREADPOOL_SIZE=2`. Node via `. /opt/nvm/nvm.sh` **then `nvm use`** (sourcing alone leaves `npx` off PATH in non-interactive ssh; check `which npx` before `nohup`, or the run dies with exit 127); install the local
  Node version and check run hashes before fitting.
- **Blind checks while a frozen reading is pending:** status checks leak
  results (a log's last line, a fit's loss, a file listing with sizes). When
  a pre-registration is still being written or amended, check only that
  outputs don't exist yet (e.g. `ls logs | grep -c judgeC`), never `tail` a
  log or open a fit file. If something is seen anyway, say exactly what in
  the reply and in the STATUS entry.
