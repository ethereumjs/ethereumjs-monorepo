import { defineConfig } from 'vitest/config'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'chrome',
      headless: true,
    },
  },
  plugins: [nodePolyfills()],
})
