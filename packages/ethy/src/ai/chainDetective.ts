import type { ChainConfig } from '@ethereumjs/common'
import type { FlatStateManager } from '@ethereumjs/statemanager'

import type { ContractDossierStore } from '../contracts/contractDossierStore.ts'
import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import type { SignalCandidate } from '../economy/types.ts'
import type { EthySandbox } from '../evm/sandbox.ts'
import { deriveCapabilities } from '../spine/createSpine.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import type { AiOverviewSections, ChainDispatchCard, EthySpine } from '../spine/types.ts'
import {
  type AiRunLog,
  type AiRunTraceRecord,
  capRawPreview,
  createAiRunLog,
} from './aiRunTrace.ts'
import { selectLoreCards } from './ethereumLore.ts'
import type { LlmTransport } from './fixtureEngine.ts'
import { type ForensicDossier, buildForensicDossier } from './forensicDossierBuilder.ts'
import { InvestigationJournal, UserInterestRing } from './investigationJournal.ts'
import {
  INVESTIGATION_TOOL_NAMES,
  type InvestigationContext,
  type InvestigationToolName,
  runInvestigationToolAsync,
} from './investigationTools.ts'
import { parseLlmJSONObject } from './llmClient.ts'
import { LlmWireError, llmErrorKindFromUnknown } from './llmWireError.ts'
import { type ModelTier, inferModelTier, maxLoreCards, maxStoryTokens } from './modelTier.ts'
import { parseStoryOutput } from './parseStoryOutput.ts'
import type { StoryBeatKind } from './storyBeats.ts'
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

function safeJSON(obj: unknown): string {
  return JSON.stringify(obj, (_key, val) => (typeof val === 'bigint' ? val.toString() : val))
}

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
  dataDir?: string
  network: string
  dossierStore?: ContractDossierStore
  aiRunLog?: AiRunLog
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
  private beatOverride?: StoryBeatKind
  private pendingManual = false
  spineRef?: EthySpine
  private readonly dataDir?: string
  private readonly dossierStore?: ContractDossierStore
  private readonly aiRunLog: AiRunLog

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
    this.dataDir = opts.dataDir
    this.dossierStore = opts.dossierStore
    this.aiRunLog = opts.aiRunLog ?? createAiRunLog(opts.dataDir, opts.network)
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

  async triggerNow(lensOverride?: StoryLens, beatOverride?: StoryBeatKind): Promise<void> {
    this.abortInFlight()
    if (this.inFlightPromise !== undefined) {
      await this.inFlightPromise.catch(() => {})
    }
    this.lensOverride = lensOverride
    this.beatOverride = beatOverride
    this.pendingManual = true
    try {
      if (this.spineRef !== undefined) {
        await this.runCycle('manual')
      }
    } finally {
      this.pendingManual = false
      this.lensOverride = undefined
      this.beatOverride = undefined
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
    dossier: ForensicDossier,
    toolResults: Array<{ tool: string; result: string }>,
    tier: ModelTier,
    startedMs: number,
    llmCalls: AiRunTraceRecord['llmCalls'],
  ): Promise<ChainDispatchCard | undefined> {
    if (brief === undefined) return undefined
    const loreCards = selectLoreCards(
      brief,
      lead.lens,
      recentLoreIds(this.journal),
      maxLoreCards(tier),
    )
    const system = buildStorytellerSystem(lead.lens, loreCards, tier)
    const userPayload =
      tier === 'compact'
        ? { dossier, lead, toolResults, loreId: loreCards[0]?.id }
        : {
            dossier,
            brief: briefForPrompt(brief),
            lead,
            toolResults,
            focus: lead.lead,
          }
    const userPayloadJSON = safeJSON(userPayload)
    const promptChars = userPayloadJSON.length + system.length
    const storyStart = Date.now()
    let raw = ''
    try {
      raw = await this.transport.complete(
        {
          kind: 'story',
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: userPayloadJSON },
          ],
          overrides: { modelTier: tier, responseMode: 'text' },
        },
        this.abort?.signal,
      )
    } catch (e: unknown) {
      const kind = llmErrorKindFromUnknown(e, this.abort?.signal.aborted === true)
      llmCalls.push({
        stage: 'story',
        promptChars,
        maxTokens: maxStoryTokens(tier),
        temperature: 0.72,
        responseMode: 'text',
        timeoutMs: 45_000,
        durationMs: Date.now() - storyStart,
        rawOutputChars: 0,
        parsedOk: false,
        errorKind: kind,
        errorMessage: e instanceof Error ? e.message : String(e),
      })
      throw e
    }
    llmCalls.push({
      stage: 'story',
      promptChars,
      maxTokens: maxStoryTokens(tier),
      temperature: 0.72,
      responseMode: 'text',
      timeoutMs: 45_000,
      durationMs: Date.now() - storyStart,
      rawOutputChars: raw.length,
      rawOutputPreview: capRawPreview(raw),
      parsedOk: true,
    })
    const parsed = parseStoryOutput(raw)
    if (parsed === undefined) {
      llmCalls[llmCalls.length - 1]!.parsedOk = false
      llmCalls[llmCalls.length - 1]!.errorKind = 'prose_parse'
      return undefined
    }
    const card = cardFromProse({
      parsed,
      brief,
      lead,
      loreCardId: loreCards[0]?.id,
      toolsUsed: toolResults.map((t) => t.tool),
      modelLabel: this.activeModelLabel(this.spineRef),
      latencyMs: Date.now() - startedMs,
      atMs: Date.now(),
    })
    if (lead.relatedAddress !== undefined) {
      this.dossierStore?.noteFeatured(
        lead.relatedAddress,
        parsed.angle ?? parsed.story.slice(0, 120),
        card.modelLabel,
      )
    }
    return card
  }

  private publishFallback(
    brief: NonNullable<ReturnType<typeof buildStoryBrief>>,
    lens: StoryLens,
    reason = 'offline',
    beat?: string,
  ): void {
    const lore = selectLoreCards(brief, lens, recentLoreIds(this.journal), 1)[0]
    const card = buildDeterministicFieldNote(brief, lens, lore, Date.now())
    card.fallbackReason = reason.slice(0, 32)
    card.beatKind = beat
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
    const lead = directStory(brief, this.journal, this.lensOverride, {
      beat: this.beatOverride,
      dossierNoveltyBoost: (addr) => this.dossierStore?.noveltyBoost(addr) ?? 1,
    })
    const blockNumber = snap.latestBlockNumber ?? '0'
    const dossier = await buildForensicDossier({
      lead,
      economy: this.economy,
      stateManager: this.ctx.stateManager,
      chain: this.ctx.chain,
      blockNumber,
      store: this.dossierStore,
      sandbox: this.ctx.sandbox,
      spine,
    })
    const startedMs = Date.now()
    const llmCalls: AiRunTraceRecord['llmCalls'] = []
    const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    let work: Promise<void> | undefined
    work = (async () => {
      let source: 'llm' | 'fallback' = 'llm'
      let fallbackReason: string | undefined
      try {
        let card: ChainDispatchCard | undefined
        const toolResults: Array<{ tool: string; result: string }> = []

        if (tier === 'rich') {
          const journalHeadlines = this.journal.snapshot(5).map(headlineSnippet)
          const scoutSystem = buildScoutSystem(INVESTIGATION_TOOL_NAMES.join(', '))
          const scoutUser = safeJSON({
            dossier,
            lead,
            journalHeadlines,
            trigger,
          })
          const scoutPromptChars = scoutSystem.length + scoutUser.length
          const scoutStart = Date.now()
          let raw1 = ''
          try {
            raw1 = await this.transport.complete(
              {
                kind: 'pulse',
                messages: [
                  {
                    role: 'system',
                    content: scoutSystem,
                  },
                  {
                    role: 'user',
                    content: scoutUser,
                  },
                ],
                overrides: { responseMode: 'json', modelTier: tier },
              },
              controller.signal,
            )
          } catch (scoutErr: unknown) {
            llmCalls.push({
              stage: 'scout',
              promptChars: scoutPromptChars,
              maxTokens: 256,
              temperature: 0.15,
              responseMode: 'json',
              timeoutMs: 35_000,
              durationMs: Date.now() - scoutStart,
              rawOutputChars: 0,
              parsedOk: false,
              errorKind: llmErrorKindFromUnknown(scoutErr, controller.signal.aborted),
              errorMessage: scoutErr instanceof Error ? scoutErr.message : String(scoutErr),
            })
            throw scoutErr
          }
          llmCalls.push({
            stage: 'scout',
            promptChars: scoutPromptChars,
            maxTokens: 256,
            temperature: 0.15,
            responseMode: 'json',
            timeoutMs: 35_000,
            durationMs: Date.now() - scoutStart,
            rawOutputChars: raw1.length,
            rawOutputPreview: capRawPreview(raw1),
            parsedOk: true,
          })
          const triage = parseDetectiveTriage(parseLlmJSONObject(raw1))
          if (triage?.mode === 'dispatch') {
            card = triage.card
            card.blockNumber = snap.latestBlockNumber
            card.lens = lead.lens
            card.network = brief.network
            card.subjectKey = lead.subjectKey
            card.beatKind = lead.beat
          } else if (triage?.mode === 'investigate') {
            for (const call of triage.calls.slice(0, 1)) {
              toolResults.push({
                tool: call.tool,
                result: await runInvestigationToolAsync(call.tool, call.args, this.ctx),
              })
            }
          }
        }

        card =
          card ??
          (await this.runStorytellerTurn(
            brief,
            lead,
            dossier,
            toolResults,
            tier,
            startedMs,
            llmCalls,
          ))

        if (card !== undefined) {
          card.blockNumber = card.blockNumber ?? snap.latestBlockNumber
          card.beatKind = lead.beat
          this.journal.push(card)
          this.lastDispatchMs = Date.now()
          this.lastDispatchBlock = head
          this.publishStory(card)
          this.consecutiveFailures = 0
          this.setLlmPulseReady(spine, true)
          recordDiagnostic(spine, {
            subsystem: 'ai',
            severity: 'info',
            message: `story #${card.blockNumber ?? '?'} source=llm beat=${lead.beat} addr=${card.relatedAddress?.slice(0, 12) ?? '—'} ${((Date.now() - startedMs) / 1000).toFixed(1)}s "${card.headline.slice(0, 40)}"`,
          })
          this.aiRunLog.append({
            runId,
            ts: Date.now(),
            trigger,
            network: spine.network,
            blockNumber: card.blockNumber,
            aiMode: spine.aiMode,
            modelLabel: this.activeModelLabel(spine),
            modelTier: tier,
            director: { roll: lead.diceRoll, candidates: lead.beatCandidates, beat: lead.beat },
            dossier,
            llmCalls,
            source: 'llm',
            headline: card.headline,
            bodyChars: card.body.length,
            pointersCount: card.suggestedAction !== undefined ? 1 : 0,
            totalLatencyMs: Date.now() - startedMs,
          })
          return
        }
        throw new LlmWireError('prose_parse', 'empty_story')
      } catch (err) {
        if (controller.signal.aborted) return
        source = 'fallback'
        fallbackReason =
          err instanceof LlmWireError
            ? err.errorKind
            : err instanceof Error
              ? err.message.slice(0, 48)
              : 'error'
        this.consecutiveFailures += 1
        const latest = this.journal.latest()
        if (latest !== undefined && latest.deterministic !== true) {
          this.publishStory(latest)
        } else {
          this.publishFallback(brief, lead.lens, fallbackReason, lead.beat)
        }
        recordDiagnostic(spine, {
          subsystem: 'ai',
          severity: 'warn',
          message: `story #${blockNumber} source=fallback reason=${fallbackReason}`,
        })
        this.aiRunLog.append({
          runId,
          ts: Date.now(),
          trigger,
          network: spine.network,
          blockNumber,
          aiMode: spine.aiMode,
          modelLabel: this.activeModelLabel(spine),
          modelTier: tier,
          director: { roll: lead.diceRoll, candidates: lead.beatCandidates, beat: lead.beat },
          dossier,
          llmCalls,
          source,
          fallbackReason,
          totalLatencyMs: Date.now() - startedMs,
        })
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
