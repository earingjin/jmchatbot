import { supabaseServer } from './supabase/server';

export interface Notice {
  id: number;
  title: string;
  content: string;
  author_name: string;
  created_at: string;
}

export async function getAllNotices(): Promise<Notice[]> {
  const { data, error } = await supabaseServer
    .from('notices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Notice[];
}

export async function getNoticeById(id: number): Promise<Notice | null> {
  const { data, error } = await supabaseServer
    .from('notices')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as Notice | null;
}

export interface NewNoticeInput {
  title: string;
  content: string;
  author_name: string;
}

export async function createNotice(input: NewNoticeInput): Promise<Notice> {
  const { data, error } = await supabaseServer
    .from('notices')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as Notice;
}
