import MillionLint from '@million/lint';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
const _plugins = [MillionLint.vite(), react()];
export default defineConfig({
  plugins: _plugins
});