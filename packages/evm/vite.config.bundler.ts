import { visualizer } from 'rollup-plugin-visualizer'
import topLevelAwait from 'vite-plugin-top-level-await'
import wasm from 'vite-plugin-wasm'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [wasm(), topLevelAwait(), visualizer({ open: true, gzipSize: true })],
  build: {
    rollupOptions: {
      // We choose safest to get worst case values
      treeshake: 'safest',
    },
    lib: {
      entry: './src/',
      name: '@ethereumjs/evm',
      fileName: (format) => `ethereumjs-evm-bundle.${format}.js`,
      // only build for es
      formats: ['es'],
    },
  },
})
