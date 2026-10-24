// apps/web/src/shared/security/encryption.ts
import crypto from "crypto";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_SECRET_KEY ||
  process.env.AUTH_SECRET ||
  "masterflow-aes-256-encryption-key-must-be-32-chars!!";

// Ensure 32-byte key buffer for AES-256
const KEY_BUFFER = crypto.createHash("sha256").update(ENCRYPTION_KEY).digest();
const ALGORITHM = "aes-256-gcm";

export class DataProtection {
  /**
   * Encrypt sensitive string value using AES-256-GCM with authentication tag
   */
  static encrypt(plainText: string): string {
    if (!plainText) return plainText;

    const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
    const cipher = crypto.createCipheriv(ALGORITHM, KEY_BUFFER, iv);

    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");

    // Format: iv:authTag:encrypted
    return `${iv.toString("hex")}:${authTag}:${encrypted}`;
  }

  /**
   * Decrypt AES-256-GCM cipher text
   */
  static decrypt(cipherText: string): string {
    if (!cipherText || !cipherText.includes(":")) return cipherText;

    try {
      const parts = cipherText.split(":");
      if (parts.length !== 3) return cipherText;

      const [ivHex, authTagHex, encryptedData] = parts;
      const iv = Buffer.from(ivHex, "hex");
      const authTag = Buffer.from(authTagHex, "hex");

      const decipher = crypto.createDecipheriv(ALGORITHM, KEY_BUFFER, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encryptedData, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (err) {
      console.warn("[DataProtection] Failed to decrypt cipher text:", err);
      return cipherText;
    }
  }

  /**
   * Field-level encryption helpers for User & Wallet models
   */
  static encryptUserFields(data: {
    phone?: string | null;
    address?: string | null;
    governmentId?: string | null;
  }) {
    return {
      ...(data.phone ? { phone: this.encrypt(data.phone) } : {}),
      ...(data.address ? { address: this.encrypt(data.address) } : {}),
      ...(data.governmentId ? { governmentId: this.encrypt(data.governmentId) } : {}),
    };
  }

  static decryptUserFields<T extends { phone?: string | null; address?: string | null; governmentId?: string | null }>(user: T): T {
    return {
      ...user,
      phone: user.phone ? this.decrypt(user.phone) : user.phone,
      address: user.address ? this.decrypt(user.address) : user.address,
      governmentId: user.governmentId ? this.decrypt(user.governmentId) : user.governmentId,
    };
  }

  static encryptWalletFields(data: { cardNumber?: string | null; bankAccount?: string | null }) {
    return {
      ...(data.cardNumber ? { cardNumber: this.encrypt(data.cardNumber) } : {}),
      ...(data.bankAccount ? { bankAccount: this.encrypt(data.bankAccount) } : {}),
    };
  }

  static decryptWalletFields<T extends { cardNumber?: string | null; bankAccount?: string | null }>(wallet: T): T {
    return {
      ...wallet,
      cardNumber: wallet.cardNumber ? this.decrypt(wallet.cardNumber) : wallet.cardNumber,
      bankAccount: wallet.bankAccount ? this.decrypt(wallet.bankAccount) : wallet.bankAccount,
    };
  }

  // ─── Data Masking in Logs ──────────────────────────────────────────────────

  /**
   * Masks email address: j***@example.com
   */
  static maskEmail(email: string): string {
    if (!email || !email.includes("@")) return email;
    const [local, domain] = email.split("@");
    if (local.length <= 1) return `*@${domain}`;
    return `${local[0]}***@${domain}`;
  }

  /**
   * Masks phone number: ***-***-1234
   */
  static maskPhone(phone: string): string {
    if (!phone) return phone;
    const clean = phone.replace(/\D/g, "");
    if (clean.length < 4) return "****";
    const last4 = clean.slice(-4);
    return `***-***-${last4}`;
  }

  /**
   * Masks credit card number: ****-****-****-1234
   */
  static maskCreditCard(cardNumber: string): string {
    if (!cardNumber) return cardNumber;
    const clean = cardNumber.replace(/\D/g, "");
    if (clean.length < 4) return "****";
    const last4 = clean.slice(-4);
    return `****-****-****-${last4}`;
  }

  /**
   * Masks SSN / National Identification: ***-**-6789
   */
  static maskSsn(ssn: string): string {
    if (!ssn) return ssn;
    const clean = ssn.replace(/\D/g, "");
    if (clean.length < 4) return "****";
    const last4 = clean.slice(-4);
    return `***-**-${last4}`;
  }

  // ─── PII Detection ─────────────────────────────────────────────────────────

  /**
   * Scans an object or string to detect Personally Identifiable Information (PII)
   */
  static detectPii(input: any): { hasPii: boolean; detectedTypes: string[] } {
    const text = typeof input === "string" ? input : JSON.stringify(input);
    const detected: string[] = [];

    // Credit Card (Luhn format candidate)
    if (/\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12})\b/.test(text)) {
      detected.push("CREDIT_CARD");
    }

    // SSN / National ID format
    if (/\b\d{3}-\d{2}-\d{4}\b/.test(text)) {
      detected.push("SSN");
    }

    // Email address
    if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text)) {
      detected.push("EMAIL");
    }

    // Phone number format
    if (/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(text)) {
      detected.push("PHONE");
    }

    return {
      hasPii: detected.length > 0,
      detectedTypes: detected,
    };
  }
}
