import { Client } from '@notionhq/client';

export const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

export const SERMONS_DATABASE_ID = process.env.NOTION_SERMONS_DB_ID || '';
export const NEWS_DATABASE_ID = process.env.NOTION_NEWS_DB_ID || '';
export const GALLERY_DATABASE_ID = process.env.NOTION_GALLERY_DB_ID || '';

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
        videoUrl: page.properties['영상링크']?.url || '',
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
    
    response.results.forEach((page: any) => {
      const titleProp = page.properties['이름']?.title?.[0]?.plain_text || '제목 없음';
      const dateVal = page.properties['날짜']?.date?.start || '날짜 없음';
      const files = page.properties['사진']?.files || [];
      
      files.forEach((fileProp: any, index: number) => {
        const imageUrl = fileProp?.file?.url || fileProp?.external?.url || '';
        if (imageUrl) {
          allPhotos.push({
            id: `${page.id}-${index}`,
            title: files.length > 1 ? `${titleProp} (${index + 1})` : titleProp,
            date: dateVal,
            imageUrl: imageUrl,
          });
        }
      });
    });
    
    return allPhotos;
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return [];
  }
}
