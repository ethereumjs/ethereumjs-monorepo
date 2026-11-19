import type { ChainConfig } from '@ethereumjs/common'
import type { FlatStateManager } from '@ethereumjs/statemanager'

import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import type { SignalCandidate } from '../economy/types.ts'
import type { EthySandbox } from '../evm/sandbox.ts'
import { deriveCapabilities } from '../spine/createSpine.ts'
import type { AiOverviewSections, ChainDispatchCard, EthySpine } from '../spine/types.ts'
import type { LlmTransport } from './fixtureEngine.ts'
import { InvestigationJournal, UserInterestRing } from './investigationJournal.ts'
import {
  INVESTIGATION_TOOL_NAMES,
  type InvestigationContext,
  type InvestigationToolName,
  runInvestigationToolAsync,
} from './investigationTools.ts'
import { parseLlmJSONObject } from './llmClient.ts'
import { AI_PULSE_INTERVAL_MS } from './pulseNarrator.ts'
import { buildSignalDigest, digestForPrompt } from './signalDigest.ts'
import { ETHY_USAGE_PLAYBOOK } from './usagePlaybook.ts'

export const DETECTIVE_INTERVAL_MS = AI_PULSE_INTERVAL_MS

const TURN1_SCHEMA = `JSON only. Either { "mode": "investigate", "calls": [{ "tool": "<name>", "args": {} }] } (1-2 tools) OR { "mode": "dispatch", "category": "surge|7702|l2|fee|flow|contract|watch", "severity": "calm|notable|surge", "headline": "<=72 chars", "body": "<=360 chars", "relatedAddress"?: "0x...", "suggestedAction"?: "..." }. Tools: ${INVESTIGATION_TOOL_NAMES.join(', ')}.`
const TURN2_SCHEMA = `JSON only: { "mode": "dispatch", "category", "severity", "headline", "body", "relatedAddress"?, "suggestedAction"? }`

export type DetectiveTriage =
  | {
      mode: 'investigate'
      calls: Array<{ tool: InvestigationToolName; args: Record<string, unknown> }>
    }
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
    body: `Layer 1 signal (${signal.kind}, score ${signal.noveltyScore}).`,
    relatedAddress: signal.address,
    suggestedAction: signal.address !== undefined ? `/contract ${signal.address}` : '/signals',
    blockNumber:
      typeof signal.metrics.block === 'number' ? String(signal.metrics.block) : undefined,
    atMs,
    deterministic: true,
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
  if (mode === 'dispatch') {
    const card = dispatchCardFromRecord(obj)
    return card !== undefined ? { mode: 'dispatch', card } : undefined
  }
  return undefined
}

function dispatchCardFromRecord(obj: Record<string, unknown>): ChainDispatchCard | undefined {
  const headline = typeof obj.headline === 'string' ? obj.headline.trim().slice(0, 72) : ''
  const body = typeof obj.body === 'string' ? obj.body.trim().slice(0, 360) : ''
  if (headline.length === 0 || body.length === 0) return undefined
  return {
    category: typeof obj.category === 'string' ? obj.category : 'watch',
    severity: typeof obj.severity === 'string' ? obj.severity : 'notable',
    headline,
    body,
    relatedAddress: typeof obj.relatedAddress === 'string' ? obj.relatedAddress : undefined,
    suggestedAction: typeof obj.suggestedAction === 'string' ? obj.suggestedAction : undefined,
    atMs: Date.now(),
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
  private consecutiveFailures = 0
  private lastDispatchMs = 0
  private lastDispatchBlock = 0n
  private userFocusBump = false
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

  private setLlmPulseReady(spine: EthySpine, ready: boolean): void {
    spine.llmPulseReady = ready
    deriveCapabilities(spine)
  }

  private publishBootstrap(spine: EthySpine): void {
    this.onOverview({
      bootstrapNote:
        'Syncing live blocks — on-chain detective dispatches start once economy data arrives.',
    })
  }

  noteBlocksReady(spine: EthySpine): void {
    this.spineRef = spine
    this.ctx.spine = spine
    if (this.lastDispatchBlock === 0n && spine.economy?.hasBlocks === true) {
      void this.runCycle('welcome')
    }
  }

  private publishDispatches(cards: ChainDispatchCard[]): void {
    const fromJournal = this.journal.snapshot(2)
    const dispatches = fromJournal.length > 0 ? [...fromJournal] : cards.slice(0, 2)
    this.onOverview({ dispatches })
  }

  private async runCycle(trigger: 'welcome' | 'pulse'): Promise<void> {
    const spine = this.spineRef
    if (spine === undefined || this.inFlight) return
    this.ctx.spine = spine
    const snap = spine.economy
    if (snap?.hasBlocks !== true) {
      if (trigger === 'welcome') this.publishBootstrap(spine)
      return
    }

    const digest = buildSignalDigest(snap)
    if (digest === undefined) return

    const head = snap.latestBlockNumber !== undefined ? BigInt(snap.latestBlockNumber) : 0n
    const blocksSince = this.lastDispatchBlock > 0n ? Number(head - this.lastDispatchBlock) : 99
    const topScore = digest.signals[0]?.noveltyScore ?? 0
    const msSince = Date.now() - this.lastDispatchMs

    if (
      trigger === 'pulse' &&
      noveltyShouldSkip({
        blocksSinceLast: blocksSince,
        topScore,
        msSinceLast: msSince,
        userFocusBump: this.userFocusBump,
      })
    ) {
      const latest = this.journal.latest()
      if (latest !== undefined) this.publishDispatches([latest])
      return
    }

    this.inFlight = true
    this.abort?.abort()
    this.abort = new AbortController()
    const signal = this.abort.signal
    this.userFocusBump = false

    const journalSnippet = this.journal.snapshot(5)
    const userCues = spine.sharePromptHistory === true ? this.userInterest.snapshot() : []
    const userPayload = {
      digest: digestForPrompt(digest),
      journal: journalSnippet,
      userCues,
      trigger,
    }

    try {
      const raw1 = await this.transport.complete(
        {
          kind: 'pulse',
          messages: [
            { role: 'system', content: `${ETHY_USAGE_PLAYBOOK}\n\n${TURN1_SCHEMA}` },
            { role: 'user', content: JSON.stringify(userPayload) },
          ],
        },
        signal,
      )
      const triage = parseDetectiveTriage(parseLlmJSONObject(raw1))
      let card: ChainDispatchCard | undefined

      if (triage?.mode === 'dispatch') {
        card = triage.card
      } else if (triage?.mode === 'investigate') {
        const toolResults: Array<{ tool: string; result: string }> = []
        for (const call of triage.calls) {
          toolResults.push({
            tool: call.tool,
            result: await runInvestigationToolAsync(call.tool, call.args, this.ctx),
          })
        }
        const raw2 = await this.transport.complete(
          {
            kind: 'pulse',
            messages: [
              { role: 'system', content: `${ETHY_USAGE_PLAYBOOK}\n\n${TURN2_SCHEMA}` },
              {
                role: 'user',
                content: JSON.stringify({
                  digest: userPayload.digest,
                  toolResults,
                  journalSnippet,
                }),
              },
            ],
          },
          signal,
        )
        card = dispatchCardFromRecord(parseLlmJSONObject(raw2))
      }

      if (card === undefined) {
        const sig = digest.signals[0]
        if (sig !== undefined) {
          card = signalToDispatchCard(sig, Date.now())
        }
      }

      if (card !== undefined) {
        card.blockNumber = snap.latestBlockNumber
        this.journal.push(card)
        this.lastDispatchMs = Date.now()
        this.lastDispatchBlock = head
        this.publishDispatches([card])
        this.consecutiveFailures = 0
        this.setLlmPulseReady(spine, true)
      }
    } catch {
      this.consecutiveFailures += 1
      const sig = digest.signals[0]
      if (sig !== undefined) {
        const card = signalToDispatchCard(sig, Date.now())
        card.blockNumber = snap.latestBlockNumber
        this.journal.push(card)
        this.publishDispatches([card])
      }
      if (this.consecutiveFailures >= 2) {
        this.setLlmPulseReady(spine, false)
        this.onUnhealthy?.()
      }
    } finally {
      this.inFlight = false
    }
  }
}
