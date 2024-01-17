import { defineConfig } from 'vitest/config'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const config = defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'chrome',
      headless: true,
    },
  },
  resolve: {
    alias: {
      events: 'eventemitter3',
      'node:stream/web': 'web-streams-polyfill/es2018',
    },
  },
  plugins: [
    nodePolyfills({
      include: ['util', 'fs', 'buffer'],
    }),
  ],
})

export default config
