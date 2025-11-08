export default {
  extends: '../../config/typedoc.mjs',
  entryPoints: ['src'],
  out: 'docs',
  exclude: ['test/**/*.ts', 'src/bloom/*.ts', 'src/evm/**', 'src/state/cache.ts'],
}
