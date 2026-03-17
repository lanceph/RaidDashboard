# 🛡️ 菠蘿油討伐 Dashboard

![Vue.js](https://img.shields.io/badge/Vue%203-Composition%20API-4FC08D?style=for-the-badge&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

這是一個專為公會討伐任務設計的現代化 Web 儀表板。透過串接 Google Sheets 作為資料來源，提供公會成員最即時、最直覺的排班與裝備需求檢視體驗。

## ✨ 核心功能 (Features)

- 👥 **團隊總覽模式**：
  - 支援依據「場次時間」與「玩家名稱」進行即時過濾。
  - 自動解析四大職業與屬性（木、火、水、光、暗），並套用專屬視覺上色。
  - 響應式卡片設計，支援點擊摺疊與展開。
- 👤 **個人行程模式**：
  - 輸入玩家名稱，即可快速生成專屬的「個人任務通行證」。
  - 精準顯示個人所屬隊伍、職位、出席狀態（✅/❌）及所需的特殊寵物/聖光裝備。
- 📸 **一鍵分享**：
  - 內建 `html2canvas` 引擎，一鍵將排班表轉為高畫質圖片。
  - 支援行動裝置 Web Share API，可直接分享至 LINE 或 Discord。
- 🔒 **企業級資安與效能**：
  - 透過 Vercel Serverless Functions 建立中介 API (BFF)，隱藏 Google API 金鑰與表單 ID。
  - 導入 Edge Caching 快取機制，抵禦高併發刷新，實現毫秒級載入。

## 🏗️ 系統架構 (Architecture)

- **前端框架**：Vue 3 (Composition API) + Vite
- **UI 樣式**：Tailwind CSS
- **後端 API**：Vercel Serverless Functions (`/api/schedule.js`)
- **資料庫**：Google Sheets API (唯讀權限)

## 🚀 本地開發指南 (Local Development)

### 1. 安裝依賴套件
```bash
npm install
```

### 2. 環境變數設定

請在專案根目錄建立一個 .env 檔案，並填入您的 Google 服務帳號憑證與表單 ID：
程式碼片段

GOOGLE_CLIENT_EMAIL=your-service-account@xxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-google-sheet-id

(⚠️ 警告：請確保 .env 已加入 .gitignore，切勿將金鑰提交至公開儲存庫)
### 3. 啟動開發伺服器

由於專案包含 Serverless API，推薦使用 Vercel CLI 進行本地模擬測試：
Bash

# 全域安裝 Vercel CLI (若尚未安裝)
npm install -g vercel

# 啟動包含 API 路由的本地伺服器
vercel dev

📦 部署 (Deployment)

本專案針對 Vercel 進行了深度最佳化。

    將程式碼推送至 GitHub。

    於 Vercel 控制台匯入專案。

    在 Vercel 的 Environment Variables 中設定上述三個環境變數。

    點擊 Deploy 即可完成上線！

© 2026 菠蘿油王國討伐小組. All Rights Reserved. Modernized by ZoneSky(阿宏).
