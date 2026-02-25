import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Optional: keeps the same output folder name as CRA
  },
  server: {
    open: true, // Optional: opens the app in the browser automatically
  },
});
