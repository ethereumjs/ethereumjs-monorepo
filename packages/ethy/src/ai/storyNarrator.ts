import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import type { ChainDispatchCard, DebugSectionSpec, EthySpine } from '../spine/types.ts'
import { selectLoreCards } from './ethereumLore.ts'
import type { EthereumLoreCard } from './ethereumLore.ts'
import type { LlmTransport } from './fixtureEngine.ts'
import type { InvestigationJournal } from './investigationJournal.ts'
import { inferModelTier, maxLoreCards } from './modelTier.ts'
import type { ParsedStory } from './parseStoryOutput.ts'
import { parseStoryOutput } from './parseStoryOutput.ts'
import type { StoryFormat } from './storyBeats.ts'
import type { StoryBrief } from './storyBrief.ts'
import { buildStoryBrief } from './storyBrief.ts'
import type { StoryLead, StoryLens } from './storyDirector.ts'
import { directStory, parseLensOverride, recentLoreIds } from './storyDirector.ts'

const HONEST_RULES = `Ground rules:
1) Write like a warm, sharp Ethereum observer — never robotic or technocratic. Avoid dry log phrasing like "initiated a transaction" or "triggered 34 inbound calls".
2) NEVER say "the dossier", "the JSON", "the input", "the data shows", or mention scores, weights, or probabilities.
3) Stick strictly to the numbers, units, addresses, ENS names, and labels in the facts below — never invent addresses, users, counts, or amounts, never convert token amounts (like USDC) into ETH, never call a token contract a user wallet, and never call a 4-byte method selector a contract address.
4) Lead with concrete on-chain facts (who, what contract/token/amount, what actually happened). NEVER claim phishing, scams, or exploits unless direct on-chain evidence is present in the facts. On Sepolia, remember it is test ETH/tokens, not real money.
5) Plain text only (no ** bold, no backticks, no [END OF REPORT]). Never put a full 42-character 0x address in the headline — use the contract/ENS name or short form like 0x1234…abcd.`

const LENS_VOICE: Record<StoryLens, string> = {
  detective: 'Tell the concrete human story behind the calls, wallets, or contract behavior.',
  security: 'Calm white-hat eye: what is realistic to double-check without crying wolf?',
  economics: 'Connect real token/ETH flows and fees to what people or apps are doing.',
  lore: 'Spot the human and cultural side of Ethereum blocks — curious, never stiff.',
}

const VALID_SLASH_CMDS = new Set([
  '/contract',
  '/account',
  '/bal',
  '/signals',
  '/story',
  '/peers',
  '/blobs',
  '/block',
])

export function buildStorytellerSystem(
  lens: StoryLens,
  loreCards: readonly EthereumLoreCard[],
  tier: 'compact' | 'rich',
  format: StoryFormat = 'field_note',
): string {
  if (format === 'snap') {
    return `You are Ethy, a witty, sharp-eyed observer watching live Ethereum blocks roll by.
${HONEST_RULES}

Tone: Light, playful, human, observant — a quick street-level note about a quirky on-chain find (a calldata message, validator graffiti, a veteran wallet milestone, or a brand-new wallet). Dry humor is welcome when the artifact invites it; stay factual and brief.

Write a short snap (2-3 crisp sentences total) using BOTH exact labels below:
HEADLINE: <=64 chars, punchy plain text
STORY: 2-3 lively sentences directly about what just happened on-chain`
  }

  const loreSection =
    loreCards.length > 0
      ? `\nBackground context (optional protocol context — NEVER treat as an accusation about this block):\n${loreCards
          .map(
            (c) =>
              `[${c.id}] ${c.title}\nMechanism: ${c.protocolMechanism}\nContext: ${c.historicalEcho}`,
          )
          .join('\n\n')}\n`
      : ''
  const lengthHint =
    tier === 'rich' ? '1-2 concise paragraphs (60-90 words)' : '1 tight paragraph (45-65 words)'
  return `You are Ethy's Field Historian watching live Ethereum execution — curious, clear, never a syslog bot.
${HONEST_RULES}

Lens: ${lens} — ${LENS_VOICE[lens]}
${loreSection}
Write compact plain-text prose that fits cleanly in a terminal box (${lengthHint}) using the exact labels below:
HEADLINE: <=64 chars, punchy plain text, no full 42-char hex addresses
STORY: 3-4 crisp sentences directly explaining the concrete facts happening on-chain right now
HYPOTHESIS: 1-2 short, calm plain-English sentences on why this matters or what it likely is`
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
  const activeModel = opts.transport.modelName ?? opts.spine.managedAi?.label
  const tier = inferModelTier(activeModel)
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
    lead,
  )
  const system = buildStorytellerSystem(lead.lens, loreCards, tier, lead.format)
  const { diceRoll: _roll, beatCandidates: _candidates, ...cleanLead } = lead
  const started = Date.now()
  const raw = await opts.transport.complete({
    kind: 'story',
    messages: [
      { role: 'system', content: system },
      {
        role: 'user',
        content: JSON.stringify(
          {
            brief,
            lead: cleanLead,
            toolResults: opts.toolResults,
            question: opts.userQuestion,
            priorStory: opts.journal.latest(),
          },
          (_k, v) => (typeof v === 'bigint' ? v.toString() : v),
        ),
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
    modelLabel: activeModel,
    latencyMs: Date.now() - started,
    atMs: Date.now(),
  })
  const debugPage: DebugSectionSpec[] = [
    {
      title: 'Story synthesis',
      entries: [
        { key: 'loreCardId', value: loreCards[0]?.id ?? '—' },
        { key: 'model', value: activeModel ?? tier },
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

function pickSuggestedAction(parsedCommand: string | undefined, lead: StoryLead): string {
  if (parsedCommand !== undefined) {
    const trimmed = parsedCommand.trim()
    const head = trimmed.split(/\s+/)[0]?.toLowerCase() ?? ''
    if (VALID_SLASH_CMDS.has(head)) {
      return trimmed
    }
  }
  if (lead.relatedAddress !== undefined) {
    const isAccountMoment =
      lead.subjectKey.includes(':veteran:') ||
      lead.subjectKey.includes(':first_step:') ||
      lead.subjectKey.includes(':whale:') ||
      lead.subjectKey.includes(':graffiti_note:')
    return isAccountMoment ? `/account ${lead.relatedAddress}` : `/contract ${lead.relatedAddress}`
  }
  return '/story'
}

export function cardFromProse(opts: CardFromProseOpts): ChainDispatchCard {
  const { parsed, brief, lead, loreCardId, toolsUsed, modelLabel, latencyMs, atMs } = opts
  const severity = brief.signals[0]?.severity ?? (lead.quiet ? 'calm' : 'notable')
  const isSnap = lead.format === 'snap'
  const angle = isSnap ? undefined : parsed.angle
  return {
    category: lead.lens,
    severity,
    headline: parsed.headline.slice(0, 84),
    body: parsed.story,
    relatedAddress: lead.relatedAddress,
    suggestedAction: pickSuggestedAction(parsed.command, lead),
    blockNumber: brief.head.blockNumber,
    atMs,
    deterministic: false,
    lens: lead.lens,
    network: brief.network,
    angle,
    angleKind: angle !== undefined ? angleKindFromLens(lead.lens) : undefined,
    curiosityQuestion: parsed.curiosityQuestion,
    loreCardId,
    modelLabel,
    latencyMs,
    toolsUsed,
    subjectKey: lead.subjectKey,
    signalScore: brief.signals[0]?.noveltyScore,
    evidence: buildEvidence(brief, lead),
    beatKind: lead.beat,
    format: lead.format,
  }
}
