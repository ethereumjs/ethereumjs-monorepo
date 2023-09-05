import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    silent: true,
    exclude: ['test/cli'],
    testTimeout: 180000,
  },
})
