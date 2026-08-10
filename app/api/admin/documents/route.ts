import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createDocumentId, listDocuments, saveNewDocument } from '@/lib/knowledge/documentStore';
import { extractDocumentChunks, validateDocumentUpload } from '@/lib/knowledge/documentParser';

export const runtime = 'nodejs';

async function isAdmin() {
  const session = await getSession();
  return session?.role === 'admin';
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return NextResponse.json({ documents: listDocuments() });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: '파일을 선택해주세요.' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    validateDocumentUpload(file.name, file.type, buffer);
    const documentId = createDocumentId();
    const chunks = await extractDocumentChunks(documentId, file.name, file.type, buffer);
    const document = saveNewDocument(documentId, file.name, file.type, buffer, chunks);
    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : '업로드에 실패했습니다.' }, { status: 400 });
  }
}

