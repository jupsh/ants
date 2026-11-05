---
id: D281
date: 2026-11-05
time: 06:03
kind: decision
title: User: treated_worker_list.txt (Stroeymeyt 2018 main experiment) is unused, as the lead recommended: it records which workers were treated, close to PostTreatment information; the other four unused metadata files stay unclassified
authority: user
scope: T065
---
- **2026-11-05 ≈ 06:03 UTC — User: treated_worker_list.txt (Stroeymeyt 2018 main experiment) is unused, as the lead recommended: it records which workers were treated, close to PostTreatment information; the other four unused metadata files stay unclassified.**
  - **User (in conversation, verbatim):** "looks good to me. keep it unused", replying to the lead's
    recommendation to keep `data/stroeymeyt2018/main_experiment/original_data/treated_worker_list.txt` unused.
  - **Effect:** the file's role is **unused**. It comes first in `~/repos/ants-lab/policy/data-roles.json`, so any
    step that needs it goes to the user. `info_dat.txt`, `info_plume.txt`, `time_aggregation_info` and
    `plume_files` stay unclassified: no role is set, and a step that needs one goes to the user. The rest of the
    table is as the user approved it in the same reply ("looks good to me").
