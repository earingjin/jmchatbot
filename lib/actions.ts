'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from './auth';

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/');
}
