import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/__tests__/**', 'src/index.ts'],
    },
  },
  resolve: {
    alias: {
      '@core': new URL('./src/core', import.meta.url).pathname,
      '@modules': new URL('./src/modules', import.meta.url).pathname,
      '@components': new URL('./src/components', import.meta.url).pathname,
    },
  },
})
