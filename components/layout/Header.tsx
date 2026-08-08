import Link from 'next/link';
import { COLORS } from '@/config/theme';

export function Header() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '16px 0',
        background: COLORS.bg,
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: COLORS.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          🤖
        </span>
        <span style={{ fontWeight: 800, fontSize: 15, color: COLORS.text, letterSpacing: -0.2 }}>
          버크만 AI 도움센터
        </span>
      </Link>
    </header>
  );
}
