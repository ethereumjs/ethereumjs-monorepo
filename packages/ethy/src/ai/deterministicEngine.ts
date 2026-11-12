import type { ChainConfig } from '@ethereumjs/common'
import type { FlatStateManager } from '@ethereumjs/statemanager'

import { getCommandAvailability } from '../domains/commandAvailability.ts'
import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import type { EthySandbox } from '../evm/sandbox.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'
import { headInspectUnlocked } from '../spine/headInspect.ts'
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
import { inspectAccount, inspectLatestBAL } from '../tools/headTools.ts'
import { buildDomainHelpWidget, buildHelpWidget, parseHelpDomainArg } from '../tools/help.ts'
import { livePlazaWidget } from '../tools/livePlaza.ts'
import { inspectRawAccountRange, sampleSyncedAccounts } from '../tools/range.ts'
import { rpcMicroscopeWidget } from '../tools/rpcTools.ts'
import { sendTxWidget, simulateMicroscopeWidget } from '../tools/simulateTools.ts'
import { renderCommandUnavailableWidget } from '../tui/components/CommandUnavailableUIComponent.ts'
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
  snapStore?: SnapPivotStore
  disconnectPeer?: (peerId: string) => void
  economy?: ETHEconomyDataManager
  chain?: ChainConfig
  sandbox?: EthySandbox
}

type RawTxSubmitter = (hex: string) => Promise<{ result: string } | { error: { message: string } }>

/** Shared slash router for deterministic and LLM tool dispatch. */
export type SlashDispatchCtx = {
  spine: EthySpine
  stateManager: FlatStateManager
  snapStore?: SnapPivotStore
  disconnectPeer?: (peerId: string) => void
  economy?: ETHEconomyDataManager
  chain?: ChainConfig
}

function slashIfLocked(
  command: string,
  spine: EthySpine,
  opts?: { args?: string },
): WidgetSpec | undefined {
  const avail = getCommandAvailability(command, spine, opts)
  if (avail.status === 'locked') {
    return renderCommandUnavailableWidget(command, avail, spine)
  }
  return undefined
}

export function dispatchSlashWidget(line: string, ctx: SlashDispatchCtx): WidgetSpec {
  const { spine, stateManager, snapStore, disconnectPeer, economy, chain } = ctx
  const parts = line.split(/\s+/)
  const cmd = parts[0]?.toLowerCase() ?? ''

  switch (cmd) {
    case '/peers':
      return peersTableWidget(spine)
    case '/ethy':
      return ethyOverviewWidget(spine)
    case '/rpc':
      return rpcMicroscopeWidget(spine)
    case '/buckets':
    case '/snap':
      return bucketsTableWidget(spine)
    case '/diag':
      return diagnosticsTableWidget(spine)
    case '/help':
    case '/h': {
      const domain = parseHelpDomainArg(parts)
      if (domain !== undefined) return buildDomainHelpWidget(spine, domain)
      return buildHelpWidget(spine)
    }
    case '/welcome': {
      const hasBlocks = spine.economy?.hasBlocks === true
      if (!hasBlocks && spine.phase !== 'HEAD_FOLLOWING') {
        return { kind: 'start_page' }
      }
      const locked = slashIfLocked('/live', spine)
      if (locked !== undefined) return locked
      return livePlazaWidget(spine)
    }
    case '/drop': {
      const locked = slashIfLocked('/drop', spine)
      if (locked !== undefined) return locked
      return dropPeer(spine, parts[1] ?? '', disconnectPeer)
    }
    case '/reassign': {
      const locked = slashIfLocked('/reassign', spine)
      if (locked !== undefined) return locked
      return reassignBucket(spine, parts[1] ?? '')
    }
    case '/range': {
      const locked = slashIfLocked('/range', spine)
      if (locked !== undefined) return locked
      return inspectRawAccountRange(stateManager, parts[1], snapStore)
    }
    case '/sample': {
      const locked = slashIfLocked('/sample', spine)
      if (locked !== undefined) return locked
      return sampleSyncedAccounts(stateManager, snapStore)
    }
    case '/pause': {
      const locked = slashIfLocked('/pause', spine)
      if (locked !== undefined) return locked
      return pauseSnapSync(spine)
    }
    case '/resume': {
      const locked = slashIfLocked('/resume', spine)
      if (locked !== undefined) return locked
      return resumeSnapSync(spine)
    }
    case '/account': {
      const addr = parts.slice(1).join(' ')
      const locked = slashIfLocked('/account', spine)
      if (locked !== undefined) return locked
      if (!headInspectUnlocked(spine)) {
        const avail = getCommandAvailability('/account', spine)
        return renderCommandUnavailableWidget('/account', avail, spine)
      }
      return inspectAccount(spine, stateManager, addr)
    }
    case '/bal': {
      const locked = slashIfLocked('/bal', spine)
      if (locked !== undefined) return locked
      return inspectLatestBAL(spine)
    }
    case '/cl':
      return clMicroscopeWidget(spine)
    case '/live':
    case '/plaza':
    case '/head': {
      const locked = slashIfLocked('/live', spine)
      if (locked !== undefined) return locked
      return livePlazaWidget(spine)
    }
    case '/economy': {
      const locked = slashIfLocked('/economy', spine)
      if (locked !== undefined) return locked
      return economyDeepViewWidget(spine)
    }
    case '/contract':
    case '/co': {
      const arg = parts.slice(1).join(' ')
      const locked = slashIfLocked('/contract', spine, { args: arg })
      if (locked !== undefined) return locked
      if (economy === undefined || chain === undefined) {
        return economyDeepViewWidget(spine)
      }
      return contractMicroscopeWidget(spine, stateManager, chain, economy, arg)
    }
    case '/simulate':
      return {
        kind: 'key_value',
        title: '/simulate',
        entries: [{ key: 'Note', value: 'Run via intent engine (async sandbox).' }],
      }
    case '/send':
      return {
        kind: 'key_value',
        title: '/send',
        entries: [{ key: 'Note', value: 'Run via intent engine (async submit).' }],
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
  private readonly snapStore?: SnapPivotStore
  private readonly economy?: ETHEconomyDataManager
  private readonly chain?: ChainConfig
  private readonly sandbox?: EthySandbox
  private disconnectPeer?: (peerId: string) => void
  private submitRawTransaction?: RawTxSubmitter

  constructor(opts: DeterministicIntentEngineOpts) {
    this.stateManager = opts.stateManager
    this.snapStore = opts.snapStore
    this.economy = opts.economy
    this.chain = opts.chain
    this.sandbox = opts.sandbox
    this.disconnectPeer = opts.disconnectPeer
  }

  setDisconnectPeer(fn: (peerId: string) => void): void {
    this.disconnectPeer = fn
  }

  setSubmitRawTransaction(fn: RawTxSubmitter): void {
    this.submitRawTransaction = fn
  }

  async handle(req: IntentRequest): Promise<IntentResult> {
    const { text, spine, lastQuerySlot } = req
    const trimmed = expandSlashCommand(text)
    const querySlot = spine.currentSlot
    const stateHeader = formatEthyStateHeader(spine, lastQuerySlot)

    let widget: WidgetSpec
    let frozenSlashWidget: WidgetSpec | undefined

    if (trimmed.startsWith('/')) {
      const cmd = trimmed.split(/\s+/)[0]?.toLowerCase() ?? ''
      if (cmd === '/simulate') {
        const locked = slashIfLocked('/simulate', spine)
        if (locked !== undefined) {
          widget = locked
        } else if (this.sandbox === undefined) {
          widget = {
            kind: 'key_value',
            title: '/simulate',
            entries: [{ key: 'Error', value: 'EVM sandbox unavailable' }],
          }
        } else {
          widget = await simulateMicroscopeWidget(this.sandbox, trimmed)
          frozenSlashWidget = widget
        }
      } else if (cmd === '/send') {
        const locked = slashIfLocked('/send', spine)
        if (locked !== undefined) {
          widget = locked
        } else if (this.submitRawTransaction === undefined) {
          widget = {
            kind: 'key_value',
            title: '/send',
            entries: [{ key: 'Error', value: 'Transaction pool unavailable' }],
          }
        } else {
          widget = await sendTxWidget(this.submitRawTransaction, trimmed)
          frozenSlashWidget = widget
        }
      } else {
        widget = dispatchSlashWidget(trimmed, {
          spine,
          stateManager: this.stateManager,
          snapStore: this.snapStore,
          disconnectPeer: this.disconnectPeer,
          economy: this.economy,
          chain: this.chain,
        })
      }
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

    const overviewNote =
      widget.kind !== 'domain_help' && 'assistantComment' in widget
        ? widget.assistantComment
        : undefined
    return {
      widget,
      stateHeader,
      querySlot,
      overviewNote,
      frozenSlashWidget,
    }
  }
}
