import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "http://backend:4000",
      "/ws": {
        target: "http://backend:4000",
        ws: true,
      },
    },
  },
});
