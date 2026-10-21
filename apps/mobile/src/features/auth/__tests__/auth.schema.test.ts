import { describe, it, expect } from "vitest";
import { LoginSchema, RegisterSchema } from "../auth.schema";

describe("Mobile Auth Schema Validation", () => {
  it("should validate correct login inputs", () => {
    const valid = LoginSchema.safeParse({
      email: "doctor.sarah@example.com",
      password: "password123",
      rememberMe: true,
    });
    expect(valid.success).toBe(true);
  });

  it("should reject invalid email in login input", () => {
    const invalid = LoginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(invalid.success).toBe(false);
  });

  it("should validate registration with role and accepted terms", () => {
    const valid = RegisterSchema.safeParse({
      name: "Dr. Sarah Mitchell",
      email: "sarah@clinic.org",
      password: "securepassword123",
      role: "PROVIDER",
      termsAccepted: true,
    });
    expect(valid.success).toBe(true);
  });

  it("should reject registration if terms are not accepted", () => {
    const invalid = RegisterSchema.safeParse({
      name: "Alex",
      email: "alex@client.com",
      password: "password123",
      termsAccepted: false,
    });
    expect(invalid.success).toBe(false);
  });
});
