import type { ChainConfig } from '@ethereumjs/common'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'

import type { EthySandbox } from '../evm/sandbox.ts'
import { DeterministicIntentEngine } from './deterministicEngine.ts'
import type { LlmTransport } from './fixtureEngine.ts'
import type { IntentEngine, IntentRequest, IntentResult } from './intentEngine.ts'
import { probeLlmHealth } from './llmClient.ts'
import { LocalHttpIntentEngine } from './localHttpEngine.ts'
import { expandSlashCommand } from './slashComplete.ts'
import { TurnMemoryRing } from './turnMemory.ts'

export type AiMemoryMode = 'ephemeral' | 'off'

export type HybridIntentEngineOpts = {
  stateManager: FlatStateManager
  snapStore?: SnapPivotStore
  transport?: LlmTransport
  llmBase?: string
  memoryMode?: AiMemoryMode
  economy?: ETHEconomyDataManager
  chain?: ChainConfig
  sandbox?: EthySandbox
}

export class HybridIntentEngine implements IntentEngine {
  private readonly deterministic: DeterministicIntentEngine
  private readonly local?: LocalHttpIntentEngine
  private readonly memory: TurnMemoryRing
  private memoryMode: AiMemoryMode
  private readonly llmBase?: string
  private llmHealthy = false
  private lastHealthProbe = 0
  private intentInflight = 0

  constructor(opts: HybridIntentEngineOpts) {
    this.memoryMode = opts.memoryMode ?? 'ephemeral'
    this.memory = new TurnMemoryRing()
    this.deterministic = new DeterministicIntentEngine({
      stateManager: opts.stateManager,
      snapStore: opts.snapStore,
      economy: opts.economy,
      chain: opts.chain,
      sandbox: opts.sandbox,
    })
    this.llmBase = opts.llmBase
    if (opts.transport !== undefined) {
      this.local = new LocalHttpIntentEngine({
        transport: opts.transport,
        stateManager: opts.stateManager,
        snapStore: opts.snapStore,
        fallback: this.deterministic,
        getTurns: () => (this.memoryMode === 'ephemeral' ? this.memory.snapshot() : []),
        economy: opts.economy,
        chain: opts.chain,
      })
    }
  }

  setDisconnectPeer(fn: (peerId: string) => void): void {
    this.deterministic.setDisconnectPeer(fn)
    this.local?.setDisconnectPeer(fn)
  }

  setSubmitRawTransaction(
    fn: (hex: string) => Promise<{ result: string } | { error: { message: string } }>,
  ): void {
    this.deterministic.setSubmitRawTransaction(fn)
  }

  clearMemory(): void {
    this.memory.clear()
  }

  setMemoryMode(mode: AiMemoryMode): void {
    this.memoryMode = mode
    if (mode === 'off') {
      this.memory.clear()
    }
  }

  getMemoryMode(): AiMemoryMode {
    return this.memoryMode
  }

  noteIntentInflight(delta: number): void {
    this.intentInflight = Math.max(0, this.intentInflight + delta)
  }

  isIntentInflight(): boolean {
    return this.intentInflight > 0
  }

  private async ensureHealth(): Promise<boolean> {
    if (this.local === undefined || this.llmBase === undefined) return false
    const now = Date.now()
    if (now - this.lastHealthProbe < 5_000) {
      return this.llmHealthy
    }
    this.lastHealthProbe = now
    this.llmHealthy = await probeLlmHealth(this.llmBase)
    return this.llmHealthy
  }

  async handle(req: IntentRequest): Promise<IntentResult> {
    const trimmed = expandSlashCommand(req.text)
    const lower = trimmed.toLowerCase()

    if (lower === '/clear') {
      this.memory.clear()
      return {
        widget: {
          kind: 'key_value',
          title: 'AI memory cleared',
          entries: [{ key: 'Turns', value: '0' }],
        },
        stateHeader: '',
        querySlot: req.spine.currentSlot,
      }
    }

    if (lower.startsWith('/ai')) {
      const parts = trimmed.split(/\s+/)
      const sub = parts[1]?.toLowerCase()
      if (sub === 'stateless' || sub === 'off') {
        this.setMemoryMode('off')
      } else if (sub === 'ephemeral') {
        this.setMemoryMode('ephemeral')
      }
      return {
        widget: {
          kind: 'key_value',
          title: 'AI memory',
          entries: [{ key: 'Mode', value: this.memoryMode }],
        },
        stateHeader: '',
        querySlot: req.spine.currentSlot,
      }
    }

    if (trimmed.startsWith('/')) {
      return this.deterministic.handle(req)
    }

    const healthy = await this.ensureHealth()
    if (this.local !== undefined && healthy) {
      const result = await this.local.handle(req)
      if (this.memoryMode === 'ephemeral' && !req.text.trim().startsWith('/')) {
        const toolCalled =
          result.viewTitle ??
          (result.widget.kind === 'table' ? result.widget.title : undefined) ??
          'view'
        this.memory.push({
          userQuery: req.text.trim(),
          viewTitle: result.viewTitle ?? toolCalled,
          toolCalled: String(toolCalled),
        })
      }
      return result
    }

    const fallbackResult = await this.deterministic.handle(req)
    if (this.memoryMode === 'ephemeral' && !req.text.trim().startsWith('/')) {
      const toolCalled =
        fallbackResult.viewTitle ??
        (fallbackResult.widget.kind === 'table'
          ? fallbackResult.widget.title
          : fallbackResult.widget.kind === 'key_value'
            ? fallbackResult.widget.title
            : undefined) ??
        'view'
      this.memory.push({
        userQuery: req.text.trim(),
        viewTitle: fallbackResult.viewTitle ?? toolCalled,
        toolCalled: String(toolCalled),
      })
    }
    return fallbackResult
  }
}
