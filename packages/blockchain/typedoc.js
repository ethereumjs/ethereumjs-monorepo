module.exports = {
  inputFiles: ['src/*.ts'],
  mode: 'library',
  out: 'docs',
  plugin: 'typedoc-plugin-markdown',
  readme: 'none',
  gitRevision: 'master',
  exclude: [
    'test/**/*.ts',
    'src/db/**',
    'src/clique.ts',
  ],
  excludeNotExported: true,
  excludePrivate: true,
  excludeProtected: true,
}
