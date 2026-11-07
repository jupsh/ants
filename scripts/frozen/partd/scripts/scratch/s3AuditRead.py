# Scratch (not committed): Part D Stage 0 reader (D126 amendment 1, D129). Groups s3Audit.py's per-file outputs by set
# and colony (a simulated colony pools its runs' episodes), then per set:
#   S3_1, S3_2, S3-pair (primary, equal weights): colony = mean over its eligible episodes (>= MIN_EP), set = mean over
#     estimable colonies; sensitivities (a) 4-15 participants, spread-weighted (colony = sum w x / sum w; D129: a
#     sensitivity, its null not re-weighted), and on snapshot sets (b), (c), S3-p (descriptive);
#   S3-raw pooled over colonies, with its null-1 expectation (all episodes) and null-2 expectation (the episodes where it
#     is defined; observed pooled over the same episodes): separate comparisons.
# Colony bootstrap: 2000 draws over each statistic's estimable colonies, random.Random(0x5ea0 + set index), re-seeded per
# statistic; set index data 0, base 1, Eu 2, El20 3, P20 4 (D129).
# Gate G (directional, D129): on the colonies estimable for S3_2 in both data and base (>= 15, else unestimable):
#   lower 95 % bound of data S3_2 > 0 and lower 95 % bound of data - base S3_2 > 0 (data and base resampled independently).
#   python3 -I s3AuditRead.py <dir> <out.json> [--md5 <text>]
import glob, json, os, random, sys

SETS = ['data', 'base', 'Eu', 'El20', 'P20']
MIN_EP, MIN_COL, B = 5, 15, 2000


def mean(v):
    v = [x for x in v if x is not None]
    return sum(v) / len(v) if v else None


def colony_value(eps, key, keep, weighted=False):
    v = [(e[key], e['w']) for e in eps if keep(e) and e.get(key) is not None]
    if len(v) < MIN_EP: return None
    if weighted:
        sw = sum(w for _, w in v)
        return sum(x * w for x, w in v) / sw if sw > 0 else None
    return sum(x for x, _ in v) / len(v)


def boot(vals, k):
    """B bootstrap means over the given colonies' values; set k's own stream, re-seeded per statistic."""
    rng = random.Random(0x5ea0 + k)
    return [sum(vals[rng.randrange(len(vals))] for _ in vals) / len(vals) for _ in range(B)]


def ci(draws):
    s = sorted(x for x in draws if x is not None)
    return [s[int(.025 * len(s))], s[int(.975 * len(s))]] if s else [None, None]


ALL = lambda e: True
STATS = {
    'S3_1': ('s1', ALL, False), 'S3_2': ('s2', ALL, False), 'S3-pair': ('pair', ALL, False),
    'S3_1 (a) 4-15': ('s1', lambda e: 4 <= e['size'] <= 15, False), 'S3_2 (a) 4-15': ('s2', lambda e: 4 <= e['size'] <= 15, False),
    'S3_1 spread-weighted': ('s1', ALL, True), 'S3_2 spread-weighted': ('s2', ALL, True),
    'S3_1 (b) detection-complete': ('s1', lambda e: e.get('full') is True, False), 'S3_2 (b) detection-complete': ('s2', lambda e: e.get('full') is True, False),
    'S3_1 (c) at initiator frame': ('s1c', ALL, False), 'S3_2 (c) at initiator frame': ('s2c', ALL, False),
}


def main(d, out, md5):
    by = {}
    for f in sorted(glob.glob(os.path.join(d, '*.json'))):
        j = json.load(open(f))
        by.setdefault(j['set'], {}).setdefault(j['colony'], []).extend(j['episodes'])
    res = {'md5': md5, 'sets': {}, 'gate': None}
    cv_s2 = {}
    for s in [x for x in SETS if x in by]:
        k = SETS.index(s)
        cols = sorted(by[s])
        r = {'colonies': len(cols), 'episodes': sum(len(by[s][c]) for c in cols)}
        for name, (key, keep, wtd) in STATS.items():
            cv = {c: colony_value(by[s][c], key, keep, wtd) for c in cols}
            est = [c for c in cols if cv[c] is not None]
            if not est: continue
            if name == 'S3_2': cv_s2[s] = cv
            r[name] = {'value': mean([cv[c] for c in est]), 'ci95': ci(boot([cv[c] for c in est], k)), 'estimable': len(est),
                       'excluded': [c for c in cols if cv[c] is None], 'perColony': cv,
                       'eligibleEpisodes': sum(1 for c in cols for e in by[s][c] if keep(e) and e.get(key) is not None)}
            if len(est) < MIN_COL: r[name]['unestimable'] = True
        # S3-raw: pooled 20-40 minus < 5 mm
        rng = random.Random(0x5ea0 + k)
        idx = [[rng.randrange(len(cols)) for _ in cols] for _ in range(B)]
        def pooled(ix, key, sub=None):
            S = [0.0] * 5; N = [0.0] * 5
            for i in ix:
                for e in by[s][cols[i]]:
                    if sub and e.get(sub) is None: continue
                    for b in range(5): S[b] += e[key][0][b]; N[b] += e[key][1][b]
            return S[3] / N[3] - S[0] / N[0] if N[3] and N[0] else None
        def diff(ix, key, sub):
            a, b = pooled(ix, 'raw', sub), pooled(ix, key, sub)
            return None if a is None or b is None else a - b
        allix = list(range(len(cols)))
        r['S3-raw (frames, 20-40 minus <5 mm)'] = {
            'observed': {'value': pooled(allix, 'raw'), 'ci95': ci([pooled(ix, 'raw') for ix in idx])},
            'null1 expectation': {'value': pooled(allix, 'raw1'), 'ci95': ci([pooled(ix, 'raw1') for ix in idx])},
            'observed minus null1': {'value': diff(allix, 'raw1', None), 'ci95': ci([diff(ix, 'raw1', None) for ix in idx])},
            'null2 expectation (defined episodes)': {'value': pooled(allix, 'raw2', 'raw2'), 'ci95': ci([pooled(ix, 'raw2', 'raw2') for ix in idx])},
            'observed minus null2 (same episodes)': {'value': diff(allix, 'raw2', 'raw2'), 'ci95': ci([diff(ix, 'raw2', 'raw2') for ix in idx])},
            'episodes with null2': sum(1 for c in cols for e in by[s][c] if e.get('raw2') is not None),
        }
        if any('p' in e for c in cols for e in by[s][c]):
            def share(c, key, b):
                num = sum(e[key][0][b] for e in by[s][c] if e.get(key)); den = sum(e[key][1][b] for e in by[s][c] if e.get(key))
                return num / den if den else None
            r['S3-p (descriptive)'] = {str(b): {'observed': mean([share(c, 'p', b) for c in cols]), 'null2': mean([share(c, 'p2', b) for c in cols]),
                                                'excess': mean([None if share(c, 'p', b) is None or share(c, 'p2', b) is None else share(c, 'p', b) - share(c, 'p2', b) for c in cols])} for b in range(5)}
        res['sets'][s] = r
    # Gate G on the same colony identities.
    if 'data' not in cv_s2 or 'base' not in cv_s2:
        res['gate'] = {'result': 'unestimable (S3_2 missing for ' + ('data' if 'data' not in cv_s2 else 'base') + ')'}
    else:
        common = sorted(c for c in cv_s2['data'] if cv_s2['data'][c] is not None and cv_s2['base'].get(c) is not None)
        g = {'commonColonies': len(common), 'excludedData': sorted(c for c in cv_s2['data'] if c not in common), 'excludedBase': sorted(c for c in cv_s2['base'] if c not in common)}
        if len(common) < MIN_COL:
            g['result'] = f'unestimable (only {len(common)} colonies estimable in both data and base)'
        else:
            dv = [cv_s2['data'][c] for c in common]; bv = [cv_s2['base'][c] for c in common]
            dd, bd = boot(dv, 0), boot(bv, 1)
            g.update({'dataS3_2': mean(dv), 'dataCi95': ci(dd), 'baseS3_2': mean(bv), 'baseCi95': ci(bd),
                      'dataMinusBase': mean(dv) - mean(bv), 'diffCi95': ci([a - b for a, b in zip(dd, bd)])})
            ok = g['dataCi95'][0] > 0 and g['diffCi95'][0] > 0
            g['result'] = 'positive excess ordering established' if ok else 'this gate did not establish positive excess ordering'
        res['gate'] = g
    json.dump(res, open(out, 'w'), indent=1)
    return res


if __name__ == '__main__':
    md5 = sys.argv[sys.argv.index('--md5') + 1] if '--md5' in sys.argv else None
    main(sys.argv[1], sys.argv[2], md5)
