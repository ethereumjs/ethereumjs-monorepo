import type { ChainConfig } from '@ethereumjs/common'
import { Common } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import { createTxFromBlockBodyData } from '@ethereumjs/tx'
import { KECCAK256_NULL, createAddressFromString, hexToBytes } from '@ethereumjs/util'

import { getEthyClientVersion } from '../clientMeta.ts'
import { ethyKeccak256 } from '../crypto/keccak.ts'
import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import type { EthySandbox } from '../evm/sandbox.ts'
import { isNodeAtChainHead, localVerifiedBlock, resolveChainHeadClock } from '../spine/chainHead.ts'
import type { EthySpine } from '../spine/types.ts'
import type { RpcBlockWindowStore } from './blockWindowStore.ts'
import { headBlockNumber } from './executionContext.ts'
import { decodeRpcHeader, formatRpcBlock, formatRpcTransaction } from './formatBlock.ts'
import { type RpcLog, collectLogsFromBlock, formatRpcReceipt } from './formatReceipt.ts'
import { data32Hex, dataHex, parseData32Hex, parseQuantityHex, quantityHex } from './quantities.ts'
import type { JsonRpcError } from './types.ts'

export type RpcHandlerContext = {
  spine: EthySpine
  stateManager: FlatStateManager
  chain: ChainConfig
  hardfork: string
  demo: boolean
  blockWindow: RpcBlockWindowStore
  economy?: ETHEconomyDataManager
  sandbox: EthySandbox
  submitRawTransaction?: (hex: string) => Promise<{ result: string } | { error: JsonRpcError }>
}

const ONE_GWEI = 1_000_000_000n

export function initRpcTelemetry(spine: EthySpine, enabled: boolean): void {
  if (spine.rpc !== undefined) return
  spine.rpc = {
    enabled,
    listening: false,
    host: '127.0.0.1',
    port: 0,
    url: '',
    totalRequests: 0,
    totalErrors: 0,
    methodStats: {},
    recentCalls: [],
  }
}

function err(code: number, message: string): JsonRpcError {
  return { code, message }
}

function flatStateError(requested: bigint, head: bigint): JsonRpcError {
  return err(
    -32000,
    `Flat-state node only serves state at head (#${head.toString()}); historical state at #${requested.toString()} is not retained`,
  )
}

function resolveStateTag(
  tag: unknown,
  ctx: RpcHandlerContext,
): { blockNumber: bigint } | { error: JsonRpcError } {
  const head = headBlockNumber(ctx.spine)
  if (tag !== null && typeof tag === 'object') {
    const obj = tag as Record<string, unknown>
    if (typeof obj.blockNumber === 'string') {
      return resolveStateTag(obj.blockNumber, ctx)
    }
    if (typeof obj.blockHash === 'string') {
      const stored = ctx.blockWindow.getByHash(obj.blockHash)
      if (stored !== undefined) {
        if (stored.blockNumber !== head) return { error: flatStateError(stored.blockNumber, head) }
        return { blockNumber: head }
      }
      return { blockNumber: head }
    }
  }
  if (tag === undefined || tag === 'latest' || tag === 'pending') {
    return { blockNumber: head }
  }
  if (tag === 'safe') {
    const cl = ctx.spine.clOptimisticBlockNumber
    return { blockNumber: cl !== undefined && cl === head ? cl : head }
  }
  if (tag === 'finalized') {
    const fin = ctx.spine.clFinalizedBlockNumber
    return { blockNumber: fin !== undefined && fin === head ? fin : head }
  }
  if (typeof tag === 'string' && tag.startsWith('0x')) {
    const n = parseQuantityHex(tag)
    if (n === undefined) return { error: err(-32602, 'Invalid block tag') }
    if (n !== head) return { error: flatStateError(n, head) }
    return { blockNumber: n }
  }
  return { error: err(-32602, 'Invalid block tag') }
}

function resolveWindowTag(
  tag: unknown,
  ctx: RpcHandlerContext,
): { blockNumber: bigint } | { hash: string } | { missing: true } | { error: JsonRpcError } {
  if (tag !== null && typeof tag === 'object') {
    const obj = tag as Record<string, unknown>
    if (typeof obj.blockNumber === 'string') {
      return resolveWindowTag(obj.blockNumber, ctx)
    }
    if (typeof obj.blockHash === 'string') {
      return resolveWindowTag(obj.blockHash, ctx)
    }
  }
  if (tag === 'earliest') {
    const e = ctx.blockWindow.earliest()
    return e !== undefined ? { blockNumber: e } : { missing: true }
  }
  if (tag === 'latest' || tag === 'pending') {
    const latest = ctx.blockWindow.latest() ?? headBlockNumber(ctx.spine)
    return { blockNumber: latest }
  }
  if (tag === 'safe') {
    const n = ctx.spine.clOptimisticBlockNumber
    if (n !== undefined && ctx.blockWindow.getByNumber(n) !== undefined) return { blockNumber: n }
    const latest = ctx.blockWindow.latest()
    return latest !== undefined ? { blockNumber: latest } : { missing: true }
  }
  if (tag === 'finalized') {
    const n = ctx.spine.clFinalizedBlockNumber
    if (n !== undefined && ctx.blockWindow.getByNumber(n) !== undefined) return { blockNumber: n }
    const latest = ctx.blockWindow.latest()
    return latest !== undefined ? { blockNumber: latest } : { missing: true }
  }
  if (typeof tag === 'string' && tag.startsWith('0x')) {
    if (tag.length === 66) {
      return ctx.blockWindow.getByHash(tag.slice(2)) !== undefined
        ? { hash: tag.slice(2).toLowerCase() }
        : { missing: true }
    }
    const n = parseQuantityHex(tag)
    if (n === undefined) return { error: err(-32602, 'Invalid block quantity') }
    return ctx.blockWindow.getByNumber(n) !== undefined ? { blockNumber: n } : { missing: true }
  }
  return { error: err(-32602, 'Invalid block tag') }
}

function storedFromTag(
  resolved: ReturnType<typeof resolveWindowTag>,
  ctx: RpcHandlerContext,
): ReturnType<RpcBlockWindowStore['getByNumber']> {
  if ('blockNumber' in resolved) return ctx.blockWindow.getByNumber(resolved.blockNumber)
  if ('hash' in resolved) return ctx.blockWindow.getByHash(resolved.hash)
  return undefined
}

function medianTipWei(ctx: RpcHandlerContext): bigint {
  const latestN = ctx.blockWindow.latest()
  if (latestN === undefined) return ONE_GWEI
  const stored = ctx.blockWindow.getByNumber(latestN)
  if (stored?.bodyRlp === undefined) return ONE_GWEI
  const common = new Common({ chain: ctx.chain, hardfork: ctx.hardfork })
  const tips: bigint[] = []
  try {
    const body = RLP.decode(stored.bodyRlp) as unknown
    if (Array.isArray(body) && Array.isArray(body[0])) {
      for (const raw of body[0]) {
        const tx = createTxFromBlockBodyData(raw as Uint8Array | Uint8Array[], { common })
        if ('maxPriorityFeePerGas' in tx && tx.maxPriorityFeePerGas !== undefined) {
          tips.push(tx.maxPriorityFeePerGas)
        } else if ('gasPrice' in tx && tx.gasPrice !== undefined && stored.headerRlp) {
          const header = decodeRpcHeader(
            stored.headerRlp,
            ctx.chain,
            ctx.hardfork,
            stored.blockNumber,
          )
          const base = header.baseFeePerGas ?? 0n
          if (tx.gasPrice > base) tips.push(tx.gasPrice - base)
        }
      }
    }
  } catch {
    return ONE_GWEI
  }
  if (tips.length === 0) return ONE_GWEI
  tips.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
  return tips[Math.floor(tips.length / 2)]!
}

function latestBaseFee(ctx: RpcHandlerContext): bigint {
  const latestN = ctx.blockWindow.latest()
  if (latestN === undefined) return 0n
  const stored = ctx.blockWindow.getByNumber(latestN)
  if (stored === undefined) return 0n
  try {
    const header = decodeRpcHeader(stored.headerRlp, ctx.chain, ctx.hardfork, stored.blockNumber)
    return header.baseFeePerGas ?? 0n
  } catch {
    return 0n
  }
}

export async function dispatchRpcMethod(
  ctx: RpcHandlerContext,
  method: string,
  params: unknown[],
): Promise<{ result?: unknown; error?: JsonRpcError }> {
  switch (method) {
    case 'web3_clientVersion': {
      const ver = getEthyClientVersion()
      const platform = `${process.platform}-${process.arch}`
      return { result: `ethy/v${ver}/${platform}/node-${process.version}` }
    }
    case 'web3_sha3': {
      const data = params[0]
      if (typeof data !== 'string' || !data.startsWith('0x')) {
        return { error: err(-32602, 'Expected 0x-prefixed data hex string') }
      }
      try {
        const bytes = hexToBytes(data as `0x${string}`)
        return { result: dataHex(ethyKeccak256(bytes)) }
      } catch {
        return { error: err(-32602, 'Invalid hex data') }
      }
    }
    case 'net_version':
      return { result: ctx.spine.chainId.toString(10) }
    case 'net_listening':
      return { result: ctx.demo || ctx.spine.peers.size > 0 }
    case 'net_peerCount':
      return { result: quantityHex(BigInt(ctx.spine.peers.size)) }
    case 'eth_chainId':
      return { result: quantityHex(ctx.spine.chainId) }
    case 'eth_syncing': {
      if (ctx.demo || isNodeAtChainHead(ctx.spine)) return { result: false }
      const clock = resolveChainHeadClock(ctx.spine)
      const current = localVerifiedBlock(ctx.spine) ?? 0n
      const highest = clock?.chainHeadBlock ?? ctx.spine.bestPeerHead ?? current
      const starting = ctx.spine.pivotBlockNumber ?? 0n
      return {
        result: {
          startingBlock: quantityHex(starting),
          currentBlock: quantityHex(current),
          highestBlock: quantityHex(highest),
        },
      }
    }
    case 'eth_blockNumber':
      return { result: quantityHex(headBlockNumber(ctx.spine)) }
    case 'eth_getBalance': {
      const addrRaw = params[0]
      if (typeof addrRaw !== 'string') return { error: err(-32602, 'Invalid address') }
      const resolved = resolveStateTag(params[1], ctx)
      if ('error' in resolved) return { error: resolved.error }
      try {
        const addr = createAddressFromString(addrRaw)
        const acc = await ctx.stateManager.getAccount(addr)
        return { result: quantityHex(acc?.balance ?? 0n) }
      } catch {
        return { error: err(-32602, 'Invalid address') }
      }
    }
    case 'eth_getTransactionCount': {
      const addrRaw = params[0]
      if (typeof addrRaw !== 'string') return { error: err(-32602, 'Invalid address') }
      const resolved = resolveStateTag(params[1], ctx)
      if ('error' in resolved) return { error: resolved.error }
      try {
        const addr = createAddressFromString(addrRaw)
        const acc = await ctx.stateManager.getAccount(addr)
        return { result: quantityHex(acc?.nonce ?? 0n) }
      } catch {
        return { error: err(-32602, 'Invalid address') }
      }
    }
    case 'eth_getCode': {
      const addrRaw = params[0]
      if (typeof addrRaw !== 'string') return { error: err(-32602, 'Invalid address') }
      const resolved = resolveStateTag(params[1], ctx)
      if ('error' in resolved) return { error: resolved.error }
      try {
        const addr = createAddressFromString(addrRaw)
        const acc = await ctx.stateManager.getAccount(addr)
        if (acc === undefined || acc.codeHash.every((b, i) => b === KECCAK256_NULL[i])) {
          return { result: '0x' }
        }
        const code = await ctx.stateManager.getCode(addr)
        return { result: dataHex(code) }
      } catch {
        return { error: err(-32602, 'Invalid address') }
      }
    }
    case 'eth_getStorageAt': {
      const addrRaw = params[0]
      const slotRaw = params[1]
      if (typeof addrRaw !== 'string' || typeof slotRaw !== 'string') {
        return { error: err(-32602, 'Invalid params') }
      }
      const resolved = resolveStateTag(params[2], ctx)
      if ('error' in resolved) return { error: resolved.error }
      const slot = parseData32Hex(slotRaw)
      if (slot === undefined) return { error: err(-32602, 'Invalid slot') }
      try {
        const addr = createAddressFromString(addrRaw)
        const value = await ctx.stateManager.getStorage(addr, slot)
        return { result: data32Hex(value) }
      } catch {
        return { error: err(-32602, 'Invalid address or slot') }
      }
    }
    case 'eth_getBlockByNumber': {
      const tag = params[0]
      const full = params[1] === true
      const resolved = resolveWindowTag(tag, ctx)
      if ('error' in resolved) return { error: resolved.error }
      if ('missing' in resolved) return { result: null }
      const stored = storedFromTag(resolved, ctx)
      if (stored === undefined) return { result: null }
      return { result: formatRpcBlock(stored, ctx.chain, ctx.hardfork, full) }
    }
    case 'eth_getBlockByHash': {
      const hash = params[0]
      const full = params[1] === true
      if (typeof hash !== 'string') return { error: err(-32602, 'Invalid hash') }
      const stored = ctx.blockWindow.getByHash(hash.replace(/^0x/i, '').toLowerCase())
      if (stored === undefined) return { result: null }
      return { result: formatRpcBlock(stored, ctx.chain, ctx.hardfork, full) }
    }
    case 'eth_getBlockTransactionCountByNumber': {
      const resolved = resolveWindowTag(params[0], ctx)
      if ('error' in resolved) return { error: resolved.error }
      if ('missing' in resolved) return { result: null }
      const stored = storedFromTag(resolved, ctx)
      return { result: stored === undefined ? null : quantityHex(BigInt(stored.txHashes.length)) }
    }
    case 'eth_getBlockTransactionCountByHash': {
      if (typeof params[0] !== 'string') return { error: err(-32602, 'Invalid hash') }
      const stored = ctx.blockWindow.getByHash(params[0].replace(/^0x/i, '').toLowerCase())
      return { result: stored === undefined ? null : quantityHex(BigInt(stored.txHashes.length)) }
    }
    case 'eth_getTransactionByHash': {
      if (typeof params[0] !== 'string') return { error: err(-32602, 'Invalid hash') }
      const row = ctx.blockWindow.getTx(params[0])
      if (row === undefined) return { result: null }
      const common = new Common({ chain: ctx.chain, hardfork: ctx.hardfork })
      const tx = createTxFromBlockBodyData(row.rawTx, { common })
      return {
        result: formatRpcTransaction(
          tx,
          dataHex(row.block.blockHash),
          row.block.blockNumber,
          row.txIndex,
        ),
      }
    }
    case 'eth_getTransactionByBlockNumberAndIndex':
    case 'eth_getTransactionByBlockHashAndIndex': {
      const index = parseQuantityHex(String(params[1] ?? '0x'))
      if (index === undefined) return { error: err(-32602, 'Invalid index') }
      let stored: ReturnType<RpcBlockWindowStore['getByNumber']>
      if (method.endsWith('ByHash')) {
        if (typeof params[0] !== 'string') return { error: err(-32602, 'Invalid hash') }
        stored = ctx.blockWindow.getByHash(params[0])
      } else {
        const resolved = resolveWindowTag(params[0], ctx)
        if ('error' in resolved) return { error: resolved.error }
        if ('missing' in resolved) return { result: null }
        stored = storedFromTag(resolved, ctx)
      }
      if (stored === undefined || index >= BigInt(stored.rawTxs.length)) return { result: null }
      const rawTx = stored.rawTxs[Number(index)]
      if (rawTx === undefined) return { result: null }
      const common = new Common({ chain: ctx.chain, hardfork: ctx.hardfork })
      const tx = createTxFromBlockBodyData(rawTx, { common })
      return {
        result: formatRpcTransaction(
          tx,
          dataHex(stored.blockHash),
          stored.blockNumber,
          Number(index),
        ),
      }
    }
    case 'eth_getTransactionReceipt': {
      if (typeof params[0] !== 'string') return { error: err(-32602, 'Invalid hash') }
      const row = ctx.blockWindow.getTx(params[0])
      if (row === undefined) return { result: null }
      return {
        result: formatRpcReceipt(row.block, row.txIndex, row.rawTx, ctx.chain, ctx.hardfork),
      }
    }
    case 'eth_getBlockReceipts': {
      const resolved = resolveWindowTag(params[0], ctx)
      if ('error' in resolved) return { error: resolved.error }
      if ('missing' in resolved) return { result: null }
      const stored = storedFromTag(resolved, ctx)
      if (stored === undefined || stored.receiptsEth69Rlp === undefined) return { result: null }
      const out = []
      for (let i = 0; i < stored.rawTxs.length; i++) {
        const raw = stored.rawTxs[i]
        if (raw === undefined) continue
        const rc = formatRpcReceipt(stored, i, raw, ctx.chain, ctx.hardfork)
        if (rc !== null) out.push(rc)
      }
      return { result: out }
    }
    case 'eth_gasPrice':
      return { result: quantityHex(latestBaseFee(ctx) + medianTipWei(ctx)) }
    case 'eth_maxPriorityFeePerGas':
      return { result: quantityHex(medianTipWei(ctx)) }
    case 'eth_blobBaseFee': {
      const latestN = ctx.blockWindow.latest()
      if (latestN === undefined) return { result: '0x0' }
      const stored = ctx.blockWindow.getByNumber(latestN)
      if (stored === undefined) return { result: '0x0' }
      try {
        const header = decodeRpcHeader(
          stored.headerRlp,
          ctx.chain,
          ctx.hardfork,
          stored.blockNumber,
        )
        if (header.excessBlobGas !== undefined) {
          try {
            return { result: quantityHex(header.getBlobGasPrice()) }
          } catch {
            return { result: quantityHex(header.excessBlobGas) }
          }
        }
        return { result: '0x0' }
      } catch {
        return { result: '0x0' }
      }
    }
    case 'eth_feeHistory': {
      const count = parseQuantityHex(String(params[0] ?? '0x'))
      if (count === undefined || count <= 0n || count > 1024n) {
        return { error: err(-32602, 'Invalid blockCount') }
      }
      const resolved = resolveWindowTag(params[1] ?? 'latest', ctx)
      if ('error' in resolved) return { error: resolved.error }
      let newest: bigint
      if ('blockNumber' in resolved) newest = resolved.blockNumber
      else if ('hash' in resolved) {
        const b = ctx.blockWindow.getByHash(resolved.hash)
        if (b === undefined)
          return { result: { oldestBlock: '0x0', baseFeePerGas: [], gasUsedRatio: [] } }
        newest = b.blockNumber
      } else {
        return { result: { oldestBlock: '0x0', baseFeePerGas: [], gasUsedRatio: [] } }
      }
      const baseFeePerGas: string[] = []
      const gasUsedRatio: number[] = []
      const reward: string[][] | undefined =
        Array.isArray(params[2]) && params[2].length > 0 ? [] : undefined
      const oldest = newest >= count - 1n ? newest - (count - 1n) : 0n
      for (let n = oldest; n <= newest; n++) {
        const stored = ctx.blockWindow.getByNumber(n)
        if (stored === undefined) continue
        try {
          const header = decodeRpcHeader(
            stored.headerRlp,
            ctx.chain,
            ctx.hardfork,
            stored.blockNumber,
          )
          baseFeePerGas.push(quantityHex(header.baseFeePerGas ?? 0n))
          const ratio = header.gasLimit > 0n ? Number(header.gasUsed) / Number(header.gasLimit) : 0
          gasUsedRatio.push(Number.isFinite(ratio) ? ratio : 0)
          if (reward !== undefined) reward.push([quantityHex(medianTipWei(ctx))])
        } catch {
          // skip block
        }
      }
      return {
        result: {
          oldestBlock: quantityHex(oldest),
          baseFeePerGas,
          gasUsedRatio,
          ...(reward !== undefined ? { reward } : {}),
        },
      }
    }
    case 'eth_getLogs': {
      const filter = params[0]
      if (filter === null || typeof filter !== 'object') {
        return { error: err(-32602, 'Invalid filter object') }
      }
      const f = filter as Record<string, unknown>
      let fromN: bigint
      let toN: bigint
      if (typeof f.blockHash === 'string') {
        const stored = ctx.blockWindow.getByHash(f.blockHash.replace(/^0x/i, '').toLowerCase())
        if (stored === undefined) return { result: [] }
        fromN = stored.blockNumber
        toN = stored.blockNumber
      } else {
        const fromResolved = resolveWindowTag(f.fromBlock ?? 'latest', ctx)
        const toResolved = resolveWindowTag(f.toBlock ?? 'latest', ctx)
        if ('error' in fromResolved) return { error: fromResolved.error }
        if ('error' in toResolved) return { error: toResolved.error }
        const earliest = ctx.blockWindow.earliest()
        if (
          'blockNumber' in fromResolved &&
          earliest !== undefined &&
          fromResolved.blockNumber < earliest
        ) {
          const latest = ctx.blockWindow.latest() ?? earliest
          return {
            error: err(
              -32005,
              `Log query range begins before the 64-block rolling window (#${earliest.toString()}..#${latest.toString()})`,
            ),
          }
        }
        if ('missing' in fromResolved || 'missing' in toResolved) return { result: [] }
        fromN =
          'blockNumber' in fromResolved
            ? fromResolved.blockNumber
            : (ctx.blockWindow.getByHash(fromResolved.hash)?.blockNumber ?? 0n)
        toN =
          'blockNumber' in toResolved
            ? toResolved.blockNumber
            : (ctx.blockWindow.getByHash(toResolved.hash)?.blockNumber ?? fromN)
      }
      if (fromN > toN) return { result: [] }
      const wantAddr =
        typeof f.address === 'string'
          ? f.address.toLowerCase()
          : Array.isArray(f.address)
            ? f.address.map((a) => String(a).toLowerCase())
            : undefined
      const topics = Array.isArray(f.topics) ? f.topics : undefined
      const out: RpcLog[] = []
      for (let n = fromN; n <= toN; n++) {
        const stored = ctx.blockWindow.getByNumber(n)
        if (stored === undefined) continue
        for (const log of collectLogsFromBlock(stored, ctx.chain, ctx.hardfork)) {
          if (wantAddr !== undefined) {
            if (Array.isArray(wantAddr)) {
              if (!wantAddr.includes(log.address.toLowerCase())) continue
            } else if (log.address.toLowerCase() !== wantAddr) continue
          }
          if (topics !== undefined && topics.length > 0) {
            let ok = true
            for (let i = 0; i < topics.length; i++) {
              const rule = topics[i]
              if (rule === null) continue
              if (Array.isArray(rule)) {
                if (!rule.some((t) => t === log.topics[i])) {
                  ok = false
                  break
                }
              } else if (typeof rule === 'string' && log.topics[i] !== rule) {
                ok = false
                break
              }
            }
            if (!ok) continue
          }
          out.push(log)
        }
      }
      return { result: out }
    }
    case 'eth_getBlockAccessListByNumber': {
      const resolved = resolveWindowTag(params[0], ctx)
      if ('error' in resolved) return { error: resolved.error }
      if ('missing' in resolved) return { result: null }
      const stored = storedFromTag(resolved, ctx)
      if (stored?.balJson !== undefined) return { result: stored.balJson }
      if ('blockNumber' in resolved) {
        const entry = ctx.spine.balWindow.find((b) => b.blockNumber === resolved.blockNumber)
        return { result: entry?.balJson ?? null }
      }
      return { result: null }
    }
    case 'eth_getBlockAccessListByHash': {
      if (typeof params[0] !== 'string') return { error: err(-32602, 'Invalid hash') }
      const stored = ctx.blockWindow.getByHash(params[0].replace(/^0x/i, '').toLowerCase())
      if (stored?.balJson !== undefined) return { result: stored.balJson }
      return { result: null }
    }
    case 'ethy_status': {
      const head = localVerifiedBlock(ctx.spine)
      const clock = resolveChainHeadClock(ctx.spine)
      return {
        result: {
          network: ctx.spine.network,
          chainId: ctx.spine.chainId.toString(),
          phase: ctx.spine.phase,
          syncTransport: ctx.spine.syncTransport,
          headBlock: head?.toString(),
          chainHeadBlock: clock?.chainHeadBlock.toString(),
          clStatus: ctx.spine.clStatus,
          clParticipationPct: ctx.spine.clParticipationPct,
          totalAccountsSynced: ctx.spine.totalAccountsSynced,
          codesSynced: ctx.spine.codesSynced,
          storageSlotsSynced: ctx.spine.storageSlotsSynced,
          peersCount: ctx.spine.peers.size,
          localEnode: ctx.spine.discovery?.localEnode,
          rpcUrl: ctx.spine.rpc?.url,
        },
      }
    }
    case 'ethy_economy':
      return { result: ctx.spine.economy ?? {} }
    case 'eth_call': {
      const tx = params[0]
      const tag = params[1]
      const stateOverride = params[2]
      const resolved = resolveStateTag(tag, ctx)
      if ('error' in resolved) return { error: resolved.error }
      void resolved
      return ctx.sandbox.runEthCall(tx, stateOverride)
    }
    case 'eth_estimateGas': {
      const tx = params[0]
      const tag = params[1]
      const stateOverride = params[2]
      const resolved = resolveStateTag(tag, ctx)
      if ('error' in resolved) return { error: resolved.error }
      void resolved
      return ctx.sandbox.runEstimateGas(tx, stateOverride)
    }
    case 'eth_createAccessList': {
      const tx = params[0]
      const tag = params[1]
      const stateOverride = params[2]
      const resolved = resolveStateTag(tag, ctx)
      if ('error' in resolved) return { error: resolved.error }
      void resolved
      return ctx.sandbox.runCreateAccessList(tx, stateOverride)
    }
    case 'eth_sendRawTransaction': {
      const raw = params[0]
      if (typeof raw !== 'string') {
        return { error: err(-32602, 'Expected signed transaction hex string') }
      }
      if (ctx.submitRawTransaction === undefined) {
        return { error: err(-32000, 'Transaction pool unavailable') }
      }
      const out = await ctx.submitRawTransaction(raw)
      if ('error' in out) return out
      return { result: out.result }
    }
    default:
      return { error: err(-32601, `Method not found: ${method}`) }
  }
}
