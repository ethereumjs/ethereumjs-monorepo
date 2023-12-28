import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    silent: true,
    exclude: ['test/cli.spec.ts'],
    testTimeout: 180000,
  },
})
