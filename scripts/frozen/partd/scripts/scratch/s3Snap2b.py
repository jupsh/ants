# Scratch (not committed): Part D Stage 2b, one simulated run through the frozen S3 audit (s3Audit.py, D129) with the
# run's own onset snapshots (--snap runs store them per phase): writes the light-phase snapshots in snapData.ts's format,
# runs s3Audit.py --snap on them, then deletes the snapshot file. Without snapshots in the run: --require-snap fails,
# else s3Audit.py runs without --snap (primary statistics only; the Part C dry run).
#   python3 -I s3Snap2b.py <set>=<file> --out <dir> --snapdir <dir> [--require-snap]
import json, os, subprocess, sys

args = sys.argv[1:]
spec = [a for a in args if '=' in a and not a.startswith('--')][0]
out, sd = args[args.index('--out') + 1], args[args.index('--snapdir') + 1]
f = spec.split('=', 1)[1]
d = json.load(open(f))
cmd = [sys.executable, '-I', os.path.join(os.path.dirname(os.path.abspath(__file__)), 's3Audit.py'), spec, '--out', out]
snaps = (d.get('snaps') or {}).get('light')
p = None
if snaps is not None:
    os.makedirs(sd, exist_ok=True)
    p = os.path.join(sd, os.path.basename(f))
    json.dump({'colony': d.get('colony'), 'snaps': snaps}, open(p, 'w'))
    cmd += ['--snap', p]
elif '--require-snap' in args:
    sys.exit(f'{f}: no light-phase snapshots')
del d, snaps
code = subprocess.call(cmd)
if p and code == 0: os.remove(p)
sys.exit(code)
