---
id: P148
title: "H6: symmetric coverage rules; unknown fractions reported by role, zone and context"
wording: >-
  Apply the same coverage requirements to onsets and the at-risk reference population. Report
  unknown fractions by role, zone and context.
made: D242
state: open
nodes: [T059]
reviews:
  - action: commit:h6-design-20261101
    disposition: not-triggered
    because: >-
      The commit records the T061 inventory (D240), the H6 design and its amendment (D241), the
      user's answers (D242), F108's update and plied records; no model change, analysis, run or
      reading of new results.
    by: lead (session f6ab21fd)
    at: "2026-11-01 22:46 UTC"
    inputs:
      - record: D242
        rev: 95cc70c9ace090981dbc595ffb10d18a35f19fdbcf8455a6bf43acf2b0db63fa
      - record: D241
        rev: 597483bc51a5737e117a90e3c044b57b707aa0098848143a71938914bc3ba4ca
      - record: D240
        rev: 5875f95982462051e5fa97516cc789db1066fed33cc94c549cb361b80746300d
  - action: run:h6-build-smoke
    disposition: acting
    because: >-
      The brief requires the build to implement D241 amendment 1 exactly on this point; checked
      against the report and the code.
    by: lead (session f6ab21fd)
    at: "2026-11-01 22:49 UTC"
    inputs:
      - record: D241
        rev: 2b609a47d2744c5c6281b681206c6f72784e3a354f9daaf856c669f9a08f92e5
      - record: D242
        rev: 95cc70c9ace090981dbc595ffb10d18a35f19fdbcf8455a6bf43acf2b0db63fa
  - action: run:h6-fixes-20261102
    disposition: acting
    because: >-
      The coverage rule, neighbour clause and 25 mm radius stay identical for onsets and the at-risk
      reference (brief task 1); null-3 eligibility is outside this wording's scope (D246); unknown
      fractions by role, zone and context kept
    by: lead (session 0e89af04)
    at: "2026-11-02 05:50 UTC"
    inputs:
      - record: D241
        rev: 36eec164deeba73a16dff9496b8751e4f5e97dac430d82b680322735d3dd2280
      - record: D246
        rev: 001ed95c860d0220280f7ed3039d6e65f66da0ef180bea2b9a596d153057b770
  - action: commit:h6-design-20261101
    disposition: not-triggered
    because: >-
      Re-read D241@36eec164deeb: since the 597483 bytes this review read (the bytes committed in
      f9ad78f), only two blocks were appended, the lead's implementation details (onset rule, 25 mm
      radius, S1 sampling, runs, queens) and amendment 2 (D246). The commit holds the version read,
      so this disposition for it stands; the additions are reviewed at the next commit's gate.
    by: lead (session 0e89af04)
    at: "2026-11-02 05:55 UTC"
    inputs:
      - record: D241
        rev: 36eec164deeba73a16dff9496b8751e4f5e97dac430d82b680322735d3dd2280
  - action: run:h6-build-smoke
    disposition: acting
    because: >-
      Re-read D241@36eec164deeb: since the 2b609a47 bytes this review read, the queen bullet was
      appended (already stated in the brief; T059 note 03:11) and amendment 2 (D246), written after
      this run finished and was read in D245. The run was done under the text it was gated on, so
      this disposition stands; amendment 2's changes are gated in run:h6-fixes-20261102. Amendment 2
      takes null-3 eligibility out of the coverage rule the smoke ran under; D245 reports that run's
      consequence.
    by: lead (session 0e89af04)
    at: "2026-11-02 05:55 UTC"
    inputs:
      - record: D241
        rev: 36eec164deeba73a16dff9496b8751e4f5e97dac430d82b680322735d3dd2280
  - action: run:h6-zoneflag-20261102
    disposition: acting
    because: >-
      The zone condition reads the same W 10 s unknown class (classOf) for onsets and at-risk rows,
      pooled, as D249 sets; the coverage rule is unchanged
    by: lead (session 0e89af04)
    at: "2026-11-02 15:30 UTC"
    inputs:
      - record: D249
        rev: 525baaca7a016fa0badfa175ef296e55e9d3392f4c939e4e18435ea895bbc323
  - action: run:h6-v1v4-20261102
    disposition: not-triggered
    because: >-
      The V cases score only scorePrimary (R̄ labels); the coverage classes are not read (checked in
      synth.ts and reader.ts)
    by: lead (session 0e89af04)
    at: "2026-11-02 15:30 UTC"
  - action: commit:h6-design-20261101
    disposition: not-triggered
    because: >-
      Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's
      cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed)
      (and, since the 597483/2b609a47 pins, the lead's implementation details and amendment 2,
      reviewed at 05:5x UTC). The commit holds the version first read (597483), so this disposition
      for it stands; the later text is reviewed at the next commit's gate.
    by: lead (session 0e89af04)
    at: "2026-11-02 15:34 UTC"
    inputs:
      - record: D241
        rev: 07a71b62d68a8e5fc8683b31f3075cc5bbfe0ceae9456ec136104339bfcbf2a9
  - action: run:h6-build-smoke
    disposition: acting
    because: >-
      Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's
      cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed)
      (and, since the 597483/2b609a47 pins, the lead's implementation details and amendment 2,
      reviewed at 05:5x UTC). The run finished before the change and was read in D245, under the
      text it was gated on; the disposition stands.
    by: lead (session 0e89af04)
    at: "2026-11-02 15:34 UTC"
    inputs:
      - record: D241
        rev: 07a71b62d68a8e5fc8683b31f3075cc5bbfe0ceae9456ec136104339bfcbf2a9
  - action: run:h6-fixes-20261102
    disposition: acting
    because: >-
      Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's
      cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed);
      D246@53e0c6fc0963: one dated line appended (D249 supersedes the lead's 50 %-pooled reading of
      'mostly unknown'). The fixes run finished and was checked (D250) before the change; the cutoff
      concerns only the blind check, which is gated separately (run:h6-zoneflag-20261102 and the
      check itself), so the disposition stands.
    by: lead (session 0e89af04)
    at: "2026-11-02 15:34 UTC"
    inputs:
      - record: D241
        rev: 07a71b62d68a8e5fc8683b31f3075cc5bbfe0ceae9456ec136104339bfcbf2a9
      - record: D246
        rev: 53e0c6fc09630ef9d1ab98946ed0443b11d4eef2da11c677c0a20b9459654ed2
  - action: run:h6-blindcheck-20261102
    disposition: acting
    because: >-
      The same W 10 s class for onsets and the at-risk reference, pooled; a pre-freeze check, not
      the unknown fractions the reading reports by role, zone and context
    by: lead (session 0e89af04)
    at: "2026-11-02 15:37 UTC"
  - action: run:h6-reach-20261102
    disposition: acting
    because: >-
      One reachability clause for onsets and the at-risk reference alike (brief task 3); unknown
      fractions still reported by role, zone and context
    by: lead (session 0e89af04)
    at: "2026-11-02 16:01 UTC"
    inputs:
      - record: D252
        rev: cdcd4ef34d7e07f74000b894ea6fbc1781c979d8b050b255fc37ebf55783d5f8
  - action: run:h6-blindcheck2-20261102
    disposition: acting
    because: >-
      One reachability clause for onsets and the reference (D255); a pooled pre-freeze check, not
      the reported unknown fractions
    by: lead (session 0e89af04)
    at: "2026-11-02 16:55 UTC"
  - action: commit:h6-design-20261101
    disposition: not-triggered
    because: >-
      Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and
      extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules
      or any amendment. The commit holds the version it was gated on; the later text is reviewed at
      the next commit's gate (commit:h6-freeze-20261102).
    by: lead (session eac59010)
    at: "2026-11-03 00:06 UTC"
    inputs:
      - record: D241
        rev: b1dd437cb8eb845458917e3f9ecf780f783e4ff2bbacbe3adccc128e70630f74
  - action: run:h6-build-smoke
    disposition: acting
    because: >-
      Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and
      extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules
      or any amendment. The run finished and was read before the change, under the text it was gated
      on; the disposition stands.
    by: lead (session eac59010)
    at: "2026-11-03 00:06 UTC"
    inputs:
      - record: D241
        rev: b1dd437cb8eb845458917e3f9ecf780f783e4ff2bbacbe3adccc128e70630f74
  - action: run:h6-fixes-20261102
    disposition: acting
    because: >-
      Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and
      extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules
      or any amendment. The run finished and was read before the change, under the text it was gated
      on; the disposition stands.
    by: lead (session eac59010)
    at: "2026-11-03 00:06 UTC"
    inputs:
      - record: D241
        rev: b1dd437cb8eb845458917e3f9ecf780f783e4ff2bbacbe3adccc128e70630f74
  - action: commit:h6-freeze-20261102
    disposition: satisfied
    because: >-
      The frozen extractor applies one coverage rule to onsets and S1's at-risk rows (extract.ts
      ea889e9d, D259) and the frozen reader reports unknown fractions by role, zone and activity
      context; reported at the reading
    by: lead (session eac59010)
    at: "2026-11-03 00:08 UTC"
    inputs:
      - record: D259
        rev: da68ade2ca9f550792fdbb88369ec191646cd6fef041de62b8c6cd7d508f05ef
---

## History
- 2026-11-01 22:44 UTC lead (session f6ab21fd): created — D242: amendment point 3
- 2026-11-01 22:46 UTC lead (session f6ab21fd): review for commit:h6-design-20261101: not-triggered — The commit records the T061 inventory (D240), the H6 design and its amendment (D241), the user's answers (D242), F108's update and plied records; no model change, analysis, run or reading of new results.
- 2026-11-01 22:49 UTC lead (session f6ab21fd): review for run:h6-build-smoke: acting — The brief requires the build to implement D241 amendment 1 exactly on this point; checked against the report and the code.
- 2026-11-02 03:17 UTC lead (session 7b85e17e): reviewed D243@9fcd5b57058b; D243 applies the same symmetry to T060 (one completeness rule for contact triplets, reference triplets and Stage 0 intervals; unknown fractions by role, zone and context); H6's rule unaffected
- 2026-11-02 03:31 UTC lead (session 7b85e17e): reviewed D243@a5fef01895d5; D243 amendment 1 makes T060's unknowns stay unknown (counts never make a history complete); H6's coverage rule unaffected
- 2026-11-02 05:48 UTC lead (session 0e89af04): reviewed D245@1c88a2561e84, D246@001ed95c860d; D245 found that point 3's extension of the coverage rule to null 3's eligibility leaves null 3 unsupported; D246 (user) limits null 3's eligibility to point 1's three conditions and keeps the coverage rule, neighbour clause included, for onsets and S1's at-risk reference. That is exactly this wording's scope (onsets and the at-risk reference), so P148 stands unchanged; unknown fractions still reported by role, zone and context
- 2026-11-02 05:50 UTC lead (session 0e89af04): review for run:h6-fixes-20261102: acting — The coverage rule, neighbour clause and 25 mm radius stay identical for onsets and the at-risk reference (brief task 1); null-3 eligibility is outside this wording's scope (D246); unknown fractions by role, zone and context kept
- 2026-11-02 05:55 UTC lead (session 0e89af04): review for commit:h6-design-20261101: not-triggered — Re-read D241@36eec164deeb: since the 597483 bytes this review read (the bytes committed in f9ad78f), only two blocks were appended, the lead's implementation details (onset rule, 25 mm radius, S1 sampling, runs, queens) and amendment 2 (D246). The commit holds the version read, so this disposition for it stands; the additions are reviewed at the next commit's gate.
- 2026-11-02 05:55 UTC lead (session 0e89af04): review for run:h6-build-smoke: acting — Re-read D241@36eec164deeb: since the 2b609a47 bytes this review read, the queen bullet was appended (already stated in the brief; T059 note 03:11) and amendment 2 (D246), written after this run finished and was read in D245. The run was done under the text it was gated on, so this disposition stands; amendment 2's changes are gated in run:h6-fixes-20261102. Amendment 2 takes null-3 eligibility out of the coverage rule the smoke ran under; D245 reports that run's consequence.
- 2026-11-02 15:30 UTC lead (session 0e89af04): review for run:h6-zoneflag-20261102: acting — The zone condition reads the same W 10 s unknown class (classOf) for onsets and at-risk rows, pooled, as D249 sets; the coverage rule is unchanged
- 2026-11-02 15:30 UTC lead (session 0e89af04): review for run:h6-v1v4-20261102: not-triggered — The V cases score only scorePrimary (R̄ labels); the coverage classes are not read (checked in synth.ts and reader.ts)
- 2026-11-02 15:34 UTC lead (session 0e89af04): review for commit:h6-design-20261101: not-triggered — Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed) (and, since the 597483/2b609a47 pins, the lead's implementation details and amendment 2, reviewed at 05:5x UTC). The commit holds the version first read (597483), so this disposition for it stands; the later text is reviewed at the next commit's gate.
- 2026-11-02 15:34 UTC lead (session 0e89af04): review for run:h6-build-smoke: acting — Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed) (and, since the 597483/2b609a47 pins, the lead's implementation details and amendment 2, reviewed at 05:5x UTC). The run finished before the change and was read in D245, under the text it was gated on; the disposition stands.
- 2026-11-02 15:34 UTC lead (session 0e89af04): review for run:h6-fixes-20261102: acting — Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed); D246@53e0c6fc0963: one dated line appended (D249 supersedes the lead's 50 %-pooled reading of 'mostly unknown'). The fixes run finished and was checked (D250) before the change; the cutoff concerns only the blind check, which is gated separately (run:h6-zoneflag-20261102 and the check itself), so the disposition stands.
- 2026-11-02 15:37 UTC lead (session 0e89af04): review for run:h6-blindcheck-20261102: acting — The same W 10 s class for onsets and the at-risk reference, pooled; a pre-freeze check, not the unknown fractions the reading reports by role, zone and context
- 2026-11-02 15:40 UTC lead (session 0e89af04): reviewed D251@cf9244d69620; D251 reads the blind check: S1 mostly unknown under the coverage rule; each option in Q34 keeps one rule for onsets and the at-risk reference, so the symmetry P148 asks for holds whichever is chosen; unknown fractions by role, zone and context still reported
- 2026-11-02 15:59 UTC lead (session 0e89af04): reviewed D252@cdcd4ef34d7e; D252 replaces the neighbour clause by a reachability clause applied identically to onsets and the at-risk reference, so the symmetric rule P148 asks for holds; unknown fractions still reported by role, zone and context
- 2026-11-02 16:01 UTC lead (session 0e89af04): review for run:h6-reach-20261102: acting — One reachability clause for onsets and the at-risk reference alike (brief task 3); unknown fractions still reported by role, zone and context
- 2026-11-02 16:19 UTC lead (session 0e89af04): reviewed D253@a4a119c34e10; D253: the reachability clause is one coverage() for onsets and at-risk rows alike, so the symmetry holds; the neighbour rule (Q35) will apply to both in the same way
- 2026-11-02 16:55 UTC lead (session 0e89af04): review for run:h6-blindcheck2-20261102: acting — One reachability clause for onsets and the reference (D255); a pooled pre-freeze check, not the reported unknown fractions
- 2026-11-02 16:57 UTC lead (session 0e89af04): reviewed D256@18f3534436d2; D256: the same reachability clause classes onsets and the reference; the S1 reading reports unknown fractions by role, zone and context with it
- 2026-11-03 00:06 UTC lead (session eac59010): review for commit:h6-design-20261101: not-triggered — Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules or any amendment. The commit holds the version it was gated on; the later text is reviewed at the next commit's gate (commit:h6-freeze-20261102).
- 2026-11-03 00:06 UTC lead (session eac59010): review for run:h6-build-smoke: acting — Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules or any amendment. The run finished and was read before the change, under the text it was gated on; the disposition stands.
- 2026-11-03 00:06 UTC lead (session eac59010): review for run:h6-fixes-20261102: acting — Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules or any amendment. The run finished and was read before the change, under the text it was gated on; the disposition stands.
- 2026-11-03 00:08 UTC lead (session eac59010): review for commit:h6-freeze-20261102: satisfied — The frozen extractor applies one coverage rule to onsets and S1's at-risk rows (extract.ts ea889e9d, D259) and the frozen reader reports unknown fractions by role, zone and activity context; reported at the reading
