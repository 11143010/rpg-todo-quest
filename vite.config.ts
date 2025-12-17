// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path"; // 引入 path 模組

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 設定 @ 指向 src 目錄
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
