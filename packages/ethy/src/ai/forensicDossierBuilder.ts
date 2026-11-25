import type { ChainConfig } from '@ethereumjs/common'
import type { FlatStateManager } from '@ethereumjs/statemanager'

import { runDossierViewProbes } from '../contracts/contractDossierProbes.ts'
import type {
  ContractDossierProbes,
  ContractDossierStore,
} from '../contracts/contractDossierStore.ts'
import { scanBytecodeForensics } from '../contracts/contractForensics.ts'
import { buildCodeLookup, resolveCodeForAddress } from '../contracts/contractIntelligence.ts'
import { type KnownContractMeta, knownContractMeta } from '../contracts/knownContracts.ts'
import { EIP1967_IMPLEMENTATION_SLOT } from '../contracts/signatureCatalog.ts'
import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import type { EthySandbox } from '../evm/sandbox.ts'
import type { EthySpine } from '../spine/types.ts'
import type { InvestigationContext } from './investigationTools.ts'
import { isDecodedPreview } from './storyBeats.ts'
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
    kind?: KnownContractMeta['kind']
    role?: string
    symbol?: string
    decimals?: number
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

  // Resolve known contract metadata + reverse/forward-verified ENS primary name
  const staticMeta = knownContractMeta(BigInt(opts.chain.chainId), addr)
  const resolver =
    typeof opts.economy.getIdentityResolver === 'function'
      ? opts.economy.getIdentityResolver()
      : undefined
  const resolved =
    resolver !== undefined ? await resolver.resolveNow(addr, blockNumBigInt) : undefined
  const knownName = staticMeta?.name ?? resolved?.knownName
  const ensName = resolved?.ensName
  if (knownName !== undefined || ensName !== undefined || staticMeta !== undefined) {
    dossier.identity = {
      knownName,
      ensName,
      kind: staticMeta?.kind,
      role: staticMeta?.role,
      symbol: staticMeta?.symbol,
      decimals: staticMeta?.decimals,
    }
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

function formatScaledUnits(rawDigits: string, decimals: number, symbol?: string): string {
  try {
    const val = BigInt(rawDigits)
    if (decimals <= 0) return symbol !== undefined ? `${val.toString()} ${symbol}` : val.toString()
    const base = 10n ** BigInt(decimals)
    const whole = val / base
    const frac = val % base
    const wholeStr = whole.toLocaleString('en-US')
    let numStr: string
    if (frac === 0n) {
      numStr = wholeStr
    } else {
      const fracPadded = frac.toString().padStart(decimals, '0').slice(0, 4).replace(/0+$/, '')
      numStr = fracPadded.length > 0 ? `${wholeStr}.${fracPadded}` : wholeStr
    }
    return symbol !== undefined ? `${numStr} ${symbol}` : numStr
  } catch {
    return rawDigits
  }
}

/**
 * Scale raw ERC-20 integer amounts (`amount: 20000000` on 6-decimal USDC → `amount: 20 USDC`)
 * so small local models never misread base units as millions of ETH.
 */
export function formatHumanCallPreview(
  preview: string,
  decimals?: number,
  symbol?: string,
): string {
  if (decimals === undefined) return preview
  return preview.replace(
    /\b(amount|value|wad):\s*(\d+)\b/g,
    (_match, field: string, digits: string) =>
      `${field}: ${formatScaledUnits(digits, decimals, symbol)}`,
  )
}

/**
 * Render clean, plain-English observations for the storyteller prompt.
 * Never exposes internal selection metadata (dice, weights, candidate tables, subject keys),
 * hardfork city names (like "amsterdam"), or unlabeled 4-byte hex selectors.
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
    `Network: ${net}${isSepolia ? ' (Ethereum testnet — test ETH & test tokens only, not real funds)' : ''}, ${blockStr}.`,
  )
  lines.push(`Observation: ${lead.lead}`)

  const id = dossier.identity
  if (dossier.address !== undefined) {
    if (id?.kind === 'token' && id.knownName !== undefined) {
      const sym = id.symbol ?? id.knownName
      lines.push(
        `Subject contract: ${id.knownName} (${dossier.address}) — ${id.role ?? `${sym} ERC-20 token contract`}. IMPORTANT: this address is the ${sym} token smart contract itself, NOT a user wallet; transfers on it move ${sym} tokens, NOT ETH.`,
      )
    } else if (id?.role !== undefined && id.knownName !== undefined) {
      lines.push(`Subject contract: ${id.knownName} (${dossier.address}) — ${id.role}.`)
    } else if (id?.knownName !== undefined) {
      lines.push(`Subject: ${id.knownName} (${dossier.address}).`)
    } else {
      lines.push(`Address: ${dossier.address}`)
    }
  }
  if (id?.ensName !== undefined) {
    lines.push(
      `ENS primary name (reverse+forward verified): ${id.ensName} (self-set by address owner, not an official protocol badge).`,
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
        `Unrecognized custom function selectors (${s.unknownSelectors.length} — 4-byte method IDs, not addresses).`,
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
      `Recent activity: ${dossier.inboundCalls} inbound call(s) to this address${rev > 0 ? `, ${rev} reverted` : ''}.`,
    )
  }
  const decimals = id?.decimals ?? dossier.probes?.decimals
  const symbol = id?.symbol ?? dossier.probes?.symbol
  if (dossier.callPreviews !== undefined && dossier.callPreviews.length > 0) {
    const decodedCalls = dossier.callPreviews
      .filter(isDecodedPreview)
      .slice(0, 3)
      .map((c) => formatHumanCallPreview(c, decimals, symbol))
    const rawSelectors = dossier.callPreviews.filter((c) => !isDecodedPreview(c)).slice(0, 2)
    if (decodedCalls.length > 0) {
      lines.push(`Decoded calls into this contract: ${decodedCalls.join(' | ')}.`)
    } else if (rawSelectors.length > 0) {
      lines.push(
        `Calls invoked an unrecognized custom function (4-byte method selector ${rawSelectors.join(', ')} — NOT a contract address or storage slot).`,
      )
    }
  }
  if (dossier.eventPreviews !== undefined && dossier.eventPreviews.length > 0) {
    const decodedEvents = dossier.eventPreviews.filter(isDecodedPreview).slice(0, 3)
    if (decodedEvents.length > 0) {
      lines.push(`Decoded events emitted: ${decodedEvents.join(' | ')}.`)
    }
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
