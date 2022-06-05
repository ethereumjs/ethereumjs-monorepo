module.exports = {
  extends: '../../config/typedoc.cjs',
  entryPoints: ['src'],
  out: 'docs',
  exclude: ['tests/**/*.ts', 'src/bloom/*.ts', 'src/evm/**', 'src/state/cache.ts'],
}
