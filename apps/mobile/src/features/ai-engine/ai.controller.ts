import { useState, useCallback, useEffect } from "react";
import { useAuthStore } from "@/shared/stores/auth.store";
import { AiService } from "./ai.service";
import {
  AiModelType,
  AiTaskType,
  AiGenerationResult,
  GenerateAiContentSchema,
} from "./ai.schema";

export const useAiController = () => {
  const { user, setUser } = useAuthStore();

  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<AiModelType>("gpt-4o");
  const [selectedTask, setSelectedTask] = useState<AiTaskType>("GENERAL_CHAT");
  const [currentResult, setCurrentResult] = useState<AiGenerationResult | null>(null);
  const [history, setHistory] = useState<AiGenerationResult[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load Generation History
   */
  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const records = await AiService.getHistory();
      setHistory(records);
    } catch {
      // Ignore background history fetch errors
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  /**
   * Calculate Estimated Credit Cost
   */
  const estimatedCost = selectedModel === "gpt-4o" ? 10 : selectedModel === "claude-3-5-sonnet" ? 12 : 5;

  /**
   * Execute Generation
   */
  const handleGenerate = useCallback(async () => {
    setError(null);

    const validation = GenerateAiContentSchema.safeParse({
      prompt,
      model: selectedModel,
      task: selectedTask,
    });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Please enter a valid prompt");
      return;
    }

    if (user && (user.credits || 0) < estimatedCost) {
      setError(`Insufficient credits. You need ${estimatedCost} credits to run this model.`);
      return;
    }

    setIsGenerating(true);
    try {
      const result = await AiService.generate(validation.data);
      setCurrentResult(result);
      setHistory((prev) => [result, ...prev]);

      // Deduct credits optimistically
      if (user) {
        const updatedCredits = Math.max(0, (user.credits || 0) - result.creditsUsed);
        await setUser({ ...user, credits: updatedCredits });
      }

      setPrompt("");
    } catch (err: any) {
      setError(err?.message || "Failed to generate AI response");
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedModel, selectedTask, user, estimatedCost, setUser]);

  return {
    prompt,
    setPrompt,
    selectedModel,
    setSelectedModel,
    selectedTask,
    setSelectedTask,
    currentResult,
    setCurrentResult,
    history,
    isGenerating,
    isLoadingHistory,
    error,
    estimatedCost,
    userCredits: user?.credits || 0,
    handleGenerate,
    loadHistory,
  };
};
