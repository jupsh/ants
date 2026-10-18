---
id: D021
date: 2026-10-17
time: 15:48
kind: run
title: Y model references launched on the box
---
**2026-10-17 ≈ 15:48 UTC — Y model references launched on the box**
(earlier than the planned ≈ 16:40: box idle, ≈ 30–45 min, so results
are in before the user's 4-h gap and the gap stays free for step-3 arms
if the user decides). `run.sh` run `ydist-20261017T154748Z`, script
`scripts/scratch/box/run-ydist.sh`: control, `coupled:1:60`,
`placebo:0.53:60` × 22 colonies × light / dark × 12 h, `--lite --ydist`,
132 runs, `xargs -P 62`. Copied `tmpShortSim.ts` (adds `--ydist`),
`ydistStats.ts`, the script; md5 both sides. Start notification sent
(first use). Reductions `logs/ydist/cs-yd-*`; read with `ydistAgg.ts
--sets data=data-c,ctl=cs-yd-ctl-,k1=cs-yd-k1-,p=cs-yd-p-` once the data
side (`ydistData.ts`, local, after the Ra / P recorder) exists.
