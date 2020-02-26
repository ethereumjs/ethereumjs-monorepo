module.exports = {
  inputFiles: ['src/*.ts', 'src/genesisStates/*.ts'],
  mode: 'library',
  out: 'docs',
  plugin: 'typedoc-plugin-markdown',
  readme: 'none',
  gitRevision: 'master',
  exclude: ['tests/**/*.ts', 'src/chains/*.ts', 'src/hardforks/*.ts'],
  excludeNotExported: true,
  excludePrivate: true,
  excludeProtected: true,
}
