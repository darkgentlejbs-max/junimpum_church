const fs = require('fs');
let code = fs.readFileSync('src/lib/notion.ts', 'utf8');

const idInsert = `export const BULLETIN_DATABASE_ID = process.env.NOTION_BULLETIN_DB_ID || '';\n`;
code = code.replace("export const SCHEDULE_DATABASE_ID", idInsert + "export const SCHEDULE_DATABASE_ID");

const fnInsert = `
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
`;

code += fnInsert;
fs.writeFileSync('src/lib/notion.ts', code);
console.log("notion.ts updated");
