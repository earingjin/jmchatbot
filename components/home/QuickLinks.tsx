import Link from 'next/link';

const LINKS = [
  { href: '/chat', label: 'AI에게 질문하기' },
  { href: '/guide', label: '검사방법 안내' },
  { href: '/faq', label: '자주 발생하는 문제' },
  { href: '/notice', label: '공지사항' },
];

export function QuickLinks() {
  return (
    <nav className="landing-quick-links" aria-label="빠른 메뉴">
      {LINKS.map((link) => (
        <Link key={link.href} href={link.href}>
          <strong>{link.label}</strong>
          <span className="quick-link-arrow" aria-hidden="true">→</span>
        </Link>
      ))}
    </nav>
  );
}
