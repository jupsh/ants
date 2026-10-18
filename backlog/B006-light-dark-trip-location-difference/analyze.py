"""Descriptive light/dark audit of the 22 Stroeymeyt fit colonies.

Run from the repository root: python3 -I backlog/B006-light-dark-trip-location-difference/analyze.py
No raw tracks, age-experiment colonies, or simulation results are read.
"""

import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ROWS = ROOT / "data/reference/stroeymeyt2018-fit-rows.json"
GUARD = ROOT / "logs/q/guard-data.json"
OUT = Path(__file__).resolve().parent / "results/analysis.md"


def ranks(values):
    ordered = sorted(range(len(values)), key=values.__getitem__)
    out = [0.0] * len(values)
    i = 0
    while i < len(values):
        j = i + 1
        while j < len(values) and values[ordered[j]] == values[ordered[i]]:
            j += 1
        for k in range(i, j):
            out[ordered[k]] = (i + j - 1) / 2 + 1
        i = j
    return out


def pearson(a, b):
    if len(a) < 3:
        return None
    am, bm = sum(a) / len(a), sum(b) / len(b)
    num = sum((x - am) * (y - bm) for x, y in zip(a, b))
    den = math.sqrt(sum((x - am) ** 2 for x in a) * sum((y - bm) ** 2 for y in b))
    return num / den if den else None


def corr(rows, x, y):
    pairs = [(math.log(r[x]), math.log(r[y])) for r in rows if r[x] is not None and r[y] is not None]
    a, b = zip(*pairs) if pairs else ([], [])
    return len(pairs), pearson(a, b), pearson(ranks(a), ranks(b))


def ratio(a, b):
    return a / b if a is not None and b is not None and a > 0 and b > 0 else None


fit = json.loads(ROWS.read_text())
guard = json.loads(GUARD.read_text())
fit_rows = {c["colony"]: c["rows"] for c in fit["colonies"]}
assert len(fit_rows) == len(guard) == 22 and set(fit_rows) == set(guard)

items = []
for colony in sorted(guard):
    r, g = fit_rows[colony], guard[colony]
    n_light, n_dark = r["trip.n.light"], r["trip.n.dark"]
    items.append(dict(
        colony=colony,
        n_light=n_light,
        n_dark=n_dark,
        trip=ratio(r["trip.median.dark"], r["trip.median.light"]),
        activity=ratio(g["light"]["movingFraction"], g["dark"]["movingFraction"]),
        contacts=ratio(g["light"]["movingContacts"], g["dark"]["movingContacts"]),
    ))

def fmt(v):
    return "—" if v is None else f"{v:.3f}"


lines = [
    "# B006 light/dark audit",
    "",
    "Sources: `data/reference/stroeymeyt2018-fit-rows.json` (complete-trip medians and counts); "
    "`logs/q/guard-data.json` (moving fraction and moving-involved contact rate per detected ant-frame). "
    "All 22 are the designated fit colonies. Ratios point toward the phase with the larger observed value: "
    "trip duration = dark/light; activity and contacts = light/dark. No new statistic definitions.",
    "",
    "| Colony | Complete trips light/dark | Trip duration D/L | Moving fraction L/D | Moving contacts L/D |",
    "|---|---:|---:|---:|---:|",
]
for r in items:
    lines.append(f"| {r['colony']} | {r['n_light']}/{r['n_dark']} | "
                 f"{fmt(r['trip'])} | {fmt(r['activity'])} | {fmt(r['contacts'])} |")

lines += ["", "## Correlations of log ratios", "", "Pearson r and Spearman ρ, unweighted by colony. "
          "Pairs are complete-case; the sparse-trip sensitivity requires ≥10 complete trips in each phase.", "",
          "| Pair | Colonies | Pearson r | Spearman ρ |",
          "|---|---:|---:|---:|"]
for name, sample in [("All fit colonies", items),
                     ("Trip counts ≥10 each phase", [r for r in items if r["n_light"] >= 10 and r["n_dark"] >= 10])]:
    for x, y in [("trip", "activity"), ("trip", "contacts"), ("activity", "contacts")]:
        n, p, s = corr(sample, x, y)
        lines.append(f"| {name}: {x} vs {y} | {n} | {fmt(p)} | {fmt(s)} |")

lines += ["", "## Leave-one-colony-out sensitivity", "",
          "| Pair | Pearson r range | Spearman ρ range | Omission with lowest Pearson r |",
          "|---|---:|---:|---|"]
for x, y in [("trip", "activity"), ("trip", "contacts"), ("activity", "contacts")]:
    omitted = [(r["colony"], *corr([a for a in items if a is not r], x, y)[1:]) for r in items]
    lo = min(omitted, key=lambda a: a[1])
    lines.append(f"| {x} vs {y} | {fmt(lo[1])} to {fmt(max(a[1] for a in omitted))} | "
                 f"{fmt(min(a[2] for a in omitted))} to {fmt(max(a[2] for a in omitted))} | {lo[0]} |")

for key in ["trip", "activity", "contacts"]:
    values = [math.log(r[key]) for r in items if r[key] is not None]
    lines.append(f"\nGeometric mean {key} ratio: {math.exp(sum(values) / len(values)):.3f} "
                 f"({len(values)} colonies).")

OUT.parent.mkdir(exist_ok=True)
OUT.write_text("\n".join(lines) + "\n")
print(f"Wrote {OUT.relative_to(ROOT)}")
