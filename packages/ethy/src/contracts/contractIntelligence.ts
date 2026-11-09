import type { ChainConfig } from '@ethereumjs/common'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'

import { MAX_AI_OVERVIEW_CHARS } from '../ai/overviewNarrator.ts'
import { ethyKeccak256 } from '../crypto/keccak.ts'
import { shortAddress } from '../economy/format.ts'
import type { TopContractRow } from '../economy/types.ts'
import {
  type BytecodeFingerprint,
  type ProxyKind,
  fingerprintBytecode,
} from './bytecodeFingerprint.ts'
import { knownContractName } from './knownContracts.ts'
import {
  EIP1967_IMPLEMENTATION_SLOT,
  SELECTOR,
  TOPIC,
  lookupEventTopic0,
  lookupFunctionSelector,
} from './signatureCatalog.ts'

export type ContractConfidence = 'high' | 'medium' | 'low'

export type ContractAddressAgg = {
  selectorCounts: Map<string, number>
  topicCounts: Map<string, number>
  coTouched: Set<string>
  maxTransferLogsInTx: number
  soleCalleeBlocks: number
  inboundCalls: number
  swapEmittersInTx: Set<string>
  latestBalCode?: Uint8Array
  implSlotValue?: string
}

export type CodeLookup = {
  getCodeForAddress: (address: string) => Uint8Array | undefined
  chainId: bigint
}

export type ContractProfile = TopContractRow & {
  fingerprint?: BytecodeFingerprint
  callPreviews: string[]
  eventPreviews: string[]
}

const FINGERPRINT_CACHE_MAX = 256

export function createFingerprintCache(): Map<string, BytecodeFingerprint> {
  return new Map()
}

export function fingerprintWithCache(
  code: Uint8Array,
  cache: Map<string, BytecodeFingerprint>,
): BytecodeFingerprint {
  const key = bytesToHex(ethyKeccak256(code))
  const hit = cache.get(key)
  if (hit !== undefined) return hit
  const fp = fingerprintBytecode(code)
  if (cache.size >= FINGERPRINT_CACHE_MAX) {
    const first = cache.keys().next().value
    if (first !== undefined) cache.delete(first)
  }
  cache.set(key, fp)
  return fp
}

export function resolveCodeForAddress(
  address: string,
  lookup: CodeLookup,
  agg?: ContractAddressAgg,
): Uint8Array | undefined {
  const fromState = lookup.getCodeForAddress(address)
  if (fromState !== undefined && fromState.length > 0) return fromState
  return agg?.latestBalCode
}

function countMapTop(map: Map<string, number>, limit: number): Array<[string, number]> {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit)
}

export function topSelectorLabels(agg: ContractAddressAgg, limit = 3): string[] {
  return countMapTop(agg.selectorCounts, limit).map(([sel, n]) => {
    const row = lookupFunctionSelector(sel)
    const name = row?.name ?? sel
    return `${name} (${n}x)`
  })
}

export function topEventLabels(agg: ContractAddressAgg, limit = 3): string[] {
  return countMapTop(agg.topicCounts, limit).map(([topic, n]) => {
    const row = lookupEventTopic0(topic)
    const name = row?.name ?? topic.slice(0, 10)
    return `${name} · ${n}x`
  })
}

type Pass1 = {
  archetype: string
  confidence: ContractConfidence
  proxyKind?: ProxyKind
  proxyTarget?: string
}

function proxyOnlyLabel(fp: BytecodeFingerprint): string | undefined {
  if (fp.proxyKind === 'EIP-1167') return 'EIP-1167 Proxy'
  if (fp.proxyKind === 'EIP-1967') return 'EIP-1967 Proxy'
  if (fp.proxyKind === 'EIP-1967-Beacon') return 'EIP-1967 Beacon'
  if (fp.proxyKind === 'EIP-7702') return 'EIP-7702'
  return undefined
}

function pass1FromFingerprint(fp: BytecodeFingerprint): Pass1 | undefined {
  const proxyKind = fp.proxyKind
  const proxyTarget = fp.proxyTarget
  if (fp.interfaceFlags.aa) {
    return { archetype: 'AA', confidence: 'high', proxyKind, proxyTarget }
  }
  if (fp.interfaceFlags.weth) {
    return { archetype: 'WETH', confidence: 'high', proxyKind, proxyTarget }
  }
  if (fp.interfaceFlags.dexRouter) {
    return { archetype: 'DEX Router', confidence: 'high', proxyKind, proxyTarget }
  }
  if (fp.interfaceFlags.dexPool) {
    return { archetype: 'DEX Pool', confidence: 'high', proxyKind, proxyTarget }
  }
  if (fp.interfaceFlags.erc721) {
    return { archetype: 'ERC-721', confidence: 'high', proxyKind, proxyTarget }
  }
  if (fp.interfaceFlags.erc20) {
    return { archetype: 'ERC-20', confidence: 'high', proxyKind, proxyTarget }
  }
  if (fp.interfaceFlags.erc1155) {
    return { archetype: 'ERC-1155', confidence: 'medium', proxyKind, proxyTarget }
  }
  const proxyLabel = proxyOnlyLabel(fp)
  if (proxyLabel !== undefined) {
    return { archetype: proxyLabel, confidence: 'high', proxyKind, proxyTarget }
  }
  return undefined
}

function hasTopic(agg: ContractAddressAgg, topic: string): boolean {
  return (agg.topicCounts.get(topic.toLowerCase()) ?? 0) > 0
}

function hasSelector(agg: ContractAddressAgg, selector: string): boolean {
  return (agg.selectorCounts.get(selector.toLowerCase()) ?? 0) > 0
}

function pass2Behavior(
  address: string,
  row: TopContractRow,
  agg: ContractAddressAgg,
  pass1?: Pass1,
  peerArchetypes?: Map<string, string>,
): Pass1 {
  if (pass1 !== undefined && pass1.confidence === 'high') return pass1

  const transferErc20 = hasTopic(agg, TOPIC.transferErc20)
  const transfer721 = hasTopic(agg, TOPIC.transferErc721)
  const swapV2 = hasTopic(agg, TOPIC.swapV2)
  const swapV3 = hasTopic(agg, TOPIC.swapV3)
  const sync = hasTopic(agg, TOPIC.sync)
  const userOp = hasTopic(agg, TOPIC.userOperationEvent)

  if (userOp || hasSelector(agg, SELECTOR.handleOps) || hasSelector(agg, SELECTOR.validateUserOp)) {
    return {
      archetype: 'AA',
      confidence: 'high',
      proxyKind: pass1?.proxyKind,
      proxyTarget: pass1?.proxyTarget,
    }
  }

  if (agg.maxTransferLogsInTx >= 10) {
    return { archetype: 'Batch Dispatcher', confidence: 'low' }
  }

  if (agg.soleCalleeBlocks > 0 && row.storageWrites >= 15) {
    return { archetype: 'Batch Dispatcher', confidence: 'medium' }
  }

  if (
    (swapV2 || swapV3) &&
    agg.inboundCalls > 0 &&
    (hasSelector(agg, SELECTOR.execute) ||
      hasSelector(agg, SELECTOR.swapExactTokensForTokens) ||
      hasSelector(agg, SELECTOR.exactInputSingle))
  ) {
    let pools = 0
    for (const peer of agg.coTouched) {
      const label = peerArchetypes?.get(peer)
      if (label === 'DEX Pool' || label === 'ERC-20') pools += 1
    }
    if (pools >= 2) {
      return { archetype: 'DEX Router', confidence: 'medium' }
    }
  }

  if ((swapV2 || swapV3) && sync) {
    return { archetype: 'DEX Pool', confidence: 'medium' }
  }

  if (transfer721 || hasTopic(agg, TOPIC.transferSingle)) {
    return { archetype: 'ERC-721', confidence: 'medium' }
  }

  if (transferErc20) {
    const writesPerBlock = row.storageWrites / Math.max(1, row.blocksActive)
    if (writesPerBlock >= 1 && writesPerBlock <= 4) {
      return { archetype: 'ERC-20', confidence: 'medium' }
    }
  }

  if (
    (swapV2 || swapV3) &&
    agg.swapEmittersInTx.size >= 2 &&
    agg.inboundCalls > 0 &&
    row.netEthDeltaWei > 0n &&
    pass1 === undefined
  ) {
    return { archetype: 'MEV Bot', confidence: 'medium' }
  }

  if (pass1 !== undefined) return pass1

  if (hasSelector(agg, SELECTOR.deposit) && hasSelector(agg, SELECTOR.withdraw)) {
    return { archetype: 'WETH', confidence: 'medium' }
  }

  return { archetype: 'Contract', confidence: 'low' }
}

export function classifyAddress(
  address: string,
  row: TopContractRow,
  agg: ContractAddressAgg,
  lookup: CodeLookup,
  cache: Map<string, BytecodeFingerprint>,
  peerArchetypes?: Map<string, string>,
): Omit<
  TopContractRow,
  'address' | 'blocksActive' | 'storageWrites' | 'storageReads' | 'netEthDeltaWei'
> {
  const code = resolveCodeForAddress(address, lookup, agg)
  let pass1: Pass1 | undefined
  let proxyKind: ProxyKind
  let proxyTarget: string | undefined
  if (code !== undefined && code.length > 0) {
    const fp = fingerprintWithCache(code, cache)
    pass1 = pass1FromFingerprint(fp)
    proxyKind = fp.proxyKind
    proxyTarget = fp.proxyTarget ?? extractImplFromBal(agg.implSlotValue)
    if (pass1?.proxyTarget === undefined && proxyTarget !== undefined) {
      pass1 = pass1 ? { ...pass1, proxyTarget } : pass1
    }
  } else if (agg.implSlotValue !== undefined) {
    proxyTarget = extractImplFromBal(agg.implSlotValue)
    proxyKind = 'EIP-1967'
  }

  const final = pass2Behavior(address, row, agg, pass1, peerArchetypes)
  const knownName = knownContractName(lookup.chainId, address)
  return {
    archetype: final.archetype,
    confidence: final.confidence,
    knownName,
    topSelectors: topSelectorLabels(agg),
    proxyKind: final.proxyKind ?? proxyKind,
    proxyTarget: final.proxyTarget ?? proxyTarget,
  }
}

function extractImplFromBal(slotHex: string | undefined): string | undefined {
  if (slotHex === undefined) return undefined
  const h = slotHex.startsWith('0x') ? slotHex.slice(2) : slotHex
  if (h.length < 40) return undefined
  return `0x${h.slice(-40)}`
}

export function enrichTopContracts(
  rows: TopContractRow[],
  addressAggregates: Map<string, ContractAddressAgg>,
  lookup: CodeLookup,
  cache: Map<string, BytecodeFingerprint>,
): TopContractRow[] {
  const base: TopContractRow[] = rows.map((r) => ({ ...r }))
  const peerArchetypes = new Map<string, string>()
  for (const row of base) {
    const agg = addressAggregates.get(row.address)
    if (agg === undefined) continue
    const code = resolveCodeForAddress(row.address, lookup, agg)
    if (code === undefined) continue
    const fp = fingerprintWithCache(code, cache)
    const p1 = pass1FromFingerprint(fp)
    if (p1 !== undefined) peerArchetypes.set(row.address, p1.archetype)
  }
  return base.map((row) => {
    const agg = addressAggregates.get(row.address)
    if (agg === undefined) return row
    const extra = classifyAddress(row.address, row, agg, lookup, cache, peerArchetypes)
    return { ...row, ...extra }
  })
}

export function buildCodeLookup(stateManager: FlatStateManager, chain: ChainConfig): CodeLookup {
  return {
    chainId: BigInt(chain.chainId),
    getCodeForAddress: (address: string) => {
      try {
        const hex = (address.startsWith('0x') ? address : `0x${address}`) as `0x${string}`
        const bytes = hexToBytes(hex)
        const hash = ethyKeccak256(bytes)
        const acc = stateManager.getAccountByHash(hash)
        if (acc === undefined || acc.codeHash === undefined) return undefined
        const emptyCodeHash = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
        const ch = bytesToHex(acc.codeHash)
        if (ch.toLowerCase() === emptyCodeHash) return new Uint8Array(0)
        return stateManager.getCodeByHash(acc.codeHash)
      } catch {
        return undefined
      }
    },
  }
}

export function narrateContract(profile: ContractProfile): string {
  const arch = profile.archetype ?? 'Contract'
  const conf = profile.confidence ?? 'low'
  const addr = shortAddress(profile.address)
  const proxy =
    profile.proxyTarget !== undefined && profile.proxyKind !== undefined
      ? ` (${profile.proxyKind} → ${shortAddress(profile.proxyTarget)})`
      : ''
  const calls =
    profile.topSelectors?.[0] !== undefined ? profile.topSelectors[0]!.split(' (')[0] : 'calls'
  const callCount = profile.topSelectors?.[0]?.match(/\((\d+)x\)/)?.[1] ?? '0'
  const slots = profile.storageWrites
  let text = `Contract ${addr} is a ${arch}${proxy} · ${conf}. ${callCount} ${calls} in window, ${slots} storage writes. /contract for detail.`
  text = text.replace(/\s+/g, ' ').trim()
  if (text.length <= MAX_AI_OVERVIEW_CHARS) return text
  return `${text.slice(0, MAX_AI_OVERVIEW_CHARS - 1)}…`
}

export function buildContractProfile(
  row: TopContractRow,
  agg: ContractAddressAgg,
  lookup: CodeLookup,
  cache: Map<string, BytecodeFingerprint>,
): ContractProfile {
  const code = resolveCodeForAddress(row.address, lookup, agg)
  const fingerprint =
    code !== undefined && code.length > 0 ? fingerprintWithCache(code, cache) : undefined
  const callPreviews: string[] = []
  const eventPreviews: string[] = []
  for (const [sel] of countMapTop(agg.selectorCounts, 3)) {
    const entry = lookupFunctionSelector(sel)
    if (entry !== undefined) {
      callPreviews.push(entry.name)
    }
  }
  for (const [topic] of countMapTop(agg.topicCounts, 3)) {
    const entry = lookupEventTopic0(topic)
    if (entry !== undefined) eventPreviews.push(entry.name)
  }
  return {
    ...row,
    fingerprint,
    callPreviews,
    eventPreviews,
  }
}

export function balSlotImplValue(
  storageChanges: Array<{ slot: string; postValue?: string }>,
): string | undefined {
  const slot = EIP1967_IMPLEMENTATION_SLOT.toLowerCase()
  for (const ch of storageChanges) {
    if (ch.slot.toLowerCase() !== slot) continue
    const last = ch.postValue
    if (last !== undefined) return last
  }
  return undefined
}
