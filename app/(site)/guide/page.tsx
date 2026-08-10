import Link from 'next/link';
import { GUIDE_SECTIONS } from '@/lib/guideContent';
import { COLORS, RADIUS, SHADOW } from '@/config/theme';

export default function GuidePage() {
  return (
    <main>
      <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: COLORS.text, letterSpacing: -0.3 }}>
        검사방법 안내
      </h1>
      {GUIDE_SECTIONS.map((section) => (
        <section
          key={section.title}
          style={{
            marginBottom: 14,
            padding: '16px 18px',
            borderRadius: RADIUS.lg,
            background: COLORS.card,
            boxShadow: SHADOW.soft,
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: COLORS.accentDark }}>
            {section.title}
          </h2>
          <p style={{ color: COLORS.text, lineHeight: 1.6, margin: 0, fontSize: 14 }}>{section.body}</p>
        </section>
      ))}
      <Link
        href="/chat"
        style={{
          display: 'inline-block',
          marginTop: 8,
          padding: '12px 20px',
          borderRadius: RADIUS.pill,
          background: COLORS.accent,
          color: '#fff',
          fontWeight: 700,
          fontSize: 14,
          textDecoration: 'none',
        }}
      >
        여전히 문제가 있으신가요? AI에게 질문하기 →
      </Link>
    </main>
  );
}
