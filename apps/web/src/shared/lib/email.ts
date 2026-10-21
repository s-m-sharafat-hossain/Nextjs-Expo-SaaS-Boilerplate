// src/shared/lib/email.ts
// Resend email sender helper
import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn(
    "[Email] RESEND_API_KEY is not set. Emails will be logged to console in Demo Mode."
  );
}

export const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export const EMAIL_FROM = process.env.EMAIL_FROM ?? "noreply@yourdomain.com";

/**
 * Generic send helper — wraps Resend send with console fallback for demo mode
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email Demo] To: ${to} | Subject: ${subject}`);
    return { id: "demo-email-id" };
  }
  const { data, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    html,
  });
  if (error) throw new Error(`Email send failed: ${error.message}`);
  return data;
}
