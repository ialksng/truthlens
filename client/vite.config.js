import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()], 
  base: "/work/projects/truthlens/app/",
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/work/projects/truthlens/app/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});