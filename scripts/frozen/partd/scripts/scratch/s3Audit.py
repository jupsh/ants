# Scratch (not committed): Part D Stage 0, the S3 audit (D126 amendment 1, frozen there). One file (a data colony or one
# simulated run) per process; `onsets.light` events (or `events` of a snap file). Per episode (episodes as built in
# spreadAgg.py: onsets in time order, a gap > GAP frames ends one, each ant's first onset, >= 3 distinct ants):
#   S3-slope: OLS with an intercept of lag (frames) on distance (mm, per 10 mm) over the participants EXCLUDING the
#     initiator; tied earliest onsets: the mean over the tied candidates, undefined if any candidate's slope is (the
#     same rule inside every null-1 permutation, D129). Minus its null-1 expectation (onset frames permuted among
#     participants; >= 90 % of PERMS defined) -> s1; minus its null-2 expectation (the reference-position control:
#     positions of 20 other episodes' initiators, a tied reference drawn uniformly; >= 15 defined; fewer than 20
#     available references -> undefined) -> s2. `w`: the episode's spread weight (spread-weighted sensitivity only).
#   S3-pair: Spearman of pairwise |lag| on pairwise distance over all participants, minus its null-1 expectation.
#   S3-raw (as built, continuity): band lag sums / counts from ep[0] (ant-index order), with null-1 (initiator uniform
#     among the earliest, as built) and null-2 expected sums and counts (separate comparisons, not a decomposition).
#   With --snap (data only): (b) detection-complete flag, (c) distances at the initiator's onset frame (s1c, s2c), S3-p
#     (response shares by band, observed and null 2), from snapData.ts snapshots, on their own stream (Random(530)).
# Seeds: random.Random(53) per file (primary), random.Random(530) (snapshot statistics).
#   python3 -I s3Audit.py <set>=<file> --out <dir> [--snap <file>] [--perms n]
import json, math, os, random, sys

GAP, BANDS, NREF, VAR_MIN = 10, [5, 10, 20, 40], 20, 1e-6
PERMS = 1000
NULL1_MIN, NULL2_MIN, MIN_PART = 0.9, 15, 3


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


def band(d): return sum(d >= t for t in BANDS)
def mean(v): return sum(v) / len(v) if v else None


def slope(d, l):
    n = len(d)
    if n < MIN_PART: return None
    md, ml = sum(d) / n, sum(l) / n
    sdd = sum((x - md) ** 2 for x in d)
    if sdd / (n - 1) <= VAR_MIN: return None
    return 10 * sum((x - md) * (y - ml) for x, y in zip(d, l)) / sdd


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
    return sab / math.sqrt(saa * sbb) if saa > 0 and sbb > 0 else None


def dist(a, b): return math.hypot(a[0] - b[0], a[1] - b[1])


def slope_from(ep, frames, c, ref, pos=None):
    """Slope over participants j != c: lag frames[j] - frames[c], distance from `ref` to j's position (pos[j] if given)."""
    d, l = [], []
    for j, e in enumerate(ep):
        if j == c: continue
        p = (e[2], e[3]) if pos is None else pos[j]
        if p is None: continue
        d.append(dist(p, ref)); l.append(frames[j] - frames[c])
    return slope(d, l)


def tie_slope(ep, frames, cands, ref_of, pos=None):
    """Mean over the tied candidates c of slope_from(.., c, ref_of(c), pos); None if any is undefined (D129)."""
    v = [slope_from(ep, frames, c, ref_of(c), pos) for c in cands]
    return None if any(x is None for x in v) else mean(v)


def spread(ep, c):
    d = [dist((e[2], e[3]), (ep[c][2], ep[c][3])) for j, e in enumerate(ep) if j != c]
    m = sum(d) / len(d)
    return sum((x - m) ** 2 for x in d)


def references(rng, eps, k):
    """20 other episodes, drawn as built; None (no draw) if fewer than 20 are available (D129)."""
    if len(eps) - 1 < NREF: return None
    return [o for o in rng.sample(range(len(eps)), NREF + 1) if o != k][:NREF]


def ref_position(rng, ep):
    f0 = ep[0][0]
    c = rng.choice([e for e in ep if e[0] == f0])
    return (c[2], c[3])


def episode_stats(rng, eps, k, perms=None):
    """Primary per-episode values (see the header). Draw order: null 1 (shuffle, then initiator), then null 2 references."""
    perms = perms or PERMS
    ep = eps[k]; n = len(ep); f0 = ep[0][0]
    frames = [e[0] for e in ep]
    cands = [j for j in range(n) if frames[j] == f0]
    own = lambda c: (ep[c][2], ep[c][3])
    obs = tie_slope(ep, frames, cands, own)
    pd = [(j, m) for j in range(n) for m in range(j + 1, n)]
    rd = ranks([dist((ep[j][2], ep[j][3]), (ep[m][2], ep[m][3])) for j, m in pd])
    pobs = pearson(rd, ranks([abs(frames[j] - frames[m]) for j, m in pd]))
    # raw (as built): initiator ep[0], rest ep[1:]
    rs, rn = [0.0] * 5, [0] * 5
    for e in ep[1:]:
        b = band(dist((e[2], e[3]), (ep[0][2], ep[0][3]))); rs[b] += e[0] - f0; rn[b] += 1
    # null 1
    n1, p1, n1s, n1n = [], [], [0.0] * 5, [0.0] * 5
    fr = frames[:]
    for _ in range(perms):
        rng.shuffle(fr)
        mn = min(fr)
        tied = [j for j in range(n) if fr[j] == mn]
        c = rng.choice(tied)  # the raw contrast's as-built initiator
        s = tie_slope(ep, fr, tied, own)
        if s is not None: n1.append(s)
        q = pearson(rd, ranks([abs(fr[j] - fr[m]) for j, m in pd]))
        if q is not None: p1.append(q)
        for j in range(n):
            if j == c: continue
            b = band(dist((ep[j][2], ep[j][3]), (ep[c][2], ep[c][3]))); n1s[b] += fr[j] - mn; n1n[b] += 1
    n1v = mean(n1) if len(n1) >= NULL1_MIN * perms else None
    p1v = mean(p1) if len(p1) >= NULL1_MIN * perms else None
    # null 2: the reference-position control
    refs = references(rng, eps, k)
    n2v, raw2 = None, None
    if refs is not None:
        refpos = [ref_position(rng, eps[o]) for o in refs]
        per_c = []
        for c in cands:
            v = [s for s in (slope_from(ep, frames, c, r) for r in refpos) if s is not None]
            per_c.append(mean(v) if len(v) >= NULL2_MIN else None)
        n2v = None if any(v is None for v in per_c) else mean(per_c)
        n2s, n2n = [0.0] * 5, [0.0] * 5
        for o in refs:
            r0 = (eps[o][0][2], eps[o][0][3])
            for e in ep[1:]:
                b = band(dist((e[2], e[3]), r0)); n2s[b] += (e[0] - f0) / len(refs); n2n[b] += 1 / len(refs)
        raw2 = [n2s, n2n]
    return {
        'size': n, 'ties': len(cands), 'w': mean([spread(ep, c) for c in cands]),
        's1': obs - n1v if obs is not None and n1v is not None else None,
        's2': obs - n2v if obs is not None and n2v is not None else None,
        'pair': pobs - p1v if pobs is not None and p1v is not None else None,
        'obs': obs,
        'raw': [rs, rn], 'raw1': [[x / perms for x in n1s], [x / perms for x in n1n]], 'raw2': raw2,
    }


def snap_stats(rng, eps, k, snaps, perms=None):
    """(b), (c) and S3-p for one episode (data only; own stream). snaps: frame -> {ant: (x, y, stillPre, det20)}."""
    perms = perms or PERMS
    ep = eps[k]; n = len(ep); f0 = ep[0][0]
    frames = [e[0] for e in ep]
    cands = [j for j in range(n) if frames[j] == f0]
    def at(f): return snaps.get(f, {})
    # (b): tied initiators detected in all 20 frames before their onset, every other participant in >= 18
    full = all(at(e[0]).get(e[1], (0, 0, 0, -1))[3] >= (20 if e[0] == f0 else 18) for e in ep)
    def pos_at(f): S = at(f); return [((S[e[1]][0], S[e[1]][1]) if e[1] in S else None) for e in ep]
    P0 = pos_at(f0)
    own = lambda c: (ep[c][2], ep[c][3])
    obs = tie_slope(ep, frames, cands, own, P0)
    n1 = []
    fr = frames[:]
    for _ in range(perms):
        rng.shuffle(fr)
        mn = min(fr)
        s = tie_slope(ep, fr, [j for j in range(n) if fr[j] == mn], own, pos_at(mn))
        if s is not None: n1.append(s)
    n1v = mean(n1) if len(n1) >= NULL1_MIN * perms else None
    refs = references(rng, eps, k)
    n2v, refpos = None, []
    if refs is not None:
        refpos = [ref_position(rng, eps[o]) for o in refs]
        per_c = []
        for c in cands:
            v = [s for s in (slope_from(ep, frames, c, r, P0) for r in refpos) if s is not None]
            per_c.append(mean(v) if len(v) >= NULL2_MIN else None)
        n2v = None if any(v is None for v in per_c) else mean(per_c)
    # S3-p: of the ants still >= 20 frames at f0 (snapshot), the share that join, by band from the initiator (observed)
    # or from the reference positions (null 2); tied candidates averaged.
    part = {e[1] for e in ep}
    S = at(f0)
    def shares(origin, excl):
        num, den = [0.0] * 5, [0.0] * 5
        for a, (x, y, st, _) in S.items():
            if a == excl or st < 20: continue
            b = band(dist((x, y), origin)); den[b] += 1; num[b] += a in part
        return num, den
    po = [shares((ep[c][2], ep[c][3]), ep[c][1]) for c in cands]
    pn = [shares(r, ep[c][1]) for c in cands for r in refpos]
    avg = lambda L, w: [[sum(t[0][b] for t in L) / w for b in range(5)], [sum(t[1][b] for t in L) / w for b in range(5)]]
    return {
        'full': full,
        's1c': obs - n1v if obs is not None and n1v is not None else None,
        's2c': obs - n2v if obs is not None and n2v is not None else None,
        'p': avg(po, len(po)), 'p2': avg(pn, len(pn)) if pn else None,
    }


def load_snaps(f):
    raw = json.load(open(f))['snaps']
    out = {}
    for k, v in raw.items():
        out[int(k)] = {int(v[j]): (v[j + 1], v[j + 2], v[j + 3], v[j + 4]) for j in range(0, len(v), 5)}
    return out


def run_file(events, snaps=None, perms=None):
    eps = episodes(events)
    rng = random.Random(53)
    rows = [episode_stats(rng, eps, k, perms) for k in range(len(eps))]
    if snaps is not None:
        rng2 = random.Random(530)
        for k in range(len(eps)): rows[k].update(snap_stats(rng2, eps, k, snaps, perms))
    return rows


if __name__ == '__main__':
    args = sys.argv[1:]
    opt = {args[i]: args[i + 1] for i in range(len(args) - 1) if args[i].startswith('--')}
    spec = [a for a in args if '=' in a and not a.startswith('--')][0]
    name, f = spec.split('=', 1)
    d = json.load(open(f))
    ev = d['events'] if 'events' in d else (d.get('onsets') or {}).get('light', {}).get('events', [])
    snaps = load_snaps(opt['--snap']) if '--snap' in opt else None
    rows = run_file(ev, snaps, int(opt.get('--perms', PERMS)))
    os.makedirs(opt['--out'], exist_ok=True)
    json.dump({'set': name, 'file': f, 'colony': d.get('colony', f), 'episodes': rows}, open(os.path.join(opt['--out'], f'{name}--{os.path.basename(f)}'), 'w'))
