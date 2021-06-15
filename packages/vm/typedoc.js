module.exports = {
  extends: '../../config/typedoc.js',
  entryPoints: ['lib'],
  exclude: [
    'tests/**/*.ts',
    'lib/bloom/*.ts',
    'lib/evm/**',
    'lib/state/cache.ts',
  ],
}