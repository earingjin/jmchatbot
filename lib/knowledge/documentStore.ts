import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { KnowledgeChunk, ManagedDocument } from '@/lib/knowledge/types';

const ROOT = path.join(process.cwd(), '.data', 'documents');
const FILES_DIR = path.join(ROOT, 'files');
const EXTRACTED_DIR = path.join(ROOT, 'extracted');
const METADATA_FILE = path.join(ROOT, 'metadata.json');

function ensureDirectories(): void {
  mkdirSync(FILES_DIR, { recursive: true });
  mkdirSync(EXTRACTED_DIR, { recursive: true });
}

function loadMetadata(): ManagedDocument[] {
  if (!existsSync(METADATA_FILE)) return [];
  try { return JSON.parse(readFileSync(METADATA_FILE, 'utf8')); } catch { return []; }
}

function saveMetadata(documents: ManagedDocument[]): void {
  ensureDirectories();
  const temporary = `${METADATA_FILE}.tmp`;
  writeFileSync(temporary, JSON.stringify(documents, null, 2), 'utf8');
  renameSync(temporary, METADATA_FILE);
}

function safeStoredPath(storedName: string): string {
  if (path.basename(storedName) !== storedName) throw new Error('Invalid stored file name.');
  return path.join(FILES_DIR, storedName);
}

function extractedPath(documentId: string): string {
  return path.join(EXTRACTED_DIR, `${documentId}.json`);
}

export function createDocumentId(): string {
  return randomUUID();
}

export function listDocuments(): ManagedDocument[] {
  return loadMetadata().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getDocument(documentId: string): ManagedDocument | null {
  return loadMetadata().find((document) => document.id === documentId) ?? null;
}

export function getAllDocumentChunks(): KnowledgeChunk[] {
  return loadMetadata().filter((document) => document.status === 'ready').flatMap((document) => {
    const file = extractedPath(document.id);
    if (!existsSync(file)) return [];
    try { return JSON.parse(readFileSync(file, 'utf8')); } catch { return []; }
  });
}

export function saveNewDocument(
  documentId: string,
  originalName: string,
  mimeType: string,
  buffer: Buffer,
  chunks: KnowledgeChunk[],
): ManagedDocument {
  ensureDirectories();
  const extension = path.extname(originalName).toLowerCase();
  const storedName = `${randomUUID()}${extension}`;
  const now = new Date().toISOString();
  const document: ManagedDocument = {
    id: documentId, originalName, storedName, mimeType, size: buffer.length,
    uploadedAt: now, updatedAt: now, status: 'ready', chunkCount: chunks.length, error: null,
  };

  writeFileSync(safeStoredPath(storedName), buffer);
  writeFileSync(extractedPath(documentId), JSON.stringify(chunks, null, 2), 'utf8');
  saveMetadata([...loadMetadata(), document]);
  return document;
}

export function replaceDocument(
  documentId: string,
  originalName: string,
  mimeType: string,
  buffer: Buffer,
  chunks: KnowledgeChunk[],
): ManagedDocument {
  const documents = loadMetadata();
  const index = documents.findIndex((document) => document.id === documentId);
  if (index < 0) throw new Error('문서를 찾을 수 없습니다.');
  ensureDirectories();

  const previous = documents[index];
  const newStoredName = `${randomUUID()}${path.extname(originalName).toLowerCase()}`;
  writeFileSync(safeStoredPath(newStoredName), buffer);
  const extractedTemporary = `${extractedPath(documentId)}.tmp`;
  writeFileSync(extractedTemporary, JSON.stringify(chunks, null, 2), 'utf8');
  renameSync(extractedTemporary, extractedPath(documentId));

  const updated: ManagedDocument = {
    ...previous, originalName, storedName: newStoredName, mimeType, size: buffer.length,
    updatedAt: new Date().toISOString(), status: 'ready', chunkCount: chunks.length, error: null,
  };
  documents[index] = updated;
  saveMetadata(documents);

  const previousPath = safeStoredPath(previous.storedName);
  if (existsSync(previousPath)) unlinkSync(previousPath);
  return updated;
}

export function deleteDocument(documentId: string): boolean {
  const documents = loadMetadata();
  const document = documents.find((item) => item.id === documentId);
  if (!document) return false;

  // 검색 대상 metadata를 먼저 제거해 삭제 중인 자료가 답변에 사용되지 않게 한다.
  saveMetadata(documents.filter((item) => item.id !== documentId));
  const original = safeStoredPath(document.storedName);
  const extracted = extractedPath(documentId);
  if (existsSync(original)) unlinkSync(original);
  if (existsSync(extracted)) unlinkSync(extracted);
  return true;
}

