import { createApp } from "vue";
import App from "./App.vue";
import "./style.css"; // 載入我們之前寫好的 Tailwind 與自訂 CSS

// 啟動 Vue，並把它掛載到 index.html 的 #app 標籤上
createApp(App).mount("#app");
