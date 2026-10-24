// apps/web/src/shared/sms/twilio.ts
/**
 * Twilio SMS Service
 * Supports SMS, WhatsApp, and voice OTP via Twilio Verify
 */

export interface SmsOptions {
  to: string;
  body: string;
  from?: string;
  mediaUrl?: string[];
}

export interface OtpOptions {
  to: string;
  channel?: "sms" | "whatsapp" | "email" | "call";
}

export interface OtpVerifyOptions {
  to: string;
  code: string;
}

// In-memory OTP store for fallback (no Twilio configured)
const otpStore = new Map<string, { code: string; expiresAt: number; attempts: number }>();

class TwilioService {
  private accountSid: string | undefined;
  private authToken: string | undefined;
  private fromNumber: string;
  private verifyServiceSid: string | undefined;
  private isConfigured: boolean;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_FROM_NUMBER || "+15005550006";
    this.verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
    this.isConfigured = !!(this.accountSid && this.authToken);
  }

  /**
   * Send a plain SMS message
   */
  async sendSms(options: SmsOptions): Promise<{ success: boolean; sid?: string; error?: string }> {
    if (!this.isConfigured) {
      console.info(`[Twilio Mock] SMS to ${options.to}: ${options.body}`);
      return { success: true, sid: `mock-${Date.now()}` };
    }

    try {
      const twilio = await import("twilio");
      const client = twilio.default(this.accountSid!, this.authToken!);

      const msg = await client.messages.create({
        to: options.to,
        from: options.from || this.fromNumber,
        body: options.body,
        ...(options.mediaUrl ? { mediaUrl: options.mediaUrl } : {}),
      });

      return { success: true, sid: msg.sid };
    } catch (err: any) {
      console.error("[Twilio] Send SMS failed:", err);
      return { success: false, error: err?.message };
    }
  }

  /**
   * Send WhatsApp message via Twilio WhatsApp Business API
   */
  async sendWhatsApp(to: string, body: string): Promise<{ success: boolean; sid?: string; error?: string }> {
    return this.sendSms({
      to: `whatsapp:${to}`,
      from: `whatsapp:${this.fromNumber}`,
      body,
    });
  }

  /**
   * Send OTP via Twilio Verify (managed delivery & rate limiting)
   */
  async sendOtp(options: OtpOptions): Promise<{ success: boolean; status?: string; error?: string }> {
    const { to, channel = "sms" } = options;

    if (!this.isConfigured || !this.verifyServiceSid) {
      // Fallback: generate our own OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore.set(to, { code, expiresAt: Date.now() + 10 * 60 * 1000, attempts: 0 });
      console.info(`[Twilio Mock] OTP for ${to}: ${code}`);
      return { success: true, status: "pending" };
    }

    try {
      const twilio = await import("twilio");
      const client = twilio.default(this.accountSid!, this.authToken!);

      const verification = await client.verify.v2
        .services(this.verifyServiceSid)
        .verifications.create({ to, channel });

      return { success: true, status: verification.status };
    } catch (err: any) {
      console.error("[Twilio] Send OTP failed:", err);
      return { success: false, error: err?.message };
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOtp(options: OtpVerifyOptions): Promise<{ success: boolean; status?: string; error?: string }> {
    const { to, code } = options;

    if (!this.isConfigured || !this.verifyServiceSid) {
      // Fallback: verify from in-memory store
      const stored = otpStore.get(to);
      if (!stored) return { success: false, error: "OTP not found or expired" };
      if (Date.now() > stored.expiresAt) {
        otpStore.delete(to);
        return { success: false, error: "OTP expired" };
      }
      if (stored.attempts >= 3) {
        otpStore.delete(to);
        return { success: false, error: "Too many attempts" };
      }
      if (stored.code !== code) {
        stored.attempts++;
        return { success: false, error: "Invalid OTP" };
      }
      otpStore.delete(to);
      return { success: true, status: "approved" };
    }

    try {
      const twilio = await import("twilio");
      const client = twilio.default(this.accountSid!, this.authToken!);

      const check = await client.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks.create({ to, code });

      return { success: check.status === "approved", status: check.status };
    } catch (err: any) {
      console.error("[Twilio] Verify OTP failed:", err);
      return { success: false, error: err?.message };
    }
  }

  /**
   * Send booking reminder SMS
   */
  async sendBookingReminder(to: string, booking: {
    service: string;
    date: string;
    time: string;
    providerName: string;
    cancelUrl?: string;
  }): Promise<{ success: boolean }> {
    const body = `Reminder: You have "${booking.service}" with ${booking.providerName} on ${booking.date} at ${booking.time}.${booking.cancelUrl ? ` Cancel: ${booking.cancelUrl}` : ""}`;
    const result = await this.sendSms({ to, body });
    return { success: result.success };
  }
}

export const twilioService = new TwilioService();
