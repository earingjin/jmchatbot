import { ESCALATION_MESSAGE } from '@/config/constants';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMClient {
  send(messages: LLMMessage[]): Promise<string>;
}

class AnthropicLLMClient implements LLMClient {
  constructor(
    private apiKey: string,
    private model: string,
  ) {}

  async send(messages: LLMMessage[]): Promise<string> {
    const system = messages.find((m) => m.role === 'system')?.content ?? '';
    const rest = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role, content: m.content }));

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 500,
        system,
        messages: rest,
      }),
    });

    if (!res.ok) {
      throw new Error(`Anthropic API error ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    return data.content?.[0]?.text ?? '';
  }
}

function withState(text: string, state: { category: string | null; topic: string | null; outcome: string }) {
  return `${text}\n<!--STATE:${JSON.stringify(state)}-->`;
}

const NEGATIVE_WORDS = ['안 됨', '안됨', '안돼', '안 돼', '그대로', '여전히', '아니요'];
const POSITIVE_WORDS = ['해결됨', '해결됐', '됐어요', '됩니다'];

function isNegative(text: string): boolean {
  return NEGATIVE_WORDS.some((w) => text.includes(w));
}
function isPositive(text: string): boolean {
  return POSITIVE_WORDS.some((w) => text.includes(w));
}

/**
 * Scripted stand-in for a real LLM so the app runs end-to-end without an
 * API key. It only plays out one representative branch of the
 * troubleshooting tree (검사 링크 → 화면이 하얗게 나와요) — enough to
 * exercise the full pipeline (classify → diagnose → retry → server-forced
 * escalation). Real branching intelligence comes from SYSTEM_PROMPT via a
 * real provider (see AnthropicLLMClient) once one is chosen.
 */
class MockLLMClient implements LLMClient {
  async send(messages: LLMMessage[]): Promise<string> {
    const userTurns = messages.filter((m) => m.role === 'user');
    const lastUser = userTurns[userTurns.length - 1]?.content.trim() ?? '';
    const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant')?.content ?? '';

    if (isPositive(lastUser)) {
      return withState('도움이 되었다니 다행입니다. 다른 문의가 있으면 말씀해주세요.', {
        category: null,
        topic: null,
        outcome: 'success',
      });
    }

    if (isNegative(lastUser)) {
      if (lastAssistant.includes('새로고침')) {
        return withState(
          '다른 브라우저(Chrome/Safari)로 다시 열어보시겠어요?\n[해결됨] / [안 됨]',
          { category: 'link', topic: 'link_blank_screen', outcome: 'fail' },
        );
      }
      return withState(ESCALATION_MESSAGE, { category: null, topic: null, outcome: 'fail' });
    }

    if (lastUser.includes('검사 링크') || lastUser.includes('로그인')) {
      return withState(
        '링크를 눌렀을 때 어떻게 되나요?\n[화면이 하얗게 나와요] / [만료됐다고 나와요] / [아무 반응이 없어요]',
        { category: 'link', topic: null, outcome: 'neutral' },
      );
    }

    if (lastUser.includes('하얗게')) {
      return withState('브라우저를 새로고침(F5) 해보시겠어요?\n[해결됨] / [안 됨]', {
        category: 'link',
        topic: 'link_blank_screen',
        outcome: 'neutral',
      });
    }

    return withState(
      '이 상담은 버크만 검사 관련 문의만 도와드릴 수 있습니다. 검사 관련해서 어떤 부분이 궁금하신가요?\n[검사 방법] / [검사 링크/로그인] / [검사 진행 오류] / [결과 확인]',
      { category: null, topic: null, outcome: 'neutral' },
    );
  }
}

export function createLLMClient(): LLMClient {
  const provider = process.env.LLM_PROVIDER ?? 'mock';

  if (provider === 'anthropic') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const model = process.env.ANTHROPIC_MODEL;
    if (!apiKey || !model) {
      throw new Error('LLM_PROVIDER=anthropic requires ANTHROPIC_API_KEY and ANTHROPIC_MODEL to be set.');
    }
    return new AnthropicLLMClient(apiKey, model);
  }

  return new MockLLMClient();
}
