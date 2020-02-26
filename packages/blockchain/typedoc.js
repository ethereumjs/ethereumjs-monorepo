module.exports = {
  inputFiles: ['src/*.ts'],
  mode: 'library',
  out: 'docs',
  plugin: 'typedoc-plugin-markdown',
  readme: 'none',
  gitRevision: 'master',
  exclude: [
    'test/**/*.ts',
    'src/cache.ts',
    'src/callbackify.ts',
    'src/dbManager.ts',
    'src/util.ts',
  ],
  excludeNotExported: true,
  excludePrivate: true,
  excludeProtected: true,
}
