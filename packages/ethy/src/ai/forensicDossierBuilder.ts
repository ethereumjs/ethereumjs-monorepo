import type { ChainConfig } from '@ethereumjs/common'
import type { FlatStateManager } from '@ethereumjs/statemanager'

import type { ContractDossierStore } from '../contracts/contractDossierStore.ts'
import { scanBytecodeForensics } from '../contracts/contractForensics.ts'
import { buildCodeLookup, resolveCodeForAddress } from '../contracts/contractIntelligence.ts'
import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import type { EthySandbox } from '../evm/sandbox.ts'
import type { StoryLead } from './storyDirector.ts'

export type ForensicDossier = {
  beat: string
  subjectKey: string
  address?: string
  lead: string
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
  dice?: { roll?: number; candidates?: StoryLead['beatCandidates'] }
}

export function buildForensicDossier(opts: {
  lead: StoryLead
  economy: ETHEconomyDataManager
  stateManager: FlatStateManager
  chain: ChainConfig
  blockNumber: string
  store?: ContractDossierStore
}): ForensicDossier {
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
      return undefined
    })()
    opts.store?.upsertStatic(addr, opts.blockNumber, scan, scan.fingerprint.proxyKind, implAddr)
    if (implAddr !== undefined && implAddr.toLowerCase() !== addr.toLowerCase()) {
      const implAgg = opts.economy.getContractAgg(implAddr)
      const implCode = resolveCodeForAddress(implAddr, lookup, implAgg)
      if (implCode !== undefined && implCode.length > 0) {
        dossier.implStatic = scanBytecodeForensics(implCode)
      }
    }
  }

  const prior = opts.store?.get(addr)?.aiNotes?.hypothesis
  if (prior !== undefined) dossier.priorHypothesis = prior

  return dossier
}
