---
id: D303
date: 2026-11-05
time: 23:39
kind: run
title: ants-lab stage 2c-prep built and checked: meters through meter homes of the lab's logins, the lab queue, no patch or commit over uncommitted work, Codex and Muse context limits; 494 + 10 tests; the lead's readings of the deviations
---
- **2026-11-05 ≈ 23:39 UTC — ants-lab stage 2c-prep built and checked: meters through meter homes of the lab's logins, the lab queue, no patch or commit over uncommitted work, Codex and Muse context limits; 494 + 10 tests; the lead's readings of the deviations.**
  - **Brief and report:** `logs/handoff/20261105-2314-lab-2c-prep/` (`brief.md`, `report.md`); gate `run:lab-2c-prep`
    passed (P198-P200 not-applicable). Built from D302.
  - **Implementer's report, quoted:** "`npx vitest run`: 494 tests pass (the start was 456)." "Nothing was run against
    a provider: no model call, probe, `codex app-server`, `muse usage` or Claude session."
  - **Built** (ants-lab, uncommitted; tree `71bf2222` → `583d5936`): meter homes for Codex and Muse reads
    (`withMeterHome`, `meterEnv`: HOME and the engine's home set to the meter home), refusals without an explicit home,
    the probe wired (Claude, Muse; Codex never), `lab usage --read`, `queue.actor` required and set to `lab`, the two
    duplicate keys refused by name, the queue in `lab status`, the dirty set at step start with checks before review,
    at apply and at commit, Codex and Muse context watches.
  - **Lead's check:** reproduced the tree hash, 494/494, tsc 0, Docker 10/10; the ants status equal to the lead's
    listing before the launch; no `enabled.json`. On the real state directory `lab status` shows
    `queue (actor lab): none` and `lab run` refuses (exit 3, not enabled).
  - **Lead's readings of the deviations:**
    - **The lab's own writes** (report item 1) stay exempt, as built: a dirty path counts as the lab's only while its
      content equals the last applied `after_blobs` of a lab apply. Since an apply over a user's dirty path is refused,
      a lab write starts from a clean file, so the exemption never covers the user's or the lead's work. Without it the
      `commit` kind could never commit (D302 asked that a commit match what the step's own apply wrote).
    - **`seal_output` checked against the dirty set** (item 2): kept; it only adds asks.
    - **Soft context limits** (item 3): flag only for both engines, as built; the adapters close stdin at start.
    - **Hard context limits** (item 3): the measure arrives only when a turn ends (Codex `turn.completed`, perhaps
      summed over requests; Muse `run.usage` just before its terminal event), so as built a finished session would be
      marked failed after the fact. Reading: a crossing seen on a completed turn is flagged, not a failure; the session
      is stopped only when a further non-terminal event follows the crossing. Codex and Muse sessions are then bounded
      in practice by their timeouts; README says so. Follow-up 1.
    - **Claude meter read and probe with the user's HOME** (item 5): against D302 ("never the user's"). HOME goes to a
      lab-owned directory in the state directory (0700), for the meter read and the probe. Follow-up 1.
    - **Muse probe leftovers and the sweep gap** (item 6): the whole `sessions/meter-*` directory is removed after a
      read or probe, and the sweep leaves a meter home younger than two minutes. Follow-up 1.
    - `scripts/smoke.ts` changed for tsc (item 4): accepted; it now reads through the lab homes.
  - **Next:** follow-up 1; then the lead's one real `lab usage --read` (no probe), the choice of the first analysis
    thread and its `lab step --dry-run`, to the user before `lab enable` (D296, D302).
