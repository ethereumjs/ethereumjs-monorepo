import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.config.browser'

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [topLevelAwait()],
    test: {
      exclude: ['test/blobVersionedHashes.spec.ts', 'test/precompiles/0a-pointevaluation.spec.ts'], // KZG based tests fail since c-kzg doesn't work in browser
    },
  })
)
