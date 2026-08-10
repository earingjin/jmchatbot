'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Seal } from './layout/Seal';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { toLoginEmail } from '@/lib/supabase/loginEmail';

type ScreenRole = 'counselor' | 'admin' | 'defense';

const ROLE_CONFIG: Record<
  ScreenRole,
  { title: string; sub: string; destination: string; expectedRole: string; mismatchMessage: string }
> = {
  counselor: {
    title: '상담사 로그인',
    sub: '내가 등록한 상담일지 목록을 조회하고 새 상담을 기록합니다.',
    destination: '/records',
    expectedRole: 'counselor',
    mismatchMessage: '이 계정은 상담사 계정이 아닙니다.',
  },
  admin: {
    title: '관리자 로그인',
    sub: '전체 상담·챗봇 이용 현황을 확인하고 상담사 계정을 관리합니다.',
    destination: '/admin/dashboard',
    expectedRole: 'admin',
    mismatchMessage: '이 계정은 관리자 계정이 아닙니다.',
  },
  defense: {
    title: '국방전직교육원 담당자 로그인',
    sub: '개별 상담 기록을 열람합니다 (읽기 전용).',
    destination: '/records',
    expectedRole: 'defense_education',
    mismatchMessage: '이 계정은 국방전직교육원 담당자 계정이 아닙니다.',
  },
};

export function LoginScreen({ role }: { role: ScreenRole }) {
  const router = useRouter();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const config = ROLE_CONFIG[role];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: toLoginEmail(id.trim()),
        password,
      });

      if (signInError || !data.user) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        return;
      }

      if (data.user.app_metadata?.role !== config.expectedRole) {
        await supabase.auth.signOut();
        setError(config.mismatchMessage);
        return;
      }

      router.push(config.destination);
      router.refresh();
    } catch (loginError) {
      console.error('Login failed:', loginError);
      setError('로그인 서버 설정을 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <Link href="/" className="back-link">← 처음으로</Link>
        <div className="auth-seal">
          <Seal color="#9C7A3E" />
        </div>
        <h2>{config.title}</h2>
        <p className="auth-sub">{config.sub}</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>아이디</label>
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} autoComplete="username" required />
          </div>
          <div className="field">
            <label>비밀번호</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>
        <div className="auth-foot">
          <a href="#" onClick={(e) => e.preventDefault()}>비밀번호를 잊으셨나요?</a>
          <Link href="/login">다른 유형으로 로그인</Link>
        </div>
      </div>
    </div>
  );
}
