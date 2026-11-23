import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import type { ChainDispatchCard, DebugSectionSpec, EthySpine } from '../spine/types.ts'
import { selectLoreCards } from './ethereumLore.ts'
import type { EthereumLoreCard } from './ethereumLore.ts'
import type { LlmTransport } from './fixtureEngine.ts'
import type { InvestigationJournal } from './investigationJournal.ts'
import { inferModelTier, maxLoreCards } from './modelTier.ts'
import type { ParsedStory } from './parseStoryOutput.ts'
import { parseStoryOutput } from './parseStoryOutput.ts'
import type { StoryBrief } from './storyBrief.ts'
import { buildStoryBrief } from './storyBrief.ts'
import type { StoryLead, StoryLens } from './storyDirector.ts'
import { directStory, parseLensOverride, recentLoreIds } from './storyDirector.ts'

const HONEST_RULES = `Honest Speculation Contract:
1) Cite only addresses, blocks, fees, and selectors from the brief or tool JSON — unknown contracts stay unnamed.
2) Frame motives and attacks as hypotheses ("One plausible reading…", "Could this be…").
3) On Sepolia, call it testnet rehearsal — not real money.
4) Historical facts come only from the supplied lore cards — do not invent EIP dates.`

const LENS_VOICE: Record<StoryLens, string> = {
  detective: 'Follow the strangest live clue; peel bytecode, storage, and sender patterns.',
  security: 'White-hat threat model: what could go wrong if this pattern were malicious?',
  economics: 'Connect fees, blobs, ETH flows, and gas pressure to user and protocol behavior.',
  lore: 'Anchor a live artifact to Ethereum history — concrete, curious, not generic.',
}

export function buildStorytellerSystem(
  lens: StoryLens,
  loreCards: readonly EthereumLoreCard[],
  tier: 'compact' | 'rich',
): string {
  const loreBlock = loreCards
    .map(
      (c) =>
        `[${c.id}] ${c.title}\nMechanism: ${c.protocolMechanism}\nEcho: ${c.historicalEcho}\nEdge: ${c.attackOrEdgeScenario}`,
    )
    .join('\n\n')
  const lengthHint = tier === 'rich' ? '2-4 crisp paragraphs' : '2 vivid paragraphs'
  return `You are Ethy's Field Historian on Ethereum execution data — curious, never a syslog bot.
${HONEST_RULES}

Lens: ${lens} — ${LENS_VOICE[lens]}

Lore cards (only historical source):
${loreBlock}

Write sectioned prose (${lengthHint}):
HEADLINE: <=84 chars, plain language
STORY: what is happening on-chain now
ANGLE: history echo OR security what-if OR provocative question
CURIOSITY: one natural question the user might ask
COMMAND: optional one slash command like /contract 0x... or /signals`
}

export function buildScoutSystem(toolList: string): string {
  return `You are Ethy's scout — triage only, no prose stories, no slash manual.
JSON only. Either:
{ "mode": "investigate", "calls": [{ "tool": "<name>", "args": {} }] } (1-2 tools)
OR { "mode": "tell_story", "focus": "<one sentence>" }
Legacy dispatch JSON is also accepted.
Tools: ${toolList}`
}

export type CardFromProseOpts = {
  parsed: ParsedStory
  brief: StoryBrief
  lead: StoryLead
  loreCardId?: string
  toolsUsed?: string[]
  modelLabel?: string
  latencyMs?: number
  atMs: number
}

export type SynthesizeStoryOpts = {
  transport: LlmTransport
  spine: EthySpine
  economy: ETHEconomyDataManager
  journal: InvestigationJournal
  toolResults: Array<{ tool: string; result: string }>
  lensHint?: string
  userQuestion: string
}

export async function synthesizeInteractiveStory(
  opts: SynthesizeStoryOpts,
): Promise<{ story: ChainDispatchCard; debugPage: DebugSectionSpec[] } | undefined> {
  const tier = inferModelTier(opts.spine.managedAi?.label)
  const brief = buildStoryBrief(opts.spine, opts.economy, tier)
  if (brief === undefined) return undefined
  const lens =
    parseLensOverride(opts.lensHint) ??
    opts.journal.latest()?.lens ??
    directStory(brief, opts.journal).lens
  const lead = directStory(brief, opts.journal, lens)
  const loreCards = selectLoreCards(
    brief,
    lead.lens,
    recentLoreIds(opts.journal),
    maxLoreCards(tier),
  )
  const system = buildStorytellerSystem(lead.lens, loreCards, tier)
  const started = Date.now()
  const raw = await opts.transport.complete({
    kind: 'story',
    messages: [
      { role: 'system', content: system },
      {
        role: 'user',
        content: JSON.stringify({
          brief,
          lead,
          toolResults: opts.toolResults,
          question: opts.userQuestion,
          priorStory: opts.journal.latest(),
        }),
      },
    ],
    overrides: { modelTier: tier, responseMode: 'text' },
  })
  const parsed = parseStoryOutput(raw)
  if (parsed === undefined) return undefined
  const card = cardFromProse({
    parsed,
    brief,
    lead,
    loreCardId: loreCards[0]?.id,
    toolsUsed: opts.toolResults.map((t) => t.tool),
    modelLabel: opts.spine.managedAi?.label,
    latencyMs: Date.now() - started,
    atMs: Date.now(),
  })
  const debugPage: DebugSectionSpec[] = [
    {
      title: 'Story synthesis',
      entries: [
        { key: 'loreCardId', value: loreCards[0]?.id ?? '—' },
        { key: 'model', value: opts.spine.managedAi?.label ?? 'compact' },
        { key: 'latencyMs', value: String(Date.now() - started) },
        ...opts.toolResults.map((t) => ({
          key: t.tool,
          value: t.result.slice(0, 240),
        })),
      ],
    },
  ]
  return { story: card, debugPage }
}

export function angleKindFromLens(lens: StoryLens): ChainDispatchCard['angleKind'] {
  if (lens === 'lore') return 'history'
  if (lens === 'security') return 'security'
  return 'question'
}

export function buildEvidence(brief: StoryBrief, lead: StoryLead): ChainDispatchCard['evidence'] {
  const rows: Array<{ label: string; value: string }> = []
  if (brief.head.blockNumber !== undefined) {
    rows.push({ label: 'Block', value: `#${brief.head.blockNumber}` })
  }
  if (brief.head.baseFeeGwei !== undefined) {
    rows.push({ label: 'Base fee', value: `${brief.head.baseFeeGwei} Gwei` })
  }
  if (lead.relatedAddress !== undefined) {
    rows.push({ label: 'Address', value: lead.relatedAddress })
  }
  const sig = brief.signals[0]
  if (sig?.address !== undefined) {
    rows.push({ label: 'Signal', value: sig.headline.slice(0, 48) })
  }
  return rows.length > 0 ? rows : undefined
}

export function cardFromProse(opts: CardFromProseOpts): ChainDispatchCard {
  const { parsed, brief, lead, loreCardId, toolsUsed, modelLabel, latencyMs, atMs } = opts
  const severity = brief.signals[0]?.severity ?? (lead.quiet ? 'calm' : 'notable')
  return {
    category: lead.lens,
    severity,
    headline: parsed.headline.slice(0, 84),
    body: parsed.story,
    relatedAddress: lead.relatedAddress,
    suggestedAction:
      parsed.command && parsed.command.startsWith('/')
        ? parsed.command
        : lead.relatedAddress !== undefined
          ? `/contract ${lead.relatedAddress}`
          : '/story',
    blockNumber: brief.head.blockNumber,
    atMs,
    deterministic: false,
    lens: lead.lens,
    network: brief.network,
    angle: parsed.angle,
    angleKind: parsed.angle !== undefined ? angleKindFromLens(lead.lens) : undefined,
    curiosityQuestion: parsed.curiosityQuestion,
    loreCardId,
    modelLabel,
    latencyMs,
    toolsUsed,
    subjectKey: lead.subjectKey,
    signalScore: brief.signals[0]?.noveltyScore,
    evidence: buildEvidence(brief, lead),
  }
}
