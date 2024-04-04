import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.browser.config.mjs'
export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      silent: true,
      exclude: ['test/cli.spec.ts'],
      testTimeout: 180000,
    },
  })
)