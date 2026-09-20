import { Client } from '@notionhq/client';

export const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

export const SERMONS_DATABASE_ID = process.env.NOTION_SERMONS_DB_ID || '';
export const NEWS_DATABASE_ID = process.env.NOTION_NEWS_DB_ID || '';

export async function getSermons() {
  if (!SERMONS_DATABASE_ID) return [];
  try {
    const response = await notion.databases.query({
      database_id: SERMONS_DATABASE_ID,
      sorts: [{ property: '날짜', direction: 'descending' }],
    });
    return response.results.map((page: any) => ({
      id: page.id,
      title: page.properties['이름']?.title[0]?.plain_text || '제목 없음',
      date: page.properties['날짜']?.date?.start || '날짜 없음',
      preacher: page.properties['설교자']?.select?.name || page.properties['설교자']?.rich_text?.[0]?.plain_text || '설교자 없음',
      passage: page.properties['성경구절']?.rich_text[0]?.plain_text || '',
      videoUrl: page.properties['영상링크']?.url || '',
    }));
  } catch (error) {
    console.error('Error fetching sermons from Notion:', error);
    return [];
  }
}

export async function getNews() {
  if (!NEWS_DATABASE_ID) return [];
  try {
    const response = await notion.databases.query({
      database_id: NEWS_DATABASE_ID,
      sorts: [{ property: '날짜', direction: 'descending' }],
    });
    return response.results.map((page: any) => ({
      id: page.id,
      title: page.properties['이름']?.title[0]?.plain_text || '제목 없음',
      date: page.properties['날짜']?.date?.start || '날짜 없음',
      type: page.properties['분류']?.select?.name || '공지',
    }));
  } catch (error) {
    console.error('Error fetching news from Notion:', error);
    return [];
  }
}
