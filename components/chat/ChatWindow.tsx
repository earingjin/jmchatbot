'use client';

import { useState } from 'react';
import { ButtonChips } from '@/components/chat/ButtonChips';
import { MessageBubble, TypingBubble, type ChatMessageView } from '@/components/chat/MessageBubble';
import { RatingPrompt } from '@/components/chat/RatingPrompt';
import { stripButtons } from '@/lib/stateTag';
import { COLORS, RADIUS } from '@/config/theme';

const INITIAL_BUTTONS = ['검사 방법', '검사 링크/로그인', '검사 진행 오류', '결과 확인'];

interface DisplayMessage extends ChatMessageView {
  buttons?: string[];
}

export function ChatWindow() {
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { role: 'assistant', text: '안녕하세요! 검사 진행 중 어떤 점이 불편하신가요?', buttons: INITIAL_BUTTONS },
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
      const responseText = await res.text();
      let data: { reply?: string; sessionId?: string; buttons?: string[]; escalated?: boolean; session?: { resolved?: boolean } } = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          // 개발 서버 오류 페이지처럼 JSON이 아닌 응답도 화면을 깨뜨리지 않는다.
        }
      }

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: data.reply ?? '잠시 연결이 원활하지 않네요. 조금 뒤에 다시 말씀해 주세요.',
          },
        ]);
        return;
      }

      if (!data.reply || !data.sessionId) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: '답변을 불러오지 못했어요. 잠시 후 다시 말씀해 주세요.' },
        ]);
        return;
      }

      const reply = data.reply;
      const nextSessionId = data.sessionId;
      setSessionId(nextSessionId);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: stripButtons(reply), buttons: data.buttons },
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
        {loading && <TypingBubble />}
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
