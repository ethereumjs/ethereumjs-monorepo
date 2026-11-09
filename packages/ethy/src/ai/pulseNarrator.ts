import { readDomainSnapshots } from '../domains/domainManagers.ts'
import { deriveCapabilities } from '../spine/createSpine.ts'
import type { EthySpine } from '../spine/types.ts'
import { buildCompactDomainContext } from './compactContext.ts'
import type { LlmTransport } from './fixtureEngine.ts'
import { parseLlmJSONObject } from './llmClient.ts'
import { MAX_AI_OVERVIEW_CHARS, buildDeterministicOverview } from './overviewNarrator.ts'
import { ETHY_USAGE_PLAYBOOK } from './usagePlaybook.ts'

export const AI_PULSE_INTERVAL_MS = 45_000

function clampOverview(text: string): string {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= MAX_AI_OVERVIEW_CHARS) return t
  return `${t.slice(0, MAX_AI_OVERVIEW_CHARS - 1)}…`
}

const PULSE_SCHEMA =
  'Respond with JSON only: { "overviewText": "<=280 char situational briefing, do not repeat previousOverview verbatim>" }'

export type AiPulseNarratorOpts = {
  transport: LlmTransport
  onOverview: (text: string) => void
  onUnhealthy?: () => void
}

export class AiPulseNarrator {
  private readonly transport: LlmTransport
  private readonly onOverview: (text: string) => void
  private readonly onUnhealthy?: () => void
  private timer?: ReturnType<typeof setInterval>
  private abort?: AbortController
  private previousOverview = ''
  private lastPhase?: string
  private inFlight = false
  private consecutiveFailures = 0
  spineRef?: EthySpine

  constructor(opts: AiPulseNarratorOpts) {
    this.transport = opts.transport
    this.onOverview = opts.onOverview
    this.onUnhealthy = opts.onUnhealthy
  }

  start(spine: EthySpine): void {
    this.spineRef = spine
    this.lastPhase = spine.phase
    void this.runPulse('welcome')
    this.timer = setInterval(() => {
      if (this.spineRef !== undefined) {
        void this.runPulse('pulse')
      }
    }, AI_PULSE_INTERVAL_MS)
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

  notePhase(spine: EthySpine): void {
    this.spineRef = spine
    if (spine.phase !== this.lastPhase) {
      this.lastPhase = spine.phase
      void this.runPulse('pulse')
    }
  }

  abortInFlight(): void {
    this.abort?.abort()
  }

  private setAiCapability(spine: EthySpine, ready: boolean): void {
    spine.llmPulseReady = ready
    deriveCapabilities(spine)
  }

  private async runPulse(trigger: 'welcome' | 'pulse'): Promise<void> {
    const spine = this.spineRef
    if (spine === undefined || this.inFlight) return
    this.inFlight = true
    this.abort?.abort()
    this.abort = new AbortController()
    const signal = this.abort.signal
    const snapshots = readDomainSnapshots(spine)
    const fallback = buildDeterministicOverview(snapshots, trigger)

    try {
      const context = buildCompactDomainContext(spine)
      const raw = await this.transport.complete(
        {
          kind: 'pulse',
          messages: [
            {
              role: 'system',
              content: `${ETHY_USAGE_PLAYBOOK}\n\n${PULSE_SCHEMA}`,
            },
            {
              role: 'user',
              content: JSON.stringify({
                snapshots: context,
                previousOverview: this.previousOverview,
                trigger,
              }),
            },
          ],
        },
        signal,
      )
      const obj = parseLlmJSONObject(raw)
      const text =
        typeof obj.overviewText === 'string' && obj.overviewText.length > 0
          ? clampOverview(obj.overviewText)
          : fallback
      this.previousOverview = text
      this.onOverview(text)
      this.consecutiveFailures = 0
      this.setAiCapability(spine, true)
    } catch {
      this.consecutiveFailures += 1
      if (this.consecutiveFailures >= 2) {
        this.setAiCapability(spine, false)
        this.onUnhealthy?.()
        this.onOverview(fallback)
      }
    } finally {
      this.inFlight = false
    }
  }
}
