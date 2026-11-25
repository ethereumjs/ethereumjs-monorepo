import * as fs from 'node:fs'

import type { EthyNode } from '../core/createEthyNode.ts'
import type { EthyAiConfig } from '../persist/userConfig.ts'
import { writeUserConfig } from '../persist/userConfig.ts'
import { deriveCapabilities } from '../spine/createSpine.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import type { EthySpine, ManagedAiPhase } from '../spine/types.ts'
import { FetchLlmTransport, type LlmTransport, RecordingTransport } from './fixtureEngine.ts'
import type { HybridIntentEngine } from './hybridEngine.ts'
import { assertLlmBaseUrl, normalizeLlmBase, probeLlmHealth } from './llmClient.ts'
import { DEFAULT_OLLAMA_BASE } from './localProviders.ts'
import { modelBootstrapNote } from './managedAiUi.ts'
import { type ManagedModelRunner, createManagedModelRunner } from './managedRunner.ts'

export type ManagedAiRuntimeSnapshot = {
  phase: ManagedAiPhase
  bootstrapNote?: string
}

export type AiRuntimeController = {
  getConfig(): EthyAiConfig
  setAiConfig(next: EthyAiConfig, opts?: { persist?: boolean }): Promise<void>
  refreshAiCapability(): Promise<void>
  subscribe(listener: (snap: ManagedAiRuntimeSnapshot) => void): () => void
  getManagedSnapshot(): ManagedAiRuntimeSnapshot | undefined
  wakeIfDeferred(): void
  stop(): Promise<void>
}

function applyAiModeToSpine(spine: EthySpine, config: EthyAiConfig): void {
  spine.aiMode = config.mode
  spine.sharePromptHistory = config.sharePromptHistory === true
  if (config.mode === 'off') {
    spine.llmPulseReady = false
    spine.managedAi = undefined
    spine.capabilities.ai = { status: 'locked', label: 'No AI' }
    return
  }
  deriveCapabilities(spine)
}

function buildTransport(
  config: EthyAiConfig,
  recordFixturePath: string | undefined,
): { base: string; transport: LlmTransport } | undefined {
  if (config.mode === 'off' || config.mode === 'default') return undefined
  const baseUrl =
    config.baseUrl ?? (config.localProvider === 'ollama' ? DEFAULT_OLLAMA_BASE : undefined)
  if (baseUrl === undefined) return undefined
  const parsed = assertLlmBaseUrl(baseUrl, config.allowRemote === true)
  const base = normalizeLlmBase(parsed)
  let transport: LlmTransport = new FetchLlmTransport(base, {
    model: config.model,
    provider: config.localProvider,
  })
  if (recordFixturePath !== undefined) {
    transport = new RecordingTransport(transport, (line) => {
      fs.appendFileSync(recordFixturePath, `${line}\n`)
    })
  }
  return { base, transport }
}

export function createAiRuntimeController(opts: {
  node: EthyNode
  dataDir?: string
  initial: EthyAiConfig
  recordFixturePath?: string
  sessionNoSave: boolean
}): AiRuntimeController {
  let current = { ...opts.initial }
  let epoch = 0
  let runner: ManagedModelRunner | undefined
  let downloadAbort: AbortController | undefined
  const listeners = new Set<(snap: ManagedAiRuntimeSnapshot) => void>()

  const snapshotFromSpine = (): ManagedAiRuntimeSnapshot | undefined => {
    const spine = opts.node.spine
    if (spine.aiMode !== 'default') return undefined
    const phase = spine.managedAi?.phase ?? 'idle'
    return {
      phase,
      bootstrapNote: modelBootstrapNote(spine.managedAi),
    }
  }

  const notify = () => {
    const snap = snapshotFromSpine()
    if (snap === undefined) return
    for (const l of listeners) l(snap)
  }

  const stopManagedRunner = async (): Promise<void> => {
    downloadAbort?.abort()
    downloadAbort = undefined
    if (runner !== undefined) {
      await runner.stop()
      runner = undefined
    }
  }

  const startManagedRunner = (): void => {
    const myEpoch = epoch
    downloadAbort = new AbortController()
    runner = createManagedModelRunner({
      dataDir: opts.dataDir,
      spine: opts.node.spine,
      signal: downloadAbort.signal,
      getEpoch: () => epoch,
      onPhase: (update) => {
        if (epoch !== myEpoch) return
        const spine = opts.node.spine
        const detail = update.model !== undefined ? ` model=${update.model}` : ''
        recordDiagnostic(spine, {
          subsystem: 'ai',
          severity: update.phase === 'needs-runner' ? 'warn' : 'info',
          message: `managed-ai phase=${update.phase}${detail}`,
        })
        if (
          update.phase === 'ready' &&
          update.transport !== undefined &&
          update.base !== undefined
        ) {
          spine.managedAi = { phase: 'ready' }
          spine.llmPulseReady = true
          deriveCapabilities(spine)
          let transport: LlmTransport = update.transport
          if (opts.recordFixturePath !== undefined) {
            transport = new RecordingTransport(transport, (line) => {
              fs.appendFileSync(opts.recordFixturePath!, `${line}\n`)
            })
          }
          opts.node.llm = { base: update.base, transport }
          opts.node.hybridEngine?.setLlmTransport(update.base, transport, {
            model: update.model,
            provider: update.provider,
          })
        }
        if (update.phase === 'needs-runner') {
          opts.node.llm = undefined
          opts.node.hybridEngine?.clearLlmTransport()
          spine.llmPulseReady = false
        }
        notify()
      },
    })
    void runner.start().then(() => notify())
  }

  const rewireLlm = async (config: EthyAiConfig): Promise<void> => {
    const hybrid = opts.node.hybridEngine as HybridIntentEngine | undefined
    const spine = opts.node.spine
    if (config.memory !== undefined) {
      hybrid?.setMemoryMode(config.memory)
    }
    epoch += 1
    await stopManagedRunner()

    if (config.mode === 'off') {
      opts.node.llm = undefined
      hybrid?.clearLlmTransport()
      applyAiModeToSpine(spine, config)
      notify()
      return
    }
    if (config.mode === 'default') {
      opts.node.llm = undefined
      hybrid?.clearLlmTransport()
      applyAiModeToSpine(spine, config)
      spine.managedAi = { phase: 'probing' }
      recordDiagnostic(spine, {
        subsystem: 'ai',
        severity: 'info',
        message: 'managed-ai phase=probing',
      })
      deriveCapabilities(spine)
      startManagedRunner()
      notify()
      return
    }
    spine.managedAi = undefined
    const wired = buildTransport(config, opts.recordFixturePath)
    if (wired === undefined) {
      opts.node.llm = undefined
      hybrid?.clearLlmTransport()
      applyAiModeToSpine(spine, config)
      notify()
      return
    }
    opts.node.llm = wired
    hybrid?.setLlmTransport(wired.base, wired.transport, {
      model: config.model,
      provider: config.localProvider,
    })
    spine.aiMode = 'local'
    const healthy = await probeLlmHealth(wired.base, config.localProvider)
    spine.llmPulseReady = healthy
    recordDiagnostic(spine, {
      subsystem: 'ai',
      severity: healthy ? 'info' : 'warn',
      message: `local-llm health=${healthy ? 'ok' : 'fail'} base=${wired.base}`,
    })
    deriveCapabilities(spine)
    notify()
  }

  return {
    getConfig: () => ({ ...current }),
    subscribe(listener) {
      listeners.add(listener)
      const snap = snapshotFromSpine()
      if (snap !== undefined) listener(snap)
      return () => listeners.delete(listener)
    },
    getManagedSnapshot: snapshotFromSpine,
    async setAiConfig(next, setOpts) {
      current = { ...next }
      const persist = setOpts?.persist === true && !opts.sessionNoSave
      if (persist) {
        writeUserConfig(opts.dataDir, current)
      }
      await rewireLlm(current)
    },
    async refreshAiCapability() {
      const base = opts.node.llm?.base
      if (base === undefined || current.mode === 'off') return
      if (current.mode === 'default') return
      const healthy = await probeLlmHealth(base, current.localProvider)
      opts.node.spine.llmPulseReady = healthy
      deriveCapabilities(opts.node.spine)
    },
    wakeIfDeferred() {
      if (opts.node.spine.managedAi?.phase === 'deferred') {
        void runner?.wakeIfDeferred()
      }
    },
    async stop() {
      epoch += 1
      await stopManagedRunner()
    },
  }
}
