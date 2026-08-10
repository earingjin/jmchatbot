import 'server-only';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export type Role = 'counselor' | 'admin' | 'defense_education';

export interface SessionInfo {
  userId: string;
  role: Role;
  counselorId: string;
  displayName: string;
}

/**
 * Server Component / Route Handler / Server Action에서 쓰는 Supabase 클라이언트.
 * 세션 쓰기는 middleware.ts가 담당하므로, 여기서 쿠키 쓰기가 실패해도(Server Component 제약) 무시한다.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server Component에서는 쿠키를 쓸 수 없음 — middleware.ts가 세션 갱신을 담당
          }
        },
      },
    }
  );
}

/**
 * 로그인된 사용자의 역할/상담사 식별 정보를 반환한다. role/counselor_id/display_name은
 * 사용자가 스스로 바꿀 수 없는 app_metadata에만 저장되어 있다 (service_role만 기록 가능).
 *
 * defense_education(국방전직교육원 담당자)은 부서 공용 계정이라 counselor_id가 실제 상담사를
 * 가리키지 않는다 — placeholder 값이며 getAllRecords에서 이 role일 때는 무시된다.
 */
export async function getSession(): Promise<SessionInfo | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const role = user.app_metadata?.role;
  const counselorId = user.app_metadata?.counselor_id;
  const displayName = user.app_metadata?.display_name;

  if (
    (role !== 'counselor' && role !== 'admin' && role !== 'defense_education') ||
    !counselorId ||
    !displayName
  ) {
    return null;
  }

  return { userId: user.id, role, counselorId, displayName };
}
