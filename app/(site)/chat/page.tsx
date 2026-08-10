import { ChatWindow } from '@/components/chat/ChatWindow';

export default function ChatPage() {
  return (
    <main className="chat-page">
      <header className="chat-room-header">
        <span className="chat-header-avatar" aria-hidden="true"><AiIcon /></span>
        <div className="chat-header-copy">
          <h1>AI 상담</h1>
          <p>검사 진행을 도와드릴게요</p>
        </div>
        <span className="chat-status"><i aria-hidden="true" />AI 상담 가능</span>
      </header>
      <ChatWindow />
    </main>
  );
}

function AiIcon() {
  return <svg viewBox="0 0 40 40"><rect x="8" y="10" width="24" height="21" rx="7"/><path d="M20 6v4M12 31v3m16-3v3"/><circle cx="15.5" cy="20" r="1.5"/><circle cx="24.5" cy="20" r="1.5"/><path d="M15 26h10"/></svg>;
}
