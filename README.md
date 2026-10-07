# Ant Colony Simulator

A browser-based ant simulation aiming for research-grade biological accuracy.
Behaviour is built from published mechanisms and checked against published
experiments. Milestone M1 uses *Lasius niger* as the single reference species.

- **Status, next steps, evidence policy:** [docs/STATUS.md](docs/STATUS.md) (start here)
- **Architecture and roadmap:** [docs/DESIGN.md](docs/DESIGN.md)
- **L. niger evidence base:** [docs/research/lasius-niger.md](docs/research/lasius-niger.md)

## Run

```sh
npm install
npx vite        # http://localhost:5173 — experiment pages E1 (walking), E2 (recruit decision)
npm test        # unit, numerics, conservation and validation tests (~3–4 min)
```

Fits and data summaries: `npx vite-node scripts/fitE1.ts`, `scripts/fitE2.ts`,
`scripts/analyzeKhuong.ts`, `scripts/analyzeBles.ts`.

## Data

- `data/khuong2013/`: L. niger trajectories from Khuong et al. 2013, *PLoS ONE* 8:e76531 (CC BY 4.0).
- `data/bles2022/`: L. niger trophallaxis scans from Bles et al. 2022, *Animals* 12:2963; Zenodo doi:10.5281/zenodo.6396637 (CC BY 4.0).
