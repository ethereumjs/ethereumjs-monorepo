import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'

import wasm from 'vite-plugin-wasm'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      headless: true,
      isolate: true,
      name: 'chrome'
    },
    exclude: [
      ...configDefaults.exclude,
      // default export for minimist
      // wrong ethereum-tests path reference (../ is stripped)
      'test/transactionRunner.spec.ts',
    ],
  },
  plugins: [
    wasm(),
    nodePolyfills({
      include: ['util', 'fs', 'buffer', 'path'],
    }),
  ],
  optimizeDeps: {
    exclude: ['kzg-wasm'],
  }
}
)