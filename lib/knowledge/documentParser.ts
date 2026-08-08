import type { KnowledgeChunk } from '@/lib/knowledge/types';

// pdf-parse의 패키지 진입점은 번들 시 샘플 PDF를 읽으므로 서버용 구현 파일을 직접 사용한다.
const pdf: typeof import('pdf-parse') = require('pdf-parse/lib/pdf-parse.js');

export const ACCEPTED_DOCUMENT_TYPES = [
  'application/pdf',
  'text/plain',
  'text/markdown',
] as const;

export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;

interface ParsedPage {
  page: number | null;
  text: string;
}

export function validateDocumentUpload(name: string, mimeType: string, buffer: Buffer): void {
  const extension = name.toLowerCase().split('.').pop();
  const allowedExtension = extension === 'pdf' || extension === 'txt' || extension === 'md';
  const allowedMime = ACCEPTED_DOCUMENT_TYPES.includes(mimeType as (typeof ACCEPTED_DOCUMENT_TYPES)[number]);

  if (!allowedExtension || !allowedMime) throw new Error('PDF, TXT, Markdown 파일만 업로드할 수 있습니다.');
  if (!buffer.length) throw new Error('빈 파일은 업로드할 수 없습니다.');
  if (buffer.length > MAX_DOCUMENT_SIZE) throw new Error('파일 크기는 10MB 이하여야 합니다.');
  if (extension === 'pdf' && buffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
    throw new Error('올바른 PDF 파일이 아닙니다.');
  }
}

export async function extractDocumentChunks(
  documentId: string,
  documentName: string,
  mimeType: string,
  buffer: Buffer,
): Promise<KnowledgeChunk[]> {
  let pages: ParsedPage[];

  if (mimeType === 'application/pdf') {
    const extractedPages: ParsedPage[] = [];
    await pdf(buffer, {
      pagerender: async (pageData: any) => {
        const textContent = await pageData.getTextContent();
        const text = textContent.items.map((item: { str?: string }) => item.str ?? '').join(' ');
        extractedPages.push({ page: extractedPages.length + 1, text });
        return text;
      },
    } as any);
    pages = extractedPages;
  } else {
    pages = [{ page: null, text: buffer.toString('utf8') }];
  }

  const chunks: KnowledgeChunk[] = [];
  for (const parsedPage of pages) {
    const normalized = parsedPage.text.replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim();
    if (!normalized) continue;

    const sections = splitIntoSections(normalized);
    for (const section of sections) {
      for (const content of splitText(section.content, 900, 120)) {
        chunks.push({
          chunkId: `${documentId}:chunk-${chunks.length + 1}`,
          documentId,
          documentName,
          page: parsedPage.page,
          section: section.title,
          content,
        });
      }
    }
  }

  if (!chunks.length) throw new Error('문서에서 검색 가능한 텍스트를 추출하지 못했습니다.');
  return chunks;
}

function splitIntoSections(text: string): Array<{ title: string | null; content: string }> {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const sections: Array<{ title: string | null; content: string }> = [];
  let title: string | null = null;
  let body: string[] = [];

  const flush = () => {
    if (body.length) sections.push({ title, content: body.join('\n') });
    body = [];
  };

  for (const line of lines) {
    const looksLikeHeading = line.length <= 60 && (/^#{1,6}\s/.test(line) || /^\d+[.)]\s/.test(line));
    if (looksLikeHeading) {
      flush();
      title = line.replace(/^#{1,6}\s*/, '').trim();
    } else {
      body.push(line);
    }
  }
  flush();
  return sections.length ? sections : [{ title: null, content: text }];
}

function splitText(text: string, maxLength: number, overlap: number): string[] {
  if (text.length <= maxLength) return [text];
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + maxLength, text.length);
    if (end < text.length) {
      const boundary = Math.max(text.lastIndexOf('\n', end), text.lastIndexOf('. ', end));
      if (boundary > start + maxLength / 2) end = boundary + 1;
    }
    chunks.push(text.slice(start, end).trim());
    if (end >= text.length) break;
    start = Math.max(end - overlap, start + 1);
  }
  return chunks.filter(Boolean);
}
