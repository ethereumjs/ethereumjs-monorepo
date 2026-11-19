import type { ChainConfig } from '@ethereumjs/common'

import { bytesToHex, hexToBytes } from '@ethereumjs/util'
import { ethyKeccak256 } from '../crypto/keccak.ts'
import type { EthySandbox } from '../evm/sandbox.ts'
import type { EthySpine } from '../spine/types.ts'

const NAME_SEL = hexToBytes('0x06fdde03')
const SYMBOL_SEL = hexToBytes('0x95d89b41')
const RESOLVER_SEL = hexToBytes('0x0178b8bf')
const NAME_BYTES32_SEL = hexToBytes('0x691f3431')
const ADDR_SEL = hexToBytes('0x3b3b57de')
const NEGATIVE_TTL_BLOCKS = 256
const MAX_CACHE = 512
const MAX_PROBES_PER_BLOCK = 2
const CALL_GAS = 80_000n

const ENS_REGISTRY_MAINNET = '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e'

type CacheEntry = {
  block: bigint
  tokenName?: string
  symbol?: string
  ensName?: string
  miss?: boolean
}

export class IdentityResolver {
  private readonly chain: ChainConfig
  private readonly sandbox?: EthySandbox
  private readonly spine: EthySpine
  private readonly cache = new Map<string, CacheEntry>()
  private probeBudget = 0
  private queue: string[] = []

  constructor(opts: { chain: ChainConfig; sandbox?: EthySandbox; spine: EthySpine }) {
    this.chain = opts.chain
    this.sandbox = opts.sandbox
    this.spine = opts.spine
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

  onBlock(blockNumber: bigint, hotAddresses: string[]): void {
    this.probeBudget = MAX_PROBES_PER_BLOCK
    if (this.spine.phase !== 'HEAD_FOLLOWING') return
    for (const addr of hotAddresses) {
      const key = addr.toLowerCase()
      const cached = this.cache.get(key)
      if (cached !== undefined && !this.isExpired(cached, blockNumber)) continue
      if (!this.queue.includes(key)) this.queue.push(key)
    }
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
      const addr = this.queue.shift()!
      this.probeBudget -= 1
      try {
        await this.probeOne(addr, blockNumber)
      } catch {
        this.putCache(addr, { block: blockNumber, miss: true })
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

  private async probeOne(address: string, blockNumber: bigint): Promise<void> {
    if (this.sandbox === undefined) return
    const name = await this.ethCallString(address, NAME_SEL)
    const symbol = await this.ethCallString(address, SYMBOL_SEL)
    let ensName: string | undefined
    const chainId = BigInt(this.chain.chainId)
    if (chainId === 1n || chainId === 11155111n) {
      ensName = await this.resolveEnsReverse(address)
    }
    if (name === undefined && symbol === undefined && ensName === undefined) {
      this.putCache(address, { block: blockNumber, miss: true })
      return
    }
    this.putCache(address, { block: blockNumber, tokenName: name, symbol, ensName })
  }

  private async ethCallString(contract: string, data: Uint8Array): Promise<string | undefined> {
    if (this.sandbox === undefined) return undefined
    const outcome = await this.sandbox.runEthCall(
      {
        to: contract,
        data: `0x${bytesToHex(data)}` as `0x${string}`,
        gas: CALL_GAS,
      },
      undefined,
    )
    if ('error' in outcome) return undefined
    const hex = String(outcome.result ?? '')
    if (!hex.startsWith('0x')) return undefined
    return decodeAbiString(hexToBytes(hex as `0x${string}`))
  }

  private async resolveEnsReverse(address: string): Promise<string | undefined> {
    const node = ensReverseNode(address)
    const resolver = await this.ethCallAddress(ENS_REGISTRY_MAINNET, concatCall(RESOLVER_SEL, node))
    if (resolver === undefined || resolver === '0x0000000000000000000000000000000000000000') {
      return undefined
    }
    const name = await this.ethCallString(resolver, concatCall(NAME_BYTES32_SEL, node))
    if (name === undefined) return undefined
    const forwardNode = ensNameHash(name)
    const forwardResolver = await this.ethCallAddress(
      ENS_REGISTRY_MAINNET,
      concatCall(RESOLVER_SEL, forwardNode),
    )
    if (forwardResolver === undefined) return undefined
    const forwardAddr = await this.ethCallAddress(
      forwardResolver,
      concatCall(ADDR_SEL, forwardNode),
    )
    if (forwardAddr === undefined) return undefined
    if (forwardAddr.toLowerCase() !== address.toLowerCase()) return undefined
    return name
  }

  private async ethCallAddress(contract: string, data: Uint8Array): Promise<string | undefined> {
    if (this.sandbox === undefined) return undefined
    const outcome = await this.sandbox.runEthCall(
      {
        to: contract,
        data: `0x${bytesToHex(data)}` as `0x${string}`,
        gas: CALL_GAS,
      },
      undefined,
    )
    if ('error' in outcome) return undefined
    const hex = String(outcome.result ?? '')
    if (!hex.startsWith('0x')) return undefined
    const raw = hexToBytes(hex as `0x${string}`)
    if (raw.length < 32) return undefined
    const word = raw.subarray(raw.length - 20)
    return `0x${bytesToHex(word)}`.toLowerCase()
  }
}

function concatCall(sel: Uint8Array, node: Uint8Array): Uint8Array {
  const out = new Uint8Array(4 + 32)
  out.set(sel, 0)
  out.set(node, 4)
  return out
}

function decodeAbiString(ret: Uint8Array): string | undefined {
  if (ret.length === 32) {
    const text = asciiFromBytes32(ret)
    return text !== undefined ? text : undefined
  }
  if (ret.length < 64) return undefined
  try {
    const offset = Number(BigInt(`0x${bytesToHex(ret.subarray(0, 32))}`))
    if (offset + 32 > ret.length) return undefined
    const len = Number(BigInt(`0x${bytesToHex(ret.subarray(offset, offset + 32))}`))
    const start = offset + 32
    if (start + len > ret.length) return undefined
    const slice = ret.subarray(start, start + len)
    return asciiSanitize(slice)
  } catch {
    return undefined
  }
}

function asciiFromBytes32(word: Uint8Array): string | undefined {
  let end = word.length
  while (end > 0 && word[end - 1] === 0) end -= 1
  const slice = word.subarray(0, end)
  return asciiSanitize(slice)
}

function asciiSanitize(bytes: Uint8Array): string | undefined {
  let out = ''
  for (const b of bytes) {
    if (b < 0x20 || b > 0x7e) return undefined
    out += String.fromCharCode(b)
  }
  if (out.length === 0) return undefined
  return out.length > 32 ? out.slice(0, 32) : out
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
