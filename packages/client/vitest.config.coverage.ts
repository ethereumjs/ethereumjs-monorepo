import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    silent: true,
    exclude: ['test/integration', 'test/sim', 'test/cli/*.spec.ts', 'test/logging.spec.ts'],
    testTimeout: 300000,
    alias: { '@polkadot/util': 'false' },
    typecheck: {
      tsconfig: './tsconfig.prod.esm.json',
    },
    coverage: {
      provider: 'v8',
      enabled: true,
      reporter: ['lcov'],
    },
  },
})
