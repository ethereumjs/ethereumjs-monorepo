import { configDefaults, defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

const config = defineConfig({
  test: {
    exclude: [...configDefaults.exclude, '**/wasmCrypto.spec.ts', '**/bn254Wasm.spec.ts'],
    browser: {
      enabled: true,
      headless: true,
      fileParallelism: false,
      provider: playwright(),
      instances: [
        {
          browser: 'chromium',
          headless: true,
          isolate: true,
        },
      ],
    },
    maxConcurrency: 1
  },
  resolve: {
    conditions: ['typescript'],
  },
  optimizeDeps: {
    exclude: ['kzg-wasm'],
  },
})

export default config
