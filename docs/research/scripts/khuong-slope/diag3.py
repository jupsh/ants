import sys, math
sys.path.insert(0, sys.argv[1])
from load import *
from collections import defaultdict
D = sys.argv[2]
def kurt(a):
    n = len(a); 
    if n < 20: return float('nan')
    m = sum(a)/n; v = sum((x-m)**2 for x in a)/n
    return sum((x-m)**4 for x in a)/n/v/v
SB = [(2,8),(8,15),(15,25),(25,40),(40,80)]
DB = [(0.4,1),(1,2),(2,4),(4,8),(8,16),(16,40)]
for k in range(1, 6):
    trs = load(f'{D}/incline{k}.csv.gz')
    al = defaultdict(lambda: [0.0, 0.0, 0]); al_sess = defaultdict(lambda: [0.0, 0])
    c5 = defaultdict(list); c50 = defaultdict(list); ti = defaultdict(list)
    rad = defaultdict(list); ret_in = 0; tot_after = 0
    for name, tr in trs:
        t, x, y, _ = prep(tr)
        n = len(x)
        if n < 10: continue
        sp = [math.hypot(x[min(i+5,n-1)]-x[i], y[min(i+5,n-1)]-y[i])/0.2 for i in range(n)]
        # (a) alignment vs displacement length, several windows
        for w in (2, 5, 10, 20, 40):
            for i in range(0, n-w, 1):
                dx = x[i+w]-x[i]; dy = y[i+w]-y[i]; d = math.hypot(dx, dy)
                if d/(w*0.04) < 2: continue
                for lo, hi in DB:
                    if lo <= d < hi:
                        h = math.atan2(dy, dx); a = al[(lo,hi)]; a[0] += -math.cos(2*h); a[1] += -math.sin(2*h); a[2] += 1
        for i in range(0, n-5):
            if sp[i] >= 2:
                h = math.atan2(y[i+5]-y[i], x[i+5]-x[i]); s = al_sess[tr['colony']+name.split('-')[1][:8]]; s[0] += -math.cos(2*h); s[1] += 1
        # (b) arc-length resampling on moving samples
        P = [(x[0], y[0], sp[0])]; acc = 0.0
        for i in range(1, n):
            if sp[i] < 2: continue
            seg = math.hypot(x[i]-x[i-1], y[i]-y[i-1]); acc += seg
            while acc >= 0.5:
                f = 1 - (acc-0.5)/seg if seg > 0 else 1
                P.append((x[i-1]+(x[i]-x[i-1])*f, y[i-1]+(y[i]-y[i-1])*f, sp[i])); acc -= 0.5
        m = len(P)
        H = [math.atan2(P[j+5][1]-P[j][1], P[j+5][0]-P[j][0]) for j in range(m-5)]  # 2.5 mm chords
        for j in range(0, len(H)-100, 2):
            v = P[j][2]
            for lo, hi in SB:
                if lo <= v < hi:
                    c5[(lo,hi)].append(math.cos(H[j+10]-H[j]))
                    c50[(lo,hi)].append(math.cos(H[j+100]-H[j]))
                    d = H[j+5]-H[j]; d = (d+math.pi)%(2*math.pi)-math.pi
                    ti[(lo,hi)].append(d)
        # (c) radial velocity and returns
        reached = False
        for i in range(n-5):
            r = math.hypot(x[i], y[i])
            if r > 100: reached = True
            if reached:
                tot_after += 1
                if r < 100: ret_in += 1
            if r < 1 or sp[i] < 2: continue
            vr = ((x[i+5]-x[i])*x[i] + (y[i+5]-y[i])*y[i])/r/0.2
            for lo, hi in ((10,40),(40,70),(70,100),(100,150),(150,200)):
                if lo <= r < hi: rad[(lo,hi)].append(vr)
    print(f'=== incline {k} ({math.degrees(INC[k]):.0f} deg)')
    print('  alignment -<cos2h> by displacement length d (mm): ' + '; '.join(f'{lo}-{hi}: {a[0]/a[2]:.3f} (axis {math.degrees(0.5*math.atan2(a[1],a[0])):.0f}deg, n={a[2]})' for (lo,hi), a in sorted(al.items())))
    print('  alignment by session: ' + ', '.join(f'{s}: {v[0]/v[1]:.3f} (n={v[1]})' for s, v in sorted(al_sess.items())))
    print('  by speed bin (mm/s): <cos> at 5mm | at 50mm | kurtosis of 2.5mm-chord turn increment (Gaussian=3) | n')
    for b in SB:
        if len(c5[b]) > 50:
            print(f'    {b}: {sum(c5[b])/len(c5[b]):.3f} | {sum(c50[b])/len(c50[b]):.3f} | {kurt(ti[b]):.2f} | {len(c5[b])}')
    print('  mean radial velocity (mm/s) by r bin: ' + ', '.join(f'{lo}-{hi}: {sum(v)/len(v):+.2f}' for (lo,hi), v in sorted(rad.items())))
    print(f'  fraction of samples after first reaching r>100mm that are back inside 100mm: {ret_in/max(1,tot_after):.3f}')
