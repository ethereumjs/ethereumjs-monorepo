import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [wasm(), topLevelAwait()],
  test: {
    exclude: ['test/versionedHashes.spec.ts', 'test/precompiles/0a-pointevaluation.spec.ts'], // KZG based tests fail since c-kzg doesn't work in browser
  },
})
