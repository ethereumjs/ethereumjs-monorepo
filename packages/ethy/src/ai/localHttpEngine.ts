import type { ChainConfig } from '@ethereumjs/common'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'

import { buildCompactDomainContext } from './compactContext.ts'
import { composeViewFromRequest, parseComposeAction } from './composeView.ts'
import { dispatchSlashWidget } from './deterministicEngine.ts'
import type { LlmTransport } from './fixtureEngine.ts'
import type { IntentEngine, IntentRequest, IntentResult } from './intentEngine.ts'
import { parseLlmJSONObject } from './llmClient.ts'
import { MAX_AI_OVERVIEW_CHARS } from './overviewNarrator.ts'
import { formatEthyStateHeader } from './stateHeader.ts'
import { buildToolCatalog, isToolAllowed, toolIdToSlash } from './toolCatalog.ts'
import type { TurnRecord } from './turnMemory.ts'
import { ETHY_USAGE_PLAYBOOK } from './usagePlaybook.ts'

function clampNote(text: string | undefined): string | undefined {
  if (text === undefined) return undefined
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= MAX_AI_OVERVIEW_CHARS) return t
  return `${t.slice(0, MAX_AI_OVERVIEW_CHARS - 1)}…`
}

const INTENT_SCHEMA = `Respond with JSON only:
{
  "viewTitle": "short title for the interaction box",
  "overviewNote": "optional <=280 char note for AI overview",
  "action": { "type": "tool", "name": "<toolId>", "args": "optional slash args" }
           | { "type": "compose", "dataset": "peers|peersByClient|buckets|economy|topContracts|diag", "minWrites": number }
           | { "type": "literal", "table": { "headers": [], "rows": [] }, "keyValue": [{ "key": "", "value": "" }] }
}
Use tool ids from the catalog. Prefer tool or compose over literal.`

export type LocalHttpIntentEngineOpts = {
  transport: LlmTransport
  stateManager: FlatStateManager
  snapStore?: SnapPivotStore
  disconnectPeer?: (peerId: string) => void
  fallback: IntentEngine
  getTurns: () => readonly TurnRecord[]
  economy?: ETHEconomyDataManager
  chain?: ChainConfig
}

export class LocalHttpIntentEngine implements IntentEngine {
  private readonly transport: LlmTransport
  private readonly stateManager: FlatStateManager
  private readonly snapStore?: SnapPivotStore
  private disconnectPeer?: (peerId: string) => void
  private readonly fallback: IntentEngine
  private readonly getTurns: () => readonly TurnRecord[]
  private readonly economy?: ETHEconomyDataManager
  private readonly chain?: ChainConfig

  constructor(opts: LocalHttpIntentEngineOpts) {
    this.transport = opts.transport
    this.stateManager = opts.stateManager
    this.snapStore = opts.snapStore
    this.disconnectPeer = opts.disconnectPeer
    this.fallback = opts.fallback
    this.getTurns = opts.getTurns
    this.economy = opts.economy
    this.chain = opts.chain
  }

  setDisconnectPeer(fn: (peerId: string) => void): void {
    this.disconnectPeer = fn
    this.fallback.setDisconnectPeer?.(fn)
  }

  async handle(req: IntentRequest): Promise<IntentResult> {
    const { spine, lastQuerySlot } = req
    const querySlot = spine.currentSlot
    const stateHeader = formatEthyStateHeader(spine, lastQuerySlot)
    const catalog = buildToolCatalog(spine, 'interactive')
    const context = buildCompactDomainContext(spine)
    const turns = this.getTurns()

    const userBlob = [
      formatEthyStateHeader(spine, lastQuerySlot),
      JSON.stringify({ snapshots: context, priorTurns: turns }),
      `User question: ${req.text.trim()}`,
    ].join('\n\n')

    try {
      const raw = await this.transport.complete({
        kind: 'intent',
        messages: [
          {
            role: 'system',
            content: `${ETHY_USAGE_PLAYBOOK}\n\n${INTENT_SCHEMA}\nTools: ${JSON.stringify(catalog)}`,
          },
          { role: 'user', content: userBlob },
        ],
      })
      const obj = parseLlmJSONObject(raw)
      const viewTitle =
        typeof obj.viewTitle === 'string' && obj.viewTitle.length > 0
          ? obj.viewTitle
          : req.text.trim().split(/\s+/).slice(0, 5).join(' ')
      const overviewNote = clampNote(
        typeof obj.overviewNote === 'string' ? obj.overviewNote : undefined,
      )

      const action = obj.action
      if (action !== null && typeof action === 'object' && !Array.isArray(action)) {
        const act = action as Record<string, unknown>
        if (act.type === 'tool' && typeof act.name === 'string') {
          const id = act.name.toLowerCase()
          if (!isToolAllowed(spine, id)) {
            return this.fallback.handle(req)
          }
          const slash = toolIdToSlash(id)
          if (slash === undefined) {
            return this.fallback.handle(req)
          }
          const args = typeof act.args === 'string' ? act.args.trim() : ''
          const line = args.length > 0 ? `${slash} ${args}` : slash
          const widget = dispatchSlashWidget(line, {
            spine,
            stateManager: this.stateManager,
            snapStore: this.snapStore,
            disconnectPeer: this.disconnectPeer,
            economy: this.economy,
            chain: this.chain,
          })
          return {
            widget,
            stateHeader,
            querySlot,
            viewTitle,
            overviewNote:
              overviewNote ??
              (widget.kind !== 'domain_help' && 'assistantComment' in widget
                ? widget.assistantComment
                : undefined),
          }
        }
        const compose = parseComposeAction(act, viewTitle)
        if (compose !== undefined) {
          const widget = composeViewFromRequest(spine, this.stateManager, compose)
          return {
            widget,
            stateHeader,
            querySlot,
            viewTitle,
            overviewNote:
              overviewNote ??
              (widget.kind !== 'domain_help' && 'assistantComment' in widget
                ? widget.assistantComment
                : undefined),
          }
        }
      }
    } catch {
      return this.fallback.handle(req)
    }
    return this.fallback.handle(req)
  }
}
