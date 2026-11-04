import { NextResponse } from 'next/server';
import { getCurrentUser, isMasterRole } from '@/lib/auth';
import { findMemberByEmail, uploadFileToNotion } from '@/lib/notion';

export const maxDuration = 60;

async function verifyMasterAccess(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  if (isMasterRole(user.role)) return true;

  try {
    const liveMember = await findMemberByEmail(user.email);
    if (liveMember && isMasterRole(liveMember.role)) {
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

export async function POST(request: Request) {
  try {
    const allowed = await verifyMasterAccess();
    if (!allowed) {
      return NextResponse.json(
        { error: '담임목사님 또는 사모님만 업로드하실 수 있습니다.' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: '업로드할 파일이 없습니다.' },
        { status: 400 }
      );
    }

    const uploaded = await uploadFileToNotion(file);

    return NextResponse.json({
      ok: true,
      fileUploadId: uploaded.fileUploadId,
      fileName: uploaded.fileName,
    });
  } catch (error: any) {
    console.error('Error in /api/content/upload:', error);
    return NextResponse.json(
      { error: error?.message || '사진 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
