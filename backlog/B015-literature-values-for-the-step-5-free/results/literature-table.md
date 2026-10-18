# Step-5 parameter search in cleared literature

Checked the cleared, pinned papers in `docs/literature.json`, concentrating on
*Lasius niger* methods and food-sharing results. The Mailleux 1999 paper is
not cleared; its already-written extraction in `docs/research/mailleux-rules.md`
is used only to assess transfer to that set-up. No uncleared paper was opened.
The model definitions below are from `src/sim/behavior/lasiusNestWorker.ts` and
`src/sim/experiments/colonyMailleux1999.ts`.

| Parameter or input | Candidate value or range | Source (cached page text; printed page) | Derivation | Conditions | Applicability to Mailleux 1999 |
|---|---|---|---|---|---|
| Nest density (ants/cm²) | **2–4** if the full 20 × 25 cm footprint was usable; **3.9–7.8** if only four 16 × 4 cm sections were usable | `.cache/papers/Mailleux2000/p02.txt` (1062) | 1000–2000 workers divided by 500 or 256 cm² | *L. niger*, Brussels laboratory; plaster nest, 22 ± 3 °C, normally fed 0.6 M sugar and cockroaches; test series after 4 d deprivation | Same authors, species, colony-size range and nest type as the 1999 extraction, but no evidence these were the **same nest dimensions**. These are capacity averages, not local occupancy where the recruiter walked. **Prior range only; cannot fix 1999 density.** |
| Nest density (cross-check) | **3.48** ants/cm² nominal | `.cache/papers/Buffin2011/p02.txt` (178) | 500 / (11.5 × 12.5 cm²) | *L. niger*, four queenless/broodless 500-worker colonies in Janet-type nests, 22 ± 3 °C, 1 M sucrose ad libitum before the assay | Different study and smaller colony, but supports an order-of-magnitude prior of a few ants/cm². Occupancy within the nest was not measured. **Prior only.** |
| `shareRate` (µL/s of crop transfer while sharing) | **No Lasius value found** | `.cache/papers/Buffin2011/p02.txt` (178), `p03.txt` (179), `p05.txt` (181) | The study records **number and duration** of trophallaxes; its ingested volume is measured at the **outside food source**, not transferred per event. Duration cannot be divided into source intake to obtain flow. | *L. niger*, 4 d starved then 2 h fed or water-only; sucrose treatment 1 M; 40 workers together in a 5-cm Petri dish for 30 min | Useful for bout timing, not liquid flow. No transferable prior for `shareRate` in the checked *Lasius* papers. |
| `receiveReserve` (fraction of the ant's maximal reserve below which it accepts food) | **No threshold found** | `.cache/papers/Buffin2011/p02.txt` (178), `p04.txt` (180) | Fed-versus-starved groups show nutritional state affects trophallaxis frequency, but the paper does not measure reserve fraction or an acceptance threshold. | *L. niger*, binary nutritional treatments as above | Supports state-dependent acceptance qualitatively, but cannot map either treatment to the model's fractional threshold. |
| `reserveSd` (SD of the log reserve-deficit multiplier) | **No distribution found** | `.cache/papers/Buffin2011/p02.txt` (178), `p04.txt` (180) | Individual reserve levels were not measured; fed/starved is a group treatment, not a within-group log-SD. | *L. niger*, binary nutritional treatments as above | No quantitative prior for this model-specific heterogeneity parameter. |
| `returnRate` (s⁻¹ hazard of a loaded forager leaving after unloading) | **No post-unloading hazard found** | `.cache/papers/Buffin2011/p02.txt` (178), `p03.txt` (179); `.cache/papers/Mailleux2000/p02.txt` (1062) | Buffin observes isolated workers in a Petri dish, not departure from a nest. Mailleux 2000 removes returning scouts before nest entry. Neither measures the delay **after unloading**. | *L. niger*, 22 ± 3 °C in both studies; Buffin 4 d starvation, Mailleux 2000 4 d for the volume trials | The 1999 extraction's 80–113 s nest-stay means are fit targets and include motion and sharing; their reciprocal is not an independent value of this conditional return hazard. |
| Trophallaxis duration (check only; **not** `shareRate`) | Sucrose: 29 ± 28 s fed donor → starved receiver; 33 ± 31 s fed → fed; 17 ± 14 s starved → starved | `.cache/papers/Buffin2011/p05.txt` (181), Table 2; `p02.txt` (178) | Directly reported means ± SD. A trophallaxis was scored only after >3 s of mouthpart contact. | *L. niger*, 1 M sucrose, binary fed/starved treatment; n = 66 / 21 / 13 respectively | Checks the duration scale and existing bout-end choice. It does not give transfer volume, antennation duration, or a 1999-specific distribution. |
| Antennation-only/contact duration (check only) | **No direct duration found**; 0.04 s is recorder precision, not a measured contact duration | `.cache/papers/Depickere2004/p03.txt` (83); `.cache/papers/Buffin2011/p02.txt` (178) | Depickère states the video precision; Buffin defines a >3-s trophallaxis, which is a different event. | Depickère: *L. niger* brood-tenders/foragers in a 19.8-cm arena, 23 ± 1 °C; Buffin conditions above | Neither result fixes the Mailleux 1999 antennation/contact episode duration. |

## Verdicts

| Parameter/input | Verdict |
|---|---|
| 1999 nest density | **Prior range only.** Nearby *L. niger* set-ups imply a few ants/cm² nominally, but the 1999 chamber area and local occupancy are unavailable. |
| `shareRate` | **Nothing found.** Buffin's bout durations do not identify volume per second. |
| `receiveReserve` | **Nothing quantitative found.** Fed/starved contrasts support a qualitative dependence only. |
| `reserveSd` | **Nothing found.** No individual reserve distribution. |
| `returnRate` | **Nothing found.** No independently measured wait after unloading. |
| Antennation and contact durations | **Partial timing check only.** Trophallaxis durations are measured; antennation-only durations are not. |

None of the five step-5 free inputs is fixable from the checked cleared
literature. The density figures are **not** estimates from the 1999 nest.
Greenwald et al. 2015 (`.cache/papers/Greenwald2015/p08.txt`, printed 8)
shows why duration is an unsafe volume proxy in *Camponotus*; its other-genus
measurements are not imported as *Lasius* parameters.

## Uncleared papers worth considering for a future clearing decision

Titles below appear in the **reference list** of the cleared Buffin 2011
paper (`.cache/papers/Buffin2011/p07.txt`, printed 183). This is a leads list,
not a claim that any paper contains the missing number. None was fetched or
read for this item.

1. Buffin et al. 2009, “Feeding and stocking up: radio-labelled food reveals exchange patterns in ants” — possible food-flow or reserve evidence.
2. Lenoir 1974, “Les relations trophallactiques au sein des jeunes sociétés de *Lasius niger* L.” — direct *Lasius* trophallaxis candidate.
3. Lenoir 1979, “Le comportement alimentaire et la division du travail chez la fourmi *Lasius niger*” — direct *Lasius* feeding/role candidate.
4. Wilson & Eisner 1957, “Quantitative studies of liquid food transmission in ants” — possible transfer-rate methods or values; species and applicability unknown.
5. Portha, Deneubourg & Detrain 2004, “How food type and brood influence foraging decisions of *Lasius niger* scouts” — possible context for reserve/foraging decisions; not a nest-transfer measurement based on its title.
