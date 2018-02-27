// processing of json files like package.json
import json from 'rollup-plugin-json'
// allow commonjs style imports/exports
import commonjs from 'rollup-plugin-commonjs'
// copy node.js builtins into the bundle so they are available in the browser
import builtins from 'rollup-plugin-node-builtins'
// transform the es6 code to es5
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

export default {
  input: 'lib/index.js',
  output: {
    file: 'dist/ethereumjs-vm.js',
    format: 'cjs'
  },
  external: [
    ...Object.keys(pkg.dependencies),
    'merkle-patricia-tree/secure.js'
  ],
  plugins: [
    json(),
    commonjs({
      include: ['node_modules/**']
    }),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      'presets': [
        [
          'env',
          {
            'modules': false
          }
        ]
      ],
      'plugins': [
        'external-helpers'
      ]
    }),
    builtins()
  ]
}
