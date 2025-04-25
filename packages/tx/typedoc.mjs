export default {
  extends: '../../config/typedoc.mjs',
  entryPoints: ['src'],
  out: 'docs',
  exclude: ['src/util.ts', 'test/**/*.ts'],
}
