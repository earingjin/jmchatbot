'use client';

import { useState } from 'react';

export function RatingPrompt({ sessionId }: { sessionId: string }) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return <p style={{ textAlign: 'center', color: '#666', fontSize: 13 }}>소중한 의견 감사합니다.</p>;
  }

  async function rate(rating: number) {
    setSubmitted(true);
    await fetch('/api/chat/rate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sessionId, rating }),
    }).catch(() => {});
  }

  return (
    <div style={{ textAlign: 'center', margin: '12px 0' }}>
      <p style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>이 상담이 도움이 되었나요?</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => rate(n)}
            aria-label={`${n}점`}
            style={{ fontSize: 22, background: 'none', border: 'none', padding: 2 }}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}
