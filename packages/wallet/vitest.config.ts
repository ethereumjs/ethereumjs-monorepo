import { defineConfig } from 'vitest/config'

const config = defineConfig({
  test: {
    testTimeout: 10000,
    coverage: {
      include: ['src/**'],
    },
  },

  // Add your configuration options here
})

export default config
