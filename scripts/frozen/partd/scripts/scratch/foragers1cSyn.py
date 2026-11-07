# Scratch (not committed): the synthetic checks of D223 / amendment 1 (P112), run before any data run, through the
# functions of foragers1c.py (loaded by path: python3 -I drops the script's folder from sys.path).
#   python3 -I scripts/scratch/foragers1cSyn.py
import importlib.util, math, os, random, sys

_p = os.path.join(os.path.dirname(os.path.abspath(__file__)), "foragers1c.py")
_spec = importlib.util.spec_from_file_location("foragers1c", _p)
F = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(F)

RESULTS = []


def check(name, good, info):
    RESULTS.append((name, bool(good)))
    print(f"[{'PASS' if good else 'FAIL'}] {name}: {info}")


def gen(rng, nants, nblocks, per, rho, pres=None, st=400):
    """Bin-level inputs for dstats: ant-bins eligible with probability p_b (varied n_b); fraction 0.5 + 0.05 x with
    x = sqrt(rho) z_b + sqrt(1 - rho) e_ib."""
    nb = nblocks * per
    lab = [b // per for b in range(nb)]
    pb = [pres if pres is not None else rng.uniform(0.2, 0.9) for _ in range(nb)]
    z = [rng.gauss(0, 1) for _ in range(nb)]
    mvB, stB = [], []
    for _ in range(nants):
        mv, s = [], []
        for b in range(nb):
            if rng.random() < pb[b]:
                x = math.sqrt(rho) * z[b] + math.sqrt(1 - rho) * rng.gauss(0, 1)
                s.append(st)
                mv.append(st * (0.5 + 0.05 * x))
            else:
                s.append(0)
                mv.append(0)
        mvB.append(mv)
        stB.append(s)
    return mvB, stB, lab


def dmr_of(mvB, stB, lab, thr=300):
    return F.dmr(F.pool([F.dstats(mvB, stB, lab, thr)]))


def reps(n, seed, **kw):
    out = []
    for k in range(n):
        rng = random.Random(seed * 1000 + k)
        out.append(dmr_of(*gen(rng, **kw)))
    return out


def mse(xs):
    m = sum(xs) / len(xs)
    s = math.sqrt(sum((x - m) ** 2 for x in xs) / (len(xs) - 1) / len(xs))
    return m, s


def naive_D(mvB, stB, lab, thr):
    """syncStats.ts out(), written independently with dictionaries in its own order."""
    S, Q, N = {}, {}, {}
    for a in range(len(mvB)):
        by = {}
        for b, s in enumerate(stB[a]):
            if s < thr:
                continue
            by.setdefault(lab[b], []).append((b, s))
        for ok_ in by.values():
            p = sum(mvB[a][b] for b, _ in ok_) / sum(s for _, s in ok_)
            for b, s in ok_:
                d = mvB[a][b] / s - p
                S[b] = S.get(b, 0) + d
                Q[b] = Q.get(b, 0) + d * d
                N[b] = N.get(b, 0) + 1
    num = sum(S[b] ** 2 for b in S if N[b] >= 2)
    den = sum(Q[b] for b in S if N[b] >= 2)
    return num / den


def main():
    # 1. Independent ants, varied n_b: r ~ 0, D ~ 1.
    R = reps(8, 1, nants=40, nblocks=1, per=1500, rho=0.0)
    r, se = mse([x["r"] for x in R])
    D, seD = mse([x["D"] for x in R])
    m, _ = mse([x["m"] for x in R])
    check("independent ants: r ~ 0, D ~ 1", abs(r) < 3 * se + 0.002 and abs(D - 1) < 3 * seD + 0.05,
          f"r {r:.5f} (SE {se:.5f}), D {D:.4f} (SE {seD:.4f}), m {m:.2f}, K ~ 825 (8 replicates)")
    # 2. Equicorrelated, rho 0.2, varied n_b, two K: r = 0.2 less a demeaning bias shrinking with K.
    Rl = reps(8, 2, nants=30, nblocks=1, per=2000, rho=0.2)
    Rs = reps(16, 3, nants=30, nblocks=300, per=12, rho=0.2)
    rl, sel = mse([x["r"] for x in Rl])
    rs, ses = mse([x["r"] for x in Rs])
    Kl, Ks = 2000 * 0.55, 12 * 0.55
    approx = lambda K: (0.2 - 2 * 0.2 / K + 0.2 * 0.55 / K) / (1 - 1 / K)
    check("equicorrelated rho 0.2, K ~ 1100 per ant-block: r ~ 0.2", abs(rl - approx(Kl)) < 3 * sel + 0.003,
          f"r {rl:.4f} (SE {sel:.4f}); first-order expectation {approx(Kl):.4f}")
    check("equicorrelated rho 0.2, K ~ 6.6: r below 0.2 by a demeaning bias larger than at K ~ 1100, near its first-order size", rs < rl - 3 * math.hypot(sel, ses) and abs(rs - approx(Ks)) < 3 * ses + 0.005,
          f"r {rs:.4f} (SE {ses:.4f}) vs {rl:.4f}; bias {rs - 0.2:+.4f} vs {rl - 0.2:+.4f}; first-order expectation {approx(Ks):.4f}")
    # D - 1 tracks m at fixed rho.
    rows = []
    for k, p in enumerate((0.15, 0.35, 0.6, 0.9)):
        x = reps(3, 10 + k, nants=30, nblocks=1, per=1500, rho=0.2, pres=p)
        rows.append((p, mse([y["m"] for y in x])[0], mse([y["D"] - 1 for y in x])[0], mse([y["r"] for y in x])[0]))
    mono = all(rows[i][1] < rows[i + 1][1] and rows[i][2] < rows[i + 1][2] for i in range(3))
    flat = max(abs(d / m_ - 0.2) for _, m_, d, _ in rows)
    check("fixed rho 0.2: D - 1 rises with m, (D - 1) / m ~ 0.2 throughout", mono and flat < 0.02,
          "; ".join(f"p {p}: m {m_:.2f}, D-1 {d:.3f}, (D-1)/m {d / m_:.4f}" for p, m_, d, _ in rows))
    # 3. Identity D - 1 = m r on random inputs, through summarize -> colony_values (minute arrays, labels, light).
    worst = 0.0
    naive = 0.0
    for k in range(20):
        rng = random.Random(500 + k)
        M = 300 + rng.randrange(200)
        label = [6] * 240 + [10] * (M - 240)
        for t in rng.sample(range(M), 5):
            label[t] = None if t not in (0, 239, 240) else label[t]
        ants = []
        for i in range(rng.randrange(5, 25)):
            st = [rng.choice([0, 0, rng.randrange(0, 120)]) for _ in range(M)]
            ants.append({"role": rng.choice(["nurse", "forager"]), "tag": i, "st": st,
                         "mv": [rng.randrange(0, s + 1) for s in st], "np": [s + rng.randrange(2) for s in st],
                         "no": [rng.randrange(3) for _ in range(M)]})
        src = {"kind": "data", "colony": f"toy{k}", "M": M, "label": label, "ants": ants,
               "tracked": {r: sum(1 for a in ants if a["role"] == r) for r in ("nurse", "forager")},
               "light": lambda L: L is not None and L % 100 in F.LIGHT}
        s = F.summarize(src)
        v, _ = F.colony_values([s], "data")
        for g in F.GROUPS:
            for w in F.WS:
                p = f"A.{g}.{w}."
                if F.ok(v[p + "D"]):
                    worst = max(worst, abs(v[p + "D"] - 1 - v[p + "m"] * v[p + "r"]))
        wm = 10
        mvB = [F.bin_sum(a["mv"], wm) for a in ants]
        stB = [F.bin_sum(a["st"], wm) for a in ants]
        labB = F.bin_labels(label, wm)
        mine = F.dmr(F.pool([F.dstats(mvB, stB, labB, 300)]))["D"]
        if mine is not None:
            naive = max(naive, abs(mine - naive_D(mvB, stB, labB, 300)) / mine)
    check("identity D - 1 = m r on random inputs (20 toy colonies, 3 groups x 2 widths)", worst < 1e-12, f"largest |D - 1 - m r| {worst:.2e}")
    check("dstats D_w = an independent transcription of syncStats.ts out()", naive < 1e-12, f"largest relative difference {naive:.2e}")
    # 4. D-dagger and D-double-dagger by hand on a 2-colony toy.
    dv = {0: {}, 1: {}}
    av = {0: {}, 1: {}}
    hand = {0: (3.0, 2.0, 0.5, 1.5, 3.0, 0.1), 1: (2.0, 4.0, 0.25, 1.2, 2.0, 0.1)}  # D, m, r data; D, m, r arm
    for c, (Dd, md, rd, Da, ma, ra) in hand.items():
        for g in F.GROUPS:
            for w in F.WS:
                p = f"A.{g}.{w}."
                dv[c].update({p + "D": Dd, p + "m": md, p + "r": rd})
                av[c].update({p + "D": Da, p + "m": ma, p + "r": ra})
    cf = {c: F.counterfactual(dv[c], av[c]) for c in (0, 1)}
    k = "A.forager.1200."
    exp = {0: {"Ddag": 1 + 2.0 * 0.1, "Dddag": 1 + 3.0 * 0.5}, 1: {"Ddag": 1 + 4.0 * 0.1, "Dddag": 1 + 2.0 * 0.25}}
    good = all(abs(cf[c][k + "Ddag"] - exp[c]["Ddag"]) < 1e-15 and abs(cf[c][k + "Dddag"] - exp[c]["Dddag"]) < 1e-15 for c in (0, 1))
    good = good and abs(cf[0][k + "dataMinusDdag"] - (3.0 - 1.2)) < 1e-15 and abs(cf[0][k + "DdagMinusArm"] - (1.2 - 1.5)) < 1e-15
    good = good and abs(cf[1][k + "dataMinusDddag"] - (2.0 - 1.5)) < 1e-15 and abs(cf[1][k + "DddagMinusArm"] - (1.5 - 1.2)) < 1e-15
    lab = {i: f"c{i}" for i in range(F.NCOL)}
    counts = F.make_counts()
    mean = F.setrow({c: cf[c][k + "Ddag"] for c in (0, 1)}, lab, counts, minn=1)["est"]
    good = good and abs(mean - (1.2 + 1.4) / 2) < 1e-15
    null2 = F.setrow({c: cf[c][k + "Ddag"] for c in (0, 1)}, lab, counts, F.floor_for(k + "Ddag"))
    check("D-dagger / D-double-dagger by hand, 2 colonies", good and abs(null2["est"] - 1.3) < 1e-15 and null2["n"] == 2,
          f"D-dagger {cf[0][k + 'Ddag']:.3f}, {cf[1][k + 'Ddag']:.3f} (hand 1.2, 1.4); D-double-dagger {cf[0][k + 'Dddag']:.3f}, "
          f"{cf[1][k + 'Dddag']:.3f} (hand 2.5, 1.5); data - D-dagger c0 {cf[0][k + 'dataMinusDdag']:.3f} (1.8), D-dagger - arm c0 "
          f"{cf[0][k + 'DdagMinusArm']:.3f} (-0.3); mean D-dagger {mean:.3f} (1.3); as the analysis sets it (no floor outside survival rows): est {null2['est']:.3f}, n {null2['n']}")
    # 5. Hand-built minute states (data: I in, O out, U unseen), window-relative minutes 0..15.
    s = list("IIOUOIIIIUIIOOOI")
    a = F.spells_main(s)
    exp_main = {"pres": [(4, True), (2, True), (1, False)], "abs": [(3, True, True), (1, True, False), (3, True, True)],
                "entries": [5, 10, 15], "E": [3, 4, 5, 10, 13, 14, 15]}
    good = all(a[x] == exp_main[x] for x in exp_main) and a["ages"] == [(5, 0), (6, 1), (7, 2), (8, 3), (10, 0), (11, 1), (15, 0)]
    check("main rule (in / not-in) on IIOUOIIIIUIIOOOI", good,
          f"presence {a['pres']}, absence {a['abs']}, entries {a['entries']}, E {a['E']}; the leading II (under way at the start) left out, the last I censored")
    b = F.spells_sens(s)
    exp_sens = {"pres": [(4, False), (1, False)], "abs": [(1, False, True), (3, True, True)], "entries": [5, 15], "E": [3, 5, 13, 14, 15]}
    good = all(b[x] == exp_sens[x] for x in exp_sens) and b["ages"] == [(5, 0), (6, 1), (7, 2), (8, 3), (15, 0)]
    check("unseen-as-unknown rule on the same sequence", good,
          f"presence {b['pres']} (5-8 censored at U, 10-11 left out after U), absence {b['abs']} (2 censored at U, 4 left out after U), "
          f"entries {b['entries']}, E {b['E']}")
    c = F.spells_main(list("NNIIINNI"))
    good = c["pres"] == [(3, True), (1, False)] and c["abs"] == [(2, True, False)] and c["entries"] == [2, 7] and c["E"] == [1, 2, 6, 7]
    check("main rule on a run sequence NNIIINNI", good, f"presence {c['pres']}, absence {c['abs']}, entries {c['entries']}, E {c['E']}")
    ages = [F.age_group(x) for x in (0, 1, 4, 5, 19, 20, 59, 60, 300)]
    check("stay-age groups", ages == ["entry", "1-4", "1-4", "5-19", "5-19", "20-59", "20-59", ">=60", ">=60"], f"0,1,4,5,19,20,59,60,300 -> {ages}")
    # window(): exposure counts every tracked forager x minute; stay-age activity sums over observed-entry spells.
    M = 16
    fa = {"role": "forager", "np": [1 if x == "I" else 0 for x in s], "no": [1 if x == "O" else 0 for x in s],
          "st": [10 if x == "I" else 0 for x in s], "mv": [t if x == "I" else 0 for t, x in enumerate(s)]}
    fb = {"role": "forager", "np": [0] * M, "no": [0] * M, "st": [0] * M, "mv": [0] * M}
    src = {"kind": "data", "colony": "toy", "M": M, "label": [6] * M, "ants": [fa, fb], "tracked": {"nurse": 0, "forager": 3}}
    w = F.window(src, 0, M - 1)
    age = w["main"]["age"]
    good = (w["exposure"] == 48 and w["inMin"] == 9 and w["main"]["entries"] == 3 and w["sens"]["entries"] == 2
            and age["entry"] == [5 + 10 + 15, 30] and age["1-4"] == [6 + 7 + 8 + 11, 40] and w["notIn"] == 7 + 16
            and w["out"] == 5 and w["unseen"] == 2 + 16 and w["main"]["absWithOut"] == 2 and w["sens"]["age"]["entry"] == [20, 20])
    check("window(): exposure, in minutes, entries, stay-age sums, out / unseen", good,
          f"exposure {w['exposure']} (3 tracked x 16), in {w['inMin']}, entries {w['main']['entries']} / sens {w['sens']['entries']}, "
          f"age entry {age['entry']}, 1-4 {age['1-4']}, not-in {w['notIn']}, out {w['out']}, unseen {w['unseen']}")
    # 6. Kaplan-Meier on a hand case.
    sp = [(1, True), (2, True), (2, False), (3, True), (4, False), (5, True), (6, True), (8, False), (10, True), (12, False)]
    k1 = F.km(sp, [2, 5, 6, 10])
    S5 = 0.9 * 8 / 9 * 6 / 7 * 4 / 5
    p = k1["points"]
    good = (abs(p["2"]["S"] - 0.8) < 1e-12 and p["2"]["atRisk"] == 9 and p["2"]["events"] == 2 and p["2"]["censored"] == 1
            and abs(p["5"]["S"] - S5) < 1e-12 and p["5"]["atRisk"] == 5 and p["5"]["events"] == 4 and p["5"]["censored"] == 2
            and p["6"]["S"] is None and p["6"]["atRisk"] == 4 and p["10"]["S"] is None and p["10"]["atRisk"] == 2
            and k1["median"] is None)
    check("Kaplan-Meier hand case (10 spells)", good,
          f"S(2) {p['2']['S']:.4f} (0.8), at risk 9, events 2, censored 1; S(5) {p['5']['S']:.6f} ({S5:.6f}), at risk 5, events 4, "
          f"censored 2; S(6) {p['6']['S']} (at risk 4 < 5: missing); S(10) {p['10']['S']}; median {k1['median']} "
          f"(S first <= 0.5 at 6 with 4 at risk: {F.NE})")
    k2 = F.km([(u, True) for u in range(1, 21)], [10])
    k3 = F.km([(30, False)] * 20 + [(5, True)] * 3, [10, 30])
    good = k2["median"] == 10 and abs(k2["points"]["10"]["S"] - 0.5) < 1e-12 and k3["median"] is None and abs(k3["points"]["30"]["S"] - 20 / 23) < 1e-12
    check("median: estimable at 10 when S(10) = 0.5 with 11 at risk; not estimable when S stays above 0.5", good,
          f"median {k2['median']}; S(30) {k3['points']['30']['S']:.4f} with {k3['points']['30']['atRisk']} at risk -> median {k3['median']}")
    kb = F.km([(3, True)] * 2 + [(20, False)] * 2, [10])
    r1 = F.setrow({0: kb["points"]["10"]["S"], 1: 0.7}, lab, counts, minn=1)
    check("a colony below support is missing, not 0", kb["points"]["10"]["S"] is None and r1["n"] == 1 and r1["missing"] == ["c0"] and r1["est"] == 0.7,
          f"S_c0(10) {kb['points']['10']['S']} (2 at risk); set n {r1['n']}, missing {r1['missing']}, est {r1['est']}")
    # 7. Clustering.
    ent = [[3], [4, 8], [9], []]
    E = [[1, 2, 3, 6, 7], [2, 3, 4, 5, 8], [5, 6, 7, 8, 9], list(range(1, 10))]
    cl = F.clustering(ent, E, 10)
    expq = [0.84, 0.36, 0.68, 0.36]
    good = [x for x, _ in cl] == [True] * 4 and all(abs(q - e) < 1e-12 for (_, q), e in zip(cl, expq))
    check("clustering hand case (window 0-9, edge at 9, E_j and k_j)", good,
          f"clustered {[x for x, _ in cl]}, q_e {[round(q, 4) for _, q in cl]} (hand {expq}); observed 1.0, benchmark {sum(q for _, q in cl) / 4:.2f} (0.56)")
    cl2 = F.clustering([[1, 2], []], [[1, 2], [1, 2, 3]], 10)
    check("the focal ant's own repeat entries never count nor enter its q_e", cl2 == [(False, 0.0), (False, 0.0)], f"{cl2}")
    cl3 = F.clustering([[4], [1]], [[2, 4], [1, 5, 6, 7]], 10)
    good = [x for x, _ in cl3] == [False, False] and abs(cl3[0][1] - 0.25) < 1e-12 and abs(cl3[1][1] - 0.5) < 1e-12
    check("q_e counts only E_j minutes inside N_e", good,
          f"{cl3} (hand: entry at 4, N_e 3-5, E_1 has 5, one of its 4 minutes -> 0.25; entry at 1, N_e 0-2, E_0 has 2, one of its 2 minutes -> 0.5)")
    # 8. Common support and the 11-colony rule.
    d = {i: 1.0 for i in range(F.NCOL)}
    a10 = {i: (2.0 if i < 10 else None) for i in range(F.NCOL)}
    a11 = {i: (2.0 if i < 11 else None) for i in range(F.NCOL)}
    sk, nk = "B.presence.S30", "B.inFrac"
    r10 = F.diffrow(a10, d, lab, counts, F.floor_for(sk))
    r11 = F.diffrow(a11, d, lab, counts, F.floor_for(sk))
    n10 = F.diffrow(a10, d, lab, counts, F.floor_for(nk))
    s10 = F.setrow(a10, lab, counts, F.floor_for(nk))
    m10 = F.setrow({i: (5 if i < 10 else None) for i in range(F.NCOL)}, lab, counts, F.floor_for("B.absence.median"))
    check("a survival comparison (S at a point) with fewer than 11 support colonies is null, with 11 it is set",
          r10["est"] is None and r10["ci95"] is None and r10["support"] == 10 and len(r10["excluded"]) == 12 and r11["est"] == 1.0 and m10["est"] is None,
          f"{sk}, 10 colonies: est {r10['est']}, support {r10['support']}, excluded {len(r10['excluded'])}; 11 colonies: est {r11['est']}, "
          f"ci {r11['ci95']}, support {r11['support']}; a median row on 10 colonies: est {m10['est']}")
    check("a non-survival row with 10 defined colonies reports its estimate with n = 10 (no zero-fill)",
          n10["est"] == 1.0 and n10["support"] == 10 and len(n10["excluded"]) == 12 and s10["est"] == 2.0 and s10["n"] == 10
          and len(s10["missing"]) == 12 and not s10.get("belowMinColonies"),
          f"{nk}: difference est {n10['est']}, support {n10['support']}, ci {n10['ci95']}; set value est {s10['est']}, n {s10['n']}, "
          f"missing {len(s10['missing'])}; the floor: {F.floor_for(nk)} for {nk}, {F.floor_for(sk)} for {sk}")
    check("restricted draws use only support colonies (11 of 22 defined, all differences 1)", r11["est"] == 1.0 and r11["ci95"] == [1.0, 1.0], f"ci {r11['ci95']}")
    md = F.median_rows({0: 10, 1: None, 2: 4}, {0: 12, 1: 5, 2: None}, lab, counts, minn=1)
    check("medians: mean only over colonies estimable on both sides, with the counts", md["support"] == 1 and md["notEstimableData"] == ["c1"]
          and md["notEstimableArm"] == ["c2"] and md["data"]["est"] == 10 and md["arm"]["est"] == 12 and md["armMinusData"]["est"] == 2,
          f"support {md['support']}, not estimable data {md['notEstimableData']}, arm {md['notEstimableArm']}, diff {md['armMinusData']['est']}")
    bad = [n for n, g in RESULTS if not g]
    print(f"{len(RESULTS) - len(bad)} of {len(RESULTS)} checks passed" + (f"; FAILED: {bad}" if bad else ""))
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
