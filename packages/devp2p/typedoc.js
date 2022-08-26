module.exports = {
  extends: '../../config/typedoc.js',
  entryPoints: ['src'],
  out: 'docs',
  exclude: ['test/**/*.ts', 'examples/*.ts', 'src/protocol/protocol.ts'],
}
