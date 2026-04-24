import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Let Rollup handle chunking natively to avoid React initialization issues
  },
  plugins: [
    tsconfigPaths(),
    react({
      fastRefresh: true,
    }),
    tagger()
  ],
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new'],
    hmr: {
      overlay: true,
      clientPort: 4028
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // Ensure environment variables are properly loaded
  define: {
    'process.env': {}
  }
});