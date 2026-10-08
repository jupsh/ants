# Mailleux et al.: drinking-stop and trail-laying rules in *Lasius niger* (source extraction)

_Compiled 2026-10-07 (session 2) by a research agent from the full texts of the 1999, 2003, 2006 and 2009 papers and Portha et al. 2004; the PDFs are not stored in the repo (copyright); see Sources for links. Equations were checked against the rendered typeset pages, not only against the PDF text layer. Statements marked "inferred" are the agent's calculations, not the authors' claims._

## 0. Summary

1. **The published stopping rule has no per-second maximum of 1.** In all three papers that print it (2003 eq. 2.1, 2006 eq. 1, 2009 §2.2), the ceiling is **ηΔV**, where ΔV = 0.01 µL is the volume drunk per second:
   S(V) = ηΔV / (1 + e^{−η(V − Vc)}) per second, which saturates at 4.3 × 0.01 = **0.043 s⁻¹**.
   This is the discrete hazard of a **logistic distribution of individual desired volumes** (location Vc, scale 1/η). The cumulative curve they fit is U(V) = 1/(1 + e^{η(V−Vc)}): the fraction of ants still drinking, or not yet satisfied, at volume V. A rule with "maximum 1 per s" stops ants far too early. My numerical check with η = 4.3, Vc = 0.9 and 0.01 µL/s gives a median stopping volume of 0.21 µL, against 0.91 µL for the published form. **If M_b uses max = 1, it is not the Mailleux model.**
2. **The 2009 sign is a typo.** C R Biol 2009 prints S(V) = (ηΔV)/(1 + e^{η(V−Vc)}), with a positive exponent. Written that way the probability falls as V grows, which contradicts the sentence around it ("grows with the volume already ingested"). The 2003 and 2006 papers print −η. Our notes say the formula was "garbled". In fact the typeset formula is legible, but the text layer drops the Δ and the typeset sign is itself wrong.
3. **The parameters differ between papers.**

   | Source | η (µL⁻¹) | Vc (µL) |
   |---|---|---|
   | 2003 | 4.3 | 0.9 |
   | 2009 | 4.3 | 1.0 |
   | 2006, after 1 / 4 / 8 days of starvation | 5 | 0.64 / 0.86 / 0.90 |
   | Portha et al. 2004 (independent ULB fit) | 4.23–4.35 | 0.84–1.10 |

   Trail laying is a separate Bernoulli draw: Pt = 0.9 among ants that reach their threshold.
4. **The 2000 volume series (0.3, 0.7, 1, 3 and 6 µL) could not be obtained numerically.** The Animal Behaviour paper and the 2005 J Insect Physiol paper are paywalled, with no open-access copy on Unpaywall, Semantic Scholar or the ULB/UCLouvain repositories, and ResearchGate and ScienceDirect return 403. Section 6 lists every figure from the 2000 paper that later papers quote.
5. **Inferred (my calculation): the published logistic rule under-predicts trail laying at small drops by about 3×.** Section 7 has the details. It matters for comparing models.

---

## 1. Mailleux, Deneubourg & Detrain 2003, Proc R Soc B 270:1609–1616 (full text read, PMC1691411 scanned PDF)

### Equations (§2b, verbatim from the typeset page)

> "If food is available, an ant is assumed, for each second spent at the food source, to ingest a volume ΔV (= 10⁻² µl for *L. niger* based on Mailleux et al. (2000)). The probability of stopping ingesting food and leaving the source S(V) grows with the volume already ingested (V) and follows a response threshold function:
> **S(V) = ηΔV / (1 + e^{−η(V − Vc)})**, (2.1)
> where the constant η (= 4.3) measures the sensitivity of ants to the difference between V and the threshold Vc (= 0.9 µl) and is drawn from the experimental threshold curve (Mailleux et al. 2000). Vc is defined as the threshold volume for which 50% of the ants' population have reached their desired volume and left the food droplet."

> "Among those returning ants, a majority (90%), but not all individuals, engage in trail-laying behaviour. The remaining 10% do not lay a trail during their homeward trip, while they behave similarly to trail-laying foragers and ingest similar amounts of food. Therefore, the probabilities that a scout becomes a trail-laying ant (Pt) or not (1−Pt) are equal to 0.9 and 0.1, respectively."

> "For an initial volume of the droplet (V) this fraction of unsatisfied ants (U) is **U(V) = 1 / (1 + e^{η(V − Vc)})**. (2.2)"

### Other parameters (Fig. 1 caption and §2a)

| Parameter | Value | How it was estimated |
|---|---|---|
| Pl, rate of leaving the area while unsatisfied | 1/85 s⁻¹ | Giving-up time after drinking at a single 0.3 µL drop in the 2000 data. Exponentially distributed, n = 35, r² = 0.98. |
| Pd, rate of discovering a drop | 1/20 s⁻¹ | Time between successive visits to a single micropipette (unpublished 2000 data): 20.4 ± 17.2 s, n = 30. In the six-source set-up it was 19.4 ± 18.9 s, n = 55 (KS D = 0.12, n.s.). Exponential, r² = 0.94. |
| Pt | 0.9 | Assumed from the single-source experiments. |
| Time to move between aphids | 1 s | Assumption, used only in the predictive simulations. |

Two further assumptions: unsatisfied ants keep the 1/85 s⁻¹ leaving rate whatever the number of sources visited, and satisfied ants lay the same amount of trail regardless of volume or number of sources.

### Experiment

- Six micropipettes, each delivering 0.3 µL of 0.6 M sucrose, at the centre of a 6 × 6 cm area in two rows of three, 1 cm apart. Total 1.8 µL, "close to the maximal crop capacity".
- Each drop was delivered only when the ant climbed the metal stick, to prevent evaporation, and drops were not renewed.
- 88 foragers were videotaped at ×10. Ingested volume was measured from gaster length and height using an ellipsoid model.
- Trail-laying intensity is the percentage of video frames showing gaster dragging on a 2.5 cm section of the bridge.
- **The 2003 text does not state starvation level, temperature or colony size.**

### Table 1 (mean ± SD; experimental n; theoretical values from 500,000 Monte Carlo runs)

| Measure | Experimental (n) | Theoretical | Test |
|---|---|---|---|
| % trail layers | 57 % (88) | 58 % | χ²₁ = 0.04, n.s. |
| Individual trail-laying intensity | 9 ± 8 % (45) | — | — |
| Ingested volume, all ants (µL) | 0.8 ± 0.5 (65) | 0.7 ± 0.4 | D = 0.16, n.s. |
| Ingested volume, trail layers | 0.9 ± 0.5 (37) | 0.8 ± 0.4 | D = 0.10 |
| Ingested volume, non-layers | 0.8 ± 0.5 (28) | 0.6 ± 0.3 | D = 0.27 |
| Micropipettes visited, all ants | 2.8 ± 1.3 (88) | 2.5 ± 1.2 | D = 0.11 |
| Micropipettes visited, trail layers | 2.9 ± 1.3 (50) | 3.0 ± 1.1 | D = 0.23 |
| Micropipettes visited, non-layers | 2.5 ± 1.3 (38) | 1.9 ± 1.0 | D = 0.23 |
| Exploitation time (s), all ants | 115 ± 67 (86) | 105 ± 57 | D = 0.02 |
| Exploitation time, trail layers | 127 ± 71 (48) | 115 ± 56 | D = 0.10 |
| Exploitation time, non-layers | 101 ± 58 (38) | 91 ± 54 | D = 0.12 |

- Intensity was unrelated to the number of sources visited (rs = 0.10), the volume ingested (rs = 0.12) and the exploitation time (rs = −0.04), all with n = 45.
- **From the 2000 data:** at a single 3 or 6 µL drop, intensity was **13 ± 11 % (n = 137)**, and **"more than 90 %"** of ants laid trail.
- Figs 2 and 3 show the distributions and the cumulative departures of trail layers and non-layers against the number of pipettes visited (experimental n = 88, simulated n = 5000).
- Fig. 6 gives the optimal forager number as Xo ≈ VT/Vc (y = 1.04x − 0.15, r² = 0.99).
- **Internal inconsistency:** the Results text says "On average, all ants drank 0.7 µl …, visited 2.5 micropipettes and spent 105 s". Those are the *theoretical* values. The experimental values are 0.8, 2.8 and 115.

---

## 2. Mailleux, Detrain & Deneubourg 2006, J Exp Biol 209:4224–4229 (full text read)

### Equations (Results, first subsection, verbatim from the typeset page)

> "Experimental distribution of this parameter could be fitted by a model that assumes that the probability [=P(V)] of a scout ingesting a desired volume V and then laying a recruitment trail is not constant but increases close to a critical volume Vc (Mailleux et al., 2000). This probability follows a response threshold function:
> **P(V) = ηΔV / (1 + e^{−η(V–Vc)})**, (1)
> where the constant η measures the sensitivity of ants to difference between V and the response threshold Vc (desired volume). According to this probability, the fraction of ants (Fr) having ingested at least a volume V before laying a trail (Fig. 1) is:
> **Fr = 1 / (1 + e^{η(V–Vc)})**, (2)
> where Vc is defined as the threshold volume at which 50% of trail-laying ants have reached their desired volume."

> "When starvation was prolonged, η did not vary (**η=5**; t-test comparing regression slopes, t=1.89, N=239, NS) but Vc values statistically increased (t-test comparing regression elevations, t=33.64, N=239, P<0.001). After 1ds, **Vc=0.64 µl** (R=0.99, N=51, P<0.001); after 4ds, **Vc=0.86 µl** (R=0.99, N=113, P<0.001); and after 8ds, **Vc=0.90 µl** (R=0.99, N=74, P<0.001). Vc values after 4ds and 8ds were not statistically different (t=0.73, N=188, NS)."

- ΔV is not given a value in this paper.
- The fitting method is described only as "regression slopes/elevations". **Inferred:** a linear regression on logit-transformed Fr, with η as the slope and Vc taken from the intercept.
- **The fits used trail layers only.** N = 51, 113 and 74 equal 88 %, 93 % and 87 % of 58, 122 and 85. The Fig. 1 caption, however, gives N = 58, 122 and 85.

### Conditions

- Three colonies of 1000–1300 workers, queenright status not stated. Plaster nests with three sections of 15 × 5 × 0.5 cm, inside 50 × 38 cm arenas.
- 22 ± 3 °C with 12:12 L:D. Colonies were normally fed 0.6 M sucrose plus cockroaches.
- Starvation of 1, 4 or 8 days in random order, with 7 days of ad libitum feeding between periods. One to four ants were tested per period.
- Cardboard bridge 20 × 0.5 cm leading to a 6 × 6 cm area, which ants explored for 1 h before the drop was placed.
- Drops of **3 µL or 0.3 µL of 0.6 M sucrose**. "**Since 1.8 µl was the maximum ingested volume**", a 3 µL drop is unlimited.
- The first scout was removed just before it entered the nest. One ant was tested per hour, and the bridge was renewed every 4 ants.
- Video at ×25. Ingested volume came from the gaster ellipsoid. Velocity was measured over 2.5 cm at mid-bridge.
- Searching time runs from the mid-bridge crossing to discovery. Giving-up time runs from the end of drinking to the mid-bridge on the way back. Foraging time is their sum.
- Trail laying is scored from the gaster-curving and back-up posture over the whole bridge. Intensity is the fraction of time dragging the gaster over a 12 cm section.

### Table 1 (mean ± SD; first-column N is the number of scouts; superscript letters are from the paper)

| Drop | Starv. (N) | Foraging (s) | Searching | Drinking | Giving-up | Velocity out (cm/s) | Velocity in | Ingested (µL) | % trail | Intensity (N) |
|---|---|---|---|---|---|---|---|---|---|---|
| 3 µL | 1 d (58) | 136±51 | 45±43 | 70±26 | 22±14 | 2.1±1.1 | 1.8±0.6 | 0.72±0.36 | 88 % | 0.11±0.09 (51) |
| 3 µL | 4 d (122) | 175±80ᵃ | 56±64 | 91±24ᵇ | 28±33 | 1.8±0.8 | 1.6±0.6 | 0.90±0.39ᶜ | 93 % | 0.14±0.11 (113) |
| 3 µL | 8 d (85) | 176±75ᵃ | 59±65 | 94±22ᵇ | 28±26 | 1.8±0.9 | 1.7±0.6 | 0.98±0.37ᶜ | 87 % | 0.13±0.11 (74) |
| 3 µL | test | KW 23.12, P<0.0001 | 2.76 NS | 42.16, P<0.001 | 5.62 NS | 0.72 NS | 2.04 NS | 16.8, P<0.001 | χ² 2.32 NS | 5.25 NS |
| 0.3 µL | 1 d (28) | 126±58 | 32±23 | 38±15 | 56±54 | 1.8±1.0 | 1.7±0.4 | 0.19±0.08 | **37 %** | 0.09±0.10 (10) |
| 0.3 µL | 4 d (23) | 197±95ᵈ | 64±73 | 47±17 | 86±68ᵉ | 1.8±0.8 | 1.9±0.7 | 0.21±0.14 | **17 %**ᶠ | 0.16±0.05 (4) |
| 0.3 µL | 8 d (25) | 178±97ᵈ | 46±26 | 41±13 | 93±93ᵉ | 1.9±0.9 | 1.8±0.6 | 0.23±0.11 | **12 %**ᶠ | 0.06±0.06 (3) |
| 0.3 µL | test | 11.37, P<0.005 | 5.13 NS | 5.68 NS | 6.29, P<0.05 | 0.67 NS | 1.00 NS | 1.14 NS | χ² 6.13, P<0.05 | 3.70 NS |

- Pooled intensity did not differ with drop volume or starvation: KW = 5.90, N = 255, NS.
- No time parameter was correlated with ingested volume.
- **Derived (my calculation):** mean volume divided by mean drinking time gives 0.0103, 0.0099 and 0.0104 µL/s at 3 µL, which confirms ΔV ≈ 0.01 µL/s. At 0.3 µL the same ratio is 0.005, 0.0045 and 0.0056 µL/s, because ants keep their mandibles in a depleted drop.

---

## 3. Mailleux, Deneubourg & Detrain 2009, C R Biologies 332:500–506 (open access, full text read)

**Title correction:** the paper is "Food transport in ants: Do *Lasius niger* foragers maximize their individual load?", by Mailleux, Deneubourg and Detrain. It is the two-drop experiment with 0.7 µL drops. Buffin is not an author.

### Equation (§2.2, verbatim from the typeset page)

> "For each second spent at the food source, an ant is assumed to ingest a volume V (= 10⁻² µl for *L. niger*). The probability of stopping ingesting food and leaving the source S(V) grows with the volume already ingested (V) and follows a response threshold function: **S(V) = (ηΔV)/(1 + e^{η(V−Vc)})** where the constant η (= 4.3) measures the sensitivity of ants to the difference between the actually ingested volume V and the threshold Vc, Vc is defined as the threshold volume for which 50% of the ant population has reached their threshold volume and left the food droplet. η is drawn from the experimental threshold curve [20–22]. Among those ants that succeed in ingesting their threshold volume, a majority (90%), but not all individuals, engage in trail-laying behaviour. The remaining 10% do not lay a trail during their homeward trip while they behave as trail-laying foragers and ingest similar amounts of food."
>
> "… two small food droplets (0.7 µl), each of them being below the desired volume of 50% of foragers in these experimental conditions (**Vc = 1 µl**, see [20–22])."

Two typesetting problems:

- The exponent sign is positive in print. That is a typo; see the summary, item 2.
- The PDF text layer renders "ηΔV" as "ηV".

### Conditions

- Four queenless colonies of 1000–2000 workers, at 22 ± 3 °C.
- Nest 20 × 25 × 0.5 cm, divided into four sections of 16 × 4 × 0.5 cm under red glass. Colonies were fed brown sugar solution (0.6 M) and cockroaches.
- **Starvation: 4 days.** The bridge was connected 1 h before each trial.
- Drop 1: 0.7 µL of 0.6 M sucrose on a micropipette at the centre of the 6 × 6 cm area.
- Drop 2: 0.7 µL of 0.6 M sucrose on the middle of the bridge, 9 cm from drop 1. It was introduced after drop 1 and was out of reach on the way out.
- More than 95 % of scouts found drop 2. The analysis covers 63 scouts that found both drops, each tested once, with the bridge renewed after every scout.
- Intensity is the time spent dragging the gaster over 3 cm at the start of the bridge. The authors note that marks are about 2 cm apart.

### Table 1 (volume in µL, mean ± SD; theoretical values from 500,000 Monte Carlo runs)

| Group | 1st source | 2nd source | Total | N | Theory total | Theory N |
|---|---|---|---|---|---|---|
| Fraction laying trail | 38 % | 46 % | 84 % | 63 | 79 % | 500 000 |
| Volume, all ants | 0.47±0.25 | 0.28±0.20 | 0.75±0.30 | 63 | 0.85±0.30 | 500 000 |
| Volume, TL1 | 0.49±0.26ᵃ | 0.20±0.14ᵇ | 0.69±0.31 | 24 | 0.8±0.30 | 190 000 |
| Volume, TL2 | 0.43±0.24ᵃ | 0.33±0.20ᶜ | 0.76±0.27 | 29 | 0.81±0.29 | 294 570 |
| Volume, nTL2 | 0.55±0.22ᵃ | 0.31±0.24ᶜ | 0.86±0.26 | 10 | 1.10±0.29 | 104 570 |

Groups: TL1 laid trail after drop 1. TL2 started laying after drop 2. nTL2 never laid trail.

### Table 2 (time in s)

| Group | Drink at 1st | Between sources | Drink at 2nd | Total | N | Theory total |
|---|---|---|---|---|---|---|
| All | 51±12 | 105±80 | 23±11 | 178±83 | 63 | 176±85 |
| TL1 | 52±13 | 58±33 | 20±13 | 130±39 | 24 | 120±39 |
| TL2 | 51±40 (sic) | 141±89 | 25±10 | 212±92 | 29 | 219±119 |
| nTL2 | 46±12 | 114±83 | 20±12 | 180±81 | 10 | 186±96 |

### Text results

- TL1 and nTL1 drank the same volume at drop 1: 0.49 ± 0.26 vs 0.46 ± 0.24 µL, U = 436.5, NS.
- Drinking time at drop 1 was also the same: TL1 52 ± 13 s and nTL1 50 ± 11 s (t = 0.65, df = 61, NS).
- Every ant that reached drop 2 drank from it. Drop 2 supplied about 37 % of the total intake.
- 74 % of nTL1 became TL2 and 26 % did not (nTL2). The authors call nTL2 "persistent nontrail-layers", making up "10 to 20 % of the scouts' population".
- Intensity for TL1 was 0.16 ± 0.07 before drop 2 and 0.11 ± 0.08 after (NS). For TL2 it was 0.11 ± 0.09. In this paragraph intensity is called "mean number of trail marks laid per cm", which conflicts with the Methods definition as a time fraction.
- Pooled regression: **ingested volume = 0.006 × drinking time + 0.15** (rs = 0.46, N = 126). The two drops gave the same slope. Intake rate was not related to initial gaster size and appears to be an individual trait.

**Correction to our notes:** "mean drinking time of trail-laying ants ≈ 51 s" is a misreading. The 51 ± 12 s figure is the drinking time of **all 63 ants at a volume-limited 0.7 µL drop**. At an unlimited 3 µL drop, ants drink for 65–94 s (1999 and 2006 data).

---

## 4. Mailleux, Detrain, Saffre & Deneubourg 1999, Actes Coll. Insectes Sociaux 12:73–79 (header reads "73-104"; full text read, tables checked against page images)

**This paper is the source of our 1/4/8-day drinking-time data and the in-nest recruiter data.**

### Conditions

- Colonies of 1000–2000 workers in plaster Janet nests at 22 ± 3 °C. Colonies were normally fed **1 M** sucrose plus *Periplaneta americana*.
- The first recruiter in each trial visited the area and drank to satiety from a micropipette drop of **3 µL of 0.6 M sucrose**.
- Time to find food is measured from entering the area to touching the drop.
- Trail layers are ants whose gaster touched the substrate at least once on the way back to the nest. Intensity is gaster-contact time divided by trip duration.
- Inside the nest, the first recruiter was filmed for 20 min at ×2.

### Table 1: recruiters outside the nest (mean ± SD)

| Starvation | Find (s) | Drink (s) | % trail | Intensity | Area to nest (s) |
|---|---|---|---|---|---|
| 1 d | 39±41 (68) | 65±21 (63) | 85 % (67) | 0.11±0.09 (62) | 110±69 (25) |
| 4 d | 56±66 (132) | 88±24 (135) | 94 % (141) | 0.14±0.11 (128) | 137±86 (21) |
| 8 d | 59±64 (86) | 93±23 (92) | 88 % (97) | 0.13±0.12 (84) | 156±129 (21) |
| Test | KW NS | KW p<0.001 | χ² NS | NS | NS |

### Table 2a: first recruiter inside the nest

| Starvation | Time in nest (s) | Distance (cm) | Contacts | Total trophallaxis (s) | Contacts before main trophallaxis |
|---|---|---|---|---|---|
| 1 d | 113±57 (26) | 9.1±8.2 (26) | 6.1±4.8 (26) | 57±27 (26) | 3±3 (27) |
| 4 d | 80±26 (25) | 5.9±4.7 (23) | 3.3±1.9 (25) | 66±27 (25) | 1±1 (28) |
| 8 d | 82±43 (28) | 5.4±6.4 (26) | 3.3±3.2 (28) | 56±22 (28) | 1±2 (28) |
| KW | p=0.04 | NS | p=0.01 | NS | p=0.03 |

### Table 2b: probability that a contacted ant leaves the nest within 5 min

| Starvation | After a trophallactic contact | After a non-trophallactic contact | 
|---|---|---|
| 1 d | 44 % (n=68) | 69 % (n=63) |
| 4 d | 56 % (n=132) | 89 % (n=135) |
| 8 d | 86 % (n=82) | 93 % (n=92) |
| χ² | p<0.01 | p<0.01 |

- **The n values in Table 2b look copied from Table 1:** 68/63, 132/135 and 82 against 86/92. Treat them as unreliable.
- In the text: "all recruiters leave the nest within the 20 min". Most recruiters perform one long main trophallaxis, preceded or followed by short ones.

---

## 5. Mailleux, Detrain & Deneubourg 2005, J Insect Physiol 51:297–304 (paywalled; abstract only)

What the abstract (PubMed 15749112) states:

- The desired volume is "specific to each individual and is kept constant over successive trips".
- Between individuals within a colony it varies.
- "**14% never participate in the formation of the chemical pathway and never lay a trail over successive trips.**"
- Among the other foragers, persistence over trips varies between individuals but "do[es] not rely on an individual specialisation".

Not obtained: the number of ants and trips, the within-individual correlation, the starvation level and drop volume.

Search engines attribute a 51 s drinking time to this paper. That traces back to the 2009 figure and is not verified.

## 6. Mailleux, Deneubourg & Detrain 2000, Anim Behav 59:1061–1069 (paywalled; no full text found)

What the abstract (PubMed 10860533) states:

- Drops of **0.3, 0.7, 1, 3 and 6 µL**.
- At 3 or 6 µL, "**90% immediately returned to the nest laying a recruitment trail**".
- At 0.3, 0.7 or 1 µL, "several scouts stayed on the foraging area … If unsuccessful, they returned … without laying a trail".
- Volume changed the percentage of trail layers, not the intensity of marking.

Figures from the 2000 data that later papers quote:

| Quantity | Value | Cited in |
|---|---|---|
| Mean desired volume | 0.9 µL | 2003 introduction |
| η, Vc ("experimental threshold curve") | 4.3 µL⁻¹, 0.9 µL | 2003 |
| Vc "in these experimental conditions" | 1 µL | 2009, citing [20–22] |
| ΔV (intake per second) | 0.01 µL/s | 2003 |
| Maximum ingested volume (crop) | 1.8 µL | 2006; Portha 2004 says "about 1.8 µl" |
| Giving-up rate at a 0.3 µL drop | 1/85 s⁻¹, exponential, n = 35 | 2003 |
| Time between pipette visits | 20.4 ± 17.2 s, n = 30 | 2003 |
| Intensity at 3 or 6 µL | 13 ± 11 %, n = 137 | 2003 |
| Volume method | Gaster length and height, ellipsoid | 2006, Portha |

**Not available:** the per-volume proportions at 0.3, 0.7 and 1 µL, the n per volume, and the starvation level and concentration used in 2000. Our notes say "1 M" for 2000, but I could not verify that; the 2003 and 2009 follow-ups used 0.6 M. The nearest published per-volume figures are the 2006 single 0.3 µL drop (37 / 17 / 12 % at 1 / 4 / 8 days) and the 2009 two-drop 0.7 µL experiment (38 % after the first drop).

## 7. Mailleux, Buffin, Detrain & Deneubourg 2010/2011 (not obtained)

These are:

- "Recruiter or recruit: who boosts the recruitment in starved nests in mass foraging ants?", Anim Behav 79:31–35 (2010).
- "Recruitment in starved nests: the role of direct and indirect interactions between scouts and nestmates in the ant *Lasius niger*", Insectes Soc 58:559–567 (2011), doi:10.1007/s00040-011-0177-7.

Both are paywalled. They are **not** the two-drop paper.

A second-hand summary comes from the Bles thesis (ULB), which I have **not** checked against the originals:

- 2011: at 4 and 8 days of starvation, about 30 % of nestmates that received food lay pheromone without having visited the source. This does not happen at 1 day. Nest-exit probability rises with starvation independently of direct contacts.
- 2010: the recruiter's starvation (1 vs 8 days) does not change the recruits' response, but the recruits' own starvation does.

## 8. Independent ULB replication: Portha, Deneubourg & Detrain 2004, Anim Behav 68:115–122 (full text read)

- Conditions: 4 days of starvation, 3 µL of **1 M** sucrose (or protein), 22 ± 3 °C, bridge 22 × 0.5 cm.
- The fitted curve is F(V) = 1/(1 + e^{η(V−Vc)}), the "relative number of ants having drunk at least V before returning". It was fitted to **returning ants, both trail layers and non-layers**:

  | Condition | Vc (µL) | η | R² |
  |---|---|---|---|
  | Sucrose, brood | 1.10 | 4.35 | 0.96 |
  | Sucrose, no brood | 0.91 | 4.30 | 0.87 |
  | Protein, brood | 0.84 | 4.35 | 0.97 |
  | Protein, no brood | 0.84 | 4.23 | 0.98 |

- Volume against drinking-time slopes were 0.0074–0.0111 µL/s.
- **Trail layers and non-layers ingested the same volumes.** At sucrose, 84 % of returning ants laid trail with brood and 65 % without brood. The critical volume decides whether the ant returns; whether it lays trail is a separate decision that depends on context.
- Ants drinking for less than 5 s were assigned 0 µL, because no gaster change could be detected.

---

## 9. Contradictions and cautions

| # | Issue | Status |
|---|---|---|
| 1 | Sign of the exponent in S(V): +η in 2009, −η in 2003 and 2006 | Stated in the sources. 2009 is a typo, because its own text says S grows with V. |
| 2 | **Per-second maximum is ηΔV (0.043–0.05 s⁻¹), not 1** | Stated in all three papers |
| 3 | η = 4.3 (2003, 2009, Portha) vs 5 (2006) | Stated |
| 4 | Vc = 0.9 (2003), 1.0 (2009), 0.64 / 0.86 / 0.90 by starvation (2006), 0.84–1.10 (Portha) | Stated. 2009 and 2006 both use 4-day starvation yet give 1.0 vs 0.86. |
| 5 | Vc defined over "the ant population that left the drop" (2003, 2009), "trail-laying ants" (2006), or "returning ants" (Portha) | Stated. So it is unclear whether non-layers belong in the fit. |
| 6 | 2006 calls P(V) the probability of "ingesting V *and then laying a trail*"; 2003 separates S(V) from Pt = 0.9 | Stated. The 2006 wording conflates the two steps. |
| 7 | Never-layers: 10 % of satisfied ants (Pt, model), 14 % over successive trips (2005), "10–20 %" (2009) | Stated. 2009 cites ref [19] (Lanza 1992, fire ants) for this; the correct reference is presumably [21], the 2005 paper. 2009 nTL2 = 10/63 = 16 %. |
| 8 | Trail fraction at 3 µL: 85 / 94 / 88 % (1999) vs 88 / 93 / 87 % (2006) for 1 / 4 / 8 days; intensity 0.11 / 0.14 / 0.13 in both | **Inferred:** the 2006 data largely overlap the 1999 data with re-selected n (drinking 65 vs 70 s, 88 vs 91 s, 93 vs 94 s). Do not treat them as independent replicates. |
| 9 | 2003 text values (0.7 µL, 2.5 pipettes, 105 s) match the theory column, not the experiment | Stated in the paper; internal error |
| 10 | 2009 theory N column sums to 589,140, not 500,000; TL2 drinking SD "±40"; a test reported as "p < 0.03, NS" | Stated; typos |
| 11 | Units of trail intensity: time fraction (2003, 2006, 2009 Methods) vs "marks per cm" (2009 Results) vs spots per cm (Portha: 0.79–1.05) | Stated. Our notes' "gaster-contact fraction 0.16" uses the 2009 figure, whose unit is ambiguous. |
| 12 | 1999 Table 2b n values duplicate Table 1 | Stated; probable error |

### Inferred tension with the data (my calculation, not claimed by the authors)

Under the published rule, a scout lays trail with probability of about Pt × P(desired volume ≤ volume available). P(desired volume ≤ V) is the logistic CDF F(V) = 1/(1 + e^{−η(V−Vc)}).

- **2006, 0.3 µL drop.** The ants actually ingested about 0.2 µL. With 2006's own parameters, 0.9 × F(0.3) predicts **14 % at 1 day, 5 % at 4 days and 4 % at 8 days**, against **37 %, 17 % and 12 % observed** (n = 28, 23 and 25). Using the ingested 0.2 µL instead of 0.3 µL makes the predictions lower still.
- **2009, first 0.7 µL drop.** Ants ingested 0.47 µL. With η = 4.3 and Vc = 1, 0.9 × F(0.47 to 0.7) predicts **8–19 %**, against **38 % (TL1) observed**. The paper does not report a theoretical value for the first-drop fraction.
- **Volume does not separate layers from non-layers.** TL1 and nTL1 ingested the same volumes, and so did Portha's trail-laying and non-laying returners. That points to a trail decision only loosely tied to ingested volume. Either the left tail of the threshold distribution is heavier than logistic, or some ants lay trail without being satisfied.
- **Variance.** The volume SD implied by the logistic (π/(η√3) = 0.42 µL for η = 4.3, 0.36 µL for η = 5) matches the observed 0.36–0.39 µL at 3 µL. But with a fixed intake of 0.01 µL/s it implies a drinking-time SD of about 36–42 s, against the observed 21–26 s. The likely causes are between-individual intake rates (which 2009 states) or measurement noise in the gaster-ellipsoid volumes.

## Sources

- 2009 C R Biol: https://comptes-rendus.academie-sciences.fr/biologies/item/10.1016/j.crvi.2008.10.005.pdf
- 2003 Proc R Soc B: https://pmc.ncbi.nlm.nih.gov/articles/PMC1691411
- 2006 J Exp Biol: https://journals.biologists.com/jeb/article/209/21/4224/16321/Starvation-drives-a-threshold-triggering
- 1999 Actes: https://dictionnaire-amoureux-des-fourmis.fr/Noms%20propres/Publis/1999/Actes-Colloques-Insectes-Sociaux-12-Mailleux-Detrain-Saffre-Deneubourg.pdf
- Portha et al. 2004: https://citeseerx.ist.psu.edu/document?doi=45b30b5352a3c8d431d2334611a033e21d0bedd3&repid=rep1&type=pdf
- Bles thesis (ULB): https://dipot.ulb.ac.be/dspace/bitstream/2013/280931/3/These_BLES.pdf
- PubMed abstracts: 10860533 (2000), 15749112 (2005)
