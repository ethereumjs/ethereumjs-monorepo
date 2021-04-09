module.exports = {
  entryPoints: ['src'],
  out: 'docs',
  plugin: [
    'typedoc-plugin-markdown',
  ],
  readme: 'none',
  gitRevision: 'master',
  exclude: [
    'tests/**/**',
    'src/chains/**',
    'src/eips/**',
    'src/hardforks/**'
  ],
  excludePrivate: true,
  excludeProtected: true,
}
