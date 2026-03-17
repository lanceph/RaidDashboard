// api/schedule.js
import { google } from "googleapis";

export default async function handler(req, res) {
  const { sheetName } = req.query;
  // 💡 改動處：從環境變數取得表單 ID，不再硬編碼！
  const SHEET_ID = process.env.GOOGLE_SHEET_ID;

  if (!sheetName) {
    return res.status(400).json({ error: "Missing sheetName parameter" });
  }

  if (!SHEET_ID) {
    return res
      .status(500)
      .json({ error: "Server configuration error: Missing SHEET_ID" });
  }

  try {
    // 2. 拿出保險箱裡的鑰匙，向 Google 證明我們的機器人身分
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // 處理環境變數中換行符號(\n)的問題
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"], // 只讀權限
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken(); // 取得臨時通行證

    // 3. 帶著通行證，去呼叫原本的 Google 表單資料網址
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(
      sheetName
    )}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token.token}`, // 秀出通行證！
      },
    });

    // 4. 解析拿到的資料
    const text = await response.text();
    // 拔掉 Google 回傳格式外層多餘的字串 (原本前端做的苦工，現在後端做掉)
    const jsonString = text.substring(47, text.length - 2);
    const data = JSON.parse(jsonString);

    // s-maxage=60: 讓 Vercel 節點快取 30 秒
    // stale-while-revalidate=120: 過期後的 60 秒內，先給舊資料，然後背景偷偷去跟 Google 更新
    res.setHeader(
      "Cache-Control",
      "max-age=0, s-maxage=30, stale-while-revalidate=60"
    );

    // 5. 將乾淨的陣列回傳給前端
    res.status(200).json(data.table.rows);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Failed to fetch data from Google Sheets" });
  }
}
