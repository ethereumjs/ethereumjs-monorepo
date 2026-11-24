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

export type StoryFormat = 'snap' | 'field_note'

export type StoryBeatCandidate = {
  beat: StoryBeatKind
  format: StoryFormat
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

// cspell:ignore erigon prysm teku grandine openethereum flashbots beaverbuild bloxroute jetbldr
const ROUTINE_CLIENT_GRAFFITI_RE =
  /^(?:geth|erigon|reth|besu|nethermind|nimbus|prysm|lighthouse|teku|lodestar|grandine|ethereumjs|parity|openethereum)(?:[\s/_-]|$)/i

const ROUTINE_BUILDER_GRAFFITI_RE =
  /(?:^|[\s/_-])(?:builder|flashbots|beaverbuild|titan|rsync|ultrasound|bloxroute|mev-boost|quasar|eden|manifold|jetbldr)(?:[\s/_-]|$|\d)/i

/**
 * True when a call/event preview is human-decoded (e.g. `transfer(to: ..., amount: ...)`)
 * rather than a raw undecoded 4-byte hex selector like `0xd36b4ff6`.
 */
export function isDecodedPreview(preview: string): boolean {
  const t = preview.trim()
  if (t.length === 0) return false
  return !/^0x[0-9a-f]{8}$/i.test(t)
}

/**
 * True when validator extraData looks like a human message or .eth identity rather than
 * a routine client version banner, generic block-builder server ID, or raw hex string.
 */
export function isInterestingProposerGraffiti(raw?: string): boolean {
  if (raw === undefined) return false
  const trimmed = raw.trim()
  if (trimmed.length < 3 || trimmed.length > 64) return false
  if (ROUTINE_CLIENT_GRAFFITI_RE.test(trimmed)) return false
  if (/^(?:0x)?[0-9a-f]{6,}$/i.test(trimmed)) return false
  if (!/[a-zA-Z]/.test(trimmed)) return false
  // Keep .eth identities (e.g. builder.alice.eth) and multi-word human messages
  if (trimmed.toLowerCase().includes('.eth') || /\s/.test(trimmed)) return true
  if (ROUTINE_BUILDER_GRAFFITI_RE.test(trimmed)) return false
  return true
}

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
    const hasKnownName = row.knownName !== undefined
    const hasProxy = row.proxyKind !== undefined
    const hasDecodedCalls = (row.callPreviews ?? []).some(isDecodedPreview)
    const hasDecodedEvents = (row.eventPreviews ?? []).some(isDecodedPreview)
    const hasArchetype = row.archetype !== undefined && row.archetype !== 'Contract'
    const richness =
      (hasKnownName ? 16 : 0) +
      (hasProxy ? 10 : 0) +
      (hasDecodedCalls ? 12 : 0) +
      (hasDecodedEvents ? 8 : 0) +
      (hasArchetype ? 8 : 0)
    // Rich contracts lead the deep-dive lane; bare anonymous contracts (even with raw 4-byte
    // selectors like 0xd36b4ff6) stay low so decoded protocols, notes, and moments win naturally.
    const score =
      richness > 0 ? Math.min(95, Math.max(50, 72 - i * 4 + richness)) : Math.max(18, 28 - i * 2)
    return {
      beat: 'contract_deep_dive' as const,
      format: 'field_note' as const,
      baseScore: score,
      subjectKey: `contract:${row.address}`,
      address: row.address,
      lead: row.knownName ?? `Active contract ${row.address.slice(0, 10)}…`,
      lens: lensForBeat('contract_deep_dive'),
    }
  })
}

function momentBeat(moment: StoryBriefMoment): StoryBeatKind {
  if (moment.kind === 'birth') return 'newborn_contract'
  if (moment.kind === 'eip7702' || moment.kind === 'blob_anchor') return 'protocol_feature_spot'
  if (moment.kind === 'choreography' || moment.kind === 'revert') return 'call_pattern_mystery'
  return 'tx_or_address_oddity'
}

function momentFormat(moment: StoryBriefMoment): StoryFormat {
  if (
    moment.kind === 'graffiti_note' ||
    moment.kind === 'veteran' ||
    moment.kind === 'first_step' ||
    moment.kind === 'heartbeat'
  ) {
    return 'snap'
  }
  return 'field_note'
}

function momentBaseScore(moment: StoryBriefMoment, idx: number): number {
  const decay = idx * 4
  switch (moment.kind) {
    case 'graffiti_note': {
      // Distinguish conversational human notes from pipe-delimited machine hash attestations
      const pipeCount = (moment.headline.match(/\|/g) ?? []).length
      const isMachineStamp = pipeCount >= 2 || /\bSHA:[0-9a-f]{8,}/i.test(moment.headline)
      return isMachineStamp ? Math.max(46, 62 - decay) : Math.max(72, 96 - decay)
    }
    case 'eip7702':
    case 'blob_anchor':
      return Math.max(55, 84 - decay)
    case 'choreography':
      // Multi-account calls with a decoded function name or venue badge are rich; generic call() paths stay modest
      return moment.headline.includes('· call() path')
        ? Math.max(34, 48 - decay)
        : Math.max(52, 82 - decay)
    case 'whale':
    case 'revert':
      return Math.max(50, 80 - decay)
    case 'veteran':
    case 'first_step':
      return Math.max(48, 74 - decay)
    case 'birth': {
      // Bare tiny unnamed deployments (0.0–0.4 KB, no [Archetype] badge) are usually noise;
      // demote them so rich deployments, notes, and active protocols take priority.
      const hasArchetypeBadge = /\[[^\]]+\]/.test(moment.headline)
      const kbMatch = /New\s+(\d+(?:\.\d+)?)\s*KB/i.exec(moment.headline)
      const kb = kbMatch !== null ? Number.parseFloat(kbMatch[1]!) : 0
      if (hasArchetypeBadge || kb >= 1.5) {
        return Math.max(45, 68 - decay)
      }
      return Math.max(16, 22 - idx * 2)
    }
    default:
      return Math.max(15, 20 - idx * 2)
  }
}

function buildMomentCandidates(brief: StoryBrief): StoryBeatCandidate[] {
  return brief.moments.slice(0, 6).map((m, i) => {
    const beat = momentBeat(m)
    return {
      beat,
      format: momentFormat(m),
      baseScore: momentBaseScore(m, i),
      subjectKey: `moment:${m.id}`,
      address: m.address,
      lead: m.headline,
      lens: lensForBeat(beat, m.kind),
    }
  })
}

function buildProposerGraffitiCandidate(brief: StoryBrief): StoryBeatCandidate[] {
  const msg = brief.head.proposerGraffiti?.trim()
  if (!isInterestingProposerGraffiti(msg) || msg === undefined) return []
  const blockLabel =
    brief.head.blockNumber !== undefined ? `#${brief.head.blockNumber}` : 'the head block'
  return [
    {
      beat: 'tx_or_address_oddity',
      format: 'snap',
      baseScore: 88,
      subjectKey: `proposer_graffiti:${msg.toLowerCase()}`,
      lead: `Validator stamped block ${blockLabel} with graffiti: "${msg}"`,
      lens: 'lore',
    },
  ]
}

function buildSignalCandidates(
  brief: StoryBrief,
  journal: InvestigationJournal,
): StoryBeatCandidate[] {
  const hotByAddr = new Map(brief.hotContracts.map((h) => [h.address.toLowerCase(), h]))
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
    let baseScore = sig.noveltyScore - i * 3
    // Demote slot_trend on completely anonymous contracts with no decoded calls so named
    // protocols (e.g. USDC, WETH) and real moments win instead of raw hex storage jumps.
    if (sig.kind === 'slot_trend' && sig.address !== undefined) {
      const hot = hotByAddr.get(sig.address.toLowerCase())
      const hasContext =
        hot !== undefined &&
        (hot.knownName !== undefined ||
          (hot.callPreviews ?? []).some(isDecodedPreview) ||
          (hot.eventPreviews ?? []).some(isDecodedPreview))
      if (!hasContext) {
        baseScore = Math.min(baseScore, 34 - i * 2)
      }
    }
    return {
      beat,
      format: 'field_note' as const,
      baseScore,
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
    ...buildProposerGraffitiCandidate(brief),
    ...buildSignalCandidates(brief, journal),
    ...buildMomentCandidates(brief),
    ...buildContractCandidates(brief, 12),
  ]
  if (pool.length === 0) {
    pool.push({
      beat: 'tx_or_address_oddity',
      format: 'snap',
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
          format: opts.beat === 'tx_or_address_oddity' ? 'snap' : 'field_note',
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
    if (c.address !== undefined && c.baseScore >= 40 && opts?.dossierNoveltyBoost !== undefined) {
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
