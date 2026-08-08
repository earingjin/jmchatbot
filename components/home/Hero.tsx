import Link from 'next/link';
import { COLORS, RADIUS, SHADOW } from '@/config/theme';

export function Hero() {
  return (
    <section style={{ padding: '12px 0 28px', textAlign: 'center' }}>
      <span
        style={{
          display: 'inline-block',
          padding: '6px 14px',
          borderRadius: RADIUS.pill,
          background: COLORS.accentSoft,
          color: COLORS.accentDark,
          fontSize: 12,
          fontWeight: 700,
          marginBottom: 14,
        }}
      >
        24시간 AI 도움센터
      </span>

      <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.35, margin: '0 0 16px', letterSpacing: -0.4 }}>
        검사가 막막하신가요?
      </h1>

      <div
        style={{
          display: 'inline-block',
          background: COLORS.card,
          borderRadius: RADIUS.lg,
          boxShadow: SHADOW.soft,
          padding: '16px 20px',
          marginBottom: 20,
          maxWidth: 340,
        }}
      >
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: COLORS.text }}>
          링크가 안 열리거나 화면이 멈췄나요?
          <br />
          AI가 지금 바로 도와드릴게요.
        </p>
      </div>

      <div>
        <Link
          href="/chat"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 26px',
            borderRadius: RADIUS.pill,
            background: COLORS.accent,
            color: '#fff',
            fontWeight: 700,
            fontSize: 15,
            textDecoration: 'none',
            boxShadow: SHADOW.soft,
          }}
        >
          AI에게 바로 물어보기 →
        </Link>
      </div>
    </section>
  );
}
