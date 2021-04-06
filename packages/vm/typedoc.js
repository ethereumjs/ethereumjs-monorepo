module.exports = {
  entryPoints: ['lib'],
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
  excludePrivate: true,
  excludeProtected: true,
}
