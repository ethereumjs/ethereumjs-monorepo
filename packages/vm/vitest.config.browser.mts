import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.config.browser.mts'

export default mergeConfig(
  baseConfig,
  defineConfig({
    define: {
      global: 'globalThis',
    },
    test: {
      exclude: [
        ...configDefaults.exclude,
        // path.resolve is not a function
        'test/api/tester/tester.config.spec.ts',
        // Cannot read properties of undefined (reading 'pedersen_hash')
        'test/api/EIPs/eip-6800-verkle.spec.ts',
        // Uses NodeJS builtins and we don't need to fill tests in browser anyway
        'test/api/t8ntool/t8ntool.spec.ts',
      ],
    },
    resolve: {
      alias: {
        events: 'eventemitter3',
      },
    },
  }),
)
