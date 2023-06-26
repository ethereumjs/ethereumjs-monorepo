module.exports = {
  extends: '../../config/typedoc.js',
  entryPoints: ['src'],
  out: 'docs',
  exclude: ['test/**/*.ts', 'src/bloom/*.ts', 'src/evm/**', 'src/state/cache.ts'],
}
