'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Seal } from './layout/Seal';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { toLoginEmail } from '@/lib/supabase/loginEmail';

export function LoginScreen({ role }: { role: 'counselor' | 'admin' }) {
  const router = useRouter();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const title = role === 'counselor' ? '상담사 로그인' : '교육담당자 로그인';
  const sub =
    role === 'counselor'
      ? '등록된 아이디와 비밀번호로 접속합니다.'
      : '관리자 권한으로 전체 상담 현황을 조회합니다.';
  const destination = role === 'counselor' ? '/records' : '/admin/dashboard';
  const otherRole = role === 'counselor' ? '/login/admin' : '/login/counselor';

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

      // defense_education 계정은 /login/admin으로 로그인하되 /admin/*이 아니라
      // /records로만 보낸다 (열람 전용, 대시보드는 admin만).
      const userRole = data.user.app_metadata?.role;
      if (role === 'counselor' && userRole !== 'counselor') {
        await supabase.auth.signOut();
        setError('이 계정은 상담사 계정이 아닙니다.');
        return;
      }
      if (role === 'admin' && userRole !== 'admin' && userRole !== 'defense_education') {
        await supabase.auth.signOut();
        setError('이 계정은 관리자 계정이 아닙니다.');
        return;
      }

      router.push(userRole === 'defense_education' ? '/records' : destination);
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
        <h2>{title}</h2>
        <p className="auth-sub">{sub}</p>
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
          <Link href={otherRole}>
            {role === 'counselor' ? '관리자이신가요?' : '상담사이신가요?'}
          </Link>
        </div>
      </div>
    </div>
  );
}
