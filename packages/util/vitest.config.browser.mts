import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.config.browser.mts'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      exclude: [...configDefaults.exclude, 'test/provider.spec.ts'],
    },
  })
)
