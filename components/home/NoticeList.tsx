'use client';

import { useEffect, useState } from 'react';
import type { Notice } from '@/lib/notices';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function NoticeList() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notices')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setNotices(Array.isArray(data) ? data : []))
      .catch(() => setNotices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="landing-page notice-page">
      <div className="notice-head">
        <span className="section-eyebrow">NOTICE</span>
        <h1>공지사항</h1>
        <p>서비스 이용에 참고할 안내와 소식을 전해드립니다.</p>
      </div>

      {loading && <p className="notice-empty">불러오는 중...</p>}

      {!loading && notices.length === 0 && (
        <p className="notice-empty">등록된 공지사항이 없습니다.</p>
      )}

      {!loading && notices.length > 0 && (
        <div className="notice-list">
          {notices.map((notice) => (
            <details className="notice-item" key={notice.id}>
              <summary>
                <span>{notice.title}</span>
                <span className="notice-meta">
                  {notice.author_name} · {formatDate(notice.created_at)}
                </span>
              </summary>
              <div className="notice-content">{notice.content}</div>
            </details>
          ))}
        </div>
      )}
    </main>
  );
}
