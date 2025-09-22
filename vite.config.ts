import react from "@vitejs/plugin-react"
import tailwind from "tailwindcss"
import { defineConfig } from "vite"
import path from "path"
import { nodePolyfills } from "vite-plugin-node-polyfills"

export default defineConfig({
  plugins: [
    react(),
    // silence TypeScript by casting the options argument
    (nodePolyfills as any)({
      buffer: true,
      process: true,
      protocolImports: true,
    }),
  ],
  base: "./",
  css: {
    postcss: { plugins: [tailwind()] },
  },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  define: { global: "globalThis" },
  optimizeDeps: { include: ["buffer", "process"] },

  // dev server proxy to avoid CORS during local development
  server: {
    proxy: {
      // proxy any request starting with /api to webapi.atm.network
      '/api': {
        target: 'https://webapi.atm.network',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // proxy any request starting with /gameapi to gameapi
      '/gameapi': {
        target: 'https://gameapi.atm.network',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/gameapi/, ''),
      },
    },
  },
})