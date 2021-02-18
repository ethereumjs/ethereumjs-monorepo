module.exports = {
  inputFiles: ['lib/*.ts'],
  mode: 'library',
  out: 'docs',
  plugin: 'typedoc-plugin-markdown',
  readme: 'none',
  gitRevision: 'master',
  exclude: [
    'tests/**/*.ts',
    'lib/bloom/*.ts',
    'lib/evm/**',
    'lib/state/cache.ts',
  ],
  excludeNotExported: true,
  excludePrivate: true,
  excludeProtected: true,
}
