import { DocumentManager } from '@/components/admin/DocumentManager';

/**
 * 인증/역할 검사는 app/(admin)/layout.tsx가 담당한다 (admin이 아니면 /records로 리다이렉트).
 */
export default function AdminDocumentsPage() {
  return (
    <div className="cns-page">
      <div className="admin-page-heading">
        <div><span>KNOWLEDGE SOURCE</span><h1>AI 참고자료 관리</h1><p>등록된 모든 자료가 문서 검색 대상에 누적됩니다.</p></div>
      </div>
      <DocumentManager />
    </div>
  );
}
