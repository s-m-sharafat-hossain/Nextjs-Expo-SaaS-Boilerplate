// apps/web/src/app/(dashboard)/consumer/chat/page.tsx
import { ChatBoxComponent } from "@/features/chat-n8n/chat-box.component";

export const metadata = {
  title: "AI Clinical Assistant | MasterFlow",
  description: "AI-powered clinical triage, appointment booking guidance, and support.",
};

export default function ConsumerChatPage() {
  return <ChatBoxComponent userRole="CONSUMER" />;
}
