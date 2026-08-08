import { FAQ_ENTRIES } from '@/lib/faqData';
import { getAllDocumentChunks } from '@/lib/knowledge/documentStore';
import type { AnswerSource, KnowledgeChunk, KnowledgeContextItem } from '@/lib/knowledge/types';

const PHRASE_NORMALIZATIONS: Array<[RegExp, string]> = [
  [/(이메일|전자우편|초대\s*메일)/g, '메일'],
  [/(안\s*왔어요|안\s*왔어|안\s*옴|못\s*받음|못\s*받았어요|미수신|없습니다|없어요)/g, '미수신'],
  [/(접속\s*주소|url|주소)/g, '링크'],
  [/(안\s*열려요|안\s*열림|접속\s*불가|접속이?\s*안\s*돼요)/g, '열리지 않음'],
  [/(휴대폰|스마트폰|핸드폰|모바일폰)/g, '모바일'],
  [/(컴퓨터|노트북|데스크톱)/g, 'pc'],
  [/(멈췄어요|먹통|굳었어요|정지됨)/g, '화면 멈춤'],
  [/(에러|오류문구)/g, '오류'],
];

const PARTICLES = /(은|는|이|가|을|를|에|에서|으로|로|와|과|도|만|요)$/;

export function normalizeKoreanText(value: string): string {
  let normalized = value.toLowerCase().normalize('NFKC');
  for (const [pattern, replacement] of PHRASE_NORMALIZATIONS) normalized = normalized.replace(pattern, replacement);
  return normalized.replace(/[^0-9a-z가-힣\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function tokens(value: string): string[] {
  return [...new Set(normalizeKoreanText(value).split(' ')
    .map((token) => token.replace(PARTICLES, ''))
    .filter((token) => token.length >= 2))];
}

function scoreText(query: string, text: string): number {
  const normalizedQuery = normalizeKoreanText(query);
  const normalizedText = normalizeKoreanText(text);
  if (!normalizedQuery || !normalizedText) return 0;
  let score = normalizedText.includes(normalizedQuery) ? 12 : 0;
  for (const token of tokens(normalizedQuery)) {
    if (normalizedText.includes(token)) score += token.length >= 4 ? 4 : 2;
  }
  return score;
}

function rankChunks(query: string, chunks: KnowledgeChunk[]): KnowledgeContextItem[] {
  const ranked = chunks.map((chunk) => ({
    ...chunk,
    sourceType: 'document' as const,
    score: scoreText(query, `${chunk.documentName} ${chunk.section ?? ''} ${chunk.content}`),
  })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score);

  const perDocument = new Map<string, number>();
  return ranked.filter((item) => {
    const count = perDocument.get(item.documentId) ?? 0;
    if (count >= 3) return false;
    perDocument.set(item.documentId, count + 1);
    return true;
  }).slice(0, 8);
}

function searchFaq(query: string): KnowledgeContextItem[] {
  return FAQ_ENTRIES.map((faq) => {
    const searchable = [faq.intent, faq.representativeQuestion, ...faq.similarExpressions, faq.answer].join(' ');
    return {
      chunkId: `faq:${faq.id}`, documentId: `faq:${faq.id}`, documentName: '데모 FAQ',
      page: null, section: faq.representativeQuestion, content: faq.answer,
      sourceType: 'faq' as const, score: scoreText(query, searchable),
    };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
}

export function retrieveKnowledge(query: string): { items: KnowledgeContextItem[]; sources: AnswerSource[] } {
  const documentResults = rankChunks(query, getAllDocumentChunks());
  const hasSufficientDocumentEvidence = (documentResults[0]?.score ?? 0) >= 4;
  let items = hasSufficientDocumentEvidence ? documentResults : [];

  const faqFallbackEnabled = process.env.FAQ_FALLBACK_ENABLED !== 'false';
  if (!items.length && faqFallbackEnabled) items = searchFaq(query);

  // 문서 근거가 있으면 FAQ를 절대 혼합하지 않는다. 문서가 항상 우선한다.
  const sources = deduplicateSources(items.map((item) => ({
    documentId: item.documentId, documentName: item.documentName, page: item.page,
    section: item.section, chunkId: item.chunkId, sourceType: item.sourceType,
  })));
  return { items, sources };
}

function deduplicateSources(sources: AnswerSource[]): AnswerSource[] {
  const seen = new Set<string>();
  return sources.filter((source) => {
    const key = `${source.documentId}:${source.page ?? ''}:${source.section ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

