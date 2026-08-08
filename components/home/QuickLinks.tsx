import Link from 'next/link';
import { COLORS, RADIUS, SHADOW } from '@/config/theme';

const LINKS = [
  { href: '/chat', icon: '💬', label: 'AI에게 질문하기' },
  { href: '/guide', icon: '📋', label: '검사방법 안내' },
  { href: '/faq', icon: '❓', label: '자주 발생하는 문제' },
];

export function QuickLinks() {
  return (
    <nav className="landing-quick-links" aria-label="빠른 메뉴">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: '18px 8px',
            borderRadius: RADIUS.lg,
            textDecoration: 'none',
            color: COLORS.text,
            background: COLORS.card,
            boxShadow: SHADOW.soft,
          }}
        >
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: COLORS.accentSoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            {link.icon}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, textAlign: 'center', lineHeight: 1.3 }}>
            {link.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
