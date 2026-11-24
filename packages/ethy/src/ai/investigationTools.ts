import type { ChainConfig } from '@ethereumjs/common'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import { bytesToBigInt, bytesToHex, hexToBytes } from '@ethereumjs/util'

import { fingerprintBytecode } from '../contracts/bytecodeFingerprint.ts'
import {
  archetypeLabelFromCode,
  buildCodeLookup,
  createFingerprintCache,
} from '../contracts/contractIntelligence.ts'
import { decodeAbiString } from '../contracts/identityResolver.ts'
import { knownContractName } from '../contracts/knownContracts.ts'
import {
  EIP1967_IMPLEMENTATION_SLOT,
  lookupFunctionSelector,
} from '../contracts/signatureCatalog.ts'
import { ethyKeccak256 } from '../crypto/keccak.ts'
import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import { formatEthFromWei } from '../economy/format.ts'
import type { BlockMomentKind } from '../economy/types.ts'
import type { EthySandbox } from '../evm/sandbox.ts'
import { quantityHex } from '../rpc/quantities.ts'
import type { EthySpine } from '../spine/types.ts'

export type InvestigationToolName =
  | 'inspect_contract'
  | 'inspect_delegations'
  | 'inspect_storage_slot'
  | 'inspect_l2_blobs'
  | 'inspect_account'
  | 'probe_contract_view'
  | 'inspect_recent_moments'
  | 'inspect_block_activity'

const MAX_JSON_CHARS = 1400
const LIST_CAP = 6
const PROBE_GAS = 100_000n
const HEX_ADDR_RE = /^0x[0-9a-f]{40}$/i

const PROBE_ENTRIES: ReadonlyArray<{ selector: `0x${string}`; canonical: string }> = [
  { selector: '0x06fdde03', canonical: 'name' },
  { selector: '0x95d89b41', canonical: 'symbol' },
  { selector: '0x313ce567', canonical: 'decimals' },
  { selector: '0x18160ddd', canonical: 'totalSupply' },
  { selector: '0x8da5cb5b', canonical: 'owner' },
  { selector: '0x5c60da1b', canonical: 'implementation' },
  { selector: '0x5c975abb', canonical: 'paused' },
  { selector: '0x54fd4d50', canonical: 'version' },
  { selector: '0x0dfe1681', canonical: 'token0' },
  { selector: '0xd21220a7', canonical: 'token1' },
  {
    selector: '0xc87b56dd0000000000000000000000000000000000000000000000000000000000000001',
    canonical: 'tokenURI',
  },
]

function lookupProbeEntry(fn: string): { selector: `0x${string}`; canonical: string } | undefined {
  const q = fn.trim().toLowerCase()
  return PROBE_ENTRIES.find((e) => e.canonical.toLowerCase() === q)
}

export type InvestigationContext = {
  economy: ETHEconomyDataManager
  stateManager: FlatStateManager
  chain: ChainConfig
  sandbox?: EthySandbox
  spine: EthySpine
}

export const INVESTIGATION_TOOL_NAMES: readonly InvestigationToolName[] = [
  'inspect_contract',
  'inspect_delegations',
  'inspect_storage_slot',
  'inspect_l2_blobs',
  'inspect_account',
  'probe_contract_view',
  'inspect_recent_moments',
  'inspect_block_activity',
]

function safeJSONStringify(obj: unknown): string {
  return JSON.stringify(obj, (_key, val) => (typeof val === 'bigint' ? val.toString() : val))
}

function trimPayload(obj: unknown): string {
  const s = safeJSONStringify(obj)
  if (s.length <= MAX_JSON_CHARS) return s
  return `${s.slice(0, MAX_JSON_CHARS - 1)}…`
}

function normAddr(a: string): string {
  return a.trim().toLowerCase()
}

function isValidAddress(a: string): boolean {
  return HEX_ADDR_RE.test(a)
}

function bytecodeRiskCues(code: Uint8Array): string[] {
  const cues: string[] = []
  let hasDelegateCall = false
  let hasSelfDestruct = false
  for (let i = 0; i < code.length; i++) {
    const op = code[i]!
    if (op >= 0x60 && op <= 0x7f) {
      i += op - 0x5f
      continue
    }
    if (op === 0xf4) hasDelegateCall = true
    else if (op === 0xff) hasSelfDestruct = true
  }
  if (hasDelegateCall) cues.push('DELEGATECALL')
  if (hasSelfDestruct) cues.push('SELFDESTRUCT')
  return cues
}

function resolveProxyChain(
  address: string,
  ctx: InvestigationContext,
): { proxyKind?: string; proxyTarget?: string; implArchetype?: string } {
  const lookup = buildCodeLookup(ctx.stateManager, ctx.chain)
  const code = lookup.getCodeForAddress(address)
  const implSlot = lookup.getStorageSlotForAddress?.(address, EIP1967_IMPLEMENTATION_SLOT)
  let proxyKind: string | undefined
  let proxyTarget: string | undefined
  if (code !== undefined && code.length > 0) {
    const fp = fingerprintBytecode(code)
    proxyKind = fp.proxyKind
    proxyTarget = fp.proxyTarget
  }
  if (proxyTarget === undefined && implSlot !== undefined) {
    const bare = implSlot.replace(/^0x/, '')
    if (bare.length >= 40) {
      const candidate = `0x${bare.slice(-40)}`.toLowerCase()
      if (candidate !== '0x0000000000000000000000000000000000000000') {
        proxyTarget = candidate
        proxyKind = proxyKind ?? 'EIP-1967'
      }
    }
  }
  let implArchetype: string | undefined
  if (proxyTarget !== undefined) {
    const implCode = lookup.getCodeForAddress(proxyTarget)
    if (implCode !== undefined && implCode.length > 0) {
      implArchetype = archetypeLabelFromCode(implCode, createFingerprintCache())
    }
  }
  return { proxyKind, proxyTarget, implArchetype }
}

export function runInvestigationTool(
  name: InvestigationToolName,
  args: Record<string, unknown>,
  ctx: InvestigationContext,
): string {
  switch (name) {
    case 'inspect_contract':
      return trimPayload(inspectContract(String(args.address ?? ''), ctx))
    case 'inspect_delegations':
      return trimPayload(inspectDelegations(String(args.delegateAddress ?? ''), ctx))
    case 'inspect_storage_slot':
      return trimPayload(
        inspectStorageSlot(String(args.address ?? ''), String(args.slot ?? '0x0'), ctx),
      )
    case 'inspect_l2_blobs':
      return trimPayload(
        inspectL2Blobs(
          args.inboxAddress !== undefined ? String(args.inboxAddress) : undefined,
          ctx,
        ),
      )
    case 'inspect_account':
      return trimPayload(inspectAccount(String(args.address ?? ''), ctx))
    case 'probe_contract_view':
      return trimPayload(probeContractView(String(args.address ?? ''), String(args.fn ?? ''), ctx))
    case 'inspect_recent_moments':
      return trimPayload(inspectRecentMoments(ctx, args))
    case 'inspect_block_activity':
      return trimPayload(inspectBlockActivity(ctx, args))
    default:
      return trimPayload({ error: 'unknown_tool' })
  }
}

function inspectRecentMoments(
  ctx: InvestigationContext,
  args: Record<string, unknown>,
): Record<string, unknown> {
  const kindFilter =
    typeof args.kind === 'string' ? (args.kind.trim() as BlockMomentKind) : undefined
  const limit = Math.min(6, Math.max(1, Number(args.limit ?? 6) || 6))
  const moments = (ctx.spine.economy?.moments ?? []).filter(
    (m) => kindFilter === undefined || m.kind === kindFilter,
  )
  const rows = moments.slice(0, limit).map((m) => {
    const row: Record<string, unknown> = {
      id: m.id,
      kind: m.kind,
      blockNumber: m.blockNumber,
      headline: m.headline,
      address: m.address,
    }
    if (m.address !== undefined) {
      const agg = ctx.economy.getContractAgg(m.address)
      if (agg !== undefined) {
        row.callPreviews = agg.callPreviews.slice(0, 2)
        row.eventPreviews = agg.eventPreviews.slice(0, 2)
      }
    }
    return row
  })
  return { moments: rows, count: rows.length }
}

function inspectBlockActivity(
  ctx: InvestigationContext,
  args: Record<string, unknown>,
): Record<string, unknown> {
  let offset = Number(args.blockOffset ?? 0)
  if (!Number.isFinite(offset)) offset = 0
  offset = Math.min(15, Math.max(0, Math.floor(offset)))
  const ring = ctx.economy.getBlockRing()
  const block = ring[offset]
  if (block === undefined) return { error: 'block_not_in_window', blockOffset: offset }
  const largestEth =
    block.largestTransferWei > 0n ? formatEthFromWei(block.largestTransferWei) : undefined
  const topGas = (block.gasUsedByContract ?? [])
    .slice()
    .sort((a, b) => (a.gasUsed > b.gasUsed ? -1 : 1))
    .slice(0, 4)
    .map((g) => ({ address: g.address, gasUsed: g.gasUsed.toString() }))
  const topReverts = (block.revertsByContract ?? [])
    .slice()
    .sort((a, b) => b.reverts - a.reverts)
    .slice(0, 4)
  return {
    blockNumber: block.blockNumber.toString(),
    proposerGraffiti: block.extraDataAscii,
    gasFullPct: block.gasFullPct,
    txTypeSplit: block.txTypeSplit,
    largestTransferEth: largestEth,
    largestTransferTo: block.largestTransferTo,
    topGasContracts: topGas,
    topRevertingContracts: topReverts,
    newDeployments: block.newDeployments,
    txCount: block.txCount,
  }
}

function inspectContract(address: string, ctx: InvestigationContext): Record<string, unknown> {
  const addr = normAddr(address)
  if (!isValidAddress(addr)) return { error: 'invalid_address', address: addr }
  const identity = ctx.economy.getIdentityResolver()
  const agg = ctx.economy.getContractAgg(addr)
  let gasTotal = 0n
  let reverts = 0
  let blocks = 0
  for (const b of ctx.economy.getBlockRing()) {
    const row = b.gasUsedByContract?.find((g) => g.address === addr)
    if (row !== undefined) {
      gasTotal += row.gasUsed
      blocks += 1
    }
    const rev = b.revertsByContract?.find((g) => g.address === addr)
    if (rev !== undefined) reverts += rev.reverts
  }
  const accHash = ethyKeccak256(hexToBytes(addr as `0x${string}`))
  const acc = ctx.stateManager.getAccountByHash(accHash)
  const code =
    acc !== undefined
      ? (ctx.stateManager.getCodeByHash(acc.codeHash) ?? new Uint8Array(0))
      : new Uint8Array(0)
  const selectors = agg
    ? [...agg.selectorCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, LIST_CAP)
        .map(([sel, n]) => ({ sel: lookupFunctionSelector(sel)?.name ?? sel, n }))
    : []
  const archetype =
    code.length > 0 ? archetypeLabelFromCode(code, createFingerprintCache()) : undefined
  const proxy = resolveProxyChain(addr, ctx)
  const riskCues = code.length > 0 ? bytecodeRiskCues(code) : []
  return {
    address: addr,
    knownName: knownContractName(BigInt(ctx.chain.chainId), addr) ?? identity.getKnownName(addr),
    archetype: proxy.implArchetype ?? archetype,
    proxyKind: proxy.proxyKind,
    proxyTarget: proxy.proxyTarget,
    bytecodeBytes: code.length,
    blocksActive: blocks,
    gasUsedWindow: gasTotal.toString(),
    revertsWindow: reverts,
    topSelectors: selectors,
    riskCues: riskCues.length > 0 ? riskCues : undefined,
  }
}

function inspectDelegations(delegate: string, ctx: InvestigationContext): Record<string, unknown> {
  const target = normAddr(delegate)
  if (!isValidAddress(target)) return { error: 'invalid_address', delegateAddress: target }
  const identity = ctx.economy.getIdentityResolver()
  let count = 0
  let revocations = 0
  for (const b of ctx.economy.getBlockRing()) {
    const row = b.delegationTargets?.find((d) => d.target === target)
    if (row !== undefined) {
      count += row.count
      revocations += row.revocations
    }
  }
  const accHash = ethyKeccak256(hexToBytes(target as `0x${string}`))
  const acc = ctx.stateManager.getAccountByHash(accHash)
  const code =
    acc !== undefined
      ? (ctx.stateManager.getCodeByHash(acc.codeHash) ?? new Uint8Array(0))
      : new Uint8Array(0)
  const archetype =
    code.length > 0 ? archetypeLabelFromCode(code, createFingerprintCache()) : undefined
  const proxy = resolveProxyChain(target, ctx)
  const riskCues = code.length > 0 ? bytecodeRiskCues(code) : []
  return {
    delegateAddress: target,
    delegationCount: count,
    revocations,
    knownName:
      knownContractName(BigInt(ctx.chain.chainId), target) ?? identity.getKnownName(target),
    archetype: proxy.implArchetype ?? archetype,
    proxyKind: proxy.proxyKind,
    proxyTarget: proxy.proxyTarget,
    bytecodeBytes: code.length,
    riskCues: riskCues.length > 0 ? riskCues : undefined,
  }
}

function inspectStorageSlot(
  address: string,
  slot: string,
  ctx: InvestigationContext,
): Record<string, unknown> {
  const addr = normAddr(address)
  const normSlot = slot.trim().toLowerCase()
  const series = ctx.economy.getSlotTracker().seriesFor(addr, normSlot) ?? []
  const trend = ctx.economy.getSlotTracker().classify(`${addr}:${normSlot}`)
  const identity = ctx.economy.getIdentityResolver()
  return {
    address: addr,
    knownName: knownContractName(BigInt(ctx.chain.chainId), addr) ?? identity.getKnownName(addr),
    slot: normSlot,
    trend,
    series: series.slice(-LIST_CAP).map((p) => ({
      block: p.block.toString(),
      value: p.value.toString(),
    })),
  }
}

function inspectL2Blobs(
  inbox: string | undefined,
  ctx: InvestigationContext,
): Record<string, unknown> {
  const snap = ctx.spine.economy
  const stats = (snap?.l2RollupStats ?? []).slice(0, LIST_CAP)
  const filtered = inbox !== undefined ? stats.filter((s) => s.inbox === normAddr(inbox)) : stats
  return {
    blobBaseFeeGwei: snap?.blobBaseFeeGwei,
    inboxes: filtered.map((s) => ({
      inbox: s.inbox,
      displayName: s.displayName,
      blobCount: s.blobCount,
      estimatedEthWei: s.estimatedEthWei.toString(),
    })),
  }
}

function inspectAccount(address: string, ctx: InvestigationContext): Record<string, unknown> {
  const addr = normAddr(address)
  if (!isValidAddress(addr)) return { error: 'invalid_address', address: addr }
  const identity = ctx.economy.getIdentityResolver()
  const accHash = ethyKeccak256(hexToBytes(addr as `0x${string}`))
  const acc = ctx.stateManager.getAccountByHash(accHash)
  const code =
    acc !== undefined
      ? (ctx.stateManager.getCodeByHash(acc.codeHash) ?? new Uint8Array(0))
      : new Uint8Array(0)
  const isContract = code.length > 0
  let eip7702Delegate: string | undefined
  if (code.length >= 23 && code[0] === 0xef && code[1] === 0x01 && code[2] === 0x00) {
    eip7702Delegate = bytesToHex(code.subarray(3, 23)).toLowerCase()
  }
  let burst = false
  for (const b of ctx.economy.getBlockRing()) {
    if (b.sameSenderBursts?.includes(addr)) burst = true
  }
  return {
    address: addr,
    balanceWei: acc?.balance?.toString() ?? '0',
    nonce: acc?.nonce?.toString() ?? '0',
    isContract,
    eip7702Delegate,
    knownName: knownContractName(BigInt(ctx.chain.chainId), addr) ?? identity.getKnownName(addr),
    senderBurst: burst || undefined,
  }
}

function probeContractView(
  address: string,
  fn: string,
  ctx: InvestigationContext,
): Record<string, unknown> {
  const addr = normAddr(address)
  if (!isValidAddress(addr)) return { error: 'invalid_address', address: addr }
  const entry = lookupProbeEntry(fn)
  if (entry === undefined) {
    return {
      error: 'fn_not_whitelisted',
      allowed: PROBE_ENTRIES.map((v) => v.canonical),
    }
  }
  if (ctx.sandbox === undefined) {
    return { error: 'sandbox_unavailable' }
  }
  return { address: addr, fn: entry.canonical, pending: true }
}

function decodeProbeReturn(canonicalFn: string, rawHex: string): string {
  if (!rawHex.startsWith('0x') || rawHex.length <= 2) return rawHex
  try {
    const bytes = hexToBytes(rawHex as `0x${string}`)
    if (
      canonicalFn === 'name' ||
      canonicalFn === 'symbol' ||
      canonicalFn === 'version' ||
      canonicalFn === 'tokenURI'
    ) {
      return decodeAbiString(bytes) ?? rawHex.slice(0, 66)
    }
    if (canonicalFn === 'decimals' || canonicalFn === 'totalSupply') {
      if (bytes.length >= 32) return bytesToBigInt(bytes.subarray(0, 32)).toString()
    }
    if (
      canonicalFn === 'owner' ||
      canonicalFn === 'implementation' ||
      canonicalFn === 'token0' ||
      canonicalFn === 'token1'
    ) {
      if (bytes.length >= 32) return bytesToHex(bytes.subarray(12, 32)).toLowerCase()
    }
    if (canonicalFn === 'paused') {
      if (bytes.length >= 32) return bytesToBigInt(bytes.subarray(0, 32)) !== 0n ? 'true' : 'false'
    }
  } catch {
    // fall through to raw hex
  }
  return rawHex.slice(0, 66)
}

export async function runInvestigationToolAsync(
  name: InvestigationToolName,
  args: Record<string, unknown>,
  ctx: InvestigationContext,
): Promise<string> {
  if (name === 'probe_contract_view') {
    return trimPayload(
      await probeContractViewLive(String(args.address ?? ''), String(args.fn ?? ''), ctx),
    )
  }
  return runInvestigationTool(name, args, ctx)
}

/** Execute a whitelisted zero-arg read-only view against the local EVM sandbox. */
export async function probeContractViewLive(
  address: string,
  fn: string,
  ctx: InvestigationContext,
): Promise<Record<string, unknown>> {
  const addr = normAddr(address)
  if (!isValidAddress(addr)) return { error: 'invalid_address', address: addr }
  const entry = lookupProbeEntry(fn)
  if (entry === undefined) {
    return {
      error: 'fn_not_whitelisted',
      allowed: PROBE_ENTRIES.map((v) => v.canonical),
    }
  }
  if (ctx.sandbox === undefined) {
    return { error: 'sandbox_unavailable' }
  }
  const outcome = await ctx.sandbox.runEthCall(
    { to: addr, data: entry.selector, gas: quantityHex(PROBE_GAS) },
    undefined,
  )
  if ('error' in outcome) return { error: outcome.error }
  const hex = String(outcome.result ?? '')
  return { address: addr, fn: entry.canonical, value: decodeProbeReturn(entry.canonical, hex) }
}
