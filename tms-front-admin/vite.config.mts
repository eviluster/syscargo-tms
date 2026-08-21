import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: "/",
  server: {
    host: "0.0.0.0",
    port: 80,
    strictPort: true,
    allowedHosts: ["admin.syscargo.cu", "localhost"],
    hmr: {
      protocol: "wss",
      host: "admin.syscargo.cu",
      clientPort: 443,
    },
  },
  build: {
    chunkSizeWarningLimit: 3000,
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    }
  }
});