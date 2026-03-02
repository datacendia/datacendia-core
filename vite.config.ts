import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        secure: false,
      },
    },
    watch: {
      ignored: ['**/data/**'],
    },
    // Security headers for development
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },
  build: {
    // Use esbuild for minification (faster, built-in)
    minify: 'esbuild',
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core React ecosystem
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/react-router')) {
            return 'react-vendor';
          }
          // Large visualization libraries
          if (id.includes('node_modules/cytoscape')) {
            return 'cytoscape';
          }
          // Icons library
          if (id.includes('node_modules/lucide-react')) {
            return 'lucide';
          }
          // MUI components (large)
          if (id.includes('node_modules/@mui')) {
            return 'mui-vendor';
          }
          // Radix UI components
          if (id.includes('node_modules/@radix-ui')) {
            return 'radix-vendor';
          }
          // Date/time libraries
          if (id.includes('node_modules/date-fns') || id.includes('node_modules/dayjs')) {
            return 'date-vendor';
          }
          // Form libraries
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/zod')) {
            return 'form-vendor';
          }
          // Chart libraries
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3')) {
            return 'chart-vendor';
          }
          // Socket.io
          if (id.includes('node_modules/socket.io')) {
            return 'socket-vendor';
          }
          // i18n
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) {
            return 'i18n-vendor';
          }
          // Markdown/code
          if (id.includes('node_modules/react-markdown') || id.includes('node_modules/prismjs')) {
            return 'markdown-vendor';
          }
        },
      },
    },
    // Increase chunk size warning limit (we're code-splitting now)
    chunkSizeWarningLimit: 500,
    // Source maps for production debugging (optional)
    sourcemap: false,
  },
  // Optimize deps for faster cold starts
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'clsx'],
    exclude: ['data'],
  },
})
