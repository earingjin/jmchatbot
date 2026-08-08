import { NextResponse } from 'next/server';
import { adminToken, verifyAdminPassword } from '@/lib/adminAuth';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!verifyAdminPassword(body?.password)) {
    return NextResponse.json({ error: 'invalid password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_session', adminToken(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}
