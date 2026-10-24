// apps/web/src/shared/queue/email-queue.ts
import { queueManager } from "./queue-manager";

export interface EmailTemplateId {
  welcome: "welcome";
  password_reset: "password_reset";
  booking_confirmation: "booking_confirmation";
  booking_reminder: "booking_reminder";
  subscription_created: "subscription_created";
  subscription_cancelled: "subscription_cancelled";
  payment_receipt: "payment_receipt";
  verification: "verification";
  team_invite: "team_invite";
  newsletter: "newsletter";
}

export interface EmailJobData {
  to: string | string[];
  subject: string;
  templateId?: keyof EmailTemplateId;
  variables?: Record<string, string | number | boolean>;
  html?: string;
  text?: string;
  replyTo?: string;
  scheduledAt?: Date;
}

export class EmailQueue {
  /**
   * Add email to queue (immediate or scheduled)
   */
  static async send(data: EmailJobData, opts?: { priority?: number; delay?: number }) {
    const recipients = Array.isArray(data.to) ? data.to : [data.to];
    const jobs: Promise<string>[] = [];

    for (const to of recipients) {
      jobs.push(
        queueManager.add(
          "send-email",
          {
            to,
            subject: data.subject,
            html: data.html,
            text: data.text,
            templateId: data.templateId,
            variables: data.variables
              ? Object.fromEntries(
                  Object.entries(data.variables).map(([k, v]) => [k, String(v)])
                )
              : undefined,
          },
          {
            priority: opts?.priority || 5,
            delay: opts?.delay || (data.scheduledAt ? data.scheduledAt.getTime() - Date.now() : 0),
          }
        )
      );
    }

    const jobIds = await Promise.all(jobs);
    return jobIds;
  }

  /**
   * Schedule a recurring email (e.g., weekly digest)
   */
  static async sendWelcome(to: string, name: string) {
    return this.send({
      to,
      subject: `Welcome to SaaSFlow Pro, ${name}! 🎉`,
      templateId: "welcome",
      variables: { name, year: new Date().getFullYear() },
    });
  }

  static async sendPasswordReset(to: string, resetUrl: string) {
    return this.send({
      to,
      subject: "Reset Your Password — SaaSFlow Pro",
      templateId: "password_reset",
      variables: { resetUrl, expiresIn: "1 hour" },
    }, { priority: 10 });
  }

  static async sendBookingConfirmation(to: string, booking: {
    id: string;
    service: string;
    date: string;
    time: string;
    provider: string;
  }) {
    return this.send({
      to,
      subject: `Booking Confirmed: ${booking.service}`,
      templateId: "booking_confirmation",
      variables: { ...booking },
    });
  }

  static async sendPaymentReceipt(to: string, receipt: {
    amount: string;
    currency: string;
    description: string;
    invoiceId: string;
    date: string;
  }) {
    return this.send({
      to,
      subject: `Payment Receipt — ${receipt.invoiceId}`,
      templateId: "payment_receipt",
      variables: { ...receipt },
    });
  }
}
