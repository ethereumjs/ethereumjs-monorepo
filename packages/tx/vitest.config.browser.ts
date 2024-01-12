import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.config.browser'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      exclude: [
        // c-kzg dependency
        'test/eip4844.spec.ts',
        // default export for minimist
        // wrong ethereum-tests path reference (../ is stripped)
        'test/transactionRunner.spec.ts',
      ],
    },
  })
)
