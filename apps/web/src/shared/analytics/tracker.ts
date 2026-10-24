// apps/web/src/shared/analytics/tracker.ts
/**
 * Universal Analytics Tracker
 * Supports GA4, Mixpanel, and custom server-side event logging
 */

export type EventCategory =
  | "auth"
  | "navigation"
  | "billing"
  | "search"
  | "booking"
  | "chat"
  | "notification"
  | "file"
  | "user"
  | "admin"
  | "error"
  | "performance"
  | "conversion"
  | "engagement";

export interface TrackEventOptions {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, string | number | boolean | null | undefined>;
  userId?: string;
  sessionId?: string;
}

interface ConversionFunnel {
  name: string;
  steps: string[];
  completionRate: Record<string, number>;
}

// In-memory event log (use Redis/DB in production)
const eventLog: Array<TrackEventOptions & { timestamp: string }> = [];
const userSessions = new Map<string, { startTime: number; pageViews: number; events: number }>();
const funnels: Record<string, ConversionFunnel> = {
  signup: {
    name: "User Signup",
    steps: ["visit_landing", "click_signup", "fill_form", "verify_email", "complete_onboarding"],
    completionRate: {},
  },
  subscription: {
    name: "Subscription Purchase",
    steps: ["view_pricing", "select_plan", "enter_payment", "confirm_purchase"],
    completionRate: {},
  },
  booking: {
    name: "Service Booking",
    steps: ["view_service", "select_time", "enter_details", "confirm_booking"],
    completionRate: {},
  },
};

export class AnalyticsTracker {
  private static initialized = false;
  private static mixpanelToken: string | null = null;
  private static ga4Id: string | null = null;

  /**
   * Initialize the tracker (call once in app layout)
   */
  static init(options: { mixpanelToken?: string; ga4Id?: string }) {
    this.mixpanelToken = options.mixpanelToken || null;
    this.ga4Id = options.ga4Id || null;
    this.initialized = true;
  }

  /**
   * Track a user event (client-side)
   */
  static track(options: TrackEventOptions) {
    const event = { ...options, timestamp: new Date().toISOString() };
    eventLog.push(event);

    // Cap log size
    if (eventLog.length > 5000) eventLog.shift();

    // Update user session stats
    if (options.userId) {
      const session = userSessions.get(options.userId) || { startTime: Date.now(), pageViews: 0, events: 0 };
      session.events++;
      if (options.action === "page_view") session.pageViews++;
      userSessions.set(options.userId, session);
    }

    // Funnel step tracking
    if (options.properties?.funnelName && options.properties?.funnelStep) {
      const funnelName = String(options.properties.funnelName);
      const step = String(options.properties.funnelStep);
      if (funnels[funnelName]) {
        funnels[funnelName].completionRate[step] = (funnels[funnelName].completionRate[step] || 0) + 1;
      }
    }

    // Browser GA4
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", options.action, {
        event_category: options.category,
        event_label: options.label,
        value: options.value,
        ...options.properties,
      });
    }

    // Browser Mixpanel
    if (typeof window !== "undefined" && (window as any).mixpanel) {
      (window as any).mixpanel.track(options.action, {
        category: options.category,
        label: options.label,
        value: options.value,
        ...options.properties,
      });
    }
  }

  /**
   * Identify user in analytics providers
   */
  static identify(userId: string, traits?: Record<string, string | number | boolean | null>) {
    if (typeof window !== "undefined") {
      if ((window as any).mixpanel) {
        (window as any).mixpanel.identify(userId);
        if (traits) (window as any).mixpanel.people.set(traits);
      }
      if ((window as any).gtag) {
        (window as any).gtag("config", this.ga4Id || "", { user_id: userId });
      }
    }
  }

  /**
   * Track page view with optional scroll depth / time on page
   */
  static trackPageView(pathname: string, userId?: string) {
    this.track({
      category: "navigation",
      action: "page_view",
      label: pathname,
      userId,
    });
  }

  /**
   * Track conversion events (purchase, signup, upgrade)
   */
  static trackConversion(type: "signup" | "purchase" | "upgrade" | "referral", userId: string, value?: number) {
    this.track({
      category: "conversion",
      action: `conversion_${type}`,
      value,
      userId,
    });
  }

  /**
   * Server-side: retrieve analytics summary
   */
  static getAnalyticsSummary() {
    const totalEvents = eventLog.length;
    const byCategory: Record<string, number> = {};
    const byAction: Record<string, number> = {};
    const conversions = eventLog.filter((e) => e.category === "conversion").length;
    const errors = eventLog.filter((e) => e.category === "error").length;

    eventLog.forEach((e) => {
      byCategory[e.category] = (byCategory[e.category] || 0) + 1;
      byAction[e.action] = (byAction[e.action] || 0) + 1;
    });

    const topActions = Object.entries(byAction)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([action, count]) => ({ action, count }));

    const funnelSummary = Object.entries(funnels).map(([key, funnel]) => ({
      key,
      name: funnel.name,
      steps: funnel.steps.map((step) => ({
        step,
        count: funnel.completionRate[step] || 0,
      })),
    }));

    return {
      totalEvents,
      totalSessions: userSessions.size,
      conversions,
      errors,
      byCategory,
      topActions,
      funnels: funnelSummary,
      recentEvents: eventLog.slice(-20).reverse(),
    };
  }

  /**
   * Get retention by cohort (mock weekly cohort data)
   */
  static getRetentionData() {
    const now = Date.now();
    const weeks = 8;
    return Array.from({ length: weeks }, (_, i) => ({
      week: `Week ${i + 1}`,
      newUsers: Math.floor(Math.random() * 200 + 100),
      retained: Math.floor(Math.random() * 60 + 20),
      churned: Math.floor(Math.random() * 30 + 5),
    }));
  }
}
