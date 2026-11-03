---
id: D249
date: 2026-11-02
time: 15:27
kind: decision
title: User: the S1 blind check returns a radius proposal if either pooled unknown share or either zone's share is above 50 % (one yes/no zone flag printed, no per-zone value); frozen readers and their imports committed byte-identical under scripts/frozen/, H6 first, the scratch code behind earlier findings back-filled separately
authority: user
scope: T059 P167 P168
---
- **2026-11-02 ≈ 15:27 UTC — User: the S1 blind check returns a radius proposal if either pooled unknown share or either zone's share is above 50 % (one yes/no zone flag printed, no per-zone value); frozen readers and their imports committed byte-identical under scripts/frozen/, H6 first, the scratch code behind earlier findings back-filled separately.**
  - **The user's answers** (2026-11-02, to two questions the lead put after an outside review of the work since
    `dca4a4a`; the user chose an option each, and the option text is quoted as it was put):
    1. *"H6 blind check (D246): which rule decides whether S1's unknown share sends me back to you with a
       coverage-radius proposal? It has to be fixed before the two numbers are printed."* Chosen: **"50 % pooled, or
       any zone"**:
       > Return with a radius proposal if the pooled share is above 50 % in either number, or if either zone (L or H) is above 50 %. The script prints only the two pooled shares plus one yes/no flag for the zone condition; no per-zone value is printed.
    2. *"The H6 reader to be frozen, and the earlier analysis code behind findings (triggersCore.ts, onsetStats.ts,
       …), live only in git-excluded scripts/scratch/ on this laptop. Should a frozen reader be preserved
       somewhere?"* Chosen: **"Commit scripts/frozen/"**:
       > At each freeze, copy the frozen reader and every file it imports into a committed scripts/frozen/<name>/, byte-identical to the SHA-256 in the log. Start with H6, and back-fill the scratch code behind existing findings in a separate step. The Khuong CeCILL port stays excluded.
  - **Effect:**
    - **The blind check (D246, D241 amendment 2)** is fixed before it runs. Zones are L and H by the frozen zone
      construction (`buildZones`); rows in unassigned cells count in the pooled shares but in neither zone; a zone's
      share is pooled over the 22 colonies (unknown / all classed), for onsets and for the at-risk reference separately,
      so the zone condition is four shares, any of which above 50 % sets the flag. The output is the two pooled
      shares and one line "zone condition met: yes|no" (lead's detail). "Mostly unknown" in D246 is this rule, and it
      replaces D246's lead-set reading (above 50 % pooled only). P167 and P168 are superseded by P170 and P171.
    - **Frozen code:** at the H6 freeze the reader and every scratch file it imports are copied byte-identical into
      `scripts/frozen/h6/` (relative layout kept, so imports resolve), committed with the freeze's records (the commit
      itself still waits on the user, as every commit). The back-fill of earlier scratch code behind findings is a
      separate thread. Code derived from the Khuong CeCILL port stays local.
