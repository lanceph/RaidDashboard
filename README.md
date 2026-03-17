這份 README.md 是專為你的「菠蘿油討伐Dashboard」量身打造的。它包含了專案簡介、核心功能、技術架構，以及針對你使用的 Google Sheets 作為後端資料庫的設定說明。
🍍 菠蘿油討伐 Dashboard (v1.5)

由 ZoneSky (阿宏) 開發，這是一個專為遊戲社群設計的「討伐任務管理系統」。透過整合 Google Sheets 作為雲端資料庫，提供團隊成員直覺、美觀且具備行動端優化的排程管理介面。
✨ 核心功能
1. 雙模式切換

    👥 團隊總覽：適合隊長與管理員，一目了然所有場次的隊伍配置、成員職業及屬性要求。支援「場次摺疊」功能，讓資訊不再擁擠。

    👤 個人行程：針對一般團員設計。只需輸入自己的名字，系統會自動提取本週所有相關行程，並以「通行證」票卡風格呈現，手機查閱極度方便。

2. 智慧視覺系統

    職業自動配色：根據「輸出、巫師、流氓、技師」自動應用對應色系。

    屬性標籤化：自動識別「木、火、水、光、暗」屬性並顯示對應標籤。

    BOSS 類型變色：標題會根據討伐的 BOSS 類型（如：鳥、雷、地下、魔女）自動切換視覺配色。

3. 強大工具整合

    📸 一鍵截圖分享：整合 html2canvas 與行動裝置原生 Share API，產生的截圖可直接分享至 LINE 或 Discord。

    🔄 即時同步：與 Google Sheets 資料同步，無需重新部署網頁即可更新內容。

🛠 技術棧

    Frontend: HTML5, JavaScript (ES6+)

    Styling: Tailwind CSS

    Icons: Inline SVG (自定義菠蘿盾牌)

    Libraries:

        html2canvas (截圖功能)

        Google Visualization API (資料讀取)

📅 資料庫設定 (Google Sheets)

本專案預設連結至 Google Sheets。若要更換資料來源，請修改程式碼中的 CONFIG 物件：
JavaScript

const CONFIG = {
    SHEET_ID: '你的_Google_Sheet_ID',
    SHEETS: { 
        SCHEDULE: '討伐隊時間', 
        SURVEY: '[New] 討伐時間調查結果', 
        PETS: '聖光、幻獸清單' 
    }
};

表格結構要求：

    討伐隊時間：紀錄每場次的隊伍組成、時間、地點與成員意願。

    討伐時間調查結果：用於對應成員的職業資訊。

    聖光、幻獸清單：用於查詢特定裝備或寵物的屬性以進行自動著色。

🚀 快速上手

    將本專案的 index.html 下載至本機。

    確保你的 Google Sheet 已開啟「知道連結的所有人皆可檢視」權限。

    直接使用瀏覽器開啟 index.html 即可運作。

    (建議) 搭配 GitHub Pages 進行部署，即可擁有專屬的線上討伐儀表板網址。

📝 版本更新日誌

    v1.5:

        新增專屬 Q 版菠蘿油 Icon。

        優化視覺層次與 Changelog 模組。

    v1.4: 新增場次摺疊功能與空場次過濾。

    v1.3: 新增個人模式與原生分享 API。

⚖️ 授權條款

本專案採 MIT License 授權。歡迎自由修改與分發，唯須保留原創作者 ZoneSky (阿宏) 之標註。

© 2024 菠蘿油王國討伐小組. All Rights Reserved.
