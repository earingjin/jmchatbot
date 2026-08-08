'use client';

import { useState, type FormEvent } from 'react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      // HttpOnly 인증 쿠키가 포함된 새 서버 요청으로 이동해
      // 인증 전 App Router 캐시가 재사용되지 않게 한다.
      window.location.assign('/admin/dashboard');
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <span className="admin-login-icon" aria-hidden="true">
          <svg viewBox="0 0 40 40"><rect x="9" y="18" width="22" height="16" rx="5"/><path d="M14 18v-4a6 6 0 0 1 12 0v4"/><circle cx="20" cy="26" r="2"/></svg>
        </span>
        <div className="admin-login-heading">
          <span>ADMIN ACCESS</span>
          <h1>관리자 로그인</h1>
          <p>자료 관리와 상담 현황을 확인하려면 비밀번호를 입력해 주세요.</p>
        </div>
      <form onSubmit={handleSubmit} className="admin-login-form">
        <label htmlFor="admin-password">비밀번호</label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해 주세요"
          autoComplete="current-password"
        />
        {error && <p className="admin-login-error" role="alert">{error}</p>}
        <button
          type="submit"
        >
          로그인 <span aria-hidden="true">→</span>
        </button>
      </form>
      </section>
    </main>
  );
}
