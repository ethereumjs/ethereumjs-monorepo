import type { ChainDispatchCard } from '../spine/types.ts'
import type { InvestigationJournal } from './investigationJournal.ts'
import type { StoryBrief } from './storyBrief.ts'

export type StoryLens = 'detective' | 'security' | 'economics' | 'lore'

const LENS_CYCLE: StoryLens[] = ['detective', 'security', 'economics', 'lore']

export type StoryLead = {
  lens: StoryLens
  lead: string
  subjectKey: string
  relatedAddress?: string
  followUp: boolean
  quiet: boolean
}

export function parseLensOverride(raw?: string): StoryLens | undefined {
  if (raw === undefined) return undefined
  const t = raw.toLowerCase()
  if (t === 'history') return 'lore'
  if (t === 'detective' || t === 'security' || t === 'economics' || t === 'lore') {
    return t
  }
  return undefined
}

function lastLens(journal: InvestigationJournal): StoryLens | undefined {
  const latest = journal.latest()
  return latest?.lens
}

function nextLens(journal: InvestigationJournal): StoryLens {
  const prev = lastLens(journal)
  if (prev === undefined) return 'detective'
  const idx = LENS_CYCLE.indexOf(prev)
  return LENS_CYCLE[(idx + 1) % LENS_CYCLE.length]!
}

function isQuiet(brief: StoryBrief): boolean {
  const top = brief.signals[0]
  if (top === undefined) return true
  return top.noveltyScore < 35
}

function pickQuietLead(brief: StoryBrief): {
  lead: string
  subjectKey: string
  relatedAddress?: string
} {
  const moment = brief.moments[0]
  if (moment !== undefined) {
    return {
      lead: moment.headline,
      subjectKey: `moment:${moment.id}`,
      relatedAddress: moment.address,
    }
  }
  const hot = brief.hotContracts[0]
  if (hot !== undefined) {
    const name = hot.knownName ?? hot.address
    return {
      lead: `Active contract ${name} leads a quiet stretch`,
      subjectKey: `contract:${hot.address}`,
      relatedAddress: hot.address,
    }
  }
  return {
    lead: `Block ${brief.head.blockNumber ?? '?'} — steady execution layer`,
    subjectKey: `head:${brief.head.blockNumber ?? '0'}`,
  }
}

function pickSignalLead(
  brief: StoryBrief,
  journal: InvestigationJournal,
): { lead: string; subjectKey: string; relatedAddress?: string; followUp: boolean } {
  const sig = brief.signals[0]!
  const subjectKey = `signal:${sig.id}`
  const relatedAddress = sig.address
  const prev = journal.snapshot(6).find((e) => e.subjectKey === subjectKey)
  let followUp = false
  if (prev !== undefined && prev.signalScore !== undefined) {
    followUp = sig.noveltyScore >= prev.signalScore + 20
  }
  return {
    lead: sig.headline,
    subjectKey,
    relatedAddress,
    followUp,
  }
}

function shouldPenalizeRepeat(
  journal: InvestigationJournal,
  subjectKey: string,
  relatedAddress?: string,
  followUp?: boolean,
): boolean {
  if (followUp === true) return false
  const recent = journal.snapshot(2)
  for (const card of recent) {
    if (card.subjectKey === subjectKey) return true
    if (
      relatedAddress !== undefined &&
      card.relatedAddress !== undefined &&
      card.relatedAddress.toLowerCase() === relatedAddress.toLowerCase()
    ) {
      return true
    }
  }
  return false
}

function lensForSignal(kind: string): StoryLens {
  if (kind === 'delegation_surge') return 'security'
  if (kind === 'l2_blob_pressure') return 'economics'
  if (kind === 'congestion_pressure') return 'economics'
  return 'detective'
}

export function directStory(
  brief: StoryBrief,
  journal: InvestigationJournal,
  lensOverride?: StoryLens,
): StoryLead {
  const quiet = isQuiet(brief)
  let lens = lensOverride ?? nextLens(journal)

  if (quiet) {
    const { lead, subjectKey, relatedAddress } = pickQuietLead(brief)
    if (lensOverride === undefined) {
      lens = brief.moments[0]?.kind === 'graffiti_note' ? 'lore' : 'economics'
    }
    return { lens, lead, subjectKey, relatedAddress, followUp: false, quiet: true }
  }

  const { lead, subjectKey, relatedAddress, followUp } = pickSignalLead(brief, journal)
  if (lensOverride === undefined) {
    lens = lensForSignal(brief.signals[0]!.kind)
  }

  if (shouldPenalizeRepeat(journal, subjectKey, relatedAddress, followUp)) {
    lens = nextLens(journal)
  }

  return { lens, lead, subjectKey, relatedAddress, followUp, quiet: false }
}

export function recentLoreIds(journal: InvestigationJournal): string[] {
  return journal
    .snapshot(6)
    .map((c) => c.loreCardId)
    .filter((id): id is string => id !== undefined)
}

export function headlineSnippet(card: ChainDispatchCard): string {
  return card.headline.slice(0, 72)
}
