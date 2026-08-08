import type { AnswerSource } from '@/lib/knowledge/types';

export interface ChatMessageView {
  role: 'assistant' | 'user';
  text: string;
  sources?: AnswerSource[];
}

export function MessageBubble({ message, welcome = false }: { message: ChatMessageView; welcome?: boolean }) {
  const isUser = message.role === 'user';
  return (
    <div className={`message-row ${isUser ? 'message-row-user' : 'message-row-ai'}`}>
      {!isUser && <span className="message-avatar" aria-hidden="true"><AiIcon /></span>}
      <div className={`message-bubble ${isUser ? 'message-bubble-user' : 'message-bubble-ai'}${welcome ? ' message-bubble-welcome' : ''}`}>
        {message.text}
      </div>
    </div>
  );
}

function AiIcon() {
  return <svg viewBox="0 0 36 36"><rect x="7" y="9" width="22" height="19" rx="6"/><path d="M18 6v3"/><circle cx="13.5" cy="18" r="1.3"/><circle cx="22.5" cy="18" r="1.3"/><path d="M14 23h8"/></svg>;
}

export function TypingBubble() {
  return (
    <div
      role="status"
      aria-label="AI가 답변을 작성하고 있습니다"
      className="message-row message-row-ai"
    >
      <span className="message-avatar" aria-hidden="true"><AiIcon /></span>
      <div className="typing-bubble" aria-hidden="true">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}
