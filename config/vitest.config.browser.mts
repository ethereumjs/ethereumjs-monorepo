import { defineConfig } from 'vitest/config'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import topLevelAwait from 'vite-plugin-top-level-await'
import dynamicImport from 'vite-plugin-dynamic-import'

const config = defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'chrome',
      headless: true,
    },
    deps: {
      web: {
        transformAssets: false
      }
    }
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
      topLevelAwait(),
      dynamicImport()
    ],
  })

export default config
