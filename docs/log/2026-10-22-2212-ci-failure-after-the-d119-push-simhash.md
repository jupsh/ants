---
id: D120
date: 2026-10-22
time: 22:12
kind: correction
title: CI failure after the D119 push: simHash counted a local-only file and the findings check treated absent local-only inputs as changed; both fixed, 9 results re-stamped
---
- **2026-10-22 ≈ 22:12 UTC — CI failure after the D119 push: simHash counted a local-only file and the findings check treated absent local-only inputs as changed; both fixed, 9 results re-stamped.**
  - **What failed:** the Pages workflow on `main` (commit 9b125d9), at `test/records.test.ts`. `findings.mjs check`
    reported 12 stamped results stale, which they weren't. This was the first push to `main` that included them.
  - **Cause 1:** `simHash` hashed `src/sim/reference/khuongSegmentation.ts`, a local-only file (CeCILL port, in
    `.git/info/exclude`), so the hash was f57a833f31cc3b4f locally and b88c50268eb43f61 in CI and on boxes.
    Only `scripts/segmentKhuong.ts` and `test/local/` import that file. **Fix:** simHash skips it (`LOCAL_ONLY`); the
    local hash is now b88c50268eb43f61 everywhere.
  - **Cause 2:** the B018 / B019 results declare inputs under `data/stroeymeyt2018/` and `backlog/B018…/out/`, which
    are git-ignored and absent in CI, so they hashed as "missing" there and counted as changed. **Fix:** the check
    lists an input absent from the checkout as "not checked here" and no longer counts it as stale.
    Locally, those inputs are still compared.
  - **Re-stamped (simHash f57a833f31cc3b4f → b88c50268eb43f61, `provenance.restamped`, reason D120):** the 9 committed
    results stamped f57a (B001 sweep, B013 roundtrip, B014 bench and identity, B018 rules, site and walkon, B019
    comove, data/reference/stroeymeyt2018-rest-position.json). The only change between the two hashes is that the
    unimported file is no longer counted, so none of these results changes.
  - Pages precomputed locally under f57a run live until `npm run precompute`; CI builds its own.
