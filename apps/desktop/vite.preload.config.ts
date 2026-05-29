import { defineConfig } from 'vite';
export default defineConfig({ build: { lib: { entry: 'src/main/preload.ts', fileName: () => 'preload.js', formats: ['cjs'] } } });