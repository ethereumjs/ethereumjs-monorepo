import { defineConfig } from 'vitest/config'

const config = defineConfig({
  test: {
    silent: true,
    testTimeout: 180000,
    coverage: {
      provider: 'v8',
      enabled: true,
      all: true,
    },
  },
  optimizeDeps: {
    exclude: ['kzg-wasm'],
  },
})

export default config