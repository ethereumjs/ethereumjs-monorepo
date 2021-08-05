module.exports = {
  extends: '../../config/typedoc.js',
  entryPoints: ['src'],
  out: 'docs',
  exclude: ['src/index.ts', 'test/*.ts'],
}