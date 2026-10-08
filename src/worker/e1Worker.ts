/// <reference lib="webworker" />
import { computeE1, e1Data, type E1Data, type E1Request } from './e1Compute';

export type { E1Request, E1Response, PlainTrack } from './e1Compute';

/** The page sends the request plus the URL of the recorded tracks for that incline. */
export type E1WorkerRequest = E1Request & { dataUrl: string };

const dataCache = new Map<string, E1Data>();

async function loadData(url: string): Promise<E1Data> {
  const hit = dataCache.get(url);
  if (hit) return hit;
  const res = await fetch(url);
  const buf = new Uint8Array(await res.arrayBuffer());
  // Some servers send .gz with Content-Encoding: gzip (already decoded by the
  // browser); only decompress if the gzip magic bytes are still present.
  const text =
    buf[0] === 0x1f && buf[1] === 0x8b
      ? await new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'))).text()
      : new TextDecoder().decode(buf);
  const entry = e1Data(text);
  dataCache.set(url, entry);
  return entry;
}

self.onmessage = async (ev: MessageEvent<E1WorkerRequest>) => {
  const { dataUrl, ...req } = ev.data;
  const t0 = performance.now();
  const data = await loadData(dataUrl);
  const res = computeE1(req, data);
  res.ms = performance.now() - t0;
  (self as unknown as Worker).postMessage(res);
};
