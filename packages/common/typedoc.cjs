module.exports = {
  extends: '../../config/typedoc.cjs',
  entryPoints: ['src'],
  out: 'docs',
  exclude: ['test/**/**', 'src/chains/**', 'src/eips/**', 'src/hardforks/**'],
}
