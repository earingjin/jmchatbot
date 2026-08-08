'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ManagedDocument } from '@/lib/knowledge/types';

export function DocumentManager() {
  const [documents, setDocuments] = useState<ManagedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState<ManagedDocument | null>(null);

  const loadDocuments = useCallback(async () => {
    const response = await fetch('/api/admin/documents');
    const data = await response.json();
    setDocuments(data.documents ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { loadDocuments(); }, [loadDocuments]);

  async function sendFile(file: File, documentId?: string) {
    setBusy(true); setMessage('');
    const body = new FormData(); body.append('file', file);
    const response = await fetch(documentId ? `/api/admin/documents/${documentId}` : '/api/admin/documents', {
      method: documentId ? 'PUT' : 'POST', body,
    });
    const data = await response.json();
    setMessage(response.ok ? (documentId ? '자료를 교체했습니다.' : '자료를 등록했습니다.') : data.error ?? '처리에 실패했습니다.');
    if (response.ok) { setSelected(null); await loadDocuments(); }
    setBusy(false);
  }

  async function remove(document: ManagedDocument) {
    if (!window.confirm(`“${document.originalName}” 자료를 삭제할까요?`)) return;
    setBusy(true); setMessage('');
    const response = await fetch(`/api/admin/documents/${document.id}`, { method: 'DELETE' });
    setMessage(response.ok ? '자료를 삭제했습니다.' : '삭제에 실패했습니다.');
    if (response.ok) { setSelected(null); await loadDocuments(); }
    setBusy(false);
  }

  return (
    <div className="document-manager">
      <form className="document-upload" onSubmit={(event) => {
        event.preventDefault();
        const input = event.currentTarget.elements.namedItem('file') as HTMLInputElement;
        if (input.files?.[0]) sendFile(input.files[0]).then(() => { input.value = ''; });
      }}>
        <div><strong>새 자료 등록</strong><p>PDF, TXT, Markdown · 최대 10MB</p></div>
        <input name="file" type="file" accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown" required />
        <button type="submit" disabled={busy}>업로드</button>
      </form>

      {message && <p className="document-message">{message}</p>}
      {loading ? <p>불러오는 중...</p> : documents.length === 0 ? (
        <div className="document-empty">등록된 자료가 없습니다. 현재 채팅은 데모 FAQ를 사용합니다.</div>
      ) : (
        <div className="document-list">
          {documents.map((document) => (
            <article className="document-row" key={document.id}>
              <button className="document-info" onClick={() => setSelected(selected?.id === document.id ? null : document)}>
                <strong>{document.originalName}</strong>
                <span>{formatBytes(document.size)} · {new Date(document.updatedAt).toLocaleString('ko-KR')}</span>
              </button>
              <span className="document-status">{document.status === 'ready' ? '사용 중' : '오류'}</span>
              <label className="document-action">
                교체
                <input type="file" hidden accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown" disabled={busy}
                  onChange={(event) => event.target.files?.[0] && sendFile(event.target.files[0], document.id)} />
              </label>
              <button className="document-delete" disabled={busy} onClick={() => remove(document)}>삭제</button>
              {selected?.id === document.id && (
                <div className="document-detail">
                  <span>문서 ID: {document.id}</span><span>형식: {document.mimeType}</span>
                  <span>검색 조각: {document.chunkCount}개</span><span>최초 등록: {new Date(document.uploadedAt).toLocaleString('ko-KR')}</span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

