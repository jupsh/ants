---
id: P143
title: "H6: zones named high- and low-forager-visit unless their anatomy is established"
wording: >-
  Describe them as high- and low-forager-visit zones unless their anatomical interpretation is
  independently established.
made: D242
state: fulfilled
nodes: [T059]
resolved_by: D260
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
    disposition: satisfied
    because: Zone names unchanged; the brief keeps P143 and the blind-check script prints no zone
    by: lead (session 0e89af04)
    at: "2026-11-02 05:50 UTC"
    inputs:
      - record: D241
        rev: 36eec164deeba73a16dff9496b8751e4f5e97dac430d82b680322735d3dd2280
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
    disposition: acting
    because: The flag line says 'zone condition (L or H …)', no nurse/entrance names
    by: lead (session 0e89af04)
    at: "2026-11-02 15:29 UTC"
  - action: run:h6-v1v4-20261102
    disposition: satisfied
    because: Zones are L and H (low-/high-forager-visit) in code and outputs (checked in the first build, D245)
    by: lead (session 0e89af04)
    at: "2026-11-02 15:29 UTC"
  - action: commit:h6-design-20261101
    disposition: not-triggered
    because: >-
      Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's
      cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed)
      (and, since the 597483/2b609a47 pins, the lead's implementation details and amendment 2,
      reviewed at 05:5x UTC). The commit holds the version first read (597483), so this disposition
      for it stands; the later text is reviewed at the next commit's gate.
    by: lead (session 0e89af04)
    at: "2026-11-02 15:33 UTC"
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
    at: "2026-11-02 15:33 UTC"
    inputs:
      - record: D241
        rev: 07a71b62d68a8e5fc8683b31f3075cc5bbfe0ceae9456ec136104339bfcbf2a9
  - action: run:h6-fixes-20261102
    disposition: satisfied
    because: >-
      Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's
      cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed).
      The fixes run finished and was checked (D250) before the change; the cutoff concerns only the
      blind check, which is gated separately (run:h6-zoneflag-20261102 and the check itself), so the
      disposition stands.
    by: lead (session 0e89af04)
    at: "2026-11-02 15:33 UTC"
    inputs:
      - record: D241
        rev: 07a71b62d68a8e5fc8683b31f3075cc5bbfe0ceae9456ec136104339bfcbf2a9
  - action: run:h6-blindcheck-20261102
    disposition: satisfied
    because: The only zone wording printed is 'L or H' in the flag line; no anatomical name
    by: lead (session 0e89af04)
    at: "2026-11-02 15:37 UTC"
  - action: run:h6-reach-20261102
    disposition: not-triggered
    because: Zones untouched
    by: lead (session 0e89af04)
    at: "2026-11-02 16:01 UTC"
  - action: run:h6-blindcheck2-20261102
    disposition: satisfied
    because: The only zone wording printed is 'L or H'
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
    disposition: satisfied
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
    disposition: not-triggered
    because: >-
      The commit holds records, the frozen code (D259) and no empirical statistic; the sealed output
      folder is untouched until after the commit; zones are named at the reading
    by: lead (session eac59010)
    at: "2026-11-03 00:08 UTC"
    inputs:
      - record: D259
        rev: da68ade2ca9f550792fdbb88369ec191646cd6fef041de62b8c6cd7d508f05ef
  - action: commit:h6-freeze-20261102
    disposition: not-triggered
    because: >-
      Re-read D259@8bc940ad09b0: one dated line appended after the commit (committed as fb6af11,
      then the H6 output folder unsealed); the frozen files and hashes are unchanged, so the
      disposition for this commit stands
    by: lead (session eac59010)
    at: "2026-11-03 00:10 UTC"
    inputs:
      - record: D259
        rev: 8bc940ad09b0e75660f466f2aedc70317eaf37118055fa922fecc881a0740227
  - action: run:h6-reading-20261103
    disposition: acting
    because: >-
      The run executes the frozen reader (scripts/frozen/h6/…/reader.ts 3c3985c0, D259) unchanged on
      the frozen extractor's 22 intermediates (logs/h6-work-next, hashes matching the rebuild
      report), all parts, default draws 1000 and boot 2000; the reader labels zones L
      (low-forager-visit) and H (high-forager-visit) only; the reading names them so
    by: lead (session eac59010)
    at: "2026-11-03 00:30 UTC"
    inputs:
      - record: D259
        rev: 8bc940ad09b0e75660f466f2aedc70317eaf37118055fa922fecc881a0740227
  - action: run:h6-reading2-20261103
    disposition: acting
    because: >-
      As for run:h6-reading-20261103, which died of heap exhaustion before writing anything: the
      same frozen reader, inputs and options, rerun with Node's heap raised to 6000 MB (no change to
      code or results)
    by: lead (session eac59010)
    at: "2026-11-03 00:35 UTC"
---

## History
- 2026-11-01 22:44 UTC lead (session f6ab21fd): created — D242: Q31 zones
- 2026-11-01 22:46 UTC lead (session f6ab21fd): review for commit:h6-design-20261101: not-triggered — The commit records the T061 inventory (D240), the H6 design and its amendment (D241), the user's answers (D242), F108's update and plied records; no model change, analysis, run or reading of new results.
- 2026-11-01 22:49 UTC lead (session f6ab21fd): review for run:h6-build-smoke: acting — The brief requires the build to implement D241 amendment 1 exactly on this point; checked against the report and the code.
- 2026-11-02 03:17 UTC lead (session 7b85e17e): reviewed D243@9fcd5b57058b; D243 reuses H6's zones under the same names (low- and high-forager-visit); consistent with this, unaffected
- 2026-11-02 03:31 UTC lead (session 7b85e17e): reviewed D243@a5fef01895d5; D243 amendment 1 keeps H6's zone names for T060's matching (zone of the focal at I2's start); unaffected
- 2026-11-02 05:50 UTC lead (session 0e89af04): review for run:h6-fixes-20261102: satisfied — Zone names unchanged; the brief keeps P143 and the blind-check script prints no zone
- 2026-11-02 05:55 UTC lead (session 0e89af04): review for commit:h6-design-20261101: not-triggered — Re-read D241@36eec164deeb: since the 597483 bytes this review read (the bytes committed in f9ad78f), only two blocks were appended, the lead's implementation details (onset rule, 25 mm radius, S1 sampling, runs, queens) and amendment 2 (D246). The commit holds the version read, so this disposition for it stands; the additions are reviewed at the next commit's gate.
- 2026-11-02 05:55 UTC lead (session 0e89af04): review for run:h6-build-smoke: acting — Re-read D241@36eec164deeb: since the 2b609a47 bytes this review read, the queen bullet was appended (already stated in the brief; T059 note 03:11) and amendment 2 (D246), written after this run finished and was read in D245. The run was done under the text it was gated on, so this disposition stands; amendment 2's changes are gated in run:h6-fixes-20261102.
- 2026-11-02 15:29 UTC lead (session 0e89af04): review for run:h6-zoneflag-20261102: acting — The flag line says 'zone condition (L or H …)', no nurse/entrance names
- 2026-11-02 15:29 UTC lead (session 0e89af04): review for run:h6-v1v4-20261102: satisfied — Zones are L and H (low-/high-forager-visit) in code and outputs (checked in the first build, D245)
- 2026-11-02 15:33 UTC lead (session 0e89af04): review for commit:h6-design-20261101: not-triggered — Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed) (and, since the 597483/2b609a47 pins, the lead's implementation details and amendment 2, reviewed at 05:5x UTC). The commit holds the version first read (597483), so this disposition for it stands; the later text is reviewed at the next commit's gate.
- 2026-11-02 15:33 UTC lead (session 0e89af04): review for run:h6-build-smoke: acting — Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed) (and, since the 597483/2b609a47 pins, the lead's implementation details and amendment 2, reviewed at 05:5x UTC). The run finished before the change and was read in D245, under the text it was gated on; the disposition stands.
- 2026-11-02 15:33 UTC lead (session 0e89af04): review for run:h6-fixes-20261102: satisfied — Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed). The fixes run finished and was checked (D250) before the change; the cutoff concerns only the blind check, which is gated separately (run:h6-zoneflag-20261102 and the check itself), so the disposition stands.
- 2026-11-02 15:37 UTC lead (session 0e89af04): review for run:h6-blindcheck-20261102: satisfied — The only zone wording printed is 'L or H' in the flag line; no anatomical name
- 2026-11-02 16:01 UTC lead (session 0e89af04): review for run:h6-reach-20261102: not-triggered — Zones untouched
- 2026-11-02 16:55 UTC lead (session 0e89af04): review for run:h6-blindcheck2-20261102: satisfied — The only zone wording printed is 'L or H'
- 2026-11-03 00:06 UTC lead (session eac59010): review for commit:h6-design-20261101: not-triggered — Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules or any amendment. The commit holds the version it was gated on; the later text is reviewed at the next commit's gate (commit:h6-freeze-20261102).
- 2026-11-03 00:06 UTC lead (session eac59010): review for run:h6-build-smoke: acting — Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules or any amendment. The run finished and was read before the change, under the text it was gated on; the disposition stands.
- 2026-11-03 00:06 UTC lead (session eac59010): review for run:h6-fixes-20261102: satisfied — Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules or any amendment. The run finished and was read before the change, under the text it was gated on; the disposition stands.
- 2026-11-03 00:08 UTC lead (session eac59010): review for commit:h6-freeze-20261102: not-triggered — The commit holds records, the frozen code (D259) and no empirical statistic; the sealed output folder is untouched until after the commit; zones are named at the reading
- 2026-11-03 00:10 UTC lead (session eac59010): review for commit:h6-freeze-20261102: not-triggered — Re-read D259@8bc940ad09b0: one dated line appended after the commit (committed as fb6af11, then the H6 output folder unsealed); the frozen files and hashes are unchanged, so the disposition for this commit stands
- 2026-11-03 00:30 UTC lead (session eac59010): review for run:h6-reading-20261103: acting — The run executes the frozen reader (scripts/frozen/h6/…/reader.ts 3c3985c0, D259) unchanged on the frozen extractor's 22 intermediates (logs/h6-work-next, hashes matching the rebuild report), all parts, default draws 1000 and boot 2000; the reader labels zones L (low-forager-visit) and H (high-forager-visit) only; the reading names them so
- 2026-11-03 00:35 UTC lead (session eac59010): review for run:h6-reading2-20261103: acting — As for run:h6-reading-20261103, which died of heap exhaustion before writing anything: the same frozen reader, inputs and options, rerun with Node's heap raised to 6000 MB (no change to code or results)
- 2026-11-03 00:43 UTC lead (session eac59010): set state=fulfilled; set resolved_by=D260 — D260 names the zones high- and low-forager-visit only
