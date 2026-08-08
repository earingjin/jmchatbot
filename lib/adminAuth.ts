import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

/**
 * MVP-level admin gate: a single shared password (env var) hashed into a
 * session token. No per-admin accounts, no expiry beyond the cookie's
 * maxAge. Fine for an internal single-admin dashboard; replace with real
 * auth (e.g. Supabase Auth, matching jmcounseling's pattern) before this
 * carries sensitive data or multiple admins.
 */
export function adminToken(): string {
  const secret = process.env.ADMIN_PASSWORD ?? '';
  return createHash('sha256').update(secret).digest('hex');
}

export function isValidAdminToken(token: string | undefined): boolean {
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  const expected = Buffer.from(adminToken());
  const received = Buffer.from(token);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

// DEMO ONLY
// 운영환경에서는 관리자 계정 인증 및 환경변수 기반 비밀번호 관리로 교체
export function verifyAdminPassword(password: unknown): boolean {
  if (typeof password !== 'string' || !process.env.ADMIN_PASSWORD) return false;
  const expected = Buffer.from(process.env.ADMIN_PASSWORD);
  const received = Buffer.from(password);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidAdminToken(cookieStore.get('admin_session')?.value);
}
