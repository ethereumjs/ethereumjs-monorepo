
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.config.browser.mts'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      exclude: [
        ...configDefaults.exclude,
        // path.resolve is not a function
        'test/api/tester/tester.config.spec.ts',
        // Cannot read properties of undefined (reading 'pedersen_hash')
        'test/api/EIPs/eip-6800-verkle.spec.ts'
      ],
    },
  }
  ))