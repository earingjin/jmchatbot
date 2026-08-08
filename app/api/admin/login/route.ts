import { NextResponse } from 'next/server';
import { adminToken } from '@/lib/adminAuth';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!process.env.ADMIN_PASSWORD || !body?.password || body.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'invalid password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_session', adminToken(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return res;
}
