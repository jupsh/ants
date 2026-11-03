---
id: D253
date: 2026-11-02
time: 16:18
kind: run
title: H6 reachability clause built in the parallel copy (T059; D252): v = 9.427 mm/s recorded (99th percentile of light-phase in-nest moving step speeds, n = 3,778,783, P174); clause and brute-force tests pass; rebuild halted because D252's neighbour rule does not match the code (D254, Q35)
---
- **2026-11-02 ≈ 16:18 UTC — H6 reachability clause built in the parallel copy (T059; D252): v = 9.427 mm/s recorded (99th percentile of light-phase in-nest moving step speeds, n = 3,778,783, P174); clause and brute-force tests pass; rebuild halted because D252's neighbour rule does not match the code (D254, Q35).**
  - **What ran:** the implementer on `logs/handoff/20261102-1605-h6-reach/brief.md` (gate `run:h6-reach-20261102`);
    report `logs/handoff/20261102-1605-h6-reach/report.md`. Code in `scripts/scratch/h6-next/` (local); the running V1–V4
    inputs (`scripts/scratch/h6/`, `logs/h6-work/`) untouched (hashes unchanged).
  - **v (P174), recorded here before any rebuilt intermediate exists:** `vSpeed.ts` (sha256 `59a1c40b…`) printed
    "v99 in-nest moving step speed, light, all ants, 22 fit colonies: 9.427 mm/s (n = 3778783)" (nearest rank, 0.001
    mm/frame bins, bin midpoint × 2 fps). A motion statistic of the fit colonies, development use; it is written into
    `h6-next/extract.ts` as `V_REACH`. For scale: the moving-only mean speed is 2.2–2.75 mm/s (F036).
  - **The clause:** D252's exact a/b form (`reachable()`), with the focal's position at the run's first unread frame
    (or the nearest in-nest read in the ring) and the unchanged 90 % focal clause; one `coverage()` for onsets and
    at-risk rows (P148). `h6-next/` tests 44/44, including a 20,000-run comparison with a brute-force search over contact
    times inside the window and an end-to-end stream against an offline reference; deliberate mutations of the code
    were each caught. `npm test` (292) and `tsc` pass; `reader.ts`, `synth.ts`, `repro.ts` and `unknownShare.ts` in the
    copy are byte-identical to `h6/`. `h6-next/extract.ts` sha256 `421f423c…`.
  - **Halted before the rebuild, as the brief requires:** which neighbours enter the clause is not settled (D254). The
    copy's extractor refuses to run until `NEIGHBOUR_SEEN` is set; `logs/h6-work-next/` does not exist. Decision: Q35.
  - **Seen:** v and its count only.
