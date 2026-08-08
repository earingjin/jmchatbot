import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DocumentManager } from '@/components/admin/DocumentManager';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export default async function AdminDocumentsPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');
  return (
    <main className="admin-documents-page">
      <div className="admin-page-heading">
        <div><span>KNOWLEDGE SOURCE</span><h1>AI 참고자료 관리</h1><p>등록된 모든 자료가 문서 검색 대상에 누적됩니다.</p></div>
        <Link href="/admin/dashboard">대시보드로 이동</Link>
      </div>
      <DocumentManager />
    </main>
  );
}
