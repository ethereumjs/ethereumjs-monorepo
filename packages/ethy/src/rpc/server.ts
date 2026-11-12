import * as http from 'node:http'

import type { ChainConfig } from '@ethereumjs/common'
import type { FlatStateManager } from '@ethereumjs/statemanager'

import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import { createEthySandbox } from '../evm/sandbox.ts'
import type { EthySpine } from '../spine/types.ts'
import { RpcBlockWindowStore } from './blockWindowStore.ts'
import { type RpcHandlerContext, dispatchRpcMethod, initRpcTelemetry } from './methods.ts'
import type { JsonRpcResponse, RpcBundleNote } from './types.ts'

const BODY_MAX_BYTES = 1_048_576
const BATCH_MAX = 64
export const RPC_PORT_DEFAULT = 8545
export const RPC_PORT_MAX = 8555

export type JsonRpcHandle = {
  stop: () => Promise<void>
  noteBundle: (input: RpcBundleNote) => void
  blockWindow: RpcBlockWindowStore
}

export type StartJsonRpcOpts = {
  spine: EthySpine
  stateManager: FlatStateManager
  chain: ChainConfig
  hardfork: string
  demo: boolean
  host?: string
  port?: number
  portExplicit?: boolean
  economy?: ETHEconomyDataManager
  blockWindow?: RpcBlockWindowStore
  submitRawTransaction?: RpcHandlerContext['submitRawTransaction']
}

function recordCall(
  spine: EthySpine,
  method: string,
  status: 'ok' | 'err',
  durationMs: number,
): void {
  const rpc = spine.rpc
  if (rpc === undefined) return
  rpc.totalRequests += 1
  if (status === 'err') rpc.totalErrors += 1
  rpc.lastMethod = method
  rpc.lastRequestAt = Date.now()
  const row = rpc.methodStats[method] ?? { calls: 0, errors: 0, lastLatencyMs: 0 }
  row.calls += 1
  if (status === 'err') row.errors += 1
  row.lastLatencyMs = durationMs
  rpc.methodStats[method] = row
  rpc.recentCalls.unshift({ timestamp: Date.now(), method, status, durationMs })
  if (rpc.recentCalls.length > 32) rpc.recentCalls.length = 32
}

async function handleOne(ctx: RpcHandlerContext, rawBody: unknown): Promise<JsonRpcResponse> {
  if (rawBody === null || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
    return { jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid Request' } }
  }
  const body = rawBody as { jsonrpc?: string; method?: string; params?: unknown; id?: unknown }
  const id = body.id === undefined ? null : (body.id as string | number | null)
  if (body.jsonrpc !== '2.0' || typeof body.method !== 'string') {
    return { jsonrpc: '2.0', id, error: { code: -32600, message: 'Invalid Request' } }
  }
  const params = Array.isArray(body.params) ? body.params : []
  const started = performance.now()
  const out = await dispatchRpcMethod(ctx, body.method, params)
  const durationMs = Math.round(performance.now() - started)
  recordCall(ctx.spine, body.method, out.error !== undefined ? 'err' : 'ok', durationMs)
  if (out.error !== undefined) {
    return { jsonrpc: '2.0', id, error: out.error }
  }
  return { jsonrpc: '2.0', id, result: out.result }
}

function listenOnPort(server: http.Server, host: string, port: number): Promise<number> {
  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, host, () => {
      server.removeAllListeners('error')
      const addr = server.address()
      if (addr !== null && typeof addr === 'object') {
        resolve(addr.port)
      } else {
        resolve(port)
      }
    })
  })
}

export async function startJsonRpcServer(
  opts: StartJsonRpcOpts,
): Promise<JsonRpcHandle | undefined> {
  initRpcTelemetry(opts.spine, opts.spine.rpc?.enabled ?? true)
  const rpc = opts.spine.rpc!
  rpc.enabled = true
  const host = opts.host ?? '127.0.0.1'
  const requestedPort = opts.port ?? RPC_PORT_DEFAULT
  const portExplicit = opts.portExplicit === true
  const blockWindow = opts.blockWindow ?? new RpcBlockWindowStore(opts.chain, opts.hardfork)
  const sandbox = createEthySandbox({
    spine: opts.spine,
    stateManager: opts.stateManager,
    chain: opts.chain,
    hardfork: opts.hardfork,
    blockWindow,
  })
  const ctx: RpcHandlerContext = {
    spine: opts.spine,
    stateManager: opts.stateManager,
    chain: opts.chain,
    hardfork: opts.hardfork,
    demo: opts.demo,
    blockWindow,
    economy: opts.economy,
    sandbox,
    submitRawTransaction: opts.submitRawTransaction,
  }

  const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'content-type')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    if (req.method === 'OPTIONS') {
      res.writeHead(204)
      res.end()
      return
    }
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: { code: -32600, message: 'POST required' } }))
      return
    }
    const chunks: Buffer[] = []
    let size = 0
    for await (const chunk of req) {
      const buf = chunk as Buffer
      size += buf.length
      if (size > BODY_MAX_BYTES) {
        res.writeHead(413, { 'Content-Type': 'application/json' })
        res.end(
          JSON.stringify({
            jsonrpc: '2.0',
            id: null,
            error: { code: -32600, message: 'Request body too large' },
          }),
        )
        return
      }
      chunks.push(buf)
    }
    const raw = Buffer.concat(chunks).toString('utf8')
    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: { code: -32700, message: 'Parse error' },
        }),
      )
      return
    }
    try {
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(
            JSON.stringify({
              jsonrpc: '2.0',
              id: null,
              error: { code: -32600, message: 'Invalid Request' },
            }),
          )
          return
        }
        if (parsed.length > BATCH_MAX) {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(
            JSON.stringify({
              jsonrpc: '2.0',
              id: null,
              error: { code: -32600, message: 'Batch size exceeds limit' },
            }),
          )
          return
        }
        const batch: JsonRpcResponse[] = []
        for (const row of parsed) {
          batch.push(await handleOne(ctx, row))
        }
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(batch))
        return
      }
      const single = await handleOne(ctx, parsed)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(single))
    } catch {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: { code: -32000, message: 'Server error' },
        }),
      )
    }
  })

  let boundPort: number | undefined
  const tryPorts: number[] =
    requestedPort === 0
      ? [0]
      : portExplicit
        ? [requestedPort]
        : Array.from(
            { length: RPC_PORT_MAX - RPC_PORT_DEFAULT + 1 },
            (_, i) => RPC_PORT_DEFAULT + i,
          )

  for (const port of tryPorts) {
    try {
      boundPort = await listenOnPort(server, host, port)
      break
    } catch (e: unknown) {
      const code = (e as NodeJS.ErrnoException).code
      if (!portExplicit && code === 'EADDRINUSE') continue
      rpc.listening = false
      rpc.host = host
      rpc.port = requestedPort
      rpc.url = ''
      return {
        stop: async () => {
          await new Promise<void>((resolve) => server.close(() => resolve()))
        },
        noteBundle: (input) => blockWindow.noteBundle(input),
        blockWindow,
      }
    }
  }

  if (boundPort === undefined) {
    rpc.listening = false
    return undefined
  }

  rpc.listening = true
  rpc.host = host
  rpc.port = boundPort
  rpc.url = `http://${host}:${boundPort}`

  return {
    stop: async () => {
      rpc.listening = false
      await new Promise<void>((resolve) => server.close(() => resolve()))
    },
    noteBundle: (input) => blockWindow.noteBundle(input),
    blockWindow,
  }
}
