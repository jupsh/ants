# Noise, speed quantiles, between/within decomposition, speed-vs-incline fits
import sys, math
sys.path.insert(0, sys.argv[1])
from load import *
D = sys.argv[2]
rows = []
for k in range(1, 6):
    trs = load(f'{D}/incline{k}.csv.gz')
    # 1. noise from raw second differences where slow (smoothed 0.2s speed < 3 mm/s)
    sx = sy = 0.0; n = 0; ac_num = ac_den = 0.0
    speeds = []; per_ant_med = []; resid = []
    for name, tr in trs:
        X, Y, T = tr['x'], tr['y'], tr['t']
        xs, ys = smooth(X, 5), smooth(Y, 5)
        d2x_prev = None
        for i in range(3, len(X)-3):
            v = math.hypot(xs[i+3]-xs[i-2], ys[i+3]-ys[i-2]) / 0.2
            if v < 3.0:
                d2x = X[i+1]-2*X[i]+X[i-1]; d2y = Y[i+1]-2*Y[i]+Y[i-1]
                sx += d2x*d2x; sy += d2y*d2y; n += 1
        t, x, y, _ = prep(tr)
        sp = []
        for i in range(len(x)-5):
            v = math.hypot(x[i+5]-x[i], y[i+5]-y[i]) / 0.2
            if v >= 2.0: sp.append(v)
        if len(sp) > 10:
            speeds += sp
            m = quant(sp, 0.5); per_ant_med.append(m)
            lm = math.log(m)
            resid += [math.log(v)-lm for v in sp]
    sigx = math.sqrt(sx/n/6) if n else float('nan'); sigy = math.sqrt(sy/n/6) if n else float('nan')
    p10, p50, p90 = quant(speeds, .1), quant(speeds, .5), quant(speeds, .9)
    lsd_w = math.sqrt(sum(r*r for r in resid)/len(resid))
    lm = [math.log(m) for m in per_ant_med]; mu = sum(lm)/len(lm)
    lsd_b = math.sqrt(sum((v-mu)**2 for v in lm)/(len(lm)-1))
    rows.append((k, INC[k], p10, p50, p90))
    print(f'incline {k} ({math.degrees(INC[k]):.0f} deg): noise sigma_x={sigx:.3f} sigma_y={sigy:.3f} mm (n={n} slow samples)')
    print(f'   moving speed p10={p10:.1f} p50={p50:.1f} p90={p90:.1f}  p90/p50={p90/p50:.2f} p10/p50={p10/p50:.2f}')
    print(f'   per-ant median moving speed: q25={quant(per_ant_med,.25):.1f} q50={quant(per_ant_med,.5):.1f} q75={quant(per_ant_med,.75):.1f}; between-ant SD(log)={lsd_b:.3f}; within-ant SD(log)={lsd_w:.3f}; N ants={len(per_ant_med)}')
# fits of p50 ratio vs incline
v0 = rows[0][3]
print('\nmedian ratio vs forms:')
for k, th, a, b, c in rows:
    print(f'  {math.degrees(th):4.0f} deg ratio={b/v0:.3f}  1-k*theta(k fit at 60)= ?  sin={math.sin(th):.3f} ')
import itertools
def sse(f):
    return sum((b/v0 - f(th))**2 for k, th, a, b, c in rows)
best = {}
for name, fam in [('1-k*theta', lambda k: (lambda th: 1-k*th)), ('1-k*sin', lambda k: (lambda th: 1-k*math.sin(th))), ('exp(-k*theta)', lambda k: (lambda th: math.exp(-k*th))), ('exp(-k*sin)', lambda k: (lambda th: math.exp(-k*math.sin(th)))), ('cos^k', lambda k: (lambda th: math.cos(th)**k))]:
    ks = [i/1000 for i in range(1, 5000)]
    kb = min(ks, key=lambda k: sse(fam(k)))
    print(f'  {name:14s} k={kb:.3f} rmse={math.sqrt(sse(fam(kb))/5):.4f}  pred={[round(fam(kb)(r[1]),3) for r in rows]}')
