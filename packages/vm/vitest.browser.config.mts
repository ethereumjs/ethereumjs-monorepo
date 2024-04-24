import { configDefaults, defineConfig } from 'vitest/config'

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
      // path.resolve is not a function
      'test/tester/config.spec.ts',
      // Cannot read properties of undefined (reading 'pedersen_hash')
      'test/api/EIPs/eip-6800-verkle.spec.ts'
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