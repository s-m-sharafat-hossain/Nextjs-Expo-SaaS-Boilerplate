// apps/web/src/shared/queue/queue-manager.ts
/**
 * Queue Manager — BullMQ / Bull with Redis
 * Provides job queues for: emails, SMS, webhooks, notifications, exports
 *
 * Falls back gracefully when Redis is not configured (in-process queue).
 */
import type { Queue, Worker, Job } from "bullmq";

export type JobName =
  | "send-email"
  | "send-sms"
  | "push-notification"
  | "send-webhook"
  | "export-report"
  | "sync-analytics"
  | "cleanup-sessions"
  | "process-payment"
  | "index-search"
  | "send-newsletter";

export interface JobPayload {
  "send-email": {
    to: string;
    subject: string;
    html?: string;
    text?: string;
    templateId?: string;
    variables?: Record<string, string>;
  };
  "send-sms": {
    to: string;
    body: string;
    templateId?: string;
  };
  "push-notification": {
    userId: string;
    title: string;
    body: string;
    icon?: string;
    url?: string;
  };
  "send-webhook": {
    url: string;
    method: "POST" | "PUT";
    headers?: Record<string, string>;
    payload: Record<string, unknown>;
    retryCount?: number;
  };
  "export-report": {
    reportType: "pdf" | "csv" | "excel";
    filters: Record<string, string>;
    userId: string;
    notifyEmail?: string;
  };
  "sync-analytics": { batchSize?: number };
  "cleanup-sessions": { olderThanDays?: number };
  "process-payment": {
    paymentIntentId: string;
    userId: string;
    amount: number;
    currency: string;
  };
  "index-search": {
    entityId: string;
    entityType: string;
    action: "upsert" | "delete";
  };
  "send-newsletter": {
    campaignId: string;
    recipientBatch: string[];
    subject: string;
    html: string;
  };
}

type InMemoryJob<T extends JobName> = {
  id: string;
  name: T;
  data: JobPayload[T];
  attempts: number;
  timestamp: number;
  state: "waiting" | "active" | "completed" | "failed";
  failedReason?: string;
};

// ─── In-Memory Fallback Queue ────────────────────────────────────────────────
class InMemoryQueue {
  private jobs: InMemoryJob<JobName>[] = [];
  private handlers = new Map<string, (data: any) => Promise<void>>();
  private nextId = 1;

  async add<T extends JobName>(name: T, data: JobPayload[T], opts?: { priority?: number; delay?: number }) {
    const job: InMemoryJob<T> = {
      id: String(this.nextId++),
      name,
      data,
      attempts: 0,
      timestamp: Date.now() + (opts?.delay || 0),
      state: "waiting",
    };
    this.jobs.push(job as unknown as InMemoryJob<JobName>);

    // Process asynchronously
    if (!opts?.delay) {
      setImmediate(() => this.process(job as unknown as InMemoryJob<JobName>));
    }

    return job.id;
  }

  private async process(job: InMemoryJob<JobName>) {
    const handler = this.handlers.get(job.name);
    if (!handler) return;

    job.state = "active";
    job.attempts++;
    try {
      await handler(job.data);
      job.state = "completed";
    } catch (err: any) {
      job.state = "failed";
      job.failedReason = err?.message || "Unknown error";
    }
  }

  registerHandler(jobName: string, handler: (data: any) => Promise<void>) {
    this.handlers.set(jobName, handler);
  }

  getStats() {
    const stats = { waiting: 0, active: 0, completed: 0, failed: 0 };
    this.jobs.forEach((j) => stats[j.state]++);
    return stats;
  }

  getJobs(state?: string) {
    return state ? this.jobs.filter((j) => j.state === state) : this.jobs;
  }
}

// ─── Queue Manager ────────────────────────────────────────────────────────────
class QueueManager {
  private bullQueues = new Map<string, Queue>();
  private inMemoryQueue: InMemoryQueue;
  private useBull = false;
  private isInitialized = false;

  constructor() {
    this.inMemoryQueue = new InMemoryQueue();
  }

  async initialize() {
    if (this.isInitialized) return;

    const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL;
    if (redisUrl) {
      try {
        const { Queue, Worker } = await import("bullmq");

        const connection = {
          url: redisUrl,
          maxRetriesPerRequest: null,
        };

        const queueNames: JobName[] = [
          "send-email",
          "send-sms",
          "push-notification",
          "send-webhook",
          "export-report",
          "sync-analytics",
          "cleanup-sessions",
          "process-payment",
          "index-search",
          "send-newsletter",
        ];

        for (const name of queueNames) {
          const queue = new Queue(name, {
            connection,
            defaultJobOptions: {
              attempts: 3,
              backoff: { type: "exponential", delay: 2000 },
              removeOnComplete: { count: 100 },
              removeOnFail: { count: 50 },
            },
          });
          this.bullQueues.set(name, queue);
        }

        this.useBull = true;
        console.info("[QueueManager] BullMQ initialized with Redis");
      } catch (err) {
        console.warn("[QueueManager] BullMQ init failed, falling back to in-memory:", err);
      }
    } else {
      console.info("[QueueManager] Using in-memory queue (no Redis configured)");
    }

    this.isInitialized = true;
  }

  async add<T extends JobName>(
    name: T,
    data: JobPayload[T],
    opts?: { priority?: number; delay?: number; attempts?: number }
  ): Promise<string> {
    if (!this.isInitialized) await this.initialize();

    if (this.useBull) {
      const queue = this.bullQueues.get(name);
      if (queue) {
        const job = await queue.add(name, data, {
          priority: opts?.priority,
          delay: opts?.delay,
          attempts: opts?.attempts || 3,
        });
        return job.id || "unknown";
      }
    }

    return this.inMemoryQueue.add(name, data, opts);
  }

  async getQueueStats() {
    if (!this.isInitialized) await this.initialize();

    if (this.useBull) {
      const stats: Record<string, any> = {};
      for (const [name, queue] of this.bullQueues.entries()) {
        try {
          stats[name] = await queue.getJobCounts(
            "wait", "active", "completed", "failed", "delayed"
          );
        } catch {
          stats[name] = { error: "unavailable" };
        }
      }
      return stats;
    }

    return { "in-memory": this.inMemoryQueue.getStats() };
  }

  registerHandler(jobName: string, handler: (data: any) => Promise<void>) {
    this.inMemoryQueue.registerHandler(jobName, handler);
  }
}

export const queueManager = new QueueManager();

// ─── Default Job Handlers ─────────────────────────────────────────────────────
queueManager.registerHandler("send-email", async (data: JobPayload["send-email"]) => {
  console.info(`[Queue] Email → ${data.to}: ${data.subject}`);
  // Resend integration happens in email service
});

queueManager.registerHandler("send-sms", async (data: JobPayload["send-sms"]) => {
  console.info(`[Queue] SMS → ${data.to}: ${data.body.slice(0, 50)}...`);
});

queueManager.registerHandler("push-notification", async (data: JobPayload["push-notification"]) => {
  console.info(`[Queue] Push → user:${data.userId}: ${data.title}`);
});

queueManager.registerHandler("send-webhook", async (data: JobPayload["send-webhook"]) => {
  try {
    await fetch(data.url, {
      method: data.method,
      headers: { "Content-Type": "application/json", ...data.headers },
      body: JSON.stringify(data.payload),
    });
  } catch (err) {
    console.error("[Queue] Webhook delivery failed:", err);
    throw err; // Re-throw for retry
  }
});
