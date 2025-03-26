import { defineConfig } from 'vitest/config'

const config = defineConfig({
  test: {
    silent: true,
    testTimeout: 180000,
    coverage: {
      extension: ['.ts'],
      provider: 'istanbul',
      enabled: true,
      all: true,
      include: ['src/**'],
      reporter: ['html'],
    },
  },
  optimizeDeps: {
    exclude: ['kzg-wasm'],
  },
})

export default config