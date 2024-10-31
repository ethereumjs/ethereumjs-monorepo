import process from 'process'
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
  return { client, executionRpc: servers[0], engineRpc: servers[1] }
}

const setupRepl = async () => {
  const { client, executionRpc, engineRpc } = await setupClient()

  const replServer = repl.start({
    prompt: 'EthJS > ',
    ignoreUndefined: true,
  })

  // bootstrap contexts or modules
  replServer.context.client = client
  replServer.context.executionRpc = executionRpc._methods // TODO modify methods to only include functions and make them usable
  replServer.context.engineRpc = engineRpc._methods

  replServer.on('exit', () => {
    console.log('Exiting REPL...')
    process.exit()
  })

  // define commands
  replServer.defineCommand('getBlock', {
    help: 'Get block by number. Must be a decimal block number or prefixed hex string block ID',
    action(blockNumber: string) {
      // TODO check if prefixed hex string or bigint block number and fetch and return
      client.chain
        .getBlock(blockNumber)
        .then((block) => {
          console.log(block)
          this.displayPrompt()
        })
        .catch((err) => {
          console.error(err)
          this.displayPrompt()
        })
    },
  })

  console.log('Custom console started. Type .help for available commands.')
}

await setupRepl()
