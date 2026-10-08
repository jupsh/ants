/// <reference lib="webworker" />
import { computeE2, type E2Request } from './e2Compute';

export type { E2Request, E2Response, TripFrame } from './e2Compute';

self.onmessage = (ev: MessageEvent<E2Request>) => {
  (self as unknown as Worker).postMessage(computeE2(ev.data));
};
