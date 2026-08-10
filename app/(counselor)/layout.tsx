import { redirect } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { getSession } from '@/lib/auth';
import { signOutAction } from '@/lib/actions';

/**
 * defense_education도 /records를 보므로, 탭 제목을 실제 로그인한 역할에 맞춰 동적으로 만든다.
 */
export async function generateMetadata() {
  const session = await getSession();
  const roleLabel = session?.role === 'defense_education' ? '국방전직교육원 담당자' : '상담사';
  return { title: `${roleLabel} 페이지 | JM 상담기록 시스템` };
}

/**
 * 상담사 전용 레이아웃.
 * 이 그룹(/records/*)에 속한 페이지에만 적용됩니다.
 * middleware.ts가 1차로 세션/역할을 검사하지만, 우회 경로에 대비해 여기서도 다시 확인한다
 * (Supabase 공식 권장: 미들웨어만 믿지 말고 서버 컴포넌트에서도 재검증).
 */
export default async function CounselorLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect('/login/counselor');
  }

  const roleLabel = session.role === 'defense_education' ? '국방전직교육원 담당자' : '상담사';

  return (
    <div id="app">
      <TopBar roleChip={`${roleLabel} · ${session.displayName}`} links={[]} logoutAction={signOutAction} />
      {children}
    </div>
  );
}
