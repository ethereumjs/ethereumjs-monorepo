import * as fs from 'node:fs'

import type { EthyNode } from '../core/createEthyNode.ts'
import type { EthyAiConfig, EthyAiMode } from '../persist/userConfig.ts'
import { writeUserConfig } from '../persist/userConfig.ts'
import { deriveCapabilities } from '../spine/createSpine.ts'
import type { EthySpine } from '../spine/types.ts'
import { FetchLlmTransport, type LlmTransport, RecordingTransport } from './fixtureEngine.ts'
import type { HybridIntentEngine } from './hybridEngine.ts'
import { assertLlmBaseUrl, normalizeLlmBase, probeLlmHealth } from './llmClient.ts'
import { DEFAULT_OLLAMA_BASE } from './localProviders.ts'

export type AiRuntimeController = {
  getConfig(): EthyAiConfig
  setAiConfig(next: EthyAiConfig, opts?: { persist?: boolean }): Promise<void>
  refreshAiCapability(): Promise<void>
}

function applyAiModeToSpine(spine: EthySpine, config: EthyAiConfig): void {
  spine.aiMode = config.mode
  spine.sharePromptHistory = config.sharePromptHistory === true
  if (config.mode === 'off') {
    spine.llmPulseReady = false
    spine.capabilities.ai = { status: 'locked', label: 'No AI' }
    return
  }
  deriveCapabilities(spine)
}

function buildTransport(
  config: EthyAiConfig,
  recordFixturePath: string | undefined,
  existing?: LlmTransport,
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
  void existing
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

  const rewireLlm = async (config: EthyAiConfig): Promise<void> => {
    const hybrid = opts.node.hybridEngine
    const spine = opts.node.spine
    if (config.memory !== undefined) {
      hybrid?.setMemoryMode(config.memory)
    }
    if (config.mode === 'off') {
      opts.node.llm = undefined
      hybrid?.clearLlmTransport()
      applyAiModeToSpine(spine, config)
      return
    }
    if (config.mode === 'default') {
      opts.node.llm = undefined
      hybrid?.clearLlmTransport()
      applyAiModeToSpine(spine, config)
      spine.capabilities.ai = { status: 'partial', label: 'Default (WP-10d)' }
      return
    }
    const wired = buildTransport(config, opts.recordFixturePath)
    if (wired === undefined) {
      opts.node.llm = undefined
      hybrid?.clearLlmTransport()
      applyAiModeToSpine(spine, config)
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
    deriveCapabilities(spine)
  }

  return {
    getConfig: () => ({ ...current }),
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
      if (base === undefined || current.mode !== 'local') return
      const healthy = await probeLlmHealth(base, current.localProvider)
      opts.node.spine.llmPulseReady = healthy
      deriveCapabilities(opts.node.spine)
    },
  }
}
