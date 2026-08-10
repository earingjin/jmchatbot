import Link from 'next/link';

export function Header() {
  return (
    <header className="full-width-header">
      <div className="header-inner">
        <Link href="/" className="header-brand">
          <span className="header-brand-mark" aria-hidden="true">B</span>
          <span>버크만 AI 도움센터</span>
        </Link>
        <nav className="header-nav" aria-label="주요 메뉴">
          <Link href="/guide">검사방법 안내</Link>
          <Link href="/faq">자주 발생하는 문제</Link>
        </nav>
        <Link href="/login" className="admin-header-link" aria-label="관리자 페이지">관리자</Link>
      </div>
    </header>
  );
}
