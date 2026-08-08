import { ChatWindow } from '@/components/chat/ChatWindow';
import { COLORS } from '@/config/theme';

export default function ChatPage() {
  return (
    <main>
      <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: COLORS.text, letterSpacing: -0.3 }}>
        AI 상담
      </h1>
      <ChatWindow />
    </main>
  );
}
