module.exports = {
  extends: '../../config/typedoc.js',
  entryPoints: ['src'],
  out: 'docs',
  exclude: ['tests/**/*.ts', 'src/evm/**'],
}
