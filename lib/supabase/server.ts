import { createClient } from '@supabase/supabase-js';

/**
 * 서버(API Route) 전용 Supabase 클라이언트.
 *
 * ⚠️ 이 파일은 절대 'use client' 컴포넌트나 브라우저에서 실행되는 코드에서
 *    import하면 안 됩니다. SUPABASE_SERVICE_ROLE_KEY는 RLS를 완전히
 *    우회하는 관리자 키이며, 브라우저에 노출되는 순간 counseling_records /
 *    period_stats / chat_sessions 등 테이블의 RLS 정책(= 전체 차단)이
 *    무의미해집니다.
 *
 * app/api/** /route.ts 안에서만 사용하세요.
 */

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error(
    'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경변수가 없습니다. .env.local을 확인하세요.'
  );
}

export const supabaseServer = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
});
