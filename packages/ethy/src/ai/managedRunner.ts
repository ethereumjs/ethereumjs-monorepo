import { type ChildProcess, spawn } from 'node:child_process'
import * as fs from 'node:fs'
import * as net from 'node:net'
import * as path from 'node:path'

import { deriveCapabilities } from '../spine/createSpine.ts'
import type { EthySpine, ManagedAiPhase, ManagedAiState } from '../spine/types.ts'
import { llamaServerLogPath } from './aiRunTrace.ts'
import { FetchLlmTransport, type LlmTransport } from './fixtureEngine.ts'
import {
  ensureLlamaServerBin,
  llamaServerAssetForPlatform,
  resolveLlamaServerBin,
  spawnLlamaServerCommand,
} from './llamaServerBin.ts'
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
  resolveBin?: (dataDir?: string) => string | undefined
  ensureBin?: typeof ensureLlamaServerBin
  discoverOllama?: typeof discoverOllamaModels
  ensureModel?: typeof ensureManagedModel
  /** Defer spawning llama-server (~2.5 GB RAM) while `SNAP_SYNCING` (default true). */
  deferWhileSyncing?: boolean
}

const HEALTH_POLL_MS = 250
const HEALTH_TIMEOUT_MS = 45_000
const SYNC_DOWNLOAD_RATE_LIMIT = '8M'

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

async function probeLlamaServerReady(base: string, signal?: AbortSignal): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 1_500)
    const onAbort = () => controller.abort()
    signal?.addEventListener('abort', onAbort)
    try {
      const res = await fetch(`${base}/health`, { method: 'GET', signal: controller.signal })
      if (res.status === 200) return true
      if (res.status === 503) return false
    } finally {
      clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
    }
  } catch {
    // fall through to /v1/models probe
  }
  return probeLlmHealth(base, 'openai-compatible', signal)
}

export type ManagedModelRunner = {
  start(): Promise<void>
  wakeIfDeferred(): Promise<void>
  stop(): Promise<void>
}

export function createManagedModelRunner(opts: CreateManagedModelRunnerOpts): ManagedModelRunner {
  const spec = opts.spec ?? DEFAULT_MANAGED_MODEL_SPEC
  const tryImport = opts.tryImport ?? tryImportNodeLlamaCpp
  const resolveBin = opts.resolveBin ?? resolveLlamaServerBin
  const ensureBin = opts.ensureBin ?? ensureLlamaServerBin
  const discoverOllama = opts.discoverOllama ?? discoverOllamaModels
  const ensureModel = opts.ensureModel ?? ensureManagedModel
  const deferWhileSyncing = opts.deferWhileSyncing !== false

  let child: ChildProcess | undefined
  let exitKillHandler: (() => void) | undefined
  let inProc: NodeLlamaCppTransport | undefined
  let deferredPayload:
    | {
        nodeMod: Awaited<ReturnType<TryImportNodeLlamaCpp>>
        llamaBin?: string
        modelPath: string
      }
    | undefined
  let startEpoch = 0
  let stopped = true

  const stale = () => stopped || opts.getEpoch() !== startEpoch

  const clearExitHook = () => {
    if (exitKillHandler !== undefined) {
      process.off('exit', exitKillHandler)
      exitKillHandler = undefined
    }
  }

  const stopChild = async (): Promise<void> => {
    const proc = child
    child = undefined
    clearExitHook()
    if (proc === undefined) return
    if (proc.exitCode !== null || proc.killed) return
    try {
      proc.kill('SIGTERM')
    } catch {
      return
    }
    await new Promise<void>((resolve) => {
      const timer = setTimeout(() => {
        try {
          proc.kill('SIGKILL')
        } catch {
          // ignore
        }
        resolve()
      }, 2000)
      timer.unref?.()
      proc.once('exit', () => {
        clearTimeout(timer)
        resolve()
      })
    })
  }

  const stopAll = async (): Promise<void> => {
    stopped = true
    deferredPayload = undefined
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
      if (child !== undefined && child.exitCode !== null) return false
      if (await probeLlamaServerReady(base, signal)) return true
      await new Promise((r) => setTimeout(r, HEALTH_POLL_MS))
    }
    return false
  }

  const startLlamaChild = async (
    bin: string,
    modelPath: string,
    signal?: AbortSignal,
  ): Promise<boolean> => {
    const port = await allocFreePort()
    const { command, args, cwd, env } = spawnLlamaServerCommand(bin, modelPath, port)
    let llamaLogFd: number | undefined
    if (opts.dataDir !== undefined) {
      const logPath = llamaServerLogPath(opts.dataDir, opts.spine.network)
      try {
        fs.mkdirSync(path.dirname(logPath), { recursive: true })
        llamaLogFd = fs.openSync(logPath, 'a')
      } catch {
        llamaLogFd = undefined
      }
    }
    const proc = spawn(command, args, {
      stdio: llamaLogFd !== undefined ? ['ignore', 'ignore', llamaLogFd] : 'ignore',
      cwd,
      env,
    })
    child = proc
    exitKillHandler = () => {
      try {
        proc.kill('SIGTERM')
      } catch {
        // ignore
      }
    }
    process.once('exit', exitKillHandler)
    const base = `http://127.0.0.1:${port}`
    const ok = await pollHealth(base, signal)
    if (!ok) {
      await stopChild()
      return false
    }
    if (stale()) {
      await stopChild()
      return false
    }
    setManagedPhase(opts.spine, { phase: 'ready', label: 'Qwen3.5-2B' })
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
      opts.onPhase({ phase: 'probing' })

      const nodeMod = await tryImport()
      let llamaBin = resolveBin(opts.dataDir)
      const canAutoBootstrap =
        opts.ensureBin !== undefined ||
        (opts.resolveBin === undefined && llamaServerAssetForPlatform() !== undefined)
      const canGguf = nodeMod !== undefined || llamaBin !== undefined || canAutoBootstrap

      if (!canGguf) {
        if (await tryOllamaBridge()) return
        setManagedPhase(opts.spine, {
          phase: 'needs-runner',
          detail:
            'No prebuilt runner for this platform — install llama.cpp on PATH or run ollama pull qwen3.5:2b',
        })
        opts.onPhase({ phase: 'needs-runner' })
        return
      }

      try {
        if (nodeMod === undefined && llamaBin === undefined) {
          const asset = llamaServerAssetForPlatform()
          setManagedPhase(opts.spine, {
            phase: 'downloading',
            label: 'llama-server runner',
            progressPct: 0,
            downloadedBytes: 0,
            totalBytes: asset?.expectedBytes ?? 18_000_000,
          })
          opts.onPhase({ phase: 'downloading' })
          llamaBin = await ensureBin({
            dataDir: opts.dataDir,
            signal: opts.signal,
            onProgress: (p) => {
              if (stale()) return
              setManagedPhase(opts.spine, {
                phase: 'downloading',
                label: 'llama-server runner',
                progressPct: p.pct,
                downloadedBytes: p.downloadedBytes,
                totalBytes: p.totalBytes,
                bytesPerSec: p.bytesPerSec,
              })
              opts.onPhase({ phase: 'downloading' })
            },
          })
          if (stale()) return
          if (llamaBin === undefined) {
            if (await tryOllamaBridge()) return
            setManagedPhase(opts.spine, {
              phase: 'needs-runner',
              detail:
                'Could not install llama-server automatically — install llama.cpp or run ollama pull qwen3.5:2b',
            })
            opts.onPhase({ phase: 'needs-runner' })
            return
          }
        }

        setManagedPhase(opts.spine, {
          phase: 'downloading',
          label: 'Qwen3.5-2B',
          progressPct: 0,
          downloadedBytes: 0,
          totalBytes: spec.expectedBytes,
        })
        opts.onPhase({ phase: 'downloading' })
        const isHeavySync =
          opts.spine.phase === 'SNAP_SYNCING' || opts.spine.phase === 'BAL_CATCHUP'
        const modelPath = await ensureModel(spec, {
          dataDir: opts.dataDir,
          signal: opts.signal,
          rateLimit: isHeavySync ? SYNC_DOWNLOAD_RATE_LIMIT : undefined,
          onProgress: (p) => {
            if (stale()) return
            setManagedPhase(opts.spine, {
              phase: 'downloading',
              label: 'Qwen3.5-2B',
              progressPct: p.pct,
              downloadedBytes: p.downloadedBytes,
              totalBytes: p.totalBytes,
              bytesPerSec: p.bytesPerSec,
            })
            opts.onPhase({ phase: 'downloading' })
          },
        })
        if (stale()) return

        const warmUpModel = async (payload: {
          nodeMod: Awaited<ReturnType<TryImportNodeLlamaCpp>>
          llamaBin?: string
          modelPath: string
        }): Promise<void> => {
          if (stale()) return
          setManagedPhase(opts.spine, {
            phase: 'warming',
            label: 'Qwen3.5-2B',
            progressPct: undefined,
            bytesPerSec: undefined,
          })
          opts.onPhase({ phase: 'warming' })

          if (payload.nodeMod !== undefined) {
            inProc = new NodeLlamaCppTransport(payload.nodeMod, payload.modelPath)
            if (stale()) return
            setManagedPhase(opts.spine, { phase: 'ready', label: 'Qwen3.5-2B' })
            opts.onPhase({
              phase: 'ready',
              transport: inProc,
              base: 'node-llama-cpp',
              model: spec.id,
              provider: 'openai-compatible',
            })
            return
          }

          if (
            payload.llamaBin !== undefined &&
            (await startLlamaChild(payload.llamaBin, payload.modelPath, opts.signal))
          ) {
            return
          }
          await stopChild()
          if (await tryOllamaBridge()) return

          setManagedPhase(opts.spine, {
            phase: 'needs-runner',
            detail:
              'llama-server did not become healthy — try /ai local or run ollama pull qwen3.5:2b',
          })
          opts.onPhase({ phase: 'needs-runner' })
        }

        if (deferWhileSyncing && opts.spine.phase === 'SNAP_SYNCING') {
          deferredPayload = { nodeMod, llamaBin, modelPath }
          setManagedPhase(opts.spine, {
            phase: 'deferred',
            label: 'Qwen3.5-2B',
            progressPct: undefined,
            bytesPerSec: undefined,
          })
          opts.onPhase({ phase: 'deferred' })
          return
        }

        await warmUpModel({ nodeMod, llamaBin, modelPath })
      } catch (e) {
        if (e instanceof ModelDownloadAbortedError || opts.signal?.aborted === true || stale()) {
          return
        }
        if (await tryOllamaBridge()) return
        setManagedPhase(opts.spine, {
          phase: 'needs-runner',
          detail: e instanceof Error ? e.message : 'Default model setup failed',
        })
        opts.onPhase({ phase: 'needs-runner' })
      }
    },
    async wakeIfDeferred(): Promise<void> {
      const payload = deferredPayload
      if (payload === undefined || stale()) return
      deferredPayload = undefined
      setManagedPhase(opts.spine, {
        phase: 'warming',
        label: 'Qwen3.5-2B',
        progressPct: undefined,
        bytesPerSec: undefined,
      })
      opts.onPhase({ phase: 'warming' })

      if (payload.nodeMod !== undefined) {
        inProc = new NodeLlamaCppTransport(payload.nodeMod, payload.modelPath)
        if (stale()) return
        setManagedPhase(opts.spine, { phase: 'ready', label: 'Qwen3.5-2B' })
        opts.onPhase({
          phase: 'ready',
          transport: inProc,
          base: 'node-llama-cpp',
          model: spec.id,
          provider: 'openai-compatible',
        })
        return
      }
      if (
        payload.llamaBin !== undefined &&
        (await startLlamaChild(payload.llamaBin, payload.modelPath, opts.signal))
      ) {
        return
      }
      await stopChild()
      if (await tryOllamaBridge()) return
      setManagedPhase(opts.spine, {
        phase: 'needs-runner',
        detail: 'llama-server did not become healthy — try /ai local or run ollama pull qwen3.5:2b',
      })
      opts.onPhase({ phase: 'needs-runner' })
    },
    async stop(): Promise<void> {
      await stopAll()
      opts.spine.managedAi = undefined
      deriveCapabilities(opts.spine)
    },
  }
}
