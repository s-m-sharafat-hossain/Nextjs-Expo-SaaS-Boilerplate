// apps/web/src/shared/plugins/plugin-registry.ts
export type PluginHookName =
  | "onUserSignup"
  | "onPaymentSuccess"
  | "onTaskCreated"
  | "onBookingCreated"
  | "renderDashboardWidget";

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  hooks: Partial<Record<PluginHookName, (context: any) => Promise<any> | any>>;
  enabled: boolean;
}

export class PluginRegistry {
  private static plugins: Map<string, PluginManifest> = new Map();

  /**
   * Register a plugin into the platform runtime
   */
  static register(plugin: PluginManifest) {
    this.plugins.set(plugin.id, plugin);
    console.log(`[PluginRegistry] Registered plugin: ${plugin.name} v${plugin.version}`);
  }

  /**
   * Get all registered plugins
   */
  static getAll(): PluginManifest[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Toggle plugin state
   */
  static setEnabled(id: string, enabled: boolean) {
    const plugin = this.plugins.get(id);
    if (plugin) {
      plugin.enabled = enabled;
    }
  }

  /**
   * Trigger a lifecycle hook across all active plugins
   */
  static async triggerHook<T = any>(hook: PluginHookName, context: any): Promise<T[]> {
    const results: T[] = [];

    for (const plugin of this.plugins.values()) {
      if (!plugin.enabled) continue;
      const handler = plugin.hooks[hook];
      if (handler) {
        try {
          const res = await handler(context);
          if (res !== undefined) results.push(res);
        } catch (err: any) {
          console.error(`[PluginRegistry] Error in plugin "${plugin.name}" hook "${hook}":`, err.message);
        }
      }
    }

    return results;
  }
}

// Register built-in integrations as standard plugins
PluginRegistry.register({
  id: "slack-notifier",
  name: "Slack Notifications",
  version: "1.0.0",
  description: "Send alerts to a Slack channel when payments or high-priority tasks are created.",
  author: "SaaSFlow Core",
  enabled: true,
  hooks: {
    onPaymentSuccess: async (data: any) => {
      console.log("[Plugin: Slack] Notification sent for payment:", data.invoiceNumber);
      return { sent: true };
    },
    onTaskCreated: async (data: any) => {
      if (data.priority === "URGENT") {
        console.log("[Plugin: Slack] Urgent task alert sent:", data.title);
      }
    },
  },
});

PluginRegistry.register({
  id: "zapier-webhook-bridge",
  name: "Zapier & Make Automations",
  version: "1.2.0",
  description: "Seamlessly bridge platform events to Zapier zaps and Make.com scenarios.",
  author: "SaaSFlow Integrations",
  enabled: true,
  hooks: {
    onUserSignup: async (user: any) => {
      console.log("[Plugin: Zapier] Dispatched onUserSignup trigger for:", user.email);
    },
  },
});
