import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` keeps asset paths relative, so the app works on
// https://<user>.github.io/<repo>/ without any extra configuration.
export default defineConfig({
  base: './',
  plugins: [react()],
});
