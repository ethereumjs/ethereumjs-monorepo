import { readDomainSnapshots } from '../domains/domainManagers.ts'
import { deriveCapabilities } from '../spine/createSpine.ts'
import { type AiOverviewSections, DOMAIN_ORDER, type EthySpine } from '../spine/types.ts'
import { buildCompactDomainContext } from './compactContext.ts'
import type { LlmTransport } from './fixtureEngine.ts'
import { parseLlmJSONObject } from './llmClient.ts'
import {
  MAX_AI_TOTAL_CHARS,
  buildDeterministicOverviewSections,
  clampOverviewSections,
} from './overviewNarrator.ts'
import { ETHY_USAGE_PLAYBOOK } from './usagePlaybook.ts'

export const AI_PULSE_INTERVAL_MS = 45_000

const PULSE_SCHEMA = `Respond with JSON only: { "state"?: "<=200 char>", "economy"?: "<=200 char>", "p2p"?: "<=200 char>" } — total <= ${MAX_AI_TOTAL_CHARS} chars across non-empty fields.`

export type AiPulseNarratorOpts = {
  transport: LlmTransport
  onOverview: (sections: AiOverviewSections) => void
  onUnhealthy?: () => void
}

function parsePulseSections(obj: Record<string, unknown>): AiOverviewSections {
  const out: AiOverviewSections = {}
  for (const k of DOMAIN_ORDER) {
    const v = obj[k]
    if (typeof v === 'string' && v.trim().length > 0) out[k] = v.trim()
  }
  return clampOverviewSections(out)
}

export class AiPulseNarrator {
  private readonly transport: LlmTransport
  private readonly onOverview: (sections: AiOverviewSections) => void
  private readonly onUnhealthy?: () => void
  private timer?: ReturnType<typeof setInterval>
  private abort?: AbortController
  private previousSectionsJSON = ''
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

  private setLlmPulseReady(spine: EthySpine, ready: boolean): void {
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
    const fallback = buildDeterministicOverviewSections(snapshots, trigger)

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
                previousOverview: this.previousSectionsJSON,
                trigger,
              }),
            },
          ],
        },
        signal,
      )
      const obj = parseLlmJSONObject(raw)
      const sections = parsePulseSections(obj)
      const hasAny =
        sections.state !== undefined || sections.economy !== undefined || sections.p2p !== undefined
      const next = hasAny ? sections : fallback
      this.previousSectionsJSON = JSON.stringify(next)
      this.onOverview(next)
      this.consecutiveFailures = 0
      this.setLlmPulseReady(spine, true)
    } catch {
      this.consecutiveFailures += 1
      if (this.consecutiveFailures >= 2) {
        this.setLlmPulseReady(spine, false)
        this.onUnhealthy?.()
        this.onOverview(fallback)
      }
    } finally {
      this.inFlight = false
    }
  }
}
