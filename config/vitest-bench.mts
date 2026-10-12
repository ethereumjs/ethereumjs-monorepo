import path from 'node:path'
import { fileURLToPath } from 'node:url'

import codspeedPlugin from '@codspeed/vitest-plugin'
import { configDefaults, defineConfig } from 'vitest/config'

const configDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.join(configDir, '..')

const benchPackages = [
  'binarytree',
  'block',
  'evm',
  'mpt',
  'rlp',
  'statemanager',
  'tx',
  'util',
  'vm',
] as const

export default defineConfig({
  root: repoRoot,
  // Always register; no-ops locally without CodSpeed instrumentation (see plugin README).
  plugins: [codspeedPlugin()],
  test: {
    environment: 'node',
    include: benchPackages.map((pkg) => `packages/${pkg}/benchmarks/**/*.bench.ts`),
    exclude: [
      ...configDefaults.exclude,
      'packages/**/test/**',
      '**/test/bench/**',
      'packages/util/test/bench/**',
      '**/*.local.bench.ts',
    ],
    benchmark: {
      enabled: true,
      include: benchPackages.map((pkg) => `packages/${pkg}/benchmarks/**/*.bench.ts`),
      exclude: ['**/test/**', '**/*.local.bench.ts'],
    },
  },
  environments: {
    ssr: {
      resolve: {
        conditions: ['typescript'],
      },
    },
  },
})
