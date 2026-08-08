import Link from 'next/link';
import { COLORS } from '@/config/theme';

export function Header() {
  return (
    <header className="full-width-header">
      <div className="header-inner">
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
        <nav className="header-nav" aria-label="주요 메뉴">
          <Link href="/guide" title="검사방법 안내">
            <span aria-hidden="true">📋</span>
            <strong>검사방법 안내</strong>
          </Link>
          <Link href="/faq" title="자주 발생하는 문제">
            <span aria-hidden="true">❓</span>
            <strong>자주 발생하는 문제</strong>
          </Link>
        </nav>
      </div>
    </header>
  );
}
