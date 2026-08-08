import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import type { CategoryKey, TopicKey } from '@/config/constants';

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
 * database directly. MVP ships with a file-backed JSON implementation
 * (below) — swap it for a real Postgres/Supabase-backed Store when this
 * app gets a production database and needs to run on multiple instances,
 * using the same `chat_sessions`/`chat_messages` column names documented
 * in the README.
 */
export interface Store {
  createSession(): Promise<ChatSession>;
  getSession(id: string): Promise<ChatSession | null>;
  updateSession(id: string, patch: Partial<ChatSession>): Promise<ChatSession | null>;
  addMessage(sessionId: string, role: 'user' | 'assistant', content: string): Promise<ChatMessage>;
  getMessages(sessionId: string, limit?: number): Promise<ChatMessage[]>;
  getStats(range: StatsRange): Promise<DashboardStats>;
}

interface RawData {
  sessions: Record<string, ChatSession>;
  messages: Record<string, ChatMessage[]>;
  idCounter: number;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// A plain module-level Map does NOT reliably work here: Next.js compiles
// each app/api/**/route.ts into its own bundle, and in practice each bundle
// got its own copy of this module's state — /api/chat/rate and
// /api/admin/stats never saw sessions created by /api/chat. Persisting to
// a JSON file on disk sidesteps that bundling boundary entirely. Fine for
// a single-instance MVP; a multi-instance deployment needs a real DB.
function load(): RawData {
  if (!existsSync(DATA_FILE)) return { sessions: {}, messages: {}, idCounter: 0 };
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return { sessions: {}, messages: {}, idCounter: 0 };
  }
}

function save(data: RawData): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(data), 'utf-8');
}

function nextId(data: RawData): string {
  data.idCounter += 1;
  return `${Date.now()}-${data.idCounter}`;
}

class FileStore implements Store {
  async createSession(): Promise<ChatSession> {
    const data = load();
    const session: ChatSession = {
      id: nextId(data),
      startedAt: new Date().toISOString(),
      endedAt: null,
      category: null,
      topic: null,
      turnCount: 0,
      consecutiveFailCount: 0,
      resolved: null,
      escalated: false,
      rating: null,
    };
    data.sessions[session.id] = session;
    data.messages[session.id] = [];
    save(data);
    return session;
  }

  async getSession(id: string): Promise<ChatSession | null> {
    return load().sessions[id] ?? null;
  }

  async updateSession(id: string, patch: Partial<ChatSession>): Promise<ChatSession | null> {
    const data = load();
    const existing = data.sessions[id];
    if (!existing) return null;
    const updated = { ...existing, ...patch };
    data.sessions[id] = updated;
    save(data);
    return updated;
  }

  async addMessage(sessionId: string, role: 'user' | 'assistant', content: string): Promise<ChatMessage> {
    const data = load();
    const message: ChatMessage = {
      id: nextId(data),
      sessionId,
      role,
      content,
      createdAt: new Date().toISOString(),
    };
    if (!data.messages[sessionId]) data.messages[sessionId] = [];
    data.messages[sessionId].push(message);
    save(data);
    return message;
  }

  async getMessages(sessionId: string, limit = 20): Promise<ChatMessage[]> {
    const list = load().messages[sessionId] ?? [];
    return list.slice(-limit);
  }

  async getStats(range: StatsRange): Promise<DashboardStats> {
    const data = load();
    const sessions = Object.values(data.sessions).filter((s) => {
      const started = new Date(s.startedAt);
      return started >= range.from && started <= range.to;
    });

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

export const store: Store = new FileStore();
