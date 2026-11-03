---
id: D254
date: 2026-11-02
time: 16:18
kind: correction
title: Two lead details in D252 corrected: the present code ignores only never-read ants, not ants unread for 128 s; and D252's exact form equals the user's ellipse only when the ant could cover p1 to p2 at speed v, being stricter when an end lies within contact range
---
- **2026-11-02 ≈ 16:18 UTC — Two lead details in D252 corrected: the present code ignores only never-read ants, not ants unread for 128 s; and D252's exact form equals the user's ellipse only when the ant could cover p1 to p2 at speed v, being stricter when an end lies within contact range.**
  - **First: "Ants with no read in the ring before the window (128 s) are ignored, as the present code does".** The
    present code (`scripts/scratch/h6/extract.ts` line 167) checks every ant read at least once before f, through its
    open run from its last read, with no ring limit; under the 25 mm radius that mattered only for an ant last seen
    within 25 mm. Under reachability an open run that began long ago reaches anywhere in the nest, so keeping the code's
    behaviour would make nearly every window unknown whenever any ant (a lost tag, for instance) is long unread. The
    "as now" claim is wrong, and the rule must be chosen, not inherited. Found by the implementer (D253); nothing was
    rebuilt or read under either reading.
  - **Second: D252's exact form "equals the quoted ellipse … when the run lies inside the window".** It does only when
    j could cover |p1 − p2| at v. Algebraically the exact form needs (|p1 − x| − r)⁺ + (|x − p2| − r)⁺ ≤ v (t2 − t1),
    while the ellipse needs (|p1 − x| − r) + (|x − p2| − r) ≤ v (t2 − t1); they differ only when one end lies within
    the contact radius r, where the ellipse credits the ant with the distance it is already inside r. There the
    ellipse says unknown and the exact form may say known. The exact form is the physical statement (a contact at
    some time τ in the run and the window); the ellipse was the option's summary. Implemented: the exact form, as D252
    says; the difference is now for the user to confirm (Q35).
  - **Effect:** the rebuild and the second blind check wait for Q35. The V1–V4 run is unaffected.
