import { supabaseServer } from './supabase/server';

export type Period = 'week' | 'month';

export interface PeriodStats {
  period: Period;
  reserved: number;
  progressed: number;
  burkman_done: number;
  burkman_pending: number;
  reserved_delta: string;
  progressed_delta: string;
  burkman_done_delta: string;
  burkman_pending_delta: string;
  chart1_title: string;
  chart2_title: string;
  period_label: string;
  bars: { label: string; reserved: number; progressed: number }[];
  donut_pct: number;
}

export async function getPeriodStats(period: Period): Promise<PeriodStats> {
  const { data, error } = await supabaseServer
    .from('period_stats')
    .select('*')
    .eq('period', period)
    .single();

  if (error) throw error;
  return data as PeriodStats;
}
