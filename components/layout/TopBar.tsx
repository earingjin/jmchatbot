import Link from 'next/link';
import { Seal } from './Seal';

interface TopBarLink {
  label: string;
  href: string;
}

/**
 * 상담사/관리자 포털 공용 상단바. jmcounseling의 TopBar를 그대로 이식.
 */
export function TopBar({
  roleChip,
  links,
  logoutAction,
}: {
  roleChip: string;
  links: TopBarLink[];
  logoutAction: () => void;
}) {
  return (
    <div className="topbar">
      <div className="brand">
        <Seal />
        <div className="brand-text">JM 상담기록 시스템</div>
      </div>
      <div className="topbar-right">
        <span className="role-chip">{roleChip}</span>
        {links.map((l) => (
          <Link key={l.href + l.label} href={l.href} className="btn-ghost-dark">
            {l.label}
          </Link>
        ))}
        <form action={logoutAction}>
          <button type="submit" className="btn-ghost-dark">로그아웃</button>
        </form>
      </div>
    </div>
  );
}
