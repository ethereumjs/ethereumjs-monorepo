import type { ChainConfig } from '@ethereumjs/common'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import type { ContractDossierStore } from '../contracts/contractDossierStore.ts'
import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'
import type { LocalLlmProviderKind } from '../persist/userConfig.ts'
import { aiLogWidget, parseAiLogLimit } from '../tools/aiLogTools.ts'

import type { EthySandbox } from '../evm/sandbox.ts'
import type { AiRuntimeController } from './aiRuntime.ts'
import { DeterministicIntentEngine } from './deterministicEngine.ts'
import type { LlmTransport } from './fixtureEngine.ts'
import type { IntentEngine, IntentRequest, IntentResult } from './intentEngine.ts'
import type { InvestigationJournal } from './investigationJournal.ts'
import { probeLlmHealth } from './llmClient.ts'
import { LocalHttpIntentEngine } from './localHttpEngine.ts'
import { discoverAllLocalModels, matchDiscoveredModel } from './localProviders.ts'
import { DEFAULT_MANAGED_MODEL_SPEC } from './managedModel.ts'
import { expandSlashCommand } from './slashComplete.ts'
import { TurnMemoryRing } from './turnMemory.ts'

export type AiMemoryMode = 'ephemeral' | 'off'

export type HybridIntentEngineOpts = {
  stateManager: FlatStateManager
  snapStore?: SnapPivotStore
  transport?: LlmTransport
  llmBase?: string
  llmModel?: string
  llmProvider?: LocalLlmProviderKind
  memoryMode?: AiMemoryMode
  economy?: ETHEconomyDataManager
  chain?: ChainConfig
  sandbox?: EthySandbox
  journal?: InvestigationJournal
  dataDir?: string
  dossierStore?: ContractDossierStore
}

const AI_OFF_HINT = 'Commands start with / — press Tab for /help, or run /ai to enable a model'

export class HybridIntentEngine implements IntentEngine {
  private readonly stateManager: FlatStateManager
  private readonly snapStore?: SnapPivotStore
  private readonly economy?: ETHEconomyDataManager
  private readonly chain?: ChainConfig
  private readonly sandbox?: EthySandbox
  private readonly journal?: InvestigationJournal
  private readonly dataDir?: string
  private readonly dossierStore?: ContractDossierStore
  private disconnectPeerFn?: (peerId: string) => void
  private readonly deterministic: DeterministicIntentEngine
  private local?: LocalHttpIntentEngine
  private readonly memory: TurnMemoryRing
  private memoryMode: AiMemoryMode
  private llmBase?: string
  private llmProvider?: LocalLlmProviderKind
  private llmHealthy = false
  private lastHealthProbe = 0
  private intentInflight = 0
  private aiRuntime?: AiRuntimeController
  private sessionNoSave = false

  constructor(opts: HybridIntentEngineOpts) {
    this.stateManager = opts.stateManager
    this.snapStore = opts.snapStore
    this.economy = opts.economy
    this.chain = opts.chain
    this.sandbox = opts.sandbox
    this.journal = opts.journal
    this.dataDir = opts.dataDir
    this.dossierStore = opts.dossierStore
    this.memoryMode = opts.memoryMode ?? 'ephemeral'
    this.memory = new TurnMemoryRing()
    this.deterministic = new DeterministicIntentEngine({
      stateManager: opts.stateManager,
      snapStore: opts.snapStore,
      economy: opts.economy,
      chain: opts.chain,
      sandbox: opts.sandbox,
      journal: opts.journal,
      dataDir: opts.dataDir,
      dossierStore: opts.dossierStore,
    })
    this.llmBase = opts.llmBase
    this.llmProvider = opts.llmProvider
    if (opts.transport !== undefined && opts.llmBase !== undefined) {
      this.local = new LocalHttpIntentEngine({
        transport: opts.transport,
        stateManager: opts.stateManager,
        snapStore: opts.snapStore,
        fallback: this.deterministic,
        getTurns: () => (this.memoryMode === 'ephemeral' ? this.memory.snapshot() : []),
        economy: opts.economy,
        chain: opts.chain,
        sandbox: opts.sandbox,
        journal: opts.journal,
      })
    }
  }

  attachAiRuntime(runtime: AiRuntimeController, sessionNoSave: boolean): void {
    this.aiRuntime = runtime
    this.sessionNoSave = sessionNoSave
  }

  setLlmTransport(
    base: string,
    transport: LlmTransport,
    opts?: { model?: string; provider?: LocalLlmProviderKind },
  ): void {
    this.llmBase = base
    this.llmProvider = opts?.provider
    this.llmHealthy = false
    this.lastHealthProbe = 0
    this.local = new LocalHttpIntentEngine({
      transport,
      stateManager: this.stateManager,
      snapStore: this.snapStore,
      disconnectPeer: this.disconnectPeerFn,
      fallback: this.deterministic,
      getTurns: () => (this.memoryMode === 'ephemeral' ? this.memory.snapshot() : []),
      economy: this.economy,
      chain: this.chain,
      sandbox: this.sandbox,
      journal: this.journal,
    })
    void opts?.model
  }

  clearLlmTransport(): void {
    this.llmBase = undefined
    this.llmProvider = undefined
    this.local = undefined
    this.llmHealthy = false
    this.lastHealthProbe = 0
  }

  setDisconnectPeer(fn: (peerId: string) => void): void {
    this.disconnectPeerFn = fn
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
    this.llmHealthy = await probeLlmHealth(this.llmBase, this.llmProvider)
    return this.llmHealthy
  }

  private offModeHintWidget(): IntentResult['widget'] {
    return {
      kind: 'key_value',
      title: 'AI disabled',
      entries: [
        { key: 'Hint', value: AI_OFF_HINT },
        { key: 'Enable', value: '/ai setup · /ai local · /ai default' },
      ],
    }
  }

  private async handleAiCommand(req: IntentRequest, trimmed: string): Promise<IntentResult> {
    const parts = trimmed.split(/\s+/)
    const sub = parts[1]?.toLowerCase()
    const runtime = this.aiRuntime
    const persist = !this.sessionNoSave && !parts.some((p) => p === '--no-save')

    if (sub === undefined || sub === 'setup' || sub === '') {
      return {
        widget: {
          kind: 'ai_onboarding',
          initialOption: runtime?.getConfig().mode === 'off' ? 1 : 0,
          statusNote: 'Change AI mode · saved default applies on next launch unless you override',
        },
        stateHeader: '',
        querySlot: req.spine.currentSlot,
        openOnboarding: true,
      }
    }

    if (sub === 'log' || sub === 'diag') {
      return {
        widget: aiLogWidget(req.spine, this.dataDir, parseAiLogLimit(parts)),
        stateHeader: '',
        querySlot: req.spine.currentSlot,
      }
    }

    if (sub === 'stateless') {
      this.setMemoryMode('off')
      return {
        widget: {
          kind: 'key_value',
          title: 'AI memory',
          entries: [{ key: 'Mode', value: 'stateless (off)' }],
        },
        stateHeader: '',
        querySlot: req.spine.currentSlot,
      }
    }

    if (sub === 'ephemeral') {
      this.setMemoryMode('ephemeral')
      return {
        widget: {
          kind: 'key_value',
          title: 'AI memory',
          entries: [{ key: 'Mode', value: 'ephemeral (3-turn ring)' }],
        },
        stateHeader: '',
        querySlot: req.spine.currentSlot,
      }
    }

    if (sub === 'memory') {
      const onoff = parts[2]?.toLowerCase()
      if (runtime === undefined) {
        return {
          widget: {
            kind: 'key_value',
            title: '/ai memory',
            entries: [{ key: 'Error', value: 'AI runtime unavailable' }],
          },
          stateHeader: '',
          querySlot: req.spine.currentSlot,
        }
      }
      const prev = runtime.getConfig()
      const share =
        onoff === 'on' ? true : onoff === 'off' ? false : (prev.sharePromptHistory ?? false)
      if (onoff === 'on' || onoff === 'off') {
        await runtime.setAiConfig({ ...prev, sharePromptHistory: share }, { persist })
      }
      return {
        widget: {
          kind: 'key_value',
          title: 'Prompt history sharing',
          entries: [
            {
              key: 'sharePromptHistory',
              value: share ? 'on (RAM-only, never saved to disk)' : 'off',
            },
            { key: 'Toggle', value: '/ai memory on | /ai memory off' },
          ],
        },
        stateHeader: '',
        querySlot: req.spine.currentSlot,
      }
    }

    if (runtime === undefined) {
      return {
        widget: {
          kind: 'key_value',
          title: '/ai',
          entries: [{ key: 'Error', value: 'AI runtime unavailable' }],
        },
        stateHeader: '',
        querySlot: req.spine.currentSlot,
      }
    }

    if (sub === 'off') {
      const prev = runtime.getConfig()
      await runtime.setAiConfig({ ...prev, mode: 'off' }, { persist })
      return {
        widget: this.offModeHintWidget(),
        stateHeader: '',
        querySlot: req.spine.currentSlot,
        aiLayoutRefresh: true,
      }
    }

    if (sub === 'default') {
      const prev = runtime.getConfig()
      await runtime.setAiConfig({ ...prev, mode: 'default', memory: this.memoryMode }, { persist })
      return {
        widget: {
          kind: 'key_value',
          title: 'Default model',
          entries: [
            { key: 'Model', value: DEFAULT_MANAGED_MODEL_SPEC.displayName },
            { key: 'Status', value: 'Starting built-in runner (download may follow)' },
          ],
        },
        stateHeader: '',
        querySlot: req.spine.currentSlot,
        aiLayoutRefresh: true,
      }
    }

    if (sub === 'local') {
      const query = parts.slice(2).join(' ').trim()
      const models = await discoverAllLocalModels()
      const hit = query.length > 0 ? matchDiscoveredModel(models, query) : models[0]
      if (hit === undefined) {
        return {
          widget: {
            kind: 'key_value',
            title: '/ai local',
            entries: [
              { key: 'Error', value: 'No local model found' },
              { key: 'Hint', value: 'Start Ollama or pass /ai url http://127.0.0.1:PORT model' },
            ],
          },
          stateHeader: '',
          querySlot: req.spine.currentSlot,
        }
      }
      await runtime.setAiConfig(
        {
          mode: 'local',
          localProvider: hit.provider,
          baseUrl: hit.baseUrl,
          model: hit.modelId,
          memory: this.memoryMode,
        },
        { persist },
      )
      return {
        widget: {
          kind: 'key_value',
          title: 'Local model',
          entries: [
            { key: 'Provider', value: hit.label },
            { key: 'Saved', value: persist ? 'yes' : 'session only' },
          ],
        },
        stateHeader: '',
        querySlot: req.spine.currentSlot,
        aiLayoutRefresh: true,
      }
    }

    if (sub === 'url') {
      const url = parts[2]
      const model = parts[3]
      if (url === undefined) {
        return {
          widget: {
            kind: 'key_value',
            title: '/ai url',
            entries: [{ key: 'Usage', value: '/ai url http://127.0.0.1:PORT [model]' }],
          },
          stateHeader: '',
          querySlot: req.spine.currentSlot,
        }
      }
      await runtime.setAiConfig(
        {
          mode: 'local',
          localProvider: 'openai-compatible',
          baseUrl: url,
          model,
          memory: this.memoryMode,
        },
        { persist },
      )
      return {
        widget: {
          kind: 'key_value',
          title: 'Local LLM URL',
          entries: [
            { key: 'URL', value: url },
            { key: 'Model', value: model ?? '(server default)' },
          ],
        },
        stateHeader: '',
        querySlot: req.spine.currentSlot,
        aiLayoutRefresh: true,
      }
    }

    return {
      widget: {
        kind: 'key_value',
        title: '/ai',
        entries: [
          {
            key: 'Commands',
            value: 'log · off · local · default · setup · url · ephemeral · stateless',
          },
        ],
      },
      stateHeader: '',
      querySlot: req.spine.currentSlot,
    }
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
      return this.handleAiCommand(req, trimmed)
    }

    if (trimmed.startsWith('/')) {
      return this.deterministic.handle(req)
    }

    if (req.spine.aiMode === 'off') {
      return {
        widget: this.offModeHintWidget(),
        stateHeader: '',
        querySlot: req.spine.currentSlot,
      }
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
