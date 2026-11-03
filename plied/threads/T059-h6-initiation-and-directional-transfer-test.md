---
id: T059
title: "H6 initiation and directional-transfer test: design (D238 item 1)"
parent: T023
status: closed
actor: lead
outcome:
  ref: D260
  quote: both decision labels unresolved
carries: [F113, F114, F115, F116]
links:
  - D237
  - D238
  - D239
  - D241
  - D242
  - D246
  - D247
  - D249
  - D250
  - D251
  - D252
  - D253
  - D254
  - D255
  - D256
  - D257
  - D258
  - D259
  - D260
---

## History
- 2026-11-01 18:20 UTC lead (session f6ab21fd): created — D238: the user's first next work
- 2026-11-01 19:08 UTC lead (session f6ab21fd): added D239 to links — D239: started
- 2026-11-01 19:12 UTC lead (session f6ab21fd): reviewed D239@a5d3879fe9c2, D240@5875f9598246; D239 and D240 read: no change here (D240 is the T061 inventory; D239 starts T059 and T061).
- 2026-11-01 19:15 UTC lead (session f6ab21fd): set actor=user; added D241 to links — D241: design drafted; waiting on the user's approval (Q31)
- 2026-11-01 22:44 UTC lead (session f6ab21fd): set actor=lead; added D242 to links — D242: approved with amendments; implementation and synthetic checks next
- 2026-11-01 22:50 UTC lead (session f6ab21fd): Implementer working (run:h6-build-smoke gated): build, unit tests, reproduction and synthetic smoke; brief logs/handoff/20261101-2249-h6-build/brief.md; code in scripts/scratch/h6/ (local). Empirical outputs sealed.
- 2026-11-02 03:11 UTC lead (session f6ab21fd): Implementer session lost when the user's laptop crashed (about 23:11 UTC, 2026-11-01): it left partial code in scripts/scratch/h6/ (h6.test.ts corrupted to 15.6 MB by one toy test block written repeatedly; inspected: toy coordinates only), intermediates for c0, c1, c2, c4 (c2 and c4 possibly cut off) and a reproduction file for c0 in logs/h6-work/; no smoke or synthetic outputs. Relaunched on the same brief with instructions to check or rewrite the partial code and rebuild every intermediate. Gate run:h6-build-smoke re-checked: passed; its evidence D241@2b609a47d274 is stale only by the dated queen bullet (now D241@3bb427d5e808), which the brief already states.
- 2026-11-02 03:17 UTC lead (session 7b85e17e): reviewed D243@9fcd5b57058b; D243 (T060's design) reuses H6's onset, contact, coverage and zone code once it is built and checked, and cites D241/D242 for conventions; nothing in T059 changes
- 2026-11-02 03:30 UTC lead (session 7b85e17e): reviewed D243@a5fef01895d5; D243 amendment 1 takes H6's frozen S1 slope class if H6's code fixes it, and otherwise defines its own; T060's build waits on H6's code being built and checked; nothing in T059 changes
- 2026-11-02 04:04 UTC lead (session f6ab21fd): reviewed D245@1c88a2561e84; Build checked by the lead (D245): tests, npm test, tsc and the reproduction pass (Test A rho +0.015). The smoke shows null 3 unsupported in every colony under point 3's neighbour clause; Q33 to the user. Full V1-V4 run and the freeze wait for Q33. Report: logs/handoff/20261101-2249-h6-build/report.md.
- 2026-11-02 05:48 UTC lead (session 0e89af04): reviewed D246@001ed95c860d, D247@e1f90c7276e3; D246 (user) answers Q33: null-3 eligibility by point 1's conditions, initiator included; fill-ins confirmed; one pooled blind check of S1's unknown share (P167, P168); S3 entry rule to get D212's observed condition (D247, P169); V1-V4 full run next on the reader to be frozen. Recorded as D241 amendment 2. Next: implementer brief for the fixes and the blind-check script
- 2026-11-02 05:48 UTC lead (session 0e89af04): added D246 to links; added D247 to links — D246 answers Q33; D247 the S3 defect
- 2026-11-02 05:51 UTC lead (session 0e89af04): Implementer working (run:h6-fixes-20261102 gated): null-3 eligibility by point 1's conditions, S3 observed entry rule, unknownShare.ts (not run by it), rebuilt intermediates and smoke; brief logs/handoff/20261102-0550-h6-fixes/brief.md; code in scripts/scratch/h6/ (local)
- 2026-11-02 15:28 UTC lead (session 0e89af04): added D249 to links; added D250 to links — D249 user answers (cutoff, frozen code); D250 fixes checked
- 2026-11-02 15:28 UTC lead (session 0e89af04): reviewed D249@525baaca7a01, D250@e546084efe54; D250: fixes built and checked by the lead (31/31 tests, tsc, repro PASS, smoke support 21/22). D249 (user): blind-check cutoff either pooled or either zone share above 50 %, with one zone flag (P170, P171); frozen code committed under scripts/frozen/ at the freeze (P172; back-fill T062). Next: zone flag in unknownShare.ts (implementer follow-up), the full V1-V4 run, the blind check
- 2026-11-02 15:31 UTC lead (session 0e89af04): Long run h6-v1v4-20261102 started 15:30 UTC (gated; logs/runs/h6-v1v4-20261102-20261102T153052Z/; wrapper logs/handoff/20261102-0550-h6-fixes/fullrun.sh; synthetic only, outputs logs/h6-synth/; about 7 h at 6 then 2 processes for the memory free). Implementer follow-up on the zone flag in unknownShare.ts (gate run:h6-zoneflag-20261102); blind check after it, by the lead
- 2026-11-02 15:39 UTC lead (session 0e89af04): added D251 to links — D251: blind check read
- 2026-11-02 15:39 UTC lead (session 0e89af04): reviewed D251@cf9244d69620; D251: blind check read (X027): S1 mostly unknown, D249's rule met; coverage proposal to the user (Q34: A reachability clause recommended, B smaller radius, C as it falls). The freeze waits for Q34; V1-V4 run continues (independent of the coverage classes)
- 2026-11-02 15:59 UTC lead (session 0e89af04): added D252 to links — D252: Q34 answered
- 2026-11-02 16:01 UTC lead (session 0e89af04): reviewed D252@cdcd4ef34d7e; D252 (user): Q34 answered, reachability clause; one more blind check then no further tuning (P173, P174). Implementer working (run:h6-reach-20261102 gated) in a parallel copy scripts/scratch/h6-next/ writing logs/h6-work-next/, so the running V1-V4 inputs stay untouched; brief logs/handoff/20261102-1605-h6-reach/brief.md
- 2026-11-02 16:19 UTC lead (session 0e89af04): added D253 to links; added D254 to links — D253 v recorded and rebuild halted; D254 correction
- 2026-11-02 16:19 UTC lead (session 0e89af04): reviewed D253@a4a119c34e10, D254@7cc414a2bee9; D253: v = 9.427 mm/s recorded (P174); clause built and tested in scripts/scratch/h6-next/; rebuild halted. D254 corrects two of my D252 details (neighbour rule; ellipse equality). Q35 to the user; rebuild and second blind check wait on it. V1-V4 run continues
- 2026-11-02 16:22 UTC lead (session 0e89af04): added D255 to links — D255: Q35 answered
- 2026-11-02 16:22 UTC lead (session 0e89af04): reviewed D255@f50b4fba4c16; D255 (user): Q35 answered, ring neighbours and the exact form; the implementer sets NEIGHBOUR_SEEN='ring' in h6-next/extract.ts and rebuilds logs/h6-work-next/ (gate run:h6-reach-20261102 re-checked: passed); then the second blind check (P173)
- 2026-11-02 16:56 UTC lead (session 0e89af04): added D256 to links — D256: second blind check read
- 2026-11-02 16:56 UTC lead (session 0e89af04): reviewed D256@18f3534436d2; D256: second blind check (X028): 0.784 / 0.897, zone yes; by P173 S1 is reported as it falls, labelled coverage-limited; the reachability extractor (h6-next) is the one to freeze. The freeze waits only for the V1-V4 run
- 2026-11-02 22:00 UTC lead (session eac59010): reviewed D257@0a64c040066c; D257: V1-V4 run h6-v1v4-20261102 finished ok (21:57 UTC) and read: every acceptance rule of D241 amendment 1 point 5 passes; the reader 3c3985c0 runs unchanged in h6-next, and the extractor's coverage-only change does not reach scorePrimary. Next: the freeze (reader + reachability extractor under scripts/frozen/, P172), then the empirical reading
- 2026-11-03 00:08 UTC lead (session eac59010): reviewed D258@81f3dbbbcece, D259@da68ade2ca9f; D258 (user): go-ahead for the freeze. D259: reader 3c3985c0 and extractor ea889e9d frozen with 22 more files under scripts/frozen/h6/ (tsc, npm test pass); P151 fulfilled. Next: commit (gate commit:h6-freeze-20261102), unseal the H6 output folder, the empirical reading from the frozen code
- 2026-11-03 00:09 UTC lead (session eac59010): reviewed D259@8bc940ad09b0; Committed fb6af11 (gate commit:h6-freeze-20261102 passed); H6 output folder unsealed (D259 dated line). Next: the empirical reading from the frozen code
- 2026-11-03 00:31 UTC lead (session eac59010): Long run h6-reading-20261103 started 00:30 UTC (gated run:h6-reading-20261103; logs/runs/h6-reading-20261103-20261103T003058Z/): the frozen reader (scripts/frozen/h6/, D259) with --empirical --assign real --work logs/h6-work-next (22 intermediates, hashes matching the rebuild report), all parts, draws 1000, boot 2000; output logs/h6/reading.json. The reading follows with a log entry and finding
- 2026-11-03 00:34 UTC lead (session eac59010): Run h6-reading-20261103 failed after 3 min 19 s: JavaScript heap out of memory at Node's default ~2 GB limit (exit 134); no output written, nothing read. Rerun unchanged with --max-old-space-size=6000 as run:h6-reading2-20261103
- 2026-11-03 00:44 UTC lead (session eac59010): set status=closed; cleared next; set outcome.ref=D260; set outcome.quote=both decision labels unresolved; set carries=["F113","F114","F115","F116"]; added D257 to links; added D258 to links; added D259 to links; added D260 to links — D260: the empirical reading read against the frozen design; the thread's work (design, build, checks, freeze, reading) is done
