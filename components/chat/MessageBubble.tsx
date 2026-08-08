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
          borderRadius: 14,
          background: isUser ? '#2563eb' : '#fff',
          color: isUser ? '#fff' : '#1a1a1a',
          border: isUser ? 'none' : '1px solid #e5e5e5',
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
