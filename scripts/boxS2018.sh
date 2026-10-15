#!/usr/bin/env bash
# Step 4b on a rented box (STATUS 2026-10-11; rest depth and two-phase fit
# 2026-10-15): set-up checks, run hash, then the window and dt rechecks at
# the start point. The fit is started separately, after the checks are
# logged in STATUS:
#   nohup bash scripts/boxS2018.sh fit > logs/fitS2018.log 2>&1 &
# Usage: bash scripts/boxS2018.sh setup | hash | trips | checks | fit
set -euo pipefail
. /opt/nvm/nvm.sh && nvm use 22.22.1 >/dev/null
which npx >/dev/null
# Container CPU quota, not the host's core count (CLAUDE.md, rented containers).
if [ -z "${SIM_WORKERS:-}" ]; then
  if [ -r /sys/fs/cgroup/cpu.max ]; then read -r q p < /sys/fs/cgroup/cpu.max
  elif [ -r /sys/fs/cgroup/cpu/cpu.cfs_quota_us ]; then q=$(cat /sys/fs/cgroup/cpu/cpu.cfs_quota_us); p=$(cat /sys/fs/cgroup/cpu/cpu.cfs_period_us)
  else q=max; fi
  if [ "$q" != max ] && [ "$q" -gt 0 ]; then export SIM_WORKERS=$(( q / p - 2 )); fi
  # One worker per physical core, not per hardware thread (faster-fit.md §1.2; STATUS 2026-10-15: on the
  # EPYC 9534, 62 workers did a phase-1 generation's 242 tasks in 603 s, 120 in 704 s).
  cores=$(lscpu -p=Core,Socket | grep -v '^#' | sort -u | wc -l)
  if [ -z "${SIM_WORKERS:-}" ] || [ "$SIM_WORKERS" -gt $(( cores - 2 )) ]; then export SIM_WORKERS=$(( cores - 2 )); fi
fi
export RAYON_NUM_THREADS=2 ROLLDOWN_WORKER_THREADS=2 ROLLDOWN_MAX_BLOCKING_THREADS=4 UV_THREADPOOL_SIZE=2
echo "SIM_WORKERS=${SIM_WORKERS:-default} node $(node --version) commit $(git rev-parse --short HEAD)"
mkdir -p logs
case "${1:-}" in
  setup) npm ci && npm test ;;
  hash) npx vite-node scripts/stroeymeytSim.ts --colony 112 --warmup 60 --obs 300 --out logs/hash-s2018.json >/dev/null && node -e "const r=require('./logs/hash-s2018.json').rows;console.log(require('crypto').createHash('sha256').update(JSON.stringify(r)).digest('hex'))" ;;
  trips) npx vite-node scripts/calibTrips.ts ;;
  # Rechecks under rest depth (STATUS 2026-10-15): 4-h and 6-h prefixes of a 12-h run after a 2-h warm-up at dt 0.05; dt 0.05 vs 0.025, 12 seeds × 1 h.
  checks) npx vite-node scripts/checkS2018Window.ts --mode window --warmup 7200 --dt 0.05 --windows 14400,21600 --tag depth && npx vite-node scripts/checkS2018Window.ts --mode dt --dts 0.05,0.025 --obs 3600 --reps 12 --tag depth ;;
  fit) npx vite-node scripts/fitS2018.ts ;;
  *) echo "usage: $0 setup | hash | trips | checks | fit"; exit 1 ;;
esac
