import { defineConfig } from 'vitest/config'

const config = defineConfig({
  test: {
    testTimeout: 10000,
  },
})

export default config
