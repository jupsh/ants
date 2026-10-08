/** Child process of scripts/pool.ts: runs TASKS on request over IPC. */
import { TASKS, type TaskName } from '../src/sim/parallel/tasks';

process.on('message', (m: { id: number; name: TaskName; args: unknown[] }) => {
  try {
    const result = (TASKS[m.name] as (...a: unknown[]) => unknown)(...m.args);
    process.send!({ id: m.id, result });
  } catch (e) {
    process.send!({ id: m.id, error: String((e as Error)?.stack ?? e) });
  }
});
process.send!({ ready: true });
