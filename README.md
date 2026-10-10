# Ant Colony Simulator

A browser-based ant simulation aiming for research-grade biological accuracy.
Behaviour is built from published mechanisms, uses only what an ant can
sense, and is checked against published experiments through models of how
those experiments were observed. Milestone M1 uses *Lasius niger* as the
single reference species.

- **Status, next steps, evidence policy, results:** [docs/STATUS.md](docs/STATUS.md) (start here)
- **Design and the maths of the model:** [docs/DESIGN.md](docs/DESIGN.md)
- **L. niger evidence base and research notes:** [docs/research/](docs/research/) (start with [lasius-niger.md](docs/research/lasius-niger.md))
- **Commands, conventions, code map:** [CLAUDE.md](CLAUDE.md)

## What is modelled (M1)

| Experiment | Data | What the model has to reproduce |
|---|---|---|
| **E1** exploratory walking | Khuong et al. 2013 (69 ants × 5 inclines) | speed, pauses, turning and persistence, slope effects, drift back towards the release point |
| **E2** drinking and the trail decision | Mailleux et al. 1999, 2003, 2009 | drinking times and volumes, starvation effects, which scouts lay trail |
| **E6** food sharing in the nest | Bles et al. 2022 (5 colonies) | trophallaxis events, timing, participants, forager/non-forager roles |

Each experiment page shows the simulation, the data and a model–data
comparison (z-scores with both sampling errors). E6 currently runs the
authors' own model as a baseline; our encounter-based colony model is in
progress (`#colony`, provisional).

## Run

```sh
npm install
npx vite             # http://localhost:5173 — pages #e1, #e2, #e6, #colony, #status
npm test             # fast tier (~10 s): unit, numerics, conservation, architecture
npm run test:full    # adds the slow validation and convergence tests
npm run build        # precomputes page results, then builds the site
```

Pages open on precomputed results for their default settings (`npm run
precompute`); after a change to simulation code they simulate live until
those are regenerated.

Fits, reports and diagnostics run with `npx vite-node scripts/<name>.ts`
(e.g. `fitE1.ts`, `fitE2.ts`, `fitE6TEC.ts`, `reportE1.ts`, `reportE2.ts`,
`reportE6.ts`); simulation-heavy ones use all cores through a process pool
with results identical to serial runs. See [CLAUDE.md](CLAUDE.md) for the
full list.

Pushes to `main` run the tests and deploy the site to GitHub Pages.

## Data

| Folder | Source | Role |
|---|---|---|
| `data/khuong2013/` | Khuong et al. 2013, *PLoS ONE* 8:e76531: walking trajectories on 5 inclines | E1 fit and development |
| `data/bles2022/` | Bles et al. 2022, *Animals* 12:2963; Zenodo doi:10.5281/zenodo.6396637: trophallaxis scans | E6 development benchmark (inspected while building the comparison rule; not an independent validation) |
| `data/bonavita2026/` | Bonavita et al. 2026, *PLoS ONE* 21:e0327957; Zenodo doi:10.5281/zenodo.19203503: red/white-light tracks | E1 held-out test, not yet inspected |
| `data/reference/` | Khuong et al.'s segmentation applied to the 2013 data | input of the reference walkers |
| `data/fits/` | our fits (`e1-walk.json`, `e2-drinking.json` adopted; others candidates) | — |

All third-party data are CC BY 4.0.

## Licence

The code is MIT ([LICENSE](LICENSE)). Third-party data and adapted code keep
their own licences; see [NOTICE.md](NOTICE.md).
