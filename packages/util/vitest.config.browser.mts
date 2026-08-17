import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.config.browser.mts'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      // kzg-wasm doesn't ship with source maps, causing vitest browser to fail
      // when trying to parse stack traces. These tests run in Node.js instead.
      exclude: [...configDefaults.exclude, 'test/bench/kzg.bench.ts', 'test/kzg.spec.ts'],
    },
  }),
)
