/** Render B016's desk survey from explicitly filtered catalogue snapshots. No network or simulations. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stamp } from '../_lib/stamp';

const ITEM = path.dirname(fileURLToPath(import.meta.url));
const metadataDir = path.join(ITEM, 'metadata');
const resultsDir = path.join(ITEM, 'results');
const metadata = Object.fromEntries(fs.readdirSync(metadataDir).filter(n => n.endsWith('.json'))
  .sort().map(n => [n, JSON.parse(fs.readFileSync(path.join(metadataDir, n), 'utf8'))]));

const candidates = [
  {
    id: 'C01', label: 'Pasquier & Grüter 2016 — colony foraging', doi: '10.5061/dryad.9j1cp',
    article: '10.1093/beheco/arw079', source: 'pasquier-files.json',
    species: 'Lasius niger (repository keyword)',
    lab: 'University of Lausanne; Pasquier and Grüter. Same institution as a calibration source; metadata does not establish a separate lab or independent colonies.',
    variables: 'Title identifies individual learning, exploratory activity and colony foraging success. Workbook schema, recruitment time series, contacts and food-transfer variables are unverified.',
    relevance: 'Same-species colony-foraging candidate; a narrower prospective test than joint in-nest food sharing/contact validation.',
    exposure: 'Outcome-bearing title only: association between individual traits and colony foraging. No effect sizes or data values inspected.',
    licence: 'CC0-1.0', status: 'follow-up candidate',
    next: 'Confirm workbook variables, apparatus, colony independence and possible laboratory overlap using only separately authorized descriptor/Methods sections.',
  },
  {
    id: 'C02', label: 'Czaczkes & Heinze 2015 — trail deposition', doi: '10.5061/dryad.mr73c',
    article: '10.1098/rspb.2015.0679', source: 'pheromone-files.json',
    species: 'Lasius niger (repository keyword)',
    lab: 'University of Regensburg, Czaczkes and Heinze; a different listed institution from the ULB/Lausanne calibration sources. Colony/data independence is not established by affiliation.',
    variables: 'Title and keywords identify pheromone deposition, changing environment, errors and memory. A raw-data workbook is catalogued; units and row schema are unknown.',
    relevance: 'Same-species trail/recruitment-component candidate. Suitability for the current model requires a later scope decision; it is not an in-nest trophallaxis dataset.',
    exposure: 'Outcome-bearing title only: deposition adjusts with environment/error probability. No measured direction, magnitude or data values inspected beyond that wording.',
    licence: 'CC0-1.0', status: 'follow-up candidate',
    next: 'Check whether its recorded variables map to a prediction of the frozen model, without using the study to add or tune a mechanism.',
  },
  {
    id: 'C03', label: 'Baltiansky et al. 2021 — fluorescence and trophallaxis', doi: '10.5061/dryad.j9kd51cc7',
    article: '10.1111/2041-210x.13646', source: 'baltiansky-files.json',
    species: 'Unknown in the permitted structured metadata; do not infer a species from other papers by this team.',
    lab: 'Weizmann Institute of Science. Greenwald and Feinerman overlap the already-read 2015 structure/parameter source X016; possible experiment/data reuse must be checked.',
    variables: 'Method title identifies dual-fluorescence imaging and trophallaxis detection. Archive names identify a multinutrient sample experiment and detection material; quantitative schema and complete colony replication are unknown.',
    relevance: 'Closest food-exchange lead in this shortlist, with a sample-data/completeness caveat and unresolved species.',
    exposure: 'No biological result seen in the projected metadata. The methods title is not evidence of detection accuracy. Existing X016 exposure concerns a different paper; independence remains unverified.',
    licence: 'CC0-1.0 for the Dryad dataset; the article has a separate licence', status: 'follow-up candidate',
    next: 'Establish species, schema, whether this is a complete experiment or only a method sample, and overlap with X016 before considering a role.',
  },
  {
    id: 'C04', label: 'Pinter-Wollman 2023 — interactions and foraging decisions', doi: '10.5281/zenodo.8132463',
    article: null, source: 'foraging-interactions.json',
    species: 'Unknown in the permitted structured metadata; not inferred from the author or file labels.',
    lab: 'UCLA, Noa Pinter-Wollman; different listed institution from the ULB/Lausanne calibration sources. Data provenance still needs confirmation.',
    variables: 'Eight interaction-labelled CSVs, an R analysis script and a Word readme are catalogued. The title identifies foraging decisions; event definitions, temporal resolution and decision columns are unknown.',
    relevance: 'Direct contact/foraging candidate, conditional on species, apparatus and variable definitions.',
    exposure: 'Outcome-bearing title only: social interactions have differing impacts on foraging decisions. No data values or effect sizes inspected.',
    licence: 'CC-BY-4.0', status: 'follow-up candidate',
    next: 'Confirm species, provenance and which CSV fields record contacts, timing and foraging decisions. Concept-record request resolved to version DOI 8132463; use that version.',
  },
  {
    id: 'C05', label: 'Pinter-Wollman 2015 — nest architecture and recruitment', doi: '10.5061/dryad.35rt2',
    article: '10.1098/rsbl.2015.0695', source: 'nest-architecture.json',
    species: 'Veromessor andrei (repository keyword)',
    lab: 'Noa Pinter-Wollman; this Dryad record supplies no affiliation. Do not transfer the 2023 affiliation to 2015 as a historical fact.',
    variables: 'One CSV named Architecture and recruitment data.csv. Title and keywords identify nest architecture, recruitment/foraging and network theory; schema and replication are unknown.',
    relevance: 'Other-genus recruitment/architecture lead. It could support a later transfer study; it does not directly validate M1 Lasius niger.',
    exposure: 'Outcome-bearing title only: nest architecture shapes collective behaviour. No numerical outcomes inspected.',
    licence: 'CC0-1.0', status: 'follow-up candidate with species mismatch',
    next: 'Determine whether the small table contains a usable prospective observable and whether the apparatus can be represented without model revision.',
  },
  {
    id: 'C06', label: 'Kay et al. 2024 — social/contact networks', doi: '10.5061/dryad.dfn2z358r',
    article: '10.1098/rspb.2024.0898', source: 'kay-files.json',
    species: 'Full names unknown in the permitted metadata. File labels are cfel, drug, ipur, pbar and rmet; these are not treated as verified taxonomic names.',
    lab: 'Lausanne/Bristol/Rockefeller affiliations. Article author metadata explicitly includes Richardson, Stroeymeyt and Keller, overlapping the in-nest calibration-source team.',
    variables: '152 CSV/Markdown files; name families include edgelist, forage, interaction, md, nest and randMod. Five labels with numbered files are visible, but independence and replication cannot be inferred from filenames.',
    relevance: 'Substantial contact-network reserve, not a confirmed independent-lab test. Source overlap and title exposure must remain explicit.',
    exposure: 'Outcome-bearing dataset/article titles: conservation of social-network structure across species. No network values, effects or file contents inspected.',
    licence: 'CC0-1.0 for the dataset', status: 'reserve — calibration-source overlap',
    next: 'Confirm species and whether any source colonies/recordings overlap Stroeymeyt calibration or held-out material, before even authorizing file access.',
  },
  {
    id: 'C07', label: 'Vaes 2022/2024 — activity and food recruitment', doi: '10.5281/zenodo.7310287',
    article: null, source: 'vaes-files.json',
    species: 'Unknown in structured metadata; ant is the only taxon keyword.',
    lab: 'Université libre de Bruxelles, Oscar Vaes. Institution overlaps the Mailleux/Buffin calibration-source network; separate lab/colonies unverified.',
    variables: 'One Excel workbook. Title/keywords identify in-nest activity, individual performance and food recruitment. Data schema and colony replication unknown.',
    relevance: 'Topically close reserve with unverified species/provenance and source-institution overlap.',
    exposure: 'Title names an impact of in-nest activity on food recruitment without a direction or numerical result. No workbook contents inspected.',
    licence: 'CC-BY-4.0', status: 'reserve — source-institution overlap',
    next: 'Resolve version and provenance first: concept DOI 7310286 also has 2024 versions 11031825/11068070; one catalogue version lists Anonymous. Do not silently mix versions.',
  },
  {
    id: 'C08', label: 'Kushnir 2026 — trophallaxis detection', doi: '10.17632/4scn23hcgj.1',
    article: null, source: 'kushnir.json',
    species: 'Camponotus fellah (dataset title)',
    lab: 'Dmytro Kushnir; affiliation not supplied in the DataCite record.',
    variables: 'A trophallaxis detection dataset is catalogued. File formats, size, annotations, independent experiments and time-series coverage remain unknown.',
    relevance: 'Other-genus detection reserve, potentially observer-related; not established as a colony-model test.',
    exposure: 'No biological result seen in its title or structured metadata.',
    licence: 'CC-BY-4.0; open-access flag in DataCite', status: 'reserve — file inventory unavailable',
    next: 'Direct Mendeley metadata request returned HTTP 403. Obtain a permitted catalogue descriptor before considering file access; no workaround attempted.',
  },
];

const exclusions = [
  { doi: '10.5281/zenodo.6396637', reason: 'Bles et al. 2022, the existing E6 development benchmark; not a new independent held-out source (STATUS, X006).' },
  { doi: '10.5061/dryad.1f24f', reason: 'Lasius path-geometry study by Bles/Boehly/Deneubourg/Nicolis; source-team overlap and a search-exposed preference. Retained in metadata only, not promoted as an independent-lab candidate.' },
  { doi: '10.5061/dryad.r29th82', reason: 'Bles/Deneubourg/Nicolis food-dissemination study from ULB; source-team overlap, title exposure and unresolved relationship to E6. No file opened.' },
  { doi: '10.5061/dryad.gb8h60p', reason: 'Same Regensburg team as C02, but a narrower information-choice study; keep as a backup, not a separate priority. Title exposes prioritisation of private over social information. Catalogue repeats each of three filenames with copied/created entries; reported storage double-counts those name entries.' },
];

const titleMap = new Map<string, { doi: string; title: string; snapshots: string[] }>();
for (const [name, snapshot] of Object.entries(metadata)) {
  for (const row of snapshot.records ?? []) {
    for (const title of row.titles ?? []) {
      const key = `${row.doi}\0${title.title}`;
      const entry = titleMap.get(key) ?? { doi: row.doi, title: title.title, snapshots: [] };
      entry.snapshots.push(name);
      titleMap.set(key, entry);
    }
  }
  const record = snapshot.record;
  if (record) {
    const doi = record.DOI ?? record.doi ?? record.identifier?.replace(/^doi:/, '');
    const titles = Array.isArray(record.title) ? record.title : [record.title];
    for (const title of titles.filter(Boolean)) {
      const key = `${doi ?? name}\0${title}`;
      const entry = titleMap.get(key) ?? { doi: doi ?? name, title, snapshots: [] };
      entry.snapshots.push(name);
      titleMap.set(key, entry);
    }
  }
}
const titles = [...titleMap.values()].sort((a, b) => a.doi.localeCompare(b.doi));
const provenance = stamp(ITEM);
fs.mkdirSync(resultsDir, { recursive: true });
const write = (name: string, value: unknown) => fs.writeFileSync(path.join(resultsDir, name), JSON.stringify(value, null, 2) + '\n');

const enriched = candidates.map(candidate => {
  const source = metadata[candidate.source];
  const files = source.file_metadata ?? [];
  return { ...candidate, availability: files.length ? 'Public catalogue/file inventory retrieved; file-content access untested.' : 'DOI metadata retrieved; direct provider request failed HTTP 403; file access untested.',
    file_metadata: files, catalogue_storage_bytes: source.record?.storageSize ?? null,
    inventory_bytes: files.length ? files.reduce((sum: number, file: { size?: number }) => sum + (file.size ?? 0), 0) : null,
    metadata_url: source.url, retrieved_at: source.retrieved_at };
});

write('survey.json', { provenance, scope: 'Bounded metadata-only candidate survey; no roles assigned, no paper/data contents opened, no simulation or biological comparison.',
  conclusion: 'No new independent-lab Lasius niger dataset jointly covering food sharing, recruitment and contacts has been confirmed under this access scope. This is a limit of the survey, not evidence that such data do not exist.',
  coverage: 'All 188 DataCite records in the Lasius title/subject query; targeted trophallaxis, recruitment and interaction searches; selected Dryad/Zenodo inventories and Crossref author metadata. Several broader searches returned only their first page. DOI versions and unrelated taxonomy records are not independent experiments.',
  candidates: enriched, exclusions, source_snapshots: Object.keys(metadata),
  lead_action: 'Enter exposure-handoff.md and title-inventory.json in docs/contamination/; assess source/data reuse and eligibility. T037 closure and P73/P74 resolution remain with the lead.',
});
write('title-inventory.json', { provenance,
  caution: 'Conservative inventory of every projected catalogue/bibliographic title made available in this survey, including non-candidates and duplicate versions. Some titles assert outcomes. No biological measurements, abstracts, descriptions or file contents are included. Initial web-search excerpts are separately inventoried in ../exposure-handoff.md.',
  titles });

const esc = (text: string) => text.replaceAll('|', '\\|').replaceAll('\n', ' ');
const lines = [
  '# B016 — candidate dataset shortlist', '',
  'No new independent-lab **Lasius niger** dataset jointly covering food sharing, recruitment and contacts was confirmed within the permitted metadata. This bounded survey does not show that no such dataset exists. No candidate has been assigned a role or approved for access.', '',
  'Eight candidates are retained: five for possible follow-up and three reserves. Species, schemas and provenance stay unknown where the permitted metadata do not supply them. An outcome-bearing title is an exposure, even without numerical results.', '',
  '| ID | Candidate and species | Recorded material; format and size | Licence | Main qualification |',
  '| --- | --- | --- | --- | --- |',
];
for (const c of enriched) {
  const types = [...new Set(c.file_metadata.map((f: { path?: string; key?: string }) => path.extname(f.path ?? f.key ?? '').toLowerCase()))];
  const size = c.inventory_bytes === null ? 'format/size unknown' : `${c.file_metadata.length} files, ${types.join('/')}; ${c.inventory_bytes.toLocaleString('en-US')} bytes`;
  lines.push(`| ${c.id} | [${esc(c.label)}](https://doi.org/${c.doi}); ${esc(c.species)} | ${esc(size)} | ${esc(c.licence)} | ${esc(c.status)} |`);
}
lines.push('', '## What each candidate could add', '');
for (const c of enriched) {
  lines.push(`### ${c.id} — ${c.label}`, '',
    `Dataset: [${c.doi}](https://doi.org/${c.doi})${c.article ? `; article citation: [${c.article}](https://doi.org/${c.article})` : '; linked article DOI not established in permitted metadata'}.`, '',
    `**Species:** ${c.species}`, '', `**Lab/provenance:** ${c.lab}`, '',
    `**Recorded variables/material:** ${c.variables}`, '', `**Potential use:** ${c.relevance}`, '',
    `**Exposure:** ${c.exposure}`, '', `**Remaining question:** ${c.next}`, '');
}
lines.push('## Sources kept out of the priority list', '');
for (const e of exclusions) lines.push(`- [${e.doi}](https://doi.org/${e.doi}): ${e.reason}`);
lines.push('', '## Availability, sizes and limits', '',
  'File counts and byte sizes come from repository inventories, never from downloaded data. The complete paginated C06 inventory has 152 entries and sums exactly to the repository storage size. Dryad/DataCite storage totals differ for C01 and C03; the current provider inventory is used here, with the older catalogue values preserved in snapshots. C08 has no verified file inventory. A catalogue open-access label is not a tested file download.', '',
  'The full Lasius title/subject query returned 188 records across four pages, including versions, taxonomy, morphology, molecular data and non-ant homonyms. Targeted searches added other-genera food/contact leads. Broader contact/author/in-nest searches were first-page discovery only; this is not an exhaustive systematic review. Repository schemas were not checked, so topic titles and filenames are identified as such rather than treated as validated observables.', '',
  '## Suggested next decision', '',
  'For a same-species follow-up, start with C01 for colony foraging or C02 for trail deposition. For food exchange, C03 is the closest lead but needs species, sample completeness and reuse checks. C04 is a contact/foraging lead with species still unknown. Any descriptor/Methods clearance, data-role assignment, prospective test design or data access is a later user decision; none is implied by this list.', '',
  'The lead needs to enter [the exposure handoff](../exposure-handoff.md) and [the complete title inventory](title-inventory.json) in the contamination record. P73/P74 have acting reviews for this fetch action, not a declaration that all obligations are fulfilled. T037 and authoritative records are left to the lead.', '',
  '## Provenance', '', 'Generated without network access or simulations by `npx vite-node backlog/B016-candidate-held-out-colony-data-sets/survey.ts` from the filtered metadata snapshots. The same `stamp(ITEM)` is included in both machine-readable results.', '',
  '```json', JSON.stringify({ provenance }, null, 2), '```', '');
fs.writeFileSync(path.join(resultsDir, 'shortlist.md'), lines.join('\n'));
console.log(`${candidates.length} candidates; ${exclusions.length} exclusions/backups; ${titles.length} unique DOI/title pairs; ${Object.keys(metadata).length} filtered snapshots`);
