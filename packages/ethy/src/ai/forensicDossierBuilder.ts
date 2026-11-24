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
  }

  const lookup = buildCodeLookup(opts.stateManager, opts.chain)
  const code = resolveCodeForAddress(addr, lookup, agg)
  if (code !== undefined && code.length > 0) {
    const scan = scanBytecodeForensics(code)
    dossier.static = scan
    opts.store?.upsertStatic(
      addr,
      opts.blockNumber,
      scan,
      scan.fingerprint.proxyKind,
      scan.fingerprint.proxyTarget,
    )
  }

  const prior = opts.store?.get(addr)?.aiNotes?.hypothesis
  if (prior !== undefined) dossier.priorHypothesis = prior

  return dossier
}
