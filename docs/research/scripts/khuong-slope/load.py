import gzip, csv, math, sys
from collections import defaultdict, OrderedDict
INC = {1: 0.0, 2: math.pi/9, 3: math.pi/6, 4: math.pi/4, 5: math.pi/3}
def load(path):
    tracks = OrderedDict()
    with gzip.open(path, 'rt') as f:
        r = csv.reader(f); next(r)
        for row in r:
            key = row[1] + '-' + row[4]
            if key not in tracks:
                tracks[key] = {'colony': row[1], 'inc': int(row[0]), 't': [], 'x': [], 'y': []}
            tr = tracks[key]
            tr['t'].append(float(row[5])); tr['x'].append(float(row[6])); tr['y'].append(float(row[7]))
    return list(tracks.items())
def smooth(a, w=3):
    h = w//2; n = len(a); out = [0.0]*n
    for i in range(n):
        lo = max(0, i-h); hi = min(n-1, i+h)
        out[i] = sum(a[lo:hi+1])/(hi-lo+1)
    return out
def prep(tr, start=10.0, end=200.0):
    x = smooth(tr['x']); y = smooth(tr['y']); t = tr['t']
    ox, oy = x[0], y[0]
    s = 0
    while s < len(x) and math.hypot(x[s]-ox, y[s]-oy) < start: s += 1
    e = s
    while e < len(x) and math.hypot(x[e]-ox, y[e]-oy) <= end: e += 1
    return t[s:e], [v-ox for v in x[s:e]], [v-oy for v in y[s:e]], (s, e)
def quant(a, q):
    a = sorted(a); 
    if not a: return float('nan')
    k = (len(a)-1)*q; f = int(k); c = min(f+1, len(a)-1)
    return a[f] + (a[c]-a[f])*(k-f)
