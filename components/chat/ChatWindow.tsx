'use client';

import { useState } from 'react';
import { ButtonChips } from '@/components/chat/ButtonChips';
import { MessageBubble, type ChatMessageView } from '@/components/chat/MessageBubble';
import { RatingPrompt } from '@/components/chat/RatingPrompt';
import { stripButtons } from '@/lib/stateTag';
import { COLORS, RADIUS } from '@/config/theme';

const INITIAL_BUTTONS = ['검사 방법', '검사 링크/로그인', '검사 진행 오류', '결과 확인'];

interface DisplayMessage extends ChatMessageView {
  buttons?: string[];
}

export function ChatWindow() {
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { role: 'assistant', text: '무엇이 불편하신가요?', buttons: INITIAL_BUTTONS },
  ]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ended, setEnded] = useState(false);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId, message: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
        ]);
        return;
      }

      setSessionId(data.sessionId);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: stripButtons(data.reply), buttons: data.buttons },
      ]);

      if (data.escalated || data.session?.resolved === true) {
        setEnded(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div>
        {messages.map((message, i) => (
          <div key={i}>
            <MessageBubble message={message} />
            {message.role === 'assistant' && (
              <ButtonChips
                options={message.buttons ?? []}
                disabled={loading || i !== messages.length - 1}
                onSelect={sendMessage}
              />
            )}
          </div>
        ))}
        {loading && <p style={{ color: COLORS.textMuted, fontSize: 13 }}>답변 작성 중...</p>}
      </div>

      {ended && sessionId && <RatingPrompt sessionId={sessionId} />}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        style={{ display: 'flex', gap: 8, marginTop: 8 }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="궁금한 내용을 입력해주세요"
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: RADIUS.md,
            border: `1px solid ${COLORS.border}`,
            background: COLORS.card,
            fontSize: 14,
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: '12px 18px',
            borderRadius: RADIUS.md,
            border: 'none',
            background: COLORS.accent,
            color: '#fff',
            fontWeight: 700,
            opacity: loading || !input.trim() ? 0.5 : 1,
          }}
        >
          전송
        </button>
      </form>
    </div>
  );
}
