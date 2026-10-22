#!/usr/bin/env bash
# B014 benchmark (deliverable 3): four workloads x five arms, alternating, each run in a fresh process, niced.
# Arms: main (the main checkout, original code), off and on (the worktree with the switch off / on), and main-np and
# on-np: main and on under node --no-allocation-site-pretenuring (V8's pretenuring makes stepped runs bimodal; B014
# Progress 2026-10-19), so the switch's gain can be read free of that.
# Usage, from the main checkout's root: bash backlog/B014-event-driven-resting-ants-in-the-colony/bench.sh <worktree> [reps=3]
set -euo pipefail
WT=$(realpath "$1"); REPS=${2:-3}
B=backlog/B014-event-driven-resting-ants-in-the-colony
MAIN=$(pwd); OUT=$MAIN/$B/results/bench.json
rsync -a --exclude out --exclude results "$MAIN/$B/" "$WT/$B/"
run() { # dir name nodeflags script args...
  local dir=$1 name=$2 nf=$3; shift 3
  (cd "$dir" && nice -n 5 node $nf node_modules/.bin/vite-node "$@" --out "$OUT" --name "$name" | tail -1)
}
for r in $(seq 1 "$REPS"); do
  for arm in main off on main-np on-np; do
    dir=$WT; case $arm in main*) dir=$MAIN;; esac
    flag=(); case $arm in on*) flag=(--lazy);; esac
    nf=""; case $arm in *-np) nf=--no-allocation-site-pretenuring;; esac
    run "$dir" "s2018-colony122-c2s0|$arm|r$r" "$nf" $B/profile.ts "${flag[@]}"
    run "$dir" "m1999-pilot-d2.3|$arm|r$r" "$nf" $B/profileM1999.ts --motion pilot --n 16 "${flag[@]}"
    run "$dir" "m1999-c2-d2.3|$arm|r$r" "$nf" $B/profileM1999.ts --motion c2 --n 16 "${flag[@]}"
    run "$dir" "m1999-c2-d6|$arm|r$r" "$nf" $B/profileM1999.ts --motion c2 --n 16 --density 6 "${flag[@]}"
  done
done
(cd "$MAIN" && npx vite-node $B/benchSummary.ts "$OUT")
