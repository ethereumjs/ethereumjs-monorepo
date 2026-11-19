import type { ChainConfig } from '@ethereumjs/common'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'

import { knownContractName } from '../contracts/knownContracts.ts'
import { ethyKeccak256 } from '../crypto/keccak.ts'
import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import type { EthySandbox } from '../evm/sandbox.ts'
import type { EthySpine } from '../spine/types.ts'

export type InvestigationToolName =
  | 'inspect_contract'
  | 'inspect_delegations'
  | 'inspect_storage_slot'
  | 'inspect_l2_blobs'
  | 'inspect_account'
  | 'probe_contract_view'

const MAX_JSON_CHARS = 1400
const LIST_CAP = 6
const PROBE_GAS = 100_000n

const PROBE_SELECTORS: Record<string, `0x${string}`> = {
  name: '0x06fdde03',
  symbol: '0x95d89b41',
  decimals: '0x313ce567',
  totalSupply: '0x18160ddd',
  owner: '0x8da5cb5b',
  implementation: '0x5c60da1b',
  paused: '0x5c975abb',
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
]

function trimPayload(obj: unknown): string {
  let s = JSON.stringify(obj)
  if (s.length <= MAX_JSON_CHARS) return s
  return `${s.slice(0, MAX_JSON_CHARS - 1)}…`
}

function normAddr(a: string): string {
  return a.toLowerCase()
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
    default:
      return trimPayload({ error: 'unknown_tool' })
  }
}

function inspectContract(address: string, ctx: InvestigationContext): Record<string, unknown> {
  const addr = normAddr(address)
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
  const codeHex = code.length > 0 ? bytesToHex(code) : undefined
  const selectors = agg
    ? [...agg.selectorCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, LIST_CAP)
        .map(([sel, n]) => ({ sel, n }))
    : []
  return {
    address: addr,
    knownName: knownContractName(BigInt(ctx.chain.chainId), addr) ?? identity.getKnownName(addr),
    bytecodeBytes: code.length,
    blocksActive: blocks,
    gasUsedWindow: gasTotal.toString(),
    revertsWindow: reverts,
    topSelectors: selectors,
    codePrefix: codeHex?.slice(0, 10),
  }
}

function inspectDelegations(delegate: string, ctx: InvestigationContext): Record<string, unknown> {
  const target = normAddr(delegate)
  let count = 0
  let revocations = 0
  for (const b of ctx.economy.getBlockRing()) {
    const row = b.delegationTargets?.find((d) => d.target === target)
    if (row !== undefined) {
      count += row.count
      revocations += row.revocations
    }
  }
  return {
    delegateAddress: target,
    delegationCount: count,
    revocations,
    knownName: knownContractName(BigInt(ctx.chain.chainId), target),
  }
}

function inspectStorageSlot(
  address: string,
  slot: string,
  ctx: InvestigationContext,
): Record<string, unknown> {
  const series = ctx.economy.getSlotTracker().seriesFor(address, slot) ?? []
  const trend = ctx.economy.getSlotTracker().classify(`${normAddr(address)}:${slot}`)
  return {
    address: normAddr(address),
    slot,
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
    inboxes: filtered,
  }
}

function inspectAccount(address: string, ctx: InvestigationContext): Record<string, unknown> {
  const addr = normAddr(address)
  const identity = ctx.economy.getIdentityResolver()
  const accHash = ethyKeccak256(hexToBytes(addr as `0x${string}`))
  const acc = ctx.stateManager.getAccountByHash(accHash)
  const code =
    acc !== undefined
      ? (ctx.stateManager.getCodeByHash(acc.codeHash) ?? new Uint8Array(0))
      : new Uint8Array(0)
  const isContract = code.length > 0
  let burst = false
  for (const b of ctx.economy.getBlockRing()) {
    if (b.sameSenderBursts?.includes(addr)) burst = true
  }
  return {
    address: addr,
    balanceWei: acc?.balance?.toString() ?? '0',
    nonce: acc?.nonce?.toString() ?? '0',
    isContract,
    knownName: identity.getKnownName(addr),
    senderBurst: burst || undefined,
  }
}

function probeContractView(
  address: string,
  fn: string,
  ctx: InvestigationContext,
): Record<string, unknown> {
  const key = fn.trim().toLowerCase()
  const sel = PROBE_SELECTORS[key]
  if (sel === undefined) {
    return { error: 'fn_not_whitelisted', allowed: Object.keys(PROBE_SELECTORS) }
  }
  if (ctx.sandbox === undefined) {
    return { error: 'sandbox_unavailable' }
  }
  const addr = normAddr(address)
  void ctx
  return { address: addr, fn: key, pending: true }
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

/** Sync probe for tests and deterministic paths. */
export async function probeContractViewLive(
  address: string,
  fn: string,
  ctx: InvestigationContext,
): Promise<Record<string, unknown>> {
  const key = fn.trim().toLowerCase()
  const sel = PROBE_SELECTORS[key]
  if (sel === undefined) {
    return { error: 'fn_not_whitelisted' }
  }
  if (ctx.sandbox === undefined) {
    return { error: 'sandbox_unavailable' }
  }
  const outcome = await ctx.sandbox.runEthCall(
    { to: address, data: sel, gas: PROBE_GAS },
    undefined,
  )
  if ('error' in outcome) return { error: outcome.error }
  const hex = String(outcome.result ?? '')
  return { fn: key, result: hex.slice(0, 66) }
}
