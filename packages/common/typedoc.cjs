module.exports = {
  extends: '../../config/typedoc.cjs',
  entryPoints: ['src'],
  out: 'docs',
  exclude: ['tests/**/**', 'src/chains/**', 'src/eips/**', 'src/hardforks/**'],
}
