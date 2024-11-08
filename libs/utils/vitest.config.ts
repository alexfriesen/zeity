/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/utils',

  plugins: [],

  test: {
    globals: true,
    include: ['src/**/*.{test,spec}.ts'],
    reporters: ['default'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
