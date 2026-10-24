// apps/web/src/shared/queue/queue-dashboard.ts
/**
 * Queue Dashboard Data Provider
 * Returns queue stats, job lists, and health for admin UI
 */
import { queueManager } from "./queue-manager";

export interface QueueStat {
  queueName: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed?: number;
  throughput?: number;
}

export interface JobInfo {
  id: string;
  name: string;
  state: string;
  timestamp: string;
  failedReason?: string;
  attempts?: number;
}

export class QueueDashboard {
  static async getAllStats(): Promise<QueueStat[]> {
    const stats = await queueManager.getQueueStats();

    return Object.entries(stats).map(([queueName, counts]: [string, any]) => ({
      queueName,
      waiting: counts.wait || counts.waiting || 0,
      active: counts.active || 0,
      completed: counts.completed || 0,
      failed: counts.failed || 0,
      delayed: counts.delayed || 0,
      throughput: (counts.completed || 0) + (counts.failed || 0),
    }));
  }

  static async getSystemHealth() {
    const stats = await this.getAllStats();
    const totalFailed = stats.reduce((a, s) => a + s.failed, 0);
    const totalWaiting = stats.reduce((a, s) => a + s.waiting, 0);
    const totalActive = stats.reduce((a, s) => a + s.active, 0);
    const totalCompleted = stats.reduce((a, s) => a + s.completed, 0);

    const errorRate = totalCompleted > 0
      ? ((totalFailed / (totalCompleted + totalFailed)) * 100).toFixed(1)
      : "0";

    return {
      status: totalFailed > 100 ? "degraded" : "healthy",
      queues: stats.length,
      totalWaiting,
      totalActive,
      totalCompleted,
      totalFailed,
      errorRate: `${errorRate}%`,
      queuesDetails: stats,
    };
  }
}
