import Link from 'next/link';
import { COLORS, RADIUS, SHADOW } from '@/config/theme';

export function Hero() {
  return (
    <section className="landing-hero">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />
      <span
        style={{
          display: 'inline-block', padding: '7px 15px', borderRadius: RADIUS.pill,
          background: COLORS.accentSoft, color: COLORS.accentDark, fontSize: 12,
          fontWeight: 800, marginBottom: 18,
        }}
      >
        24시간 AI 도움센터
      </span>

      <h1 className="landing-title">
        나를 이해하는 첫걸음,<br />버크만 검사와 함께하세요
      </h1>
      <p className="landing-description">
        행동과 동기, 관계 속의 나를 발견해 보세요.<br />
        검사 진행이 어렵다면 24시간 AI 도움센터가 바로 도와드립니다.
      </p>

      <Link
        href="/chat"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 9, padding: '15px 28px',
          borderRadius: RADIUS.pill, background: COLORS.accent, color: '#fff',
          fontWeight: 800, fontSize: 15, textDecoration: 'none', boxShadow: SHADOW.soft,
        }}
      >
        AI 상담 시작하기 <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
