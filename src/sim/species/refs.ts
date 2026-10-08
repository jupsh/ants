/**
 * Bibliography for parameter provenance. Keys are referenced from species
 * definitions via `measured(..., 'key')` etc.
 */
export interface Ref {
  short: string;
  full: string;
  url?: string;
}

export const REFS: Record<string, Ref> = {
  beckers1992: {
    short: 'Beckers, Deneubourg & Goss 1992',
    full: 'Beckers R, Deneubourg JL, Goss S (1992) Trails and U-turns in the selection of a path by the ant Lasius niger. J Theor Biol 159:397–415.',
  },
  beckers1993: {
    short: 'Beckers, Deneubourg & Goss 1993',
    full: 'Beckers R, Deneubourg JL, Goss S (1993) Modulation of trail laying in the ant Lasius niger and its role in the collective selection of a food source. J Insect Behav 6:751–759.',
  },
  lasiusLifetimeModel: {
    short: 'arXiv:1805.05598',
    full: 'Diverse stochasticity leads a colony of ants to optimal foraging (2018) — reports the 47 min mean trail lifetime estimated for Lasius niger.',
    url: 'https://arxiv.org/pdf/1805.05598',
  },
  lasiusDeposition2024: {
    short: 'Insect. Soc. 2024 (Lasius niger deposition)',
    full: 'Lasius niger pheromone deposition study, Insectes Sociaux (2024), doi:10.1007/s00040-024-00995-y — up to 22× more pheromone deposited within 10 cm of food than near the nest; ~4× more for a feeder at 100 cm than at 20 cm.',
    url: 'https://link.springer.com/10.1007/s00040-024-00995-y',
  },
  mailleux2000: {
    short: 'Mailleux, Deneubourg & Detrain 2000',
    full: 'Mailleux AC, Deneubourg JL, Detrain C (2000) How do ants assess food volume? Anim Behav 59:1061–1069.',
  },
  mailleux1999: {
    short: 'Mailleux et al. 1999',
    full: 'Mailleux AC, Detrain C, Saffre F, Deneubourg JL (1999) Modulation du recrutement alimentaire en fonction du jeûne chez la fourmi Lasius niger. Actes Coll. Insectes Sociaux 12:75–80. Scout and recruiter behaviour after 1, 4, 8 days of starvation.',
    url: 'https://dictionnaire-amoureux-des-fourmis.fr/Noms%20propres/Publis/1999/Actes-Colloques-Insectes-Sociaux-12-Mailleux-Detrain-Saffre-Deneubourg.pdf',
  },
  mailleux2005: {
    short: 'Mailleux, Detrain & Deneubourg 2005',
    full: 'Mailleux AC, Detrain C, Deneubourg JL (2005) Triggering and persistence of trail-laying in foragers of the ant Lasius niger. J Insect Physiol 51:297–304. Desired volume is individual and constant across trips; 14 % never lay trail.',
  },
  mailleux2009: {
    short: 'Mailleux, Deneubourg & Detrain 2009',
    full: 'Mailleux AC, Deneubourg JL, Detrain C (2009) Food transport in ants: do Lasius niger foragers maximize their individual load? C R Biologies 332:500–506. Two-drop experiment; individual drinking model (0.01 µL/s, η = 4.3, Vc = 1 µL).',
    url: 'https://comptes-rendus.academie-sciences.fr/biologies/item/10.1016/j.crvi.2008.10.005.pdf',
  },
  bles2022: {
    short: 'Bles et al. 2022',
    full: 'Bles O, Deneubourg JL, Sueur C, Nicolis SC (2022) A data-driven simulation of the trophallactic network and intranidal food flow dissemination in ants. Animals 12:2963.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9655576/',
  },
  khuongTrajectories: {
    short: 'Khuong et al. 2013',
    full: 'Khuong A, Lecheval V, Fournier R, Blanco S, Weitz S, Bézian JJ, Gautrais J (2013) How do ants make sense of gravity? A Boltzmann walker analysis of Lasius niger trajectories on various inclines. PLoS ONE 8:e76531. Datasets S1–S5 (CC BY 4.0).',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3812222/',
  },
  detrain2014: {
    short: 'Detrain & Prieur 2014',
    full: 'Detrain C, Prieur J (2014) Sensitivity and feeding efficiency of the black garden ant Lasius niger to sugar resources. J Insect Physiol 64:74–80.',
  },
  evison2008: {
    short: 'Evison et al. 2008',
    full: 'Evison SEF, Petchey OL, Beckerman AP, Ratnieks FLW (2008) Combined use of pheromone trails and visual landmarks by the common garden ant Lasius niger. Behav Ecol Sociobiol 63:261–267.',
    url: 'https://link.springer.com/article/10.1007/s00265-008-0657-6',
  },
  bonavita2026: {
    short: 'Bonavita et al. 2026',
    full: 'Bonavita P, Albino M, Gautrais J, Fourcassié V, Combe M, Lacour L, Eibner S, Jost C (2026) Discovering search behaviour in black garden ant trajectories. PLoS ONE 21:e0327957. Data: Zenodo doi:10.5281/zenodo.19203503 (CC BY 4.0).',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC13419209/',
  },
  khuong2016: {
    short: 'Khuong et al. 2016',
    full: 'Khuong A, Gautrais J, Perna A, Sbaï C, Combe M, Kuntz P, Jost C, Theraulaz G (2016) Stigmergic construction and topochemical information shape ant nest architecture. PNAS 113:1303–1308. (L. niger body length 4.1 ± 0.14 mm; building-pheromone lifetime.)',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4747701',
  },
  rasse2001: {
    short: 'Rasse & Deneubourg 2001',
    full: 'Rasse P, Deneubourg JL (2001) Dynamics of nest excavation and nest size regulation of Lasius niger. J Insect Behav 14:433–449.',
  },
  buhl2004: {
    short: 'Buhl et al. 2004/2005',
    full: 'Buhl J, Gautrais J, Deneubourg JL, Theraulaz G (2004) Nest excavation in ants: group size effects on the size and structure of tunneling networks. Naturwissenschaften 91:602–606; Buhl J et al. (2005) Behav Ecol Sociobiol — excavated volume ≈ proportional to number of workers, logistic dynamics.',
  },
  hurlbert2008: {
    short: 'Hurlbert, Ballantyne & Powell 2008',
    full: 'Hurlbert AH, Ballantyne F, Powell S (2008) Shaking a leg and hot to trot: the effects of body size and temperature on running speed in ants. Ecol Entomol 33:144–154. Table 2: activation energies and speeds at 28 °C; mass exponent ≈ 0.25.',
    url: 'https://fb4.ecology.uga.edu/publications/hot_to_trot.pdf',
  },
  gillooly2001: {
    short: 'Gillooly et al. 2001',
    full: 'Gillooly JF, Brown JH, West GB, Savage VM, Charnov EL (2001) Effects of size and temperature on metabolic rate. Science 293:2248–2251.',
  },
  partonLogan1981: {
    short: 'Parton & Logan 1981',
    full: 'Parton WJ, Logan JA (1981) A model for diurnal variation in soil and air temperature. Agric Meteorol 23:205–216.',
  },
  hangartner1967: {
    short: 'Hangartner 1967',
    full: 'Hangartner W (1967) Spezifität und Inaktivierung des Spurpheromons von Lasius fuliginosus und Orientierung der Arbeiterinnen im Duftfeld. Z Vergl Physiol 57:103–136. (Osmotropotaxis.)',
  },
  draft2018: {
    short: 'Draft et al. 2018',
    full: 'Draft RW, McGill MR, Kapoor V, Murthy VN (2018) Carpenter ants use diverse antennae sampling strategies to track odor trails. J Exp Biol 221:jeb185124.',
    url: 'https://www.biorxiv.org/content/10.1101/327379v1',
  },
  bossert1963: {
    short: 'Bossert & Wilson 1963',
    full: 'Bossert WH, Wilson EO (1963) The analysis of olfactory communication among animals. J Theor Biol 5:443–469. (Pogonomyrmex badius alarm: active space ~6 cm radius, fades in ~35 s.)',
  },
  robinson2005: {
    short: 'Robinson et al. 2005',
    full: "Robinson EJH, Jackson DE, Holcombe M, Ratnieks FLW (2005) Insect communication: 'no entry' signal in ant foraging. Nature 438:442.",
  },
  robinson2008: {
    short: 'Robinson et al. 2008',
    full: 'Robinson EJH, Green KE, Jenner EA, Holcombe M, Ratnieks FLW (2008) Decay rates of attractive and repellent pheromones in an ant foraging trail network. Insectes Soc 55:246–251. Repellent effect lasts 78 min vs 33 min for the short-lived attractant; initial effect 48% vs 25% above control.',
    url: 'https://eprints.whiterose.ac.uk/46214/',
  },
  jackson2004: {
    short: 'Jackson, Holcombe & Ratnieks 2004',
    full: 'Jackson DE, Holcombe M, Ratnieks FLW (2004) Trail geometry gives polarity to ant foraging networks. Nature 432:907–909. Bifurcation angles 50–60°.',
  },
  jackson2006: {
    short: 'Jackson et al. 2006',
    full: "Jackson DE, Martin SJ, Holcombe M, Ratnieks FLW (2006) Longevity and detection of persistent foraging trails in Pharaoh's ants, Monomorium pharaonis. Anim Behav 71:351–359. Long-lived trails detectable ≥ 48 h.",
    url: 'https://sro.sussex.ac.uk/id/eprint/27118/',
  },
  peacock1950: {
    short: 'Peacock et al. 1950–55',
    full: "Peacock AD, Hall DW, Smith IC, Goodfellow A (1950) The biology and control of the ant pest Monomorium pharaonis. Dept Agric Scotland Misc Publ 17. Development ~38 d at 27 °C; workers live ~9–10 weeks.",
  },
  wilson1962: {
    short: 'Wilson 1962',
    full: 'Wilson EO (1962) Chemical communication among workers of the fire ant Solenopsis saevissima. Anim Behav 10:134–164. Dufour gland trail active 85–125 s on glass at 28 °C.',
  },
  porter1988: {
    short: 'Porter 1988',
    full: 'Porter SD (1988) Impact of temperature on colony growth and developmental rates of the ant, Solenopsis invicta. J Insect Physiol 34:1127–1133.',
  },
  tschinkel2006: {
    short: 'Tschinkel 2006',
    full: 'Tschinkel WR (2006) The Fire Ants. Harvard University Press. Polymorphism (minor/major bimodality grows with colony size), nest architecture, foraging tunnels.',
  },
  penick2008: {
    short: 'Penick & Tschinkel 2008',
    full: 'Penick CA, Tschinkel WR (2008) Thermoregulatory brood transport in the fire ant, Solenopsis invicta. Insectes Soc 55:176–182.',
  },
  tschinkel2004: {
    short: 'Tschinkel 2004',
    full: 'Tschinkel WR (2004) The nest architecture of the Florida harvester ant, Pogonomyrmex badius. J Insect Sci 4:21. Helical shafts (4–6 cm diameter, 15–20° near surface steepening to ~70°), chamber area decreasing 25–40% per depth decile, half the area in the top quarter.',
    url: 'https://bioone.org/journals/journal-of-insect-science/volume-4/issue-21',
  },
  prabhakar2012: {
    short: 'Prabhakar, Dektar & Gordon 2012',
    full: 'Prabhakar B, Dektar KN, Gordon DM (2012) The regulation of ant colony foraging activity without spatial information. PLoS Comput Biol 8:e1002670. α_n = max(α_{n−1} − qD_{n−1} + cA_n − d, α_min); D_n ~ Poisson(α_n); c 0.01–0.25, q 0.05, d 0, α_min 0.01 ants/s; return rates 0.15–1.2 ants/s.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3426560/',
  },
  greene2007: {
    short: 'Greene & Gordon 2003, 2007',
    full: 'Greene MJ, Gordon DM (2003) Cuticular hydrocarbons inform task decisions. Nature 423:32; (2007) Interaction rate informs harvester ant task decisions. Behav Ecol 18:451–455. Foragers leave only after patrollers return.',
  },
  gordon2016: {
    short: 'Gordon 2016',
    full: 'Gordon DM (2016) The evolution of the algorithms for collective behavior. Cell Systems 3:514–520 / Front Ecol Evol reviews: foragers travel up to ~20 m, search individually, trip duration dominated by search time.',
    url: 'https://www.frontiersin.org/journals/ecology-and-evolution/articles/10.3389/fevo.2016.00115/full',
  },
  wehner1981: {
    short: 'Wehner & Srinivasan 1981',
    full: 'Wehner R, Srinivasan MV (1981) Searching behaviour of desert ants, genus Cataglyphis. J Comp Physiol 142:315–338.',
  },
  centredLoops2018: {
    short: 'Centred-loops search model 2018',
    full: 'A simple mathematical model using centred loops and random perturbations accurately reconstructs search patterns observed in desert ants. J Comp Physiol A (2018), doi:10.1007/s00359-018-1297-6. C. fortis fits: β = 3.0–3.5°, backward factor 0.2–0.3.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6244989/',
  },
  wittlinger2007: {
    short: 'Wittlinger, Wehner & Wolf 2006/2007',
    full: 'Wittlinger M, Wehner R, Wolf H (2006) The ant odometer: stepping on stilts and stumps. Science 312:1965–1967; (2007) J Exp Biol 210:198–207. Stride integrator is the main source of PI error.',
  },
  pfeffer2019: {
    short: 'Pfeffer et al. 2019',
    full: 'Pfeffer SE, Wahl VL, Wittlinger M, Wolf H (2019) High-speed locomotion in the Saharan silver ant, Cataglyphis bombycina. J Exp Biol 222:jeb198705. C. fortis reaches 0.62 m/s.',
    url: 'https://cob.silverchair.com/jeb/article-pdf/222/20/jeb213660/1978051/jeb213660.pdf',
  },
  gehring1995: {
    short: 'Gehring & Wehner 1995',
    full: 'Gehring WJ, Wehner R (1995) Heat shock protein synthesis and thermotolerance in Cataglyphis, an ant from the Sahara desert. PNAS 92:2994–2998. CTmax 53.6 °C (C. bombycina), 55.1 °C (C. bicolor).',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC42345/',
  },
  schmidHempel1984: {
    short: 'Schmid-Hempel & Schmid-Hempel 1984',
    full: 'Schmid-Hempel P, Schmid-Hempel R (1984) Life duration and turnover of foragers in the ant Cataglyphis bicolor. Insectes Soc 31:345–360. Forager life expectancy ≈ 6 days.',
  },
  buehlmann2014: {
    short: 'Buehlmann et al. 2014',
    full: 'Buehlmann C, Graham P, Hansson BS, Knaden M (2014) Desert ants locate food by combining high sensitivity to food odors with extensive crosswind runs. Curr Biol 24:960–964.',
  },
  franks2006: {
    short: 'Franks & Richardson 2006',
    full: 'Franks NR, Richardson T (2006) Teaching in tandem-running ants. Nature 439:153. Leaders would reach food ~4× faster alone; bidirectional gap feedback.',
    url: 'https://www.nature.com/articles/439153a',
  },
  franks1997: {
    short: 'Franks & Deneubourg 1997',
    full: "Franks NR, Deneubourg JL (1997) Self-organizing nest construction in ants: individual worker behaviour and the nest's dynamics. Anim Behav 54:779–796. Temnothorax build perimeter walls of grains at a distance set by colony size.",
  },
  rosengren1986: {
    short: 'Rosengren & Fortelius 1986',
    full: 'Rosengren R, Fortelius W (1986) Ortstreue in foraging ants of the Formica rufa group — hierarchy of orienting cues and long-term memory. Insectes Soc 33:306–337.',
  },
  woodantRoutes2023: {
    short: 'Wood ant route learning review 2023',
    full: 'Learning & Behavior (2023) doi:10.3758/s13420-023-00615-y — wood ants forage on aphids up to 100 m away, follow shared odour trails yet show site fidelity and idiosyncratic visually guided routes; private information prioritised in experienced ants.',
    url: 'https://link.springer.com/article/10.3758/s13420-023-00615-y',
  },
  frouz2000: {
    short: 'Frouz 2000',
    full: 'Frouz J (2000) The effect of nest moisture on daily temperature regime in the nests of Formica polyctena wood ants. Insectes Soc 47:229–235.',
  },
  wilson1980: {
    short: 'Wilson 1980',
    full: 'Wilson EO (1980) Caste and division of labor in leaf-cutter ants (Atta sexdens). I. The overall pattern in A. sexdens. Behav Ecol Sociobiol 7:143–156. Head width 0.7–>3 mm; minims (≈0.8 mm HW) garden and brood care; mediae cut and carry.',
  },
  burd1996: {
    short: 'Burd 1996',
    full: 'Burd M (1996) Foraging performance by Atta colombica, a leaf-cutting ant. Am Nat 148:597–612.',
  },
  roces1996: {
    short: 'Roces & Hölldobler 1996',
    full: 'Roces F, Hölldobler B (1996) Use of stridulation in foraging leaf-cutting ants: mechanical support during cutting or short-range recruitment signal? Behav Ecol Sociobiol 39:293–299.',
  },
  attaLoad: {
    short: 'Leaf-cutter load capacity',
    full: 'Maximal load carrying performance of leaf-cutter ants (SICB abstract): maximum load scales isometrically, up to 7.8× body mass; speed declines linearly with load mass.',
    url: 'https://sicb.org/?p=6573',
  },
  feener1990: {
    short: 'Feener & Moss 1990',
    full: 'Feener DH, Moss KAG (1990) Defense against parasites by hitchhikers in leaf-cutting ants: a quantitative assessment. Behav Ecol Sociobiol 26:17–29.',
  },
  bonabeau1996: {
    short: 'Bonabeau, Theraulaz & Deneubourg 1996',
    full: 'Bonabeau E, Theraulaz G, Deneubourg JL (1996) Quantitative study of the fixed threshold model for the regulation of division of labour in insect societies. Proc R Soc B 263:1565–1569.',
  },
  theraulaz1998: {
    short: 'Theraulaz, Bonabeau & Deneubourg 1998',
    full: 'Theraulaz G, Bonabeau E, Deneubourg JL (1998) Response threshold reinforcement and division of labour in insect societies. Proc R Soc B 265:327–332.',
  },
  wilson1958: {
    short: 'Wilson, Durlach & Roth 1958',
    full: 'Wilson EO, Durlach NI, Roth LM (1958) Chemical releasers of necrophoric behavior in ants. Psyche 65:108–114. (Oleic acid triggers corpse removal.)',
  },
  antkeeping: {
    short: 'Rearing data (antkeeping)',
    full: 'Hobbyist and supplier rearing records (e.g. antstore.net care sheets). Lasius niger at 25 °C: egg 9–16 d, larva 9–13 d, pupa 9–12 d. Lower-quality source; used where peer-reviewed values were not found.',
    url: 'https://www.antstore.net/shop/en/ants/Ants-from-Central-Europe/Lasius-niger--Black-Garden-Ant-.html',
  },
  holldobler1990: {
    short: 'Hölldobler & Wilson 1990',
    full: 'Hölldobler B, Wilson EO (1990) The Ants. Belknap Press. General natural history, colony sizes, morphology.',
  },
};
