---
id: P133
title: >-
  H6 design: missed contacts, tracking gaps, ongoing rises and spatially varying common inputs
  addressed
wording: Address missed contacts, tracking gaps, ongoing activity rises and spatially varying common inputs
made: D238
state: open
nodes: [T059]
reviews:
  - action: commit:synchrony-review-20261101
    disposition: not-triggered
    because: >-
      Governs designs not yet written (T059-T061); the commit records the accepted review, D238 and
      the plied threads only.
    by: lead (session f6ab21fd)
    at: "2026-11-01 18:21 UTC"
    inputs:
      - record: D238
        rev: 7655ef093c1ff672b1ac5bc85031076c4f54bf6478f98f5dfc141dceb0905e92
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
      The S3 fix adds D212's observed condition to arena entries, part of handling tracking gaps;
      the coverage rule for missed contacts is kept unchanged for onsets and S1 (brief task 1)
    by: lead (session 0e89af04)
    at: "2026-11-02 05:50 UTC"
    inputs:
      - record: D241
        rev: 36eec164deeba73a16dff9496b8751e4f5e97dac430d82b680322735d3dd2280
      - record: D246
        rev: 001ed95c860d0220280f7ed3039d6e65f66da0ef180bea2b9a596d153057b770
      - record: D247
        rev: e1f90c7276e3fe84186583ab4faa9056467a94f83380d45d032630dbdba157aa
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
      this disposition stands; amendment 2's changes are gated in run:h6-fixes-20261102.
    by: lead (session 0e89af04)
    at: "2026-11-02 05:55 UTC"
    inputs:
      - record: D241
        rev: 36eec164deeba73a16dff9496b8751e4f5e97dac430d82b680322735d3dd2280
  - action: run:h6-zoneflag-20261102
    disposition: not-triggered
    because: The coverage rule for missed contacts is not changed; the flag only reads its existing classes
    by: lead (session 0e89af04)
    at: "2026-11-02 15:29 UTC"
  - action: run:h6-v1v4-20261102
    disposition: acting
    because: >-
      V4 deletes a further 10 % of detections, twice as often in H as in L, and rebuilds onsets,
      episodes and eligibility (D241 amendment 1 point 5): the missing-observation check this
      commitment asks for
    by: lead (session 0e89af04)
    at: "2026-11-02 15:29 UTC"
    inputs:
      - record: D241
        rev: 07a71b62d68a8e5fc8683b31f3075cc5bbfe0ceae9456ec136104339bfcbf2a9
  - action: commit:h6-design-20261101
    disposition: not-triggered
    because: >-
      Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's
      cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed)
      (and, since the 597483/2b609a47 pins, the lead's implementation details and amendment 2,
      reviewed at 05:5x UTC). The commit holds the version first read (597483), so this disposition
      for it stands; the later text is reviewed at the next commit's gate.
    by: lead (session 0e89af04)
    at: "2026-11-02 15:32 UTC"
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
    at: "2026-11-02 15:32 UTC"
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
    at: "2026-11-02 15:32 UTC"
    inputs:
      - record: D241
        rev: 07a71b62d68a8e5fc8683b31f3075cc5bbfe0ceae9456ec136104339bfcbf2a9
      - record: D246
        rev: 53e0c6fc09630ef9d1ab98946ed0443b11d4eef2da11c677c0a20b9459654ed2
  - action: run:h6-blindcheck-20261102
    disposition: not-triggered
    because: Reads the existing coverage classes; the rule for missed contacts is not changed
    by: lead (session 0e89af04)
    at: "2026-11-02 15:36 UTC"
  - action: run:h6-reach-20261102
    disposition: acting
    because: >-
      This is the missed-contacts handling: the neighbour clause becomes a reachability clause
      (D252), the focal's 90 % clause unchanged
    by: lead (session 0e89af04)
    at: "2026-11-02 16:01 UTC"
    inputs:
      - record: D252
        rev: cdcd4ef34d7e07f74000b894ea6fbc1781c979d8b050b255fc37ebf55783d5f8
  - action: run:h6-blindcheck2-20261102
    disposition: not-triggered
    because: Reads the classes of the reachability clause built and tested (D253, D255); nothing changed now
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
  - action: run:h6-v1v4-20261102
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
      The frozen code carries the approved handling of missed contacts and gaps (coverage rule with
      the reachability clause, unknown classes and both unknown sensitivities), the quiet-start
      restriction and the location-conditional reference (D241 amendments 1-2, D252, D255); V4
      (missing detections) passed (D257)
    by: lead (session eac59010)
    at: "2026-11-03 00:08 UTC"
    inputs:
      - record: D241
        rev: b1dd437cb8eb845458917e3f9ecf780f783e4ff2bbacbe3adccc128e70630f74
      - record: D257
        rev: 0a64c040066cc296b91b493e20444cc54ac3e0797008217d78397f94be838019
      - record: D259
        rev: da68ade2ca9f550792fdbb88369ec191646cd6fef041de62b8c6cd7d508f05ef
---

## History
- 2026-11-01 18:20 UTC lead (session f6ab21fd): created — D238: the user's condition on the H6 design
- 2026-11-01 18:21 UTC lead (session f6ab21fd): review for commit:synchrony-review-20261101: not-triggered — Governs designs not yet written (T059-T061); the commit records the accepted review, D238 and the plied threads only.
- 2026-11-01 19:11 UTC lead (session f6ab21fd): reviewed D239@a5d3879fe9c2, D240@5875f9598246; D239 and D240 read: no change here (D240 is the T061 inventory; D239 starts T059 and T061).
- 2026-11-01 19:15 UTC lead (session f6ab21fd): reviewed D241@c351e62616d5; D241 (the H6 design) read against this; addressed in the design, open until it is approved and read.
- 2026-11-01 22:45 UTC lead (session f6ab21fd): reviewed D241@597483bc51a5, D242@95cc70c9ace0; D241 amendment 1 and D242 read: nothing here changes beyond what D242's commitments record.
- 2026-11-01 22:46 UTC lead (session f6ab21fd): review for commit:h6-design-20261101: not-triggered — The commit records the T061 inventory (D240), the H6 design and its amendment (D241), the user's answers (D242), F108's update and plied records; no model change, analysis, run or reading of new results.
- 2026-11-01 22:49 UTC lead (session f6ab21fd): review for run:h6-build-smoke: acting — The brief requires the build to implement D241 amendment 1 exactly on this point; checked against the report and the code.
- 2026-11-02 03:17 UTC lead (session 7b85e17e): reviewed D243@9fcd5b57058b; D243 handles the same four problems for T060 (blind-opportunity rule, bridging, matching on activity level and slope, zone and near-approach references); it changes nothing in H6's handling
- 2026-11-02 03:31 UTC lead (session 7b85e17e): reviewed D243@a5fef01895d5; D243 amendment 1 tightens T060's own handling of missed contacts (unknown unless bounded, v 20 mm/s) and tracking gaps (no focal bridging in the primary); H6's handling unaffected
- 2026-11-02 05:50 UTC lead (session 0e89af04): review for run:h6-fixes-20261102: acting — The S3 fix adds D212's observed condition to arena entries, part of handling tracking gaps; the coverage rule for missed contacts is kept unchanged for onsets and S1 (brief task 1)
- 2026-11-02 05:55 UTC lead (session 0e89af04): review for commit:h6-design-20261101: not-triggered — Re-read D241@36eec164deeb: since the 597483 bytes this review read (the bytes committed in f9ad78f), only two blocks were appended, the lead's implementation details (onset rule, 25 mm radius, S1 sampling, runs, queens) and amendment 2 (D246). The commit holds the version read, so this disposition for it stands; the additions are reviewed at the next commit's gate.
- 2026-11-02 05:55 UTC lead (session 0e89af04): review for run:h6-build-smoke: acting — Re-read D241@36eec164deeb: since the 2b609a47 bytes this review read, the queen bullet was appended (already stated in the brief; T059 note 03:11) and amendment 2 (D246), written after this run finished and was read in D245. The run was done under the text it was gated on, so this disposition stands; amendment 2's changes are gated in run:h6-fixes-20261102.
- 2026-11-02 15:29 UTC lead (session 0e89af04): review for run:h6-zoneflag-20261102: not-triggered — The coverage rule for missed contacts is not changed; the flag only reads its existing classes
- 2026-11-02 15:29 UTC lead (session 0e89af04): review for run:h6-v1v4-20261102: acting — V4 deletes a further 10 % of detections, twice as often in H as in L, and rebuilds onsets, episodes and eligibility (D241 amendment 1 point 5): the missing-observation check this commitment asks for
- 2026-11-02 15:32 UTC lead (session 0e89af04): review for commit:h6-design-20261101: not-triggered — Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed) (and, since the 597483/2b609a47 pins, the lead's implementation details and amendment 2, reviewed at 05:5x UTC). The commit holds the version first read (597483), so this disposition for it stands; the later text is reviewed at the next commit's gate.
- 2026-11-02 15:32 UTC lead (session 0e89af04): review for run:h6-build-smoke: acting — Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed) (and, since the 597483/2b609a47 pins, the lead's implementation details and amendment 2, reviewed at 05:5x UTC). The run finished before the change and was read in D245, under the text it was gated on; the disposition stands.
- 2026-11-02 15:32 UTC lead (session 0e89af04): review for run:h6-fixes-20261102: acting — Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed); D246@53e0c6fc0963: one dated line appended (D249 supersedes the lead's 50 %-pooled reading of 'mostly unknown'). The fixes run finished and was checked (D250) before the change; the cutoff concerns only the blind check, which is gated separately (run:h6-zoneflag-20261102 and the check itself), so the disposition stands.
- 2026-11-02 15:36 UTC lead (session 0e89af04): review for run:h6-blindcheck-20261102: not-triggered — Reads the existing coverage classes; the rule for missed contacts is not changed
- 2026-11-02 16:01 UTC lead (session 0e89af04): review for run:h6-reach-20261102: acting — This is the missed-contacts handling: the neighbour clause becomes a reachability clause (D252), the focal's 90 % clause unchanged
- 2026-11-02 16:55 UTC lead (session 0e89af04): review for run:h6-blindcheck2-20261102: not-triggered — Reads the classes of the reachability clause built and tested (D253, D255); nothing changed now
- 2026-11-03 00:06 UTC lead (session eac59010): review for commit:h6-design-20261101: not-triggered — Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules or any amendment. The commit holds the version it was gated on; the later text is reviewed at the next commit's gate (commit:h6-freeze-20261102).
- 2026-11-03 00:06 UTC lead (session eac59010): review for run:h6-build-smoke: acting — Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules or any amendment. The run finished and was read before the change, under the text it was gated on; the disposition stands.
- 2026-11-03 00:06 UTC lead (session eac59010): review for run:h6-fixes-20261102: acting — Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules or any amendment. The run finished and was read before the change, under the text it was gated on; the disposition stands.
- 2026-11-03 00:06 UTC lead (session eac59010): review for run:h6-v1v4-20261102: acting — Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules or any amendment. The run finished and was read before the change, under the text it was gated on; the disposition stands.
- 2026-11-03 00:08 UTC lead (session eac59010): review for commit:h6-freeze-20261102: satisfied — The frozen code carries the approved handling of missed contacts and gaps (coverage rule with the reachability clause, unknown classes and both unknown sensitivities), the quiet-start restriction and the location-conditional reference (D241 amendments 1-2, D252, D255); V4 (missing detections) passed (D257)
