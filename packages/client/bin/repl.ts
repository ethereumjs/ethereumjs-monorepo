//@ts-nocheck
import { Chain, createCommonFromGethGenesis } from '@ethereumjs/common'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { homedir } from 'os'
import * as path from 'path'
import process from 'process'
import * as promClient from 'prom-client'
import * as readline from 'readline'
import repl from 'repl'
import * as url from 'url'
import * as yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

//@ts-ignore
import { getArgs, generateClientConfig } from './cli.js'
import { Config, SyncMode } from '../src/config.js'
import { getLogger } from '../src/logging.js'
import { createInlineClient } from '../test/sim/simutils.js'

import { startRPCServers } from './startRPC.js'

const setupClient = async (config, common) => {
  const client = await createInlineClient(config, common, {}, '', true)
  const servers = startRPCServers(client, {
    rpc: args.rpc,
    rpcAddr: args.rpcAddr,
    rpcPort: args.rpcPort,
    ws: args.ws,
    wsPort: args.wsPort,
    wsAddr: args.wsAddr,
    rpcEngine: true,
    rpcEngineAddr: args.rpcEngineAddr,
    rpcEnginePort: args.rpcEnginePort,
    wsEngineAddr: args.wsEngineAddr,
    wsEnginePort: args.wsEnginePort,
    rpcDebug: args.rpcDebug,
    rpcDebugVerbose: args.rpcDebugVerbose,
    helpRPC: args.helpRPC,
    jwtSecret: '',
    rpcEngineAuth: args.rpcEngineAuth,
    rpcCors: args.rpcCors,
  })
  return { client, executionRpc: servers[0], engineRpc: servers[1] }
}

const activateRpcMethods = async (replServer, allRpcMethods) => {
  function defineRpcAction(context, methodName: string, params: string) {
    allRpcMethods[methodName]
      .handler(params === '' ? '[]' : JSON.parse(params)) // TODO why does parse crash repl when error is caught?
      .then((result) => console.log(result))
      .catch((err) => console.error(err))
    context.displayPrompt()
  }

  // activate all rpc methods (execution and engine) as repl commands
  for (const methodName of Object.keys(allRpcMethods)) {
    replServer.defineCommand(methodName, {
      help: `Execute ${methodName}. Example usage: .${methodName} [params].`, // TODO see if there is a better way to format or self document, here
      action(params) {
        defineRpcAction(this, methodName, params)
      },
    })
  }
}

const setupRepl = async (args) => {
  const { config, customGenesisState, customGenesisStateRoot, metricsServer, common } =
    await generateClientConfig(args)
  const { client, executionRpc, engineRpc } = await setupClient(config, common)
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

const args = getArgs()
await setupRepl(args)
