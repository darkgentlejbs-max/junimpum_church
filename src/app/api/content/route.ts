import { NextResponse } from 'next/server';

export const maxDuration = 60;
import { getCurrentUser, isMasterRole } from '@/lib/auth';
import {
  findMemberByEmail,
  uploadFileToNotion,
  createSermon,
  createNewsItem,
  createScheduleItem,
  createDalDalItem,
  createBulletinItem,
  createGalleryItem,
  updateSermon,
  updateNewsItem,
  updateScheduleItem,
  updateDalDalItem,
  updateBulletinItem,
  updateGalleryItem,
  deleteContentPage,
  deleteGalleryPhotos,
} from '@/lib/notion';

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
        { error: '담임목사님 또는 사모님만 작성하실 수 있습니다.' },
        { status: 403 }
      );
    }

    const contentType = request.headers.get('content-type') || '';
    let payload: Record<string, any> = {};
    let uploadedFile: { fileUploadId: string; fileName: string } | null = null;
    const uploadedFiles: Array<{ fileUploadId: string; fileName: string }> = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        if ((key === 'file' || key === 'files') && value instanceof File && value.size > 0) {
          const up = await uploadFileToNotion(value);
          uploadedFiles.push(up);
          if (!uploadedFile) uploadedFile = up;
        } else if (typeof value === 'string') {
          payload[key] = value;
        }
      }
    } else {
      payload = await request.json();
    }

    const { menuType } = payload;

    if (menuType === 'sermon') {
      const item = await createSermon({
        title: payload.title || '',
        passage: payload.passage || '',
        preacher: payload.preacher || '담임목사',
        date: payload.date || '',
        videoUrl: payload.videoUrl || '',
      });
      return NextResponse.json({ item });
    }

    if (menuType === 'news') {
      const item = await createNewsItem({
        title: payload.title || '',
        type: payload.type || '공지',
        content: payload.content || '',
        date: payload.date || '',
      });
      return NextResponse.json({ item });
    }

    if (menuType === 'schedule') {
      const item = await createScheduleItem({
        title: payload.title || '',
        type: payload.type || '행사',
        location: payload.location || '',
        content: payload.content || '',
        date: payload.date || '',
      });
      return NextResponse.json({ item });
    }

    if (menuType === 'daldal') {
      const item = await createDalDalItem({
        title: payload.title || '',
        date: payload.date || '',
        imageUrl: payload.imageUrl || '',
        fileUploadId: uploadedFile?.fileUploadId,
        fileName: uploadedFile?.fileName,
      });
      return NextResponse.json({ item });
    }

    if (menuType === 'bulletin') {
      const item = await createBulletinItem({
        title: payload.title || '',
        date: payload.date || '',
        fileUrl: payload.fileUrl || '',
        fileUploadId: uploadedFile?.fileUploadId,
        fileName: uploadedFile?.fileName,
      });
      return NextResponse.json({ item });
    }

    if (menuType === 'gallery') {
      const item = await createGalleryItem({
        title: payload.title || '',
        date: payload.date || '',
        imageUrl: payload.imageUrl || '',
        fileUploadId: uploadedFile?.fileUploadId,
        fileName: uploadedFile?.fileName,
        uploadedFiles:
          uploadedFiles.length > 0
            ? uploadedFiles
            : Array.isArray(payload.uploadedFiles)
            ? payload.uploadedFiles
            : undefined,
      });
      return NextResponse.json({ item });
    }

    return NextResponse.json({ error: '지원하지 않는 메뉴 유형입니다.' }, { status: 400 });
  } catch (error: any) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: error?.message || '게시글 등록 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const allowed = await verifyMasterAccess();
    if (!allowed) {
      return NextResponse.json(
        { error: '담임목사님 또는 사모님만 수정하실 수 있습니다.' },
        { status: 403 }
      );
    }

    const contentType = request.headers.get('content-type') || '';
    let payload: Record<string, any> = {};
    let uploadedFile: { fileUploadId: string; fileName: string } | null = null;
    const uploadedFiles: Array<{ fileUploadId: string; fileName: string }> = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        if ((key === 'file' || key === 'files') && value instanceof File && value.size > 0) {
          const up = await uploadFileToNotion(value);
          uploadedFiles.push(up);
          if (!uploadedFile) uploadedFile = up;
        } else if (typeof value === 'string') {
          payload[key] = value;
        }
      }
    } else {
      payload = await request.json();
    }

    const { menuType, id } = payload;
    if (!id) {
      return NextResponse.json({ error: '수정할 ID가 필요합니다.' }, { status: 400 });
    }

    if (menuType === 'sermon') {
      await updateSermon({
        id,
        title: payload.title || '',
        passage: payload.passage || '',
        preacher: payload.preacher || '담임목사',
        date: payload.date || '',
        videoUrl: payload.videoUrl || '',
      });
      return NextResponse.json({ ok: true });
    }

    if (menuType === 'news') {
      await updateNewsItem({
        id,
        title: payload.title || '',
        type: payload.type || '공지',
        content: payload.content || '',
        date: payload.date || '',
      });
      return NextResponse.json({ ok: true });
    }

    if (menuType === 'schedule') {
      await updateScheduleItem({
        id,
        title: payload.title || '',
        type: payload.type || '행사',
        location: payload.location || '',
        content: payload.content || '',
        date: payload.date || '',
      });
      return NextResponse.json({ ok: true });
    }

    if (menuType === 'daldal') {
      await updateDalDalItem({
        id,
        title: payload.title || '',
        date: payload.date || '',
        imageUrl: payload.imageUrl || '',
        fileUploadId: uploadedFile?.fileUploadId,
        fileName: uploadedFile?.fileName,
      });
      return NextResponse.json({ ok: true });
    }

    if (menuType === 'bulletin') {
      await updateBulletinItem({
        id,
        title: payload.title || '',
        date: payload.date || '',
        fileUrl: payload.fileUrl || '',
        fileUploadId: uploadedFile?.fileUploadId,
        fileName: uploadedFile?.fileName,
      });
      return NextResponse.json({ ok: true });
    }

    if (menuType === 'gallery') {
      await updateGalleryItem({
        id,
        title: payload.title || '',
        date: payload.date || '',
        imageUrl: payload.imageUrl || '',
        fileUploadId: uploadedFile?.fileUploadId,
        fileName: uploadedFile?.fileName,
        uploadedFiles:
          uploadedFiles.length > 0
            ? uploadedFiles
            : Array.isArray(payload.uploadedFiles)
            ? payload.uploadedFiles
            : undefined,
        keptPhotoIndices: Array.isArray(payload.keptPhotoIndices)
          ? payload.keptPhotoIndices
          : undefined,
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: '지원하지 않는 메뉴 유형입니다.' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: error?.message || '게시글 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const allowed = await verifyMasterAccess();
    if (!allowed) {
      return NextResponse.json(
        { error: '담임목사님 또는 사모님만 삭제하실 수 있습니다.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, ids, photoIds, pageId, deleteFullPage } = body;

    if (photoIds || ids || (id && id.includes('-prop-'))) {
      const targetIds = photoIds || ids || [id];
      await deleteGalleryPhotos({ photoIds: targetIds, pageId, deleteFullPage });
      return NextResponse.json({ ok: true });
    }

    const targetPageId = pageId || id;
    if (!targetPageId) {
      return NextResponse.json({ error: '삭제할 ID가 필요합니다.' }, { status: 400 });
    }

    await deleteContentPage(targetPageId);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: error?.message || '삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
