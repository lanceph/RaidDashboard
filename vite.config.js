import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "./",
  plugins: [vue()],
  server: {
    open: true,
    allowedHosts: true,
    proxy: {
      // 💡 當前端呼叫 /api 時，自動轉發給已經部署好的 Vercel 專案
      "/api": {
        target: "https://boluoyou-dashboard.vercel.app/", // ⚠️ 請替換成你真實的 Vercel 網址
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
  },
});
