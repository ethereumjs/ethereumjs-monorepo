import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.config.mts'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      silent: true,
      exclude: ['test/integration', 'test/sim', 'test/cli'],
      testTimeout: 300000,
      alias: { '@polkadot/util': 'false' },
      typecheck: {
        tsconfig: './tsconfig.prod.esm.json',
      },
    },
  }),
)
