import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  root: path.resolve(__dirname),
  publicDir: path.resolve(__dirname, "public"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000",
      "/api-docs": "http://localhost:3000",
    },
  },
  resolve: {
    alias: {
      "@core": path.resolve(__dirname, "src/core"),
      "@modules": path.resolve(__dirname, "src/modules"),
      "@components": path.resolve(__dirname, "src/components"),
    },
  },
});
