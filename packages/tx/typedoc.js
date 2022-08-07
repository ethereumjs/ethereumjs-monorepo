module.exports = {
  extends: '../../config/typedoc.js',
  entryPoints: ['src'],
  out: 'docs',
  exclude: ['src/util.ts', 'test/**/*.ts'],
}
