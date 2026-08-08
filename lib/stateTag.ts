import type { CategoryKey, TopicKey } from '@/config/constants';

export type ChatOutcome = 'success' | 'fail' | 'neutral';

export interface ParsedState {
  category: CategoryKey | null;
  topic: TopicKey | null;
  outcome: ChatOutcome;
}

const STATE_TAG_RE = /<!--STATE:(\{[\s\S]*?\})-->\s*$/;

/**
 * Splits a raw LLM reply into the user-visible text and the trailing
 * hidden <!--STATE:{...}--> tag. Falls back to outcome "neutral" with no
 * category/topic if the model didn't emit a well-formed tag — the caller
 * (the API route) treats that as "state unchanged" rather than failing.
 */
export function parseStateTag(raw: string): { visibleText: string; state: ParsedState } {
  const match = raw.match(STATE_TAG_RE);
  const fallback: ParsedState = { category: null, topic: null, outcome: 'neutral' };

  if (!match) {
    return { visibleText: raw.trim(), state: fallback };
  }

  const visibleText = raw.slice(0, match.index).trim();

  try {
    const parsed = JSON.parse(match[1]);
    return {
      visibleText,
      state: {
        category: parsed.category ?? null,
        topic: parsed.topic ?? null,
        outcome: parsed.outcome === 'success' || parsed.outcome === 'fail' ? parsed.outcome : 'neutral',
      },
    };
  } catch {
    return { visibleText, state: fallback };
  }
}

/** Extracts "[선택지]" style button labels from visible bot text. */
export function extractButtons(visibleText: string): string[] {
  const matches = visibleText.match(/\[([^\]]+)\]/g) ?? [];
  return matches.map((m) => m.slice(1, -1));
}

/** Removes "[선택지]" tokens (and the lines left empty by removing them) for display, since buttons render separately as chips. */
export function stripButtons(visibleText: string): string {
  return visibleText
    .split('\n')
    .map((line) => line.replace(/\s*\[[^\]]+\]\s*(\/\s*)?/g, '').trim())
    .filter((line) => line.length > 0)
    .join('\n');
}
