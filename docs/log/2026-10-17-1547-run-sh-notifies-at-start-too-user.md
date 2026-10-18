---
id: D020
date: 2026-10-17
time: 15:47
kind: run
title: `run.sh` notifies at start too (user request; tooling only)
---
**2026-10-17 ≈ 15:47 UTC — `run.sh` notifies at start too (user
request; tooling only).** The wrapper calls `run.sh notify --start` just
before the command ("<host>: <run id> started"; `timeout 20`, failures
ignored, so it never blocks or fails a run); the end notification is
unchanged. Tested locally with a dummy channel (start and end messages
both sent); copied to the box (idle), md5 98cb82bc… both sides.
