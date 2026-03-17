import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "./",
  plugins: [vue()],
  server: {
    open: true,
    allowedHosts: true,
  },
  build: {
    outDir: "dist",
  },
});
