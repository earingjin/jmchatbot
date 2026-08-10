import { redirect } from 'next/navigation';

/**
 * app/(admin)/layout.tsx가 세션/역할 검사를 담당하므로, 여기서는 단순히
 * 대시보드로 보낸다 (비로그인/권한없음 처리는 레이아웃이 리다이렉트한다).
 */
export default function AdminPage() {
  redirect('/admin/dashboard');
}
