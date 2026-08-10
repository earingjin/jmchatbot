'use client';

import { useEffect, useState } from 'react';
import type { Notice } from '@/lib/notices';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function loadNotices() {
    setLoading(true);
    fetch('/api/notices')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setNotices(Array.isArray(data) ? data : []))
      .catch(() => setNotices([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadNotices();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해 주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });

      if (!res.ok) {
        setError('등록에 실패했습니다.');
        return;
      }

      setTitle('');
      setContent('');
      loadNotices();
    } catch (submitError) {
      console.error('Notice creation failed:', submitError);
      setError('등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="cns-page">
      <div className="page-head">
        <div>
          <div className="eyebrow">공지사항 관리</div>
          <h1>공지 등록</h1>
          <p className="page-sub">사용자 페이지(/notice)에 노출되는 공지를 작성합니다.</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>제목</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="공지 제목" />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>내용</label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="공지 내용을 입력하세요."
            />
          </div>
          {error && <p className="auth-error" style={{ marginTop: 16, marginBottom: 0 }}>{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn-brass" disabled={submitting}>
              {submitting ? '등록 중...' : '등록'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="panel-title">등록된 공지</div>
        {loading && <p style={{ color: 'var(--ink-soft)' }}>불러오는 중...</p>}
        {!loading && notices.length === 0 && (
          <p style={{ color: 'var(--ink-soft)' }}>등록된 공지사항이 없습니다.</p>
        )}
        {!loading && notices.length > 0 && (
          <table className="counselor-table">
            <thead>
              <tr>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => (
                <tr key={notice.id}>
                  <td>{notice.title}</td>
                  <td>{notice.author_name}</td>
                  <td className="num">{formatDate(notice.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
