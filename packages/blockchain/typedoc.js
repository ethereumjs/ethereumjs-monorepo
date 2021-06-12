module.exports = {
  extends: '../../config/typedoc.js',
  exclude: [
    'test/**/*.ts',
    'src/db/**',
    'src/clique.ts',
  ],
}