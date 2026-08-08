import { NextResponse } from 'next/server';
import { ESCALATION_MESSAGE } from '@/config/constants';
import { createLLMClient, type LLMMessage } from '@/lib/llm/client';
import { maskPII } from '@/lib/pii';
import { extractButtons, parseStateTag } from '@/lib/stateTag';
import { store } from '@/lib/store';
import { SYSTEM_PROMPT } from '@/lib/systemPrompt';

const MAX_MESSAGE_LENGTH = 300;

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
  const messages: LLMMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role, content: m.content }) as LLMMessage),
  ];

  const llm = createLLMClient();
  const raw = await llm.send(messages);
  const { visibleText, state } = parseStateTag(raw);

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
    escalated: false,
    session: updated,
  });
}
