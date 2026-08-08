import Link from 'next/link';

const LINKS = [
  { href: '/chat', index: '01', label: 'AI에게 질문하기' },
  { href: '/guide', index: '02', label: '검사방법 안내' },
  { href: '/faq', index: '03', label: '자주 발생하는 문제' },
];

export function QuickLinks() {
  return (
    <nav className="landing-quick-links" aria-label="빠른 메뉴">
      {LINKS.map((link) => (
        <Link key={link.href} href={link.href}>
          <span className="quick-link-index">{link.index}</span>
          <strong>{link.label}</strong>
          <span className="quick-link-arrow" aria-hidden="true">→</span>
        </Link>
      ))}
    </nav>
  );
}
