import { type ChildProcess, spawn } from 'node:child_process'
import * as net from 'node:net'

import { deriveCapabilities } from '../spine/createSpine.ts'
import type { EthySpine } from '../spine/types.ts'
import type { ManagedAiPhase, ManagedAiState } from '../spine/types.ts'
import { FetchLlmTransport, type LlmTransport } from './fixtureEngine.ts'
import { resolveLlamaServerBin, spawnLlamaServerCommand } from './llamaServerBin.ts'
import { probeLlmHealth } from './llmClient.ts'
import { discoverOllamaModels } from './localProviders.ts'
import {
  DEFAULT_MANAGED_MODEL_SPEC,
  type ManagedModelSpec,
  findOllamaBridgeModel,
} from './managedModel.ts'
import { ModelDownloadAbortedError, ensureManagedModel } from './modelStore.ts'
import {
  NodeLlamaCppTransport,
  type TryImportNodeLlamaCpp,
  tryImportNodeLlamaCpp,
} from './nodeLlamaCppAdapter.ts'

export type ManagedRunnerPhaseUpdate = {
  phase: ManagedAiPhase
  transport?: LlmTransport
  base?: string
  model?: string
  provider?: 'openai-compatible' | 'ollama'
}

export type CreateManagedModelRunnerOpts = {
  spec?: ManagedModelSpec
  dataDir?: string
  spine: EthySpine
  signal?: AbortSignal
  getEpoch: () => number
  onPhase: (update: ManagedRunnerPhaseUpdate) => void
  tryImport?: TryImportNodeLlamaCpp
  resolveBin?: () => string | undefined
  discoverOllama?: typeof discoverOllamaModels
  ensureModel?: typeof ensureManagedModel
}

const HEALTH_POLL_MS = 200
const HEALTH_TIMEOUT_MS = 15_000

function allocFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const s = net.createServer()
    s.listen(0, '127.0.0.1', () => {
      const addr = s.address()
      const port = typeof addr === 'object' && addr !== null ? addr.port : 0
      s.close((err) => {
        if (err !== undefined) reject(err)
        else resolve(port)
      })
    })
    s.on('error', reject)
  })
}

function setManagedPhase(spine: EthySpine, patch: Partial<ManagedAiState>): void {
  spine.managedAi = { ...(spine.managedAi ?? { phase: 'idle' }), ...patch }
  deriveCapabilities(spine)
}

export type ManagedModelRunner = {
  start(): Promise<void>
  stop(): Promise<void>
}

export function createManagedModelRunner(opts: CreateManagedModelRunnerOpts): ManagedModelRunner {
  const spec = opts.spec ?? DEFAULT_MANAGED_MODEL_SPEC
  const tryImport = opts.tryImport ?? tryImportNodeLlamaCpp
  const resolveBin = opts.resolveBin ?? resolveLlamaServerBin
  const discoverOllama = opts.discoverOllama ?? discoverOllamaModels
  const ensureModel = opts.ensureModel ?? ensureManagedModel

  let child: ChildProcess | undefined
  let inProc: NodeLlamaCppTransport | undefined
  let startEpoch = 0
  let stopped = true

  const stale = () => stopped || opts.getEpoch() !== startEpoch

  const stopChild = async (): Promise<void> => {
    const proc = child
    child = undefined
    if (proc === undefined) return
    proc.kill('SIGTERM')
    await new Promise<void>((resolve) => {
      const timer = setTimeout(() => {
        try {
          proc.kill('SIGKILL')
        } catch {
          // ignore
        }
        resolve()
      }, 2000)
      proc.once('exit', () => {
        clearTimeout(timer)
        resolve()
      })
    })
  }

  const stopAll = async (): Promise<void> => {
    stopped = true
    await stopChild()
    if (inProc !== undefined) {
      await inProc.dispose()
      inProc = undefined
    }
  }

  const pollHealth = async (base: string, signal?: AbortSignal): Promise<boolean> => {
    const deadline = Date.now() + HEALTH_TIMEOUT_MS
    while (Date.now() < deadline) {
      if (stale() || signal?.aborted === true) return false
      if (await probeLlmHealth(base, 'openai-compatible', signal)) return true
      await new Promise((r) => setTimeout(r, HEALTH_POLL_MS))
    }
    return false
  }

  const startLlamaChild = async (modelPath: string, signal?: AbortSignal): Promise<boolean> => {
    const bin = resolveBin()
    if (bin === undefined) return false
    const port = await allocFreePort()
    const { command, args } = spawnLlamaServerCommand(bin, modelPath, port)
    const proc = spawn(command, args, { stdio: 'ignore' })
    child = proc
    const base = `http://127.0.0.1:${port}`
    const ok = await pollHealth(base, signal)
    if (!ok) {
      await stopChild()
      return false
    }
    if (stale()) return false
    setManagedPhase(opts.spine, { phase: 'ready' })
    opts.onPhase({
      phase: 'ready',
      transport: new FetchLlmTransport(base, {
        model: spec.id,
        provider: 'openai-compatible',
      }),
      base,
      model: spec.id,
      provider: 'openai-compatible',
    })
    return true
  }

  const tryOllamaBridge = async (): Promise<boolean> => {
    const models = await discoverOllama()
    const bridge = findOllamaBridgeModel(models.map((m) => m.modelId))
    if (bridge === undefined) return false
    const hit = models.find((m) => m.modelId === bridge)
    if (hit === undefined) return false
    if (stale()) return false
    setManagedPhase(opts.spine, {
      phase: 'ready',
      label: `Ollama ${hit.modelId}`,
    })
    opts.onPhase({
      phase: 'ready',
      transport: new FetchLlmTransport(hit.baseUrl, {
        model: hit.modelId,
        provider: 'ollama',
      }),
      base: hit.baseUrl,
      model: hit.modelId,
      provider: 'ollama',
    })
    return true
  }

  return {
    async start(): Promise<void> {
      await stopAll()
      stopped = false
      startEpoch = opts.getEpoch()
      setManagedPhase(opts.spine, { phase: 'probing', detail: undefined })

      const nodeMod = await tryImport()
      const hasBin = resolveBin() !== undefined
      const canGguf = nodeMod !== undefined || hasBin

      if (!canGguf) {
        if (await tryOllamaBridge()) return
        setManagedPhase(opts.spine, {
          phase: 'needs-runner',
          detail:
            'Install llama.cpp (brew install llama.cpp) for built-in Qwen3.5-2B, or run ollama pull qwen3.5:2b',
        })
        opts.onPhase({ phase: 'needs-runner' })
        return
      }

      try {
        setManagedPhase(opts.spine, {
          phase: 'downloading',
          progressPct: 0,
          downloadedBytes: 0,
          totalBytes: spec.expectedBytes,
        })
        const modelPath = await ensureModel(spec, {
          dataDir: opts.dataDir,
          signal: opts.signal,
          onProgress: (p) => {
            if (stale()) return
            setManagedPhase(opts.spine, {
              phase: 'downloading',
              progressPct: p.pct,
              downloadedBytes: p.downloadedBytes,
              totalBytes: p.totalBytes,
            })
          },
        })
        if (stale()) return

        setManagedPhase(opts.spine, { phase: 'warming', progressPct: undefined })

        if (nodeMod !== undefined) {
          inProc = new NodeLlamaCppTransport(nodeMod, modelPath)
          if (stale()) return
          setManagedPhase(opts.spine, { phase: 'ready' })
          opts.onPhase({
            phase: 'ready',
            transport: inProc,
            base: 'node-llama-cpp',
            model: spec.id,
            provider: 'openai-compatible',
          })
          return
        }

        if (await startLlamaChild(modelPath, opts.signal)) return
        await stopChild()
        if (await tryOllamaBridge()) return

        setManagedPhase(opts.spine, {
          phase: 'needs-runner',
          detail:
            'Install llama.cpp (brew install llama.cpp) for built-in Qwen3.5-2B, or run ollama pull qwen3.5:2b',
        })
        opts.onPhase({ phase: 'needs-runner' })
      } catch (e) {
        if (e instanceof ModelDownloadAbortedError || stale()) return
        if (await tryOllamaBridge()) return
        setManagedPhase(opts.spine, {
          phase: 'needs-runner',
          detail: e instanceof Error ? e.message : 'Default model failed',
        })
        opts.onPhase({ phase: 'needs-runner' })
      }
    },
    async stop(): Promise<void> {
      await stopAll()
      opts.spine.managedAi = undefined
      deriveCapabilities(opts.spine)
    },
  }
}
