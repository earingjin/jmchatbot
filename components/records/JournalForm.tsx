'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CounselingRecord } from '@/lib/records';
import { BRANCH_OPTIONS, COUNSELING_METHODS, CONTENT_MAX_LENGTH, CONTENT_HARD_LIMIT } from '@/config/constants';

export function JournalForm({ recordId }: { recordId: number | null }) {
  const isNew = recordId === null;
  const [record, setRecord] = useState<CounselingRecord | null>(null);
  const [content, setContent] = useState('');
  const [branch, setBranch] = useState<string>(BRANCH_OPTIONS[0]);

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/records/${recordId}`)
      .then((r) => r.json())
      .then((data: CounselingRecord) => {
        setRecord(data);
        setContent(data.content ?? '');
        setBranch(data.branch);
      });
  }, [recordId, isNew]);

  return (
    <div className="cns-page" style={{ maxWidth: 760 }}>
      <Link href="/records" className="back-link">← 목록으로</Link>
      <div className="page-head">
        <div>
          <div className="eyebrow">{isNew ? '상담일지 작성' : '상담일지 상세'}</div>
          <h1>{isNew ? '새 상담일지' : `상담일지 #${String(recordId).padStart(3, '0')}`}</h1>
          <p className="page-sub">주요 진행내용은 200자 이내로, 인사이트는 3줄로 간결하게 남겨주세요.</p>
        </div>
      </div>

      <div className="privacy-note">
        <span>🔒</span>
        <div><b>개인정보 최소화 원칙</b> — 상담자의 실명은 기록하지 않습니다. 전화번호 뒷자리로만 식별하세요.</div>
      </div>

      <div className="card">
        <div className="card-title"><span className="idx">1</span> 기본 정보</div>
        <p className="card-title-sub">상담 일시와 대상자 식별 정보를 입력합니다.</p>
        <div className="grid-4">
          <div className="field">
            <label>상담날짜</label>
            <input key={`d-${record?.id ?? 'new'}`} type="date" defaultValue={record?.record_date} />
          </div>
          <div className="field">
            <label>진행시간</label>
            <input type="time" />
          </div>
          <div className="field">
            <label>전화번호 뒷자리</label>
            <input key={`p-${record?.id ?? 'new'}`} type="text" maxLength={4} placeholder="0000" defaultValue={record?.phone_last4} />
          </div>
          <div className="field">
            <label>상담형태</label>
            <select key={`m-${record?.id ?? 'new'}`} defaultValue={record?.method}>
              {COUNSELING_METHODS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title"><span className="idx">2</span> 소속 및 계급</div>
        <p className="card-title-sub">군별 통계 산출에 사용되는 최소 식별 정보입니다.</p>
        <div className="field">
          <label>소속</label>
          <div className="chip-select">
            {BRANCH_OPTIONS.map((b) => (
              <div key={b} className={`chip-opt ${branch === b ? 'sel' : ''}`} onClick={() => setBranch(b)}>{b}</div>
            ))}
          </div>
        </div>
        <div className="field" style={{ maxWidth: 220, marginBottom: 0 }}>
          <label>계급</label>
          <input key={`r-${record?.id ?? 'new'}`} type="text" placeholder="예: 중사, 대위, 원사" defaultValue={record?.rank} />
        </div>
      </div>

      <div className="card">
        <div className="card-title"><span className="idx">3</span> 상담 내용</div>
        <p className="card-title-sub">호소주제와 진행내용을 간결하게 기록합니다.</p>
        <div className="field">
          <label>주요 호소주제</label>
          <input key={`t-${record?.id ?? 'new'}`} type="text" placeholder="예: 전직 후 진로 방향 혼란" defaultValue={record?.topic} />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>주요 진행내용 <span style={{ color: 'var(--ink-faint)', fontWeight: 400 }}>· 200자 이내</span></label>
          <div className="textarea-wrap">
            <textarea
              rows={4}
              maxLength={CONTENT_HARD_LIMIT}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="상담에서 다룬 핵심 내용을 요약해주세요."
            />
            <span className={`char-count ${content.length > CONTENT_MAX_LENGTH ? 'over' : ''}`}>
              {content.length} / {CONTENT_MAX_LENGTH}
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title"><span className="idx">4</span> 상담 인사이트</div>
        <p className="card-title-sub">다음 상담에 참고할 핵심을 3줄로 요약합니다.</p>
        {[0, 1, 2].map((i) => (
          <div className="insight-line" key={i}>
            <div className="n">{i + 1}</div>
            <input
              key={`i-${record?.id ?? 'new'}-${i}`}
              type="text"
              placeholder={`핵심 인사이트 ${i + 1}`}
              defaultValue={record?.insights?.[i] ?? ''}
            />
          </div>
        ))}
      </div>

      <div className="form-actions">
        <Link href="/records" className="btn btn-outline">취소</Link>
        <Link href="/records" className="btn btn-outline">임시저장</Link>
        <Link href="/records" className="btn btn-primary">저장 완료</Link>
      </div>
    </div>
  );
}
