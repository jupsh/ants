---
id: F059
title: A ColonySim can be saved to disk and restored in another process bit-identically (0.7–1.3 MB, 10–40 ms)
topic: numerics
status: indicated
date: 2026-10-19
data: none (colony set-ups as inputs)
evidence: B013; docs/log/2026-10-19-1701-lead-review-of-backlog-b001-b013-b018.md
bears_on: step-7 shared warm-ups; checkpoints of long runs
related: F048
supersedes:
superseded_by:
depends: backlog/B013-general-save-and-restore-of-sim-state/results/roundtrip.json
---
Stroeymeyt (86 ants) and Mailleux (24) colonies, snapshot at 1500 of 3000 steps and continued in a fresh process: final state and
observable hashes byte-identical. Generic graph encoder with a 12-class registry; fails closed. Not covered: observer state in
wrapper closures (simulateStroeymeyt, observeRecruiter). proposal.patch unapplied (user's decision).

2026-10-26 (D171): roundtrip.json regenerated under Stage 1 code. Still a pass with identical observable hashes; the serialised-state hashes and snapshot sizes (+519 bytes) changed because ColonySim gained fields (oracleG, oracle caches). The previous hashes are kept in its provenance.
