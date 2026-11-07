# Scratch (STATUS 2026-10-17 ≈ 05:57 UTC reading, amending 05:55): spread of movement onsets within episodes and contacts
# before onset. Per set (data or a simulated arm) and phase:
#   Test A: episodes (onsets in time order; a gap > 10 frames ends one; >= 3 distinct ants; each ant's first onset;
#     initiator = first). Per episode Spearman rho(distance from initiator, lag after it) over the other participants;
#     mean over episodes per colony. Null 1: onset times permuted among the episode's participants (1000 per episode,
#     initiator = earliest after permutation). Null 2: distances from the initiator positions of 20 other episodes of
#     the same colony and phase (lags kept). Partial rho adding each ant's leave-one-episode-out mean normalised rank.
#     Mean lag by distance band from the initiator (description; distance / lag as a speed).
#   Test B: Mantel-Haenszel risk ratio of onset within 2 s, exposed (contacted by a mover while still) vs unexposed,
#     over the 12 strata (distance to recent onset x colony onsets in the last 10 frames), pooled over colonies.
#   Colony bootstrap (2000) for every difference and the risk ratio.
#   python3 -I spreadAgg.py <set>=<glob> ... [--phase light|dark] [--perms 1000]
import glob, json, math, random, sys
args = [a for a in sys.argv[1:] if not a.startswith('--')]
opt = {sys.argv[i]: sys.argv[i + 1] for i in range(1, len(sys.argv) - 1) if sys.argv[i].startswith('--')}
PH = opt.get('--phase', 'light'); PERMS = int(opt.get('--perms', 1000))
args = [a for a in args if a not in opt.values()]
random.seed(53)
GAP, BANDS = 10, [5, 10, 20, 40]

def ranks(v):
    o = sorted(range(len(v)), key=lambda i: v[i]); r = [0.0] * len(v); i = 0
    while i < len(o):
        j = i
        while j + 1 < len(o) and v[o[j + 1]] == v[o[i]]: j += 1
        for k in range(i, j + 1): r[o[k]] = (i + j) / 2
        i = j + 1
    return r
def pearson(a, b):
    n = len(a); ma = sum(a) / n; mb = sum(b) / n
    sab = sum((x - ma) * (y - mb) for x, y in zip(a, b)); saa = sum((x - ma) ** 2 for x in a); sbb = sum((y - mb) ** 2 for y in b)
    return sab / math.sqrt(saa * sbb) if saa > 0 and sbb > 0 else float('nan')
def spear(a, b): return pearson(ranks(a), ranks(b))

def episodes(ev):
    E = sorted((ev[k], ev[k + 1], ev[k + 2], ev[k + 3]) for k in range(0, len(ev), 5))
    out, cur = [], []
    for e in E:
        if cur and e[0] - cur[-1][0] > GAP:
            out.append(cur); cur = []
        cur.append(e)
    if cur: out.append(cur)
    res = []
    for ep in out:
        first = {}
        for f, i, x, y in ep:
            if i not in first: first[i] = (f, i, x, y)
        if len(first) >= 3: res.append(sorted(first.values()))
    return res

def rho_ep(ep, ref=None):
    f0, _, x0, y0 = ep[0]
    if ref: x0, y0 = ref
    rest = ep[1:]
    return spear([math.hypot(x - x0, y - y0) for _, _, x, y in rest], [f - f0 for f, _, _, _ in rest])

def colonyA(ev):
    eps = episodes(ev)
    if len(eps) < 5: return None
    obs, n1, n2, part = [], [], [], []
    # usual earliness: normalised rank of each ant within each episode
    rk = {}
    for k, ep in enumerate(eps):
        for r, e in enumerate(ep): rk.setdefault(e[1], []).append((k, r / (len(ep) - 1)))
    lagb, lagn = [0.0] * 5, [0] * 5
    for k, ep in enumerate(eps):
        r = rho_ep(ep)
        if r != r: continue
        obs.append(r)
        f0, _, x0, y0 = ep[0]
        for f, _, x, y in ep[1:]:
            d = math.hypot(x - x0, y - y0); b = sum(d >= t for t in BANDS); lagb[b] += f - f0; lagn[b] += 1
        # null 1: permute onset frames among participants
        fr = [e[0] for e in ep]; s = []
        for _ in range(PERMS):
            random.shuffle(fr)
            p = sorted((fr[j], random.random(), ep[j][1], ep[j][2], ep[j][3]) for j in range(len(ep)))
            q = rho_ep([(a, i, x, y) for a, _, i, x, y in p])
            if q == q: s.append(q)
        if s: n1.append(sum(s) / len(s))
        # null 2: initiator positions of 20 other episodes
        others = [o for o in random.sample(range(len(eps)), min(len(eps), 21)) if o != k][:20]
        s2 = [rho_ep(ep, (eps[o][0][2], eps[o][0][3])) for o in others]
        s2 = [q for q in s2 if q == q]
        if s2: n2.append(sum(s2) / len(s2))
        # partial rho, controlling for each participant's leave-one-episode-out mean rank
        rest = ep[1:]
        if len(rest) >= 4:
            ern = []
            for _, i, _, _ in rest:
                v = [rr for kk, rr in rk[i] if kk != k]
                ern.append(sum(v) / len(v) if v else float('nan'))
            if all(e == e for e in ern):
                D = ranks([math.hypot(x - x0, y - y0) for _, _, x, y in rest]); L = ranks([f - f0 for f, _, _, _ in rest]); Z = ranks(ern)
                rdl, rdz, rlz = pearson(D, L), pearson(D, Z), pearson(L, Z)
                if all(v == v for v in (rdl, rdz, rlz)) and abs(rdz) < 1 and abs(rlz) < 1:
                    part.append((rdl - rdz * rlz) / math.sqrt((1 - rdz ** 2) * (1 - rlz ** 2)))
    m = lambda v: sum(v) / len(v) if v else float('nan')
    return {'obs': m(obs), 'n1': m(n1), 'n2': m(n2), 'part': m(part), 'eps': len(obs), 'lagb': lagb, 'lagn': lagn}

def boot(v, B=2000):
    v = [x for x in v if x == x]
    if len(v) < 3: return float('nan'), float('nan'), float('nan')
    m = lambda s: sum(s) / len(s)
    bs = sorted(m([random.choice(v) for _ in v]) for _ in range(B))
    return m(v), bs[int(.025 * B)], bs[int(.975 * B)]

def mh(tabs):
    num = den = 0.0
    for nE, yE, nU, yU in tabs:
        N = nE + nU
        if N == 0: continue
        num += yE * nU / N; den += yU * nE / N
    return num / den if den > 0 else float('nan')

DUMP = {}  # --dump f (Part C, D118): per-colony Test A values by set, for the separation reader
for spec in args:
    name, pat = spec.split('=', 1)
    cols = []; labs = []
    for f in sorted(glob.glob(pat)):
        d = json.load(open(f)); o = (d.get('onsets') or {}).get(PH)
        if o: cols.append(o); labs.append(d.get('colony', f))
    if not cols: print(f'{name}: no files'); continue
    AL = [(l, a) for l, a in ((l, colonyA(o['events'])) for l, o in zip(labs, cols)) if a]
    A = [a for _, a in AL]
    DUMP[name] = [{'colony': l, 'obs': a['obs'], 'n1': a['n1'], 'n2': a['n2'], 'part': a['part'], 'lagb': a['lagb'], 'lagn': a['lagn'], 'eps': a['eps']} for l, a in AL]
    ob, n1, n2, pa = boot([a['obs'] for a in A]), boot([a['obs'] - a['n1'] for a in A]), boot([a['obs'] - a['n2'] for a in A]), boot([a['part'] for a in A])
    lagb = [sum(a['lagb'][b] for a in A) for b in range(5)]; lagn = [sum(a['lagn'][b] for a in A) for b in range(5)]
    tabs = [[sum(o['risk'][s][j] for o in cols) for j in range(4)] for s in range(12)]
    rr = mh(tabs); bs = []
    for _ in range(2000):
        S = [random.choice(cols) for _ in cols]
        bs.append(mh([[sum(o['risk'][s][j] for o in S) for j in range(4)] for s in range(12)]))
    bs = sorted(x for x in bs if x == x)
    print(f'== {name} ({PH}; {len(A)} colonies, {sum(a["eps"] for a in A)} episodes)')
    print(f'  A  rho {ob[0]:+.3f} [{ob[1]:+.3f}, {ob[2]:+.3f}]   rho − null1 {n1[0]:+.3f} [{n1[1]:+.3f}, {n1[2]:+.3f}]   rho − null2 {n2[0]:+.3f} [{n2[1]:+.3f}, {n2[2]:+.3f}]   partial {pa[0]:+.3f} [{pa[1]:+.3f}, {pa[2]:+.3f}]')
    print('     mean lag (frames) by distance from initiator <5/5-10/10-20/20-40/>=40 mm: ' + ' '.join(f'{lagb[b] / lagn[b]:.1f}' if lagn[b] else 'nan' for b in range(5)) + '   n ' + ' '.join(str(x) for x in lagn))
    nE = sum(t[0] for t in tabs); yE = sum(t[1] for t in tabs); nU = sum(t[2] for t in tabs); yU = sum(t[3] for t in tabs)
    print(f'  B  MH risk ratio {rr:.2f} [{bs[int(.025 * len(bs))]:.2f}, {bs[int(.975 * len(bs))]:.2f}]   crude: exposed {yE}/{nE} = {yE / max(1, nE):.4f}, unexposed {yU}/{nU} = {yU / max(1, nU):.5f}')
clean = lambda x: (None if isinstance(x, float) and x != x else [clean(y) for y in x] if isinstance(x, list) else {k: clean(v) for k, v in x.items()} if isinstance(x, dict) else x)
if opt.get('--dump'): json.dump(clean(DUMP), open(opt['--dump'], 'w'))  # NaN → null (valid JSON)
