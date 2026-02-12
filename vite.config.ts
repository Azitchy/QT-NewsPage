import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import vitePluginSvgr from "vite-plugin-svgr"
import { nodePolyfills } from "vite-plugin-node-polyfills"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      vitePluginSvgr(),
      nodePolyfills({
        include: ['buffer', 'process'],
        globals: { Buffer: true, global: true, process: true },
        protocolImports: true,
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ['@wagmi/core', 'wagmi', 'viem', '@reown/appkit'],
    },
    define: {
      global: "globalThis",
      'process.env': {},
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    server: {
      hmr: { timeout: 100000, overlay: false },
      proxy: {
        '/openapi': {
          target: env.VITE_OPENAPI_BASE_URL || 'https://openapi.atm.network',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/openapi/, ''),
          cookieDomainRewrite: 'localhost',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              const apiToken = env.VITE_API_TOKEN;
              if (apiToken) {
                proxyReq.setHeader('apiToken', apiToken);
              }
              if (req.headers.cookie) {
                proxyReq.setHeader('Cookie', req.headers.cookie);
              }
            });
            proxy.on('proxyRes', (proxyRes) => {
              if (proxyRes.headers['set-cookie']) {
                proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map(c =>
                  c.replace(/Domain=[^;]+/i, 'Domain=localhost')
                   .replace(/Secure[;]?/i, '')
                   .replace(/SameSite=None/i, 'SameSite=Lax')
                );
              }
            });
          },
        },
        '/api': {
          target: env.VITE_WEB_API_BASE_URL || 'https://webapi.atm.network',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          cookieDomainRewrite: 'localhost',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              if (req.headers.cookie) {
                proxyReq.setHeader('Cookie', req.headers.cookie);
              }
            });
            proxy.on('proxyRes', (proxyRes) => {
              if (proxyRes.headers['set-cookie']) {
                proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map(c =>
                  c.replace(/Domain=[^;]+/i, 'Domain=localhost')
                   .replace(/Secure[;]?/i, '')
                   .replace(/SameSite=None/i, 'SameSite=Lax')
                );
              }
            });
          },
        },
        '/community': {
          target: env.VITE_WEB_API_BASE_URL || 'https://webapi.atm.network',
          changeOrigin: true,
          secure: true,
          cookieDomainRewrite: 'localhost',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              if (req.headers.cookie) {
                proxyReq.setHeader('Cookie', req.headers.cookie);
              }
            });
            proxy.on('proxyRes', (proxyRes) => {
              if (proxyRes.headers['set-cookie']) {
                proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map(c =>
                  c.replace(/Domain=[^;]+/i, 'Domain=localhost')
                   .replace(/Secure[;]?/i, '')
                   .replace(/SameSite=None/i, 'SameSite=Lax')
                );
              }
            });
          },
        },
        '/gameapi': {
          target: env.VITE_GAME_API_BASE_URL || 'https://gameapi.atm.network',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/gameapi/, ''),
          cookieDomainRewrite: 'localhost',
        },
      },
    },
  }
})
