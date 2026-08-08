'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin/dashboard');
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  }

  return (
    <main>
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>관리자 로그인</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #ddd', fontSize: 14 }}
        />
        {error && <p style={{ color: '#dc2626', fontSize: 13, margin: 0 }}>{error}</p>}
        <button
          type="submit"
          style={{
            padding: '12px 14px',
            borderRadius: 10,
            border: 'none',
            background: '#2563eb',
            color: '#fff',
            fontWeight: 600,
          }}
        >
          로그인
        </button>
      </form>
    </main>
  );
}
