import type { ChainConfig } from '@ethereumjs/common'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import { bytesToUnprefixedHex, hexToBytes } from '@ethereumjs/util'
import type { ContractDossierStore } from '../contracts/contractDossierStore.ts'
import {
  buildCodeLookup,
  buildContractProfile,
  createFingerprintCache,
  narrateContract,
  topEventLabels,
  topSelectorLabels,
} from '../contracts/contractIntelligence.ts'
import { lookupFunctionSelector } from '../contracts/signatureCatalog.ts'
import { ethyKeccak256 } from '../crypto/keccak.ts'
import { provenanceLabelForAccountHash } from '../custody/provenance.ts'
import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import { formatSignedEthFromWei, shortAddress } from '../economy/format.ts'
import { ECONOMY_LEADERBOARD_SIZE } from '../economy/types.ts'
import type { EthySpine, WidgetSpec } from '../spine/types.ts'

export function resolveContractTarget(spine: EthySpine, arg: string): string | undefined {
  const trimmed = arg.trim()
  if (trimmed.length === 0) {
    return spine.economy?.topContracts[0]?.address
  }
  const rank = Number.parseInt(trimmed, 10)
  if (!Number.isNaN(rank) && rank >= 1 && rank <= ECONOMY_LEADERBOARD_SIZE) {
    return spine.economy?.topContracts[rank - 1]?.address
  }
  const hex = trimmed.toLowerCase()
  if (/^0x[0-9a-f]{40}$/.test(hex)) return hex
  return undefined
}

export function contractMicroscopeWidget(
  spine: EthySpine,
  stateManager: FlatStateManager,
  chain: ChainConfig,
  economy: ETHEconomyDataManager,
  arg: string,
  dossierStore?: ContractDossierStore,
): WidgetSpec {
  const address = resolveContractTarget(spine, arg)
  if (address === undefined) {
    return {
      kind: 'key_value',
      title: 'Contract',
      entries: [{ key: 'Status', value: 'No hot contract or invalid address/rank' }],
    }
  }
  const row = spine.economy?.topContracts.find((c) => c.address === address)
  const agg = economy.getContractAgg(address)
  if (row === undefined || agg === undefined) {
    return {
      kind: 'key_value',
      title: 'Contract',
      entries: [{ key: 'Status', value: 'Not in the 64-block window' }],
    }
  }
  const cache = createFingerprintCache()
  const lookup = buildCodeLookup(stateManager, chain)
  const profile = buildContractProfile(row, agg, lookup, cache)
  const arch = profile.archetype ?? 'Contract'
  const conf = profile.confidence ?? 'low'
  const addrHex = address.startsWith('0x') ? address : `0x${address}`
  const accHash = bytesToUnprefixedHex(ethyKeccak256(hexToBytes(addrHex as `0x${string}`)))
  const source = provenanceLabelForAccountHash(accHash)
  const preface: Array<{ key: string; value: string }> = [
    {
      key: 'Address',
      value:
        profile.knownName !== undefined ? `${profile.knownName} ${shortAddress(address)}` : address,
    },
    ...(source !== undefined ? [{ key: 'Source', value: source }] : []),
    { key: 'Archetype', value: `${arch} · ${conf}` },
    { key: 'Blocks active', value: String(profile.blocksActive) },
    { key: 'Storage writes', value: String(profile.storageWrites) },
    { key: 'Storage reads', value: String(profile.storageReads) },
    { key: 'Net ETH Δ', value: formatSignedEthFromWei(profile.netEthDeltaWei) },
  ]
  if (agg.inboundReverts > 0) {
    preface.push({ key: 'Receipt reverts', value: String(agg.inboundReverts) })
  }
  if (agg.gasUsedWei > 0n) {
    preface.push({ key: 'Gas used (window)', value: agg.gasUsedWei.toString() })
  }
  if (agg.valueTxCount > 0) {
    preface.push({
      key: 'ERC-20 inflow',
      value: `${agg.valueTxCount} transfers · ${agg.valueReceivedWei.toString()} wei`,
    })
  }
  const dossier = dossierStore?.get(address)
  if (dossier !== undefined) {
    if (dossier.unknownSelectorCount > 0) {
      preface.push({ key: 'Unknown selectors', value: String(dossier.unknownSelectorCount) })
    }
    if (dossier.aiNotes?.hypothesis !== undefined) {
      preface.push({
        key: 'Last AI hypothesis',
        value: dossier.aiNotes.hypothesis.slice(0, 72),
      })
    }
    if (dossier.timesFeatured > 0) {
      preface.push({ key: 'Story features', value: String(dossier.timesFeatured) })
    }
    if (dossier.compilerHint !== undefined) {
      preface.push({ key: 'Compiler', value: dossier.compilerHint })
    }
    if (dossier.probes?.name !== undefined) {
      preface.push({ key: 'Token name', value: dossier.probes.name })
    }
    if (dossier.probes?.symbol !== undefined) {
      preface.push({ key: 'Symbol', value: dossier.probes.symbol })
    }
    if (dossier.probes?.owner !== undefined) {
      preface.push({ key: 'Owner (probe)', value: shortAddress(dossier.probes.owner) })
    }
  }
  if (profile.fingerprint !== undefined) {
    preface.push({ key: 'Bytecode', value: `${profile.fingerprint.bytecodeSize} bytes` })
    if (profile.proxyTarget !== undefined) {
      preface.push({
        key: 'Proxy',
        value: `${profile.proxyKind ?? 'proxy'} → ${shortAddress(profile.proxyTarget)}`,
      })
    }
  }
  const callRows = topSelectorLabels(agg, 8).map((label) => [
    label.split(' (')[0] ?? label,
    label.match(/\((\d+)x\)/)?.[1] ?? '0',
  ])
  const eventRows = topEventLabels(agg, 8).map((label) => {
    const [name, count] = label.split(' · ')
    return [name ?? label, count ?? '0']
  })
  const debugSections = []
  if (profile.fingerprint !== undefined) {
    const selLines: Array<{ key: string; value: string }> = []
    for (const sel of profile.fingerprint.implementedSelectors) {
      const row = lookupFunctionSelector(sel)
      selLines.push({ key: sel, value: row !== undefined ? row.signature : 'unknown' })
    }
    debugSections.push({ title: 'PUSH4 selectors', entries: selLines })
    const op = profile.fingerprint.opcodeCounts
    debugSections.push({
      title: 'Opcode counts',
      entries: [
        { key: 'SSTORE', value: String(op.sstore) },
        { key: 'SLOAD', value: String(op.sload) },
        { key: 'CALL', value: String(op.call) },
        { key: 'STATICCALL', value: String(op.staticcall) },
        { key: 'DELEGATECALL', value: String(op.delegatecall) },
        { key: 'LOG1..4', value: `${op.log1}/${op.log2}/${op.log3}/${op.log4}` },
      ],
    })
  }
  if (agg.implSlotValue !== undefined) {
    debugSections.push({
      title: 'EIP-1967 slot',
      entries: [{ key: 'implementation', value: agg.implSlotValue }],
    })
  }
  const co = [...agg.coTouched].slice(0, 12).map(shortAddress).join(', ')
  if (co.length > 0) {
    debugSections.push({
      title: 'Co-touched (BAL)',
      entries: [{ key: 'Addresses', value: co }],
    })
  }
  if (profile.callPreviews.length > 0 || profile.eventPreviews.length > 0) {
    const decodedEntries: Array<{ key: string; value: string }> = []
    for (let i = 0; i < profile.callPreviews.length; i++) {
      decodedEntries.push({ key: `Call #${i + 1}`, value: profile.callPreviews[i]! })
    }
    for (let i = 0; i < profile.eventPreviews.length; i++) {
      decodedEntries.push({ key: `Event #${i + 1}`, value: profile.eventPreviews[i]! })
    }
    debugSections.push({
      title: 'Decoded ABI samples',
      entries: decodedEntries,
    })
  }
  const overviewNote = narrateContract(profile)
  return {
    kind: 'table',
    title: `Contract ${shortAddress(address)}`,
    headers: ['Call', 'Count'],
    rows: callRows.length > 0 ? callRows : [['—', '0']],
    preface,
    secondaryTable:
      eventRows.length > 0
        ? { title: 'Events', headers: ['Event', 'Count'], rows: eventRows }
        : undefined,
    assistantComment: overviewNote,
    debugPage: debugSections,
  }
}
