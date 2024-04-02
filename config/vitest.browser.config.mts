import { defineConfig } from 'vitest/config'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import dynamicImport from 'vite-plugin-dynamic-import'
import wasm from 'vite-plugin-wasm'

const config = defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'chrome',
      headless: true,
      fileParallelism: false,
      isolate: false
    },
  },
  resolve: {
    alias: {
      'node:stream/web': 'web-streams-polyfill/es2018',
    },
  },
  plugins: [
    wasm(),
    nodePolyfills({
      include: ['util', 'fs', 'buffer', 'path'],
    }),
    dynamicImport()
  ],
  optimizeDeps: {
    exclude: ['kzg-wasm'],
  },
})

export default config