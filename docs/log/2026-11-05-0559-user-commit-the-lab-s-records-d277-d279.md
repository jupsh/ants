---
id: D280
date: 2026-11-05
time: 05:59
kind: decision
title: User: commit the lab's records (D277-D279, the STATUS and AGENTS.md lines, T065, P198-P200, the T064 note); the lead fills the lab's data-roles table from the record; the two lab tokens are in place
authority: user
scope: T065
---
- **2026-11-05 ≈ 05:59 UTC — User: commit the lab's records (D277-D279, the STATUS and AGENTS.md lines, T065, P198-P200, the T064 note); the lead fills the lab's data-roles table from the record; the two lab tokens are in place.**
  - **User (in conversation, verbatim):** "Done. You can commit. You can fill the data-roles table" (in reply to
    the lead's request for the two lab tokens, a commit of the lab records, and the data-roles table).
  - **Tokens:** `~/.config/ants-lab/claude-token` and `~/.config/ants-lab/plied-github-token` are present (contents
    not read). Their mode was 664; the lead set it to 600.
  - **Data roles:** `~/repos/ants-lab/policy/data-roles.json` was filled from the record (first match wins; deny by
    default):
    - Khuong 2013: inclines 1, 3, 5 fit; 2, 4 development (X004).
    - Bles 2022: development (X006, X009).
    - Bonavita 2026: held-out (X004).
    - Stroeymeyt 2018 main experiment:
      - PreTreatment tracks, tag files, retag files, `info.txt`, `task_groups.txt`: fit (STATUS Stroeymeyt Roles,
        X015);
      - PostTreatment: unused (X015, X029);
      - age experiment: held-out (not present locally).
    - Brood coordinates on the D137 allowlist: development; others unclassified.
    - `data/reference/stroeymeyt2018-*`: fit (derived from the fit colonies).
    - `khuong-segments*`: development (derived from all five inclines).
    - `data/fits/`: model outputs.
    - Five Stroeymeyt metadata files the code does not use (`info_dat.txt`, `info_plume.txt`,
      `treated_worker_list.txt`, `time_aggregation_info`, `plume_files`) are left unclassified: their role is the
      user's to set.
  - **Commit:** the files of D277-D280 only. Commit gated (`commit:lab-records-20261105`).
