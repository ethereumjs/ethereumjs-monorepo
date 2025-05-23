export default {
  extends: '../../config/typedoc.mjs',
  entryPoints: ['src'],
  out: 'docs',
  exclude: [
    'bin/cli.ts',
    'src/blockchain/index.ts',
    'src/index.ts',
    'src/net/server/index.ts',
    'src/net/peer/index.ts',
    'src/net/protocol/index.ts',
    'src/rpc/index.ts',
    'src/rpc/error-code.ts',
    'src/rpc/modules/index.ts',
    'src/service/index.ts',
    'src/sync/index.ts',
    'src/sync/fetcher/index.ts',
    'src/util/index.ts',
  ],
}
