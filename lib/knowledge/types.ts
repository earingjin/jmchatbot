export type DocumentStatus = 'ready' | 'failed';

export interface ManagedDocument {
  id: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  updatedAt: string;
  status: DocumentStatus;
  chunkCount: number;
  error: string | null;
}

export interface KnowledgeChunk {
  chunkId: string;
  documentId: string;
  documentName: string;
  page: number | null;
  section: string | null;
  content: string;
}

export interface KnowledgeContextItem extends KnowledgeChunk {
  sourceType: 'document' | 'faq';
  score: number;
}

export interface AnswerSource {
  documentId: string;
  documentName: string;
  page: number | null;
  section: string | null;
  chunkId: string;
  sourceType: 'document' | 'faq';
}

