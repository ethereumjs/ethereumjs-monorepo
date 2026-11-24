import type { ChainConfig } from '@ethereumjs/common'
import type { FlatStateManager } from '@ethereumjs/statemanager'

import { runDossierViewProbes } from '../contracts/contractDossierProbes.ts'
import type {
  ContractDossierProbes,
  ContractDossierStore,
} from '../contracts/contractDossierStore.ts'
import { scanBytecodeForensics } from '../contracts/contractForensics.ts'
import { buildCodeLookup, resolveCodeForAddress } from '../contracts/contractIntelligence.ts'
import { knownContractName } from '../contracts/knownContracts.ts'
import { EIP1967_IMPLEMENTATION_SLOT } from '../contracts/signatureCatalog.ts'
import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import type { EthySandbox } from '../evm/sandbox.ts'
import type { EthySpine } from '../spine/types.ts'
import type { InvestigationContext } from './investigationTools.ts'
import type { StoryBrief } from './storyBrief.ts'
import type { StoryLead } from './storyDirector.ts'

export type ForensicDossier = {
  beat: string
  subjectKey: string
  address?: string
  lead: string
  identity?: {
    knownName?: string
    ensName?: string
  }
  relatedEnsNames?: Array<{ address: string; ensName: string }>
  static?: ReturnType<typeof scanBytecodeForensics>
  callPreviews?: string[]
  eventPreviews?: string[]
  inboundCalls?: number
  priorHypothesis?: string
  behavior?: {
    inboundReverts: number
    gasUsedWei: string
    valueReceivedWei: string
    valueTxCount: number
  }
  implStatic?: ReturnType<typeof scanBytecodeForensics>
  probes?: ContractDossierProbes
  dice?: { roll?: number; candidates?: StoryLead['beatCandidates'] }
}

export async function buildForensicDossier(opts: {
  lead: StoryLead
  economy: ETHEconomyDataManager
  stateManager: FlatStateManager
  chain: ChainConfig
  blockNumber: string
  store?: ContractDossierStore
  sandbox?: EthySandbox
  spine?: EthySpine
}): Promise<ForensicDossier> {
  const lead = opts.lead
  const dossier: ForensicDossier = {
    beat: lead.beat,
    subjectKey: lead.subjectKey,
    address: lead.relatedAddress,
    lead: lead.lead,
    dice: { roll: lead.diceRoll, candidates: lead.beatCandidates },
  }
  const addr = lead.relatedAddress
  if (addr === undefined) return dossier

  const blockNumBigInt = (() => {
    try {
      return BigInt(opts.blockNumber)
    } catch {
      return 0n
    }
  })()

  // Resolve known contract label + reverse/forward-verified ENS primary name
  const staticKnown = knownContractName(BigInt(opts.chain.chainId), addr)
  const resolver =
    typeof opts.economy.getIdentityResolver === 'function'
      ? opts.economy.getIdentityResolver()
      : undefined
  const resolved =
    resolver !== undefined ? await resolver.resolveNow(addr, blockNumBigInt) : undefined
  const knownName = staticKnown ?? resolved?.knownName
  const ensName = resolved?.ensName
  if (knownName !== undefined || ensName !== undefined) {
    dossier.identity = { knownName, ensName }
  }

  const agg = opts.economy.getContractAgg(addr)
  if (agg !== undefined) {
    dossier.callPreviews = agg.callPreviews.slice(0, 3)
    dossier.eventPreviews = agg.eventPreviews.slice(0, 3)
    dossier.inboundCalls = agg.inboundCalls
    dossier.behavior = {
      inboundReverts: agg.inboundReverts,
      gasUsedWei: agg.gasUsedWei.toString(),
      valueReceivedWei: agg.valueReceivedWei.toString(),
      valueTxCount: agg.valueTxCount,
    }
  }

  const lookup = buildCodeLookup(opts.stateManager, opts.chain)
  const code = resolveCodeForAddress(addr, lookup, agg)
  if (code !== undefined && code.length > 0) {
    const scan = scanBytecodeForensics(code)
    dossier.static = scan
    const implAddr = (() => {
      if (scan.fingerprint.proxyTarget !== undefined) return scan.fingerprint.proxyTarget
      if (agg?.implSlotValue !== undefined && /^0x[0-9a-f]{40}$/i.test(agg.implSlotValue)) {
        return agg.implSlotValue
      }
      if (scan.fingerprint.pushes1967ImplSlot) {
        const slotHex = lookup.getStorageSlotForAddress?.(addr, EIP1967_IMPLEMENTATION_SLOT)
        if (slotHex !== undefined && slotHex.length >= 42) {
          const candidate = `0x${slotHex.slice(-40).toLowerCase()}`
          if (candidate !== `0x${'0'.repeat(40)}`) return candidate
        }
      }
      return undefined
    })()
    if (implAddr !== undefined && implAddr.toLowerCase() !== addr.toLowerCase()) {
      const implAgg = opts.economy.getContractAgg(implAddr)
      const implCode = resolveCodeForAddress(implAddr, lookup, implAgg)
      if (implCode !== undefined && implCode.length > 0) {
        dossier.implStatic = scanBytecodeForensics(implCode)
      }
    }
    opts.store?.upsertStatic(
      addr,
      opts.blockNumber,
      scan,
      scan.fingerprint.proxyKind,
      implAddr,
      dossier.implStatic?.codeHash,
    )
  }

  const prior = opts.store?.get(addr)?.aiNotes?.hypothesis
  if (prior !== undefined) dossier.priorHypothesis = prior

  const probeScan = dossier.implStatic ?? dossier.static
  // Resolve verified ENS names for up to 2 embedded bytecode addresses
  if (probeScan !== undefined && resolver !== undefined && probeScan.embeddedAddresses.length > 0) {
    const relatedEns: Array<{ address: string; ensName: string }> = []
    for (const embedded of probeScan.embeddedAddresses.slice(0, 2)) {
      if (embedded.toLowerCase() === addr.toLowerCase()) continue
      const hit = await resolver.resolveNow(embedded, blockNumBigInt, { ensOnly: true })
      if (hit.ensName !== undefined) {
        relatedEns.push({ address: embedded, ensName: hit.ensName })
      }
    }
    if (relatedEns.length > 0) dossier.relatedEnsNames = relatedEns
  }

  if (probeScan !== undefined && opts.sandbox !== undefined && opts.spine !== undefined) {
    const ctx: InvestigationContext = {
      economy: opts.economy,
      stateManager: opts.stateManager,
      chain: opts.chain,
      sandbox: opts.sandbox,
      spine: opts.spine,
    }
    const probes = await runDossierViewProbes({
      ctx,
      address: addr,
      scan: probeScan,
      blockNumber: opts.blockNumber,
      store: opts.store,
    })
    if (probes !== undefined) dossier.probes = probes
  } else {
    const cachedProbes = opts.store?.get(addr)?.probes
    if (cachedProbes !== undefined) dossier.probes = cachedProbes
  }

  return dossier
}

/**
 * Strip internal selection metadata (dice roll / candidate weights) before sending
 * structured facts to an LLM scout.
 */
export function stripInternalDossierFields(
  dossier: ForensicDossier,
): Omit<ForensicDossier, 'dice'> {
  const { dice: _dice, ...clean } = dossier
  return clean
}

/**
 * Render clean, plain-English observations for the storyteller prompt.
 * Never exposes internal selection metadata (dice, weights, candidate tables, subject keys)
 * or raw JSON field names, keeping small local models grounded and conversational.
 */
export function renderPromptFacts(opts: {
  dossier: ForensicDossier
  brief: StoryBrief
  lead: StoryLead
  toolResults?: Array<{ tool: string; result: string }>
}): string {
  const { dossier, brief, lead, toolResults } = opts
  const lines: string[] = []
  const net = brief.network
  const isSepolia = net.toLowerCase().includes('sepolia')
  const blockStr =
    brief.head.blockNumber !== undefined ? `block #${brief.head.blockNumber}` : 'the latest block'
  lines.push(
    `Network: ${net}${isSepolia ? ' (testnet — test ETH only, not real funds)' : ''}, ${blockStr} (${brief.hardfork}).`,
  )
  lines.push(`Observation: ${lead.lead}`)

  if (dossier.address !== undefined) {
    lines.push(`Address: ${dossier.address}`)
  }
  if (dossier.identity?.knownName !== undefined) {
    lines.push(`Known label: ${dossier.identity.knownName}`)
  }
  if (dossier.identity?.ensName !== undefined) {
    lines.push(
      `ENS primary name (reverse+forward verified): ${dossier.identity.ensName} (owner-set name, not an official protocol endorsement)`,
    )
  }
  if (dossier.relatedEnsNames !== undefined && dossier.relatedEnsNames.length > 0) {
    const pairs = dossier.relatedEnsNames.map((r) => `${r.address} -> ${r.ensName}`).join(', ')
    lines.push(`Embedded addresses with verified ENS names: ${pairs}`)
  }

  if (dossier.static !== undefined) {
    const s = dossier.static
    const kb = (s.bytecodeSize / 1024).toFixed(1)
    const parts: string[] = [`${kb} KB bytecode`]
    if (s.fingerprint.proxyKind !== undefined) {
      parts.push(`proxy type ${s.fingerprint.proxyKind}`)
    }
    if (s.fingerprint.proxyTarget !== undefined) {
      parts.push(`delegates to ${s.fingerprint.proxyTarget}`)
    }
    if (s.compilerHint !== undefined) {
      parts.push(`compiler ${s.compilerHint}`)
    }
    lines.push(`Bytecode: ${parts.join(', ')}.`)

    const notableFlags: string[] = []
    if (s.opcodeFlags.delegatecall) notableFlags.push('uses DELEGATECALL')
    if (s.opcodeFlags.create2) notableFlags.push('uses CREATE2')
    if (s.opcodeFlags.selfdestruct) notableFlags.push('contains SELFDESTRUCT')
    if (s.opcodeFlags.blobhash) notableFlags.push('reads BLOBHASH')
    if (s.opcodeFlags.tstore) notableFlags.push('uses transient storage (TLOAD/TSTORE)')
    if (notableFlags.length > 0) {
      lines.push(`Notable opcodes: ${notableFlags.join(', ')}.`)
    }

    if (s.knownSelectors.length > 0) {
      lines.push(
        `Recognized functions: ${s.knownSelectors
          .slice(0, 6)
          .map((sel) => sel.name)
          .join(', ')}.`,
      )
    } else if (s.unknownSelectors.length > 0) {
      lines.push(
        `Unrecognized function selectors (${s.unknownSelectors.length}): ${s.unknownSelectors
          .slice(0, 4)
          .join(', ')}.`,
      )
    }

    if (s.embeddedStrings.length > 0) {
      lines.push(
        `Strings inside bytecode: ${s.embeddedStrings
          .slice(0, 4)
          .map((x) => `"${x}"`)
          .join(', ')}.`,
      )
    }
  }

  if (dossier.implStatic !== undefined) {
    const impl = dossier.implStatic
    const implKb = (impl.bytecodeSize / 1024).toFixed(1)
    const implSelectors = impl.knownSelectors.slice(0, 5).map((sel) => sel.name)
    lines.push(
      `Implementation bytecode: ${implKb} KB${implSelectors.length > 0 ? `, functions: ${implSelectors.join(', ')}` : ''}.`,
    )
  }

  if (dossier.probes !== undefined) {
    const probeBits: string[] = []
    if (dossier.probes.name !== undefined) probeBits.push(`name="${dossier.probes.name}"`)
    if (dossier.probes.symbol !== undefined) probeBits.push(`symbol="${dossier.probes.symbol}"`)
    if (dossier.probes.owner !== undefined) probeBits.push(`owner=${dossier.probes.owner}`)
    if (dossier.probes.paused !== undefined)
      probeBits.push(`paused=${String(dossier.probes.paused)}`)
    if (dossier.probes.totalSupply !== undefined)
      probeBits.push(`totalSupply=${dossier.probes.totalSupply}`)
    if (probeBits.length > 0) {
      lines.push(`Live view-call results: ${probeBits.join(', ')}.`)
    }
  }

  if (dossier.inboundCalls !== undefined && dossier.inboundCalls > 0) {
    const rev = dossier.behavior?.inboundReverts ?? 0
    lines.push(
      `Recent activity: ${dossier.inboundCalls} inbound call(s)${rev > 0 ? `, ${rev} reverted` : ''}.`,
    )
  }
  if (dossier.callPreviews !== undefined && dossier.callPreviews.length > 0) {
    lines.push(`Observed calls: ${dossier.callPreviews.slice(0, 3).join(' | ')}.`)
  }
  if (dossier.eventPreviews !== undefined && dossier.eventPreviews.length > 0) {
    lines.push(`Observed events: ${dossier.eventPreviews.slice(0, 3).join(' | ')}.`)
  }
  if (dossier.priorHypothesis !== undefined) {
    lines.push(`Earlier note on this address: ${dossier.priorHypothesis}`)
  }

  // Only include block proposer graffiti when this story is specifically about it
  if (
    lead.subjectKey.startsWith('proposer_graffiti:') &&
    brief.head.proposerGraffiti !== undefined
  ) {
    lines.push(`Block extraData graffiti: "${brief.head.proposerGraffiti}"`)
  }

  if (toolResults !== undefined && toolResults.length > 0) {
    for (const tr of toolResults.slice(0, 2)) {
      lines.push(`Extra check (${tr.tool}): ${tr.result.slice(0, 360)}`)
    }
  }

  return lines.join('\n')
}
