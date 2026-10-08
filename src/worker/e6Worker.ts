/// <reference lib="webworker" />
import { computeE6, type E6Request } from './e6Compute';

export type { E6Frame, E6Request, E6Response } from './e6Compute';
export { FRAME_DT } from './e6Compute';

self.onmessage = (ev: MessageEvent<E6Request>) => {
  (self as unknown as Worker).postMessage(computeE6(ev.data));
};
