import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  Sparkles,
  Cpu,
  Coins,
  Send,
  Copy,
  Check,
  History,
  AlertCircle,
  FileText,
  Layers,
} from "lucide-react-native";
import { StandardMobileScreenShell } from "@/shared/layouts/StandardMobileScreenShell";
import { useAiController } from "./ai.controller";
import { useThemeStore } from "@/shared/stores/theme.store";
import { themeConfig } from "@shared/config";
import { AiModelType, AiTaskType } from "./ai.schema";

const MODELS: { id: AiModelType; label: string; desc: string; cost: number }[] = [
  { id: "gpt-4o", label: "GPT-4o", desc: "Flagship Reasoning", cost: 10 },
  { id: "claude-3-5-sonnet", label: "Claude 3.5", desc: "Best for Writing", cost: 12 },
  { id: "gemini-1-5-pro", label: "Gemini 1.5", desc: "Long Context", cost: 5 },
];

const TASKS: { id: AiTaskType; label: string }[] = [
  { id: "GENERAL_CHAT", label: "General Chat" },
  { id: "CONSULTATION_ASSISTANT", label: "Clinical Notes" },
  { id: "DOCUMENT_SUMMARIZER", label: "Summarizer" },
  { id: "MARKETPLACE_COPY", label: "Listing Copy" },
];

export const AiScreen: React.FC = () => {
  const { colors, isDark } = useThemeStore();
  const {
    prompt,
    setPrompt,
    selectedModel,
    setSelectedModel,
    selectedTask,
    setSelectedTask,
    currentResult,
    history,
    isGenerating,
    error,
    estimatedCost,
    userCredits,
    handleGenerate,
  } = useAiController();

  const [copied, setCopied] = React.useState(false);

  const handleCopyOutput = () => {
    if (currentResult?.output) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <StandardMobileScreenShell
      title="AI Copilot & Engine"
      subtitle="Multi-Model Intelligence & Automation Studio"
      headerRightSlot={
        <View style={[styles.creditsBadge, { backgroundColor: `${themeConfig.colors.primary[500]}20` }]}>
          <Coins size={14} color={themeConfig.colors.primary[500]} />
          <Text style={[styles.creditsText, { color: themeConfig.colors.primary[500] }]}>
            {userCredits} Credits
          </Text>
        </View>
      }
    >
      {/* Error Banner */}
      {error && (
        <View style={styles.errorBox}>
          <AlertCircle size={16} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Model Selector Ribbon */}
      <View style={styles.sectionHeader}>
        <Cpu size={16} color={themeConfig.colors.primary[500]} />
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Foundation Model
        </Text>
      </View>

      <View style={styles.modelGrid}>
        {MODELS.map((m) => {
          const isSelected = selectedModel === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.modelCard,
                {
                  backgroundColor: colors.card,
                  borderColor: isSelected ? themeConfig.colors.primary[500] : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              onPress={() => setSelectedModel(m.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.modelName, { color: colors.textPrimary }]}>
                {m.label}
              </Text>
              <Text style={[styles.modelDesc, { color: colors.textSecondary }]}>
                {m.desc}
              </Text>
              <View style={styles.costBadge}>
                <Coins size={10} color={themeConfig.colors.primary[500]} />
                <Text style={styles.costText}>{m.cost} cr</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Task Selector Pills */}
      <View style={[styles.sectionHeader, { marginTop: 16 }]}>
        <Layers size={16} color={themeConfig.colors.primary[500]} />
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Task Preset
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.taskScroll}>
        {TASKS.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[
              styles.taskPill,
              {
                backgroundColor: selectedTask === t.id ? themeConfig.colors.primary[500] : colors.card,
                borderColor: selectedTask === t.id ? themeConfig.colors.primary[500] : colors.border,
              },
            ]}
            onPress={() => setSelectedTask(t.id)}
          >
            <Text
              style={[
                styles.taskText,
                { color: selectedTask === t.id ? "#ffffff" : colors.textPrimary },
              ]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Prompt Input Box */}
      <View style={[styles.inputBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TextInput
          style={[styles.textArea, { color: colors.textPrimary }]}
          placeholder="Ask a question, enter notes for clinical summary, or describe a marketplace service to draft..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
          value={prompt}
          onChangeText={setPrompt}
          textAlignVertical="top"
        />

        <View style={styles.inputFooter}>
          <Text style={[styles.tokenNotice, { color: colors.textMuted }]}>
            Cost: {estimatedCost} credits / run
          </Text>

          <TouchableOpacity
            style={[
              styles.generateBtn,
              { backgroundColor: themeConfig.colors.primary[500] },
              (!prompt.trim() || isGenerating) && styles.btnDisabled,
            ]}
            onPress={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            activeOpacity={0.8}
          >
            {isGenerating ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <View style={styles.btnRow}>
                <Sparkles size={16} color="#ffffff" />
                <Text style={styles.btnText}>Generate</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Generated Result Card */}
      {currentResult && (
        <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.resultHeader}>
            <View style={styles.resultTitleRow}>
              <Sparkles size={16} color="#10b981" />
              <Text style={[styles.resultTitle, { color: colors.textPrimary }]}>
                AI Output ({currentResult.model})
              </Text>
            </View>

            <TouchableOpacity style={styles.copyBtn} onPress={handleCopyOutput}>
              {copied ? (
                <Check size={16} color="#10b981" />
              ) : (
                <Copy size={16} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>

          <Text style={[styles.resultOutput, { color: colors.textPrimary }]}>
            {currentResult.output}
          </Text>

          <View style={styles.resultMetaRow}>
            <Text style={[styles.metaText, { color: colors.textMuted }]}>
              Task: {currentResult.task}
            </Text>
            <Text style={[styles.metaText, { color: colors.textMuted }]}>
              Deducted: {currentResult.creditsUsed} credits
            </Text>
          </View>
        </View>
      )}

      {/* Previous Generations History */}
      {history.length > 0 && (
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <History size={16} color={colors.textSecondary} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Recent Generations
            </Text>
          </View>

          {history.slice(0, 3).map((item) => (
            <View
              key={item.id}
              style={[styles.historyItem, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.historyPrompt, { color: colors.textPrimary }]} numberOfLines={1}>
                {item.prompt}
              </Text>
              <Text style={[styles.historyOutput, { color: colors.textSecondary }]} numberOfLines={2}>
                {item.output}
              </Text>
              <View style={styles.historyFooter}>
                <Text style={[styles.historyBadge, { color: themeConfig.colors.primary[500] }]}>
                  {item.model}
                </Text>
                <Text style={[styles.historyDate, { color: colors.textMuted }]}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </StandardMobileScreenShell>
  );
};

const styles = StyleSheet.create({
  creditsBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  creditsText: {
    fontSize: 12,
    fontWeight: "700",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: "#ef4444",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  modelGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  modelCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
  },
  modelName: {
    fontSize: 13,
    fontWeight: "700",
  },
  modelDesc: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 8,
  },
  costBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  costText: {
    fontSize: 10,
    fontWeight: "600",
    color: themeConfig.colors.primary[500],
  },
  taskScroll: {
    flexDirection: "row",
    marginBottom: 14,
  },
  taskPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  taskText: {
    fontSize: 12,
    fontWeight: "600",
  },
  inputBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  textArea: {
    fontSize: 14,
    minHeight: 80,
    lineHeight: 20,
  },
  inputFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(150, 150, 150, 0.1)",
  },
  tokenNotice: {
    fontSize: 12,
  },
  generateBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  btnText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  resultCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  resultTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  copyBtn: {
    padding: 6,
  },
  resultOutput: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  resultMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(150, 150, 150, 0.1)",
    paddingTop: 8,
  },
  metaText: {
    fontSize: 11,
  },
  historySection: {
    marginTop: 8,
  },
  historyItem: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  historyPrompt: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  historyOutput: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  historyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyBadge: {
    fontSize: 11,
    fontWeight: "700",
  },
  historyDate: {
    fontSize: 11,
  },
});
