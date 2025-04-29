export default {
  extends: '../../config/typedoc.mjs',
  entryPoints: ['src'],
  out: 'docs',
  exclude: ['test/*.ts'],
}
