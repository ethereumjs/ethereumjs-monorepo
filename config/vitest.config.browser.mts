import { defineConfig } from 'vitest/config'

const config = defineConfig({
  test: {
    browser: {
      enabled: true,
      headless: true,
      fileParallelism: false,
      provider: 'playwright',
      instances: [
        {
          browser: 'chromium',
          headless: true,
          isolate: true,
        },
      ],
    },
    maxConcurrency: 1,
    testTimeout: 30000,
    hookTimeout: 50000,
    fileParallelism: false,
  },
  optimizeDeps: {
    exclude: ['kzg-wasm'],
  },
})

export default config
