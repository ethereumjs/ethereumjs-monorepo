import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    silent: true,
    exclude: ['test/integration', 'test/sim', 'test/cli'],
    testTimeout: 60000,
  },
})
