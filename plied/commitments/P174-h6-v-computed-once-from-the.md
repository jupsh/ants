---
id: P174
title: "H6: v computed once from the tracks and recorded before the rebuilt intermediates are read"
wording: >-
  computed once from the tracks by its own script and recorded before the rebuilt intermediates are
  read
made: D252
state: fulfilled
nodes: [T059]
resolved_by: D253
reviews:
  - action: run:h6-reach-20261102
    disposition: acting
    because: >-
      Brief task 2: v from its own script, reported and written into the extractor before the
      rebuild; the lead logs it before the second blind check reads the rebuilt intermediates
    by: lead (session 0e89af04)
    at: "2026-11-02 16:01 UTC"
    inputs:
      - record: D252
        rev: cdcd4ef34d7e07f74000b894ea6fbc1781c979d8b050b255fc37ebf55783d5f8
---

## History
- 2026-11-02 15:59 UTC lead (session 0e89af04): created — D252: v fixed blind to H6 outputs
- 2026-11-02 16:01 UTC lead (session 0e89af04): review for run:h6-reach-20261102: acting — Brief task 2: v from its own script, reported and written into the extractor before the rebuild; the lead logs it before the second blind check reads the rebuilt intermediates
- 2026-11-02 16:19 UTC lead (session 0e89af04): set state=fulfilled; set resolved_by=D253 — D253: v = 9.427 mm/s from vSpeed.ts, recorded before any rebuilt intermediate exists (logs/h6-work-next/ not created)
- 2026-11-03 00:07 UTC lead (session eac59010): reviewed D258@81f3dbbbcece; Reviewed D258: v = 9.427 mm/s is frozen in extract.ts (ea889e9d, D259) as computed once; nothing changes
