import type { ChainConfig } from '@ethereumjs/common'
import type { FlatStateManager } from '@ethereumjs/statemanager'

import { bytesToBigInt, bytesToHex, hexToBytes } from '@ethereumjs/util'
import { ethyKeccak256 } from '../crypto/keccak.ts'
import type { EnqueueSandboxOpts } from '../evm/queue.ts'
import type { EthySandbox } from '../evm/sandbox.ts'
import { quantityHex } from '../rpc/quantities.ts'
import type { EthySpine } from '../spine/types.ts'

const NAME_SEL = hexToBytes('0x06fdde03')
const SYMBOL_SEL = hexToBytes('0x95d89b41')
const RESOLVER_SEL = hexToBytes('0x0178b8bf')
const NAME_BYTES32_SEL = hexToBytes('0x691f3431')
const ADDR_SEL = hexToBytes('0x3b3b57de')
const NEGATIVE_TTL_BLOCKS = 256
const MAX_CACHE = 512
const MAX_PROBES_PER_BLOCK = 4
const CALL_GAS = 80_000n

const ENS_REGISTRY_MAINNET = '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e'
const ENS_REVERSE_REGISTRAR = '0x084b1c3c81545d370f3634392de611caabff8148'

type CacheEntry = {
  block: bigint
  tokenName?: string
  symbol?: string
  ensName?: string
  miss?: boolean
}

type QueueItem = {
  address: string
  ensOnly: boolean
}

export class IdentityResolver {
  private readonly chain: ChainConfig
  private readonly sandbox?: EthySandbox
  private readonly spine: EthySpine
  private readonly stateManager?: FlatStateManager
  private readonly cache = new Map<string, CacheEntry>()
  private probeBudget = 0
  private queue: QueueItem[] = []
  private ensHitsCount = 0
  private tokenHitsCount = 0
  private ensBootstrapStarted = false
  private ensBootstrapReady = false

  constructor(opts: {
    chain: ChainConfig
    sandbox?: EthySandbox
    spine: EthySpine
    stateManager?: FlatStateManager
  }) {
    this.chain = opts.chain
    this.sandbox = opts.sandbox
    this.spine = opts.spine
    this.stateManager = opts.stateManager
  }

  /**
   * True when local state holds the ENS Registry bytecode (or when no stateManager
   * was supplied, e.g. mock sandbox tests). On partial code-sync pivots where ENS Registry
   * code is not yet on disk, returns false so we avoid poisoning the 256-block cache.
   */
  hasLocalEnsRegistry(): boolean {
    if (this.ensBootstrapReady) return true
    return this.hasLocalEnsRegistrySync()
  }

  private hasLocalEnsRegistrySync(): boolean {
    const chainId = BigInt(this.chain.chainId)
    if (chainId !== 1n && chainId !== 11155111n) return false
    if (this.stateManager === undefined) return true
    try {
      const hash = ethyKeccak256(hexToBytes(ENS_REGISTRY_MAINNET))
      const acc = this.stateManager.getAccountByHash(hash)
      if (acc === undefined || acc.codeHash === undefined) return false
      const code = this.stateManager.getCodeByHash(acc.codeHash)
      return code !== undefined && code.length > 0
    } catch {
      return false
    }
  }

  getStats(): {
    ensRegistryReady: boolean
    ensHits: number
    tokenHits: number
    cacheSize: number
  } {
    return {
      ensRegistryReady: this.hasLocalEnsRegistry(),
      ensHits: this.ensHitsCount,
      tokenHits: this.tokenHitsCount,
      cacheSize: this.cache.size,
    }
  }

  getEnsName(address: string): string | undefined {
    const row = this.cache.get(address.toLowerCase())
    if (row === undefined || row.miss === true) return undefined
    return row.ensName
  }

  getKnownName(address: string): string | undefined {
    const row = this.cache.get(address.toLowerCase())
    if (row === undefined || row.miss === true) return undefined
    if (row.ensName !== undefined) return row.ensName
    if (row.tokenName !== undefined && row.symbol !== undefined) {
      return `${row.tokenName} (${row.symbol})`
    }
    if (row.tokenName !== undefined) return row.tokenName
    return undefined
  }

  /**
   * On-demand cached lookup (used by AI forensics so subject + embedded addresses
   * have verified ENS / token identity ready before story generation).
   */
  /** One-shot ENS registry warm-up on live head (identity lane, swarm-only). */
  async warmEnsBootstrap(): Promise<void> {
    if (this.ensBootstrapStarted) return
    this.ensBootstrapStarted = true
    const chainId = BigInt(this.chain.chainId)
    if (chainId !== 1n && chainId !== 11155111n) return
    if (this.sandbox === undefined || this.spine.phase !== 'HEAD_FOLLOWING') return
    const lane: EnqueueSandboxOpts = { lane: 'identity', resolutionPolicy: 'swarm-only' }
    const touch = [ENS_REGISTRY_MAINNET, ENS_REVERSE_REGISTRAR]
    try {
      for (const addr of touch) {
        await this.sandbox.runEthCall(
          { to: addr, data: '0x', gas: quantityHex(21_000n) },
          undefined,
          lane,
        )
      }
      this.ensBootstrapReady = this.hasLocalEnsRegistrySync()
    } catch {
      this.ensBootstrapReady = this.hasLocalEnsRegistrySync()
    }
  }

  async resolveNow(
    address: string,
    blockNumber = 0n,
    opts: { ensOnly?: boolean; userFacing?: boolean } = {},
  ): Promise<{ knownName?: string; ensName?: string }> {
    const key = address.toLowerCase()
    const cached = this.cache.get(key)
    if (cached !== undefined && !this.isExpired(cached, blockNumber)) {
      return { knownName: this.getKnownName(key), ensName: this.getEnsName(key) }
    }
    if (this.sandbox === undefined || this.spine.phase !== 'HEAD_FOLLOWING') {
      return { knownName: this.getKnownName(key), ensName: this.getEnsName(key) }
    }
    try {
      await this.probeOne(key, blockNumber, opts.ensOnly === true, opts.userFacing === true)
    } catch {
      this.putCache(key, { block: blockNumber, miss: true })
    }
    return { knownName: this.getKnownName(key), ensName: this.getEnsName(key) }
  }

  onBlock(blockNumber: bigint, hotAddresses: string[], eoaAddresses: string[] = []): void {
    this.probeBudget = MAX_PROBES_PER_BLOCK
    if (this.spine.phase !== 'HEAD_FOLLOWING') return
    const enqueue = (addr: string, ensOnly: boolean) => {
      const key = addr.toLowerCase()
      const cached = this.cache.get(key)
      if (cached !== undefined && !this.isExpired(cached, blockNumber)) return
      if (!this.queue.some((q) => q.address === key)) {
        this.queue.push({ address: key, ensOnly })
      }
    }
    for (const addr of hotAddresses) enqueue(addr, false)
    for (const addr of eoaAddresses) enqueue(addr, true)
    void this.drainQueue(blockNumber)
  }

  private isExpired(entry: CacheEntry, blockNumber: bigint): boolean {
    if (entry.miss === true) {
      return blockNumber - entry.block > BigInt(NEGATIVE_TTL_BLOCKS)
    }
    return false
  }

  private async drainQueue(blockNumber: bigint): Promise<void> {
    if (this.sandbox === undefined) return
    while (this.probeBudget > 0 && this.queue.length > 0) {
      const item = this.queue.shift()!
      this.probeBudget -= 1
      try {
        await this.probeOne(item.address, blockNumber, item.ensOnly)
      } catch {
        this.putCache(item.address, { block: blockNumber, miss: true })
      }
    }
  }

  private putCache(address: string, entry: CacheEntry): void {
    if (this.cache.size >= MAX_CACHE) {
      const first = this.cache.keys().next().value
      if (first !== undefined) this.cache.delete(first)
    }
    this.cache.set(address.toLowerCase(), entry)
  }

  private identityLaneOpts(userFacing = false): EnqueueSandboxOpts {
    return userFacing
      ? { lane: 'identity', resolutionPolicy: 'full' }
      : { lane: 'identity', resolutionPolicy: 'swarm-only' }
  }

  private async probeOne(
    address: string,
    blockNumber: bigint,
    ensOnly = false,
    userFacing = false,
  ): Promise<void> {
    if (this.sandbox === undefined) return
    const lane = this.identityLaneOpts(userFacing)
    const ensReady = this.hasLocalEnsRegistry()
    const name = ensOnly ? undefined : await this.ethCallString(address, NAME_SEL, 48, lane)
    const symbol = ensOnly ? undefined : await this.ethCallString(address, SYMBOL_SEL, 32, lane)
    let ensName: string | undefined
    if (ensReady) {
      ensName = await this.resolveEnsReverse(address, lane)
    }
    if (name === undefined && symbol === undefined && ensName === undefined) {
      // Never cache a 256-block negative miss for ENS-only lookups while ENS Registry code is absent
      if (ensOnly && !ensReady) return
      this.putCache(address, { block: blockNumber, miss: true })
      return
    }
    if (ensName !== undefined) this.ensHitsCount += 1
    if (name !== undefined) this.tokenHitsCount += 1
    this.putCache(address, { block: blockNumber, tokenName: name, symbol, ensName })
  }

  private async ethCallString(
    contract: string,
    data: Uint8Array,
    maxLen = 64,
    laneOpts?: EnqueueSandboxOpts,
  ): Promise<string | undefined> {
    if (this.sandbox === undefined) return undefined
    const outcome = await this.sandbox.runEthCall(
      {
        to: contract,
        data: bytesToHex(data),
        gas: quantityHex(CALL_GAS),
      },
      undefined,
      laneOpts ?? this.identityLaneOpts(),
    )
    if ('error' in outcome) return undefined
    const hex = String(outcome.result ?? '')
    if (!hex.startsWith('0x')) return undefined
    return decodeAbiString(hexToBytes(hex as `0x${string}`), maxLen)
  }

  private async resolveEnsReverse(
    address: string,
    laneOpts?: EnqueueSandboxOpts,
  ): Promise<string | undefined> {
    const lane = laneOpts ?? this.identityLaneOpts()
    const node = ensReverseNode(address)
    const resolver = await this.ethCallAddress(
      ENS_REGISTRY_MAINNET,
      concatCall(RESOLVER_SEL, node),
      lane,
    )
    if (resolver === undefined || resolver === '0x0000000000000000000000000000000000000000') {
      return undefined
    }
    const name = await this.ethCallString(resolver, concatCall(NAME_BYTES32_SEL, node), 64, lane)
    if (name === undefined) return undefined
    const forwardNode = ensNameHash(name)
    const forwardResolver = await this.ethCallAddress(
      ENS_REGISTRY_MAINNET,
      concatCall(RESOLVER_SEL, forwardNode),
      lane,
    )
    if (
      forwardResolver === undefined ||
      forwardResolver === '0x0000000000000000000000000000000000000000'
    ) {
      return undefined
    }
    const forwardAddr = await this.ethCallAddress(
      forwardResolver,
      concatCall(ADDR_SEL, forwardNode),
      lane,
    )
    if (forwardAddr === undefined) return undefined
    if (forwardAddr.toLowerCase() !== address.toLowerCase()) return undefined
    return name
  }

  private async ethCallAddress(
    contract: string,
    data: Uint8Array,
    laneOpts?: EnqueueSandboxOpts,
  ): Promise<string | undefined> {
    if (this.sandbox === undefined) return undefined
    const outcome = await this.sandbox.runEthCall(
      {
        to: contract,
        data: bytesToHex(data),
        gas: quantityHex(CALL_GAS),
      },
      undefined,
      laneOpts ?? this.identityLaneOpts(),
    )
    if ('error' in outcome) return undefined
    const hex = String(outcome.result ?? '')
    if (!hex.startsWith('0x')) return undefined
    const raw = hexToBytes(hex as `0x${string}`)
    if (raw.length < 32) return undefined
    const word = raw.subarray(raw.length - 20)
    return bytesToHex(word).toLowerCase()
  }
}

function concatCall(sel: Uint8Array, node: Uint8Array): Uint8Array {
  const out = new Uint8Array(4 + 32)
  out.set(sel, 0)
  out.set(node, 4)
  return out
}

export function decodeAbiString(ret: Uint8Array, maxLen = 64): string | undefined {
  if (ret.length === 32) {
    const text = asciiFromBytes32(ret, maxLen)
    return text !== undefined ? text : undefined
  }
  if (ret.length < 64) return undefined
  try {
    const offset = Number(bytesToBigInt(ret.subarray(0, 32)))
    if (offset + 32 > ret.length) return undefined
    const len = Number(bytesToBigInt(ret.subarray(offset, offset + 32)))
    const start = offset + 32
    if (start + len > ret.length) return undefined
    const slice = ret.subarray(start, start + len)
    return asciiSanitize(slice, maxLen)
  } catch {
    return undefined
  }
}

function asciiFromBytes32(word: Uint8Array, maxLen: number): string | undefined {
  let end = word.length
  while (end > 0 && word[end - 1] === 0) end -= 1
  const slice = word.subarray(0, end)
  return asciiSanitize(slice, maxLen)
}

function asciiSanitize(bytes: Uint8Array, maxLen: number): string | undefined {
  let out = ''
  for (const b of bytes) {
    if (b < 0x20 || b > 0x7e) return undefined
    out += String.fromCharCode(b)
  }
  if (out.length === 0) return undefined
  return out.length > maxLen ? out.slice(0, maxLen) : out
}

function ensReverseNode(address: string): Uint8Array {
  const bare = address.toLowerCase().replace(/^0x/, '')
  return ensNameHash(`${bare}.addr.reverse`)
}

export function ensNameHash(name: string): Uint8Array {
  if (name === '') return new Uint8Array(32)
  const labels = name.split('.').reverse()
  let node = new Uint8Array(32)
  for (const label of labels) {
    const labelHash = ethyKeccak256(new TextEncoder().encode(label))
    const packed = new Uint8Array(64)
    packed.set(node, 0)
    packed.set(labelHash, 32)
    node = new Uint8Array(ethyKeccak256(packed))
  }
  return new Uint8Array(node)
}
