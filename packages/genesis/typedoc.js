module.exports = {
  extends: '../../config/typedoc.js',
  entryPoints: ['src'],
  out: 'docs',
  exclude: ['test/**/*.ts', 'src/db/**', 'src/clique.ts'],
}
