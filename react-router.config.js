import { vercelPreset } from '@vercel/react-router/vite';

export default {
  ssr: true, // Set to false if you are building a strict SPA
  presets: [vercelPreset()],
};
