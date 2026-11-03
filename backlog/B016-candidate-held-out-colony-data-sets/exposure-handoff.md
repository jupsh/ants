# B016 incidental exposures — handoff for the lead

This is an exposure inventory, not an assignment of data roles. The lead must
enter the session in `docs/contamination/` and assess any implications for future
tests. B016's author has no authority to edit that record. No paper, figure,
data-file content, or sealed path was opened. No biological measurement values
were seen; later titles included counts such as three proteomes and taxonomic
species counts. Public search output did, however, include long result-bearing
excerpts; these were not deliberately opened as abstracts or full texts.

## Search session and boundary

The first web call searched the three catalogue domains for Lasius/trophallaxis,
ants/trophallaxis, and ants/recruitment. Its long response unexpectedly supplied
extended article excerpts alongside catalogue hits. It is not accurate to call
this a title-only exposure. Subsequent catalogue queries project explicit
metadata fields and exclude all descriptions, abstracts, methods, usage notes,
and file contents. Outcome-bearing titles remain exposures even in that mode.

## First web call: affected sources

The following qualitative content was visible. Titles below are shortened where
necessary; descriptions paraphrase the exposed claims. Metadata-only hits are
listed too so that the inventory accounts for the whole returned batch.

| Source | Visible content and extent |
| --- | --- |
| [Dryad 1kn03](https://doi.org/10.5061/dryad.1kn03), co-founding queen immunity | Title and extended snippet: L. niger co-foundresses self-groomed but rarely allo-groomed or exchanged food; no greater pathogen resistance for queens or workers; increased individual immune investment. |
| [Zenodo 15473855](https://zenodo.org/records/15473855), Manica trophic eggs | Title indicated trophic-egg use at colony founding; bibliographic metadata and a reference title about social-fluid exchange. No experimental outcomes in the shown description. |
| [Zenodo 4464304](https://zenodo.org/records/4464304), Notaferrum | Title disclosed a first-known beetle association with weaver ants. Extended excerpt discussed independent evolution of ant association and an earlier observation of a beetle receiving food from Crematogaster ashmeadi. |
| [Zenodo 25289](https://zenodo.org/record/25289), dacetine ecology | Extended excerpt: very small colonies, little trophallaxis, rare associates; sedentary mites on Strumigenys louisianae, no obvious host response, possible feeding on egg-derived material; ecological coexistence and predatory specialization. |
| [Zenodo 20503450](https://zenodo.org/records/20503450), ant systematics | Bibliographic metadata and a long reference list. Titles included skeletal adaptations for tunnelling, novel caste evolution, and a phylogenetic analysis; no numerical results. |
| [Zenodo 5636586](https://zenodo.org/records/5636586), riodinid social parasite | Title disclosed a first-known parasite and evolutionary convergence/parallelism. A cited title disclosed social information transmission through trophallaxis. Files were labelled restricted; none accessed. |
| [Zenodo 2667081](https://zenodo.org/records/2667081), Ponera revision | Bibliography/title exposure: head/leg tunnelling adaptations and trophallaxis/aggression in Ponera coarctata; no underlying outcomes beyond titles. |
| [Zenodo 3679564](https://zenodo.org/records/3679564), Micropezidae | Extended excerpt described courtship/food gifts in ant-mimicking flies, a proposed glandular function, and associations with lateral swellings. |
| [Zenodo 12587026](https://zenodo.org/records/12587026), Ponera testacea | Title disclosed sister-species status; a cited trophallaxis/aggression title; no further result. |
| [Dryad t1sg6](https://doi.org/10.5061/dryad.t1sg6), queen contests | Title/design snippet: pairwise contests in L. niger founding queens and self-versus-mutual assessment question; no answer visible. |
| [Zenodo 27178](https://zenodo.org/record/27178) | Reference titles about communal nest weaving and trophallaxis/eusocial evolution; no specific outcome shown. |
| [Dryad xwdbrv1qk](https://doi.org/10.5061/dryad.xwdbrv1qk), single-trial learning | Title asserted mid-term memory after appetitive but not aversive training. Snippet gave L. niger, Y-maze design, Regensburg, and collection years. |
| [Zenodo 6332669](https://zenodo.org/records/6332669), Monomorium immatures | Morphology/taxonomic title plus a reference to larva-to-adult trophallaxis in Platythyrea; no quantitative or colony-level result. |
| [Dryad g79cnp5n1](https://doi.org/10.5061/dryad.g79cnp5n1), macronutrient intake | Topic title, an R filename, and dietary ingredient metadata; no response direction shown. |
| [Dryad s7423sv](https://doi.org/10.5061/dryad.s7423sv), herbivores/ants | Title and snippet asserted reciprocal facilitation between cattle and Lasius spp. in a removal experiment. |
| [Dryad t2q12](https://doi.org/10.5061/dryad.t2q12), mutualist microbiomes | Title framed a question; snippet described Brachymyrmex/Lasius and aphid/mealybug microbiome comparison, with no answer shown. |
| [Zenodo 19340631](https://zenodo.org/records/19340631), Lomechusoides | Snippet stated that beetle larvae receive food by trophallaxis and prey on ant brood. |
| [Dryad 5181v](https://doi.org/10.5061/dryad.5181v), self-control | Title asserted self-control in individual workers; snippet identified L. niger. |
| [Dryad 05qfttffb](https://doi.org/10.5061/dryad.05qfttffb), overwintering root aphids | Title asserted L. flavus protection of aphid eggs from predators/pathogens; funding metadata also shown. |
| [Dryad tdz08kq5j](https://doi.org/10.5061/dryad.tdz08kq5j), road networks | Title/snippet asserted improved explanation of L. neglectus distribution when accounting for road topology. |
| [Dryad 1f24f](https://doi.org/10.5061/dryad.1f24f), foraging-path geometry | Title disclosed collective preference for a straight over a bent equal-length path. Design snippet gave two food sources, colony-size variation and a 135-degree bend. Candidate must retain this title exposure. |
| [Dryad 73f45](https://doi.org/10.5061/dryad.73f45), destructive disinfection | Title/snippet asserted prevention of fungal spread by a multicomponent behaviour in L. neglectus. |

## Initial DataCite query before the plied skill was invoked

A projected `titles.title:(trophallaxis)` query returned 12 of 27 catalogue
records. No descriptions/abstracts were displayed. Outcome-bearing titles:

- `10.5061/dryad.n6d50`: social information transfer about a mutualist through
  trophallaxis (same claim also appeared in the first web batch's reference list).
- `10.7892/boris.82563`: a title describing hit-and-run trophallaxis in small hive
  beetles; not a candidate for ant colony tests.

The remaining titles described topics, detection datasets, or imaging methods;
they did not disclose measured directions. The title of a methods dataset is
not evidence that its method works. This inventory will be extended for any
further outcome-bearing titles.

## Subsequent projected catalogue/bibliographic titles

`results/title-inventory.json` preserves a conservative inventory of every
DOI/title pair supplied by the saved metadata snapshots, including all
non-candidates and versions. Treat any outcome-bearing title in that inventory
as exposed; do not limit the contamination entry to the shortlist. Abstract,
description, Methods, usage-note and file-content fields were never displayed
or saved by the helper. Some catalogue `title` arrays include long subtitles;
those are retained in the inventory as title-field exposure, not silently
represented as short article titles.

The closest ant-colony outcome claims added after the initial web batch were:

- Pasquier/Grüter (`10.5061/dryad.9j1cp`): a link between individual learning,
  exploratory activity and colony foraging success.
- Czaczkes/Heinze (`10.5061/dryad.mr73c`): pheromone deposition adjusts with
  environmental change and error probability.
- Czaczkes et al. (`10.5061/dryad.gb8h60p`): private information is prioritised
  over social information in the study's context.
- Kay et al. (`10.5061/dryad.dfn2z358r` and `10.1098/rspb.2024.0898`): social
  network structure is conserved across species.
- Pinter-Wollman (`10.5281/zenodo.8132463`): interaction types differ in their
  impact on foraging decisions.
- Pinter-Wollman (`10.5061/dryad.35rt2`): nest architecture shapes collective
  behaviour.
- Vaes (`10.5281/zenodo.7310287` and later versions): an impact of in-nest
  activity on food recruitment is named, without direction or magnitude.
- Bles et al. (`10.5061/dryad.r29th82`): robustness of trophallactic-network
  food dissemination to resource quality.

Other ant-relevant title disclosures included infection-linked gene-expression
and foraging changes, urban stressor effects on foraging/growth, increased
bioturbation with warming, three division-of-labour proteomes, increased network
centrality after immune challenge, and links between nest architecture and
foraging. The title inventory also includes taxonomic, ecological and other
organism findings from noisy catalogue searches. No such title was taken as
evidence to modify the model, choose a parameter, or assign a data role.

## Procedural and technical disclosure

- The first search call and first projected DataCite call preceded invocation
  of `plied skill` in this chat. `plied review T037` had been read, but no
  action disposition was recorded then. After the user invoked the skill and
  explicitly allowed the two B016 review dispositions, P73/P74 were reviewed
  as **acting** for `fetch:b016-metadata-survey-1a3f128b`; that gate passed
  before the subsequent catalogue survey. This is not a retroactive gate.
- The initial sandbox API request failed DNS resolution; it was retried with
  approved network access. Mendeley's public metadata endpoint later returned
  HTTP 403. No authentication or access-control workaround was attempted.
- `npm run runs` displayed run-state metadata, with no running jobs; it returned
  exit 1 while listing historical failures. No biological run log was read.
- The user authorized only the two plied dispositions, not edits to
  `docs/contamination/`, findings or STATUS. Those authoritative follow-ups
  remain with the lead, and P74 is not marked fulfilled here.
