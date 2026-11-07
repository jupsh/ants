# Scratch (not committed): D205 Part 2 item 1(a), designed in D207 (D206; P81-P83). The existing D_w by 4-h light
# block in the data (06-10, 10-14, 14-18 UTC) beside every Stage 2b arm's per-run value (one 4-h block, no clock).
# Descriptive: no rule, no class; Stage 2b's row classes are copied beside from read.json, never recomputed.
# Run: python3 -I scripts/scratch/partDBlocks.py → logs/partd2/blocks.json
import gc, json, random, sys

NCOL = 22
GROUPS = ["all", "nurse", "forager"]
WS = ["1200", "120", "10"]  # frames at 2 fps: 10 min (primary), 1 min, 5 s (D204)
LIGHT = [6, 10, 14]
BLOCK = 28800  # frames in a 4-h block
# A block enters with >= half its bins, BLOCK / w / 2 (12 of 24 at 10 min, 120 of 240 at 1 min, 1440 of 2880 at 5 s)
# (primary); full blocks only, >= BLOCK / w bins, is the sensitivity (D207 amendment 3).
MIN_FRAC = {"primary": 0.5, "fullBlocks": 1.0}
ARMS = ["T20f", "T20m", "Eu-M", "El20-M", "Ed2", "Ed5", "Ed20", "Ew5", "Es", "Eu", "El20", "base"]
B = 2000
SEED = 0xD207


def readj(p):
    with open(p) as f:
        return json.load(f)


def slim(p):
    """Only what this script reads: the inputs total ~23 GB of JSON, so each file is parsed alone and the rest dropped
    (the first run held them all and exhausted memory, D207 amendment)."""
    j = readj(p)
    out = {"colony": j["colony"], "sync": j["sync"]}
    del j
    gc.collect()
    return out


def ratio(blocks):
    num = sum(b["num"] for b in blocks)
    den = sum(b["den"] for b in blocks)
    return num / den if den else float("nan")


def data_colony(j, g, w, min_bins):
    """Per light block D (by start hour) and the pooled light value as the Stage 2b reader takes it."""
    bl = j["sync"][g][w]["blocks"]
    # Blocks are labelled day x 100 + start hour; a colony recorded into the next morning has a second 06 block (a
    # fragment of 1-10 bins), so blocks are keyed by label, never by hour (D207 amendment 2).
    light = {k: b for k, b in bl.items() if int(k) % 100 in LIGHT}
    per = {}
    for k, b in light.items():
        if b["bins"] < min_bins:
            continue
        h = int(k) % 100
        if h in per:
            sys.exit(f"{j['colony']}: two light blocks at {h:02d} UTC with >= {min_bins} bins")
        per[h] = b["num"] / b["den"] if b["den"] else float("nan")
    return per, ratio(list(light.values())), {k: b["bins"] for k, b in light.items()}


def arm_colony(files, g, w):
    """Per run D (its one block) and the pooled value over the two runs, as the reader takes it."""
    bls = [list(j["sync"][g][w]["blocks"].values()) for j in files]
    runs = [ratio(b) for b in bls]
    return runs, ratio([b for bl in bls for b in bl])


def nanmean(xs):
    xs = [x for x in xs if x == x]
    return sum(xs) / len(xs) if xs else float("nan")


def ci(vals):
    v = sorted(x for x in vals if x == x)
    if len(v) < 0.99 * B:
        return None
    return [v[int(0.025 * len(v))], v[int(0.975 * len(v)) - 1]]


def mean_abs_pair(xs):
    xs = [x for x in xs if x == x]
    p = [abs(a - b) for i, a in enumerate(xs) for b in xs[i + 1:]]
    return sum(p) / len(p) if p else float("nan")


def main():
    data = [slim(f"logs/short/data-c{c}.json") for c in range(NCOL)]
    labels = [j["colony"] for j in data]
    runs = {}
    for a in ARMS:
        byLab = {}
        for c in range(NCOL):
            fr = [slim(f"logs/short/pd-as-{a}-r{r}-c{c}.json") for r in (0, 1)]
            if fr[0]["colony"] != fr[1]["colony"]:
                sys.exit(f"{a} c{c}: runs disagree on the colony")
            byLab[fr[0]["colony"]] = fr
        if sorted(byLab) != sorted(labels):
            sys.exit(f"{a}: colony labels differ from the data's")
        runs[a] = byLab
    read2b = readj("logs/partd2/assess/read.json")
    out = {"design": "D207", "seed": SEED, "draws": B, "minFrac": MIN_FRAC, "colonies": labels, "cells": {}}
    rng = random.Random(SEED)
    draws = [[rng.randrange(NCOL) for _ in range(NCOL)] for _ in range(B)]
    for sens, frac in MIN_FRAC.items():
        for g in GROUPS:
            for w in WS:
                cell = f"{g}.{w}"
                mb = int(BLOCK // int(w) * frac)
                dcol = [data_colony(j, g, w, mb) for j in data]
                dblk = {h: [d[0].get(h, float("nan")) for d in dcol] for h in LIGHT}
                dpool = [d[1] for d in dcol]
                dpair = [mean_abs_pair(list(d[0].values())) for d in dcol]
                acol = {a: [arm_colony(runs[a][l], g, w) for l in labels] for a in ARMS}
                apair = {a: [mean_abs_pair(x[0]) for x in acol[a]] for a in ARMS}

                def stats(idx):
                    s = {"data": {"pooled": nanmean([dpool[i] for i in idx]),
                                  "block": {h: nanmean([dblk[h][i] for i in idx]) for h in LIGHT},
                                  "pairAbs": nanmean([dpair[i] for i in idx])}}
                    for h1, h2 in ((6, 10), (6, 14), (10, 14)):
                        s["data"][f"d{h2}-{h1}"] = nanmean([dblk[h2][i] - dblk[h1][i] for i in idx])
                    for a in ARMS:
                        pooled = nanmean([acol[a][i][1] for i in idx])
                        pair = nanmean([apair[a][i] for i in idx])
                        s[a] = {"pooled": pooled, "pairAbs": pair,
                                "minusDataPooled": nanmean([acol[a][i][1] - dpool[i] for i in idx]),
                                "minusDataBlock": {h: nanmean([acol[a][i][1] - dblk[h][i] for i in idx]) for h in LIGHT},
                                "pairAbsMinusData": nanmean([apair[a][i] - dpair[i] for i in idx])}
                    return s

                point = stats(range(NCOL))
                boots = [stats(d) for d in draws]

                def walk(p, path):
                    if isinstance(p, dict):
                        return {k: walk(v, path + [k]) for k, v in p.items()}
                    vals = []
                    for b in boots:
                        x = b
                        for k in path:
                            x = x[k]
                        vals.append(x)
                    return {"est": p, "ci95": ci(vals)}

                res = walk(point, [])
                res["support"] = {"blocksPerHour": {h: sum(1 for x in dblk[h] if x == x) for h in LIGHT},
                                  "bins": {l: d[2] for l, d in zip(labels, dcol)}}
                if sens == "primary":
                    rows = {r["row"]: r for r in read2b["rows"]}
                    key = f"S1 D_w {cell}"
                    if key in rows:
                        res["classes2b"] = {a: rows[key]["arms"][a]["cls"] for a in ARMS}
                out["cells"].setdefault(sens, {})[cell] = res
    with open("logs/partd2/blocks.json", "w") as f:
        json.dump(out, f, indent=1)
    print("wrote logs/partd2/blocks.json")


if __name__ == "__main__":
    main()
