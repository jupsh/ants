---
id: P79
title: "T057 box: src/sim unchanged during both arms; box simHash equals local at launch"
wording: >-
  the box's src/sim tree must not change between launch and the end of both arms, and the box
  simHash must equal the local one at launch
made: D192
state: fulfilled
nodes: [T057]
resolved_by: D193
reviews:
  - action: run:t057-judge-20261030
    disposition: satisfied
    because: >-
      Before launch: md5 of every input (fit, both E2 layers, C2 fit, reportM1999, m1999C2, pool,
      colonyMailleux1999, tasks, launcher, simHash) equal box vs local; box simHash ecce22a65b2428dc
      = local; nothing on the box edits src/sim during the run (the launcher only runs reportM1999)
    by: lead (session 9aa22476)
    at: "2026-10-30 04:50 UTC"
    inputs:
      - record: D192
        rev: 55034cff018bd2f104614eb2a389a7d8676f9620fed0b282e0cb32bd8744351c
---

## History
- 2026-10-30 04:47 UTC lead (session 9aa22476): created
- 2026-10-30 04:50 UTC lead (session 9aa22476): review for run:t057-judge-20261030: satisfied — Before launch: md5 of every input (fit, both E2 layers, C2 fit, reportM1999, m1999C2, pool, colonyMailleux1999, tasks, launcher, simHash) equal box vs local; box simHash ecce22a65b2428dc = local; nothing on the box edits src/sim during the run (the launcher only runs reportM1999)
- 2026-10-30 05:00 UTC lead (session 9aa22476): set state=fulfilled; set resolved_by=D193 — D191 launch line: md5 and simHash equal at launch; D193: both outputs record simHash ecce22a65b2428dc
