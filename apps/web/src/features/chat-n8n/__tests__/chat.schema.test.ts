// apps/web/src/features/chat-n8n/__tests__/chat.schema.test.ts
import { describe, it, expect } from "vitest";
import { sendMessageSchema, createSessionSchema } from "../chat.schema";
import { siteConfig } from "@shared/config";

describe("Chat & n8n Feature Schemas", () => {
  it("should validate a valid message payload", () => {
    const valid = sendMessageSchema.safeParse({
      message: "Hello doctor, I would like to schedule a virtual review.",
    });
    expect(valid.success).toBe(true);
  });

  it("should reject an empty message", () => {
    const invalid = sendMessageSchema.safeParse({
      message: "",
    });
    expect(invalid.success).toBe(false);
  });

  it("should enforce dynamic role labels in site.config", () => {
    expect(siteConfig.roleLabels.admin.singular).toBe("Admin");
    expect(siteConfig.roleLabels.provider.singular).toBe("Doctor");
    expect(siteConfig.roleLabels.consumer.singular).toBe("Patient");
  });
});
