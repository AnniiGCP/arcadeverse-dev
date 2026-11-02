import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  define: {
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(new Date().toISOString()),
  },
  plugins: [
    react(),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|svg|webp)$/i,
      cache: true,
      cacheLocation: 'node_modules/.cache/vite-plugin-image-optimizer',
      exclude: /legend-card-master-template-4k/,
      jpeg: {
        quality: 85,
        mozjpeg: true,
      },
      png: {
        quality: 85,
      },
      webp: {
        quality: 85,
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'https://arcadeverse.vercel.app',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            if (!res.headersSent && typeof (res as any).writeHead === 'function') {
              (res as any).writeHead(502, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Proxy error', message: (err as any).message }));
            }
          });
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    modulePreload: {
      resolveDependencies: (_filename, deps) => {
        // Prevent preloading heavy non-homepage chunks (charts, dashboard) on initial page load
        return deps.filter(
          (dep) =>
            !dep.includes('vendor-charts') &&
            !dep.includes('ArcadeVerseDashboard') &&
            !dep.includes('CompleteGuidePage') &&
            !dep.includes('FacilitatorPage') &&
            !dep.includes('SupportPage')
        );
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tooltip',
            'lucide-react',
            '@tabler/icons-react',
          ],
          'vendor-charts': ['recharts'],
          'vendor-motion': ['framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});
