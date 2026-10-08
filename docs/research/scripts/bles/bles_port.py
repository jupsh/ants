"""Faithful pure-Python port of the core loop of Bles et al. 2022 Simulations_Script.py
(Zenodo 10.5281/zenodo.6396637, lines 328-865), including its quirks, plus a 60-s scan observer.

Derived from Bles O, Deneubourg J-L, Sueur C, Nicolis SC (2022), Simulations_Script.py,
Zenodo doi:10.5281/zenodo.6396637, licence CC BY 4.0. Ported by a research agent
(2026-10-07); spec and reproduction check in docs/research/bles-tec-spec.md.

States (from the script's comments):
 10 naive / empty non-forager (NF) in nest   1 at food source
  2 forager (F) in nest                      8 NF "stock" (has been fed)
  5 NF receiver in pair   66 F receiver in pair   100 F donor in pair   110 NF donor in pair
Usage: python3 -I bles_port.py <variant> <reps> [seed]
 variant: TEC_exp (default script), TEC_delta, TEC_unif, OC_delta, OC_unif, OC_exp
"""
import random, sys, statistics as st

n_hill = 2
Z = 120.0
K = 1 / 120.0           # prob/s to leave the food source (beta)
c = 1 / (130.0 * 2)     # per-member per-second separation check (Couple = 130*2)
rn = 1 / 50.0           # alpha' : forager prob/s to go back to the source
POWER_A = (1 / 10500.0) * 350   # = 1/30, shape of numpy.random.power for alpha_i(0)
N = 52
T = 3600

# Table 1 of the paper, as 1/x. OC uses one theta and one upsilon for everybody.
TABLE1 = {
    'OC_delta':  dict(thF=11, thW=11, upF=60, upW=60, dist='delta'),
    'OC_unif':   dict(thF=10, thW=10, upF=50, upW=50, dist='unif'),
    'OC_exp':    dict(thF=6,  thW=6,  upF=56, upW=56, dist='exp'),
    'TEC_delta': dict(thF=10, thW=33, upF=11, upW=38, dist='delta'),
    'TEC_unif':  dict(thF=11, thW=32, upF=9,  upW=28, dist='unif'),
    'TEC_exp':   dict(thF=9,  thW=23, upF=9,  upW=27, dist='exp'),   # == script E,EE,E_receive,EE_receive
}

def give(q): return q**n_hill / (q**n_hill + Z**n_hill)
def recv(q): return Z**n_hill / (q**n_hill + Z**n_hill)
leave = recv

def draw(mean, dist, rng):
    if dist == 'delta': return [mean] * N
    if dist == 'unif': return [rng.uniform(0, 2 * mean) for _ in range(N)]   # U(m-m, m+m) as in script
    return [rng.expovariate(1 / mean) for _ in range(N)]                    # numpy exponential(scale=mean)

def run(variant, rng):
    p = TABLE1[variant]
    e = draw(1 / p['thF'], p['dist'], rng); ee = draw(1 / p['thW'], p['dist'], rng)
    e_r = draw(1 / p['upF'], p['dist'], rng); ee_r = draw(1 / p['upW'], p['dist'], rng)
    r = [rng.random() ** (1 / POWER_A) for _ in range(N)]   # numpy.random.power(a)
    if variant.startswith('OC'):   # paper: OC individual probabilities attributed once, unchanged after foraging
        e = ee; e_r = ee_r
    pop = [10] * N
    prev = [0] * N          # EvolPop[t-1]; at t=0 the script reads row -1 (zeros) -> nothing happens at t=0
    food = [0.0] * N
    arrival = [0] * N
    partner = [0] * N
    F = set()
    events = []             # [donor, receiver, t_start, t_end(None), amount]
    open_ev = {}            # receiver -> event index
    order = list(range(N))

    def start(d, rc, t):
        partner[d] = rc; partner[rc] = d
        open_ev[rc] = len(events)
        events.append([d, rc, t, None, 0])

    def end(rc, t):
        k = open_ev.pop(rc, None)
        if k is not None: events[k][3] = t

    for t in range(T):
        checked = set()
        rng.shuffle(order)
        for i in order:
            s = pop[i]
            W = rng.random(); pr = rng.random()
            j = partner[i]
            # ---- receiver in pair (NF=5, F=66): transfer then check end
            if s in (5, 66) and prev[i] == s:
                if i not in checked:
                    food[i] += 1; food[j] -= 1; checked.add(i); checked.add(j)
                    events[open_ev[i]][4] += 1
                if food[j] <= 0 or W <= c:
                    if pop[j] == 100:
                        pop[i] = 8 if s == 5 else 2; pop[j] = 2; end(i, t)
                    if pop[j] == 110:
                        pop[i] = 8 if s == 5 else 2; pop[j] = 10 if s == 5 else 8; end(i, t)
            # ---- NF donor in pair (110). (The F-donor branch, state 100, is dead code in the script:
            #      it requires EvolPop[t-1]==110, so F-donor pairs only end via the receiver's check.)
            if s == 110 and prev[i] == 110:
                if i not in checked:
                    food[j] += 1; food[i] -= 1; checked.add(i); checked.add(j)
                    events[open_ev[j]][4] += 1
                if food[i] <= 0 or W <= c:
                    if pop[j] == 5: pop[i] = 8; pop[j] = 8; end(j, t)
                    if pop[j] == 66: pop[i] = 8; pop[j] = 2; end(j, t)
            # ---- naive / empty NF (10)
            if s == 10 and prev[i] == 10:
                L = r[i] * leave(food[i]); Rc = ee_r[i] * recv(food[i])
                if 0 < W <= L:
                    pop[i] = 1; arrival[i] = t
                elif L < W <= L + Rc:
                    pool = [k for k in range(N) if pop[k] == 2] + [k for k in range(N) if pop[k] == 8]
                    rng.shuffle(pool)
                    while pool and food[pool[0]] <= 0: pool.pop(0)
                    if pool:
                        d = pool[0]
                        if pop[d] == 2 and prev[d] == 2 and pr < e[d] * give(food[d]):
                            pop[d] = 100; pop[i] = 5; start(d, i, t)
                        if pop[d] == 8 and prev[d] == 8 and pr < ee[d] * give(food[d]):
                            pop[d] = 110; pop[i] = 5; start(d, i, t)
            # ---- forager in nest (2)
            if s == 2 and prev[i] == 2:
                G = e[i] * give(food[i]); Rc = e_r[i] * recv(food[i]); L = rn * leave(food[i])
                if 0 < W <= G:
                    if food[i] > 0:
                        pool = ([k for k in range(N) if pop[k] in (10,)] + [k for k in range(N) if pop[k] == 6]
                                + [k for k in range(N) if pop[k] == 2 and k != i] + [k for k in range(N) if pop[k] == 8])
                        rng.shuffle(pool)
                        if pool:
                            rc = pool[0]
                            if pop[rc] == 10 and prev[rc] == 10 and pr < ee_r[rc] * recv(food[rc]):
                                pop[rc] = 5; pop[i] = 100; start(i, rc, t)
                            if pop[rc] == 2 and prev[rc] == 2 and pr < e_r[rc] * recv(food[rc]):
                                pop[rc] = 66; pop[i] = 100; start(i, rc, t)
                            if pop[rc] == 8 and prev[rc] == 8 and pr < ee_r[rc] * recv(food[rc]):
                                pop[rc] = 5; pop[i] = 100; start(i, rc, t)
                elif G < W <= G + Rc:
                    pool = [k for k in range(N) if pop[k] == 2 and k != i] + [k for k in range(N) if pop[k] == 8]
                    rng.shuffle(pool)
                    while pool and food[pool[0]] <= 0: pool.pop(0)
                    if pool:
                        d = pool[0]
                        if pop[d] == 2 and prev[d] == 2 and pr < e[d] * give(food[d]):
                            pop[d] = 100; pop[i] = 66; start(d, i, t)
                        if pop[d] == 8 and prev[d] == 8 and pr < ee[d] * give(food[d]):
                            pop[d] = 110; pop[i] = 66; start(d, i, t)
                elif G + Rc < W < G + Rc + L:
                    pop[i] = 1; arrival[i] = t
            # ---- at the food source (1)
            if s == 1 and prev[i] == 1:
                if 0 < W <= K:
                    pop[i] = 2; food[i] += t - arrival[i]
                F.add(i)
            # ---- NF stock (8)
            if s == 8 and prev[i] == 8:
                G = ee[i] * give(food[i]); Rc = ee_r[i] * recv(food[i]); L = r[i] * leave(food[i])
                if 0 < W <= G:
                    if food[i] > 0:
                        pool = ([k for k in range(N) if pop[k] == 10] + [k for k in range(N) if pop[k] == 6]
                                + [k for k in range(N) if pop[k] == 2] + [k for k in range(N) if pop[k] == 8 and k != i])
                        rng.shuffle(pool)
                        if pool:
                            rc = pool[0]
                            if pop[rc] == 10 and prev[rc] == 10 and pr < ee_r[rc] * recv(food[rc]):
                                pop[rc] = 5; pop[i] = 110; start(i, rc, t)
                            if pop[rc] == 2 and prev[rc] == 2 and pr < e_r[rc] * recv(food[rc]):
                                pop[rc] = 66; pop[i] = 110; start(i, rc, t)
                            # script quirk: uses the DONOR's crop (food[i]) in the receiver's acceptance
                            if pop[rc] == 8 and prev[rc] == 8 and pr < ee_r[rc] * recv(food[i]):
                                pop[rc] = 5; pop[i] = 110; start(i, rc, t)
                elif G < W <= G + Rc:
                    pool = [k for k in range(N) if pop[k] == 2] + [k for k in range(N) if pop[k] == 8 and k != i]
                    rng.shuffle(pool)
                    while pool and food[pool[0]] <= 0: pool.pop(0)
                    if pool:
                        d = pool[0]
                        if pop[d] == 2 and prev[d] == 2 and pr < e[d] * give(food[d]):
                            pop[d] = 100; pop[i] = 5; start(d, i, t)
                        if pop[d] == 8 and prev[d] == 8 and pr < ee[d] * give(food[d]):
                            pop[d] = 110; pop[i] = 5; start(d, i, t)
                elif G + Rc < W <= G + Rc + L:
                    pop[i] = 1; arrival[i] = t
        prev = pop[:]
    for ev in events:
        if ev[3] is None: ev[3] = T   # still open at the end
    return events, F

def observe(events, phase, min_contact=5, period=60):
    """60-s scan observer: a directed pair is recorded at scan time tau if a model event of that pair is
    active at tau (t_start <= tau < t_end) and lasts > min_contact s; same pair on consecutive scans merged."""
    scans = {}
    for d, rc, ts, te, amt in events:
        if te - ts <= min_contact: continue
        first = ts if (ts - phase) % period == 0 else ts + (period - (ts - phase) % period)
        tau = first
        while tau < te:
            scans.setdefault((d, rc), set()).add((tau - phase) // period)
            tau += period
    obs = []
    for (d, rc), ks in scans.items():
        for k in sorted(ks):
            if k - 1 not in ks: obs.append((d, rc, phase + k * period))
    return obs

def summarize(evlist, F):
    n = len(evlist)
    ff = sum(1 for e in evlist if e[0] in F and e[1] in F)
    fd = sum(1 for e in evlist if e[0] in F and e[1] not in F)
    df = sum(1 for e in evlist if e[0] not in F and e[1] in F)
    dd = n - ff - fd - df
    times = sorted(e[2] for e in evlist)
    t50 = times[n // 2] / 60 if n else float('nan')
    deg = [0] * N
    for e in evlist: deg[e[0]] += 1; deg[e[1]] += 1
    nz = sorted(x for x in deg if x > 0)
    m = len(nz)
    gini_nz = sum((2 * (k + 1) - m - 1) * x for k, x in enumerate(nz)) / (m * sum(nz)) if m else float('nan')
    return dict(n=n, FF=ff, FNF=fd, NFF=df, NFNF=dd, nf_donor_share=(df + dd) / n if n else 0, T50=t50,
                gini_nz=gini_nz, zero=N - m)

if __name__ == '__main__':
    variant = sys.argv[1] if len(sys.argv) > 1 else 'TEC_exp'
    reps = int(sys.argv[2]) if len(sys.argv) > 2 else 100
    seed = int(sys.argv[3]) if len(sys.argv) > 3 else 1
    rng = random.Random(seed)
    raw, obsd, nF, durs, amt_nf = [], [], [], [], []
    for _ in range(reps):
        events, F = run(variant, rng)
        nF.append(len(F))
        raw.append(summarize([(e[0], e[1], e[2]) for e in events], F))
        obsd.append(summarize(observe(events, rng.randrange(60)), F))
        durs += [e[3] - e[2] for e in events]
        tot = sum(e[4] for e in events)
        amt_nf.append(sum(e[4] for e in events if e[0] not in F) / tot if tot else 0)
    def ms(xs): return f"{st.mean(xs):.2f} +/- {st.pstdev(xs):.2f}"
    print(f"variant={variant} reps={reps}  foragers={ms(nF)}")
    for name, rows in (('raw model events', raw), ('60-s scan observer', obsd)):
        print(' ', name + ':', ', '.join(f"{k}={ms([r[k] for r in rows])}" for k in rows[0]))
    durs.sort()
    print(f"  event duration (s): mean={st.mean(durs):.1f} median={durs[len(durs)//2]} "
          f"frac<60s={sum(d < 60 for d in durs)/len(durs):.2f} frac<=5s={sum(d <= 5 for d in durs)/len(durs):.3f}")
    print(f"  share of transferred FOOD given by NFs: {ms(amt_nf)}")
