import type { InvestigationJournal } from './investigationJournal.ts'
import type {
  StoryBrief,
  StoryBriefHotContract,
  StoryBriefMoment,
  StoryBriefSignal,
} from './storyBrief.ts'
import type { StoryLens } from './storyDirector.ts'

export type StoryBeatKind =
  | 'contract_deep_dive'
  | 'newborn_contract'
  | 'call_pattern_mystery'
  | 'storage_slot_pulse'
  | 'tx_or_address_oddity'
  | 'protocol_feature_spot'

export type StoryBeatCandidate = {
  beat: StoryBeatKind
  baseScore: number
  subjectKey: string
  address?: string
  lead: string
  lens: StoryLens
  followUp?: boolean
}

export type StoryBeatPick = StoryBeatCandidate & {
  effectiveWeight: number
  roll: number
  candidates: Array<{ beat: StoryBeatKind; subjectKey: string; weight: number }>
}

const BEAT_TEMPERATURE = 0.85
const TOP_K = 8

function lensForBeat(beat: StoryBeatKind, signalKind?: string): StoryLens {
  if (beat === 'protocol_feature_spot' && signalKind === 'delegation_surge') return 'security'
  if (beat === 'storage_slot_pulse') return 'detective'
  if (beat === 'tx_or_address_oddity') return 'lore'
  if (signalKind === 'delegation_surge' || signalKind === 'l2_blob_pressure') return 'security'
  if (signalKind === 'congestion_pressure' || signalKind === 'contract_surge') return 'economics'
  return 'detective'
}

function buildContractCandidates(brief: StoryBrief, limit: number): StoryBeatCandidate[] {
  const rows = [...brief.hotContracts].slice(0, limit)
  return rows.map((row, i) => {
    const unknown = row.proxyKind !== undefined ? 1 : 0
    const score = Math.max(25, 90 - i * 6 + unknown * 8)
    return {
      beat: 'contract_deep_dive' as const,
      baseScore: score,
      subjectKey: `contract:${row.address}`,
      address: row.address,
      lead: row.knownName ?? `Active contract ${row.address.slice(0, 10)}…`,
      lens: lensForBeat('contract_deep_dive'),
    }
  })
}

function momentBeat(moment: StoryBriefMoment): StoryBeatKind {
  if (moment.kind === 'birth' || moment.kind === 'first_step') return 'newborn_contract'
  if (moment.kind === 'eip7702' || moment.kind === 'blob_anchor') return 'protocol_feature_spot'
  if (moment.kind === 'choreography' || moment.kind === 'revert') return 'call_pattern_mystery'
  return 'tx_or_address_oddity'
}

function buildMomentCandidates(brief: StoryBrief): StoryBeatCandidate[] {
  return brief.moments.slice(0, 6).map((m, i) => {
    const beat = momentBeat(m)
    return {
      beat,
      baseScore: Math.max(30, 75 - i * 5),
      subjectKey: `moment:${m.id}`,
      address: m.address,
      lead: m.headline,
      lens: lensForBeat(beat, m.kind),
    }
  })
}

function buildSignalCandidates(
  brief: StoryBrief,
  journal: InvestigationJournal,
): StoryBeatCandidate[] {
  return brief.signals.slice(0, 4).map((sig, i) => {
    const beat: StoryBeatKind =
      sig.kind === 'slot_trend'
        ? 'storage_slot_pulse'
        : sig.kind === 'delegation_surge'
          ? 'protocol_feature_spot'
          : sig.address !== undefined
            ? 'contract_deep_dive'
            : 'call_pattern_mystery'
    const prev = journal.snapshot(6).find((e) => e.subjectKey === `signal:${sig.id}`)
    let followUp = false
    if (prev !== undefined && prev.signalScore !== undefined) {
      followUp = sig.noveltyScore >= prev.signalScore + 20
    }
    return {
      beat,
      baseScore: sig.noveltyScore - i * 3,
      subjectKey: `signal:${sig.id}`,
      address: sig.address,
      lead: sig.headline,
      lens: lensForBeat(beat, sig.kind),
      followUp,
    }
  })
}

function addressRepeatPenalty(
  journal: InvestigationJournal,
  subjectKey: string,
  address: string | undefined,
  followUp?: boolean,
): number {
  if (followUp === true) return 1
  const recent = journal.snapshot(5)
  for (const card of recent) {
    if (card.subjectKey === subjectKey) return 0.05
    if (
      address !== undefined &&
      card.relatedAddress !== undefined &&
      card.relatedAddress.toLowerCase() === address.toLowerCase()
    ) {
      return 0.05
    }
  }
  return 1
}

function beatRepeatPenalty(journal: InvestigationJournal, beat: StoryBeatKind): number {
  const last = journal.latest()
  if (last?.beatKind === beat) return 0.35
  return 1
}

function sampleWeighted(weights: number[], rng: () => number): { idx: number; roll: number } {
  const tempered = weights.map((w) => w ** (1 / BEAT_TEMPERATURE))
  const sum = tempered.reduce((a, b) => a + b, 0)
  const rawRoll = rng()
  if (sum <= 0) return { idx: 0, roll: rawRoll }
  let cursor = rawRoll * sum
  for (let i = 0; i < tempered.length; i++) {
    cursor -= tempered[i]!
    if (cursor <= 0) return { idx: i, roll: rawRoll }
  }
  return { idx: tempered.length - 1, roll: rawRoll }
}

export type PickStoryBeatOpts = {
  rng?: () => number
  lens?: StoryLens
  beat?: StoryBeatKind
  dossierNoveltyBoost?: (address: string) => number
}

export function pickStoryBeat(
  brief: StoryBrief,
  journal: InvestigationJournal,
  opts?: PickStoryBeatOpts,
): StoryBeatPick {
  const rng = opts?.rng ?? Math.random
  let pool: StoryBeatCandidate[] = [
    ...buildSignalCandidates(brief, journal),
    ...buildMomentCandidates(brief),
    ...buildContractCandidates(brief, 12),
  ]
  if (pool.length === 0) {
    pool.push({
      beat: 'tx_or_address_oddity',
      baseScore: 20,
      subjectKey: `head:${brief.head.blockNumber ?? '0'}`,
      lead: `Block ${brief.head.blockNumber ?? '?'} — still watching the window`,
      lens: 'economics',
    })
  }
  if (opts?.beat !== undefined) {
    pool = pool.filter((c) => c.beat === opts.beat)
    if (pool.length === 0) {
      pool = [
        {
          beat: opts.beat,
          baseScore: 50,
          subjectKey: `beat:${opts.beat}`,
          lead: `Fresh ${opts.beat.replace(/_/g, ' ')} angle`,
          lens: opts.lens ?? 'detective',
        },
      ]
    }
  }
  // Deduplicate by subjectKey (keeping highest baseScore) before weighting.
  const deduped = new Map<string, StoryBeatCandidate>()
  for (const c of pool) {
    const prev = deduped.get(c.subjectKey)
    if (prev === undefined || c.baseScore > prev.baseScore) {
      deduped.set(c.subjectKey, c)
    }
  }
  const scored = [...deduped.values()].map((c) => {
    let w =
      c.baseScore *
      addressRepeatPenalty(journal, c.subjectKey, c.address, c.followUp) *
      beatRepeatPenalty(journal, c.beat)
    if (c.address !== undefined && opts?.dossierNoveltyBoost !== undefined) {
      w *= opts.dossierNoveltyBoost(c.address)
    }
    const effective = w < 0.5 && c.followUp !== true ? 0 : w
    return { candidate: c, weight: effective }
  })
  scored.sort((a, b) => b.weight - a.weight || b.candidate.baseScore - a.candidate.baseScore)
  const top = scored.slice(0, TOP_K)
  const viable = top.filter((x) => x.weight > 0)
  const pickPool = viable.length > 0 ? viable : top
  const pickWeights = pickPool.map((x) => Math.max(x.weight, 0.01))
  const { idx, roll } = sampleWeighted(pickWeights, rng)
  const chosen = pickPool[idx]!.candidate
  const lens = opts?.lens ?? chosen.lens
  const candidateTable = pickPool.map((x, i) => ({
    beat: x.candidate.beat,
    subjectKey: x.candidate.subjectKey,
    weight: Math.round(pickWeights[i]! * 10) / 10,
  }))
  return {
    ...chosen,
    lens,
    effectiveWeight: pickWeights[idx]!,
    roll,
    candidates: candidateTable,
  }
}
