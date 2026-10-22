#!/usr/bin/env bash
# Long runs with a record that cannot drift (STATUS 2026-10-17 ≈ 14:50). Each
# run gets its own folder logs/runs/<name>-<UTC stamp>/ (cmd, start, pid,
# log; `exit` written by this wrapper, not the script, so failures are
# recorded too). Every state is derived from those files on each call:
#   starting · running · quiet (log silent past --quiet-after) · ok ·
#   failed (exit code) · killed (via `kill`) · died (gone without an exit)
# status never prints log content (blind checks); a script may opt in to a
# progress column by writing one line to "$RUN_DIR/progress". With
# logs/notify.env, the run notifies when it starts and when it ends.
#
#   bash scripts/run.sh start <name> [--quiet-after S] -- <cmd…>   # detached
#   bash scripts/run.sh status [--all] [--box]          # npm run runs [-- --box]
#   bash scripts/run.sh wait [--box] <id|name>          # block until it ends
#   bash scripts/run.sh kill <id>                       # exactly that run's processes
# --box runs the same command on the box over ssh: BOX_SSH and BOX_DIR from
# the environment or logs/box.env (e.g. BOX_SSH="-p 46397 root@1.2.3.4").
set -euo pipefail
RUNS=${RUNS_DIR:-logs/runs}
[ -z "${BOX_SSH:-}" ] && [ -r logs/box.env ] && . logs/box.env  # BOX_SSH from the environment wins (box.mjs --env)

die() { echo "run.sh: $*" >&2; exit 2; }
dur() { local s=$1; if [ "$s" -ge 3600 ]; then printf '%dh%02dm' $((s / 3600)) $((s % 3600 / 60)); else printf '%dm%02ds' $((s / 60)) $((s % 60)); fi; }

# Any process left in the run's process group (setsid makes the wrapper its leader).
alive() { [ -f "$1/pid" ] && pgrep -g "$(cat "$1/pid")" >/dev/null; }

state() {
  local d=$1 code
  if [ -f "$d/exit" ]; then read -r code _ < "$d/exit"; [ "$code" = 0 ] && echo ok || echo "failed($code)"
  elif alive "$d"; then
    if [ $(( $(date +%s) - $(stat -c %Y "$d/log" 2>/dev/null || cat "$d/start") )) -gt "$(cat "$d/quiet")" ]; then echo quiet; else echo running; fi
  elif [ ! -f "$d/pid" ] && [ $(( $(date +%s) - $(cat "$d/start") )) -lt 10 ]; then echo starting
  elif [ -f "$d/killed" ]; then echo killed
  else echo died; fi
}
terminal() { case $1 in ok|failed*|killed|died) return 0 ;; *) return 1 ;; esac; }
# End time: from `exit`; for killed or died runs the last sign of life; else now.
ended() {
  local d=$1 s=$2 t
  if [ -f "$d/exit" ]; then read -r _ t < "$d/exit"; echo "$t"
  elif terminal "$s"; then stat -c %Y "$d/killed" "$d/log" 2>/dev/null | sort -n | tail -n 1
  else date +%s; fi
}

# A full run id, or the newest run whose id starts with the argument.
resolve() {
  [[ $1 =~ ^[A-Za-z0-9._-]+$ ]] || die "bad run id '$1'"
  [ -d "$RUNS/$1" ] && { echo "$1"; return; }
  local d t best='' bt=0
  for d in "$RUNS/$1"*/; do
    [ -f "$d/start" ] || continue
    t=$(cat "$d/start"); [ "$t" -ge "$bt" ] && { bt=$t; best=$(basename "$d"); }
  done
  [ -n "$best" ] || die "no run matching '$1' in $RUNS"
  echo "$best"
}

on_box() {
  [ -n "${BOX_SSH:-}" ] && [ -n "${BOX_DIR:-}" ] || die "--box needs BOX_SSH and BOX_DIR (logs/box.env)"
  # shellcheck disable=SC2086  # BOX_SSH holds ssh options and the host
  ssh -o ConnectTimeout=30 -o ServerAliveInterval=60 -o ServerAliveCountMax=3 $BOX_SSH "cd $BOX_DIR && bash scripts/run.sh $(printf '%q ' "$@")"
}

cmd=${1:-}; shift || true
box=0; args=()
for a in "$@"; do [ "$a" = --box ] && box=1 || args+=("$a"); done
set -- "${args[@]+"${args[@]}"}"

case $cmd in
  start)
    name=${1:-}; shift || true
    [[ $name =~ ^[A-Za-z0-9._-]+$ ]] || die "start needs a name of letters, digits, . _ -"
    quiet=7200
    while [ $# -gt 0 ] && [ "$1" != -- ]; do
      case $1 in --quiet-after) quiet=$2; shift 2 ;; *) die "unknown option $1" ;; esac
    done
    [ "${1:-}" = -- ] && shift
    [ $# -gt 0 ] || die "start needs a command after --"
    [ $box = 0 ] || die "start the run on the box itself (launch rules, STATUS § Box)"
    mkdir -p "$RUNS"
    id="$name-$(date -u +%Y%m%dT%H%M%SZ)"; d="$(cd "$RUNS" && pwd)/$id"
    mkdir "$d" || die "$id exists; wait a second"
    printf '%q ' "$@" > "$d/cmd"; echo >> "$d/cmd"
    date +%s > "$d/start"; echo "$quiet" > "$d/quiet"
    self="$(cd "$(dirname "$0")" && pwd)/$(basename "$0")" setsid -f nohup bash -c '
      d=$1; shift
      echo $$ > "$d/pid"
      export RUN_DIR=$d
      timeout 20 bash "$self" notify --start "$d" > "$d/notify-start.log" 2>&1 || true
      "$@" > "$d/log" 2>&1 < /dev/null && code=0 || code=$?
      printf "%s %s\n" "$code" "$(date +%s)" > "$d/exit.tmp" && mv "$d/exit.tmp" "$d/exit"
      bash "$self" notify "$d" > "$d/notify.log" 2>&1 || true
    ' _ "$d" "$@" > /dev/null 2>&1 < /dev/null
    for _ in $(seq 50); do [ -f "$d/pid" ] && break; sleep 0.1; done
    [ -f "$d/pid" ] || die "$id did not start"
    echo "started $id (pid $(cat "$d/pid"); log $RUNS/$id/log)"
    ;;
  status)
    [ $box = 0 ] || { on_box status "$@"; exit; }
    [ -d "$RUNS" ] || { echo "no runs in $RUNS"; exit 0; }
    all=0; [ "${1:-}" = --all ] && all=1
    now=$(date +%s)
    printf '%-36s %-11s %-12s %8s %9s  %s\n' run state started elapsed "log age" progress
    for d in $(ls -1d "$RUNS"/*/ 2>/dev/null | sed 's:/$::'); do
      [ -f "$d/start" ] || continue
      s=$(state "$d"); t0=$(cat "$d/start")
      t1=$(ended "$d" "$s")
      age=-; [ -f "$d/log" ] && ! terminal "$s" && age=$(dur $((now - $(stat -c %Y "$d/log"))))
      prog=; [ -f "$d/progress" ] && prog=$(head -c 40 "$d/progress" | head -n 1)
      printf '%s\t%-36s %-11s %-12s %8s %9s  %s\n' "$t0" "$(basename "$d")" "$s" "$(date -u -d "@$t0" '+%m-%d %H:%MZ')" "$(dur $((t1 - t0)))" "$age" "$prog"
    done | sort -n | cut -f2- | { [ $all = 1 ] && cat || tail -n 15; }
    ;;
  wait)
    [ -n "${1:-}" ] || die "wait needs a run id or name"
    if [ $box = 1 ]; then
      # Retry only on connection loss (ssh exit 255); the box-side wait does the polling.
      until rc=0; on_box wait "$1" || rc=$?; [ $rc != 255 ]; do sleep 60; done
      exit $rc
    fi
    id=$(resolve "$1")
    until s=$(state "$RUNS/$id"); terminal "$s"; do sleep 10; done
    t0=$(cat "$RUNS/$id/start"); t1=$(ended "$RUNS/$id" "$s")
    echo "$id $s after $(dur $((t1 - t0)))"
    ;;
  kill)
    [ $box = 0 ] || { on_box kill "$@"; exit; }
    id=$(resolve "${1:-}"); d="$RUNS/$id"
    alive "$d" || die "$id is not running ($(state "$d"))"
    touch "$d/killed"
    # SIGKILL: vite-node ignores SIGTERM (CLAUDE.md gotchas). Only this run's group.
    kill -9 -- "-$(cat "$d/pid")"
    echo "killed $id (process group $(cat "$d/pid"))"
    ;;
  notify)
    # Called by the wrapper itself when a run starts (`--start`, ≤ 20 s, never
    # blocks the run) and when it ends, so no watcher or Claude session is
    # needed; `notify --test` checks the channel. RUN_NOTIFY in
    # logs/notify.env (per machine, read at the end of the run) is a shell
    # command that sends "$RUN_MSG": host (RUN_HOST, else the hostname), run
    # id, state and duration, never results.
    conf=${RUN_NOTIFY_FILE:-logs/notify.env}
    [ -r "$conf" ] || { echo "no $conf: not notifying"; exit 0; }
    . "$conf"; [ -n "${RUN_NOTIFY:-}" ] || { echo "RUN_NOTIFY empty: not notifying"; exit 0; }
    if [ "${1:-}" = --test ]; then msg="${RUN_HOST:-$(hostname -s)}: run.sh test notification"
    elif [ "${1:-}" = --start ]; then msg="${RUN_HOST:-$(hostname -s)}: $(basename "${2:?}") started"
    else
      d=${1:?}; s=$(state "$d"); t0=$(cat "$d/start")
      msg="${RUN_HOST:-$(hostname -s)}: $(basename "$d") $s after $(dur $(( $(ended "$d" "$s") - t0 )))"
    fi
    RUN_MSG=$msg bash -c "$RUN_NOTIFY" && echo "sent: $msg"
    ;;
  *) sed -n '2,16p' "$0" | sed 's/^# \{0,1\}//'; [ -z "$cmd" ] || exit 2 ;;
esac
