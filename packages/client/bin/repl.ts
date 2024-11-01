//@ts-nocheck
import process from 'process'
import repl from 'repl'

const setupClient = async () => {
  const { readFileSync } = await import('fs')

  const { createCommonFromGethGenesis } = await import('@ethereumjs/common')

  //@ts-ignore
  const { createInlineClient } = await import('../test/sim/simutils.js')
  const { Config } = await import('../src/config.js')
  const { getLogger } = await import('../src/logging.js')
  const { startRPCServers } = await import('./startRPC.js')
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

const activateRpcMethods = async (replServer, allRpcMethods) => {
  function defineRpcAction(context, methodName: string, params: string) {
    allRpcMethods[methodName]
      .handler(params === '' ? '[]' : JSON.parse(params))
      .then((result) => console.log(result))
      .catch((err) => console.error(err))
    context.displayPrompt()
  }

  // activate all rpc methods (execution and engine) as repl commands
  for (const methodName of Object.keys(allRpcMethods)) {
    replServer.defineCommand(methodName, {
      help: `Execute ${methodName}. Example usage: .${methodName} [params].`,
      action(params) {
        defineRpcAction(this, methodName, params)
      },
    })
  }
}

const setupRepl = async () => {
  const { client, executionRpc, engineRpc } = await setupClient()
  const allRpcMethods = { ...executionRpc._methods, ...engineRpc._methods }

  const replServer = repl.start({
    prompt: 'EthJS > ',
    ignoreUndefined: true,
  })
  replServer.on('exit', () => {
    console.log('Exiting REPL...')
    process.exit()
  })

  await activateRpcMethods(replServer, allRpcMethods)

  // TODO define more commands similar to geths admin package to allow basic tasks like knowing when the client is fully synced
}

await setupRepl()
