import type { ChainConfig } from '@ethereumjs/common'
import type { FlatStateManager } from '@ethereumjs/statemanager'

import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import type { WidgetSpec } from '../spine/types.ts'
import type { EthySpine } from '../spine/types.ts'
import { clMicroscopeWidget } from '../tools/clTools.ts'
import { contractMicroscopeWidget } from '../tools/contractTools.ts'
import { dropPeer, pauseSnapSync, reassignBucket, resumeSnapSync } from '../tools/devActions.ts'
import {
  bucketsTableWidget,
  diagnosticsTableWidget,
  ethyOverviewWidget,
  peersTableWidget,
} from '../tools/diagnose.ts'
import { economyDeepViewWidget } from '../tools/economyTools.ts'
import { headLockedWidget, inspectLatestBALStub, simulateTxOnHeadStub } from '../tools/gated.ts'
import { inspectAccount, inspectLatestBAL } from '../tools/headTools.ts'
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
  economy?: ETHEconomyDataManager
  chain?: ChainConfig
}

/** Shared slash router for deterministic and LLM tool dispatch. */
export type SlashDispatchCtx = {
  spine: EthySpine
  stateManager: FlatStateManager
  disconnectPeer?: (peerId: string) => void
  economy?: ETHEconomyDataManager
  chain?: ChainConfig
}

export function dispatchSlashWidget(line: string, ctx: SlashDispatchCtx): WidgetSpec {
  const { spine, stateManager, disconnectPeer, economy, chain } = ctx
  const parts = line.split(/\s+/)
  const cmd = parts[0]?.toLowerCase() ?? ''

  switch (cmd) {
    case '/peers':
      return peersTableWidget(spine)
    case '/ethy':
      return ethyOverviewWidget(spine)
    case '/buckets':
    case '/snap':
      return bucketsTableWidget(spine)
    case '/diag':
      return diagnosticsTableWidget(spine)
    case '/help':
      return buildHelpWidget(spine)
    case '/drop':
      return dropPeer(spine, parts[1] ?? '', disconnectPeer)
    case '/reassign':
      return reassignBucket(spine, parts[1] ?? '')
    case '/range':
      return inspectRawAccountRange(stateManager, parts[1])
    case '/sample':
      return sampleSyncedAccounts(stateManager)
    case '/pause':
      return pauseSnapSync(spine)
    case '/resume':
      return resumeSnapSync(spine)
    case '/account': {
      const addr = parts.slice(1).join(' ')
      if (spine.capabilities.head.status === 'locked') {
        return headLockedWidget('inspectAccount', spine)
      }
      return inspectAccount(spine, stateManager, addr)
    }
    case '/bal':
      if (spine.capabilities.head.status === 'locked') {
        return inspectLatestBALStub(spine)
      }
      return inspectLatestBAL(spine)
    case '/cl':
      return clMicroscopeWidget(spine)
    case '/economy':
      return economyDeepViewWidget(spine)
    case '/contract':
    case '/co': {
      const arg = parts.slice(1).join(' ')
      if (economy === undefined || chain === undefined) {
        return economyDeepViewWidget(spine)
      }
      return contractMicroscopeWidget(spine, stateManager, chain, economy, arg)
    }
    case '/simulate':
      if (spine.capabilities.head.status === 'locked') {
        return simulateTxOnHeadStub(spine)
      }
      return {
        kind: 'key_value',
        title: 'simulateTxOnHead (stub)',
        entries: [{ key: 'Note', value: 'EVM sandbox ships in WP-08' }],
      }
    case '/clear':
      return {
        kind: 'key_value',
        title: 'Session cleared',
        entries: [{ key: 'AI memory', value: 'Use HybridIntentEngine /clear handler' }],
      }
    case '/ai': {
      const mode = parts[1]?.toLowerCase() ?? 'status'
      return {
        kind: 'key_value',
        title: 'AI memory',
        entries: [{ key: 'Mode', value: mode }],
      }
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

export class DeterministicIntentEngine implements IntentEngine {
  private readonly stateManager: FlatStateManager
  private readonly economy?: ETHEconomyDataManager
  private readonly chain?: ChainConfig
  private disconnectPeer?: (peerId: string) => void

  constructor(opts: DeterministicIntentEngineOpts) {
    this.stateManager = opts.stateManager
    this.economy = opts.economy
    this.chain = opts.chain
    this.disconnectPeer = opts.disconnectPeer
  }

  setDisconnectPeer(fn: (peerId: string) => void): void {
    this.disconnectPeer = fn
  }

  handle(req: IntentRequest): Promise<IntentResult> {
    const { text, spine, lastQuerySlot } = req
    const trimmed = expandSlashCommand(text)
    const querySlot = spine.currentSlot
    const stateHeader = formatEthyStateHeader(spine, lastQuerySlot)

    let widget: WidgetSpec

    if (trimmed.startsWith('/')) {
      widget = dispatchSlashWidget(trimmed, {
        spine,
        stateManager: this.stateManager,
        disconnectPeer: this.disconnectPeer,
        economy: this.economy,
        chain: this.chain,
      })
    } else if (
      matchKeywords(trimmed, ['hottest contract', 'explain contract', 'what is contract']) ||
      (/0x[0-9a-f]{40}/i.test(trimmed) && matchKeywords(trimmed, ['contract', 'explain', 'what']))
    ) {
      const addr = trimmed.match(/0x[0-9a-f]{40}/i)?.[0] ?? ''
      if (this.economy !== undefined && this.chain !== undefined) {
        widget = contractMicroscopeWidget(spine, this.stateManager, this.chain, this.economy, addr)
      } else {
        widget = economyDeepViewWidget(spine)
      }
    } else if (
      matchKeywords(trimmed, ['economy', 'base fee', 'basefee', 'gwei', 'tps', 'eth volume'])
    ) {
      widget = economyDeepViewWidget(spine)
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

    return Promise.resolve({ widget, stateHeader, querySlot })
  }
}
