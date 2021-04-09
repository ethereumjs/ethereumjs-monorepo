module.exports = {
  entryPoints: ['src'],
  out: 'docs',
  plugin: 'typedoc-plugin-markdown',
  readme: 'none',
  gitRevision: 'master',
  exclude: [
    'test/**/*.ts',
    'src/db/**',
    'src/clique.ts',
  ],
  excludePrivate: true,
  excludeProtected: true,
}
