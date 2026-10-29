# B017 numerical check

The optional 0.5 mm Gaussian sampling sigma passes B012's last-refinement rule. This value is a provisional numerical demonstration, with `estimated` provenance; it is not a biological estimate or an adopted parameter.

The 96 cases repeat the original 60 mm trail, six grids, four within-cell positions and two deposition modes for each implementation. Candidate physics spacing is min(1 mm, cell/2); the original control uses 1 mm. The fine-quadrature mode and original sample points and offsets are retained.

| Cell (mm) | Centreline, fine deposit | 0.5 mm off, fine deposit | Centreline, proposed physics | Centreline range across four positions |
|---:|---:|---:|---:|---:|
| 4 | 1.335948 | 0.386602 | 1.335948 | 0.005647–1.335948 |
| 2 | 0.312522 | 0.652989 | 0.312522 | 0.155901–0.890977 |
| 1 | 0.882204 | 0.674227 | 0.882204 | 0.649851–0.893183 |
| 0.5 | 0.918194 | 0.585480 | 0.918194 | 0.882524–0.996044 |
| 0.25 | 0.997635 | 0.606902 | 0.997635 | 0.969233–0.997635 |
| 0.125 | 0.992208 | 0.606419 | 0.992208 | 0.992208–0.998756 |

At 0.25 → 0.125 mm, all 32 centreline/0.5 mm-offset comparisons pass the unchanged numerical tolerance (10%, with 0.01 absolute tolerance near zero). The largest relative change is 3.046%. There are no empty deposited-amount columns and no zero centreline samples along the fine-grid interior. The original point-sampling/1 mm-deposition control fails the refinement and gap checks. Maximum mass error is 1.173 × 10⁻⁵ on 60 units in both implementations.

For a unit straight line the analytic Gaussian-footprint signal is exp(−d²/(2σ²)): 1 on the centreline and 0.606531 at d = 0.5 mm for σ = 0.5 mm. At the finest tested grid, the four centreline values span 0.992208–0.998756. Tests also check the analytic profile at every phase, mass, exponential decay, physical deposition via walkAnt, boundary zero padding, invalid widths and the default-off path.

The kernel sums cell amount (`cellValue × cell`) against exp(−r²/(2σ²))/(√(2π)σ). The normalisation retains the legacy units/mm convention and gives a unit centreline signal for a unit infinite trail in the refinement limit. It is a proposed signal convention; no measured antenna response is claimed. Each axis is truncated at 4σ (less than 0.013% of the two-dimensional integral omitted). Outside the stored grid contributes zero; the footprint is not renormalised at the domain edge.

Coarse grids remain strongly dependent on alignment, as the table shows. This does not establish a safe grid size for every sigma, a valid biological width, convergence near boundaries, or trail-following behaviour. Boundary deposit rejection and the existing late-decay cutoff remain unchanged. Sampling cost grows with the number of cells in the footprint. The main tree is untouched and proposal.patch is unadopted.

Machine-readable evidence: `convergence.json` and `legacy-identity.json`, both stamped with `stamp(ITEM)`. Candidate source and the exact original field/physics snapshots are preserved in this folder. Run commands and validation results are in the README Progress log.
