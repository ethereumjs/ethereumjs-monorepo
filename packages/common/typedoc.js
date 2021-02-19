module.exports = {
  inputFiles: ['src/*.ts', 'src/genesisStates/*.ts'],
  mode: 'library',
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
  excludeNotExported: true,
  excludePrivate: true,
  excludeProtected: true,
}
