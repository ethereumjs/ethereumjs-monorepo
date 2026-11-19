import * as fs from 'node:fs'
import * as http from 'node:http'
import * as os from 'node:os'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'

import { FetchLlmTransport } from '../src/ai/fixtureEngine.ts'
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
    expect(results).toHaveLength(3)
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
