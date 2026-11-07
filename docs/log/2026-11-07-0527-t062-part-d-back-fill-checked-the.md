---
id: D324
date: 2026-11-07
time: 05:27
kind: run
title: T062 Part D back-fill checked: the readers of D185, D207, D212 and D223, with every file they import or run, copied byte-identical into scripts/frozen/partd/ (35 files and a manifest, all matching their logged hashes); the copies still call scratch paths, so re-running them in a clone needs a path fix at T064's build; no commit
---
- **2026-11-07 ≈ 05:27 UTC — T062 Part D back-fill checked: the readers of D185, D207, D212 and D223, with every file they import or run, copied byte-identical into scripts/frozen/partd/ (35 files and a manifest, all matching their logged hashes); the copies still call scratch paths, so re-running them in a clone needs a path fix at T064's build; no commit.**
  - **Why:** D322 condition 2 (the frozen readers the T064 draft names must reach the lab's workspaces, which are
    clones of HEAD) under D249's rule ("copy the frozen reader and every file it imports into a committed
    scripts/frozen/<name>/, byte-identical to the SHA-256 in the log"). Brief and report:
    `logs/handoff/20261107-0545-t062-partd-backfill/`.
  - **Which version was read, per entry (the implementer's audit, checked by the lead):**
    - D185 (reading D194): `partD2b.ts` md5 `1ff8b42c` with the four scripts it spawns and the four modules it imports,
      all matching D185.
    - D207 (reading D210): `partDBlocks.py` at amendment 3, `7ebffa33`. D207's other md5s are the design version
      (`5dfdcc9f`), amendments 1 and 2 (`db6a9535`, `14977bd0`); `c91854ee` is the md5 of a failed self-check output,
      not code.
    - D212 (reading D221, "scripts as D217"): `triggers.ts`, `triggersCore.ts`, `triggersStats.ts`, `triggersAgg.ts`
      (`66823406`), `activitySeries.ts`, and `triggersSyn.ts` at `a96f4e90` (D220's `--dump-quorum`, before the reading).
    - D223 (reading D226, "scripts as D225"): `foragers1cData.ts` `40ac4434`, `foragers1c.py` `56d8b818`,
      `foragers1cSyn.py` `2fa02168`.
    - Committed dependencies (`scripts/lib.ts`, `simHash.ts`, `stroeymeytTracks.ts` and 12 `src/sim` modules) were last
      changed on or before 2026-10-22, before every reading, and are unmodified; each equals its copy in
      `scripts/frozen/h6/`. No file comes from the Khuong CeCILL port.
  - **Lead's check:** all 35 copies `cmp`-identical to their sources; the four main readers' md5s re-computed
    (`1ff8b42c`, `7ebffa33`, `66823406`, `40ac4434`); `npm test` 292/292, tsc clean. Manifest
    `scripts/frozen/partd/MANIFEST.md`, sha256 `4bfd10c9…`.
  - **Open (for T064's build brief, not decided here):** the copies still call scratch paths. `partD2b.ts` spawns
    `scripts/scratch/s2AuditFile.ts`, `s3Snap2b.py`, `spreadAgg.py` and `s3Read2b.py` relative to the working
    directory, and `triggersStats.ts` checks provenance md5s on `scripts/scratch/…` paths, so in a clone they would call
    missing files or fail their calibration check. The Python files resolve siblings by `__file__` and are unaffected.
    The copies stay byte-identical (D249); a fix belongs to how the build runs them (for example a working directory
    whose `scripts/scratch/` resolves to the frozen copies), designed with the T064 build.
  - **Not copied:** the second implementations `quorum2.ts` (D220), `foragers1cB.py` and `foragers1cBTest.py` (D228),
    which match their logged hashes, and shell launchers such as `partD2b.sh`. They stay for T062's wider back-fill.
  - **No commit.** The lab's workspaces see the copies only once committed (the user's, or the panel's under D277).
