---
id: P201
title: "Lab: the thread queue (queue.actor, a plied lab actor) goes to the user with 2c"
wording: The real setting, and whether plied gets a lab actor, go to the user with 2c.
made: D300
state: fulfilled
nodes: [T065]
resolved_by: D302
reviews:
  - action: run:lab-2b
    disposition: not-triggered
    because: >-
      2b builds queue.actor as a config key tested on fixture frontier output only; no real queue is
      set and enabled.json is never created for the real checkout, so nothing reaches 2c (D300).
    by: lead (session 487510ed)
    at: "2026-11-05 22:21 UTC"
    inputs:
      - record: D300
        rev: d6bfb7a6d85a1d5d13f80c010edaef17ffa9baa09cbab4b1363cf46fd2e17b42
---

## History
- 2026-11-05 22:21 UTC lead (session 487510ed): created — D300 leaves which threads the lab takes to the user, at 2c
- 2026-11-05 22:21 UTC lead (session 487510ed): review for run:lab-2b: not-triggered — 2b builds queue.actor as a config key tested on fixture frontier output only; no real queue is set and enabled.json is never created for the real checkout, so nothing reaches 2c (D300).
- 2026-11-05 23:08 UTC lead (session 487510ed): reviewed D301@0818bb0a1b81; Reviewed against D301: 2b built queue.actor as a setting tested on fixtures only; the real setting is still for the user with 2c; open.
- 2026-11-05 23:12 UTC lead (session 487510ed): set state=fulfilled; set resolved_by=D302 — D302: plied gets a lab actor; queue.actor is lab, set in lab.config.json
