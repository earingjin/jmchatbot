import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

/**
 * 상담사/관리자 포털(/records, /admin) 라우트 접근 가드.
 * 세션이 없으면 로그인 화면으로, admin이 아닌 사용자가 /admin/*에 접근하면
 * /records로 되돌린다. 역할은 app_metadata(서버에서만 기록 가능)에서 읽는다.
 *
 * matcher가 /records와 /admin만 가리키므로 공개 챗봇 경로(/, /chat, /faq, /guide)는
 * 이 미들웨어를 거치지 않는다.
 */
export async function middleware(req: NextRequest) {
  const { response, user } = await updateSession(req);

  if (!user) {
    return NextResponse.redirect(new URL('/login/counselor', req.url));
  }

  const role = user.app_metadata?.role;
  if (req.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/records', req.url));
  }

  return response;
}

export const config = {
  matcher: ['/records/:path*', '/admin/:path*'],
};
