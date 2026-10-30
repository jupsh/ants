---
id: P02
title: Water-init warm-up shortcut rechecked when walk-on rates change
wording: >-
  is accepted as a warm-up shortcut with explicit provenance, **provided the original and revised
  starts converge to the same late-window behaviour** (else it could hide slow adjustment),
  rechecked if walk-on rates or water parameters change
summary: >-
  Due: C1 and C2 changed walk-on rates (C2 drive SD 1.99 / 1.94, D080) and no later recheck was
  found. Covers every Stroeymeyt colony run (colonyStroeymeyt.ts: C1, C2, synchrony Parts B-D, the
  S2 audit base), not step 5 (D094).
made: A003
state: open
nodes: [T015, T033]
links: [S001, D080, D094, D160, D163]
reviews:
  - action: run:q03-recheck-20261025
    disposition: acting
    because: >-
      This run is the recheck P02 asks for: original vs revised starts at C2 base (walk-on rates
      changed since A003), late window 14-20 h, frozen in D162 before any run.
    by: lead (session 421f3ea4)
    at: "2026-10-25 16:54 UTC"
  - action: run:partd-bench-20261026
    disposition: not-applicable
    because: >-
      Timing only (D168): no output is read, so no late-window behaviour is relied on. The members'
      walk-on changes are by design; P54 already bars reading the recheck as convergence for them.
    by: lead (session 0cf57b71)
    at: "2026-10-26 01:31 UTC"
  - action: rent:partd2a-20261026
    disposition: not-applicable
    because: >-
      Renting changes no walk-on or water parameter; the Stage 2a members' walk-on changes are their
      mechanisms (P54 limits the recheck's reach).
    by: lead (session 0cf57b71)
    at: "2026-10-26 03:38 UTC"
  - action: rent:partd2a-20261026-d172
    disposition: not-applicable
    because: >-
      Renting changes no walk-on or water parameter; the Stage 2a members' walk-on changes are their
      mechanisms (P54 limits the recheck's reach).
    by: lead (session d6df3027)
    at: "2026-10-26 16:07 UTC"
  - action: rent:partd2a-20261026-56637446
    disposition: not-applicable
    because: >-
      Renting changes no walk-on or water parameter; the Stage 2a members' walk-on changes are their
      mechanisms (P54 limits the recheck's reach).
    by: lead (session d6df3027)
    at: "2026-10-26 16:14 UTC"
  - action: run:partd2a
    disposition: satisfied
    because: >-
      D163: the recheck at C2 base passed and Stage 2a is no longer held by it. Its scope (P54, P49)
      excludes convergence for any new mechanism: the members' walk-on modulation is their design,
      not a change of base rates, and the 2a reading states that the shortcut is unrechecked for
      them.
    by: lead (session d6df3027)
    at: "2026-10-26 16:16 UTC"
  - action: rent:partd2b-20261029
    disposition: satisfied
    because: >-
      As at run:partd2a: D163's C2-base recheck holds; the members' walk-on modulation is their
      design, not a change of base rates; D173 discloses the shortcut as unrechecked for members,
      carried into this reading.
    by: lead (session 20261029)
    at: "2026-10-29 05:37 UTC"
  - action: run:partd2b-20261029
    disposition: satisfied
    because: >-
      Same start as every Part D run; D163's C2-base recheck holds and D173 discloses the shortcut
      as unrechecked for members; carried into the 2b and capability readings.
    by: lead (session 20261029)
    at: "2026-10-29 05:44 UTC"
  - action: rent:partd2b-switch-20261029
    disposition: satisfied
    because: >-
      Same runs and start as run:partd2b-20261029 (D179): nothing changes but the box and its disk;
      the members' warm-up remains disclosed as unrechecked.
    by: lead (session 20261029)
    at: "2026-10-29 14:49 UTC"
  - action: commit:20261029
    disposition: satisfied
    because: >-
      The commit changes no walk-on or water parameter; D163's C2-base recheck holds and the
      members' warm-up stays disclosed as unrechecked (D173, D184).
    by: lead (session 20261029)
    at: "2026-10-29 21:23 UTC"
  - action: run:partd2-capfiles
    disposition: not-applicable
    because: "capfiles simulates nothing: it runs the frozen S2 and S3 audits on the fetched capability outputs."
    by: lead (session 20261029)
    at: "2026-10-29 21:47 UTC"
  - action: run:partd2b-read
    disposition: satisfied
    because: >-
      The reading carries D163's C2-base scope and the members' unrechecked warm-up as a disclosure
      (D185).
    by: lead (session 20261029)
    at: "2026-10-29 22:36 UTC"
---
Draft label: P2 (docs/threads-draft.md revision 2).

## History
- 2026-10-24 22:11 UTC lead (session 104e7640): created — migrated from docs/threads-draft.md revision 2 (D142)
- 2026-10-24 22:11 UTC lead (session 104e7640): set nodes=["T015"] — attached to its nodes (D142)
- 2026-10-25 00:31 UTC lead (session 7c2d50fd): D144 (T049 scan review) cites this record's links; reviewed, nothing here changes (the cited promises are covered or discharged as D144 lists)
- 2026-10-25 03:03 UTC lead (session 0bcdd30b): reviewed D145: it keeps P02 open and unwaived; the S2 audit discloses it as a limitation of the base comparison (P35). No change.
- 2026-10-25 03:11 UTC lead (session 0bcdd30b): reviewed D147: P02 stays disclosed and unwaived (P35). No change.
- 2026-10-25 03:57 UTC lead (session 0bcdd30b): reviewed D154: P02 stays unwaived and disclosed in the audit reading (P35). No change.
- 2026-10-25 04:03 UTC lead (session 0bcdd30b): reviewed D156: disclosed as an unwaived limitation of the S2 audit's base comparison. Still due; no change.
- 2026-10-25 04:14 UTC lead (session 0bcdd30b): reviewed D158: it proposes that Q03 (this recheck) be decided before Stage 2a, because every redesign member shares the water-init start. P02 stays due.
- 2026-10-25 04:20 UTC lead (session 0bcdd30b): reviewed D159: Q03 is answered 'recheck, not waive' (item 4); T015 is now open to design and run the recheck at C2 settings before Stage 2a. P02 stays due until that reading.
- 2026-10-25 04:22 UTC lead (session 0bcdd30b): added D160 to links — D160 is the proposed recheck: original vs revised starts at C2 settings, 22 colonies, paired seeds, late window 14-20 h
- 2026-10-25 16:45 UTC lead (session 421f3ea4): reviewed D161: it approves D160 as amended, so the recheck P02 asks for is now designed; P02 stays due until the recheck is read (T015). It also corrects D160's account of A003's multi-seed check, which P02's made record holds.
- 2026-10-25 16:54 UTC lead (session 421f3ea4): review for run:q03-recheck-20261025: acting — This run is the recheck P02 asks for: original vs revised starts at C2 base (walk-on rates changed since A003), late window 14-20 h, frozen in D162 before any run.
- 2026-10-25 18:11 UTC lead (session fe835760): set state=open; added T033 to nodes; added D163 to links — the due recheck at C2 settings is done and passes within P54's scope (D163); the standing condition (recheck if walk-on rates or water parameters change) stays open, attached to T033 where the next Stroeymeyt runs are
- 2026-10-25 18:24 UTC lead (session fe835760): reviewed D164: the build changes no walk-on rate or water parameter at base (base and every Part C kind bit-identical to HEAD), so no new recheck is due.
- 2026-10-26 01:19 UTC lead (session 0cf57b71): reviewed D165: it accepts D163's recheck within P54 and changes no walk-on rate or water parameter; P02's standing condition is untouched.
- 2026-10-26 01:31 UTC lead (session 0cf57b71): review for run:partd-bench-20261026: not-applicable — Timing only (D168): no output is read, so no late-window behaviour is relied on. The members' walk-on changes are by design; P54 already bars reading the recheck as convergence for them.
- 2026-10-26 03:36 UTC lead (session 0cf57b71): reviewed D170/D171: no walk-on or water parameter change; the members' walk-on changes are their mechanisms. Standing condition unchanged.
- 2026-10-26 03:38 UTC lead (session 0cf57b71): review for rent:partd2a-20261026: not-applicable — Renting changes no walk-on or water parameter; the Stage 2a members' walk-on changes are their mechanisms (P54 limits the recheck's reach).
- 2026-10-26 16:07 UTC lead (session d6df3027): review for rent:partd2a-20261026-d172: not-applicable — Renting changes no walk-on or water parameter; the Stage 2a members' walk-on changes are their mechanisms (P54 limits the recheck's reach).
- 2026-10-26 16:14 UTC lead (session d6df3027): review for rent:partd2a-20261026-56637446: not-applicable — Renting changes no walk-on or water parameter; the Stage 2a members' walk-on changes are their mechanisms (P54 limits the recheck's reach).
- 2026-10-26 16:16 UTC lead (session d6df3027): review for run:partd2a: satisfied — D163: the recheck at C2 base passed and Stage 2a is no longer held by it. Its scope (P54, P49) excludes convergence for any new mechanism: the members' walk-on modulation is their design, not a change of base rates, and the 2a reading states that the shortcut is unrechecked for them.
- 2026-10-29 01:26 UTC lead (session 20261029): reviewed D173 (and D175 via T033): D173 discloses that the warm-up shortcut is rechecked only at C2 base (D163), not for any calibrated member, and carries that into Stage 2b and any commit; D175 changes no warm-up. The condition stays open and unmet for the members.
- 2026-10-29 05:27 UTC lead (session 20261029): reviewed D176: the capability runs use C2's same water-init start and warm-up as every member; no warm-up recheck is added, so the condition stays unmet for members and carried as disclosed (D173).
- 2026-10-29 05:32 UTC lead (session 20261029): reviewed D177: it confirms counting and colony rules of the capability reader; no warm-up change. Unaffected.
- 2026-10-29 05:34 UTC lead (session 20261029): reviewed D178: Part B governs row support and MC precision, not the warm-up. Unaffected; the members' unrechecked warm-up is still disclosed.
- 2026-10-29 05:37 UTC lead (session 20261029): review for rent:partd2b-20261029: satisfied — As at run:partd2a: D163's C2-base recheck holds; the members' walk-on modulation is their design, not a change of base rates; D173 discloses the shortcut as unrechecked for members, carried into this reading.
- 2026-10-29 05:44 UTC lead (session 20261029): review for run:partd2b-20261029: satisfied — Same start as every Part D run; D163's C2-base recheck holds and D173 discloses the shortcut as unrechecked for members; carried into the 2b and capability readings.
- 2026-10-29 14:49 UTC lead (session 20261029): review for rent:partd2b-switch-20261029: satisfied — Same runs and start as run:partd2b-20261029 (D179): nothing changes but the box and its disk; the members' warm-up remains disclosed as unrechecked.
- 2026-10-29 20:08 UTC lead (session 7f762276): reviewed D181: it cites D094 only for step 5 being fitted and judged on L0S1c (Q04); P02 covers Stroeymeyt colony runs, not step 5 or the L0S1 judge (T057), so it is unaffected
- 2026-10-29 21:23 UTC lead (session 20261029): review for commit:20261029: satisfied — The commit changes no walk-on or water parameter; D163's C2-base recheck holds and the members' warm-up stays disclosed as unrechecked (D173, D184).
- 2026-10-29 21:47 UTC lead (session 20261029): review for run:partd2-capfiles: not-applicable — capfiles simulates nothing: it runs the frozen S2 and S3 audits on the fetched capability outputs.
- 2026-10-29 22:36 UTC lead (session 20261029): review for run:partd2b-read: satisfied — The reading carries D163's C2-base scope and the members' unrechecked warm-up as a disclosure (D185).
- 2026-10-30 04:45 UTC lead (session 9aa22476): reviewed D191: it cites D094 only for the step-5 design. P02 covers Stroeymeyt colony runs, not step 5 (its summary), and the T057 judge changes only E2 layer forager/phys parameters, not walk-on rates or water parameters of those runs; unaffected
- 2026-10-30 05:35 UTC lead (session 9d2b15e6): reviewed D194: it cites D163 only to disclose that the Q03 recheck covered C2 base, not the members; no walk-on or water parameter changed, so the recheck condition is not triggered. Stays open.
