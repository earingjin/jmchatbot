import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isValidAdminToken } from '@/lib/adminAuth';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!isValidAdminToken(token)) {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
