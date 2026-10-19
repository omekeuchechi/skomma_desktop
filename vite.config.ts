import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

const alias = {
  '@': path.resolve(import.meta.dirname, 'src'),
  '@assets': path.resolve(import.meta.dirname, 'src/assets'),
  '@components': path.resolve(import.meta.dirname, 'src/components'),
  '@pages': path.resolve(import.meta.dirname, 'src/pages'),
  '@layouts': path.resolve(import.meta.dirname, 'src/layouts'),
  '@hooks': path.resolve(import.meta.dirname, 'src/hooks'),
  '@services': path.resolve(import.meta.dirname, 'src/services'),
  '@engine': path.resolve(import.meta.dirname, 'src/engine'),
  '@stores': path.resolve(import.meta.dirname, 'src/stores'),
  '@types': path.resolve(import.meta.dirname, 'src/types'),
  '@utils': path.resolve(import.meta.dirname, 'src/utils'),
  '@config': path.resolve(import.meta.dirname, 'src/config'),
  '@constants': path.resolve(import.meta.dirname, 'src/constants'),
  '@network': path.resolve(import.meta.dirname, 'src/network'),
  '@contexts': path.resolve(import.meta.dirname, 'src/contexts'),
  '@styles': path.resolve(import.meta.dirname, 'src/styles'),
  '@ui': path.resolve(import.meta.dirname, 'src/ui'),
  '@world_one': path.resolve(import.meta.dirname, 'src/world_one'),
  '@world': path.resolve(import.meta.dirname, 'src/world'),
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias,
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  build: {
    target: 'es2021',
    minify: 'oxc',
    sourcemap: false,
    outDir: 'dist',
  },
  envPrefix: ['VITE_', 'TAURI_ENV_'],
});
