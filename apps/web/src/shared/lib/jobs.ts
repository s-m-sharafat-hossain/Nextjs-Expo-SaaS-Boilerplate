// src/shared/lib/jobs.ts
// Background Worker / Job Dispatcher Helper
import { Logger } from "./logger";

export type JobHandler<T> = (data: T) => Promise<void>;

export class JobQueue {
  /**
   * Dispatch a fire-and-forget background job without delaying client response
   */
  static enqueue<T>(jobName: string, data: T, handler: JobHandler<T>) {
    // Uses process.nextTick / setImmediate to let the HTTP response finish first
    setImmediate(async () => {
      try {
        Logger.info(`[JobQueue] Starting job: ${jobName}`);
        await handler(data);
        Logger.info(`[JobQueue] Completed job: ${jobName}`);
      } catch (error) {
        Logger.error(`[JobQueue] Job failed: ${jobName}`, error, { data });
      }
    });
  }
}
