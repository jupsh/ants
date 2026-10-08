import sys, math
sys.path.insert(0, sys.argv[1])
from load import *
from collections import defaultdict
D = sys.argv[2]
for k in range(1, 6):
    trs = load(f'{D}/incline{k}.csv.gz')
    sess = defaultdict(list); sect = defaultdict(list); stopped = 0; total = 0
    netdy = []
    for name, tr in trs:
        t, x, y, _ = prep(tr)
        sp = []
        for i in range(len(x)-5):
            dx = x[i+5]-x[i]; dy = y[i+5]-y[i]
            v = math.hypot(dx, dy)/0.2; total += 1
            if v < 2: stopped += 1; continue
            sp.append(v)
            h = math.atan2(dy, dx)
            s = 'up(+y)' if abs(h-math.pi/2) < math.pi/4 else ('down(-y)' if abs(h+math.pi/2) < math.pi/4 else 'horiz')
            sect[s].append(v)
        if len(sp) > 10: sess[tr['colony']+':'+name.split('-')[1][:8]].append(quant(sp, .5))
        if y: netdy.append(y[-1])
    print(f'incline {k}: stopped frac={stopped/total:.3f}; median speed by heading: ' + ', '.join(f'{s}={quant(v,.5):.1f}(n={len(v)})' for s, v in sorted(sect.items())))
    print('   per-session median of per-ant medians: ' + ', '.join(f'{s}={quant(v,.5):.1f}(n={len(v)})' for s, v in sorted(sess.items())))
    up = sum(1 for v in netdy if v > 0); print(f'   exits with final y>0: {up}/{len(netdy)}')
