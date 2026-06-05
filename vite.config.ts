import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  resolve: {
    alias: {
      '@': '/src',
      '@app': '/src/app',
      '@audio': '/src/audio',
      '@generators': '/src/generators',
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
