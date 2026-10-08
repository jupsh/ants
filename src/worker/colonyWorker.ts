/// <reference lib="webworker" />
import { computeColony, type ColonyRequest } from './colonyCompute';

export type { ColonyRequest, ColonyView } from './colonyCompute';

self.onmessage = (ev: MessageEvent<ColonyRequest>) => {
  const v = computeColony(ev.data);
  (self as unknown as Worker).postMessage(v, [v.pos.buffer, v.heading.buffer, v.crop.buffer, v.mode.buffer, v.partner.buffer, v.contacts.buffer, v.foodUl.buffer, v.sugar.buffer, v.residual.buffer]);
};
