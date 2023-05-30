const path = require('path')
const { resolve } = require('path')
const { ProvidePlugin } = require('webpack')

module.exports = {
  mode: 'production',
  entry: './dist.browser/browser/index.js',
  plugins: [
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'file-replace-loader',
        options: {
          condition: 'always',
          replacement(resourcePath) {
            const mapping = {
              [resolve('./dist.browser/src/logging.js')]: resolve(
                './dist.browser/browser/logging.js'
              ),
              [resolve('./dist.browser/src/net/peer/libp2pnode.js')]: resolve(
                './dist.browser/browser/libp2pnode.js'
              ),
              [resolve('./dist.browser/src/util/index.js')]: resolve(
                './dist.browser/browser/util/index.js'
              ),
            }
            return mapping[resourcePath]
          },
          async: true,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
    library: 'ethereumjs',
  },
  resolve: {
    alias: {
      util: path.resolve(__dirname, 'node_modules/util/util.js'),
    },
    fallback: {
      async_hooks: false, // used by: raw-body via body-parser
      buffer: require.resolve('buffer'),
      constants: require.resolve('constants-browserify'),
      crypto: require.resolve('crypto-browserify'), // used by: rlpxpeer, bin/cli.ts
      dgram: false, // used by: rlpxpeer via @ethereumjs/devp2p
      http: false, // used by: jayson
      https: false, // used by: jayson
      fs: false, // used by: FullSynchronizer via @ethereumjs/vm
      net: false, // used by: rlpxpeer
      os: require.resolve('os-browserify/browser'), // used by: bin/cli.ts, web3_clientVersion rpc
      path: false, // used by: bin/cli.ts
      stream: require.resolve('stream-browserify'), // used by: fetcher
      tls: false, // used by: jayson,
      util: require.resolve('util/'), // used by: evm
      zlib: false, // used by: body-parser
    },
  },
  performance: {
    hints: false, // suppress maxAssetSize warnings etc..
  },
  externals: ['dns'],
}
