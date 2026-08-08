import Link from 'next/link';

const LINKS = [
  { href: '/chat', label: 'AI에게 질문하기', primary: true },
  { href: '/guide', label: '검사방법 안내', primary: false },
  { href: '/faq', label: '자주 발생하는 문제', primary: false },
];

export function QuickLinks() {
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '16px',
            borderRadius: 10,
            textDecoration: 'none',
            fontWeight: 600,
            background: link.primary ? '#2563eb' : '#fff',
            color: link.primary ? '#fff' : '#1a1a1a',
            border: link.primary ? 'none' : '1px solid #ddd',
          }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
