const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_SECRET });

async function test() {
  try {
    console.log("Testing Sermons DB:", process.env.NOTION_SERMONS_DB_ID);
    const s = await notion.databases.query({ database_id: process.env.NOTION_SERMONS_DB_ID });
    console.log("Sermons Data:", JSON.stringify(s.results[0]?.properties, null, 2) || "Empty");

    console.log("Testing News DB:", process.env.NOTION_NEWS_DB_ID);
    const n = await notion.databases.query({ database_id: process.env.NOTION_NEWS_DB_ID });
    console.log("News Data:", JSON.stringify(n.results[0]?.properties, null, 2) || "Empty");
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
