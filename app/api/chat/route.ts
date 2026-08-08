import { NextResponse } from 'next/server';
import { ESCALATION_MESSAGE } from '@/config/constants';
import { createLLMClient, type LLMMessage } from '@/lib/llm/client';
import { retrieveKnowledge } from '@/lib/knowledge/knowledgeSearch';
import { maskPII } from '@/lib/pii';
import { extractButtons, parseStateTag } from '@/lib/stateTag';
import { store } from '@/lib/store';
import { buildSystemPrompt } from '@/lib/systemPrompt';

const MAX_MESSAGE_LENGTH = 300;
const INTERNAL_INSTRUCTION_PATTERN =
  /sentence\s*limit|brackets?\s*constraint|system\s*prompt|출력\s*형식\s*규칙|내부\s*지침/i;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.message !== 'string' || !body.message.trim()) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }
  if (body.message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: `message must be ${MAX_MESSAGE_LENGTH} characters or fewer` }, { status: 400 });
  }

  const session = body.sessionId ? await store.getSession(body.sessionId) : null;
  const activeSession = session ?? (await store.createSession());
  const userMessage = maskPII(body.message.trim());

  await store.addMessage(activeSession.id, 'user', userMessage);

  // 2차 방어선: 같은 topic에서 2회 연속 실패했으면 LLM을 호출하지 않고
  // 서버가 직접 종료 문구로 강제 종료한다. 프롬프트 지시만으로는
  // 모델이 3번째 조치를 계속 시도할 수 있어 이 체크가 반드시 필요하다.
  if (activeSession.consecutiveFailCount >= 2) {
    await store.addMessage(activeSession.id, 'assistant', ESCALATION_MESSAGE);
    const updated = await store.updateSession(activeSession.id, {
      turnCount: activeSession.turnCount + 1,
      resolved: false,
      escalated: true,
      endedAt: new Date().toISOString(),
    });
    return NextResponse.json({
      sessionId: activeSession.id,
      reply: ESCALATION_MESSAGE,
      buttons: [],
      escalated: true,
      session: updated,
    });
  }

  const history = await store.getMessages(activeSession.id, 20);
  const knowledge = retrieveKnowledge(userMessage);
  const messages: LLMMessage[] = [
    { role: 'system', content: buildSystemPrompt(knowledge.items) },
    ...history.map((m) => ({ role: m.role, content: m.content }) as LLMMessage),
  ];

  let raw: string;
  try {
    const llm = createLLMClient();
    raw = await llm.send(messages);
  } catch (error) {
    console.error('Chat LLM request failed:', error);
    return NextResponse.json(
      {
        error: 'LLM_REQUEST_FAILED',
        reply: '지금은 답변 연결이 잠시 원활하지 않네요. 잠시 후 다시 말씀해 주세요.',
      },
      { status: 502 },
    );
  }
  const { visibleText, state } = parseStateTag(raw);

  if (!visibleText || INTERNAL_INSTRUCTION_PATTERN.test(visibleText)) {
    console.error('Chat LLM returned an invalid or instruction-leaking response.');
    return NextResponse.json(
      {
        error: 'INVALID_LLM_RESPONSE',
        reply: '답변이 잠시 매끄럽지 않았네요. 불편한 상황을 한 번만 다시 말씀해 주시겠어요?',
      },
      { status: 502 },
    );
  }

  const topicChanged = Boolean(state.topic && state.topic !== activeSession.topic);
  let consecutiveFailCount = topicChanged ? 0 : activeSession.consecutiveFailCount;
  if (state.outcome === 'fail') consecutiveFailCount += 1;
  if (state.outcome === 'success') consecutiveFailCount = 0;

  const resolved = state.outcome === 'success' ? true : activeSession.resolved;
  const endedAt = state.outcome === 'success' ? new Date().toISOString() : activeSession.endedAt;

  const updated = await store.updateSession(activeSession.id, {
    category: state.category ?? activeSession.category,
    topic: state.topic ?? activeSession.topic,
    turnCount: activeSession.turnCount + 1,
    consecutiveFailCount,
    resolved,
    endedAt,
  });

  await store.addMessage(activeSession.id, 'assistant', visibleText);

  return NextResponse.json({
    sessionId: activeSession.id,
    reply: visibleText,
    buttons: extractButtons(visibleText),
    sources: knowledge.sources,
    escalated: false,
    session: updated,
  });
}
