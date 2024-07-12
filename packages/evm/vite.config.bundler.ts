import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import { defineConfig } from 'vitest/config'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [wasm(), topLevelAwait(), visualizer({ open: true, gzipSize: true })],
  build: {
    rollupOptions: {
      // We choose safest to get worst case values
      treeshake: 'safest',
    },
    lib: {
      entry: '../statemanager/examples/simple.ts',
      name: '@ethereumjs/statemanager',
      fileName: (format) => `ethereumjs-statemanager-bundle.${format}.js`,
      // only build for es
      formats: ['es'],
    },
  },
})
