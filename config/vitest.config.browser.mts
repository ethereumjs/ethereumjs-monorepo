import { defineConfig } from 'vitest/config'
import wasm from 'vite-plugin-wasm'

const config = defineConfig({
  test: {
    browser: {
      enabled: true,
      headless: true,
      isolate: true,
      name: 'chrome',
      fileParallelism: false,
      provider: 'webdriverio'
    },
    maxConcurrency: 1
  },
  plugins: [
    wasm(),
  ],
  optimizeDeps: {
    
    exclude: ['kzg-wasm'],
  },
})

export default config