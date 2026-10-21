// apps/mobile/src/features/chat-n8n/chat-box.screen.tsx
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  Send,
  Sparkles,
  Coins,
  Bot,
  User,
  Trash2,
} from "lucide-react-native";
import { StandardMobileScreenShell } from "@/shared/layouts/StandardMobileScreenShell";
import { useChatController } from "./chat.controller";
import { ChatMessage } from "./chat.schema";
import { useThemeStore } from "@/shared/stores/theme.store";
import { themeConfig } from "@shared/config";

const QUICK_PROMPTS = [
  "How to book an appointment with Dr. Sarah?",
  "Check my wallet balance & withdrawal status",
  "Summarize my recent health consultations",
  "What is the platform commission rate?",
];

export const ChatBoxScreen: React.FC = () => {
  const { colors, isDark } = useThemeStore();
  const flatListRef = useRef<FlatList>(null);
  const {
    messages,
    isLoading,
    isSending,
    inputPrompt,
    setInputPrompt,
    error,
    handleSendMessage,
    handleClearChat,
    reloadHistory,
    userCredits,
  } = useChatController();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isSending]);

  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";

    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.messageRowUser : styles.messageRowAssistant,
        ]}
      >
        {!isUser && (
          <View
            style={[
              styles.avatarMini,
              { backgroundColor: `${themeConfig.colors.primary[500]}25` },
            ]}
          >
            <Bot size={16} color={themeConfig.colors.primary[500]} />
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isUser
              ? [styles.userBubble, { backgroundColor: themeConfig.colors.primary[500] }]
              : [
                  styles.assistantBubble,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ],
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: isUser ? "#ffffff" : colors.textPrimary },
            ]}
          >
            {item.content}
          </Text>

          {item.tokensUsed && !isUser && (
            <View style={styles.tokenTag}>
              <Sparkles size={10} color={themeConfig.colors.primary[400]} />
              <Text
                style={[
                  styles.tokenText,
                  { color: isDark ? "#94a3b8" : "#64748b" },
                ]}
              >
                1 credit used
              </Text>
            </View>
          )}
        </View>

        {isUser && (
          <View
            style={[
              styles.avatarMini,
              { backgroundColor: isDark ? "#334155" : "#e2e8f0" },
            ]}
          >
            <User size={16} color={colors.textPrimary} />
          </View>
        )}
      </View>
    );
  };

  return (
    <StandardMobileScreenShell
      title="AI & n8n Assistant"
      subtitle="Connected to Master LLM Engine"
      showBack
      scrollable={false}
      headerRightSlot={
        <View style={styles.headerRightContainer}>
          <View
            style={[
              styles.creditPill,
              { backgroundColor: `${themeConfig.colors.status.warning}20` },
            ]}
          >
            <Coins size={14} color={themeConfig.colors.status.warning} />
            <Text
              style={[
                styles.creditPillText,
                { color: themeConfig.colors.status.warning },
              ]}
            >
              {userCredits} credits
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleClearChat}
            style={[styles.clearBtn, { borderColor: colors.border }]}
            accessibilityLabel="Clear chat"
          >
            <Trash2 size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      }
      error={error}
      onRetry={reloadHistory}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Messages List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={themeConfig.colors.primary[500]} />
            <Text style={[styles.loadingLabel, { color: colors.textSecondary }]}>
              Connecting to n8n AI engine...
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item: any) => item.id}
            renderItem={renderMessageItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.promptChipsContainer}>
                <Text style={[styles.chipsHeading, { color: colors.textMuted }]}>
                  SUGGESTED ACTIONS:
                </Text>
                <View style={styles.chipsRow}>
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleSendMessage(prompt)}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Sparkles size={12} color={themeConfig.colors.primary[400]} />
                      <Text
                        style={[styles.chipText, { color: colors.textPrimary }]}
                        numberOfLines={1}
                      >
                        {prompt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            }
            ListFooterComponent={
              isSending ? (
                <View style={styles.typingContainer}>
                  <View
                    style={[
                      styles.avatarMini,
                      { backgroundColor: `${themeConfig.colors.primary[500]}25` },
                    ]}
                  >
                    <Bot size={16} color={themeConfig.colors.primary[500]} />
                  </View>
                  <View
                    style={[
                      styles.typingBubble,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <ActivityIndicator
                      size="small"
                      color={themeConfig.colors.primary[500]}
                    />
                    <Text
                      style={[styles.typingText, { color: colors.textSecondary }]}
                    >
                      AI is generating response...
                    </Text>
                  </View>
                </View>
              ) : null
            }
          />
        )}

        {/* Input Bar */}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.card,
              borderTopColor: colors.border,
            },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.inputBackground,
                color: colors.textPrimary,
                borderColor: colors.border,
              },
            ]}
            placeholder="Ask AI anything about bookings, billing..."
            placeholderTextColor={colors.textMuted}
            value={inputPrompt}
            onChangeText={setInputPrompt}
            multiline
            maxLength={1000}
            onSubmitEditing={() => handleSendMessage()}
          />

          <TouchableOpacity
            onPress={() => handleSendMessage()}
            disabled={!inputPrompt.trim() || isSending}
            style={[
              styles.sendButton,
              {
                backgroundColor:
                  !inputPrompt.trim() || isSending
                    ? isDark
                      ? "#334155"
                      : "#cbd5e1"
                    : themeConfig.colors.primary[500],
              },
            ]}
            accessibilityLabel="Send message"
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Send size={18} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </StandardMobileScreenShell>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  creditPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  creditPillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  clearBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  promptChipsContainer: {
    marginBottom: 16,
  },
  chipsHeading: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  chipsRow: {
    gap: 6,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 14,
    gap: 8,
    alignItems: "flex-end",
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  messageRowAssistant: {
    justifyContent: "flex-start",
  },
  avatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    borderBottomRightRadius: 2,
  },
  assistantBubble: {
    borderBottomLeftRadius: 2,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  tokenTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
    alignSelf: "flex-end",
  },
  tokenText: {
    fontSize: 9,
    fontWeight: "600",
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  typingText: {
    fontSize: 12,
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
