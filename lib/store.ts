import type { CategoryKey, TopicKey } from '@/config/constants';
import { supabaseServer } from '@/lib/supabase/server';

export interface ChatSession {
  id: string;
  startedAt: string;
  endedAt: string | null;
  category: CategoryKey | null;
  topic: TopicKey | null;
  turnCount: number;
  consecutiveFailCount: number;
  resolved: boolean | null;
  escalated: boolean;
  rating: number | null;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface StatsRange {
  from: Date;
  to: Date;
}

export interface DashboardStats {
  totalSessions: number;
  categoryCounts: Record<string, number>;
  resolvedCount: number;
  escalatedCount: number;
  endedCount: number;
  avgResolutionSeconds: number | null;
  topTopics: { topic: string; count: number }[];
  avgRating: number | null;
}

/**
 * Storage abstraction so the rest of the app never talks to a concrete
 * database directly. Backed by Supabase (chat_sessions/chat_messages,
 * see supabase/schema.sql) — see INTEGRATION_BRIEF.md 3-3.
 */
export interface Store {
  createSession(): Promise<ChatSession>;
  getSession(id: string): Promise<ChatSession | null>;
  updateSession(id: string, patch: Partial<ChatSession>): Promise<ChatSession | null>;
  addMessage(sessionId: string, role: 'user' | 'assistant', content: string): Promise<ChatMessage>;
  getMessages(sessionId: string, limit?: number): Promise<ChatMessage[]>;
  getStats(range: StatsRange): Promise<DashboardStats>;
}

interface ChatSessionRow {
  id: string;
  started_at: string;
  ended_at: string | null;
  category: string | null;
  topic: string | null;
  turn_count: number;
  consecutive_fail_count: number;
  resolved: boolean | null;
  escalated: boolean;
  rating: number | null;
}

interface ChatMessageRow {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

function rowToSession(row: ChatSessionRow): ChatSession {
  return {
    id: row.id,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    category: (row.category as CategoryKey | null) ?? null,
    topic: (row.topic as TopicKey | null) ?? null,
    turnCount: row.turn_count,
    consecutiveFailCount: row.consecutive_fail_count,
    resolved: row.resolved,
    escalated: row.escalated,
    rating: row.rating,
  };
}

function rowToMessage(row: ChatMessageRow): ChatMessage {
  return {
    id: row.id,
    sessionId: row.session_id,
    role: row.role,
    content: row.content,
    createdAt: row.created_at,
  };
}

function patchToRow(patch: Partial<ChatSession>): Partial<ChatSessionRow> {
  const row: Partial<ChatSessionRow> = {};
  if ('startedAt' in patch) row.started_at = patch.startedAt;
  if ('endedAt' in patch) row.ended_at = patch.endedAt;
  if ('category' in patch) row.category = patch.category;
  if ('topic' in patch) row.topic = patch.topic;
  if ('turnCount' in patch) row.turn_count = patch.turnCount;
  if ('consecutiveFailCount' in patch) row.consecutive_fail_count = patch.consecutiveFailCount;
  if ('resolved' in patch) row.resolved = patch.resolved;
  if ('escalated' in patch) row.escalated = patch.escalated;
  if ('rating' in patch) row.rating = patch.rating;
  return row;
}

class SupabaseStore implements Store {
  async createSession(): Promise<ChatSession> {
    const row: ChatSessionRow = {
      id: crypto.randomUUID(),
      started_at: new Date().toISOString(),
      ended_at: null,
      category: null,
      topic: null,
      turn_count: 0,
      consecutive_fail_count: 0,
      resolved: null,
      escalated: false,
      rating: null,
    };

    const { data, error } = await supabaseServer.from('chat_sessions').insert(row).select().single();
    if (error) throw error;
    return rowToSession(data as ChatSessionRow);
  }

  async getSession(id: string): Promise<ChatSession | null> {
    const { data, error } = await supabaseServer.from('chat_sessions').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? rowToSession(data as ChatSessionRow) : null;
  }

  async updateSession(id: string, patch: Partial<ChatSession>): Promise<ChatSession | null> {
    const { data, error } = await supabaseServer
      .from('chat_sessions')
      .update(patchToRow(patch))
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data ? rowToSession(data as ChatSessionRow) : null;
  }

  async addMessage(sessionId: string, role: 'user' | 'assistant', content: string): Promise<ChatMessage> {
    const row: Omit<ChatMessageRow, 'created_at'> = {
      id: crypto.randomUUID(),
      session_id: sessionId,
      role,
      content,
    };

    const { data, error } = await supabaseServer.from('chat_messages').insert(row).select().single();
    if (error) throw error;
    return rowToMessage(data as ChatMessageRow);
  }

  async getMessages(sessionId: string, limit = 20): Promise<ChatMessage[]> {
    const { data, error } = await supabaseServer
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data as ChatMessageRow[]).map(rowToMessage).reverse();
  }

  async getStats(range: StatsRange): Promise<DashboardStats> {
    const { data, error } = await supabaseServer
      .from('chat_sessions')
      .select('*')
      .gte('started_at', range.from.toISOString())
      .lte('started_at', range.to.toISOString());
    if (error) throw error;

    const sessions = (data as ChatSessionRow[]).map(rowToSession);

    const categoryCounts: Record<string, number> = {};
    const topicCounts: Record<string, number> = {};
    let resolvedCount = 0;
    let escalatedCount = 0;
    let endedCount = 0;
    let resolutionSecondsTotal = 0;
    let resolutionSecondsSamples = 0;
    let ratingTotal = 0;
    let ratingSamples = 0;

    for (const s of sessions) {
      if (s.category) categoryCounts[s.category] = (categoryCounts[s.category] ?? 0) + 1;
      if (s.topic) topicCounts[s.topic] = (topicCounts[s.topic] ?? 0) + 1;
      if (s.endedAt) endedCount += 1;
      if (s.resolved) resolvedCount += 1;
      if (s.escalated) escalatedCount += 1;
      if (s.resolved && s.endedAt) {
        resolutionSecondsTotal += (new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()) / 1000;
        resolutionSecondsSamples += 1;
      }
      if (typeof s.rating === 'number') {
        ratingTotal += s.rating;
        ratingSamples += 1;
      }
    }

    const topTopics = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalSessions: sessions.length,
      categoryCounts,
      resolvedCount,
      escalatedCount,
      endedCount,
      avgResolutionSeconds: resolutionSecondsSamples ? resolutionSecondsTotal / resolutionSecondsSamples : null,
      topTopics,
      avgRating: ratingSamples ? ratingTotal / ratingSamples : null,
    };
  }
}

export const store: Store = new SupabaseStore();
