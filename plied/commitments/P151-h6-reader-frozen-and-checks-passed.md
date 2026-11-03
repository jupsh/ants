---
id: P151
title: >-
  H6: reader frozen and checks passed before any empirical result is inspected; failures back to the
  user
wording: >-
  Freeze the reader and pass the validation and reproduction checks before inspecting new empirical
  results. Return for a decision if those checks fail or require a substantive design change.
made: D242
state: fulfilled
nodes: [T059]
resolved_by: D259
reviews:
  - action: commit:h6-design-20261101
    disposition: satisfied
    because: >-
      No empirical H6 statistic exists; its output folder is sealed until the reader is frozen and
      V1-V4 and the reproduction pass.
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
      The smoke runs synthetic data built from episode skeletons and the reproduction only; no
      empirical statistic is computed or written; the empirical output folder is sealed and not
      touched.
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
      The implementer computes no empirical statistic and may not run unknownShare.ts on real
      intermediates; the reader is not frozen yet; the one allowed inspection (D246) is the lead's,
      after this brief
    by: lead (session 0e89af04)
    at: "2026-11-02 05:50 UTC"
    inputs:
      - record: D246
        rev: 001ed95c860d0220280f7ed3039d6e65f66da0ef180bea2b9a596d153057b770
      - record: D241
        rev: 36eec164deeba73a16dff9496b8751e4f5e97dac430d82b680322735d3dd2280
  - action: commit:h6-design-20261101
    disposition: satisfied
    because: >-
      Re-read D241@36eec164deeb: since the 597483 bytes this review read (the bytes committed in
      f9ad78f), only two blocks were appended, the lead's implementation details (onset rule, 25 mm
      radius, S1 sampling, runs, queens) and amendment 2 (D246). The commit holds the version read,
      so this disposition for it stands; the additions are reviewed at the next commit's gate.
    by: lead (session 0e89af04)
    at: "2026-11-02 05:56 UTC"
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
    at: "2026-11-02 05:56 UTC"
    inputs:
      - record: D241
        rev: 36eec164deeba73a16dff9496b8751e4f5e97dac430d82b680322735d3dd2280
  - action: run:h6-zoneflag-20261102
    disposition: acting
    because: >-
      The implementer changes and tests unknownShare.ts on toy input only; no empirical run; the
      lead alone runs the blind check under P170/P171
    by: lead (session 0e89af04)
    at: "2026-11-02 15:30 UTC"
    inputs:
      - record: D249
        rev: 525baaca7a016fa0badfa175ef296e55e9d3392f4c939e4e18435ea895bbc323
  - action: run:h6-v1v4-20261102
    disposition: acting
    because: >-
      Synthetic data on the real skeletons through blind(); no empirical statistic; the sealed
      output folder untouched; reader 3c3985c0… is the one to be frozen if V1-V4 pass
    by: lead (session 0e89af04)
    at: "2026-11-02 15:30 UTC"
    inputs:
      - record: D250
        rev: e546084efe544be125367c0893ba18551a19d4baca8ed0c3de6010e894d6e48c
  - action: commit:h6-design-20261101
    disposition: satisfied
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
      Re-read D246@53e0c6fc0963: one dated line appended (D249 supersedes the lead's 50 %-pooled
      reading of 'mostly unknown'); D241@07a71b62d68a: one dated line appended under amendment 2
      (D249: the blind check's cutoff is the user's, either pooled or either zone share above 50 %,
      one zone flag printed). The fixes run finished and was checked (D250) before the change; the
      cutoff concerns only the blind check, which is gated separately (run:h6-zoneflag-20261102 and
      the check itself), so the disposition stands.
    by: lead (session 0e89af04)
    at: "2026-11-02 15:34 UTC"
    inputs:
      - record: D246
        rev: 53e0c6fc09630ef9d1ab98946ed0443b11d4eef2da11c677c0a20b9459654ed2
      - record: D241
        rev: 07a71b62d68a8e5fc8683b31f3075cc5bbfe0ceae9456ec136104339bfcbf2a9
  - action: run:h6-blindcheck-20261102
    disposition: acting
    because: >-
      The one empirical inspection D246 allows before the freeze, for this check only; the script
      reads only the coverage classes and zone grid and prints three lines; no H6 statistic is
      computed
    by: lead (session 0e89af04)
    at: "2026-11-02 15:37 UTC"
    inputs:
      - record: D246
        rev: 53e0c6fc09630ef9d1ab98946ed0443b11d4eef2da11c677c0a20b9459654ed2
      - record: D249
        rev: 525baaca7a016fa0badfa175ef296e55e9d3392f4c939e4e18435ea895bbc323
  - action: run:h6-reach-20261102
    disposition: acting
    because: >-
      The implementer computes no H6 statistic and may not run unknownShare.ts or the reader on real
      data; it computes v, a motion statistic of the tracks (D252); the reader is unchanged and not
      yet frozen
    by: lead (session 0e89af04)
    at: "2026-11-02 16:01 UTC"
    inputs:
      - record: D252
        rev: cdcd4ef34d7e07f74000b894ea6fbc1781c979d8b050b255fc37ebf55783d5f8
  - action: run:h6-blindcheck2-20261102
    disposition: acting
    because: >-
      The one further inspection D252 allows before the freeze: the same script (byte-identical,
      4c1b65aa…) on logs/h6-work-next, three lines; no H6 statistic
    by: lead (session 0e89af04)
    at: "2026-11-02 16:55 UTC"
    inputs:
      - record: D252
        rev: cdcd4ef34d7e07f74000b894ea6fbc1781c979d8b050b255fc37ebf55783d5f8
  - action: commit:h6-design-20261101
    disposition: satisfied
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
    at: "2026-11-03 00:07 UTC"
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
    at: "2026-11-03 00:07 UTC"
    inputs:
      - record: D241
        rev: b1dd437cb8eb845458917e3f9ecf780f783e4ff2bbacbe3adccc128e70630f74
---

## History
- 2026-11-01 22:44 UTC lead (session f6ab21fd): created — D242: the order
- 2026-11-01 22:46 UTC lead (session f6ab21fd): review for commit:h6-design-20261101: satisfied — No empirical H6 statistic exists; its output folder is sealed until the reader is frozen and V1-V4 and the reproduction pass.
- 2026-11-01 22:49 UTC lead (session f6ab21fd): review for run:h6-build-smoke: acting — The smoke runs synthetic data built from episode skeletons and the reproduction only; no empirical statistic is computed or written; the empirical output folder is sealed and not touched.
- 2026-11-02 03:17 UTC lead (session 7b85e17e): reviewed D243@9fcd5b57058b; D243 proposes the same order for T060 (reader frozen, checks passed, logs/t060/ sealed); it reuses H6's code only once that is built and checked; H6's gate unaffected
- 2026-11-02 03:31 UTC lead (session 7b85e17e): reviewed D243@a5fef01895d5; D243 amendment 1 seals T060's empirical outputs until its reader is frozen and V0 and the reproduction pass; H6's gate unaffected
- 2026-11-02 05:48 UTC lead (session 0e89af04): reviewed D245@1c88a2561e84, D246@001ed95c860d; D245 is the check report under this commitment's 'return for a decision'; D246 (user, scope includes P151) allows one bounded inspection before the freeze, the pooled unknown share of S1's onsets and at-risk reference (P167), as an exception for that check only. The rule otherwise stands: reader frozen and V1-V4 passed before any H6 statistic is inspected
- 2026-11-02 05:50 UTC lead (session 0e89af04): review for run:h6-fixes-20261102: acting — The implementer computes no empirical statistic and may not run unknownShare.ts on real intermediates; the reader is not frozen yet; the one allowed inspection (D246) is the lead's, after this brief
- 2026-11-02 05:56 UTC lead (session 0e89af04): review for commit:h6-design-20261101: satisfied — Re-read D241@36eec164deeb: since the 597483 bytes this review read (the bytes committed in f9ad78f), only two blocks were appended, the lead's implementation details (onset rule, 25 mm radius, S1 sampling, runs, queens) and amendment 2 (D246). The commit holds the version read, so this disposition for it stands; the additions are reviewed at the next commit's gate.
- 2026-11-02 05:56 UTC lead (session 0e89af04): review for run:h6-build-smoke: acting — Re-read D241@36eec164deeb: since the 2b609a47 bytes this review read, the queen bullet was appended (already stated in the brief; T059 note 03:11) and amendment 2 (D246), written after this run finished and was read in D245. The run was done under the text it was gated on, so this disposition stands; amendment 2's changes are gated in run:h6-fixes-20261102.
- 2026-11-02 15:30 UTC lead (session 0e89af04): review for run:h6-zoneflag-20261102: acting — The implementer changes and tests unknownShare.ts on toy input only; no empirical run; the lead alone runs the blind check under P170/P171
- 2026-11-02 15:30 UTC lead (session 0e89af04): review for run:h6-v1v4-20261102: acting — Synthetic data on the real skeletons through blind(); no empirical statistic; the sealed output folder untouched; reader 3c3985c0… is the one to be frozen if V1-V4 pass
- 2026-11-02 15:34 UTC lead (session 0e89af04): review for commit:h6-design-20261101: satisfied — Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed) (and, since the 597483/2b609a47 pins, the lead's implementation details and amendment 2, reviewed at 05:5x UTC). The commit holds the version first read (597483), so this disposition for it stands; the later text is reviewed at the next commit's gate.
- 2026-11-02 15:34 UTC lead (session 0e89af04): review for run:h6-build-smoke: acting — Re-read D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed) (and, since the 597483/2b609a47 pins, the lead's implementation details and amendment 2, reviewed at 05:5x UTC). The run finished before the change and was read in D245, under the text it was gated on; the disposition stands.
- 2026-11-02 15:34 UTC lead (session 0e89af04): review for run:h6-fixes-20261102: acting — Re-read D246@53e0c6fc0963: one dated line appended (D249 supersedes the lead's 50 %-pooled reading of 'mostly unknown'); D241@07a71b62d68a: one dated line appended under amendment 2 (D249: the blind check's cutoff is the user's, either pooled or either zone share above 50 %, one zone flag printed). The fixes run finished and was checked (D250) before the change; the cutoff concerns only the blind check, which is gated separately (run:h6-zoneflag-20261102 and the check itself), so the disposition stands.
- 2026-11-02 15:37 UTC lead (session 0e89af04): review for run:h6-blindcheck-20261102: acting — The one empirical inspection D246 allows before the freeze, for this check only; the script reads only the coverage classes and zone grid and prints three lines; no H6 statistic is computed
- 2026-11-02 15:59 UTC lead (session 0e89af04): reviewed D252@cdcd4ef34d7e; D252 (user, scope includes P151) allows one more blind check of the same three lines on the rebuilt intermediates before the freeze, for that check only; otherwise the rule stands
- 2026-11-02 16:01 UTC lead (session 0e89af04): review for run:h6-reach-20261102: acting — The implementer computes no H6 statistic and may not run unknownShare.ts or the reader on real data; it computes v, a motion statistic of the tracks (D252); the reader is unchanged and not yet frozen
- 2026-11-02 16:55 UTC lead (session 0e89af04): review for run:h6-blindcheck2-20261102: acting — The one further inspection D252 allows before the freeze: the same script (byte-identical, 4c1b65aa…) on logs/h6-work-next, three lines; no H6 statistic
- 2026-11-02 22:01 UTC lead (session eac59010): reviewed D257@0a64c040066c; D257 read: V1-V4 passed; the reader is not frozen yet and nothing empirical has been inspected, so this stays open until the freeze is recorded
- 2026-11-03 00:06 UTC lead (session eac59010): review for commit:h6-design-20261101: satisfied — Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules or any amendment. The commit holds the version it was gated on; the later text is reviewed at the next commit's gate (commit:h6-freeze-20261102).
- 2026-11-03 00:07 UTC lead (session eac59010): review for run:h6-build-smoke: acting — Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules or any amendment. The run finished and was read before the change, under the text it was gated on; the disposition stands.
- 2026-11-03 00:07 UTC lead (session eac59010): review for run:h6-fixes-20261102: acting — Re-read D241@b1dd437cb8eb: one dated line appended (D259: the reader frozen, reader.ts and extract.ts SHA-256s, committed under scripts/frozen/h6/); no change to the design, the rules or any amendment. The run finished and was read before the change, under the text it was gated on; the disposition stands.
- 2026-11-03 00:07 UTC lead (session eac59010): set state=fulfilled; set resolved_by=D259 — Reader frozen (D259) after the validation checks passed (V1-V4, D257) and the reproduction passed (D256); no empirical result inspected before the freeze
