import { Client } from '@notionhq/client';

export const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

export const SERMONS_DATABASE_ID = process.env.NOTION_SERMONS_DB_ID || '';
export const NEWS_DATABASE_ID = process.env.NOTION_NEWS_DB_ID || '';
export const GALLERY_DATABASE_ID = process.env.NOTION_GALLERY_DB_ID || '';
export const BULLETIN_DATABASE_ID = process.env.NOTION_BULLETIN_DB_ID || '3ee243467c5a80d4b7d4e832bd6f3322';
export const DALDAL_DATABASE_ID = process.env.NOTION_DALDAL_DB_ID || '3f0243467c5a80ff824eff221d7e7919';
export const SCHEDULE_DATABASE_ID = process.env.NOTION_SCHEDULE_DB_ID || '3e3243467c5a8059af31dd5aad35473b';

export async function getSchedule() {
  if (!SCHEDULE_DATABASE_ID) {
    return [
      { id: 'dummy-1', title: '가을 부흥사경회', date: '2026-10-20', location: '본관 2층 대예배실', type: '집회' },
      { id: 'dummy-2', title: '여전도회 헌신예배', date: '2026-10-27', location: '본관 2층 대예배실', type: '예배' },
      { id: 'dummy-3', title: '추수감사주일 및 성찬식', date: '2026-11-15', location: '본관 2층 대예배실', type: '예배' },
      { id: 'dummy-4', title: '교회학교 겨울성경학교', date: '2026-12-10', location: '본관 1층', type: '행사' },
    ];
  }
  
  try {
    const response = await (notion.databases as any).query({
      database_id: SCHEDULE_DATABASE_ID,
      sorts: [{ property: '날짜', direction: 'ascending' }],
    });
    
    return response.results.map((page: any) => {
      const titleProp = page.properties['이름']?.title?.[0]?.plain_text || page.properties['행사명']?.title?.[0]?.plain_text || '일정 없음';
      const dateProp = page.properties['날짜']?.date?.start || '날짜 미정';
      const typeProp = page.properties['분류']?.select?.name || '일반';
      const locationProp = page.properties['장소']?.rich_text?.[0]?.plain_text || page.properties['장소']?.select?.name || '';
      
      return {
        id: page.id,
        title: titleProp,
        date: dateProp,
        type: typeProp,
        location: locationProp,
        content: page.properties['텍스트']?.rich_text?.[0]?.plain_text || '',
      };
    });
  } catch (error) {
    console.error('Error fetching schedule from Notion:', error);
    return [];
  }
}

export async function getSermons() {
  if (!SERMONS_DATABASE_ID) return [];
  try {
    const response = await (notion.databases as any).query({
      database_id: SERMONS_DATABASE_ID,
      sorts: [{ property: '날짜', direction: 'descending' }],
    });
    return response.results.map((page: any) => {
      // 제목 찾기: '설교 제목'(텍스트), '이름'(타이틀), '말씀 게시판'(타이틀) 중 있는 것 사용
      const titleProp = page.properties['설교 제목']?.rich_text?.[0]?.plain_text 
                     || page.properties['이름']?.title?.[0]?.plain_text 
                     || page.properties['말씀 게시판']?.title?.[0]?.plain_text 
                     || '제목 없음';

      return {
        id: page.id,
        title: titleProp,
        date: page.properties['날짜']?.date?.start || '날짜 없음',
        preacher: page.properties['설교자']?.select?.name || page.properties['설교자']?.rich_text?.[0]?.plain_text || '설교자 없음',
        passage: page.properties['성경구절']?.rich_text?.[0]?.plain_text || '',
        videoUrl:
          page.properties['영상링크']?.url ||
          page.properties['영상링크']?.rich_text?.[0]?.plain_text ||
          page.properties['링크']?.url ||
          page.properties['링크']?.rich_text?.[0]?.plain_text ||
          '',
      };
    });
  } catch (error) {
    console.error('Error fetching sermons from Notion:', error);
    return [];
  }
}

export async function getNews() {
  if (!NEWS_DATABASE_ID) return [];
  try {
    const response = await (notion.databases as any).query({
      database_id: NEWS_DATABASE_ID,
      sorts: [{ property: '날짜', direction: 'descending' }],
    });
    return response.results.map((page: any) => {
      // 제목(Title): 노션의 기본 '이름(Aa)' 속성 또는 '제목' 텍스트
      const titleProp = page.properties['이름']?.title?.[0]?.plain_text 
                     || page.properties['제목']?.title?.[0]?.plain_text
                     || page.properties['새소식 게시판']?.title?.[0]?.plain_text 
                     || page.properties['제목']?.rich_text?.[0]?.plain_text
                     || '제목 없음';

      // 분류(Select): 짧은 태그 (공지, 모임 등)
      let typeVal = page.properties['분류']?.select?.name || '공지';
      
      // 내용(Text): 추가적인 세부 설명
      const contentVal = page.properties['내용']?.rich_text?.[0]?.plain_text 
                      || page.properties['텍스트']?.rich_text?.[0]?.plain_text 
                      || '';

      return {
        id: page.id,
        title: titleProp,
        date: page.properties['날짜']?.date?.start || '날짜 없음',
        type: typeVal,
        content: contentVal,
      };
    });
  } catch (error) {
    console.error('Error fetching news from Notion:', error);
    return [];
  }
}

export async function getGallery() {
  if (!GALLERY_DATABASE_ID) return [];
  try {
    const response = await (notion.databases as any).query({
      database_id: GALLERY_DATABASE_ID,
      sorts: [{ property: '날짜', direction: 'descending' }],
    });
    
    const allPhotos: any[] = [];
    
    await Promise.all(response.results.map(async (page: any) => {
      const titleProp = page.properties['이름']?.title?.[0]?.plain_text || '제목 없음';
      const dateVal = page.properties['날짜']?.date?.start || '날짜 없음';
      let imageIndex = 0;

      // 1. '사진' 속성(칸)에 들어있는 이미지들 가져오기
      const files = page.properties['사진']?.files || [];
      files.forEach((fileProp: any) => {
        const imageUrl = fileProp?.file?.url || fileProp?.external?.url || '';
        if (imageUrl) {
          allPhotos.push({
            id: `${page.id}-prop-${imageIndex++}`,
            title: titleProp,
            date: dateVal,
            imageUrl: imageUrl,
          });
        }
      });

      // 2. 노션 페이지 '본문'에 드래그해서 넣은 이미지 블록들 가져오기
      try {
        const blocksResponse = await (notion.blocks.children as any).list({
          block_id: page.id,
        });
        blocksResponse.results.forEach((block: any) => {
          if (block.type === 'image') {
            const imageUrl = block.image?.file?.url || block.image?.external?.url || '';
            if (imageUrl) {
              allPhotos.push({
                id: `${block.id}`,
                title: titleProp,
                date: dateVal,
                imageUrl: imageUrl,
              });
            }
          }
        });
      } catch (blockErr) {
        console.error('Error fetching blocks for page:', page.id, blockErr);
      }
    }));
    
    // 날짜 최신순으로 다시 정렬 (Promise.all 비동기 처리로 인해 순서가 섞일 수 있음)
    allPhotos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return allPhotos;
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return [];
  }
}

export async function getBulletins() {
  if (!BULLETIN_DATABASE_ID) {
    return [
      { id: 'dummy-1', title: '2026년 10월 4일 주보', date: '2026-10-04', fileUrl: '#' },
      { id: 'dummy-2', title: '2026년 9월 27일 주보', date: '2026-09-27', fileUrl: '#' },
    ];
  }

  try {
    const response = await notion.databases.query({
      database_id: BULLETIN_DATABASE_ID,
      sorts: [
        {
          property: '날짜',
          direction: 'descending',
        },
      ],
    });

    return response.results.map((page: any) => {
      let fileUrl = '#';
      const fileProp = page.properties['파일'];
      if (fileProp && fileProp.files && fileProp.files.length > 0) {
        const fileObj = fileProp.files[0];
        fileUrl = fileObj.file ? fileObj.file.url : (fileObj.external ? fileObj.external.url : '#');
      }

      return {
        id: page.id,
        title: page.properties['이름']?.title[0]?.plain_text || '제목 없음',
        date: page.properties['날짜']?.date?.start || '날짜 없음',
        fileUrl: fileUrl,
      };
    });
  } catch (error) {
    console.error('Error fetching bulletins:', error);
    return [];
  }
}

export async function getDalDal() {
  if (!DALDAL_DATABASE_ID) return [];

  try {
    const response = await notion.databases.query({
      database_id: DALDAL_DATABASE_ID,
      sorts: [
        {
          property: '날짜',
          direction: 'descending',
        },
      ],
    });

    return response.results.map((page: any) => {
      let imageUrl = '';
      const fileProp = page.properties['이미지'];
      if (fileProp && fileProp.files && fileProp.files.length > 0) {
        const fileObj = fileProp.files[0];
        imageUrl = fileObj.file ? fileObj.file.url : (fileObj.external ? fileObj.external.url : '');
      }

      return {
        id: page.id,
        title: page.properties['이름']?.title[0]?.plain_text || '제목 없음',
        date: page.properties['날짜']?.date?.start || '날짜 없음',
        imageUrl: imageUrl,
      };
    });
  } catch (error) {
    console.error('Error fetching DalDal from Notion:', error);
    return [];
  }
}

export const MEMBERS_DATABASE_ID = process.env.NOTION_MEMBERS_DB_ID || '';
let cachedMembersDbId = MEMBERS_DATABASE_ID;
let schemaVerified = false;

async function ensureMembersSchema(databaseId: string) {
  if (schemaVerified) return;
  try {
    const db: any = await notion.databases.retrieve({ database_id: databaseId });
    const props = db.properties || {};
    const updates: Record<string, any> = {};

    if (!props['아이디']) {
      updates['아이디'] = { rich_text: {} };
    }
    if (!props['이메일']) {
      updates['이메일'] = { rich_text: {} };
    }
    if (!props['비밀번호']) {
      updates['비밀번호'] = { rich_text: {} };
    }
    if (!props['연락처']) {
      updates['연락처'] = { rich_text: {} };
    }
    if (!props['직분']) {
      updates['직분'] = {
        select: {
          options: [
            { name: '성도', color: 'default' },
            { name: '새가족', color: 'green' },
            { name: '집사', color: 'blue' },
            { name: '권사', color: 'purple' },
            { name: '장로', color: 'orange' },
            { name: '담임목사', color: 'yellow' },
            { name: '사모', color: 'pink' },
          ],
        },
      };
    }
    if (!props['가입일']) {
      updates['가입일'] = { date: {} };
    }
    if (!props['소속기관']) {
      updates['소속기관'] = {
        multi_select: {
          options: [
            { name: '남선교회', color: 'blue' },
            { name: '여전도회', color: 'purple' },
            { name: '학생부', color: 'green' },
            { name: '찬양팀', color: 'yellow' },
          ],
        },
      };
    }
    if (!props['승인상태']) {
      updates['승인상태'] = {
        select: {
          options: [
            { name: '승인대기', color: 'yellow' },
            { name: '승인완료', color: 'green' },
          ],
        },
      };
    }

    if (Object.keys(updates).length > 0) {
      await notion.databases.update({
        database_id: databaseId,
        properties: updates,
      });
    }
    schemaVerified = true;
  } catch (error) {
    console.error('Error ensuring members database schema:', error);
  }
}

function extractMemberStatus(props: Record<string, any>): '승인대기' | '승인완료' {
  const statusProp = props['승인상태'];
  if (statusProp?.type === 'select' && statusProp.select?.name) {
    return statusProp.select.name === '승인대기' ? '승인대기' : '승인완료';
  }
  if (statusProp?.type === 'rich_text') {
    const text = statusProp.rich_text?.[0]?.plain_text?.trim() || '';
    if (text === '승인대기') return '승인대기';
    if (text === '승인완료') return '승인완료';
  }
  const checkProp = props['승인여부'];
  if (checkProp?.type === 'checkbox') {
    return checkProp.checkbox ? '승인완료' : '승인대기';
  }
  // 기존에 등록된 회원(승인상태가 비어있는 경우)은 승인완료로 처리
  return '승인완료';
}

export async function resolveMembersDatabaseId(): Promise<string> {
  if (cachedMembersDbId) {
    await ensureMembersSchema(cachedMembersDbId);
    return cachedMembersDbId;
  }

  try {
    const searchRes = await notion.search({
      filter: { property: 'object', value: 'database' },
    });

    for (const item of searchRes.results as any[]) {
      const title = item.title?.[0]?.plain_text || '';
      if (title.includes('회원') || title.includes('교인') || title.includes('성도')) {
        cachedMembersDbId = item.id;
        await ensureMembersSchema(cachedMembersDbId);
        return cachedMembersDbId;
      }
    }

    // 자동 생성 폴백: 기존에 권한이 부여된 상위 페이지 하위에 '교인 명부 (회원관리)' 데이터베이스 생성
    const createdDb: any = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: '3e3243467c5a805eaeedff2822e3ac31',
      },
      title: [
        {
          type: 'text',
          text: { content: '교인 명부 (회원관리)' },
        },
      ],
      properties: {
        이름: { title: {} },
        아이디: { rich_text: {} },
        이메일: { rich_text: {} },
        비밀번호: { rich_text: {} },
        연락처: { rich_text: {} },
        직분: {
          select: {
            options: [
              { name: '성도', color: 'default' },
              { name: '새가족', color: 'green' },
              { name: '집사', color: 'blue' },
              { name: '권사', color: 'purple' },
              { name: '장로', color: 'orange' },
              { name: '교역자', color: 'yellow' },
            ],
          },
        },
        가입일: { date: {} },
      },
    });

    cachedMembersDbId = createdDb.id;
    schemaVerified = true;
    return cachedMembersDbId;
  } catch (error) {
    console.error('Error resolving members database:', error);
    throw new Error('노션 회원 데이터베이스에 접근할 수 없습니다.');
  }
}

export async function findMemberByEmail(identifier: string) {
  const dbId = await resolveMembersDatabaseId();
  const normalizedId = identifier.trim().toLowerCase();

  const response = await notion.databases.query({
    database_id: dbId,
    filter: {
      or: [
        {
          property: '아이디',
          rich_text: {
            equals: normalizedId,
          },
        },
        {
          property: '이메일',
          rich_text: {
            equals: normalizedId,
          },
        },
      ],
    },
  });

  if (response.results.length === 0) return null;

  const page: any = response.results[0];
  const props = page.properties;

  // 타이틀 속성 이름 찾기 ('이름' 또는 기본 title 속성)
  let name = '성도';
  for (const key of Object.keys(props)) {
    if (props[key]?.type === 'title') {
      name = props[key]?.title?.[0]?.plain_text || '성도';
      break;
    }
  }

  let departments: string[] = [];
  const deptProp = props['소속기관'];
  if (deptProp?.type === 'multi_select' && Array.isArray(deptProp.multi_select)) {
    departments = deptProp.multi_select.map((opt: any) => opt.name).filter(Boolean);
  } else if (deptProp?.type === 'select' && deptProp.select?.name) {
    departments = [deptProp.select.name];
  } else if (deptProp?.type === 'rich_text') {
    const raw = deptProp.rich_text?.map((t: any) => t.plain_text).join('') || '';
    departments = raw
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);
  }

  const status = extractMemberStatus(props);
  let rawRole = props['직분']?.select?.name || '성도';
  if (name.trim() === '박은희' && rawRole === '교역자') {
    rawRole = '사모';
    notion.pages
      .update({
        page_id: page.id,
        properties: { 직분: { select: { name: '사모' } } },
      })
      .catch(() => {});
  }

  return {
    id: page.id,
    name,
    email:
      props['아이디']?.rich_text?.[0]?.plain_text ||
      props['이메일']?.rich_text?.[0]?.plain_text ||
      normalizedId,
    passwordHash: props['비밀번호']?.rich_text?.[0]?.plain_text || '',
    phone: props['연락처']?.rich_text?.[0]?.plain_text || '',
    role: rawRole,
    departments,
    status,
    approved: status === '승인완료',
  };
}

export async function createMember(data: {
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  role: string;
  departments?: string[];
}) {
  const dbId = await resolveMembersDatabaseId();
  const normalizedId = data.email.trim().toLowerCase();
  const today = new Date().toISOString().split('T')[0];

  // 데이터베이스의 기본 title 컬럼명 확인
  const db: any = await notion.databases.retrieve({ database_id: dbId });
  const dbProps = db.properties || {};
  let titlePropName = '이름';
  for (const [key, val] of Object.entries(dbProps) as any[]) {
    if (val.type === 'title') {
      titlePropName = key;
      break;
    }
  }

  const departmentsList = Array.isArray(data.departments)
    ? data.departments.filter(Boolean)
    : [];

  const properties: Record<string, any> = {
    [titlePropName]: {
      title: [{ text: { content: data.name.trim() } }],
    },
    아이디: {
      rich_text: [{ text: { content: normalizedId } }],
    },
    이메일: {
      rich_text: [{ text: { content: normalizedId.includes('@') ? normalizedId : '' } }],
    },
    비밀번호: {
      rich_text: [{ text: { content: data.passwordHash } }],
    },
    연락처: {
      rich_text: [{ text: { content: data.phone.trim() } }],
    },
    직분: {
      select: { name: data.role || '성도' },
    },
    가입일: {
      date: { start: today },
    },
  };

  if (dbProps['승인상태']?.type === 'select') {
    properties['승인상태'] = {
      select: { name: '승인대기' },
    };
  } else if (dbProps['승인상태']?.type === 'rich_text') {
    properties['승인상태'] = {
      rich_text: [{ text: { content: '승인대기' } }],
    };
  }

  if (departmentsList.length > 0) {
    if (dbProps['소속기관']?.type === 'multi_select') {
      properties['소속기관'] = {
        multi_select: departmentsList.map((d) => ({ name: d })),
      };
    } else if (dbProps['소속기관']?.type === 'rich_text') {
      properties['소속기관'] = {
        rich_text: [{ text: { content: departmentsList.join(', ') } }],
      };
    }
  }

  const page: any = await notion.pages.create({
    parent: { database_id: dbId },
    properties,
  });

  return {
    id: page.id,
    name: data.name.trim(),
    email: normalizedId,
    phone: data.phone.trim(),
    role: data.role || '성도',
    departments: departmentsList,
    status: '승인대기' as const,
    approved: false,
  };
}

export async function getAllMembers() {
  const dbId = await resolveMembersDatabaseId();
  const response = await notion.databases.query({
    database_id: dbId,
    sorts: [
      {
        timestamp: 'created_time',
        direction: 'descending',
      },
    ],
  });

  return (response.results as any[]).map((page) => {
    const props = page.properties || {};
    let name = '성도';
    for (const key of Object.keys(props)) {
      if (props[key]?.type === 'title') {
        name = props[key]?.title?.[0]?.plain_text || '성도';
        break;
      }
    }

    let departments: string[] = [];
    const deptProp = props['소속기관'];
    if (deptProp?.type === 'multi_select' && Array.isArray(deptProp.multi_select)) {
      departments = deptProp.multi_select.map((opt: any) => opt.name).filter(Boolean);
    } else if (deptProp?.type === 'select' && deptProp.select?.name) {
      departments = [deptProp.select.name];
    } else if (deptProp?.type === 'rich_text') {
      const raw = deptProp.rich_text?.map((t: any) => t.plain_text).join('') || '';
      departments = raw
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    const status = extractMemberStatus(props);
    let rawRole = props['직분']?.select?.name || '성도';
    if (name.trim() === '박은희' && rawRole === '교역자') {
      rawRole = '사모';
    }

    return {
      id: page.id,
      name,
      email:
        props['아이디']?.rich_text?.[0]?.plain_text ||
        props['이메일']?.rich_text?.[0]?.plain_text ||
        '',
      phone: props['연락처']?.rich_text?.[0]?.plain_text || '',
      role: rawRole,
      departments,
      joinDate: props['가입일']?.date?.start || page.created_time?.split('T')[0] || '',
      status,
      approved: status === '승인완료',
    };
  });
}

export async function updateMemberApproval(pageId: string, approved: boolean) {
  const dbId = await resolveMembersDatabaseId();
  const db: any = await notion.databases.retrieve({ database_id: dbId });
  const dbProps = db.properties || {};
  const targetStatus = approved ? '승인완료' : '승인대기';

  const properties: Record<string, any> = {};
  if (dbProps['승인상태']?.type === 'select') {
    properties['승인상태'] = {
      select: { name: targetStatus },
    };
  } else if (dbProps['승인상태']?.type === 'rich_text') {
    properties['승인상태'] = {
      rich_text: [{ text: { content: targetStatus } }],
    };
  }

  await notion.pages.update({
    page_id: pageId,
    properties,
  });
}

export async function deleteMember(pageId: string) {
  await notion.pages.update({
    page_id: pageId,
    archived: true,
  });
}

export async function updateMemberPassword(pageId: string, newPasswordHash: string) {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      비밀번호: {
        rich_text: [{ text: { content: newPasswordHash } }],
      },
    },
  });
}

export async function findMemberByNameAndPhone(name: string, phone: string) {
  const dbId = await resolveMembersDatabaseId();
  const targetName = name.trim();
  const targetPhoneDigits = phone.replace(/\D/g, '');

  const response = await notion.databases.query({
    database_id: dbId,
  });

  for (const page of response.results as any[]) {
    const props = page.properties || {};
    let memberName = '';
    for (const key of Object.keys(props)) {
      if (props[key]?.type === 'title') {
        memberName = props[key]?.title?.[0]?.plain_text?.trim() || '';
        break;
      }
    }

    if (memberName !== targetName) continue;

    const storedPhone = props['연락처']?.rich_text?.[0]?.plain_text || '';
    const storedPhoneDigits = storedPhone.replace(/\D/g, '');

    if (targetPhoneDigits && storedPhoneDigits && targetPhoneDigits !== storedPhoneDigits) {
      continue;
    }

    const memberId =
      props['아이디']?.rich_text?.[0]?.plain_text ||
      props['이메일']?.rich_text?.[0]?.plain_text ||
      '';

    return {
      id: page.id,
      name: memberName,
      email: memberId,
      phone: storedPhone,
      role: props['직분']?.select?.name || '성도',
    };
  }

  return null;
}

export const MINISTRY_NOTICES_DB_ID = process.env.NOTION_MINISTRY_NOTICES_DB_ID || '';
let cachedMinistryNoticesDbId = MINISTRY_NOTICES_DB_ID;
let isDedicatedMinistryDb = false;

async function ensureMinistryNoticesSchema(databaseId: string) {
  let titlePropName = '이름';
  let confirmedProps: Record<string, any> = {};

  try {
    const db: any = await notion.databases.retrieve({ database_id: databaseId });
    confirmedProps = { ...(db.properties || {}) };

    for (const [key, val] of Object.entries(confirmedProps) as any[]) {
      if (val?.type === 'title') {
        titlePropName = key;
        break;
      }
    }

    const updates: Record<string, any> = {};
    if (!confirmedProps['사역분류']) {
      updates['사역분류'] = { rich_text: {} };
    }
    if (!confirmedProps['내용']) {
      updates['내용'] = { rich_text: {} };
    }
    if (!confirmedProps['작성자']) {
      updates['작성자'] = { rich_text: {} };
    }
    if (!confirmedProps['날짜']) {
      updates['날짜'] = { date: {} };
    }

    if (Object.keys(updates).length > 0) {
      try {
        const updatedDb: any = await notion.databases.update({
          database_id: databaseId,
          properties: updates,
        });
        confirmedProps = { ...(updatedDb.properties || confirmedProps) };
      } catch (updateErr) {
        console.error('Could not add new properties to ministry notices DB, using existing schema:', updateErr);
      }
    }
  } catch (error) {
    console.error('Error retrieving ministry notices schema:', error);
  }

  return {
    titlePropName,
    confirmedProps,
  };
}

export async function resolveMinistryNoticesDbId(): Promise<string> {
  if (cachedMinistryNoticesDbId) {
    return cachedMinistryNoticesDbId;
  }

  let fallbackDbId = NEWS_DATABASE_ID || SCHEDULE_DATABASE_ID || BULLETIN_DATABASE_ID;
  const candidateParentPages: string[] = [];

  try {
    const searchRes = await notion.search({
      filter: { property: 'object', value: 'database' },
    });

    for (const item of searchRes.results as any[]) {
      const title = item.title?.[0]?.plain_text || '';
      if (title.includes('사역') && title.includes('공지')) {
        cachedMinistryNoticesDbId = item.id;
        isDedicatedMinistryDb = true;
        return cachedMinistryNoticesDbId;
      }
      if (!fallbackDbId && item.id) {
        fallbackDbId = item.id;
      }
      if (item.parent?.type === 'page_id' && item.parent.page_id) {
        if (!candidateParentPages.includes(item.parent.page_id)) {
          candidateParentPages.push(item.parent.page_id);
        }
      }
    }
  } catch (searchErr) {
    console.error('Error searching databases for ministry notices:', searchErr);
  }

  if (!candidateParentPages.includes('3e3243467c5a805eaeedff2822e3ac31')) {
    candidateParentPages.push('3e3243467c5a805eaeedff2822e3ac31');
  }

  for (const parentPageId of candidateParentPages) {
    try {
      const createdDb: any = await notion.databases.create({
        parent: {
          type: 'page_id',
          page_id: parentPageId,
        },
        title: [
          {
            type: 'text',
            text: { content: '사역 및 기관 공지사항' },
          },
        ],
        properties: {
          이름: { title: {} },
          분류: {
            select: {
              options: [
                { name: '전체', color: 'default' },
                { name: '교회학교', color: 'green' },
                { name: '찬양팀', color: 'yellow' },
                { name: '남선교회', color: 'blue' },
                { name: '여전도회', color: 'purple' },
              ],
            },
          },
          사역분류: { rich_text: {} },
          내용: { rich_text: {} },
          작성자: { rich_text: {} },
          날짜: { date: {} },
        },
      });

      cachedMinistryNoticesDbId = createdDb.id;
      isDedicatedMinistryDb = true;
      return cachedMinistryNoticesDbId;
    } catch {
      // Try next candidate parent page or fallback to existing shared database
    }
  }

  if (fallbackDbId) {
    cachedMinistryNoticesDbId = fallbackDbId;
    isDedicatedMinistryDb = false;
    return cachedMinistryNoticesDbId;
  }

  return '';
}

export async function getMinistryNotices() {
  try {
    const dbId = await resolveMinistryNoticesDbId();
    if (!dbId) return [];

    const response = await notion.databases.query({
      database_id: dbId,
    });

    const ministryCategories = ['교회학교', '찬양팀', '남선교회', '여전도회'];

    const items = response.results
      .map((page: any) => {
        const props = page.properties || {};

        let rawTitle = '';
        for (const key of Object.keys(props)) {
          if (props[key]?.type === 'title') {
            rawTitle = props[key]?.title?.map((t: any) => t.plain_text).join('') || '';
            break;
          }
        }
        if (!rawTitle) {
          rawTitle =
            props['이름']?.title?.[0]?.plain_text ||
            props['제목']?.title?.[0]?.plain_text ||
            '제목 없음';
        }

        let prefixCategory = '';
        let title = rawTitle;
        const prefixMatch = rawTitle.match(/^\[사역공지:([^\]]+)\]\s*(.*)$/);
        if (prefixMatch) {
          prefixCategory = prefixMatch[1];
          title = prefixMatch[2] || rawTitle;
        }

        const ministryCat = props['사역분류']?.rich_text?.[0]?.plain_text || prefixCategory;
        const selectCat = props['분류']?.select?.name || '';

        if (!isDedicatedMinistryDb && !ministryCat && !ministryCategories.includes(selectCat)) {
          return null;
        }

        const category = ministryCat || selectCat || '전체';
        const content =
          props['내용']?.rich_text?.map((t: any) => t.plain_text).join('') ||
          props['텍스트']?.rich_text?.map((t: any) => t.plain_text).join('') ||
          '';
        const rawAuthor = props['작성자']?.rich_text?.[0]?.plain_text || '주님품교회';
        const author = rawAuthor.replace('박은희 교역자', '박은희 사모');
        const date = props['날짜']?.date?.start || page.created_time?.split('T')[0] || '';

        return {
          id: page.id,
          title,
          category,
          content,
          author,
          date,
        };
      })
      .filter(Boolean) as any[];

    items.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    return items;
  } catch (error) {
    console.error('Error fetching ministry notices:', error);
    return [];
  }
}

export async function createMinistryNotice(params: {
  title: string;
  category: string;
  content: string;
  author: string;
}) {
  const dbId = await resolveMinistryNoticesDbId();
  if (!dbId) {
    throw new Error('공지사항 데이터베이스를 찾을 수 없습니다.');
  }

  const { titlePropName, confirmedProps } = await ensureMinistryNoticesSchema(dbId);
  const today = new Date().toISOString().split('T')[0];
  const category = params.category || '전체';

  const hasMinistryCatProp = confirmedProps['사역분류']?.type === 'rich_text';
  const storedTitle = isDedicatedMinistryDb
    ? params.title
    : `[사역공지:${category}] ${params.title}`;

  const properties: Record<string, any> = {
    [titlePropName]: {
      title: [{ text: { content: storedTitle } }],
    },
  };

  if (hasMinistryCatProp) {
    properties['사역분류'] = {
      rich_text: [{ text: { content: category } }],
    };
  }

  if (confirmedProps['내용']?.type === 'rich_text') {
    properties['내용'] = {
      rich_text: [{ text: { content: params.content } }],
    };
  } else if (confirmedProps['텍스트']?.type === 'rich_text') {
    properties['텍스트'] = {
      rich_text: [{ text: { content: params.content } }],
    };
  }

  if (confirmedProps['작성자']?.type === 'rich_text') {
    properties['작성자'] = {
      rich_text: [{ text: { content: params.author } }],
    };
  }

  if (confirmedProps['날짜']?.type === 'date') {
    properties['날짜'] = {
      date: { start: today },
    };
  }

  if (isDedicatedMinistryDb && confirmedProps['분류']?.type === 'select') {
    properties['분류'] = {
      select: { name: category },
    };
  }

  const created: any = await notion.pages.create({
    parent: { database_id: dbId },
    properties,
  });

  return {
    id: created.id,
    title: params.title,
    category,
    content: params.content,
    author: params.author,
    date: today,
  };
}

export async function updateMinistryNotice(params: {
  id: string;
  title: string;
  category: string;
  content: string;
}) {
  const dbId = await resolveMinistryNoticesDbId();
  if (!dbId) {
    throw new Error('공지사항 데이터베이스를 찾을 수 없습니다.');
  }

  const { titlePropName, confirmedProps } = await ensureMinistryNoticesSchema(dbId);
  const category = params.category || '전체';

  const hasMinistryCatProp = confirmedProps['사역분류']?.type === 'rich_text';
  const storedTitle = isDedicatedMinistryDb
    ? params.title
    : `[사역공지:${category}] ${params.title}`;

  const properties: Record<string, any> = {
    [titlePropName]: {
      title: [{ text: { content: storedTitle } }],
    },
  };

  if (hasMinistryCatProp) {
    properties['사역분류'] = {
      rich_text: [{ text: { content: category } }],
    };
  }

  if (confirmedProps['내용']?.type === 'rich_text') {
    properties['내용'] = {
      rich_text: [{ text: { content: params.content } }],
    };
  } else if (confirmedProps['텍스트']?.type === 'rich_text') {
    properties['텍스트'] = {
      rich_text: [{ text: { content: params.content } }],
    };
  }

  if (isDedicatedMinistryDb && confirmedProps['분류']?.type === 'select') {
    properties['분류'] = {
      select: { name: category },
    };
  }

  await notion.pages.update({
    page_id: params.id,
    properties,
  });

  return {
    id: params.id,
    title: params.title,
    category,
    content: params.content,
  };
}

export async function deleteMinistryNotice(pageId: string) {
  await notion.pages.update({
    page_id: pageId,
    archived: true,
  });
}

export async function uploadFileToNotion(file: File): Promise<{ fileUploadId: string; fileName: string }> {
  const token = process.env.NOTION_SECRET || '';
  const createRes = await fetch('https://api.notion.com/v1/file_uploads', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filename: file.name,
      content_type: file.type || 'application/octet-stream',
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`파일 업로드 생성 실패: ${errText}`);
  }

  const created = await createRes.json();
  const fileUploadId = created.id;

  const formData = new FormData();
  formData.append('file', file, file.name);

  const sendRes = await fetch(`https://api.notion.com/v1/file_uploads/${fileUploadId}/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
    },
    body: formData,
  });

  if (!sendRes.ok) {
    const errText = await sendRes.text();
    throw new Error(`파일 데이터 전송 실패: ${errText}`);
  }

  return { fileUploadId, fileName: file.name };
}

async function getTitlePropertyName(databaseId: string): Promise<{
  titlePropName: string;
  props: Record<string, any>;
}> {
  const db: any = await notion.databases.retrieve({ database_id: databaseId });
  const props = db.properties || {};
  let titlePropName = '이름';
  for (const [key, val] of Object.entries(props) as any[]) {
    if (val?.type === 'title') {
      titlePropName = key;
      break;
    }
  }
  return { titlePropName, props };
}

export async function createSermon(params: {
  title: string;
  passage: string;
  preacher: string;
  date: string;
  videoUrl: string;
}) {
  if (!SERMONS_DATABASE_ID) throw new Error('설교 데이터베이스 ID가 설정되지 않았습니다.');
  const { titlePropName, props } = await getTitlePropertyName(SERMONS_DATABASE_ID);
  const dateVal = params.date || new Date().toISOString().split('T')[0];

  const properties: Record<string, any> = {
    [titlePropName]: {
      title: [{ text: { content: params.title } }],
    },
  };

  if (props['설교 제목']?.type === 'rich_text') {
    properties['설교 제목'] = { rich_text: [{ text: { content: params.title } }] };
  }
  if (props['성경구절']?.type === 'rich_text') {
    properties['성경구절'] = { rich_text: [{ text: { content: params.passage } }] };
  }
  if (props['설교자']?.type === 'select') {
    properties['설교자'] = { select: { name: params.preacher || '담임목사' } };
  } else if (props['설교자']?.type === 'rich_text') {
    properties['설교자'] = { rich_text: [{ text: { content: params.preacher || '담임목사' } }] };
  }
  if (props['날짜']?.type === 'date') {
    properties['날짜'] = { date: { start: dateVal } };
  }
  if (params.videoUrl) {
    if (props['영상링크']?.type === 'url') {
      properties['영상링크'] = { url: params.videoUrl };
    } else if (props['영상링크']?.type === 'rich_text') {
      properties['영상링크'] = { rich_text: [{ text: { content: params.videoUrl } }] };
    } else if (props['링크']?.type === 'url') {
      properties['링크'] = { url: params.videoUrl };
    } else if (props['링크']?.type === 'rich_text') {
      properties['링크'] = { rich_text: [{ text: { content: params.videoUrl } }] };
    }
  }

  const created: any = await notion.pages.create({
    parent: { database_id: SERMONS_DATABASE_ID },
    properties,
  });

  return {
    id: created.id,
    title: params.title,
    passage: params.passage,
    preacher: params.preacher || '담임목사',
    date: dateVal,
    videoUrl: params.videoUrl,
  };
}

export async function createNewsItem(params: {
  title: string;
  type: string;
  content: string;
  date?: string;
}) {
  if (!NEWS_DATABASE_ID) throw new Error('교회 소식 데이터베이스 ID가 설정되지 않았습니다.');
  const { titlePropName, props } = await getTitlePropertyName(NEWS_DATABASE_ID);
  const dateVal = params.date || new Date().toISOString().split('T')[0];

  const properties: Record<string, any> = {
    [titlePropName]: {
      title: [{ text: { content: params.title } }],
    },
  };

  if (props['분류']?.type === 'select') {
    properties['분류'] = { select: { name: params.type || '공지' } };
  }
  if (props['내용']?.type === 'rich_text') {
    properties['내용'] = { rich_text: [{ text: { content: params.content } }] };
  } else if (props['텍스트']?.type === 'rich_text') {
    properties['텍스트'] = { rich_text: [{ text: { content: params.content } }] };
  }
  if (props['날짜']?.type === 'date') {
    properties['날짜'] = { date: { start: dateVal } };
  }

  const created: any = await notion.pages.create({
    parent: { database_id: NEWS_DATABASE_ID },
    properties,
  });

  return {
    id: created.id,
    title: params.title,
    type: params.type || '공지',
    content: params.content,
    date: dateVal,
  };
}

export async function createScheduleItem(params: {
  title: string;
  type: string;
  location: string;
  content: string;
  date: string;
}) {
  if (!SCHEDULE_DATABASE_ID) throw new Error('교회 일정 데이터베이스 ID가 설정되지 않았습니다.');
  const { titlePropName, props } = await getTitlePropertyName(SCHEDULE_DATABASE_ID);
  const dateVal = params.date || new Date().toISOString().split('T')[0];

  const properties: Record<string, any> = {
    [titlePropName]: {
      title: [{ text: { content: params.title } }],
    },
  };

  if (props['분류']?.type === 'select') {
    properties['분류'] = { select: { name: params.type || '행사' } };
  }
  if (props['장소']?.type === 'rich_text') {
    properties['장소'] = { rich_text: [{ text: { content: params.location || '' } }] };
  } else if (props['장소']?.type === 'select' && params.location) {
    properties['장소'] = { select: { name: params.location } };
  }
  if (props['텍스트']?.type === 'rich_text') {
    properties['텍스트'] = { rich_text: [{ text: { content: params.content || '' } }] };
  } else if (props['내용']?.type === 'rich_text') {
    properties['내용'] = { rich_text: [{ text: { content: params.content || '' } }] };
  }
  if (props['날짜']?.type === 'date') {
    properties['날짜'] = { date: { start: dateVal } };
  }

  const created: any = await notion.pages.create({
    parent: { database_id: SCHEDULE_DATABASE_ID },
    properties,
  });

  return {
    id: created.id,
    title: params.title,
    type: params.type || '행사',
    location: params.location || '',
    content: params.content || '',
    date: dateVal,
  };
}

export async function createDalDalItem(params: {
  title: string;
  date?: string;
  imageUrl?: string;
  fileUploadId?: string;
  fileName?: string;
}) {
  if (!DALDAL_DATABASE_ID) throw new Error('달달바이블 데이터베이스 ID가 설정되지 않았습니다.');
  const { titlePropName, props } = await getTitlePropertyName(DALDAL_DATABASE_ID);
  const dateVal = params.date || new Date().toISOString().split('T')[0];

  const properties: Record<string, any> = {
    [titlePropName]: {
      title: [{ text: { content: params.title } }],
    },
  };

  if (props['날짜']?.type === 'date') {
    properties['날짜'] = { date: { start: dateVal } };
  }

  if (props['이미지']?.type === 'files') {
    if (params.fileUploadId) {
      properties['이미지'] = {
        files: [
          {
            type: 'file_upload',
            file_upload: { id: params.fileUploadId },
            name: params.fileName || params.title,
          },
        ],
      };
    } else if (params.imageUrl) {
      properties['이미지'] = {
        files: [
          {
            type: 'external',
            external: { url: params.imageUrl },
            name: params.title,
          },
        ],
      };
    }
  }

  const created: any = await notion.pages.create({
    parent: { database_id: DALDAL_DATABASE_ID },
    properties,
  });

  return {
    id: created.id,
    title: params.title,
    date: dateVal,
    imageUrl: params.imageUrl || '',
  };
}

export async function createBulletinItem(params: {
  title: string;
  date?: string;
  fileUrl?: string;
  fileUploadId?: string;
  fileName?: string;
}) {
  if (!BULLETIN_DATABASE_ID) throw new Error('주보 데이터베이스 ID가 설정되지 않았습니다.');
  const { titlePropName, props } = await getTitlePropertyName(BULLETIN_DATABASE_ID);
  const dateVal = params.date || new Date().toISOString().split('T')[0];

  const properties: Record<string, any> = {
    [titlePropName]: {
      title: [{ text: { content: params.title } }],
    },
  };

  if (props['날짜']?.type === 'date') {
    properties['날짜'] = { date: { start: dateVal } };
  }

  if (props['파일']?.type === 'files') {
    if (params.fileUploadId) {
      properties['파일'] = {
        files: [
          {
            type: 'file_upload',
            file_upload: { id: params.fileUploadId },
            name: params.fileName || params.title,
          },
        ],
      };
    } else if (params.fileUrl) {
      properties['파일'] = {
        files: [
          {
            type: 'external',
            external: { url: params.fileUrl },
            name: params.title,
          },
        ],
      };
    }
  }

  const created: any = await notion.pages.create({
    parent: { database_id: BULLETIN_DATABASE_ID },
    properties,
  });

  return {
    id: created.id,
    title: params.title,
    date: dateVal,
    fileUrl: params.fileUrl || '#',
  };
}

export async function createGalleryItem(params: {
  title: string;
  date?: string;
  imageUrl?: string;
  fileUploadId?: string;
  fileName?: string;
}) {
  if (!GALLERY_DATABASE_ID) throw new Error('갤러리 데이터베이스 ID가 설정되지 않았습니다.');
  const { titlePropName, props } = await getTitlePropertyName(GALLERY_DATABASE_ID);
  const dateVal = params.date || new Date().toISOString().split('T')[0];

  const properties: Record<string, any> = {
    [titlePropName]: {
      title: [{ text: { content: params.title } }],
    },
  };

  if (props['날짜']?.type === 'date') {
    properties['날짜'] = { date: { start: dateVal } };
  }

  if (props['사진']?.type === 'files') {
    if (params.fileUploadId) {
      properties['사진'] = {
        files: [
          {
            type: 'file_upload',
            file_upload: { id: params.fileUploadId },
            name: params.fileName || params.title,
          },
        ],
      };
    } else if (params.imageUrl) {
      properties['사진'] = {
        files: [
          {
            type: 'external',
            external: { url: params.imageUrl },
            name: params.title,
          },
        ],
      };
    }
  }

  const created: any = await notion.pages.create({
    parent: { database_id: GALLERY_DATABASE_ID },
    properties,
  });

  return {
    id: `${created.id}-prop-0`,
    pageId: created.id,
    title: params.title,
    date: dateVal,
    imageUrl: params.imageUrl || '',
  };
}

export async function deleteContentPage(pageId: string) {
  const cleanId = pageId.includes('-prop-') ? pageId.split('-prop-')[0] : pageId;
  try {
    await notion.pages.update({
      page_id: cleanId,
      archived: true,
    });
  } catch {
    await notion.blocks.delete({
      block_id: cleanId,
    });
  }
}




