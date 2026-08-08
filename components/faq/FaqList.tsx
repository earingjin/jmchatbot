import { CATEGORIES } from '@/config/constants';
import { FAQ_ENTRIES } from '@/lib/faqData';
import { COLORS, RADIUS, SHADOW } from '@/config/theme';

export function FaqList() {
  return (
    <div>
      {CATEGORIES.map((category) => {
        const entries = FAQ_ENTRIES.filter((e) => e.category === category.key);
        if (entries.length === 0) return null;
        return (
          <section key={category.key} style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: COLORS.accentDark }}>
              {category.label}
            </h2>
            {entries.map((entry) => (
              <details
                key={entry.question}
                style={{
                  background: COLORS.card,
                  borderRadius: RADIUS.md,
                  boxShadow: SHADOW.soft,
                  padding: '12px 16px',
                  marginBottom: 8,
                }}
              >
                <summary style={{ fontWeight: 700, cursor: 'pointer', color: COLORS.text }}>
                  {entry.question}
                </summary>
                <p style={{ marginTop: 8, marginBottom: 0, color: COLORS.textMuted, lineHeight: 1.6 }}>
                  {entry.answer}
                </p>
              </details>
            ))}
          </section>
        );
      })}
    </div>
  );
}
