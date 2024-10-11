module.exports = {
  extends: '../../config/typedoc.cjs',
  entryPoints: ['src'],
  out: 'docs',
  exclude: ['test/**/*.ts'],
}
