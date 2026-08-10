import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { deleteDocument, getDocument, replaceDocument } from '@/lib/knowledge/documentStore';
import { extractDocumentChunks, validateDocumentUpload } from '@/lib/knowledge/documentParser';

export const runtime = 'nodejs';

interface Context { params: Promise<{ documentId: string }> }

async function isAdmin() {
  const session = await getSession();
  return session?.role === 'admin';
}

export async function GET(_request: Request, context: Context) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { documentId } = await context.params;
  const document = getDocument(documentId);
  return document
    ? NextResponse.json({ document })
    : NextResponse.json({ error: 'not found' }, { status: 404 });
}

export async function PUT(request: Request, context: Context) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const { documentId } = await context.params;
    if (!getDocument(documentId)) return NextResponse.json({ error: 'not found' }, { status: 404 });
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: '파일을 선택해주세요.' }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());
    validateDocumentUpload(file.name, file.type, buffer);
    const chunks = await extractDocumentChunks(documentId, file.name, file.type, buffer);
    const document = replaceDocument(documentId, file.name, file.type, buffer, chunks);
    return NextResponse.json({ document });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : '교체에 실패했습니다.' }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { documentId } = await context.params;
  return deleteDocument(documentId)
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: 'not found' }, { status: 404 });
}

