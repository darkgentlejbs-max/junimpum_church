const fs = require('fs');
let code = fs.readFileSync('src/lib/notion.ts', 'utf8');

const idInsert = `export const DALDAL_DATABASE_ID = process.env.NOTION_DALDAL_DB_ID || '3f0243467c5a80ff824eff221d7e7919';\n`;
code = code.replace("export const SCHEDULE_DATABASE_ID", idInsert + "export const SCHEDULE_DATABASE_ID");

const fnInsert = `
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
`;

code += fnInsert;
fs.writeFileSync('src/lib/notion.ts', code);
console.log("notion.ts updated with DalDal");
