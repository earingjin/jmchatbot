import { COLORS, SHADOW } from '@/config/theme';

export interface ChatMessageView {
  role: 'assistant' | 'user';
  text: string;
}

export function MessageBubble({ message }: { message: ChatMessageView }) {
  const isUser = message.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
      <div
        style={{
          maxWidth: '80%',
          padding: '10px 14px',
          borderRadius: 16,
          background: isUser ? COLORS.accent : COLORS.card,
          color: isUser ? '#fff' : COLORS.text,
          boxShadow: isUser ? 'none' : SHADOW.soft,
          whiteSpace: 'pre-wrap',
          lineHeight: 1.5,
          fontSize: 14,
        }}
      >
        {message.text}
      </div>
    </div>
  );
}
