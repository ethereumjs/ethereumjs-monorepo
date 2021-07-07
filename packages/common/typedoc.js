module.exports = {
  extends: '../../config/typedoc.js',
  exclude: [
    'tests/**/**',
    'src/chains/**',
    'src/eips/**',
    'src/hardforks/**'
  ],
}