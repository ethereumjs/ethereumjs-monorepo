import { defineConfig } from 'vitest/config'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
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
    nodePolyfills({
      include: ['util', 'fs', 'buffer', 'path'],
    }),
  ],
  optimizeDeps: {
    exclude: ['kzg-wasm'],
  },
})

export default config