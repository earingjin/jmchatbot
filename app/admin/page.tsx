import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export default async function AdminPage() {
  redirect((await isAdminAuthenticated()) ? '/admin/dashboard' : '/admin/login');
}

