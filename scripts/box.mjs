#!/usr/bin/env node
// Rented boxes (vast.ai) from start to finish: find and cost offers, rent (only with --yes, after the user approves the
// estimate), set up, check pace, watch the market during a long run, fetch results, destroy. Guide: docs/BOX.md.
// Needs the `vastai` CLI with the user's API key (~/.config/vastai). The current box lives in logs/box.env (also read
// by `scripts/run.sh --box`).
//   node scripts/box.mjs offers  --runs N [--run-s 270] [--min-vcpu 32] [--max-dph 1] [--limit 15] [--interruptible]
//   node scripts/box.mjs rent    <offer id> --yes [--disk 20]
//   node scripts/box.mjs setup   [--node 22.22.1]          copy run files, Node, npm ci, checksums, job count
//   node scripts/box.mjs bench   [--jobs n]                 time one standard run (colony 1, 6 h, C2) in every job slot
//        at once → this host's speed (hosts with the same CPU name differ up to 2×, 2026-10-22)
//   node scripts/box.mjs ssh     -- <command…>              run in the box's worktree (Node on PATH)
//   node scripts/box.mjs status                            instance state, cost so far, run.sh status --box
//   node scripts/box.mjs pace    <glob> [--window 20] [--jobs n] [--ref-s 270]   completions → seconds per run
//   node scripts/box.mjs market  --runs-left N [--run-s 270] [--min-vcpu 32]     cheaper / faster offers (report only)
//   node scripts/box.mjs fetch   <path…>                   copy back into the local tree, md5-checked
//   node scripts/box.mjs push    <path…>                   copy local files onto the box (e.g. outputs when switching), md5-checked
//   node scripts/box.mjs destroy --yes [--force]           refuses while a run.sh run is still running
//   node scripts/box.mjs switch  <offer id> --yes --run <run id> --carry <path> [--carry <path>…] [--relaunch '<cmd>']
//        [--min-speed s]
//        rent + set up the new box, stop the run on the current one, carry its outputs over (md5-checked), relaunch the
//        run's own command (or --relaunch) there, destroy the old box. Only for work that resumes from its outputs.
//        The new box is benched first: below --min-speed (default 1.2 × the current box's) it is destroyed, the old kept.
//   node scripts/box.mjs finish  --run <run id> --fetch <path> [--fetch <path>…] [--destroy]
//        end-of-run step, started locally with run.sh at launch: wait for the run, then if it exited 0 fetch the paths
//        and the run's logs (md5-checked) and, with --destroy, destroy the box. Any failure keeps the box.
// Every command takes --env <file> (default logs/box.env, or BOX_ENV) to address a second box while switching.
// Workload unit: one "run" = one job slot busy for --run-s seconds on the reference box (EPYC 9534 at full load; a 6-h
// simulated colony ≈ 270 s). Speeds per CPU are in scripts/boxCpus.json (measured rows, else a guess by generation).
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
process.chdir(ROOT);

const BOX_DIR = '/root/ants-w7';
const TEMPLATE = '17564823150f8a5ea4f6e98dfaf7915d'; // vast.ai "NVIDIA CUDA" = vastai/base-image (has /opt/nvm)
const SETUP_H = 0.25; // copy, Node, npm ci, checks
const TAIL = 1.1; // stage barriers and the last wave
// Never sent to a box (held-out data, literature, the user's files, local-only licensed code).
const NEVER = [/^data\/stroeymeyt2018\//, /^literature\//, /^side-projects\//, /^\.cache\//, /^logs\//, /^test\/local\//, /khuongSegmentation\.ts$/, /segmentKhuong\.ts$/];

const argv = process.argv.slice(2);
const cmd = argv[0];
const flag = (k) => argv.includes(k);
const opt = (k, d) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : d);
// --env f (or BOX_ENV): another box file, e.g. logs/box.next.env while switching boxes; run.sh --box reads logs/box.env.
const ENV = opt('--env', process.env.BOX_ENV ?? 'logs/box.env');
const num = (k, d) => Number(opt(k, d));
const die = (m) => { console.error(`box: ${m}`); process.exit(1); };
const vast = (...a) => {
  const r = spawnSync('vastai', [...a, '--raw'], { encoding: 'utf8' });
  if (r.error) die('vastai CLI not found (pip install vastai; vastai set api-key …)');
  try { return JSON.parse(r.stdout); } catch { die(`vastai ${a.join(' ')}: ${(r.stdout + r.stderr).trim().slice(0, 300)}`); }
};

function readEnv() { return readEnvFile(ENV); }
function readEnvFile(ENV) {
  if (!fs.existsSync(ENV)) die(`no ${ENV}: no current box (rent one, or write BOX_SSH / BOX_DIR / BOX_ID by hand)`);
  const e = {};
  for (const l of fs.readFileSync(ENV, 'utf8').split('\n')) {
    const m = l.match(/^(\w+)=(.*)$/);
    if (m) e[m[1]] = m[2].replace(/^"(.*)"$/, '$1');
  }
  return e;
}
const sshArgs = (e) => ['-o', 'ConnectTimeout=20', '-o', 'ServerAliveInterval=60', '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=accept-new', '-o', 'LogLevel=ERROR', ...e.BOX_SSH.split(/\s+/)];
const NODE_ENV = (v) => `. /opt/nvm/nvm.sh >/dev/null && nvm use ${v} >/dev/null && export RAYON_NUM_THREADS=2 ROLLDOWN_WORKER_THREADS=2 ROLLDOWN_MAX_BLOCKING_THREADS=4 UV_THREADPOOL_SIZE=2`;
function onBox(e, script, input) {
  const r = spawnSync('ssh', [...sshArgs(e), `cd ${e.BOX_DIR} 2>/dev/null || cd /root; ${script}`], { encoding: 'utf8', input, maxBuffer: 1 << 30 });
  return { code: r.status, out: (r.stdout ?? '').replace(/^Welcome to vast\.ai.*\n(Have fun!\n)?(AI agents:.*\n)?/m, ''), err: r.stderr ?? '' };
}

// One of this script's commands in a child process; a failure stops the caller with `why`.
function runStep(label, a, why) {
  console.log(`— ${label}`);
  const r = spawnSync('node', ['scripts/box.mjs', ...a], { stdio: 'inherit' });
  if (r.status !== 0) die(why);
}

// ---- offers and estimates ----
const CPUS = JSON.parse(fs.readFileSync('scripts/boxCpus.json', 'utf8')).cpus;
const cpuOf = (name) => CPUS.find((c) => new RegExp(c.match, 'i').test(name ?? '')) ?? { arch: '?', speed: 0.5, source: 'unknown' };
function estimate(o, runs, runS) {
  const c = cpuOf(o.cpu_name);
  const jobs = Math.max(1, Math.min(Math.floor(o.cpu_cores_effective) - 1, Math.floor(o.cpu_ram / 1024 / 0.6)));
  const h = (runs * runS) / (jobs * c.speed) / 3600 * TAIL + SETUP_H;
  // Ranges: measured ±10 %; guesses −20 % / +35 % on time; unknown CPUs wider still.
  const [lo, hi] = c.source === 'measured' ? [0.9, 1.1] : c.source === 'guess' ? [0.8, 1.35] : [0.6, 2];
  return { c, jobs, h, hLo: SETUP_H + (h - SETUP_H) * lo, hHi: SETUP_H + (h - SETUP_H) * hi, cost: h * o.dph_total, costLo: (SETUP_H + (h - SETUP_H) * lo) * o.dph_total, costHi: (SETUP_H + (h - SETUP_H) * hi) * o.dph_total };
}
function search({ minVcpu, maxDph, interruptible, disk }) {
  const q = `cpu_cores_effective>=${minVcpu} reliability>0.99 verified=true rentable=true dph_total<=${maxDph}`;
  return vast('search', 'offers', q, '--storage', String(disk), ...(interruptible ? ['--type', 'bid'] : []), '--limit', '200', '-o', 'dph_total');
}
function table(rows, runs, runS) {
  const f = (x, d = 2) => x.toFixed(d);
  console.log(`  ${'offer'.padEnd(9)} ${'$/h'.padStart(6)} vCPU jobs  ${'CPU'.padEnd(34)} ${'arch'.padEnd(13)} speed     hours        cost       rel   where`);
  for (const { o, e } of rows)
    console.log(`  ${String(o.id).padEnd(9)} ${f(o.dph_total, 3).padStart(6)} ${String(Math.floor(o.cpu_cores_effective)).padStart(4)} ${String(e.jobs).padStart(4)}  ${(o.cpu_name ?? '?').slice(0, 34).padEnd(34)} ${e.c.arch.padEnd(13)} ${f(e.c.speed)}${e.c.source === 'measured' ? 'm' : e.c.source === 'guess' ? 'g' : '?'}  ${f(e.hLo, 1)}–${f(e.hHi, 1)} h  $${f(e.costLo)}–${f(e.costHi)}  ${f(o.reliability2, 3)}  ${o.geolocation ?? ''}`);
  console.log(`  (${runs} runs × ${runS} s reference; speed m = measured, g = guessed by generation, ? = unknown; hours include ${SETUP_H} h set-up and ×${TAIL} for stage tails; rent with: box.mjs rent <offer> --yes)`);
}

if (cmd === 'offers') {
  const runs = num('--runs', NaN);
  if (!Number.isFinite(runs)) die('--runs N (job-slot runs of --run-s reference seconds) is required');
  const runS = num('--run-s', 270);
  const disk = num('--disk', 20);
  const offers = search({ minVcpu: num('--min-vcpu', 32), maxDph: num('--max-dph', 1), interruptible: flag('--interruptible'), disk });
  const rows = offers.map((o) => ({ o, e: estimate(o, runs, runS) })).sort((a, b) => a.e.cost - b.e.cost).slice(0, num('--limit', 15));
  console.log(`${offers.length} offers (on ${flag('--interruptible') ? 'interruptible' : 'on-demand'} terms, ${disk} GB disk), cheapest estimated total first:`);
  table(rows, runs, runS);
} else if (cmd === 'rent') {
  const id = argv[1];
  if (!id || !/^\d+$/.test(id)) die('rent <offer id> --yes');
  if (!flag('--yes')) die('renting spends the user\'s money: pass --yes only after the user approved this offer and its estimate');
  if (fs.existsSync(ENV) && /BOX_ID=/.test(fs.readFileSync(ENV, 'utf8'))) die(`${ENV} already names a box (BOX_ID); destroy it first or move the file`);
  const r = vast('create', 'instance', id, '--template_hash', TEMPLATE, '--disk', opt('--disk', '20'), '--ssh', '--direct');
  const iid = r.new_contract;
  if (!iid) die(`create failed: ${JSON.stringify(r)}`);
  console.log(`instance ${iid} created (success ${r.success}); waiting for it to run…`);
  let inst;
  for (let i = 0; i < 60; i++) {
    inst = vast('show', 'instance', String(iid));
    inst = Array.isArray(inst) ? inst[0] : inst;
    if (inst.actual_status === 'running') break;
    if (inst.intended_status === 'stopped' || /unavailable/i.test(inst.status_msg ?? '')) {
      spawnSync('vastai', ['destroy', 'instance', String(iid), '-y']);
      die(`offer ${id} could not start (${inst.status_msg ?? inst.intended_status}); instance ${iid} destroyed; pick another offer`);
    }
    execFileSync('sleep', ['10']);
  }
  if (inst.actual_status !== 'running') die(`instance ${iid} not running after 10 min (${inst.status_msg}); check it, or destroy it: vastai destroy instance ${iid} -y`);
  const direct = inst.ports?.['22/tcp']?.[0]?.HostPort;
  const ssh = direct ? `-p ${direct} root@${inst.public_ipaddr}` : `-p ${inst.ssh_port} root@${inst.ssh_host}`;
  fs.mkdirSync('logs', { recursive: true });
  fs.writeFileSync(ENV, `# Box for scripts/run.sh --box and scripts/box.mjs (local only). Written by box.mjs rent.\nBOX_SSH="${ssh}"\nBOX_DIR=${BOX_DIR}\nBOX_ID=${iid}\nBOX_OFFER=${id}\nBOX_CPU="${inst.cpu_name}"\nBOX_PRICE=${inst.dph_total}\nBOX_RENTED=${new Date().toISOString()}\nBOX_PROXY="-p ${inst.ssh_port} root@${inst.ssh_host}"\n`);
  const e = readEnv();
  for (let i = 0; i < 30 && onBox(e, 'echo up').out.trim() !== 'up'; i++) execFileSync('sleep', ['10']);
  console.log(`running: ${inst.cpu_name}, ${inst.cpu_cores_effective} vCPU, $${inst.dph_total.toFixed(3)}/h; ssh ${ssh}; ${ENV} written. Next: box.mjs setup`);
} else if (cmd === 'setup') {
  const e = readEnv();
  const v = opt('--node', '22.22.1');
  const local = spawnSync('node', ['-v'], { encoding: 'utf8' }).stdout.trim();
  if (local !== `v${v}`) console.log(`note: local Node is ${local}, box gets v${v}`);
  const files = [...new Set([
    ...execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n'),
    ...execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }).split('\n'),
    ...execFileSync('find', ['scripts/scratch', '-type', 'f'], { encoding: 'utf8' }).split('\n'),
  ])].filter((f) => f && fs.existsSync(f) && fs.statSync(f).isFile() && !NEVER.some((r) => r.test(f)));
  const sealed = fs.existsSync('.claude/sealed-paths.txt') ? fs.readFileSync('.claude/sealed-paths.txt', 'utf8').split('\n').filter((l) => l && !l.startsWith('#')) : [];
  const bad = files.filter((f) => sealed.some((s) => f.includes(s)));
  if (bad.length) die(`sealed paths in the file list: ${bad.join(', ')}`);
  const tar = spawnSync('tar', ['czf', '-', '-T', '-'], { input: files.join('\n'), maxBuffer: 1 << 30 });
  const cp = onBox(e, `mkdir -p ${e.BOX_DIR}/logs && cd ${e.BOX_DIR} && tar xzf - && echo copied`, tar.stdout);
  if (!cp.out.includes('copied')) die(`copy failed: ${cp.err}`);
  console.log(`copied ${files.length} files (${(tar.stdout.length / 1e6).toFixed(1)} MB)`);
  if (fs.existsSync('logs/notify.env')) onBox(e, `cat > ${e.BOX_DIR}/logs/notify.env`, fs.readFileSync('logs/notify.env'));
  const inst = onBox(e, `. /opt/nvm/nvm.sh >/dev/null && (nvm ls ${v} >/dev/null 2>&1 || nvm install ${v} >/dev/null 2>&1); ${NODE_ENV(v)} && node -v && which npx >/dev/null && npm ci --no-audit --no-fund >/dev/null 2>&1 && echo npm-ok`);
  if (!inst.out.includes('npm-ok')) die(`Node / npm ci failed: ${inst.out} ${inst.err}`);
  console.log(`Node ${inst.out.split('\n')[0]}, npm ci ok`);
  const sum = `find src/sim src/worker data/fits data/reference scripts/scratch scripts/s2018Lib.ts scripts/lib.ts package-lock.json -type f 2>/dev/null | LC_ALL=C sort | xargs md5sum`;
  const loc = execFileSync('bash', ['-c', sum], { encoding: 'utf8', maxBuffer: 1 << 28 }).split('\n').filter((l) => l && !NEVER.some((r) => r.test(l.split(/\s+/)[1])));
  const box = new Set(onBox(e, sum).out.split('\n').filter(Boolean));
  const diff = loc.filter((l) => !box.has(l));
  if (diff.length) die(`checksums differ for ${diff.length} files: ${diff.slice(0, 5).map((l) => l.split(/\s+/)[1]).join(', ')}`);
  console.log(`checksums match (${loc.length} files under src/sim, src/worker, data/fits, data/reference, scripts/scratch, …)`);
  const q = onBox(e, `if [ -r /sys/fs/cgroup/cpu.max ]; then cat /sys/fs/cgroup/cpu.max; else echo "$(cat /sys/fs/cgroup/cpu/cpu.cfs_quota_us) $(cat /sys/fs/cgroup/cpu/cpu.cfs_period_us)"; fi; lscpu | grep 'Model name' | sed 's/.*: *//'; free -g | awk '/Mem/{print $7}'`).out.trim().split('\n');
  const [quota, period] = q[0].split(' ');
  const cpus = quota === 'max' ? NaN : Number(quota) / Number(period);
  console.log(`CPU quota ${cpus.toFixed(1)} (${q[1]}), ${q[2]} GB free → jobs ${Math.floor(cpus) - 1} (one slot spare; SIM_WORKERS the same for pooled scripts)`);
} else if (cmd === 'bench') {
  // Standard run: colony 1 (≈ 170 s on the EPYC 7742 at 0.77, so ≈ 132 s on the reference box), C2's fit, 2 + 4 h,
  // light, seed 4242, observation only. Outputs are deleted afterwards.
  const e = readEnv();
  const q = onBox(e, `if [ -r /sys/fs/cgroup/cpu.max ]; then cat /sys/fs/cgroup/cpu.max; else echo "$(cat /sys/fs/cgroup/cpu/cpu.cfs_quota_us) $(cat /sys/fs/cgroup/cpu/cpu.cfs_period_us)"; fi`).out.trim().split(' ');
  const jobs = num('--jobs', q[0] === 'max' ? 8 : Math.floor(Number(q[0]) / Number(q[1])) - 1);
  const run = `npx vite-node scripts/scratch/tmpShortSim.ts --colony 1 --seed 4242 --trips --candidate C2 --fit data/fits/s2018-motion-c2.json --lite --noActivity`;
  const r = onBox(e, `${NODE_ENV(opt('--node', '22.22.1'))}; for i in $(seq 1 ${jobs}); do ( s=$(date +%s.%N); ${run} --tag bench-$i >/dev/null 2>&1 && echo "$s $(date +%s.%N)" ) & done; wait; rm -f logs/short/bench-*-c1.json`);
  const t = r.out.split('\n').filter((l) => /^\d/.test(l)).map((l) => { const [a, b] = l.split(' ').map(Number); return b - a; }).sort((a, b) => a - b);
  if (t.length < jobs) die(`bench: only ${t.length} of ${jobs} runs finished (${r.err.trim().slice(0, 200)})`);
  const med = t[Math.floor(t.length / 2)];
  const speed = 132 / med;
  console.log(`bench: ${jobs} runs at once, median ${med.toFixed(0)} s (min ${t[0].toFixed(0)}, max ${t[t.length - 1].toFixed(0)}) → speed ≈ ${speed.toFixed(2)} (EPYC 7742 = 0.77)`);
  if (opt('--out')) fs.writeFileSync(opt('--out'), String(speed));
} else if (cmd === 'ssh') {
  const e = readEnv();
  const i = argv.indexOf('--');
  const c = (i >= 0 ? argv.slice(i + 1) : argv.slice(1)).join(' ');
  const r = onBox(e, `${NODE_ENV(opt('--node', '22.22.1'))}; ${c}`);
  process.stdout.write(r.out);
  process.stderr.write(r.err);
  process.exit(r.code ?? 1);
} else if (cmd === 'status') {
  const e = readEnv();
  if (e.BOX_ID) {
    let i = vast('show', 'instance', e.BOX_ID);
    i = Array.isArray(i) ? i[0] : i;
    const h = (Date.now() - Date.parse(e.BOX_RENTED)) / 3.6e6;
    console.log(`instance ${e.BOX_ID}: ${i?.actual_status ?? 'gone'} (${i?.status_msg ?? ''}); ${e.BOX_CPU}; $${Number(e.BOX_PRICE).toFixed(3)}/h × ${h.toFixed(2)} h ≈ $${(h * e.BOX_PRICE).toFixed(2)} so far`);
  }
  const r = spawnSync('bash', ['scripts/run.sh', 'status', '--box'], { encoding: 'utf8', env: { ...process.env, ...e } });
  process.stdout.write(r.stdout + r.stderr.replace(/^(Welcome to vast\.ai|Have fun!|AI agents:).*\n/gm, ''));
} else if (cmd === 'pace') {
  // Throughput from output files' modification times only (never their content): blind-safe while a reading is pending.
  const e = readEnv();
  const glob = argv[1];
  if (!glob) die('pace <glob relative to the worktree>');
  const win = num('--window', 20);
  const r = onBox(e, `stat -c '%Y' ${glob} 2>/dev/null; echo now $(date +%s); nproc; ps -eo args | grep -c '^node.*[t]mpShortSim\\|^node.*[p]oolWorker'`).out.trim().split('\n');
  const now = Number(r.find((l) => l.startsWith('now')).split(' ')[1]);
  const ts = r.filter((l) => /^\d+$/.test(l)).map(Number).slice(0, -2);
  const recent = ts.filter((t) => t > now - win * 60);
  const jobs = num('--jobs', Number(r[r.length - 1]));
  const perH = (recent.length / win) * 60;
  const sPerRun = perH ? (jobs * 3600) / perH : NaN;
  console.log(`${ts.length} outputs; ${recent.length} in the last ${win} min → ${perH.toFixed(0)}/h with ${jobs} jobs busy → ≈ ${sPerRun.toFixed(0)} s per run (speed ≈ ${(num('--ref-s', 270) / sPerRun).toFixed(2)} of the reference, if these runs cost --ref-s there; valid only once the window starts after the first wave has finished)`);
} else if (cmd === 'market') {
  const e = readEnv();
  const left = num('--runs-left', NaN);
  if (!Number.isFinite(left)) die('--runs-left N is required (runs still to do, in --run-s reference units)');
  const runS = num('--run-s', 270);
  const price = Number(e.BOX_PRICE);
  const cur = cpuOf(e.BOX_CPU);
  const curJobs = num('--jobs', 60);
  const curH = (left * runS) / (curJobs * cur.speed) / 3600 * TAIL;
  const curCost = curH * price;
  // A switch costs set-up, the in-flight wave (≈ one run) and the rest of the current hour already paid.
  const switchH = SETUP_H + runS / cur.speed / 3600;
  const offers = search({ minVcpu: num('--min-vcpu', 32), maxDph: price * 2, interruptible: false, disk: 20 }).filter((o) => String(o.id) !== e.BOX_OFFER);
  const better = offers
    .map((o) => ({ o, e: estimate(o, left, runS) }))
    .map((x) => ({ ...x, total: x.e.cost + switchH * price, hTotal: x.e.h + switchH }))
    .filter((x) => x.total < 0.8 * curCost || (x.hTotal < 0.75 * curH && x.total <= 1.1 * curCost))
    .sort((a, b) => a.total - b.total)
    .slice(0, 8);
  console.log(`current: ${e.BOX_CPU} (${cur.source}, speed ${cur.speed}), ${curJobs} jobs, $${price.toFixed(3)}/h; ${left} runs left ≈ ${curH.toFixed(1)} h ≈ $${curCost.toFixed(2)}`);
  if (!better.length) console.log('no offer saves ≥ 20 %, or finishes ≥ 25 % sooner for ≤ 10 % more, after switching costs: stay');
  else {
    console.log(`offers worth considering (switching ≈ ${switchH.toFixed(2)} h on the current box included; report to the user, never switch without approval):`);
    table(better, left, runS);
  }
} else if (cmd === 'fetch') {
  const e = readEnv();
  const paths = argv.slice(1).filter((a, i, l) => !a.startsWith('--') && !['--env', '--list'].includes(l[i - 1]));
  if (!paths.length) die('fetch <path…> (relative to the worktree)');
  const q = paths.map((p) => `'${p.replace(/'/g, "'\\''")}'`).join(' ');
  const r = spawnSync('ssh', [...sshArgs(e), `cd ${e.BOX_DIR} && tar czf - ${q}`], { maxBuffer: 2 ** 31 });
  if (r.status !== 0) die(`fetch failed: ${r.stderr}`);
  spawnSync('tar', ['xzf', '-'], { input: r.stdout, maxBuffer: 2 ** 31 });
  const sum = `find ${q} -type f | LC_ALL=C sort | xargs md5sum`;
  const box = onBox(e, sum).out.split('\n').filter(Boolean);
  const loc = new Set(execFileSync('bash', ['-c', sum], { encoding: 'utf8', maxBuffer: 1 << 28 }).split('\n').filter(Boolean));
  const miss = box.filter((l) => !loc.has(l));
  if (miss.length) die(`${miss.length} of ${box.length} files differ after fetch: ${miss.slice(0, 5).join('; ')}`);
  // --list f: the fetched files, one per line (switch pushes exactly these).
  if (opt('--list')) fs.writeFileSync(opt('--list'), box.map((l) => l.replace(/^\S+\s+/, '')).join('\n') + '\n');
  console.log(`fetched ${box.length} files (${(r.stdout.length / 1e6).toFixed(1)} MB compressed), md5-checked`);
} else if (cmd === 'push') {
  const e = readEnv();
  const paths = argv.slice(1).filter((a, i, l) => !a.startsWith('--') && !['--env', '--from-list'].includes(l[i - 1]));
  if (!paths.length && !opt('--from-list')) die('push <path…> | --from-list f (relative to the local tree)');
  const files = (opt('--from-list') ? fs.readFileSync(opt('--from-list'), 'utf8') : execFileSync('find', [...paths, '-type', 'f'], { encoding: 'utf8' })).split('\n').filter((f) => f && !NEVER.slice(0, 4).some((r) => r.test(f)));
  const tar = spawnSync('tar', ['czf', '-', '-T', '-'], { input: files.join('\n'), maxBuffer: 2 ** 31 });
  const cp = onBox(e, `mkdir -p ${e.BOX_DIR} && cd ${e.BOX_DIR} && tar xzf - && echo copied`, tar.stdout);
  if (!cp.out.includes('copied')) die(`push failed: ${cp.err}`);
  const sum = (l) => `printf '%s\\n' ${l.map((f) => `'${f.replace(/'/g, "'\\''")}'`).join(' ')} | xargs md5sum`;
  const loc = execFileSync('bash', ['-c', sum(files)], { encoding: 'utf8', maxBuffer: 1 << 28 }).split('\n').filter(Boolean);
  const box = new Set(onBox(e, sum(files)).out.split('\n').filter(Boolean));
  const miss = loc.filter((l) => !box.has(l));
  if (miss.length) die(`${miss.length} of ${loc.length} files differ after push: ${miss.slice(0, 5).join('; ')}`);
  console.log(`pushed ${loc.length} files (${(tar.stdout.length / 1e6).toFixed(1)} MB compressed), md5-checked`);
} else if (cmd === 'destroy') {
  const e = readEnv();
  if (!flag('--yes')) die('destroy deletes everything on the box: fetch what is needed first, then pass --yes');
  if (!flag('--force')) {
    const s = spawnSync('bash', ['scripts/run.sh', 'status', '--box'], { encoding: 'utf8', env: { ...process.env, ...readEnv() } });
    if (s.status !== 0) die(`cannot read run status on the box (${s.stderr.trim()}); --force to destroy anyway`);
    if (/\brunning\b/.test(s.stdout)) die(`a run is still running on the box:\n${s.stdout}--force to destroy anyway`);
  }
  if (!e.BOX_ID) die(`${ENV} has no BOX_ID (box not rented by box.mjs): destroy it from vast.ai, then move ${ENV}`);
  const r = spawnSync('vastai', ['destroy', 'instance', e.BOX_ID, '-y'], { encoding: 'utf8' });
  if (r.status !== 0) die(`destroy failed: ${r.stdout}${r.stderr}`);
  const h = (Date.now() - Date.parse(e.BOX_RENTED)) / 3.6e6;
  fs.renameSync(ENV, `logs/box.env.${e.BOX_ID}.destroyed`);
  console.log(`destroyed instance ${e.BOX_ID} after ${h.toFixed(2)} h ≈ $${(h * e.BOX_PRICE).toFixed(2)}; ${ENV} → logs/box.env.${e.BOX_ID}.destroyed${ENV !== 'logs/box.env' ? ' (move the next box\'s file to logs/box.env for run.sh --box)' : ''}`);
} else if (cmd === 'finish') {
  const e = readEnv();
  const run = opt('--run');
  const paths = argv.flatMap((a, i) => (a === '--fetch' ? [argv[i + 1]] : []));
  if (!run || !paths.length) die('finish --run <run id> --fetch <path> … [--destroy]');
  if (onBox(e, `test -d logs/runs/${run}`).code !== 0) die(`no run ${run} on the box`);
  console.log(`${new Date().toISOString()} waiting for ${run} on instance ${e.BOX_ID}`);
  // run.sh wait --box retries on lost connections; a stopped (outbid) box just keeps it waiting.
  spawnSync('bash', ['scripts/run.sh', 'wait', '--box', run], { stdio: 'inherit', env: { ...process.env, BOX_SSH: e.BOX_SSH, BOX_DIR: e.BOX_DIR } });
  const x = onBox(e, `cat logs/runs/${run}/exit 2>/dev/null || echo none; test -e logs/runs/${run}/killed && echo killed`).out.trim();
  const code = x.split(/\s+/)[0];
  if (code !== '0' || /killed/.test(x)) die(`${run} ended with "${x.replace(/\n/g, ' ')}": nothing fetched, box kept (look at logs/runs/${run}/log on the box)`);
  const keep = `the box is kept: ${e.BOX_SSH}`;
  runStep('fetch', ['fetch', ...paths, `logs/runs/${run}`, '--env', ENV], `fetch failed; ${keep}`);
  if (!flag('--destroy')) { console.log(`fetched; box kept (no --destroy): destroy it with box.mjs destroy --yes${ENV !== 'logs/box.env' ? ` --env ${ENV}` : ''}`); process.exit(0); }
  runStep('destroy', ['destroy', '--yes', '--env', ENV], `destroy failed; ${keep}`);
} else if (cmd === 'switch') {
  // Each step is this script's own command in a child process, so a failing step stops the switch with its message.
  const offer = argv[1];
  if (!offer || !/^\d+$/.test(offer)) die('switch <offer id> --yes --run <run id> --carry <path> …');
  if (!flag('--yes')) die('switching rents a box: pass --yes only after the user approved this offer and its estimate');
  const OLD = 'logs/box.env';
  const NEXT = 'logs/box.next.env';
  if (fs.existsSync(NEXT)) die(`${NEXT} exists: a switch is half done (finish or destroy that box first)`);
  const old = readEnv();
  if (!old.BOX_ID) die(`${OLD} has no BOX_ID`);
  const run = opt('--run');
  const carry = argv.flatMap((a, i) => (a === '--carry' ? [argv[i + 1]] : []));
  if (!run || !carry.length) die('--run <run id> and at least one --carry <path> are required');
  const oldCmd = onBox(old, `cat logs/runs/${run}/cmd`);
  if (oldCmd.code !== 0) die(`no run ${run} on the current box`);
  const relaunch = opt('--relaunch', oldCmd.out.trim());
  const name = run.replace(/-\d{8}T\d{6}Z$/, '');
  const step = (label, ...a) => runStep(label, a, `switch stopped at "${label}". ${label.startsWith('rent') || label.startsWith('set up') ? `The old box and its run are untouched; destroy the new one with: box.mjs destroy --yes --force --env ${NEXT}` : `The run on the old box is stopped, and neither box is destroyed: finish by hand (docs/BOX.md, Switching boxes)`}`);
  const t0 = Date.now();
  step(`rent ${offer}`, 'rent', offer, '--yes', '--env', NEXT, ...(opt('--disk') ? ['--disk', opt('--disk')] : []));
  step('set up the new box', 'setup', '--env', NEXT);
  const minSpeed = num('--min-speed', 1.2 * cpuOf(old.BOX_CPU).speed);
  const sf = `logs/box-bench-${Date.now()}.txt`;
  step('bench the new box', 'bench', '--env', NEXT, '--out', sf);
  const sp = Number(fs.readFileSync(sf, 'utf8'));
  if (!(sp >= minSpeed)) {
    spawnSync('node', ['scripts/box.mjs', 'destroy', '--yes', '--force', '--env', NEXT], { stdio: 'inherit' });
    die(`new box benched at speed ${sp.toFixed(2)} < ${minSpeed.toFixed(2)}: destroyed it; the old box and its run are untouched`);
  }
  console.log(`— stop ${run} on the old box`);
  const k = onBox(old, `bash scripts/run.sh kill ${run}`);
  console.log(k.out.trim());
  const list = `logs/box-switch-${old.BOX_ID}.files`;
  step('fetch from the old box', 'fetch', ...carry, '--list', list);
  step('push to the new box', 'push', '--from-list', list, '--env', NEXT);
  const next = readEnvFile(NEXT);
  console.log(`— relaunch: ${relaunch}`);
  const st = onBox(next, `bash scripts/run.sh start ${name} -- ${relaunch}`);
  console.log(st.out.trim());
  if (st.code !== 0) die(`relaunch failed (${st.err.trim()}); the old box is kept: finish by hand`);
  step('destroy the old box', 'destroy', '--yes');
  fs.renameSync(NEXT, OLD);
  console.log(`switched in ${((Date.now() - t0) / 60000).toFixed(1)} min: ${next.BOX_CPU}, $${Number(next.BOX_PRICE).toFixed(3)}/h; ${OLD} now names it. Start pace windows after the relaunch (carried files keep their times).`);
} else {
  console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 28).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
  if (cmd) process.exit(1);
}
