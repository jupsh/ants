---
id: D013
date: 2026-10-17
time: 14:50
kind: decision
title: Run wrapper for long jobs (user decision, logged before building; tooling only, no simulation code touched)
---
**2026-10-17 ≈ 14:50 UTC — Run wrapper for long jobs (user decision,
logged before building; tooling only, no simulation code touched).**
- **Why.** Watchers lose track of runs: a stale `logs/fit-c1.done` from
  the killed first C1 run (the relaunch wrote none, so the check fell back
  to a `ps | grep` pattern); the C1 switch script's broken "left alive"
  check (malformed `ps` list); killing by a shared process name lost a
  7.5 h fit (2026-10-09); the overnight queue finished 10:28 and was read
  13:10, before the hourly watchers fired.
- **Design.** `scripts/run.sh start <name> -- <cmd…>` launches detached
  (`setsid nohup`) into its own folder `logs/runs/<name>-<UTC stamp>/`
  (command, start, pid, log). The wrapper, not the script, writes `exit`
  (code, end time), so failures are recorded; pid gone without `exit` =
  died; `run.sh kill` kills exactly that run's process group and marks it
  killed. `run.sh status` (`npm run runs`, `--box` over ssh) derives each
  state from the files on every call: running / quiet (log silent past a
  threshold) / ok / failed / killed / died. It never prints log content
  (blind checks); progress only from scripts that opt in by writing
  `$RUN_DIR/progress`. `run.sh wait <id>` blocks on the box; the local
  watcher is one ssh `wait` retried on connection loss, so the end is seen
  within seconds, and a push notification follows while the session is
  open. Existing launch and copy rules (RESUME, Box) unchanged.
- **Amended ≈ 14:51 (user: no dependence on a running Claude session).**
  The wrapper sends the end notification itself (`run.sh notify`, the
  command in `logs/notify.env` on that machine; message = host, run id,
  state, duration). Not covered: the box itself going away or a kill of
  the whole process group outside `run.sh kill`; those show as died in
  `npm run runs` but send nothing.
- **Done ≈ 14:53, local only.** `scripts/run.sh`, `npm run runs`,
  `runProgress()` in `scripts/lib.ts` (opt-in, wired into no script yet),
  `logs/box.env`. Tested locally: ok, failed(7), killed (no process of the
  group left), died (group killed from outside), quiet, progress, a reused
  name resolving to the newest run, `wait`, and notifications for ok,
  failed and an OOM-style kill of the main process (failed(137)) with no
  watcher running. Not yet on the box (copy under the Box rules before the
  next launch); notification channel not yet chosen. The Box launch rule
  (RESUME) and CLAUDE.md updated.
- **On the box ≈ 14:58 (user go-ahead).** Box idle (no node jobs).
  Copied only `scripts/run.sh` (new there; md5 d40a9d82… both sides);
  `scripts/lib.ts` not copied (`runProgress` is used by no script yet).
  Smoke run `smoke-20261017T145802Z` (sleep 3) read back as ok through
  `npm run runs -- --box`. No `logs/notify.env` on either machine yet.
- **Notifications on ≈ 15:01 (user chose ntfy, F-Droid app).**
  `logs/notify.env` on laptop and box (ntfy.sh topic, local only, not
  logged here; the box file sets `RUN_HOST=box`). Tests sent from both;
  a real box run (`notify-check-…`, sleep 2) notified on its own end.
  `run.sh` re-copied after adding `RUN_HOST` (md5 93b3638a… both sides).
