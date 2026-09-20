import { Client } from '@notionhq/client';

export const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

export const SERMONS_DATABASE_ID = process.env.NOTION_SERMONS_DB_ID || '';
export const NEWS_DATABASE_ID = process.env.NOTION_NEWS_DB_ID || '';

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
      // 제목 찾기: '제목'(텍스트), '이름'(타이틀), '새소식 게시판'(타이틀) 중 있는 것 사용
      const titleProp = page.properties['제목']?.rich_text?.[0]?.plain_text 
                     || page.properties['이름']?.title?.[0]?.plain_text 
                     || page.properties['새소식 게시판']?.title?.[0]?.plain_text 
                     || '제목 없음';

      // 분류에 내용 전체를 넣은 경우를 대비한 처리
      let typeVal = page.properties['분류']?.select?.name || '공지';
      let displayTitle = titleProp;

      // 만약 분류 이름이 너무 길면(내용을 분류에 적으신 경우) 
      if (typeVal.length > 10 && titleProp === '제목 없음') {
        const split = typeVal.split('-');
        if(split.length > 1) {
           typeVal = split[0].trim();
           displayTitle = split.slice(1).join('-').trim();
        } else {
           displayTitle = typeVal;
           typeVal = '공지';
        }
      }

      return {
        id: page.id,
        title: displayTitle,
        date: page.properties['날짜']?.date?.start || '날짜 없음',
        type: typeVal,
      };
    });
  } catch (error) {
    console.error('Error fetching news from Notion:', error);
    return [];
  }
}
