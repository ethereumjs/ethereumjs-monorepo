module.exports = {
  inputFiles: ['src/*.ts'],
  mode: 'library',
  out: 'docs',
  plugin: 'typedoc-plugin-markdown',
  readme: 'none',
  gitRevision: 'master',
  exclude: '**/*+(index|.spec|.e2e).ts',
  excludeNotExported: true,
  // excludePrivate: true,
  // excludeProtected: true,
}
