# Third-party material

The code in this repository is MIT-licensed (see `LICENSE`). The following
material comes from others and keeps its own licence; attribution is
required when you reuse it.

| Material | Source | Licence |
|---|---|---|
| `data/khuong2013/` (trajectories) | Khuong et al. 2013, PLoS ONE 8:e76531, Datasets S1–S5 | CC BY 4.0 |
| `data/bles2022/` (trophallaxis scans) | Bles et al. 2022, *Animals* 12:2963; Zenodo 10.5281/zenodo.6396637 | CC BY 4.0 |
| `data/bonavita2026/` (red/white-light tracks) | Bonavita et al. 2026, PLoS ONE 21:e0327957; Zenodo 10.5281/zenodo.19203503 | CC BY 4.0 |
| `src/sim/reference/blesTEC.ts` | port of Bles et al.'s model code (Zenodo, as above) | adapted from CC BY 4.0 material |
| `src/sim/reference/sectoredWalker.ts` | port of Bonavita et al.'s R scripts (Zenodo 10.5281/zenodo.19203503) | adapted from CC BY 4.0 material |
| `data/reference/khuong-segments.json`, `test/fixtures/khuong-segmentation-cpp.json` | output of Khuong et al.'s segmentation (`botupsegMAE.cpp`, distributed with Bonavita et al.'s archive) applied to the Khuong et al. 2013 data | data: CC BY 4.0 (Khuong et al. 2013) |

The segmentation program itself (`botupsegMAE.cpp`) is licensed CeCILL 2.1,
a copyleft licence. Its TypeScript port is therefore **not** part of this
repository; it is kept locally and only its output is committed. To
regenerate the segmentation, compile `botupsegMAE.cpp` from the Zenodo
archive above (Khuong et al. 2013, Algorithm 1; ε = 1.7 mm on flat ground).
