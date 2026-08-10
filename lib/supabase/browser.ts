import { createBrowserClient } from '@supabase/ssr';

/**
 * 브라우저(로그인 화면)에서만 사용하는 Supabase 클라이언트.
 * anon 키를 쓰므로 RLS가 그대로 적용되고, 세션 쿠키만 다룬다.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Supabase public environment variables are not configured.');
  }

  return createBrowserClient(
    url,
    anonKey
  );
}
