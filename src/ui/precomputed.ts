/**
 * Results computed at build time for a page's default settings
 * (scripts/precompute.ts → public/precomputed/<name>.json), so the page shows
 * a result at once. Used only if the stored key matches the request the page
 * would send and the simulation-code hash matches this build; otherwise the
 * page simulates live, as before.
 */
export function precomputedKey(req: unknown, sim: string = __SIM_HASH__): string {
  return JSON.stringify({ sim, req });
}

export async function loadPrecomputed<T>(name: string, req: unknown): Promise<T | null> {
  try {
    // A built site carries its hash; the dev server computes it per request.
    const sim = import.meta.env.DEV ? await (await fetch(`${import.meta.env.BASE_URL}__sim_hash`)).text() : __SIM_HASH__;
    // The hash in the URL: GitHub Pages lets browsers reuse a file for 10 min
    // (max-age=600), which after a deploy served the previous build's files.
    const res = await fetch(`${import.meta.env.BASE_URL}precomputed/${name}.json?v=${sim}`);
    if (!res.ok) return null;
    const j = (await res.json()) as { key: string; result: T };
    return j.key === precomputedKey(req, sim) ? j.result : null;
  } catch {
    // Missing file (dev server answers with index.html) or a network error.
    return null;
  }
}
