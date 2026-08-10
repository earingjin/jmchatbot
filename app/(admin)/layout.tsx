import { redirect } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { getSession } from '@/lib/auth';
import { signOutAction } from '@/lib/actions';

export const metadata = {
  title: 'JM 상담기록 시스템',
};

/**
 * 관리자 전용 레이아웃.
 * 이 그룹(/admin/*)에 속한 페이지(대시보드/계정관리/자료관리)에만 적용됩니다.
 * middleware.ts가 1차로 세션/역할을 검사하지만, 우회 경로에 대비해 여기서도 다시 확인한다.
 * defense_education은 여기 접근 대상이 아니다 (/records만 열람) — middleware가
 * role !== 'admin'인 사용자를 /admin/*에서 /records로 이미 되돌린다.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect('/login/counselor');
  }
  if (session.role !== 'admin') {
    redirect('/records');
  }

  return (
    <div id="app">
      <TopBar
        roleChip={`관리자 · ${session.displayName}`}
        links={[
          { label: '상담사 계정 관리', href: '/admin/accounts' },
          { label: 'AI 참고자료 관리', href: '/admin/documents' },
        ]}
        logoutAction={signOutAction}
      />
      {children}
    </div>
  );
}
