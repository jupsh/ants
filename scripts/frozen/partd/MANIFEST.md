# scripts/frozen/partd: Part D frozen readers, back-filled (D249; T062)

Byte-identical copies of the Part D readers named in D185, D207, D212 and D223, with every file they import or run,
at their repo-relative paths (so `../lib`, `../../src/...` resolve inside this folder). Copied 2026-11-06 from the
checkout; no file edited. Each scratch file's md5 was checked against the hash the log names, as of the last
amendment or build entry before its reading; every one matched, so nothing is listed as a mismatch.

Committed dependencies (`scripts/*.ts`, `src/...`) carry no hash in these entries (except `oracleStats.ts`, D185).
Their last git change is dated 2026-10-22 or earlier, before every reading here (2026-10-30 to 2026-10-31), and they
are not modified in the working tree; each is also byte-identical to its copy in `scripts/frozen/h6/`.

Excluded: no file in these closures imports or derives from the Khuong CeCILL port
(`src/sim/reference/khuongSegmentation.ts`, `scripts/segmentKhuong.ts`, `test/local/`); none was copied.
`src/sim/analysis/khuongData.ts` is a committed file, not the port, and is copied as in `scripts/frozen/h6/`.

## Readers and their readings

| Item | Entry (design; amendments, approval) | Reading | Files |
|---|---|---|---|
| 1. Part D Stage 2b reader | D185 (confirmed D186) | D194 (`partD2b.ts` md5 `1ff8b42c`) | `partD2b.ts`; it spawns `s2AuditFile.ts`, `s3Snap2b.py` (which runs `s3Audit.py`), `spreadAgg.py`, `s3Read2b.py` (which loads `s3AuditRead.py`); imports `s2Audit.ts`, `s2AuditGate.ts`, `partDMembers.ts`, `oracleStats.ts`, `rng.ts`, `lib.ts` |
| 2. F108 light-phase blocks | D207 amendments 1-3 (D209 counts the defects) | D210 (`partDBlocks.py` md5 `7ebffa33`) | `partDBlocks.py` (standard library only) |
| 3. Queen-onset and entry DiD | D212 amendments 1-2, D213, D216; built D215, amendment 2 built D217 (D218); quorum dump D220 | D221 (`triggersAgg.ts` md5 `66823406`, "Scripts as D217"; `triggersSyn.ts` as D220) | `triggers.ts`, `triggersCore.ts`, `triggersStats.ts`, `triggersAgg.ts`, `triggersSyn.ts`, `activitySeries.ts` and their imports |
| 4. m/r split and post-entry activity | D223 amendment 1, D224; built D225 | D226 (`foragers1c.py` md5 `56d8b818`, "Scripts as D225") | `foragers1cData.ts`, `foragers1c.py`, `foragers1cSyn.py` (loads `foragers1c.py` by path) and the recorder's imports |

D207's other md5s: `5dfdcc9f` (design), `db6a9535` (amendment 1) and `14977bd0` (amendment 2) are superseded versions
of `partDBlocks.py`; `c91854ee` is the md5 of a failed self-check output (amendment 2), not of code. The version read
(D210) is amendment 3's `7ebffa33`, copied here.

## Files

| Path (under this folder; source = same path in the checkout) | Item | Hash in the log (entry) | md5 now | SHA-256 now |
|---|---|---|---|---|
| scripts/scratch/partD2b.ts | 1 | `1ff8b42c` (D185, D186, D194) | 1ff8b42c53a77ac2d49a411ab312d141 | 466f225e70d7e67cdab1c591b4e3649aad2e65b3f6433bb87c754e9990657a38 |
| scripts/scratch/s3Snap2b.py | 1 | `4c78768c` (D185) | 4c78768cd01b23f334cb3008b7c408c2 | beacea7755f2c81a05238d50308a811635b0f5a5ec104811d118a15ca0924134 |
| scripts/scratch/s3Read2b.py | 1 | `a3efcf64` (D185) | a3efcf642ad919c087e6e5a845dd2c50 | e92f176b413513ba2d5c9f5ff0b7082f0081eac119c719bae34c56d35d2f3f9c |
| scripts/scratch/s2AuditFile.ts | 1 | `d888bb33` (D185; D153) | d888bb33e91583b6853dd75265e72856 | 722f2383f30d52828cacd8024c0db50837ad2f1ee1b69255ea51abedbf55fb30 |
| scripts/scratch/s2Audit.ts | 1 | `f9ef0fb4` (D185; D153) | f9ef0fb4c11df92318cfb0c382e2b8f2 | 4b0ec123e525434a10a2dd4efaac698a386fbd7142e279ba47f93d9f5c71535f |
| scripts/scratch/s2AuditGate.ts | 1 | `47b8cb7d` (D185; D153) | 47b8cb7d9491ed4a6e24ca59079054fd | 7ba6aa61feb93f85a940fb3e9b74072bf4326fa14b7df5e458c145d611953fb7 |
| scripts/scratch/s3Audit.py | 1 | `9ce3f5a2` (D185; D129) | 9ce3f5a29f9f87961c5f884328b778e3 | ce40bd364f4bd600fba4b0530f8dcbe89b7c28a49282169821ed8e2bd9c6b573 |
| scripts/scratch/s3AuditRead.py | 1 | `c79bec04` (D185; D129) | c79bec04e9beb2195caa5bfb7a5f17db | 1eb91377cacf4a1c09563e5e922b09eb6da8e7a5c9b0a8af05d39d489bf5af8c |
| scripts/scratch/spreadAgg.py | 1 | `964d6926` (D185) | 964d6926accb92bfaf59f168f0aec673 | b026431a54a9ac5aaa5863edc29a6a7d4a209d1ea7e07ef5db4e9cb9dcb31fee |
| scripts/scratch/partDMembers.ts | 1 | `15edeb88` (D185) | 15edeb8850eb807f1e93fde477b352c1 | ddb3da4625a696bb9c8fdd6a9a246e38a1260b00c9d13836b00c3716538438f2 |
| src/sim/analysis/oracleStats.ts | 1 | `d78335b7` (D185) | d78335b71782fe5348ec22aa47aac188 | ba3666ea50993b87694bf5d9cbe10dd07668ced5e5aba9048b8d577a3848b0a5 |
| scripts/scratch/partDBlocks.py | 2 | `7ebffa33` (D207 amendment 3, D210) | 7ebffa3313595c10b3310f698700a307 | 6c716594c11e2e7788bde349f6fab464de37250305c27778ea44a222bbf28301 |
| scripts/scratch/triggers.ts | 3 | `e29ccdd8` (D217) | e29ccdd897ecd7f00a9e95a55aeec4dd | 67231115e35c08ab3573a342b46416c8490467c241d44dea2f6c31b0e7b33d9d |
| scripts/scratch/triggersCore.ts | 3 | `f6c3db77` (D217; unchanged D220) | f6c3db77939c8705f7fc71c26fde254a | 7e195ac21f29f0a8b1d9e89cfeaa4dd4bfd748f8177802da8033defb0ea70ad3 |
| scripts/scratch/triggersStats.ts | 3 | `5e81303d` (D217; unchanged D220) | 5e81303d78e8b49d403d871ddad21264 | 18668a256df9653a39b3bed053b1f820f076c85ace8877be4a9a2a4fcc91aacf |
| scripts/scratch/triggersAgg.ts | 3 | `66823406` (D217, D221) | 6682340607f24991d12b07c8cacb5923 | 10eebe2e8f0626697159adce4c54b325ea751880f6e50cc3e3be05d00bef84e9 |
| scripts/scratch/triggersSyn.ts | 3 | `a96f4e90` (D220; was `d7b7dfa9` in D217, before `--dump-quorum`) | a96f4e90d9402b57e45c60c28f00cf6a | b2091abc257b6982d292551c4c05aea5f013e5536f7430820b12302f9d417855 |
| scripts/scratch/activitySeries.ts | 3 | `dc7fd5cd` (D215, D217) | dc7fd5cdd7bb18432d836761dc47bc7a | 11bcced7201a2061410abe264c8f84b2e5bcd9cd8dfbe7626fba7cf11c6dcb5b |
| scripts/scratch/foragers1cData.ts | 4 | `40ac4434` (D225) | 40ac44340b5d06643fc2dfe28ff15abf | f5aa968b5e261fca7a171d2c969c84268750807a243b3395917018063d0cf22b |
| scripts/scratch/foragers1c.py | 4 | `56d8b818` (D225, D226) | 56d8b81841815e8f7db54e09c77e38bf | 529246efd0eea2598681ede2c17b75f5c1efae21af697ba1e9bdddb8b6956e6c |
| scripts/scratch/foragers1cSyn.py | 4 | `2fa02168` (D225) | 2fa021685bb8ba8d65d4c2c80da06301 | 268330d82f96cbb187f1f32d119477b8ec4a977df8968ba672dd565f89bb41b2 |
| scripts/lib.ts | 1, 3, 4 | none (committed) | a6cb96c847d3365eccc7a1d607c05723 | 08c15523fdb8d395be34299cf28efac41594487ac82c409a7659dc3dae359a07 |
| scripts/simHash.ts | 1, 3, 4 | none (committed) | 86acc77c318bf233482b819d1f4bb8f9 | a2fe565af8a4258b4d6184449eb2fce4ff7f0b972d3cf69b984b5fddb5826076 |
| scripts/stroeymeytTracks.ts | 3, 4 | none (committed) | d799db7022b89c0f0c9104738534f657 | e352a25454c3db66d26c2d96be215448f9e0b0009a5dbf9eab50c8fef45275c9 |
| src/sim/analysis/compare.ts | 3, 4 | none (committed) | 82aa87007561ed3c48dc294b735d74dd | 50718fbbd12496a40158facd19ffb3778d00da33653a16a3df2a2cce1e4c2462 |
| src/sim/analysis/inNest.ts | 3, 4 | none (committed) | efb787e207d4209a105ce4e464e9e8b1 | 21e731e3fe473328575101a0a507fb886af0b8ace698cd980d353dd0d6fac267 |
| src/sim/analysis/khuongData.ts | 1, 3, 4 | none (committed) | 5be7d6737ba3a37bd573fed6d8950f61 | d3359274ab28a43baa9c89a81d7ac65553c1b11b77caf3d0cb4111e34f178232 |
| src/sim/analysis/trajectory.ts | 1, 3, 4 | none (committed) | feaf09dd677317bc12cbc1699f175a98 | f4d642f941f876b5cc2997c8b7a0cb85bff53081ea3a5025f52fce1c7d7cef1b |
| src/sim/core/math.ts | 1, 3, 4 | none (committed) | 49d1addc7f0d5bbdd11dced7a32a20a7 | 8a09fa1aa55286e93c53c2a65bd39da6991e391c7e50629e8cc2be0344256a90 |
| src/sim/core/rng.ts | 1, 3, 4 | none (committed) | 0f20f89f5a3ed4ad0d37c3b38be62702 | 0f87b2faf56cc39918fce92b5fa305662b4f7c30d44f305600af0e4a9ce17c09 |
| src/sim/experiments/e1Exploration.ts | 1, 3, 4 | none (committed) | 1c4b6bbf67e2e92670723aa7f59d34f3 | c5397c1a576721dee96ac499e238af4ded1804386bcee60e74ed989f5e0546ad |
| src/sim/models/walk.ts | 1, 3, 4 | none (committed) | 7f59c848486f2e6165bb32dd217e3ad2 | 14ad75f686cf83b0cb9fc3068ede3c87ea8750c198f60cac7ba1c0e793e2a569 |
| src/sim/perception/types.ts | 1, 3, 4 | none (committed) | 6eb6bcce2d9e0eb11637b7c13bc449e1 | 98c5ee5ae8cb74a53d7abe8bd5d3d37207af6561ab5ed1caebe10a95cdc02634 |
| src/sim/reference/sectoredWalker.ts | 1, 3, 4 | none (committed) | e3bcaab355a7d0630d5eed758cdc1a2a | bca68fb0bfa1b2f9967ba1f3668b5e5344781303e3b1fa4c8a19d2ec35e79083 |
| src/sim/world/surface.ts | 1, 3, 4 | none (committed) | a4cf22e7272103c66dd826b62ca298bb | 5f7b043d467d13735156bd07985c3b4c2c097397ff078264fc1c9afe30a29b24 |

## Not copied

- Independent second implementations (checks, not the readers): `scripts/scratch/quorum2.ts` (D220, md5 `f3fe5400`,
  matches now) for item 3; `scripts/scratch/foragers1cB.py` (`7a552ded`) and `foragers1cBTest.py` (`abe5e3ea`) (D228,
  both match now) for item 4. The lead's `quorumCompare.py` (D220) was a scratchpad file; not found in `scripts/`,
  `docs/` or `src/`.
- Shell launchers and data inputs (`logs/...`): not code the readers import.

## Paths that still point at scripts/scratch/ (not patched)

The copies are unedited, so these cwd-relative paths resolve to the scratch originals when run from the repo root,
and are absent in a clone:
- `partD2b.ts` spawns `scripts/scratch/s2AuditFile.ts`, `scripts/scratch/s3Snap2b.py`, `scripts/scratch/spreadAgg.py`
  and `scripts/scratch/s3Read2b.py` by repo-relative path.
- `triggersStats.ts` hashes `scripts/scratch/triggers*.ts`, `activitySeries.ts`, `triggersSyn.ts` and
  `scripts/stroeymeytTracks.ts` by repo-relative path (`'missing'` if absent); the aggregator's and calibration's
  md5 checks compare these.
- The Python files locate their siblings by `__file__` and are unaffected.
