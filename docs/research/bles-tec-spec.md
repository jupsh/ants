# Bles, Deneubourg, Sueur & Nicolis (2022), Animals 12:2963: one-caste (OC) and two-emergent-castes (TEC) model specification

## 0. Sources and bottom line

_Compiled 2026-10-07 (session 2) by a research agent. The "Where I put it" paths were in the session scratchpad and are not kept (re-download from PMC9655576 and Zenodo 6396637, both CC BY 4.0). The port is kept at [`scripts/bles/bles_port.py`](scripts/bles/bles_port.py)._

| Source | What it contains | Where I put it |
|---|---|---|
| Full text, PMC9655576 (Europe PMC JATS XML, CC-BY) | Sections 1–7, Eqs. 1–3, Table 1, Figure captions | `scratchpad/research/dl/paper.xml`, `paper.txt` |
| Figure 1 image (PMC CDN) | Parameter table: α, β, θ, ϒ, α′, Φ | `dl/animals-12-02963-g001.jpg` |
| Figures 2–5 images | Numbers for KS, Z, D and the experimental reference lines | `dl/animals-12-02963-g00{2..5}.jpg` |
| **Zenodo 6396637 (v2, 2022-03-29)**: `Simulations_Script.py` (4886 lines), `Raw_Data.xlsx`, `Supplementary_Information.docx` | **The authors' model code** (TEC-exponential configuration) plus the whole analysis pipeline. Raw scan data. Figures S1–S6 and Tables S1–S3. (v1, 6393703, has no code.) | `scratchpad/research/zen/` |
| My faithful pure-Python port of the script's core loop, with a 60-s scan observer added | Used to check reproduction (section 7) | `scratchpad/research/scripts/bles_port.py` |

There is no GitHub repository. The Zenodo record is the only code.

**Bottom line (verified):** I ported the published script line for line and plugged in the Table 1 values. It reproduces the paper's Table 1 and Table S1 for **all six variants** (OC/TEC × delta/uniform/exponential), and the Figure S4 T50 and Gini values, all within Monte-Carlo noise. So the code below is the model, and where the text disagrees with the code, the code is right.

**Two findings change the plan:**
1. The paper's model outputs (≈99 events and so on) were **not** passed through a scan observer. Every pair formation counts as one event, even a 1-s one. If we apply the 60-s / >5-s / merge observer to the published model, TEC-exp gives **83 ± 15 events, not 99**: a ~16 % deficit, concentrated in NF→NF events. Section 7 has the numbers.
2. "~40 % of donated food given by non-foragers" is really **~40 % of donation events**. By food quantity the model gives only ~27 %.

---

## 1. Model definition

### 1.1 Paper text (Section 2, "Model Description"; verbatim quotes)

- Initial state: "At the beginning of each simulation (t = 0), the colony only contains non-forager individual NFs with a crop content equal to zero (Qi(0) = 0). The food source access is unrestricted, and the quantity of food is unlimited."
- Leaving the nest: "At each timestep t, every non-forager in the nest, selected in a random order, can leave the nest and start to feed at the food source with a probability per time unit α … Each individual visiting the food source at least once is considered to be a forager F for the rest of the simulations."
- Feeding and return: "the foragers Fs, containing an amount of food Q that is proportional to their time spent feeding, return to the nest, with a probability β corresponding to the inverse of the time spent feeding."
- Exchange propensities, Eqs. (1)–(2):
  - θ_i = θ_i(0) · Q_i^n / (k^n + Q_i^n)   (donor)
  - ϒ_i = ϒ_i(0) · k^n / (k^n + Q_i^n)   (receiver)
- Pairing: "The probability that two individuals will exchange food depends on the product of their individual interaction probabilities." Flow is one-way, donor → receiver, and "cannot be reversed during a single trophallactic event."
- End of an event: "The probability Φ of a trophallactic pair being separated is equal and constant for both individuals. However, when the donor is empty, the trophallactic event stops … the quantity of food exchanged is proportional to the duration of the trophallactic event." Capacity is not imposed.
- Leaving the nest, Eq. (3): α_i = α_i(0) · k^n / (k^n + Q_i^n). "After the first visit to the food source, this maximum probability α′_i(0) increases (α′_i(0) > α_i(0))."
- Fixed constants: n = 2 and k = 120, where k "corresponds to the mean quantity of food exchanged during one trophallactic event".
- OC version: θF = θNF and ϒF = ϒNF.
- TEC version: an ant switches to forager values after its first visit, with "θF > θNF and ϒF < ϒNF". The text's ϒF < ϒNF contradicts Table 1 and the code; see section 6, item 6.
- Between-individual variability:
  - (i) delta (all equal).
  - (ii) uniform, "with a standard deviation … equal to the mean". The code differs; see section 6, item 4.
  - (iii) exponential, "f(x)=ε·e^(−xε), with ε equal to θ or ϒ". The code uses mean = ε; see section 6, item 5.
  - Values are drawn once at the start. In TEC the F value and the NF value of the same ant "are not correlated".
- Section 4: "3600 timesteps (with each timestep equal to 1 s) using 53 individuals"; 1000 repetitions. "For each simulation, the start/end time of each trophallactic event, as well as the identity and role of each individual … were extracted." The text never mentions a scan observer for the model.
- Section 4 also says the first-arrival survival curve "is well-fitted by the power law distribution of αi(0)" (Figure S1: power law log-rank stat = 1.47, p = 0.224; delta, uniform and exponential are all rejected, p ≤ 0.005).

### 1.2 What the code actually does (`Simulations_Script.py`, lines 51–865)

**Scheme.** Discrete time, Δt = 1 s, `t = 0…3599`, run in `Rep = 1000` replicates with `np.random.seed(123456789)` (l.325).

- Each tick, all agents are visited in a freshly shuffled order (asynchronous random-sequential update, l.385).
- An agent acts only if its current state equals its state at the end of the previous tick (`EvolPop[t-1, i] == state`). An agent whose state changed earlier in the same tick does not act again.
- A chosen partner must also pass this check.
- At t = 0, `EvolPop[-1]` is a row of zeros, so **nothing happens in the first tick**.

**Random draws.** Each visited agent draws two uniforms:
- `Which_task` (W) chooses at most one action from stacked probabilities.
- `prob` (pr) is used for the partner's acceptance.

**States** (French comments l.53–59):

| Code | Meaning |
|---|---|
| 10 | Naive or empty NF in the nest |
| 1 | At the food source |
| 2 | Forager in the nest |
| 8 | NF "stock" (has received food) |
| 5 | NF receiver in a pair |
| 66 | F receiver in a pair |
| 100 | F donor in a pair |
| 110 | NF donor in a pair |

State 6 is listed but never assigned.

**Crop units.** One unit = 1 s of feeding or 1 s of trophallaxis.
- A forager returning from the source adds `t_return − t_arrival` units (l.715).
- A pair moves exactly 1 unit per tick from donor to receiver, from the tick after the pair forms (l.408–413).

**Agent rules** (g(Q) = Q²/(Q²+120²); h(Q) = 120²/(Q²+120²)):

| State (prev = same) | Action, chosen by W from stacked probabilities | Partner pool and acceptance |
|---|---|---|
| **10** naive/empty NF (l.520–576) | W ≤ L = r_i·h(Q_i): go to source (→1).<br>L < W ≤ L + ee_r_i·h(Q_i): try to receive. | Donor pool = all agents in state 2 or 8, shuffled; leading entries with Q ≤ 0 are dropped and the first remaining is taken.<br>Accept if pr < e_j·g(Q_j) (donor in state 2 → 100) or pr < ee_j·g(Q_j) (donor in state 8 → 110). Self → 5. |
| **2** forager in nest (l.579–709) | W ≤ G = e_i·g(Q_i): give (only if Q_i > 0).<br>G < W ≤ G + e_r_i·h(Q_i): receive.<br>Next band, up to + rn·h(Q_i): go to source (→1). | Give pool = states 10, 6, other 2s, 8 (no Q filter). Take the first after shuffling. Accept if pr < (ee_r_j or e_r_j)·h(Q_j). Receiver → 5 (NF) or 66 (F); self → 100.<br>Receive pool = other 2s plus 8s with Q > 0. Accept with the donor's e_j·g or ee_j·g. Self → 66. |
| **1** at source (l.712–718) | W ≤ K = 1/120: return (→2), Q += time spent. | Every tick in state 1, the agent is added to the forager set F. |
| **8** NF stock (l.721–847) | W ≤ ee_i·g(Q_i): give (if Q_i > 0).<br>Next band: receive with ee_r_i·h(Q_i).<br>Next band: leave with r_i·h(Q_i) (→1). | Same pools as above. Self → 110 when giving, → 5 when receiving.<br>**Quirk (l.772):** when an 8 gives to another 8, the receiver's acceptance uses the *donor's* Q: `ee_receive[j]·h(Q_donor)`. |
| **5 / 66** receiver in pair (l.408–461) | If not yet transferred this tick: receiver +1, donor −1.<br>End the pair if Q_donor ≤ 0 or W ≤ c, with c = 1/260. | After the end: NF receiver → 8; F receiver → 2.<br>Donor 100 → 2. Donor 110 → **10** if the receiver was NF (5), → 8 if the receiver was F (66). |
| **110** NF donor in pair (l.464–488) | Same transfer, then end if Q_self ≤ 0 or W ≤ c. | Donor → 8; NF receiver → 8; F receiver → 2. |
| **100** F donor in pair (l.491–514) | **Dead code.** The guard is `EvolPop[t-1] == 110`, which never holds for a 100. | Forager-donor pairs therefore end only through the receiver's check: about 1/260 per s, against about 2/260 for NF-donor pairs. |

**TEC switch.** The forager values (`e`, `e_receive`) are used whenever the agent is in state 2 or 66, i.e. from its first *return* from the source.
- In the TEC configuration, the 52-vector arrays `e`, `ee`, `e_receive` and `ee_receive` are drawn independently, so each ant's NF and F values are uncorrelated.
- For OC, the paper says the probabilities are the same before and after foraging. I implemented that as one shared array; independent arrays with equal means give indistinguishable outputs (section 7).

**Caste for analysis.** F = every ant that reached the source at least once by the end of the run (final status). D = everyone else. Pair types FF/FNF/NFF/NFNF use these final labels (l.998–1010), which is comparable to the experiment's "≥5 consecutive s feeding at any point" rule.

**Event definition in the model.**
- An event = one pair formation, recorded in `Id_Couple_Donor/Receiver` and `Time_Each_Troph` at its start tick (l.546–548 and so on).
- The total count is `len(Id_Couple_Donor)` (l.853).
- T50 = start time of the event at index ⌊n/2⌋ (l.863).
- There is no minimum duration, no scan and no merging.

**Stopping.** A fixed 3600 ticks. Pairs still open at the end are simply cut off.

---

## 2. Parameters

The "Source" column uses the superscripts in Figure 1: (a) = measured or from the literature; (b) = fitted.

| Symbol | Paper value | Code value | Units / meaning | Source |
|---|---|---|---|---|
| N | 53 (Sect. 4); "50 workers" (Sect. 3) | `Nb_of_Ind_Start = 52` | Agents. The raw data imply 267 ants / 5 colonies = 53.4. | Experiment |
| T | 3600 | 3600 | 1-s ticks; 60 min after food introduction | Experiment |
| Rep | 1000 | 1000 | Replicates | — |
| n | 2 | `n = 2` | Hill exponent in Eqs. 1–3 | Fixed (weak link in the literature [37, 40]) |
| k | 120 | `Z = 120` | Crop threshold (units = s of feeding/transfer) | Fixed (Sect. 2) |
| α (α_i(0)) | 1/30 (b) | `r = np.random.power(350/10500 = 1/30, N)` | **Shape a of a power-function distribution on [0, 1]** (pdf a·x^(a−1)): mean 1/31 ≈ 0.032/s, median ≈ 1e-9/s. Not a single rate. | Fitted to the first-arrival survival curve (Fig. S1) |
| α′ | 1/50 (a) | `rn = 1/50` | Prob/s for a forager in the nest to go back to the source; same for all foragers; multiplied by h(Q) | Literature [46, 48] |
| β | 1/120 (a) | `K = 1/120` | Prob/s of leaving the source → mean 120 s per visit and mean load ≈ 120 units | Literature or experiment |
| Φ | 1/120 (a) | `c = 1/(130·2) = 1/260`, checked by each member that has a live branch | Effective end hazard ≈ 1/130 s⁻¹ for NF donors, ≈ 1/260 s⁻¹ for F donors, or earlier if the donor empties. Simulated duration: mean 128 s, median 99 s, 32 % < 60 s, 2.8 % ≤ 5 s. | Experiment, then evidently re-tuned in the code |
| Transfer rate | "proportional to duration" | 1 unit/s | — | Assumed |
| θ, ϒ range | 1/5–1/100 (b) | — | Fitting range of the means | Fitted to (1) mean number of foragers, (2) mean number of events, (3) the four pair-type proportions (Sect. 4) |

**Table 1** (fitted means, as 1/x per second; W = "workers" = NF; OC uses one θ and one ϒ for every ant):

| | OC delta | OC uniform | OC exp | TEC delta | TEC uniform | TEC exp |
|---|---|---|---|---|---|---|
| θF | 1/11 | 1/10 | 1/6 | 1/10 | 1/11 | 1/9 |
| θW (NF) | = θF | = θF | = θF | 1/33 | 1/32 | 1/23 |
| ϒF | 1/60 | 1/50 | 1/56 | 1/11 | 1/9 | 1/9 |
| ϒW (NF) | = ϒF | = ϒF | = ϒF | 1/38 | 1/28 | 1/27 |
| Events (exp. 99.0 ± 17.4) | 100.1 | 98.7 | 100.5 | 101.0 | 99.5 | 98.7 |
| Foragers (exp. 12.2 ± 1.9) | 12.2 | 12.6 | 12.2 | 12.3 | 12.4 | 12.5 |

The Zenodo code is set to TEC-exp: `E = 9, EE = 23, E_receive = 9, EE_receive = 27` (l.65–68), which matches the TEC-exp column.

**Distributions in the code:**
- Exponential: `np.random.exponential(scale = mean)`, so SD = mean.
- Uniform (commented-out l.349–352): `U(m − m, m + m) = U(0, 2m)`, so SD = m/√3 ≈ 0.58 m.
- Delta: constant.

The fitted values are per-second probabilities that then go through g(Q) or h(Q) and the partner's acceptance. Section 4 says they were fitted against the three targets. I found no fitting code in the repository; the values are hard-coded.

---

## 3. Observation, and the event definition in data versus model

**Experiment (Section 3):**
- One scan sample per minute of all trophallaxes, noting donor, receiver and the x, y of the mandible contact.
- A pair is recorded if mandible-to-mandible contact lasts > 5 s.
- Direction is read from posture.
- The same pair on consecutive scans counts as one event lasting several minutes.
- Forager = fed ≥ 5 consecutive s at the source during the experiment.
- Filming: 90 min, food (3 mL of 1 M sucrose) introduced at minute 30, after 4 days of starvation.
- Five queenless, broodless colonies, each tested once.

**`Raw_Data.xlsx`** holds the per-scan records (time in minutes, donor ID, receiver ID) for 5 colonies, from minute 30 to 90. Repeated scans are **not merged**.
- If I merge the same directed pair on consecutive minutes, I get 103 / 90 / 75 / 129 / 95 events (total 492).
- The script's hard-coded per-colony totals are 104 / 90 / 77 / 129 / 95 (total 495, in a different colony order). The small gap is probably a merging nuance, such as a few duplicate rows or reversed pairs.
- The file has **no forager labels and no colony sizes**. The F/NF splits exist only as hard-coded arrays in the script (section 4).
- Other features:
  - 3.9–5.4 pairs are visible per scan on average.
  - Up to 11 cases (colony 4) of one ant in two pairs at once, which the model forbids.
  - Merged event durations: 40–49 % last 1 scan; the longest lasts 19 scans.

**Model:** the paper applies no observer (section 1.2). The model's "start/end time" of each event is extracted, but only the start time is used for counts and T50.

---

## 4. Reported outputs

Experimental values are n = 5 colonies. Model values are from 1000 simulations unless stated otherwise.

### 4.1 Counts and pair types

| Quantity | Experiment | Model (as reported) | Where |
|---|---|---|---|
| Events per colony | 99.0 ± 17.4. Per colony [129, 104, 90, 77, 95]. **17.4 is the population SD (ddof = 0)**; the sample SD is 19.4. | See Table 1 | Table 1; script l.1972–1975 |
| Foragers per colony | 12.2 ± 1.9 (61 foragers / 5). Not checkable from the raw data. | See Table 1 | Table 1 |
| F→F | 10.2 ± 8.2 (sample SD); [24, 5, 7, 4, 11] | OC: 3.1 / 3.5 / 3.6 (all significantly too low, MW p ≤ 0.0025).<br>TEC: 10.5 / 9.7 / 9.7 | Table S1, Fig. 2 |
| F→NF | 50.0 ± 10.1; [65, 47, 55, 43, 40] | OC: 44.1 / 44.5 / 45.0<br>TEC: 52.5 / 50.8 / 49.6 | Table S1 |
| NF→F | 7.0 ± 2.6; [8, 11, 6, 4, 6] | OC: 3.6 / 4.0 / 4.2<br>TEC: 7.3 / 7.0 / 7.1 | Table S1 |
| NF→NF | 31.8 ± 7.9; [32, 41, 22, 26, 38] | OC: 49.4 / 47.0 / 47.8 (all too high, p ≤ 0.0007).<br>TEC: 31.7 / 32.0 / 32.0 | Table S1 |

Each model cell lists delta / uniform / exponential.

**Table S1 detail:**
- Model SDs: OC-delta 2.2 / 6.3 / 2.1 / 8.2; TEC-exp FF "9.7 ± 0.2" (a typo; my port gives ±5.6) / 8.8 / 3.7 / 8.8.
- MW U and p are given for every cell. All TEC cells have p > 0.1.
- D = Σ|model − exp| over the four pair types: OC 34.0 / 30.4 / ~30.4; TEC 3.2 / 1.5 / 1.2.
- Figure 2 shows OC-delta (D = 34.0) against TEC-delta (D = 3.2).

**NF share of donations:** pooled 194/495 = 39.2 %; per-colony mean 39.5 ± 8.7 % (my calculation). Section 7 says "approximately 40 % of the donated food is given by the non-foragers"; this is an event count.

### 4.2 Per-individual participation (hard-coded experimental histograms; counts of individuals with k = 0, 1, 2, … events)

| Group | n individuals | Histogram | Mean events/ind | Fraction with 0 |
|---|---|---|---|---|
| All ants (Fig. 3A) | 267 | [46, 31, 39, 24, 29, 28, 18, 18, 15, 11, 2, 1, 2, 0, 2, 0, 0, 1] | 3.71 | 0.172 |
| F, total | 61 | [2, 1, 4, 2, 4, 8, 11, 10, 6, 9, 2, 0, 0, 0, 1, 0, 0, 1] | 6.34 | 0.033 |
| NF, total | 206 | [44, 30, 35, 22, 25, 20, 7, 8, 9, 2, 0, 1, 2, 0, 1] | 2.93 | 0.214 |
| F give (Fig. 3B) | 61 | [4, 2, 5, 6, 10, 11, 7, 5, 5, 4, 1, 0, 0, 1] | 4.93 | 0.066 |
| F receive (Fig. 3C) | 61 | [22, 15, 12, 4, 5, 3] | 1.41 | 0.361 |
| NF give (Fig. 3D) | 206 | [105, 55, 23, 12, 6, 2, 1, 1, 0, 0, 1] | 0.94 | 0.510 |
| NF receive (Fig. 3E) | 206 | [53, 39, 42, 37, 17, 10, 4, 2, 0, 1, 1] | 1.99 | 0.257 |

These histograms are internally consistent with the pair counts: F give 301 = FF + FNF, NF give 194 = NFF + NFNF, and so on.

**KS tests:**
- Figure 3, TEC-exp:
  - All ants: D = 0.02, p = 0.99.
  - F give: D = 0.09, p = 0.66.
  - F receive: D = 0.08, p = 0.82.
  - NF give: D = 0.04, p = 0.90.
  - NF receive: D = 0.07, p = 0.21.
  - D_total = 0.28.
- Table S2, TEC variants (D and p for F give, F receive, NF give, NF receive; then D_total):

  | Variant | F give | F receive | NF give | NF receive | D_total |
  |---|---|---|---|---|---|
  | Delta | 0.10, 0.52 | 0.09, 0.71 | 0.17, < 1e-6 | 0.22, < 1e-9 | 0.58 |
  | Uniform | 0.04, 0.99 | 0.07, 0.91 | 0.08, 0.07 | 0.13, < 1e-3 | 0.33 |
  | Exponential | 0.09, 0.66 | 0.08, 0.82 | 0.04, 0.90 | 0.07, 0.21 | 0.28 |

- Figure S4A–C (all ants): delta D = 0.16, p < 5e-7; uniform D = 0.08, p = 0.05; exponential D = 0.02, p = 0.90.

### 4.3 Dynamics, inequality and networks (TEC)

The model columns are the mean ± SD of **200 means-of-5** read from the Figure S4 panel titles. I assigned them to delta / uniform / exponential using Table S3's ranking and the monotone trend; confidence is high.

| Metric | Experiment (dashed line) | TEC delta | TEC uniform | TEC exp | Figure / test |
|---|---|---|---|---|---|
| T50 (min after food) | 31 (from the mean cumulative curve, l.3781) | 30.03 ± 1.07 | 29.88 ± 1.19 | 29.47 ± 1.13 | Fig. S4 Y–α. "No significant difference" for any variant (Z = 1.4, p = 0.17 is one of the labels). |
| Cumulative events curve | — | KS p > 0.95 for all | — | D = 0.06, p = 0.95 | Fig. 4A, S4D–F |
| Gini, excluding zero-event ants | 0.337 (per colony [0.339, 0.334, 0.333, 0.380, 0.300]; sample SD 0.029) | 0.295 ± 0.013 | 0.319 ± 0.013 | 0.343 ± 0.015 | Fig. 4C: Z = −0.9, p = 0.39 (TEC-exp only) |
| Gini, including zeros | 0.445 ([0.464, 0.363, 0.415, 0.522, 0.460]) | — | — | — | Script only (l.48, 3628) |
| Global efficiency | 0.4227 ± 0.0227 ([0.452, 0.424, 0.421, 0.389, 0.428]) | 0.398 ± 0.008 | 0.414 ± 0.010 | 0.427 ± 0.011 | Fig. 5A: Z = −0.8, p = 0.38 (the text says Z = −0.9). Degree-preserving random graph 0.402; fully random graph 0.335 (script l.2766–2767). |
| Closeness | ≈ 0.13 | 0.164 ± 0.040 | 0.163 ± 0.040 | 0.147 ± 0.040 | Fig. 5B: Z = −0.9, p = 0.34 |
| Betweenness | ≈ 0.03 | 0.045 ± 0.020 | 0.042 ± 0.020 | 0.032 ± 0.020 | Fig. 5C: Z = 0, p > 0.99 |
| Clustering | ≈ 0.24 | 0.196 ± 0.090 | 0.217 ± 0.100 | 0.232 ± 0.100 | Fig. 5D: Z = 0.2, p = 0.83 |

Figure 5 labels its Z values "D". Figure S4 has further Z values in text boxes: 7.3, 3.1, −1.9, −14.3, −18.1, −18.9, 5.5, 2.0, −1.8, 1.1, 0.6, −1.4, −1.1, 0.9, 0.0, 0.2. I could not map them to panels reliably.

Table S3 average rank: delta 2.75, uniform 2, exponential 1.25. For T50, delta ranks best.

**Kruskal–Wallis homogeneity across the five colonies** (Section 5):

| Metric | H | p |
|---|---|---|
| Degree | 0.70 | > 0.95 |
| Out-degree | 1.83 | 0.77 |
| In-degree | 0.66 | > 0.95 |
| Betweenness | 9.10 | 0.06 |
| Closeness | 3.98 | 0.41 |
| Eigenvector | 0.93 | 0.91 |

**Other:**
- Figure S6: the mean event count falls as the uniform width grows from 0 to 2× the mean.
- Figure S1: log-rank tests as in section 1.1.

**How the metrics are computed in the script:**
- **Gini:** `gini()` adds 1e-7 to every value and uses Σ(2i − n − 1)x/(nΣx). It is applied to each ant's total degree in a MultiDiGraph (in + out), with zeros removed for the reported comparison.
- **Efficiency:** Latora–Marchiori, on the largest connected component of the *undirected simple* graph: Σ over ordered pairs of 1/d, divided by N(N − 1).
- **Closeness and betweenness:** NetworkX 2.1 `closeness_centrality` and normalized `betweenness_centrality` on the directed MultiDiGraph. Zero values are dropped and values are pooled over individuals.
- **Clustering:** `nx.clustering` on the undirected simple graph.
- **Z-test resampling:** "200 means of 5" uses `np.random.randint(0, Rep, 5)`.
  - For efficiency, Gini and T50 this samples simulation runs.
  - For closeness and betweenness it samples **individual values** from the pooled array, and only from its first 1000 entries. This quirk makes the SDs not comparable across metrics.
- The Z-test and p-value computation itself is **not in the script**.

---

## 5. Code inventory (`Simulations_Script.py`)

| Lines | Content |
|---|---|
| 47–48 | Experimental Gini values |
| 62–89 | Parameters |
| 228–245 | `global_efficiency` |
| 265–285 | `gini` |
| 292–299 | `Evol_Prob_Give`, `Evol_Prob_Receive`, `Evol_Prob_Leave`: the Hill functions with Z = 120, n = 2 |
| 325–865 | The simulation loop |
| 866–1450 | Per-replicate bookkeeping, pair types and NetworkX metrics |
| 1450 onwards | Plotting, KS and MW tests, Z-test histograms. Hard-coded experimental arrays at l.1948–1975 and l.2013–2346; efficiency at l.2765. |

The script reads several CSV files from the author's Windows paths (`Mean_Cum_Troph_all_col_*.csv`, `Cluster_All.csv`, `Closenness_diG.csv` and so on). **These files are not on Zenodo**, so the experimental closeness, betweenness, clustering and cumulative-curve values exist only as the dashed lines in the figures.

The code needs Python 3.6 with old-API NetworkX 2.1 (`degree_iter`) and `mpl_toolkits.axes_grid`. It will not run on a modern stack as it is.

---

## 6. Ambiguities and gaps, with how to resolve each

| # | Issue | Resolution | Confidence |
|---|---|---|---|
| 1 | N = 50 (Sect. 3) / 53 (Sect. 4) / 52 (code). The data imply 53.4 ants per colony. | Use **52** to match the published model outputs; my port with 52 reproduces them. If we later model the real colonies, use 53. | High |
| 2 | Φ = 1/120 (Fig. 1) against the code's c = 1/260 per member, with the forager-donor branch dead. | Follow the code. In effect the end hazard is 1/260 s⁻¹ for F-donor pairs and ≈ 2/260 for NF-donor pairs, plus ending when the donor's crop is empty. Implement this asymmetry explicitly, or the pair-type and event-count fits break. | High (reproduction matches) |
| 3 | α "= 1/30, inverse of the mean time" against a power law. | α_i(0) ~ Power(a = 1/30) on [0, 1], i.e. U^30. Each tick, P(leave) = α_i(0)·h(Q). | High |
| 4 | Uniform "SD equal to the mean" against U(0, 2m). | Use **U(0, 2m)** (code, and the Fig. S6 legend "width … 0 to 2 times the mean"). | High |
| 5 | Exponential written as rate ε·e^(−xε) against scale = mean. | Use **mean = Table 1 value** (`np.random.exponential(scale)`). | High |
| 6 | Text says ϒF < ϒNF in TEC; Table 1 and the code have ϒF > ϒNF (1/9 vs 1/27). | Use Table 1. Foragers still receive less in practice, because of h(Q) on their full crops and time spent away. | High |
| 7 | Meaning of k and the crop units. | 1 unit = 1 s of feeding or transfer. Mean load per trip = 1/β = 120 = k. Units are arbitrary; we can rescale to µL later. | High |
| 8 | Time origin. | Model t = 0 is food introduction, with the source available at once. Ignore the 30 pre-food minutes. Experimental T50 is minutes after food. | High |
| 9 | Event definition and observer. | The published outputs count **every pair formation**: no >5-s threshold, no 60-s scan, no merging. To reproduce the paper, count raw events. Applying our observer is a *new* comparison and needs recalibration (section 7). | High |
| 10 | OC: one shared array, or independent arrays with equal means? | Paper wording implies one shared array. The outputs cannot tell the two apart (section 7). Use a shared array. | Medium |
| 11 | Scheduling details: the dead first tick; the previous-state guard; one W drawn per agent per tick; only the head of the shuffled pool tried, with no retry. | Port exactly. Each detail changes rates by a few percent. | High (code) |
| 12 | Code quirks: food left stranded on NF donors reset to state 10; the 8→8 acceptance using the donor's Q; F membership marked one tick after arrival at the source. | Port exactly for the reference implementation (behind a `blesCompat` flag). Fix in our own model. | High (code) |
| 13 | Forager SD 1.9 cannot be verified (no F labels in the raw data). | Model SD ≈ 2.9. Compare means only, or treat 1.9 as given. | — |
| 14 | Reported SDs mix conventions: 99.0 ± 17.4 uses ddof = 0; Table S1 uses ddof = 1; the Fig. S4 SDs are over means of 5. | Report both ddof conventions. Use n = 5 means-of-5 resampling only for Z-test parity. | High |
| 15 | Z-test p-values are not in the code; the closeness/betweenness resampling quirk; experimental closeness, betweenness and clustering values were not deposited. | Recompute the experimental network metrics from `Raw_Data.xlsx` after merging (my merge reproduces the event totals within 0.6 %). Use the dashed lines (0.13 / 0.03 / 0.24) only as a sanity check. Directed closeness depends on the NetworkX version (incoming vs outgoing distance), so define our own explicitly. | Medium |
| 16 | Typos: Table S1 TEC-exp FF SD "0.2"; Figure 2 caption says "delta"; Figure 5 shows "D" where it means Z; the text's Z = −0.9 against Figure 5A's −0.8. | Ignore; use the corrected values. | High |
| 17 | "40 % of donated food by NF". | It is 40 % of **donation events**. By transferred quantity the model gives about 27 %. Our validation target should be events. | High |
| 18 | How the fitting was done (no code; θ/ϒ seem hand-tuned on a 1/x grid). | Treat the Table 1 values as given. Re-fit only for the observer-filtered version. | Medium |

---

## 7. Reproduction check with my port (`scripts/bles/bles_port.py`; 500 replicates per variant, N = 52)

Values are mean ± population SD across replicates. "Obs" = the same runs passed through a 60-s scan observer with a random phase, keeping pairs that last > 5 s and are active at a scan instant, and merging the same directed pair on consecutive scans.

| Variant | Foragers | Events, raw | Events, obs | FF / FNF / NFF / NFNF, raw | NF→NF, obs | T50 raw (min) | Gini, no zeros | NF event share (raw) | NF food share |
|---|---|---|---|---|---|---|---|---|---|
| OC delta | 12.5 ± 2.9 | 100.5 ± 9.3 | 83.2 | 3.2 / 44.6 / 3.8 / 49.0 | 38.1 | 31.0 | 0.24 | 0.52 | 0.37 |
| OC unif (shared) | 12.6 | 97.9 ± 13.4 | 81.2 | 3.5 / 44.0 / 3.9 / 46.5 | 36.1 | 30.5 | 0.29 | 0.51 | 0.36 |
| OC exp (shared) | 12.7 | 102.7 ± 16.5 | 84.7 | 3.8 / 47.0 / 4.2 / 47.7 | 37.0 | 30.0 | 0.33 | 0.50 | 0.36 |
| TEC delta | 12.3 ± 2.9 | 101.8 ± 11.7 | 86.0 | 10.6 / 52.5 / 7.4 / 31.4 | 24.6 | 29.97 | 0.30 | 0.38 | 0.26 |
| TEC unif | 12.5 ± 2.8 | 100.7 ± 14.0 | 84.6 | 9.8 / 51.5 / 7.1 / 32.3 | 25.3 | 29.62 | 0.32 | 0.39 | 0.27 |
| **TEC exp** | **12.8 ± 2.9** | **99.4 ± 17.8** | **83.0 ± 15.3** | **9.9 / 50.1 / 7.3 / 32.1** | **24.7** | **29.43** | **0.35** | **0.40** | **0.27** |
| Paper TEC exp | 12.5 | 98.7 | — | 9.7 / 49.6 / 7.1 / 32.0 | — | 29.47 | 0.343 | — | — |

- Every raw column matches Table 1, Table S1 and the Figure S4 T50 and Gini values within noise. The paper's TEC-delta and TEC-uniform T50 values were 30.03 and 29.88.
- Simulated event durations: mean ≈ 128 s, median ≈ 100 s, ≈ 31 % shorter than 60 s, ≈ 3 % of 5 s or less.

**Consequence for our observer-based validation:** with the published parameters, the 60-s observer loses about 16 % of events overall and about 23 % of NF→NF events, because NF-donor pairs are shorter. TEC-exp then fits 83 events, not 99, and the NF→NF count drops below the experiment's 31.8.

So the plan needs two tiers:
1. **Exact reproduction:** raw counting, with the code's quirks behind a compatibility flag, gated on Table 1 and Table S1.
2. **Observer-consistent recalibration:** fit θ/ϒ (and perhaps Φ) so the observer-filtered output hits 99 ± 17.4, 12.2 foragers, pair types 10.2 / 50.0 / 7.0 / 31.8 and the Figure 3 histograms.

My recommendation: tier 1 as a regression test; tier 2 as the scientifically correct comparison.
