#!/usr/bin/env bash
# Step 4b on a rented box (STATUS 2026-10-11): set-up checks, run hash, then
# the window and dt checks. The fit is started separately, after the checks
# are logged in STATUS:
#   nohup bash scripts/boxS2018.sh fit <outRate> > logs/fitS2018.log 2>&1 &
# Usage: bash scripts/boxS2018.sh setup | hash | checks | fit <outRate>
set -euo pipefail
. /opt/nvm/nvm.sh && nvm use 22.22.1 >/dev/null
which npx >/dev/null
# Container CPU quota, not the host's core count (CLAUDE.md, rented containers).
if [ -z "${SIM_WORKERS:-}" ]; then
  if [ -r /sys/fs/cgroup/cpu.max ]; then read -r q p < /sys/fs/cgroup/cpu.max
  elif [ -r /sys/fs/cgroup/cpu/cpu.cfs_quota_us ]; then q=$(cat /sys/fs/cgroup/cpu/cpu.cfs_quota_us); p=$(cat /sys/fs/cgroup/cpu/cpu.cfs_period_us)
  else q=max; fi
  if [ "$q" != max ] && [ "$q" -gt 0 ]; then export SIM_WORKERS=$(( q / p - 2 )); fi
fi
export RAYON_NUM_THREADS=2 ROLLDOWN_WORKER_THREADS=2 ROLLDOWN_MAX_BLOCKING_THREADS=4 UV_THREADPOOL_SIZE=2
echo "SIM_WORKERS=${SIM_WORKERS:-default} node $(node --version) commit $(git rev-parse --short HEAD)"
mkdir -p logs
case "${1:-}" in
  setup) npm ci && npm test ;;
  hash) npx vite-node scripts/stroeymeytSim.ts --colony 112 --warmup 60 --obs 300 --out logs/hash-s2018.json >/dev/null && node -e "const r=require('./logs/hash-s2018.json').rows;console.log(require('crypto').createHash('sha256').update(JSON.stringify(r)).digest('hex'))" ;;
  checks) npx vite-node scripts/checkS2018Window.ts --mode window --outRate "$2" && npx vite-node scripts/checkS2018Window.ts --mode dt --outRate "$2" ;;
  fit) npx vite-node scripts/fitS2018.ts --outRate "$2" ;;
  *) echo "usage: $0 setup | hash | checks <outRate> | fit <outRate>"; exit 1 ;;
esac
