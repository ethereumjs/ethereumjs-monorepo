import process from 'process'
import repl from 'repl'

import { createInlineClient } from '../src/util/index.js'

import { startRPCServers } from './startRPC.js'
import { generateClientConfig, getArgs } from './utils.js'

import type { Config } from '../src/config.js'
import type { ClientOpts } from '../src/types.js'
import type { Common } from '@ethereumjs/common'
import type { GenesisState } from '@ethereumjs/util'

const setupClient = async (
  config: Config,
  customGenesisState: GenesisState,
  common: Common,
  args: ClientOpts,
) => {
  const client = await createInlineClient(
    config,
    common,
    customGenesisState,
    args.dataDir ?? '',
    true,
  )
  const servers = startRPCServers(client, {
    rpc: true,
    rpcAddr: args.rpcAddr ?? '0.0.0.0',
    rpcPort: args.rpcPort ?? 8545,
    rpcEngine: true,
    rpcEngineAddr: args.rpcEngineAddr ?? '0.0.0.0',
    rpcEnginePort: args.rpcEnginePort ?? 8551,
    ws: false,
    wsPort: args.wsPort ?? 0,
    wsAddr: args.wsAddr ?? '0.0.0.0',
    wsEngineAddr: args.wsEngineAddr ?? '0.0.0.0',
    wsEnginePort: args.wsEnginePort ?? 8552,
    rpcDebug: args.rpcDebug ?? 'eth',
    rpcDebugVerbose: args.rpcDebugVerbose ?? 'false',
    helpRPC: args.helpRPC ?? false,
    jwtSecret: '',
    rpcEngineAuth: false,
    rpcCors: '',
  })

  return { client, executionRPC: servers[0], engineRPC: servers[1] }
}

const activateRPCMethods = async (replServer: repl.REPLServer, allRPCMethods: any) => {
  function defineRPCAction(context: repl.REPLServer, methodName: string, params: string) {
    let parsedParams
    try {
      parsedParams = JSON.parse(params)
    } catch (e) {
      console.log(e)
    }
    allRPCMethods[methodName]
      .handler(params === '' ? '[]' : parsedParams)
      .then((result: any) => console.log(result))
      .catch((err: any) => console.error(err))
    context.displayPrompt()
  }

  // activate all rpc methods (execution and engine) as repl commands
  for (const methodName of Object.keys(allRPCMethods)) {
    replServer.defineCommand(methodName, {
      help: `Execute ${methodName}. Example usage: .${methodName} [params].`, // TODO see if there is a better way to format or self document, here
      action(params) {
        defineRPCAction(this, methodName, params)
      },
    })
  }
}

const setupRepl = async (args: ClientOpts) => {
  const { config, customGenesisState, common } = await generateClientConfig(args)
  const { client, executionRPC, engineRPC } = await setupClient(
    config,
    customGenesisState!, // TODO: figure out if this param is mandatory
    common,
    args,
  )
  //@ts-ignore  the `_methods` function is not documented in the jayson types
  const allRPCMethods = { ...executionRPC._methods, ...engineRPC._methods }

  const replServer = repl.start({
    prompt: 'EthJS > ',
    ignoreUndefined: true,
  })

  replServer.context.client = client
  replServer.on('exit', async () => {
    console.log('Exiting REPL...')
    await client.stop()
    replServer.close()
    process.exit()
  })

  await activateRPCMethods(replServer, allRPCMethods)

  // TODO define more commands similar to geth admin package to allow basic tasks like knowing when the client is fully synced
}

await setupRepl(getArgs())
