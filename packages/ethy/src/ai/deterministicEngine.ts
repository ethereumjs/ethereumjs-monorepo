import type { FlatStateManager } from '@ethereumjs/statemanager'

import type { WidgetSpec } from '../spine/types.ts'
import { dropPeer, pauseSnapSync, reassignBucket, resumeSnapSync } from '../tools/devActions.ts'
import { bucketsTableWidget, diagnosticsTableWidget, peersTableWidget } from '../tools/diagnose.ts'
import {
  headLockedWidget,
  headReadyAccountStub,
  inspectLatestBALStub,
  simulateTxOnHeadStub,
} from '../tools/gated.ts'
import { buildHelpWidget } from '../tools/help.ts'
import { inspectRawAccountRange, sampleSyncedAccounts } from '../tools/range.ts'
import type { IntentEngine, IntentRequest, IntentResult } from './intentEngine.ts'
import { expandSlashCommand } from './slashComplete.ts'
import { formatEthyStateHeader } from './stateHeader.ts'

function normalize(text: string): string {
  return text.trim().toLowerCase()
}

function matchKeywords(text: string, words: string[]): boolean {
  const n = normalize(text)
  return words.some((w) => n.includes(w))
}

export type DeterministicIntentEngineOpts = {
  stateManager: FlatStateManager
  disconnectPeer?: (peerId: string) => void
}

export class DeterministicIntentEngine implements IntentEngine {
  private readonly stateManager: FlatStateManager
  private disconnectPeer?: (peerId: string) => void

  constructor(opts: DeterministicIntentEngineOpts) {
    this.stateManager = opts.stateManager
    this.disconnectPeer = opts.disconnectPeer
  }

  setDisconnectPeer(fn: (peerId: string) => void): void {
    this.disconnectPeer = fn
  }

  handle(req: IntentRequest): IntentResult {
    const { text, spine, lastQuerySlot } = req
    const trimmed = expandSlashCommand(text)
    const querySlot = spine.currentSlot
    const stateHeader = formatEthyStateHeader(spine, lastQuerySlot)

    let widget: WidgetSpec

    if (trimmed.startsWith('/')) {
      widget = this.routeSlash(trimmed, spine, req)
    } else if (matchKeywords(trimmed, ['peer', 'client', 'latency'])) {
      widget = peersTableWidget(spine)
    } else if (matchKeywords(trimmed, ['bucket', 'stalled', 'why', 'snap'])) {
      widget = bucketsTableWidget(spine)
    } else if (matchKeywords(trimmed, ['error', 'anomaly', 'anomalies', 'log', 'diag'])) {
      widget = diagnosticsTableWidget(spine)
    } else if (trimmed.length === 0) {
      widget = buildHelpWidget(spine)
    } else {
      widget = buildHelpWidget(spine)
    }

    return { widget, stateHeader, querySlot }
  }

  private routeSlash(
    line: string,
    spine: import('../spine/types.ts').EthySpine,
    _req: IntentRequest,
  ): WidgetSpec {
    const parts = line.split(/\s+/)
    const cmd = parts[0]?.toLowerCase() ?? ''

    switch (cmd) {
      case '/peers':
        return peersTableWidget(spine)
      case '/buckets':
      case '/snap':
        return bucketsTableWidget(spine)
      case '/diag':
        return diagnosticsTableWidget(spine)
      case '/help':
        return buildHelpWidget(spine)
      case '/drop':
        return dropPeer(spine, parts[1] ?? '', this.disconnectPeer)
      case '/reassign':
        return reassignBucket(spine, parts[1] ?? '')
      case '/range':
        return inspectRawAccountRange(this.stateManager, parts[1])
      case '/sample':
        return sampleSyncedAccounts(this.stateManager)
      case '/pause':
        return pauseSnapSync(spine)
      case '/resume':
        return resumeSnapSync(spine)
      case '/account': {
        const addr = parts.slice(1).join(' ')
        if (spine.capabilities.head.status === 'locked') {
          return headLockedWidget('inspectAccount', spine)
        }
        return headReadyAccountStub(spine, addr)
      }
      case '/bal':
        if (spine.capabilities.head.status === 'locked') {
          return inspectLatestBALStub(spine)
        }
        return {
          kind: 'key_value',
          title: 'Latest BAL (stub)',
          entries: [{ key: 'Note', value: 'BAL follower ships in WP-05' }],
        }
      case '/simulate':
        if (spine.capabilities.head.status === 'locked') {
          return simulateTxOnHeadStub(spine)
        }
        return {
          kind: 'key_value',
          title: 'simulateTxOnHead (stub)',
          entries: [{ key: 'Note', value: 'EVM sandbox ships in WP-06' }],
        }
      default:
        return {
          kind: 'key_value',
          title: 'Unknown command',
          entries: [{ key: 'Input', value: line }],
          assistantComment: 'Type /help for available commands.',
        }
    }
  }
}
