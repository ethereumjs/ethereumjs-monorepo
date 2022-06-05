module.exports = {
  extends: '../../config/typedoc.cjs',
  entryPoints: ['src'],
  out: 'docs',
  exclude: ['tests/**/*.ts'],
}
