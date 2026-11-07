# Scratch (not committed): D205 Part 2 item 1(c), designed in D223 and frozen with its amendment 1 (D224; P102-P113).
# The foragers' 10-min D_w split exactly into co-presence and coupling, D - 1 = m * r, per colony for the data and each
# of the 12 Stage 2b arms (1 min beside), with the two arithmetic standardisations D-dagger and D-double-dagger and the
# stay-interior sensitivity; the foragers' observed presence / absence spells, entries, clustering against a simple
# benchmark and activity by time since an observed entry; coverage and composition; the data by light block.
# Descriptive: no rule, no class; Stage 2b's row classes are copied beside from read.json, never recomputed (P82).
# Inputs: the recorder's logs/partd2/foragers/data-c<i>.json (foragers1cData.ts), logs/short/data-c<i>.json (only its
# stored sync, for self-check 1), logs/short/pd-as-<arm>-r{0,1}-c<k>.json (only colony, ydist, sync, hours),
# data/reference/stroeymeyt2018-fit-rows.json (the runs' composition), logs/partd2/assess/read.json (classes, check 3).
# Self-checks 1 and 2 (and 3 on the full run) gate everything: until they pass only their values are printed; if one
# fails the failing values are printed, nothing is written and the exit status is 1 (P113).
#   python3 -I scripts/scratch/foragers1c.py [--colonies 12,20] [--arms T20f,base] [--dir logs/partd2/foragers]
import gc, hashlib, json, math, os, random, re, sys, time
from bisect import bisect_left

NCOL = 22
ARMS = ["T20f", "T20m", "Eu-M", "El20-M", "Ed2", "Ed5", "Ed20", "Ew5", "Es", "Eu", "El20", "base"]
GROUPS = ["all", "nurse", "forager"]
FPM = 120  # frames per minute at 2 fps
WS = ["1200", "120"]  # bin widths in frames, as syncStats.ts: 10 min (primary), 1 min (beside)
LIGHT = (6, 10, 14)
BLOCK_FRAMES = 28800  # a 4-h block
BLOCK_MIN = BLOCK_FRAMES // FPM  # 240 minutes
HALF_BLOCK_MIN = BLOCK_MIN // 2  # residence windows: >= 120 of 240 minutes (D207's half-block rule)
B = 2000
SEED = 0xD223
MIN_COL = 11  # survival rows only (amendment 1 point 3): an S(t) or median set value or comparison on fewer is missing
SURVIVAL = re.compile(r"^[BS]\.(presence|absence)\.(S\d+|median)$")


def floor_for(key):
    """The 11-colony floor applies to the survival rows only (KM S at each point and medians, presence and absence
    spells, main rule and sensitivity); every other row reports its estimate with its colony count."""
    return MIN_COL if SURVIVAL.match(key) else 0
MIN_RISK = 5  # S_c(t) defined when >= 5 at risk at t (supported follow-up)
STAY_T = [10, 30, 60, 120]
TRIP_T = [2, 10, 30, 60]
AGES = [("entry", 0, 0), ("1-4", 1, 4), ("5-19", 5, 19), ("20-59", 20, 59), (">=60", 60, None)]
TOL = 1e-9
FIT_ROWS = "data/reference/stroeymeyt2018-fit-rows.json"
READ2B = "logs/partd2/assess/read.json"
NE = "median not estimable"

LABELS = {
    "m": "m = sum_b (n_b - 1) Q_b / sum_b Q_b: activity-variance-weighted co-presence among eligible ants, not their number",
    "r": "r = sum_b (S_b^2 - Q_b) / sum_b (n_b - 1) Q_b: a normalised cross-product measure; it reads as a pairwise "
         "correlation only under equal deviation variances and a common within-bin correlation",
    "D": "D_w = sum_b S_b^2 / sum_b Q_b over bins with >= 2 eligible ants; D - 1 = m * r exactly",
    "Ddag": "D-dagger_c = 1 + m_c(data) * r_c(arm): arithmetic standardisation of the arm's r to the data colony's m; "
            "it does not estimate what changing residence would cause",
    "Dddag": "D-double-dagger_c = 1 + m_c(arm) * r_c(data): arithmetic standardisation of the data's r to the arm's m; "
             "it does not estimate what changing residence would cause",
    "presence": "observed presence spell: a run of in minutes (np >= 1) from an observed entry; not a verified stay",
    "absence": "observed absence spell: a run of not-in minutes from an observed exit; not a verified trip",
    "entry": "observed entry: an in minute whose previous minute in the window is not-in (sensitivity: out)",
    "stayAge": "minutes since the observed entry of the observed presence spell (entry minute, 1-4, 5-19, 20-59, >= 60)",
    "benchmark": "simple benchmark: each other forager's entries placed independently and uniformly over its eligible "
                 "minutes (with replacement); excess clustering against it does not establish interaction or triggering",
    "median": "per colony, the first time S_c <= 0.5 while >= 5 are at risk; otherwise 'median not estimable'",
    "sensitivity": "data only, unseen as unknown: a presence spell ends at an out minute (event), is censored at an "
                   "unseen minute; an absence spell starts at an out minute after an in minute, ends at an in minute "
                   "(event), is censored at an unseen minute; a spell whose start follows an unseen minute is left out; "
                   "an entry counts only when the minute before it is out",
    "exposure": "forager-minutes observed = tracked foragers x the window's minutes (first to last frame), data and runs",
    "km": "Kaplan-Meier on whole minutes: S(t) = prod_{u <= t} (1 - d_u / n_u), n_u = #spells with length >= u; at t: "
          "atRisk = #spells with length >= t, events and censored = cumulative counts with length <= t, summed over "
          "colonies; S_c(t) missing when atRisk < 5",
    "support": "a comparison uses the colonies where both sides are defined on the original sample (excluded listed); "
               "its bootstrap restricts each shared draw to those colonies (the drawn labels in the support, with their "
               "multiplicity); survival rows (S at each point, medians) on fewer than 11 colonies: missing; every other row reports its estimate with n",
}


def readj(p):
    with open(p) as f:
        return json.load(f)


def slim(p, keys):
    """Only the keys this script reads: the run inputs total ~23 GB of JSON, so each file is parsed alone (D207)."""
    j = readj(p)
    out = {k: j[k] for k in keys if k in j}
    del j
    gc.collect()
    return out


def ok(x):
    return x is not None and x == x and not math.isinf(x)


def div(a, b):
    return a / b if b else None


def in_group(role, g):
    return role in ("nurse", "forager") if g == "all" else role == g


# ---------------------------------------------------------------- sources: one data colony or one run, per minute ---

def src_data(j):
    """The recorder's colony: dense per-minute arrays from the first frame, block label per minute (None: no frame)."""
    M = j["minutes"]
    lab = j["label"]
    if len(lab) != M:
        sys.exit(f"{j['colony']}: {len(lab)} labels for {M} minutes")
    for a in j["ants"]:
        if not all(len(a[k]) == M for k in ("mv", "st", "np", "no")):
            sys.exit(f"{j['colony']}: ant {a['tag']} arrays not of the recording's length")
    return {"kind": "data", "colony": j["colony"], "M": M, "label": lab, "ants": j["ants"], "tracked": j["tracked"],
            "light": lambda L: L is not None and L % 100 in LIGHT}


def src_run(j, tracked):
    """One run's ydist: bins from frame 0 (b0 must be 0). Minutes are labelled with the block SyncStats gives their
    first frame, floor(minute * 120 / 28800): the run's 4-h window is block 0, minutes 0..239; the frame at t = 4 h
    (frame 28800, when written) falls in minute 240, which SyncStats puts in block 1, outside the window."""
    y = j["ydist"]
    if y["b0"] != 0 or y["binS"] != 60:
        sys.exit(f"{j['colony']}: ydist b0 {y['b0']} binS {y['binS']}, expected 0 and 60")
    W = round(j["hours"] * 60)
    if W != BLOCK_MIN:
        sys.exit(f"{j['colony']}: a {j['hours']}-h run, expected one 4-h block")
    M = max([W] + [len(a["np"]) for a in y["ants"]])
    if M > W + 1:
        sys.exit(f"{j['colony']}: a ydist ant has {M} minutes, window {W}")
    ants = []
    for a in y["ants"]:
        n = len(a["np"])
        if len(a["mv"]) != n or len(a["st"]) != n:
            sys.exit(f"{j['colony']}: ydist arrays of unequal length")
        pad = [0] * (M - n)
        ants.append({"role": a["role"], "mv": a["mv"] + pad, "st": a["st"] + pad, "np": a["np"] + pad, "no": None})
    return {"kind": "run", "colony": j["colony"], "M": M, "label": [k * FPM // BLOCK_FRAMES for k in range(M)],
            "ants": ants, "tracked": tracked, "light": lambda L: L == 0}


def bin_sum(v, w):
    return [sum(v[k:k + w]) for k in range(0, len(v), w)]


def bin_labels(label, w):
    """A w-minute bin takes the label of its first minute that has frames (as SyncStats labels a bin by its first frame)."""
    out = []
    for k in range(0, len(label), w):
        out.append(next((L for L in label[k:k + w] if L is not None), None))
    return out


# ---------------------------------------------------------------------------------------- D_w and its split ---

def dstats(mvB, stB, labB, thr, keep=None):
    """syncStats.ts out(): an ant-bin is eligible with >= thr steps (and keep, when given); each ant's mean within a block
    is sum mv / sum st over its eligible bins there; dev = mv / st - mean. Per block label: over bins with n_b >= 2,
    num = sum S_b^2, den = sum Q_b, mQ = sum (n_b - 1) Q_b, X = sum (S_b^2 - Q_b); over all bins, Qall = sum Q_b and
    nall = sum n_b; K = eligible bins per (ant, block); nbins = bins carrying the label."""
    nb = len(labB)
    S = [0.0] * nb
    Q = [0.0] * nb
    n = [0] * nb
    K = {}
    for a in range(len(mvB)):
        by = {}
        st = stB[a]
        for b in range(nb):
            if st[b] >= thr and (keep is None or keep[a][b]):
                by.setdefault(labB[b], []).append(b)
        mv = mvB[a]
        for L, bl in by.items():
            p = sum(mv[b] for b in bl) / sum(st[b] for b in bl)
            for b in bl:
                d = mv[b] / st[b] - p
                S[b] += d
                Q[b] += d * d
                n[b] += 1
            k = K.setdefault(L, [0, 0])
            k[0] += len(bl)
            k[1] += 1
    out = {}
    for b in range(nb):
        L = labB[b]
        o = out.get(L)
        if o is None:
            o = out[L] = {"num": 0.0, "den": 0.0, "mQ": 0.0, "X": 0.0, "dbins": 0, "Qall": 0.0, "nall": 0, "nbD": 0,
                          "nbins": 0, "Ksum": 0, "Kn": 0}
        o["nbins"] += 1
        o["Qall"] += Q[b]
        o["nall"] += n[b]
        if n[b] >= 2:
            o["num"] += S[b] * S[b]
            o["den"] += Q[b]
            o["mQ"] += (n[b] - 1) * Q[b]
            o["X"] += S[b] * S[b] - Q[b]
            o["dbins"] += 1
            o["nbD"] += n[b]
    for L, k in K.items():
        out[L]["Ksum"] += k[0]
        out[L]["Kn"] += k[1]
    return out


def pool(sums_list, pred=lambda L: True):
    """Sum the per-label sums of one or more sources over the labels pred accepts."""
    t = {"num": 0.0, "den": 0.0, "mQ": 0.0, "X": 0.0, "dbins": 0, "Qall": 0.0, "nall": 0, "nbD": 0, "nbins": 0,
         "Ksum": 0, "Kn": 0}
    for s in sums_list:
        for L, o in s.items():
            if pred(L):
                for k in t:
                    t[k] += o[k]
    return t


def dmr(t):
    """D, m and r from pooled sums; undefined (None) without a bin entering D."""
    if not t["den"]:
        return {"D": None, "m": None, "r": None}
    return {"D": t["num"] / t["den"], "m": t["mQ"] / t["den"], "r": div(t["X"], t["mQ"])}


def ant_bins(src, g, w):
    ants = [a for a in src["ants"] if in_group(a["role"], g)]
    return ants, [bin_sum(a["mv"], w) for a in ants], [bin_sum(a["st"], w) for a in ants]


def interior_mask(ants, w, M):
    """An ant-bin is interior when all of its w minutes exist and are in (np >= 1)."""
    return [[k + w <= M and all(a["np"][u] >= 1 for u in range(k, k + w)) for k in range(0, M, w)] for a in ants]


# --------------------------------------------------------------------- minute states, spells, entries, ages ---

def states(a, W0, W1):
    """In (np >= 1) else, with out-of-nest detections recorded (data), out (no >= 1) or unseen; runs: not-in 'N'."""
    if a["no"] is None:
        return ["I" if a["np"][t] >= 1 else "N" for t in range(W0, W1 + 1)]
    return ["I" if a["np"][t] >= 1 else ("O" if a["no"][t] >= 1 else "U") for t in range(W0, W1 + 1)]


def spells_main(s):
    """Main rule, in / not-in. Window-relative minutes 0..L-1. A run under way at the window's start is left out; one
    running to its end is censored. Returns presence spells (length, event), absence spells (length, event, has an out
    minute), entry minutes, eligible minutes E (t > 0 with t - 1 not-in) and (minute, minutes since entry)."""
    L = len(s)
    pres, abs_, entries, ages = [], [], [], []
    i = 0
    while i < L:
        isin = s[i] == "I"
        j = i
        while j + 1 < L and (s[j + 1] == "I") == isin:
            j += 1
        if i > 0:
            ev = j < L - 1
            if isin:
                pres.append((j - i + 1, ev))
                entries.append(i)
                ages.extend((t, t - i) for t in range(i, j + 1))
            else:
                abs_.append((j - i + 1, ev, any(s[t] == "O" for t in range(i, j + 1))))
        i = j + 1
    E = [t for t in range(1, L) if s[t - 1] != "I"]
    return {"pres": pres, "abs": abs_, "entries": entries, "E": E, "ages": ages}


def spells_sens(s):
    """Sensitivity, unseen as unknown (data only): presence spells are runs of I after an O minute, ending at O (event),
    censored at U or the window's end; absence spells are runs of O after an I minute, ending at I (event), censored at U
    or the end; spells after U or under way at the start are left out; entries are I minutes after an O minute."""
    L = len(s)
    pres, abs_, entries, ages = [], [], [], []
    i = 0
    while i < L:
        c = s[i]
        j = i
        while j + 1 < L and s[j + 1] == c:
            j += 1
        nxt = s[j + 1] if j < L - 1 else None
        if i > 0:
            prv = s[i - 1]
            if c == "I" and prv == "O":
                pres.append((j - i + 1, nxt == "O"))
                entries.append(i)
                ages.extend((t, t - i) for t in range(i, j + 1))
            elif c == "O" and prv == "I":
                abs_.append((j - i + 1, nxt == "I", True))
        i = j + 1
    E = [t for t in range(1, L) if s[t - 1] == "O"]
    return {"pres": pres, "abs": abs_, "entries": entries, "E": E, "ages": ages}


def age_group(age):
    for name, lo, hi in AGES:
        if age >= lo and (hi is None or age <= hi):
            return name


def clustering(entries, E, L):
    """Amendment 1 point 4. entries[i]: forager i's entry minutes, E[i]: its eligible minutes, window minutes 0..L-1.
    Entry e of i at t is clustered if another forager j != i enters in N_e = {t-1, t, t+1} within the window. Benchmark
    q_e = 1 - prod_{j != i, k_j > 0} (1 - |N_e & E_j| / |E_j|)^k_j. The focal ant's own entries never enter. Returns
    (clustered, q_e) per entry."""
    ent = [set(e) for e in entries]
    Es = [set(e) for e in E]
    k = [len(e) for e in entries]
    out = []
    for i, ei in enumerate(entries):
        for t in ei:
            N = [u for u in (t - 1, t, t + 1) if 0 <= u < L]
            cl = any(u in ent[j] for j in range(len(entries)) if j != i for u in N)
            prod = 1.0
            for j in range(len(entries)):
                if j == i or k[j] == 0:
                    continue
                c = sum(1 for u in N if u in Es[j])
                prod *= (1 - c / len(Es[j])) ** k[j]
            out.append((cl, 1 - prod))
    return out


def window(src, W0, W1):
    """Forager rows of one observation window (a data light block or a run), and steps / in minutes per group."""
    L = W1 - W0 + 1
    fa = [a for a in src["ants"] if a["role"] == "forager"]
    has_out = src["kind"] == "data"
    o = {"W0": W0, "W1": W1, "minutes": L, "exposure": src["tracked"]["forager"] * L,
         "frameless": sum(1 for t in range(W0, W1 + 1) if src["label"][t] is None)}
    o["inMin"] = sum(1 for a in fa for t in range(W0, W1 + 1) if a["np"][t] >= 1)
    o["act"] = [sum(sum(a["mv"][W0:W1 + 1]) for a in fa), sum(sum(a["st"][W0:W1 + 1]) for a in fa)]
    o["det"] = {}
    for g in GROUPS:
        ga = [a for a in src["ants"] if in_group(a["role"], g)]
        o["det"][g] = [sum(sum(a["st"][W0:W1 + 1]) for a in ga), sum(1 for a in ga for t in range(W0, W1 + 1) if a["np"][t] >= 1)]
    rules = {"main": spells_main}
    if has_out:
        rules["sens"] = spells_sens
        st_all = [states(a, W0, W1) for a in fa]
        o["notIn"] = sum(1 for s in st_all for x in s if x != "I")
        o["out"] = sum(1 for s in st_all for x in s if x == "O")
        o["unseen"] = sum(1 for s in st_all for x in s if x == "U")
    else:
        st_all = [states(a, W0, W1) for a in fa]
    for name, fn in rules.items():
        sp = [fn(s) for s in st_all]
        r = {"pres": [p for x in sp for p in x["pres"]], "abs": [p[:2] for x in sp for p in x["abs"]],
             "absWithOut": sum(1 for x in sp for p in x["abs"] if p[2]), "absN": sum(len(x["abs"]) for x in sp),
             "entriesPerAnt": [len(x["entries"]) for x in sp]}
        r["entries"] = sum(r["entriesPerAnt"])
        r["cluster"] = clustering([x["entries"] for x in sp], [x["E"] for x in sp], L)
        age = {g: [0, 0] for g, _, _ in AGES}
        for a, x in zip(fa, sp):
            for t, ag in x["ages"]:
                v = age[age_group(ag)]
                v[0] += a["mv"][W0 + t]
                v[1] += a["st"][W0 + t]
        r["age"] = age
        o[name] = r
    return o


def windows_of(src):
    """Runs: block 0, minutes 0..239 (src_run). Data: each light block (minutes labelled day x 100 + 6, 10 or 14) from its
    first to its last minute with frames, kept with >= 120 minutes."""
    if src["kind"] == "run":
        return [(0, 0, BLOCK_MIN - 1)]
    span = {}
    for t, L in enumerate(src["label"]):
        if L is not None and src["light"](L):
            s = span.setdefault(L, [t, t])
            s[1] = t
    out = []
    for L, (a, b) in sorted(span.items()):
        if any(src["label"][t] not in (None, L) for t in range(a, b + 1)):
            sys.exit(f"{src['colony']}: block {L} not contiguous")
        if b - a + 1 >= HALF_BLOCK_MIN:
            out.append((L, a, b))
    return out


def summarize(src):
    """Everything additive for one source: per-label D sums per group and width, the forager interior sums, eligibility
    and seen-by-D_w counts on light bins, and the forager windows."""
    M = src["M"]
    s = {"kind": src["kind"], "colony": src["colony"], "D": {}, "comp": {r: sum(1 for a in src["ants"] if a["role"] == r) for r in ("nurse", "forager")}}
    for g in GROUPS:
        for w in WS:
            wm = int(w) // FPM
            ants, mvB, stB = ant_bins(src, g, wm)
            labB = bin_labels(src["label"], wm)
            s["D"][(g, w)] = dstats(mvB, stB, labB, int(w) / 4)
            if g == "forager" and w == "1200":
                keep = interior_mask(ants, wm, M)
                s["Dint"] = dstats(mvB, stB, labB, int(w) / 4, keep)
                thr = int(w) / 4
                elig = intr = seen = inl = 0
                for a, st, kp in zip(ants, stB, keep):
                    for b, L in enumerate(labB):
                        if not src["light"](L):
                            continue
                        nin = sum(1 for u in range(b * wm, min(M, b * wm + wm)) if a["np"][u] >= 1)
                        inl += nin
                        if st[b] >= thr:
                            elig += 1
                            seen += nin
                            intr += 1 if kp[b] else 0
                s["elig"] = [elig, intr]
                s["seen"] = [seen, inl]
    s["windows"] = [dict(window(src, a, b), label=L, hour=(L % 100 if src["kind"] == "data" else None)) for L, a, b in windows_of(src)]
    return s


# ------------------------------------------------------------------------------------------- Kaplan-Meier ---

def km(spells, points):
    """spells: (length >= 1 in whole minutes, event). S(t) = prod over event lengths u <= t of (1 - d_u / n_u),
    n_u = #{length >= u}. At each point: atRisk = #{length >= t}, events and censored cumulative (length <= t),
    S missing when atRisk < 5. Median: the first event length u with S(u) <= 0.5, estimable when n_u >= 5."""
    T = sorted(d for d, _ in spells)
    ev = {}
    for d, e in spells:
        if e:
            ev[d] = ev.get(d, 0) + 1
    risk = lambda u: len(T) - bisect_left(T, u)
    curve = []
    S = 1.0
    for u in sorted(ev):
        S *= 1 - ev[u] / risk(u)
        curve.append((u, S, risk(u)))
    pts = {}
    for t in points:
        St = 1.0
        for u, Su, _ in curve:
            if u <= t:
                St = Su
        n = risk(t)
        pts[str(t)] = {"S": St if n >= MIN_RISK else None, "atRisk": n,
                       "events": sum(1 for d, e in spells if e and d <= t),
                       "censored": sum(1 for d, e in spells if not e and d <= t)}
    med = None
    for u, Su, n in curve:
        if Su <= 0.5:
            med = u if n >= MIN_RISK else None
            break
    return {"points": pts, "median": med, "spells": len(spells), "events": sum(1 for _, e in spells if e)}


# ---------------------------------------------------------------------------------------- per-colony values ---

def colony_values(sums, kind):
    """Per-colony values from the colony's sources (data: one; arm: its two runs)."""
    v, extra = {}, {}
    light = (lambda L: L is not None and L % 100 in LIGHT) if kind == "data" else (lambda L: L == 0)
    for g in GROUPS:
        for w in WS:
            t = pool([s["D"][(g, w)] for s in sums], light)
            for k, x in dmr(t).items():
                v[f"A.{g}.{w}.{k}"] = x
            if w == "1200":
                v[f"C.K.{g}"] = div(t["Ksum"], t["Kn"])
            if g == "forager" and w == "1200":
                v["B.nbAllBins"] = div(t["nall"], t["nbins"])
                v["B.nbDBins"] = div(t["nbD"], t["dbins"])
                v["B.slowVar"] = div(t["Qall"], t["nall"])
    ti = pool([s["Dint"] for s in sums], light)
    for k, x in dmr(ti).items():
        v[f"A.forager.1200.interior.{k}"] = x
    el = [sum(s["elig"][0] for s in sums), sum(s["elig"][1] for s in sums)]
    v["A.forager.1200.interiorShare"] = div(el[1], el[0])
    v["C.seenByDw"] = div(sum(s["seen"][0] for s in sums), sum(s["seen"][1] for s in sums))
    W = [w for s in sums for w in s["windows"]]
    expo = sum(w["exposure"] for w in W)
    mins = sum(w["minutes"] for w in W)
    inm = sum(w["inMin"] for w in W)
    v["B.inFrac"] = div(inm, expo)
    v["B.coPresentPerMin"] = div(inm, mins)
    v["B.activity.overall"] = div(sum(w["act"][0] for w in W), sum(w["act"][1] for w in W))
    for g in GROUPS:
        v[f"C.stepsPerInMin.{g}"] = div(sum(w["det"][g][0] for w in W), sum(w["det"][g][1] for w in W))
    rules = [("main", "B"), ("sens", "S")] if kind == "data" else [("main", "B")]
    for rule, P in rules:
        R = [w[rule] for w in W]
        v[f"{P}.entriesPerForagerHour"] = div(sum(r["entries"] for r in R), expo / 60) if expo else None
        cl = [c for r in R for c in r["cluster"]]
        obs = div(sum(1 for c, _ in cl if c), len(cl))
        bench = div(sum(q for _, q in cl), len(cl))
        v[f"{P}.cluster.observed"] = obs
        v[f"{P}.cluster.benchmark"] = bench
        v[f"{P}.cluster.excess"] = obs - bench if ok(obs) and ok(bench) else None
        for g, _, _ in AGES:
            v[f"{P}.activity.age.{g}"] = div(sum(r["age"][g][0] for r in R), sum(r["age"][g][1] for r in R))
        for name, pts in (("presence", STAY_T), ("absence", TRIP_T)):
            k = km([p for r in R for p in r["pres" if name == "presence" else "abs"]], pts)
            extra[f"{P}.{name}"] = k
            for t in pts:
                v[f"{P}.{name}.S{t}"] = k["points"][str(t)]["S"]
            v[f"{P}.{name}.median"] = k["median"]
        extra[f"{P}.entriesPerAnt"] = [r["entriesPerAnt"] for r in R]
        if kind == "data" and rule == "main":
            v["C.absence.withOutShare"] = div(sum(r["absWithOut"] for r in R), sum(r["absN"] for r in R))
    if kind == "data":
        ni = sum(w["notIn"] for w in W)
        v["C.notIn.outShare"] = div(sum(w["out"] for w in W), ni)
        v["C.notIn.unseenShare"] = div(sum(w["unseen"] for w in W), ni)
        # Part D: by light block, foragers, 10 min. D, m, r with >= half the block's 10-min bins entering D (D207);
        # residence rows from that block's window (>= 120 minutes).
        fs = sums[0]["D"][("forager", "1200")]
        per = {}
        for L, o in fs.items():
            if L is None or L % 100 not in LIGHT or o["dbins"] < BLOCK_FRAMES // 1200 // 2:
                continue
            if L % 100 in per:
                sys.exit(f"{sums[0]['colony']}: two light blocks at {L % 100:02d} UTC with >= 12 bins")
            per[L % 100] = dmr(o)
        wins = {}
        for w in W:
            if w["hour"] in wins:
                sys.exit(f"{sums[0]['colony']}: two light windows at {w['hour']:02d} UTC with >= 120 minutes")
            wins[w["hour"]] = w
        for h in LIGHT:
            for k in ("D", "m", "r"):
                v[f"D.{h}.{k}"] = per.get(h, {}).get(k)
            w = wins.get(h)
            v[f"D.{h}.inFrac"] = div(w["inMin"], w["exposure"]) if w else None
            v[f"D.{h}.coPresentPerMin"] = div(w["inMin"], w["minutes"]) if w else None
            v[f"D.{h}.entriesPerForagerHour"] = div(w["main"]["entries"], w["exposure"] / 60) if w and w["exposure"] else None
        for h in LIGHT[1:]:
            for k in ("D", "m", "r", "inFrac", "coPresentPerMin", "entriesPerForagerHour"):
                a, b = v[f"D.{h}.{k}"], v[f"D.6.{k}"]
                v[f"D.{h}-6.{k}"] = a - b if ok(a) and ok(b) else None
        extra["windows"] = [{"label": w["label"], "hour": w["hour"], "minutes": w["minutes"], "frameless": w["frameless"]} for w in W]
    return v, extra


def counterfactual(dv, av):
    """Per colony: D-dagger = 1 + m(data) r(arm), D-double-dagger = 1 + m(arm) r(data), and their differences."""
    out = {}
    for g in GROUPS:
        for w in WS:
            p = f"A.{g}.{w}."
            md, rd, Dd = dv[p + "m"], dv[p + "r"], dv[p + "D"]
            ma, ra, Da = av[p + "m"], av[p + "r"], av[p + "D"]
            dag = 1 + md * ra if ok(md) and ok(ra) else None
            ddag = 1 + ma * rd if ok(ma) and ok(rd) else None
            out[p + "Ddag"] = dag
            out[p + "dataMinusDdag"] = Dd - dag if ok(Dd) and ok(dag) else None
            out[p + "DdagMinusArm"] = dag - Da if ok(dag) and ok(Da) else None
            out[p + "Dddag"] = ddag
            out[p + "dataMinusDddag"] = Dd - ddag if ok(Dd) and ok(ddag) else None
            out[p + "DddagMinusArm"] = ddag - Da if ok(ddag) and ok(Da) else None
    return out


# ------------------------------------------------------------------------------------ sets and the bootstrap ---

def make_counts(seed=SEED, draws=B, ncol=NCOL):
    """The joint bootstrap: draws of the 22 colony labels (indices 0..21, data order), once, shared by every cell; as
    multiplicities per colony."""
    rng = random.Random(seed)
    out = []
    for _ in range(draws):
        c = [0] * ncol
        for _ in range(ncol):
            c[rng.randrange(ncol)] += 1
        out.append(c)
    return out


def ci(vals, draws=B):
    v = sorted(x for x in vals if x is not None)
    if len(v) < 0.99 * draws:
        return None
    return [v[int(0.025 * len(v))], v[int(0.975 * len(v)) - 1]]


def setrow(vals, lab, counts, minn=0):
    """vals: colony index -> value or None (analysed colonies). Mean over the defined ones; the bootstrap restricts each
    shared draw to them (their drawn multiplicities). Fewer than minn defined (survival rows: floor_for): missing, with
    the count kept."""
    idx = [i for i in sorted(vals) if ok(vals[i])]
    row = {"n": len(idx), "missing": [lab[i] for i in sorted(vals) if not ok(vals[i])]}
    est = sum(vals[i] for i in idx) / len(idx) if idx else None
    boots = []
    for c in counts:
        s = w = 0.0
        for i in idx:
            k = c[i]
            if k:
                s += k * vals[i]
                w += k
        boots.append(s / w if w else None)
    if len(idx) < minn:
        row.update(est=None, ci95=None, belowMinColonies=True)
    else:
        row.update(est=est, ci95=ci(boots, len(counts)))
    return row


def diffrow(a, d, lab, counts, minn=0):
    """a - d per colony on common support (both defined on the original sample); excluded colonies listed."""
    vals = {i: (a[i] - d[i] if ok(a.get(i)) and ok(d.get(i)) else None) for i in sorted(set(a) | set(d))}
    row = setrow(vals, lab, counts, minn)
    row["support"] = row.pop("n")
    row["excluded"] = row.pop("missing")
    return row


def median_rows(dmed, amed, lab, counts, minn=MIN_COL):
    """Medians: a set's mean median only over common-support colonies estimable on both sides, with the counts."""
    both = [i for i in sorted(dmed) if ok(dmed.get(i)) and ok(amed.get(i))]
    d = {i: dmed[i] for i in both}
    a = {i: amed[i] for i in both}
    return {"support": len(both), "notEstimableData": [lab[i] for i in sorted(dmed) if not ok(dmed[i])],
            "notEstimableArm": [lab[i] for i in sorted(amed) if not ok(amed[i])],
            "data": setrow(d, lab, counts, minn), "arm": setrow(a, lab, counts, minn), "armMinusData": diffrow(a, d, lab, counts, minn)}


def km_table(extras, key, pts):
    """Summed over colonies at each point: events, censorings, at risk; per colony S (None when below support)."""
    out = {}
    for t in pts:
        p = [e[key]["points"][str(t)] for e in extras.values()]
        out[str(t)] = {"events": sum(x["events"] for x in p), "censored": sum(x["censored"] for x in p),
                       "atRisk": sum(x["atRisk"] for x in p)}
    return out


# ---------------------------------------------------------------------------------------------- self-checks ---

def rel(a, b):
    if not ok(a) and not ok(b):
        return 0.0
    if not ok(a) or not ok(b):
        return float("inf")
    return abs(a - b) / abs(b) if b else abs(a - b)


def stored_light(sync, g, w):
    bl = sync[g][w]["blocks"]
    num = sum(b["num"] for k, b in bl.items() if int(k) % 100 in LIGHT)
    den = sum(b["den"] for k, b in bl.items() if int(k) % 100 in LIGHT)
    return num / den if den else None


def md5(p):
    with open(p, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()


def main():
    t0 = time.time()
    a = sys.argv
    opt = lambda k, d: a[a.index(k) + 1] if k in a else d
    DIR = opt("--dir", "logs/partd2/foragers")
    cols = [int(x) for x in opt("--colonies", ",".join(map(str, range(NCOL)))).split(",")]
    arms = opt("--arms", ",".join(ARMS)).split(",")
    if any(x not in ARMS for x in arms) or any(not 0 <= c < NCOL for c in cols):
        sys.exit("unknown arm or colony index")
    full = sorted(cols) == list(range(NCOL)) and arms == ARMS
    fit = readj(FIT_ROWS)["colonies"]
    runIdx = {c["colony"]: k for k, c in enumerate(fit)}
    fitAnts = {c["colony"]: c["ants"] for c in fit}
    lab, dsum, comp, chk1, recmd5 = {}, {}, {}, [], {}
    for c in cols:
        rp = f"{DIR}/data-c{c}.json"
        recmd5[rp] = md5(rp)
        j = readj(rp)
        if j["index"] != c:
            sys.exit(f"{rp}: index {j['index']}")
        src = src_data(j)
        lab[c] = src["colony"]
        dsum[c] = summarize(src)
        comp[c] = {"recorder": j["tracked"], "recorderAnts": dsum[c]["comp"], "runs": fitAnts[src["colony"]], "ydist": {}}
        del j, src
        gc.collect()
        sd = slim(f"logs/short/data-c{c}.json", ["colony", "sync", "ants"])
        if sd["colony"] != lab[c]:
            sys.exit(f"logs/short/data-c{c}.json is {sd['colony']}, recorder {lab[c]}")
        comp[c]["short"] = sd["ants"]
        for g in GROUPS:
            for w in WS:
                S = dsum[c]["D"][(g, w)]
                mine = dmr(pool([S], lambda L: L is not None and L % 100 in LIGHT))["D"]
                allb = dmr(pool([S]))["D"]
                chk1.append((f"data {lab[c]} {g}.{w} light", mine, stored_light(sd["sync"], g, w)))
                chk1.append((f"data {lab[c]} {g}.{w} allBlocks", allb, sd["sync"][g][w]["D"]))
        del sd
        gc.collect()
    asum = {x: {} for x in arms}
    for x in arms:
        for c in cols:
            k = runIdx[lab[c]]
            pair = []
            for r in (0, 1):
                p = f"logs/short/pd-as-{x}-r{r}-c{k}.json"
                j = slim(p, ["colony", "ydist", "sync", "hours"])
                if j["colony"] != lab[c]:
                    sys.exit(f"{p} is {j['colony']}, expected {lab[c]}")
                src = src_run(j, fitAnts[lab[c]])
                s = summarize(src)
                comp[c]["ydist"][f"{x}-r{r}"] = s["comp"]
                for g in GROUPS:
                    for w in WS:
                        chk1.append((f"run {x}-r{r}-c{k} {g}.{w}", dmr(pool([s["D"][(g, w)]]))["D"], j["sync"][g][w]["D"]))
                pair.append(s)
                del j, src
                gc.collect()
            asum[x][c] = pair
    # Per-colony values.
    dval, dext = {}, {}
    for c in cols:
        dval[c], dext[c] = colony_values([dsum[c]], "data")
    aval, aext = {x: {} for x in arms}, {x: {} for x in arms}
    for x in arms:
        for c in cols:
            aval[x][c], aext[x][c] = colony_values(asum[x][c], "arm")
    # Self-check 2: D - 1 = m r per colony, every group, width and the interior variant.
    chk2 = []
    for side, vals in [("data", dval)] + [(x, aval[x]) for x in arms]:
        for c, v in vals.items():
            for p in [f"A.{g}.{w}." for g in GROUPS for w in WS] + ["A.forager.1200.interior."]:
                D, m, r = v[p + "D"], v[p + "m"], v[p + "r"]
                if ok(D):
                    chk2.append((f"{side} {lab[c]} {p[2:-1]}", abs((D - 1) - m * r)))
    fail1 = [x for x in chk1 if rel(x[1], x[2]) > TOL]
    fail2 = [x for x in chk2 if not x[1] <= TOL]
    # Composition: recorder = Stage 2b's data file = the runs' colony (fit rows); ydist ants seen <= tracked.
    failc = []
    for c in cols:
        q = comp[c]
        good = all(q["recorder"][r] == q["short"][r] == q["runs"][r] == q["recorderAnts"][r] for r in ("nurse", "forager"))
        good = good and all(y[r] <= q["runs"][r] for y in q["ydist"].values() for r in ("nurse", "forager"))
        q["pass"] = good
        if not good:
            failc.append(lab[c])
    chk3 = []
    read2b = readj(READ2B)
    rows2b = {r["row"]: r for r in read2b["rows"]}
    counts = make_counts()
    if full:
        for g in ("all", "forager"):
            mine = setrow({c: dval[c][f"A.{g}.1200.D"] for c in cols}, lab, counts)["est"]
            for x in ARMS:
                st = rows2b[f"S1 D_w {g}.1200"]["arms"][x]["data"]
                chk3.append((f"{g}.1200 vs read.json ({x})", mine, st, ok(mine) and round(mine, 2) == round(st, 2)))
    fail3 = [x for x in chk3 if not x[3]]
    if fail1 or fail2 or fail3 or failc:
        print("SELF-CHECK FAILED")
        for n, m, s in fail1:
            print(f"  1 {n}: rebuilt {m!r} stored {s!r} rel {rel(m, s):.3g}")
        for n, e in fail2:
            print(f"  2 {n}: |D - 1 - m r| = {e!r}")
        for n, m, s, _ in fail3:
            print(f"  3 {n}: mean {m!r} read.json {s!r}")
        for l in failc:
            print(f"  composition {l}: {json.dumps({k: v for k, v in comp[[c for c in cols if lab[c] == l][0]].items()})}")
        sys.exit(1)
    print("self-check 1 (D_w rebuilt from the recorder / ydist = stored, relative 1e-9): pass")
    for n, m, s in chk1:
        print(f"  {n}: rebuilt {m!r} stored {s!r} rel {rel(m, s):.2e}")
    print(f"self-check 2 (D - 1 = m r, 1e-9): pass, {len(chk2)} cells, largest error {max(e for _, e in chk2):.2e}")
    print("self-check 3 (data set means = read.json, printed precision):", "pass" if full else "not run (not the full run)")
    for n, m, s, _ in chk3:
        print(f"  {n}: {m!r} vs {s!r}")
    print(f"composition (tracked nurses and foragers: recorder = data-c*.json = runs; ydist ants seen <= tracked): pass")

    # ---------------------------------------------------------------- rows (computed only after the gate) ---
    # Range sanity of the per-colony values (counts only, no value printed): shares, fractions and S in [0, 1], m >= 1
    # (every bin entering D has n_b >= 2), D >= 0, rates and counts >= 0.
    unit = ("inFrac", "Share", "activity", "cluster.observed", "cluster.benchmark", "seenByDw", ".S")
    nonneg = ("coPresentPerMin", "nbAllBins", "nbDBins", "entriesPerForagerHour", "slowVar", "C.K.", "stepsPerInMin", ".median", ".D")
    sanity = {"values": 0, "undefined": 0, "undefinedOutsideSurvival": 0, "outOfRange": []}
    for side, vals in [("data", dval)] + [(x, aval[x]) for x in arms]:
        for c, v in vals.items():
            for k, x in v.items():
                sanity["values"] += 1
                if not ok(x):
                    sanity["undefined"] += 1
                    if "presence" not in k and "absence" not in k:
                        sanity["undefinedOutsideSurvival"] += 1
                    continue
                if "-6." in k or "excess" in k:  # block contrasts and observed - benchmark may be negative
                    continue
                bad = (any(u in k for u in unit) and not 0 <= x <= 1) or (k.rsplit(".", 1)[-1] == "m" and x < 1 - 1e-12) \
                    or (any(u in k for u in nonneg) and x < 0)
                if bad:
                    sanity["outOfRange"].append(f"{side} {lab[c]} {k}")
    print(f"range sanity of per-colony values: {sanity['values']} values, {sanity['undefined']} undefined "
          f"({sanity['undefinedOutsideSurvival']} outside the survival rows), "
          f"{len(sanity['outOfRange'])} out of range" + (f": {sanity['outOfRange']}" if sanity["outOfRange"] else ""))
    rows = {}
    keys = sorted(dval[cols[0]])
    akeys = sorted(aval[arms[0]][cols[0]]) if arms else []
    for k in keys:
        rows[k] = {"data": setrow({c: dval[c][k] for c in cols}, lab, counts, floor_for(k))}
    for k in akeys:
        rows.setdefault(k, {"data": None})["arms"] = {}
    cf = {x: {c: counterfactual(dval[c], aval[x][c]) for c in cols} for x in arms}
    for x in arms:
        for k in akeys:
            if k.endswith(".median"):
                rows[k]["arms"][x] = median_rows({c: dval[c][k] for c in cols}, {c: aval[x][c][k] for c in cols}, lab, counts)
                continue
            av = {c: aval[x][c][k] for c in cols}
            dv = {c: dval[c][k] for c in cols}
            rows[k]["arms"][x] = {"arm": setrow(av, lab, counts, floor_for(k)), "armMinusData": diffrow(av, dv, lab, counts, floor_for(k))}
        for k in cf[x][cols[0]]:
            rows.setdefault(k, {"arms": {}})["arms"][x] = setrow({c: cf[x][c][k] for c in cols}, lab, counts)
    for k in keys:
        if k.endswith(".median"):
            rows[k]["data"]["notEstimable"] = rows[k]["data"].pop("missing")
            rows[k]["data"]["note"] = f"mean over colonies whose median is estimable; the others: {NE}"
    km_rows = {}
    for P, kinds in (("B", ["data"] + arms), ("S", ["data"])):
        for name, pts in (("presence", STAY_T), ("absence", TRIP_T)):
            key = f"{P}.{name}"
            km_rows[key] = {"data": km_table(dext, key, pts)}
            for x in arms if P == "B" else []:
                km_rows[key][x] = km_table(aext[x], key, pts)
    perColony = {lab[c]: {"data": {"medians": {k: (dval[c][k] if ok(dval[c][k]) else NE) for k in keys if k.endswith(".median")},
                                   "km": {k: dext[c][k] for k in dext[c] if k[:2] in ("B.", "S.") and not k.endswith("entriesPerAnt")},
                                   "entriesPerAnt": {"main": dext[c]["B.entriesPerAnt"], "sens": dext[c]["S.entriesPerAnt"]},
                                   "windows": dext[c]["windows"]},
                          "arms": {x: {"medians": {k: (aval[x][c][k] if ok(aval[x][c][k]) else NE) for k in akeys if k.endswith(".median")},
                                       "km": {k: aext[x][c][k] for k in aext[x][c] if not k.endswith("entriesPerAnt")},
                                       "entriesPerAnt": aext[x][c]["B.entriesPerAnt"]} for x in arms}} for c in cols}
    classes = {}
    for g in ("all", "forager"):
        key = f"S1 D_w {g}.1200"
        classes[f"{g}.1200"] = {x: rows2b[key]["arms"][x]["cls"] for x in arms} if key in rows2b else None
    here = os.path.dirname(os.path.abspath(__file__))
    meta = {"design": ["D223", "D224"], "amendment": "D223 amendment 1", "seed": SEED, "draws": B, "minColonies": {"value": MIN_COL, "appliesTo": "survival rows only: " + SURVIVAL.pattern},
            "minAtRisk": MIN_RISK, "command": "python3 -I " + " ".join(a), "full": full,
            "colonies": {c: lab[c] for c in cols}, "arms": arms,
            "md5": {n: md5(os.path.join(here, n)) for n in ("foragers1c.py", "foragers1cData.ts", "foragers1cSyn.py") if os.path.exists(os.path.join(here, n))},
            "recorderMd5": recmd5, "labels": LABELS,
            "scopes": {"D": "Part A, K, n_b, slow variability, seen by D_w, interior: every light-labelled bin (data: all light "
                            "blocks pooled, as the Stage 2b reader; runs: block 0 of both runs)",
                       "windows": "Part B, detection density, out / unseen, Part D residence rows: data light blocks with >= 120 "
                                  "minutes (first to last minute with frames); runs: block 0, minutes 0-239 (minute 240, holding the frame at t = 4 h, is SyncStats block 1)",
                       "PartD.Dmr": "a block's D, m, r with >= 12 of its 10-min bins entering D (D207)",
                       "nbAllBins": "mean eligible foragers over every light 10-min bin; nbDBins: over bins entering D",
                       "slowVar": "sum Q_b / sum n_b over every light 10-min bin (all eligible forager ant-bins)",
                       "activity": "in-nest moving fraction sum mv / sum st; by stay age over observed presence spells whose entry was observed"},
            "selfChecks": {"1": {"cells": len(chk1), "maxRel": max(rel(m, s) for _, m, s in chk1)},
                           "2": {"cells": len(chk2), "maxAbs": max(e for _, e in chk2)},
                           "3": [{"cell": n, "mean": m, "read": s} for n, m, s, _ in chk3] if full else "not run"},
            "rangeSanity": sanity, "seconds": None}
    out = {"meta": meta, "classes2b": classes, "composition": {lab[c]: comp[c] for c in cols}, "rows": rows,
           "survivalCounts": km_rows, "perColony": perColony}
    meta["seconds"] = round(time.time() - t0, 1)
    outp = f"{DIR}/result.json"
    with open(outp, "w") as f:
        json.dump(out, f, indent=1)
    tally = {"cells": 0, "belowMinColonies": 0, "undefined": 0, "noInterval": 0}

    def walk(x):
        if isinstance(x, dict):
            if "est" in x and "ci95" in x:
                tally["cells"] += 1
                if x.get("belowMinColonies"):
                    tally["belowMinColonies"] += 1
                elif x["est"] is None:
                    tally["undefined"] += 1
                elif x["ci95"] is None:
                    tally["noInterval"] += 1
            for y in x.values():
                walk(y)

    walk(rows)
    print(f"wrote {outp} in {meta['seconds']} s; set cells {tally['cells']}: below {MIN_COL} colonies (missing) "
          f"{tally['belowMinColonies']}, undefined {tally['undefined']}, without interval {tally['noInterval']}")


if __name__ == "__main__":
    main()
