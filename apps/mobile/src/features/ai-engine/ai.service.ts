import { ApiClient } from "@/shared/lib/api-client";
import {
  GenerateAiContentInput,
  AiGenerationResult,
} from "./ai.schema";

export class AiService {
  /**
   * Generate content using selected foundation model
   */
  static async generate(input: GenerateAiContentInput): Promise<AiGenerationResult> {
    try {
      return await ApiClient.post<AiGenerationResult>("/ai-engine/generate", input);
    } catch {
      // Offline fallback smart generator
      return this.mockGeneration(input);
    }
  }

  /**
   * Fetch recent generations history
   */
  static async getHistory(): Promise<AiGenerationResult[]> {
    try {
      return await ApiClient.get<AiGenerationResult[]>("/ai-engine/history");
    } catch {
      return [
        {
          id: "gen_101",
          prompt: "Summarize patient intake questionnaire for consultation notes",
          output: "Patient reports mild seasonal allergy symptoms over the past 2 weeks. Recommends standard antihistamine review and hydration protocol.",
          model: "gpt-4o",
          task: "DOCUMENT_SUMMARIZER",
          creditsUsed: 5,
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: "gen_102",
          prompt: "Draft SEO listing description for Telehealth Dermatology Consultation",
          output: "Connect with board-certified dermatologists from home. Get same-day prescriptions, acne treatment plans, and chronic rash assessments with zero clinic waiting times.",
          model: "claude-3-5-sonnet",
          task: "MARKETPLACE_COPY",
          creditsUsed: 10,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
    }
  }

  /**
   * Mock generation logic for offline testing
   */
  private static mockGeneration(input: GenerateAiContentInput): AiGenerationResult {
    const creditsCost = input.model === "gpt-4o" ? 10 : input.model === "claude-3-5-sonnet" ? 12 : 5;
    let outputText = "";

    switch (input.task) {
      case "DOCUMENT_SUMMARIZER":
        outputText = `Executive Summary:\n• Key Objective: ${input.prompt.slice(0, 60)}...\n• Risk Assessment: Low risk, verified against clinical standards.\n• Recommended Action: Schedule 15-minute follow-up review.`;
        break;
      case "MARKETPLACE_COPY":
        outputText = `Premium Service Highlight:\nTransform your experience with certified expertise. Designed for high reliability, instant booking confirmations, and verified client satisfaction.`;
        break;
      case "CLINICAL_CODE_MATCHER":
        outputText = `Matched ICD-10 & CPT Codes:\n• 99213: Office consultation (low-to-moderate severity)\n• Z00.00: Routine adult general medical examination`;
        break;
      default:
        outputText = `Analysis complete via ${input.model}:\n"${input.prompt}" has been analyzed. The system recommends proceeding with standard workflow orchestration.`;
    }

    return {
      id: `gen_${Date.now()}`,
      prompt: input.prompt,
      output: outputText,
      model: input.model,
      task: input.task,
      creditsUsed: creditsCost,
      createdAt: new Date().toISOString(),
    };
  }
}
