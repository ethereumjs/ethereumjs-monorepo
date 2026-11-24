import type { ChainDispatchCard } from '../spine/types.ts'
import type { InvestigationJournal } from './investigationJournal.ts'
import { type PickStoryBeatOpts, type StoryBeatKind, pickStoryBeat } from './storyBeats.ts'
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
  beat: StoryBeatKind
  baseScore: number
  diceRoll?: number
  beatCandidates?: Array<{ beat: StoryBeatKind; subjectKey: string; weight: number }>
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

export function parseBeatOverride(raw?: string): StoryBeatKind | undefined {
  if (raw === undefined) return undefined
  const beats: StoryBeatKind[] = [
    'contract_deep_dive',
    'newborn_contract',
    'call_pattern_mystery',
    'storage_slot_pulse',
    'tx_or_address_oddity',
    'protocol_feature_spot',
  ]
  return beats.includes(raw as StoryBeatKind) ? (raw as StoryBeatKind) : undefined
}

function isQuiet(brief: StoryBrief): boolean {
  const top = brief.signals[0]
  if (top === undefined) return true
  return top.noveltyScore < 35
}

export function directStory(
  brief: StoryBrief,
  journal: InvestigationJournal,
  lensOverride?: StoryLens,
  beatOpts?: PickStoryBeatOpts,
): StoryLead {
  const quiet = isQuiet(brief)
  const merged: PickStoryBeatOpts = {
    ...beatOpts,
    lens: lensOverride ?? beatOpts?.lens,
  }
  const picked = pickStoryBeat(brief, journal, merged)
  return {
    lens: picked.lens,
    lead: picked.lead,
    subjectKey: picked.subjectKey,
    relatedAddress: picked.address,
    followUp: picked.followUp ?? false,
    quiet,
    beat: picked.beat,
    baseScore: picked.baseScore,
    diceRoll: picked.roll,
    beatCandidates: picked.candidates,
  }
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
