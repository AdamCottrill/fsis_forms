import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
//
//target: "http://127.0.0.1:8000",
//target: "http://142.143.160.113:8000",

export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,
    environment: "jsdom",
    // this points to the setup file
    setupFiles: "./src/setupTests.js",
  },

  server: {
    proxy: {
      "/stocking/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
