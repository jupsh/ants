# B011: flow bouts and mouth contact in the provisional spatial colony

The physical extension of flow-associated mouth contact is small at the tested
defaults: mean **0.01365 s**, maximum **0.2 s**, over 630 simulated bouts in three
colonies. It is below the 60-s scan period in every measured bout. One of 60 paired
colony/scan-phase comparisons nevertheless gains one observed event, moving two
ants' event counts by one bin. Small timing differences can cross a scan boundary.

Evidence: [stamped summary and per-phase distributions](summary.json). Detailed
per-bout/per-phase output is local in `../out/colony-{0,1,2}.json`; the summary
retains each source's provenance and SHA-256. All results refer to simHash
`eb48ce968127e6a8`, commit `f9ad78fb7af8b397eb2bb8a4040f70d429cf98e2`.

## Definitions and the measurement

- **Positive-flow bout:** `ColonySim.step` records a directed interval only while
  mutually agreeing partners transfer `ul > 0`. Adjacent positive steps merge;
  a step without transfer closes the interval. `ColonySim.result().contacts`
  converts these flow bouts to seconds since food introduction. It does not
  independently record mouth-contact onset or separation
  ([colonyBles.ts](../../../src/sim/experiments/colonyBles.ts), sharing loop and `result`).
- **Geometric mouth contact:** the existing `mouthContact(a,b)` predicate requires
  head points, each 0.4 body lengths ahead of the centre, to be within 0.3 times
  the smaller body length, with `cos(heading_a - heading_b) < -0.5`
  ([contacts.ts](../../../src/sim/physics/contacts.ts)). This is the model's
  provisional geometric proxy, without validation against video mandibles.
- **Experimental definition already recorded locally:** the permitted
  [specification, section 3](../../../docs/research/bles-tec-spec.md) says mandible
  contact lasting >5 s, sampled once a minute, with direction read from posture
  and consecutive scans of the same pair merged. No new paper or data was opened.
- **Implemented observer:** `observeContacts`, default `rule='after'`, records an
  interval if it is in progress at a scan and continues **strictly more than 5 s**
  after it. The interval must also be >5 s in total. There are 61 scans, period
  60 s, with a phase in [0,60); `scansToEvents` merges consecutive-minute scans of
  a directed pair ([trophallaxis.ts](../../../src/sim/analysis/trophallaxis.ts)).
  This audit keeps that rule fixed.

After each simulation step, the recorder samples every living in-nest pair's
mouth geometry and records uninterrupted episodes, with no gap merging. A
positive endpoint sample represents `[t,t+dt)`, giving endpoints resolution
dt = 0.1 s. Each flow bout is matched to one enclosing mouth episode. Per bout,
the extra duration is `(flow start - mouth start) + (mouth end - flow end)`.

The directed colony comparison uses each enclosing mouth episode once. Direction
must be unique among its positive-flow bouts; reversing episodes, unmatched bouts,
and mouth episodes without flow are counted explicitly. This avoids inventing
donor identities from proximity or counting a mouth episode repeatedly. In these
runs every flow bout had a distinct enclosing episode, with no reversal, missing
match, or censoring at either run boundary.

## Set-up and reading fixed before the runs

The item's Progress log records the analysis and its interpretation before
simulation. The existing provisional spatial colony uses `LASIUS_PARAMS` +
`LASIUS_NEST`, the Bles apparatus, 53 workers, 4-d starvation, 22 C and food at
minute 30. Simulation is serial at dt = 0.1 s, with 30 min before food and 60 min
after it, plus a 65-s guard. The guard covers the random-phase final scan and
its >5-s continuation check. Reported raw bouts include that guard. No parameter
is fitted, selected, or changed.

Diagnostic seeds are `seedFor(11011, 'diag', index)`: 3452263190, 3369865956 and
1568448732. Twenty diagnostic phases per colony use `RNG.stream(seed, 0x0b5, i)`;
the same phase is applied to both interval sets. Phases reuse the same colony:
60 phase comparisons are **three** colony replicates. Summaries are descriptive,
without an independence assumption or a population equivalence claim.

## Results

| Diagnostic index | Flow bouts | Mean extra contact (s) | Maximum (s) | Phases with a changed event count / 20 |
|---|---:|---:|---:|---:|
| 0 | 278 | 0.01475 | 0.2 | 0 |
| 1 | 166 | 0.01265 | 0.2 | 1 |
| 2 | 186 | 0.01290 | 0.2 | 0 |
| Pooled bouts | 630 | 0.01365 | 0.2 | 1 / 60 |

Extra-duration distribution: **548 bouts at 0 s, 78 at 0.1 s, 4 at 0.2 s**.
The median is 0 s and the 95th percentile 0.1 s. Mean pre-flow and post-flow
contact are each 0.00683 s. Mean flow duration is 5.96492 s; mean enclosing mouth
duration is 5.97857 s. Both maxima are 38.5 s. Thus no observed event spans two
scan instants in these runs: the first-to-last scan span is 0 s throughout.

Of 12,600 bout/phase pairs, 12,599 have identical scan counts. One changes from
zero recorded scans to one. Its flow duration is 7.4 s, its mouth duration 7.5 s,
and the extra 0.1 s precedes flow. At phase 50.06761101074517 s, colony index 1
therefore changes from 7 to 8 events and 11 to 13 participants. Its non-forager
donor and receiver each move from 0 to 1 event; the other per-ant counts are
unchanged. T50 is unchanged in this case. All other phases have identical scans,
events, and per-ant histograms. No scan is lost by using the enclosing mouth
intervals.

The corresponding difference in **occupied scan bins** is 0 s for 12,599 pairs
and 60 s for one, mean 0.004762 s over bout/phase pairs. Here a bin is one recorded
scan multiplied by 60 s; it does not estimate an extra physical minute of contact.
The mean event-count difference over colony/phase pairs is +0.01667 event,
range 0 to +1.

There is **no duration histogram** in the current E6 metrics. Its four per-ant
histograms bin integer numbers of donation/receipt events, with bin width one
event (`e6Bles.ts`). The relevant comparison is therefore a change in event counts:
one non-forager donor bin and one non-forager receiver bin change in one phase.
No duration-bin width in seconds is invented for this check.

## Verdict and proposal for step 9

**Larger than a scan interval? No**, for physical contact minus flow duration
in this bounded sample. **Large enough to change an existing histogram bin? Yes,
occasionally:** one event-count bin per affected ant changes in one phase. The
observer's flow inputs are a measurement-definition mismatch even though its
measured timing effect here is small.

For step 9, propose a separate geometric contact recorder for identified
trophallactic partners, with onset/end independent of whether food is flowing,
and an explicit donor-direction rule through zero-flow intervals. Feed those
intervals through the existing scan and merge observer, preserving flow bouts
for food-transfer accounting. Freeze that definition and its checks before E6
judging. The present audit supplies a candidate rule and measurement; adoption
and the eventual candidate's check remain the user's decision.

There are also **84,437 mouth-geometry episodes without positive flow** after food
introduction. They are excluded from the directed comparison because geometry
supplies no donor identity. This audit cannot establish which would be scored as
experimental trophallaxis. It does not justify counting all geometric mouth
contacts. Its timing estimate applies to flow-associated contacts of these
provisional defaults; it does not transfer automatically to the future step-5
candidate, other time steps, or a different contact definition.

## Reproduction and checks

Run from the repository root:

```sh
nice -n 10 npx vite-node backlog/B011-e6-bout-end-vs-observed-contact/check.ts
nice -n 10 npx vite-node backlog/B011-e6-bout-end-vs-observed-contact/run.ts --index 0 --verify-recorder
nice -n 10 npx vite-node backlog/B011-e6-bout-end-vs-observed-contact/run.ts --index 1
nice -n 10 npx vite-node backlog/B011-e6-bout-end-vs-observed-contact/run.ts --index 2
nice -n 10 npx vite-node backlog/B011-e6-bout-end-vs-observed-contact/reduce.ts
node backlog/backlog.mjs check B011
```

The reducer preserves detailed source files in `out/` and refuses to overwrite
existing ones. For a repeat, use a separate copy of the item or archive the old
local detail files first. It verifies the source simulation/method hashes before
reducing; the small result has its own `stamp(ITEM)` and includes the control runs'
original stamps.

Deterministic controls passed for interval padding, episode deduplication,
strict threshold/scan boundaries, reversal, incomplete coverage, no-flow direction
ambiguity, identity, and event coalescing. A full paired repeat of colony 0 without
the recorder gave identical flow bouts, forager identities, body/mind state
(derived head-position caches excepted), and conserved totals. Recorded simulation
times were 29.2 / 44.6 / 42.2 s; total simulation work including the repeat was
145.4 s. The existing four E6 observer unit tests passed; seven other tests in
that file were skipped by the name filter. Project and standalone item TypeScript
checks passed. `backlog.mjs check B011` reports one current stamped result and
zero stale results; its dirty-tree annotation is expected from the active H6
records and this item's tracked documentation.

`npm run runs` found no active launched run; it exited 1 because its status table
includes historical failures. The audit used no long-run launcher. New full paper,
held-out, and sealed outputs were not inspected. The only literature-derived
content read was the item's permitted pre-existing local specification and source
comments/constants; no empirical data comparison was performed.

Final `plied check`: **0 errors, 54 warnings**, with no diagnostic naming B011 or
T043. The remaining warnings are 38 changed review-input pins, 15 stale-record
reviews and one possible unrecorded commitment. Their exact record identifiers
and reasons are preserved in [`../out/plied-final-check.json`](../out/plied-final-check.json).
They remain for the authorized lead: this agent may communicate through plied
but cannot edit or disposition its authoritative records. The initial check had
55 warnings. Formal baseline comparison was refused because the access policy
changed during this session (the lead added a T060 seal); that refusal is retained
in `../out/plied-baseline-comparison.json`. The final verdict is a fresh complete
check, without claiming a policy-comparable diagnostic delta.
