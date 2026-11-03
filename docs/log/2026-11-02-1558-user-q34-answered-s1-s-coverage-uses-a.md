---
id: D252
date: 2026-11-02
time: 15:58
kind: decision
title: User: Q34 answered, S1's coverage uses a reachability clause in place of the 25 mm radius (v the 99th-percentile in-nest moving step speed); one more blind check of the same three lines, then no further tuning: if D249's cutoff is still met, S1 is reported as it falls, labelled coverage-limited, and the freeze proceeds
authority: user
scope: Q34 T059 P151
---
- **2026-11-02 ≈ 15:58 UTC — User: Q34 answered, S1's coverage uses a reachability clause in place of the 25 mm radius (v the 99th-percentile in-nest moving step speed); one more blind check of the same three lines, then no further tuning: if D249's cutoff is still met, S1 is reported as it falls, labelled coverage-limited, and the freeze proceeds.**
  - **The user's answers** to the two questions the lead put on Q34 (D251); the user chose an option each, quoted as it
    was put:
    1. *"How should 'unknown' be decided?"* Chosen: **"A: reachability"**:
       > A neighbour's unread run (> 2 s) makes the window unknown only if it could have reached contact with the focal: |p1−x| + |x−p2| ≤ 8.2 mm + v·gap (open runs: |p1−x| ≤ 4.1 mm + v·elapsed). v is the 99th-percentile in-nest moving step speed, computed once from the tracks. The focal's 90 % rule is unchanged.
    2. *"If A or B is chosen: after one more blind check of the same three lines under the new rule, what happens if
       D249's cutoff is still met?"* Chosen: **"Report as it falls"**:
       > No further tuning: S1 is reported under the new rule, labelled coverage-limited, with its unknown shares. The freeze proceeds.
  - **Effect (D241 amendment 3, in this entry; D241's own file is not edited further, so its pinned reviews stay valid):**
    - **The neighbour clause of the coverage rule** is replaced, for onsets and S1's at-risk reference alike (P148): a
      window [f − W, f) is unknown if the focal fails the 90 % detection clause (unchanged), or if some other ant j has
      an unread run of more than 4 frames inside the window from which it could have reached contact with the focal
      inside the window. Exactly (lead's implementation of the user's rule): with p1, t1 j's last read before the run,
      p2, t2 its first read after it, x the focal's position (still; its read at the run's start or the nearest one),
      r = 4.1 mm, a = t1 + max(0, |p1 − x| − r)/v and b = t2 − max(0, |x − p2| − r)/v, the run makes the window unknown
      iff max(a, f − W) ≤ min(b, f). For a run with no read before f, b = f (only p1's condition). This equals the
      quoted ellipse |p1 − x| + |x − p2| ≤ 2r + v (t2 − t1) when the run lies inside the window, and is stricter when it
      extends beyond it (the contact must fall within W). Ants with no read in the ring before the window (128 s) are
      ignored, as the present code does (lead detail).
    - **v** is the 99th percentile of light-phase in-nest moving step speeds (the onset step rule: a step ≥ 0.6 mm per
      frame from the last read at most 3 frames back, speed = step length / frames, in mm/s), all ants, the 22 fit
      colonies pooled, computed once from the tracks by its own script and recorded before the rebuilt intermediates
      are read. It is a motion statistic of development data, not an H6 output.
    - **One more blind check,** the same script and three lines (D249's cutoff), on the rebuilt intermediates, allowed
      before the freeze as an exception to P151 for that check only. If the cutoff is met again, S1 is reported as it
      falls, labelled coverage-limited, with its unknown shares, and the freeze proceeds; otherwise S1 is reported as
      designed. Either way, no further change of the coverage rule before the reading.
    - **Unaffected:** the reader (`3c3985c0…`), the primary statistic, null-3 eligibility and the V1–V4 run.
