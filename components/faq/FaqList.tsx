import { CATEGORIES } from '@/config/constants';
import { FAQ_ENTRIES } from '@/lib/faqData';

export function FaqList() {
  return (
    <div>
      {CATEGORIES.map((category) => {
        const entries = FAQ_ENTRIES.filter((e) => e.category === category.key);
        if (entries.length === 0) return null;
        return (
          <section key={category.key} style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, marginBottom: 10 }}>{category.label}</h2>
            {entries.map((entry) => (
              <details
                key={entry.question}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: 8,
                  padding: '10px 14px',
                  marginBottom: 8,
                }}
              >
                <summary style={{ fontWeight: 600, cursor: 'pointer' }}>{entry.question}</summary>
                <p style={{ marginTop: 8, marginBottom: 0, color: '#444', lineHeight: 1.6 }}>{entry.answer}</p>
              </details>
            ))}
          </section>
        );
      })}
    </div>
  );
}
