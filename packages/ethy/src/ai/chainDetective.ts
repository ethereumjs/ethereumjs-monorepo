import type { ChainConfig } from '@ethereumjs/common'
import type { FlatStateManager } from '@ethereumjs/statemanager'

import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import type { SignalCandidate } from '../economy/types.ts'
import type { EthySandbox } from '../evm/sandbox.ts'
import { deriveCapabilities } from '../spine/createSpine.ts'
import type { AiOverviewSections, ChainDispatchCard, EthySpine } from '../spine/types.ts'
import { selectLoreCards } from './ethereumLore.ts'
import type { LlmTransport } from './fixtureEngine.ts'
import { InvestigationJournal, UserInterestRing } from './investigationJournal.ts'
import {
  INVESTIGATION_TOOL_NAMES,
  type InvestigationContext,
  type InvestigationToolName,
  runInvestigationToolAsync,
} from './investigationTools.ts'
import { parseLlmJSONObject } from './llmClient.ts'
import { type ModelTier, inferModelTier, maxLoreCards } from './modelTier.ts'
import { parseStoryOutput } from './parseStoryOutput.ts'
import { briefForPrompt, buildStoryBrief } from './storyBrief.ts'
import {
  type StoryLens,
  directStory,
  headlineSnippet,
  parseLensOverride,
  recentLoreIds,
} from './storyDirector.ts'
import { buildDeterministicFieldNote } from './storyFallback.ts'
import { buildScoutSystem, buildStorytellerSystem, cardFromProse } from './storyNarrator.ts'

export const DETECTIVE_INTERVAL_MS = 75_000
export const STORY_DWELL_MS = 45_000

export type DetectiveTriage =
  | {
      mode: 'investigate'
      calls: Array<{ tool: InvestigationToolName; args: Record<string, unknown> }>
    }
  | { mode: 'tell_story'; focus: string }
  | { mode: 'dispatch'; card: ChainDispatchCard }

export function noveltyShouldSkip(opts: {
  blocksSinceLast: number
  topScore: number
  msSinceLast: number
  userFocusBump: boolean
}): boolean {
  if (opts.blocksSinceLast < 3) return true
  if (opts.topScore < 35 && opts.msSinceLast < 180_000 && !opts.userFocusBump) {
    return true
  }
  return false
}

export function signalToDispatchCard(signal: SignalCandidate, atMs: number): ChainDispatchCard {
  const category =
    signal.kind === 'delegation_surge'
      ? '7702'
      : signal.kind === 'l2_blob_pressure'
        ? 'l2'
        : signal.kind === 'congestion_pressure'
          ? 'fee'
          : 'watch'
  return {
    category,
    severity: signal.severity,
    headline: signal.headline.slice(0, 72),
    body: `${signal.headline} — live ranked anomaly in the rolling window.`,
    relatedAddress: signal.address,
    suggestedAction: signal.address !== undefined ? `/contract ${signal.address}` : '/signals',
    blockNumber:
      typeof signal.metrics.block === 'number' ? String(signal.metrics.block) : undefined,
    atMs,
    deterministic: true,
    subjectKey: `signal:${signal.id}`,
    signalScore: signal.noveltyScore,
  }
}

export function parseDetectiveTriage(obj: Record<string, unknown>): DetectiveTriage | undefined {
  const mode = obj.mode
  if (mode === 'investigate' && Array.isArray(obj.calls)) {
    const calls = obj.calls
      .slice(0, 2)
      .map((c) => {
        if (c === null || typeof c !== 'object') return undefined
        const row = c as Record<string, unknown>
        const tool = String(row.tool ?? '')
        if (!INVESTIGATION_TOOL_NAMES.includes(tool as InvestigationToolName)) return undefined
        return {
          tool: tool as InvestigationToolName,
          args: (row.args as Record<string, unknown>) ?? {},
        }
      })
      .filter(
        (x): x is { tool: InvestigationToolName; args: Record<string, unknown> } => x !== undefined,
      )
    if (calls.length === 0) return undefined
    return { mode: 'investigate', calls }
  }
  if (mode === 'tell_story' && typeof obj.focus === 'string') {
    return { mode: 'tell_story', focus: obj.focus.trim() }
  }
  if (mode === 'dispatch') {
    const card = dispatchCardFromRecord(obj)
    return card !== undefined ? { mode: 'dispatch', card } : undefined
  }
  return undefined
}

function dispatchCardFromRecord(obj: Record<string, unknown>): ChainDispatchCard | undefined {
  const headline = typeof obj.headline === 'string' ? obj.headline.trim().slice(0, 84) : ''
  const body = typeof obj.body === 'string' ? obj.body.trim() : ''
  if (headline.length === 0 || body.length === 0) return undefined
  return {
    category: typeof obj.category === 'string' ? obj.category : 'watch',
    severity: typeof obj.severity === 'string' ? obj.severity : 'notable',
    headline,
    body: body.slice(0, 2000),
    relatedAddress: typeof obj.relatedAddress === 'string' ? obj.relatedAddress : undefined,
    suggestedAction: typeof obj.suggestedAction === 'string' ? obj.suggestedAction : undefined,
    atMs: Date.now(),
    deterministic: false,
  }
}

export type ChainDetectiveNarratorOpts = {
  transport: LlmTransport
  economy: ETHEconomyDataManager
  stateManager: FlatStateManager
  chain: ChainConfig
  sandbox?: EthySandbox
  journal: InvestigationJournal
  userInterest: UserInterestRing
  onOverview: (sections: AiOverviewSections) => void
  onUnhealthy?: () => void
}

export class ChainDetectiveNarrator {
  private readonly transport: LlmTransport
  private readonly ctx: InvestigationContext
  private readonly journal: InvestigationJournal
  private readonly userInterest: UserInterestRing
  private readonly onOverview: (sections: AiOverviewSections) => void
  private readonly onUnhealthy?: () => void
  private timer?: ReturnType<typeof setInterval>
  private abort?: AbortController
  private inFlight = false
  private inFlightPromise?: Promise<void>
  private consecutiveFailures = 0
  private lastDispatchMs = 0
  private lastDispatchBlock = 0n
  private userFocusBump = false
  private lensOverride?: StoryLens
  private pendingManual = false
  spineRef?: EthySpine

  constructor(opts: ChainDetectiveNarratorOpts) {
    this.transport = opts.transport
    this.ctx = {
      economy: opts.economy,
      stateManager: opts.stateManager,
      chain: opts.chain,
      sandbox: opts.sandbox,
      spine: { aiMode: 'local' } as EthySpine,
    }
    this.journal = opts.journal
    this.userInterest = opts.userInterest
    this.onOverview = opts.onOverview
    this.onUnhealthy = opts.onUnhealthy
  }

  noteUserPrompt(text: string): void {
    this.userInterest.notePrompt(text)
    this.userFocusBump = true
  }

  start(spine: EthySpine): void {
    this.spineRef = spine
    this.ctx.spine = spine
    void this.runCycle('welcome')
    this.timer = setInterval(() => {
      if (this.spineRef !== undefined) void this.runCycle('pulse')
    }, DETECTIVE_INTERVAL_MS)
    this.timer.unref?.()
  }

  stop(): void {
    if (this.timer !== undefined) {
      clearInterval(this.timer)
      this.timer = undefined
    }
    this.abort?.abort()
    this.abort = undefined
  }

  abortInFlight(): void {
    this.abort?.abort()
  }

  async triggerNow(lensOverride?: StoryLens): Promise<void> {
    this.abortInFlight()
    if (this.inFlightPromise !== undefined) {
      await this.inFlightPromise.catch(() => {})
    }
    this.lensOverride = lensOverride
    this.pendingManual = true
    try {
      if (this.spineRef !== undefined) {
        await this.runCycle('manual')
      }
    } finally {
      this.pendingManual = false
      this.lensOverride = undefined
    }
  }

  private setLlmPulseReady(spine: EthySpine, ready: boolean): void {
    spine.llmPulseReady = ready
    deriveCapabilities(spine)
  }

  private publishBootstrap(spine: EthySpine): void {
    this.onOverview({
      bootstrapNote: 'Syncing live blocks — field stories start once economy data arrives.',
    })
  }

  noteBlocksReady(spine: EthySpine): void {
    this.spineRef = spine
    this.ctx.spine = spine
    if (this.lastDispatchBlock === 0n && spine.economy?.hasBlocks === true) {
      void this.runCycle('welcome')
    }
  }

  private publishStory(card: ChainDispatchCard): void {
    const count = this.journal.snapshot(6).length
    this.onOverview({
      dispatches: [card],
      storyIndex: 1,
      storyCount: Math.max(1, count),
    })
  }

  private activeModelLabel(spine?: EthySpine): string | undefined {
    return this.transport.modelName ?? spine?.managedAi?.label
  }

  private modelTier(spine: EthySpine): ModelTier {
    return inferModelTier(this.activeModelLabel(spine))
  }

  private async runStorytellerTurn(
    brief: ReturnType<typeof buildStoryBrief>,
    lead: ReturnType<typeof directStory>,
    toolResults: Array<{ tool: string; result: string }>,
    tier: ModelTier,
    startedMs: number,
  ): Promise<ChainDispatchCard | undefined> {
    if (brief === undefined) return undefined
    const loreCards = selectLoreCards(
      brief,
      lead.lens,
      recentLoreIds(this.journal),
      maxLoreCards(tier),
    )
    const system = buildStorytellerSystem(lead.lens, loreCards, tier)
    const userPayload = {
      brief: briefForPrompt(brief),
      lead,
      toolResults,
      focus: lead.lead,
    }
    const raw = await this.transport.complete(
      {
        kind: 'story',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: JSON.stringify(userPayload) },
        ],
        overrides: { modelTier: tier, responseMode: 'text' },
      },
      this.abort?.signal,
    )
    const parsed = parseStoryOutput(raw)
    if (parsed === undefined) return undefined
    return cardFromProse({
      parsed,
      brief,
      lead,
      loreCardId: loreCards[0]?.id,
      toolsUsed: toolResults.map((t) => t.tool),
      modelLabel: this.activeModelLabel(this.spineRef),
      latencyMs: Date.now() - startedMs,
      atMs: Date.now(),
    })
  }

  private publishFallback(
    brief: NonNullable<ReturnType<typeof buildStoryBrief>>,
    lens: StoryLens,
  ): void {
    const lore = selectLoreCards(brief, lens, recentLoreIds(this.journal), 1)[0]
    if (lore === undefined) return
    const card = buildDeterministicFieldNote(brief, lens, lore, Date.now())
    this.journal.push(card)
    this.publishStory(card)
  }

  private async runCycle(trigger: 'welcome' | 'pulse' | 'manual'): Promise<void> {
    const spine = this.spineRef
    if (spine === undefined || this.inFlight) return
    this.ctx.spine = spine
    const snap = spine.economy
    if (snap?.hasBlocks !== true) {
      if (trigger === 'welcome') this.publishBootstrap(spine)
      return
    }

    const brief = buildStoryBrief(spine, this.economy, this.modelTier(spine))
    if (brief === undefined) return

    const head = snap.latestBlockNumber !== undefined ? BigInt(snap.latestBlockNumber) : 0n
    const blocksSince = this.lastDispatchBlock > 0n ? Number(head - this.lastDispatchBlock) : 99
    const topScore = brief.signals[0]?.noveltyScore ?? 0
    const msSince = Date.now() - this.lastDispatchMs

    if (trigger === 'pulse' && msSince < STORY_DWELL_MS && this.journal.latest() !== undefined) {
      this.publishStory(this.journal.latest()!)
      return
    }

    if (
      trigger === 'pulse' &&
      !this.pendingManual &&
      noveltyShouldSkip({
        blocksSinceLast: blocksSince,
        topScore,
        msSinceLast: msSince,
        userFocusBump: this.userFocusBump,
      })
    ) {
      const latest = this.journal.latest()
      if (latest !== undefined) this.publishStory(latest)
      return
    }

    this.inFlight = true
    this.abort?.abort()
    const controller = new AbortController()
    this.abort = controller
    this.userFocusBump = false
    const tier = this.modelTier(spine)
    const lead = directStory(brief, this.journal, this.lensOverride)
    const journalHeadlines = this.journal.snapshot(5).map(headlineSnippet)
    const startedMs = Date.now()

    let work: Promise<void> | undefined
    work = (async () => {
      try {
        const raw1 = await this.transport.complete(
          {
            kind: 'pulse',
            messages: [
              { role: 'system', content: buildScoutSystem(INVESTIGATION_TOOL_NAMES.join(', ')) },
              {
                role: 'user',
                content: JSON.stringify({
                  brief: briefForPrompt(brief),
                  lead,
                  journalHeadlines,
                  trigger,
                }),
              },
            ],
            overrides: { responseMode: 'json', modelTier: tier },
          },
          controller.signal,
        )
        const triage = parseDetectiveTriage(parseLlmJSONObject(raw1))
        let card: ChainDispatchCard | undefined
        const toolResults: Array<{ tool: string; result: string }> = []

        if (triage?.mode === 'dispatch') {
          card = triage.card
          card.blockNumber = snap.latestBlockNumber
          card.lens = lead.lens
          card.network = brief.network
          card.subjectKey = lead.subjectKey
        } else if (triage?.mode === 'investigate') {
          for (const call of triage.calls) {
            toolResults.push({
              tool: call.tool,
              result: await runInvestigationToolAsync(call.tool, call.args, this.ctx),
            })
          }
          card = await this.runStorytellerTurn(brief, lead, toolResults, tier, startedMs)
        } else if (triage?.mode === 'tell_story' || triage === undefined) {
          card = await this.runStorytellerTurn(brief, lead, toolResults, tier, startedMs)
        }

        if (card !== undefined) {
          card.blockNumber = card.blockNumber ?? snap.latestBlockNumber
          this.journal.push(card)
          this.lastDispatchMs = Date.now()
          this.lastDispatchBlock = head
          this.publishStory(card)
          this.consecutiveFailures = 0
          this.setLlmPulseReady(spine, true)
          return
        }
        throw new Error('empty_story')
      } catch {
        // Intentional aborts (user prompt or manual /story new) are not model failures.
        if (controller.signal.aborted) return
        this.consecutiveFailures += 1
        const latest = this.journal.latest()
        if (latest !== undefined && latest.deterministic !== true) {
          this.publishStory(latest)
        } else {
          this.publishFallback(brief, lead.lens)
        }
        if (this.consecutiveFailures >= 2) {
          this.setLlmPulseReady(spine, false)
          this.onUnhealthy?.()
        }
      } finally {
        this.inFlight = false
        if (this.inFlightPromise === work) {
          this.inFlightPromise = undefined
        }
      }
    })()
    this.inFlightPromise = work
    await work
  }

  private get economy(): ETHEconomyDataManager {
    return this.ctx.economy
  }
}
