import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  resolve: {
    alias: {
      Tone: 'tone',
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
