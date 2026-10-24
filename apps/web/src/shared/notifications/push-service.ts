// apps/web/src/shared/notifications/push-service.ts
import webPush from "web-push";

// Push subscriptions store (userId -> Subscription array)
const subscriptionStore = new Map<string, any[]>();

// Push notification analytics store
export const pushAnalytics = {
  totalSent: 0,
  totalDelivered: 0,
  totalClicked: 0,
};

// VAPID credentials configuration
const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BC6m7zQ3bY-W5t3t_dummy_vapid_public_key_for_development_testing_only_1234567890";
const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY ||
  "dummy_vapid_private_key_for_testing_123456";
const VAPID_SUBJECT = "mailto:support@masterflow.com";

try {
  webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
} catch {
  // Graceful fallback for dev when VAPID keys are mock
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  tag?: string;
}

export class PushNotificationService {
  /**
   * Save a Web Push subscription for a user
   */
  static saveSubscription(userId: string, subscription: any) {
    const existing = subscriptionStore.get(userId) || [];
    // Prevent duplicate subscriptions
    const exists = existing.some((sub) => sub.endpoint === subscription.endpoint);
    if (!exists) {
      existing.push(subscription);
      subscriptionStore.set(userId, existing);
    }
    return { success: true, count: existing.length };
  }

  /**
   * Send Web Push notification to all registered devices for a user
   */
  static async sendWebPush(userId: string, payload: PushNotificationPayload) {
    const subscriptions = subscriptionStore.get(userId) || [];
    pushAnalytics.totalSent += subscriptions.length;

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webPush.sendNotification(sub, JSON.stringify(payload)).then(() => {
          pushAnalytics.totalDelivered += 1;
        })
      )
    );

    return {
      sentCount: subscriptions.length,
      results,
    };
  }

  /**
   * Mobile Push (FCM / APNs) payload builder for Expo Notifications
   */
  static buildMobilePushPayload(expoPushToken: string, payload: PushNotificationPayload) {
    return {
      to: expoPushToken,
      sound: "default",
      title: payload.title,
      body: payload.body,
      data: { url: payload.url || "/dashboard" },
      _displayInForeground: true,
    };
  }

  /**
   * Multi-language notification templates
   */
  static getTemplate(
    type: "BOOKING_CONFIRMED" | "PAYMENT_RECEIVED" | "WELCOME" | "SECURITY_ALERT",
    lang: "en" | "bn" | "ar" | "es" = "en",
    params: Record<string, string> = {}
  ): PushNotificationPayload {
    const templates: Record<string, Record<string, { title: string; body: string }>> = {
      WELCOME: {
        en: { title: "Welcome to MasterFlow!", body: "Your account has been setup with 25 free AI credits." },
        bn: { title: "মাস্টারফ্লোতে স্বাগতম!", body: "আপনার অ্যাকাউন্টে ২৫টি ফ্রি এআই ক্রেডিট যোগ করা হয়েছে।" },
        ar: { title: "مرحبًا بك في MasterFlow!", body: "تم إعداد حسابك مع 25 رصيد مجاني." },
        es: { title: "¡Bienvenido a MasterFlow!", body: "Tu cuenta se ha configurado con 25 créditos de IA gratuitos." },
      },
      BOOKING_CONFIRMED: {
        en: {
          title: "Appointment Confirmed",
          body: `Your consultation on ${params.date || "your scheduled date"} is confirmed.`,
        },
        bn: {
          title: "অ্যাপয়েন্টমেন্ট নিশ্চিত হয়েছে",
          body: `${params.date || "নির্ধারিত তারিখে"} আপনার পরামর্শ নিশ্চিত করা হয়েছে।`,
        },
        ar: {
          title: "تم تأكيد الموعد",
          body: `تم تأكيد استشارتك في ${params.date || "الموعد المحدد"}.`,
        },
        es: {
          title: "Cita Confirmada",
          body: `Tu consulta del ${params.date || "tu fecha programada"} está confirmada.`,
        },
      },
      PAYMENT_RECEIVED: {
        en: { title: "Payment Received", body: `Invoice #${params.invoice || "Receipt"} of $${params.amount || "0"} was paid.` },
        bn: { title: "পেমেন্ট সম্পন্ন হয়েছে", body: `$${params.amount || "0"} মূল্যের ইনভয়েস পরিশোধিত হয়েছে।` },
        ar: { title: "تم استلام الدفعة", body: `تم دفع الفاتورة بمبلغ $${params.amount || "0"}.` },
        es: { title: "Pago Recibido", body: `Se pagó la factura por $${params.amount || "0"}.` },
      },
      SECURITY_ALERT: {
        en: { title: "Security Alert", body: "New login detected on your account. Review security settings if not you." },
        bn: { title: "নিরাপত্তা সতর্কতা", body: "আপনার অ্যাকাউন্টে নতুন লগইন শনাক্ত করা হয়েছে।" },
        ar: { title: "تنبيه أمني", body: "تم اكتشاف تسجيل دخول جديد في حسابك." },
        es: { title: "Alerta de Seguridad", body: "Nuevo inicio de sesión detectado en tu cuenta." },
      },
    };

    const selected = templates[type]?.[lang] || templates[type]?.en;
    return {
      title: selected.title,
      body: selected.body,
      url: params.url || "/dashboard",
    };
  }
}
