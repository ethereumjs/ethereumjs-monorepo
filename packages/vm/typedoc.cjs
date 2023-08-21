module.exports = {
  extends: '../../config/typedoc.cjs',
  entryPoints: ['src'],
  out: 'docs',
  exclude: ['test/**/*.ts', 'src/bloom/*.ts', 'src/evm/**', 'src/state/cache.ts'],
}
