module.exports = {
  extends: '../../config/typedoc.js',
  exclude: [
    'tests/**/*.ts',
    'src/bloom/*.ts',
    'src/evm/**',
    'src/state/cache.ts',
  ],
}