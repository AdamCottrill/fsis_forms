import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
//
//target: "http://127.0.0.1:8000",

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
  ],
  server: {
    proxy: {
      "/stocking/api": {
        target: "http://142.143.160.113:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
