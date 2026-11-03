---
id: P169
title: "H6: S3 entry rule given D212's observed condition before the freeze"
wording: >-
  The draft S3 entry rule omits D212's "observed" condition: a defect against D241's "the D212
  matching", to be fixed before the freeze.
made: D245
state: fulfilled
nodes: [T059]
resolved_by: D250
links: [D247]
reviews:
  - action: run:h6-fixes-20261102
    disposition: acting
    because: >-
      Brief task 2 implements D212's observed condition for arena entries against absenceAt with a
      unit test, before any freeze
    by: lead (session 0e89af04)
    at: "2026-11-02 05:50 UTC"
    inputs:
      - record: D245
        rev: 1c88a2561e842b952bedbac1dca344dfb37f1d22940c1403feb9501f0d5e2d78
      - record: D247
        rev: e1f90c7276e3fe84186583ab4faa9056467a94f83380d45d032630dbdba157aa
  - action: run:h6-fixes-20261102
    disposition: acting
    because: >-
      Re-read D245: it changed only by an appended pointer to X026; the promise to fix the S3 entry
      rule before the freeze is unchanged, and brief task 2 implements it
    by: lead (session 0e89af04)
    at: "2026-11-02 06:01 UTC"
    inputs:
      - record: D245
        rev: ecf50abf8849ac074409d2b0e55f3834430da4ac33170fe6a464431e9c10398f
      - record: D247
        rev: e1f90c7276e3fe84186583ab4faa9056467a94f83380d45d032630dbdba157aa
---

## History
- 2026-11-02 05:47 UTC lead (session 0e89af04): created — D245 promised the fix; D246 orders it; D247 logs the defect
- 2026-11-02 05:50 UTC lead (session 0e89af04): review for run:h6-fixes-20261102: acting — Brief task 2 implements D212's observed condition for arena entries against absenceAt with a unit test, before any freeze
- 2026-11-02 06:01 UTC lead (session 0e89af04): review for run:h6-fixes-20261102: acting — Re-read D245: it changed only by an appended pointer to X026; the promise to fix the S3 entry rule before the freeze is unchanged, and brief task 2 implements it
- 2026-11-02 15:28 UTC lead (session 0e89af04): set state=fulfilled; set resolved_by=D250 — D250: the S3 entry rule needs D212's observed absence, tested against absenceAt, before any freeze
