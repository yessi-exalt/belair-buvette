/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  build: {
    target: 'node24',
    ssr: true,
    rollupOptions: {
      input: resolve(import.meta.dirname, 'src/index.ts'),
      external: [/^node:/, '@CHANGE_ME/domain', '@CHANGE_ME/infrastructure'],
      output: {
        format: 'esm',
      },
    },
  },
  test: {
    globals: true,
    environment: 'node',
  },
})
