import { createHash } from 'crypto';

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
  return token === adminToken();
}
