---
id: D255
date: 2026-11-02
time: 16:22
kind: decision
title: User: Q35 answered, the reachability clause checks only ants read at least once in the 128 s before the onset or sample frame (ring), and uses the exact form (a contact within both the unread run and the window at speed at most v), not the ellipse
authority: user
scope: Q35 T059
---
- **2026-11-02 ≈ 16:22 UTC — User: Q35 answered, the reachability clause checks only ants read at least once in the 128 s before the onset or sample frame (ring), and uses the exact form (a contact within both the unread run and the window at speed at most v), not the ellipse.**
  - **The user's answers** to the two questions the lead put on Q35 (D254), the option text quoted as it was put:
    1. *"Which other ants are checked as possible unseen contacts?"* Chosen: **"ring: read in last 128 s"**:
       > Ant j is checked only if it was read at least once in the 128 s before the onset or sample frame f (inside the window counts). Ants unread for longer give no usable position and are ignored.
    2. *"Where an ant's last read is already within contact range (4.1 mm) of the focal, … Which applies?"* Chosen:
       **"Exact form"**:
       > Unknown only if a contact could fall within both the unread run and the window at speed ≤ v: (|p1−x|−r)⁺ + (|x−p2|−r)⁺ ≤ v·gap, clipped to the window. This is what is implemented and tested.
  - **Effect:** `NEIGHBOUR_SEEN = 'ring'` (a read in frames [f − 256, f − 1]) in `scripts/scratch/h6-next/extract.ts`;
    the exact form stays as implemented (D253). The rebuild into `logs/h6-work-next/` and then the second blind check
    (D252; P173) may proceed. D252's neighbour detail and its ellipse remark are replaced by this entry.
