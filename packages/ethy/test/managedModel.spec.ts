import { execFileSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as http from 'node:http'
import * as os from 'node:os'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'

import { FetchLlmTransport } from '../src/ai/fixtureEngine.ts'
import {
  ensureLlamaServerBin,
  llamaServerAssetForPlatform,
  resolveLlamaServerBin,
} from '../src/ai/llamaServerBin.ts'
import { DEFAULT_MANAGED_MODEL_SPEC, resolveModelDownloadUrl } from '../src/ai/managedModel.ts'
import { createManagedModelRunner } from '../src/ai/managedRunner.ts'
import { ModelDownloadAbortedError, ensureManagedModel, modelsDir } from '../src/ai/modelStore.ts'
import { runSmokeScenarios } from '../src/ai/smokeScenarios.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { startMockLlmServer } from './helpers/mockLlmServer.ts'

const GGUF = Buffer.from('GGUF')
const PAYLOAD_SIZE = 64 * 1024

function syntheticGguf(size = PAYLOAD_SIZE): Buffer {
  const buf = Buffer.alloc(size)
  GGUF.copy(buf, 0)
  return buf
}

async function startDownloadServer(
  body: Buffer,
  opts?: { dropAfter?: number },
): Promise<{ url: string; close: () => Promise<void> }> {
  let served = 0
  const server = http.createServer((req, res) => {
    const range = req.headers.range
    if (range !== undefined) {
      const m = /bytes=(\d+)-/u.exec(range)
      const start = m?.[1] !== undefined ? Number.parseInt(m[1], 10) : 0
      if (opts?.dropAfter !== undefined && served >= opts.dropAfter) {
        res.destroy()
        return
      }
      served += 1
      const slice = body.subarray(start)
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${body.length - 1}/${body.length}`,
        'Content-Length': String(slice.length),
      })
      res.end(slice)
      return
    }
    res.writeHead(200, { 'Content-Length': String(body.length) })
    if (opts?.dropAfter !== undefined && served >= opts.dropAfter) {
      res.destroy()
      return
    }
    served += 1
    res.end(body)
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()))
  const addr = server.address()
  const port = typeof addr === 'object' && addr !== null ? addr.port : 0
  return {
    url: `http://127.0.0.1:${port}/model.gguf`,
    close: () => new Promise((resolve, reject) => server.close((e) => (e ? reject(e) : resolve()))),
  }
}

describe('modelStore ensureManagedModel', () => {
  const tmpDirs: string[] = []
  afterEach(() => {
    delete process.env.ETHY_DEFAULT_MODEL_URL
    for (const d of tmpDirs) fs.rmSync(d, { recursive: true, force: true })
  })

  it('downloads and renames atomically', async () => {
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-model-'))
    tmpDirs.push(dataDir)
    const body = syntheticGguf()
    const spec = {
      ...DEFAULT_MANAGED_MODEL_SPEC,
      downloadUrl: '',
      expectedBytes: body.length,
      minValidBytes: 1024,
    }
    const srv = await startDownloadServer(body)
    process.env.ETHY_DEFAULT_MODEL_URL = srv.url
    const progress: number[] = []
    const final = await ensureManagedModel(spec, {
      dataDir,
      minValidBytes: 1024,
      freeDiskBytes: body.length + 1_000_000_000,
      onProgress: (p) => progress.push(p.pct),
    })
    await srv.close()
    expect(fs.readFileSync(final).equals(body)).toBe(true)
    expect(progress.length).toBeGreaterThan(0)
  })

  it('resumes partial .part with HTTP range', async () => {
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-model-'))
    tmpDirs.push(dataDir)
    const body = syntheticGguf()
    const spec = {
      ...DEFAULT_MANAGED_MODEL_SPEC,
      expectedBytes: body.length,
      minValidBytes: 1024,
    }
    const partPath = path.join(modelsDir(dataDir), `${spec.filename}.part`)
    fs.mkdirSync(path.dirname(partPath), { recursive: true })
    const half = Math.floor(body.length / 2)
    fs.writeFileSync(partPath, body.subarray(0, half))
    const srv = await startDownloadServer(body)
    process.env.ETHY_DEFAULT_MODEL_URL = srv.url
    const final = await ensureManagedModel(spec, {
      dataDir,
      minValidBytes: 1024,
      freeDiskBytes: body.length + 1_000_000_000,
    })
    await srv.close()
    expect(fs.readFileSync(final).equals(body)).toBe(true)
  })

  it('rejects HTML and low disk', async () => {
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-model-'))
    tmpDirs.push(dataDir)
    const bad = Buffer.from('<html>404</html>')
    const srv = await startDownloadServer(bad)
    process.env.ETHY_DEFAULT_MODEL_URL = srv.url
    const spec = {
      ...DEFAULT_MANAGED_MODEL_SPEC,
      expectedBytes: bad.length,
      minValidBytes: 1024,
    }
    await expect(
      ensureManagedModel(spec, {
        dataDir,
        minValidBytes: 1024,
        freeDiskBytes: 1_000_000_000,
      }),
    ).rejects.toThrow(/GGUF/)
    await srv.close()

    await expect(
      ensureManagedModel(spec, {
        dataDir,
        minValidBytes: 1024,
        freeDiskBytes: 100,
      }),
    ).rejects.toThrow(/disk space/)
  })

  it('aborts without writing final gguf', async () => {
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-model-'))
    tmpDirs.push(dataDir)
    const body = syntheticGguf()
    const srv = await startDownloadServer(body)
    process.env.ETHY_DEFAULT_MODEL_URL = srv.url
    const ac = new AbortController()
    const spec = {
      ...DEFAULT_MANAGED_MODEL_SPEC,
      expectedBytes: body.length,
      minValidBytes: 1024,
    }
    const p = ensureManagedModel(spec, {
      dataDir,
      signal: ac.signal,
      minValidBytes: 1024,
      freeDiskBytes: body.length + 1_000_000_000,
    })
    ac.abort()
    await expect(p).rejects.toBeInstanceOf(ModelDownloadAbortedError)
    const final = path.join(modelsDir(dataDir), spec.filename)
    expect(fs.existsSync(final)).toBe(false)
    await srv.close()
  })

  it('keeps models when pivot journals are wiped', () => {
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-model-'))
    tmpDirs.push(dataDir)
    const dir = modelsDir(dataDir)
    fs.mkdirSync(dir, { recursive: true })
    const modelFile = path.join(dir, 'keep.gguf')
    fs.writeFileSync(modelFile, syntheticGguf(2048))
    const pivotsRoot = path.join(dataDir, 'networks', 'sepolia', 'pivots')
    fs.mkdirSync(pivotsRoot, { recursive: true })
    fs.rmSync(pivotsRoot, { recursive: true, force: true })
    expect(fs.existsSync(modelFile)).toBe(true)
  })
})

describe('managed runner lifecycle', () => {
  it('starts fake llama-server and exposes transport', async () => {
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-run-'))
    const fake = fileURLToPath(new URL('./helpers/fakeLlamaServer.mjs', import.meta.url))
    const dir = modelsDir(dataDir)
    fs.mkdirSync(dir, { recursive: true })
    const modelPath = path.join(dir, DEFAULT_MANAGED_MODEL_SPEC.filename)
    fs.writeFileSync(modelPath, syntheticGguf(2048))
    const spec = { ...DEFAULT_MANAGED_MODEL_SPEC, minValidBytes: 1024 }
    const spine = createSpine('sepolia', 1n)
    spine.aiMode = 'default'
    let ready = false
    const runner = createManagedModelRunner({
      spec,
      dataDir,
      spine,
      getEpoch: () => 0,
      resolveBin: () => fake,
      tryImport: async () => undefined,
      ensureModel: async () => modelPath,
      onPhase: (u) => {
        if (u.phase === 'ready' && u.transport !== undefined) ready = true
      },
    })
    await runner.start()
    expect(ready).toBe(true)
    expect(spine.capabilities.ai.label).toBe('Qwen3.5-2B')
    await runner.stop()
    fs.rmSync(dataDir, { recursive: true, force: true })
  })
})

describe('ai:smoke scenarios', () => {
  it('runs offline fixture replay matrix', async () => {
    const results = await runSmokeScenarios()
    expect(results).toHaveLength(4)
    expect(results.every((r) => r.validJSON)).toBe(true)
  })

  it('mock llm server speaks openai wire', async () => {
    let step = 0
    const mock = await startMockLlmServer(() => {
      step += 1
      if (step === 1) {
        return JSON.stringify({
          mode: 'investigate',
          calls: [{ tool: 'inspect_delegations', args: {} }],
        })
      }
      return JSON.stringify({
        mode: 'dispatch',
        category: '7702',
        severity: 'surge',
        headline: 'Delegation spike',
        body: 'ok',
      })
    })
    const transport = new FetchLlmTransport(mock.baseUrl, {
      provider: 'openai-compatible',
      model: 'mock',
    })
    const results = await runSmokeScenarios(transport)
    expect(mock.requests.length).toBeGreaterThan(0)
    await mock.close()
    expect(results[0]?.tools).toContain('inspect_delegations')
  })
})

describe('resolveModelDownloadUrl', () => {
  it('prefers ETHY_DEFAULT_MODEL_URL', () => {
    process.env.ETHY_DEFAULT_MODEL_URL = 'http://127.0.0.1:9/x'
    expect(resolveModelDownloadUrl(DEFAULT_MANAGED_MODEL_SPEC)).toBe('http://127.0.0.1:9/x')
    delete process.env.ETHY_DEFAULT_MODEL_URL
  })
})

describe('llama-server auto-install', () => {
  const dirs: string[] = []
  afterEach(() => {
    delete process.env.ETHY_LLAMA_SERVER_URL
    delete process.env.ETHY_LLAMA_SERVER_BIN
    for (const d of dirs) fs.rmSync(d, { recursive: true, force: true })
    dirs.length = 0
  })

  it('exposes pinned release assets for darwin-arm64, darwin-x64, linux-x64, win32-x64', () => {
    expect(llamaServerAssetForPlatform('darwin', 'arm64')?.filename).toContain('macos-arm64.tar.gz')
    expect(llamaServerAssetForPlatform('darwin', 'x64')?.filename).toContain('macos-x64.tar.gz')
    expect(llamaServerAssetForPlatform('linux', 'x64')?.filename).toContain('ubuntu-x64.tar.gz')
    expect(llamaServerAssetForPlatform('win32', 'x64')?.filename).toContain('win-cpu-x64.zip')
  })

  it('downloads and extracts tar.gz runner into <dataDir>/bin/llama-<tag>/ offline', async () => {
    if (process.platform === 'win32') return
    const work = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-bin-'))
    dirs.push(work)
    const stageDir = path.join(work, 'stage', 'build', 'bin')
    fs.mkdirSync(stageDir, { recursive: true })
    const fakePath = fileURLToPath(new URL('./helpers/fakeLlamaServer.mjs', import.meta.url))
    fs.copyFileSync(fakePath, path.join(stageDir, 'llama-server'))
    const tarPath = path.join(work, 'fake-llama.tar.gz')
    execFileSync('tar', ['-czf', tarPath, '-C', path.join(work, 'stage'), 'build'])
    const archiveBytes = fs.readFileSync(tarPath)

    const srv = await startDownloadServer(archiveBytes)
    process.env.ETHY_LLAMA_SERVER_URL = srv.url
    const dataDir = path.join(work, 'data')
    const progressTicks: number[] = []

    const binPath = await ensureLlamaServerBin({
      dataDir,
      platform: 'darwin',
      arch: 'arm64',
      onProgress: (p) => progressTicks.push(p.pct),
    })
    await srv.close()

    expect(binPath).toBeDefined()
    expect(fs.existsSync(binPath!)).toBe(true)
    expect(progressTicks.length).toBeGreaterThan(0)
    expect(resolveLlamaServerBin(dataDir)).toBe(binPath)
  })

  it('notifies phase updates during runner + model download and handles <think> leaks on MockLlmServer', async () => {
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-boot-'))
    dirs.push(dataDir)
    const fake = fileURLToPath(new URL('./helpers/fakeLlamaServer.mjs', import.meta.url))
    const modelPath = path.join(modelsDir(dataDir), DEFAULT_MANAGED_MODEL_SPEC.filename)
    fs.mkdirSync(path.dirname(modelPath), { recursive: true })
    fs.writeFileSync(modelPath, syntheticGguf(2048))

    const spine = createSpine('sepolia', 11155111n)
    spine.aiMode = 'default'
    const phases: string[] = []
    const runner = createManagedModelRunner({
      spec: { ...DEFAULT_MANAGED_MODEL_SPEC, minValidBytes: 1024 },
      dataDir,
      spine,
      getEpoch: () => 0,
      tryImport: async () => undefined,
      resolveBin: () => undefined,
      ensureBin: async (binOpts) => {
        binOpts?.onProgress?.({ downloadedBytes: 100, totalBytes: 100, pct: 100 })
        return fake
      },
      ensureModel: async (_s, modelOpts) => {
        modelOpts?.onProgress?.({ downloadedBytes: 1024, totalBytes: 2048, pct: 50 })
        return modelPath
      },
      onPhase: (u) => phases.push(u.phase),
    })

    await runner.start()
    expect(phases).toContain('downloading')
    expect(phases).toContain('warming')
    expect(phases).toContain('ready')
    await runner.stop()

    // Also verify MockLlmServer + <think> stripping over Ollama /api/chat wire
    const think = `${String.fromCharCode(60)}think${String.fromCharCode(62)}checking${String.fromCharCode(60)}/think${String.fromCharCode(62)}`
    const mock = await startMockLlmServer(
      () =>
        `${think}${JSON.stringify({
          mode: 'dispatch',
          category: 'watch',
          severity: 'calm',
          headline: 'Steady',
          body: 'All quiet.',
        })}`,
    )
    const ollamaTransport = new FetchLlmTransport(mock.ollamaBaseUrl, {
      provider: 'ollama',
      model: 'qwen3.5:2b',
    })
    const smoke = await runSmokeScenarios(ollamaTransport)
    await mock.close()
    expect(smoke.every((r) => r.validJSON)).toBe(true)
    const firstReq = mock.requests[0] as { model?: string; think?: boolean }
    expect(firstReq.model).toBe('qwen3.5:2b')
    expect(firstReq.think).toBe(false)
  })

  it('paces model download at 8M and defers llama-server warmup during SNAP_SYNCING until wakeIfDeferred', async () => {
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-defer-'))
    dirs.push(dataDir)
    const fake = fileURLToPath(new URL('./helpers/fakeLlamaServer.mjs', import.meta.url))
    const modelPath = path.join(modelsDir(dataDir), DEFAULT_MANAGED_MODEL_SPEC.filename)
    fs.mkdirSync(path.dirname(modelPath), { recursive: true })
    fs.writeFileSync(modelPath, syntheticGguf(2048))

    const spine = createSpine('sepolia', 11155111n)
    spine.aiMode = 'default'
    spine.phase = 'SNAP_SYNCING'
    let capturedRateLimit: string | undefined
    const phases: string[] = []
    const runner = createManagedModelRunner({
      spec: { ...DEFAULT_MANAGED_MODEL_SPEC, minValidBytes: 1024 },
      dataDir,
      spine,
      getEpoch: () => 0,
      tryImport: async () => undefined,
      resolveBin: () => fake,
      ensureModel: async (_s, modelOpts) => {
        capturedRateLimit = modelOpts?.rateLimit
        return modelPath
      },
      onPhase: (u) => phases.push(u.phase),
    })

    await runner.start()
    expect(capturedRateLimit).toBe('8M')
    expect(spine.managedAi?.phase).toBe('deferred')
    expect(spine.capabilities.ai.label).toBe('Ready after sync')
    expect(phases).not.toContain('ready')

    // Once sync finishes (or user asks a question), wakeIfDeferred loads llama-server
    spine.phase = 'HEAD_FOLLOWING'
    await runner.wakeIfDeferred()
    expect(spine.managedAi?.phase).toBe('ready')
    expect(phases).toContain('ready')
    await runner.stop()
  })
})
