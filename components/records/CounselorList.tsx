'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CounselingRecord } from '@/lib/records';
import { RecordRow } from './RecordRow';

export function CounselorList() {
  const router = useRouter();
  const [records, setRecords] = useState<CounselingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/records')
      .then((r) => r.json())
      .then(setRecords)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="cns-page">
      <div className="page-head">
        <div>
          <div className="eyebrow">내 상담일지</div>
          <h1>등록한 상담 목록</h1>
          <p className="page-sub">내가 입력한 상담만 표시됩니다. 클릭하면 상세 일지를 확인·수정할 수 있습니다.</p>
        </div>
        <Link href="/records/new" className="btn btn-brass">＋ 새 상담 등록</Link>
      </div>

      <div className="list-toolbar">
        <div className="search-box">
          <span>⌕</span>
          <input type="text" placeholder="주제 또는 전화번호 뒷자리로 검색 (데모에서는 검색되지 않습니다)" />
        </div>
        <div style={{ display: 'flex', gap: 8, fontSize: 12.5, color: 'var(--ink-soft)' }}>
          <span>총 <b className="num" style={{ color: 'var(--ink)' }}>{records.length}</b>건</span>
        </div>
      </div>

      <div className="record-list">
        <div className="record-row head">
          <div>상담일자</div><div>전화번호</div><div>주요 호소주제</div>
          <div>소속/계급</div><div>형태</div><div>상태</div>
        </div>
        {loading && <div style={{ padding: 24, color: 'var(--ink-soft)' }}>불러오는 중...</div>}
        {!loading && records.map((r) => (
          <RecordRow key={r.id} record={r} onClick={() => router.push(`/records/${r.id}`)} />
        ))}
      </div>
    </div>
  );
}
