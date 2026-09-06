import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), reactRouter()],
  build: {
    outDir: 'build', // Optional: keeps the same output folder name as CRA
  },
  server: {
    open: true, // Optional: opens the app in the browser automatically
  },
});
