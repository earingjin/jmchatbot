import Link from 'next/link';
import { FaqList } from '@/components/faq/FaqList';
import { COLORS, RADIUS } from '@/config/theme';

export default function FaqPage() {
  return (
    <main>
      <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: COLORS.text, letterSpacing: -0.3 }}>
        자주 발생하는 문제
      </h1>
      <FaqList />
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
        원하는 답을 못 찾으셨나요? AI에게 질문하기 →
      </Link>
    </main>
  );
}
