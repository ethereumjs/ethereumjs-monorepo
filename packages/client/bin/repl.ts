import repl from 'repl'

const setupClient = async () => {
  const { readFileSync } = await import('fs')

  const { createCommonFromGethGenesis } = await import('@ethereumjs/common')
  const { createInlineClient } = await import('../test/sim/simutils.ts')
  const { Config } = await import('../src/config.ts')
  const { getLogger } = await import('../src/logging.ts')
  const { startRPCServers } = await import('./startRPC.ts')
  const genesisFile = JSON.parse(readFileSync('./bin/genesis.json', 'utf-8'))
  const chainName = 'pectra'
  const common = createCommonFromGethGenesis(genesisFile, {
    chain: chainName,
  })
  const config = new Config({
    common,
    logger: getLogger({ logLevel: 'info' }),
    saveReceipts: true,
    enableSnapSync: true,
  })
  const client = await createInlineClient(config, common, {}, '', true)
  const servers = startRPCServers(client, {
    rpc: true,
    rpcAddr: '0.0.0.0',
    rpcPort: 8545,
    ws: false,
    wsPort: 0,
    wsAddr: '0.0.0.0',
    rpcEngine: true,
    rpcEngineAddr: '0.0.0.0',
    rpcEnginePort: 8551,
    wsEngineAddr: '0.0.0.0',
    wsEnginePort: 8552,
    rpcDebug: 'eth',
    rpcDebugVerbose: 'false',
    helpRPC: false,
    jwtSecret: '',
    rpcEngineAuth: false,
    rpcCors: '',
  })
  return client
}

const client = await setupClient()

const replServer = repl.start({
  prompt: 'EthJS > ',
  ignoreUndefined: true,
})

replServer.context.client = client

console.log('Custom console started. Type .help for available commands.')
