import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  base: '/endless-dungeon/',
  plugins: [solidPlugin()],
  build: {
    outDir: 'docs',
  },
  resolve: {
    alias: {
      '@': '/src',
      '@app': '/src/app',
      '@audio': '/src/audio',
      '@generators': '/src/generators',
      '@harmony': '/src/harmony',
      '@sequencer': '/src/sequencer',
      '@state': '/src/state',
      '@ui': '/src/ui',
      '@utils': '/src/utils',
      Tone: 'tone',
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
