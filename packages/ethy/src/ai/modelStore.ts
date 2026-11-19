import * as crypto from 'node:crypto'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import type { ReadableStream as NodeWebReadableStream } from 'node:stream/web'

import { resolveEthyDataDir } from '../persist/ethyDataRoot.ts'
import { ggufMagicAt } from './ggufValidate.ts'
import { probeHardware } from './hardwareCheck.ts'
import { type ManagedModelSpec, resolveModelDownloadUrl } from './managedModel.ts'

export type ModelDownloadProgress = {
  downloadedBytes: number
  totalBytes: number
  pct: number
  bytesPerSec?: number
}

export type EnsureManagedModelOpts = {
  dataDir?: string
  signal?: AbortSignal
  onProgress?: (p: ModelDownloadProgress) => void
  fetchImpl?: typeof fetch
  freeDiskBytes?: number
  minValidBytes?: number
  sha256?: string
}

const DISK_BUFFER_BYTES = 512 * 1024 * 1024
const PROGRESS_THROTTLE_MS = 300
const WRITE_HIGH_WATER_MARK = 4 * 1024 * 1024

export function modelsDir(dataDir?: string): string {
  return path.join(resolveEthyDataDir(dataDir), 'models')
}

function modelPaths(dir: string, filename: string): { final: string; part: string } {
  const final = path.join(dir, filename)
  return { final, part: `${final}.part` }
}

function readFileHead(filePath: string, maxBytes: number): Uint8Array {
  const fd = fs.openSync(filePath, 'r')
  try {
    const size = fs.fstatSync(fd).size
    const buf = Buffer.alloc(Math.min(maxBytes, size))
    const n = fs.readSync(fd, buf, 0, buf.length, 0)
    return new Uint8Array(buf.subarray(0, n))
  } finally {
    fs.closeSync(fd)
  }
}

async function validateFinalFileAsync(
  filePath: string,
  minValidBytes: number,
  sha256?: string,
): Promise<boolean> {
  if (!fs.existsSync(filePath)) return false
  const size = fs.statSync(filePath).size
  if (size < minValidBytes) return false
  const head = readFileHead(filePath, 4)
  if (!ggufMagicAt(head)) return false
  if (sha256 === undefined) return true
  const hash = crypto.createHash('sha256')
  await new Promise<void>((resolve, reject) => {
    const stream = fs.createReadStream(filePath)
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve())
  })
  return hash.digest('hex') === sha256.toLowerCase()
}

function assertDiskSpace(
  dataDir: string | undefined,
  expectedBytes: number,
  override?: number,
): void {
  const free =
    override ??
    (() => {
      const hw = probeHardware(resolveEthyDataDir(dataDir))
      return hw.freeDiskBytes
    })()
  if (free === undefined) return
  if (free < expectedBytes + DISK_BUFFER_BYTES) {
    throw new Error(
      `Insufficient disk space for model download (need ~${formatGiB(expectedBytes + DISK_BUFFER_BYTES)}, free ~${formatGiB(free)})`,
    )
  }
}

function formatGiB(bytes: number): string {
  return `${(bytes / 1024 ** 3).toFixed(1)} GiB`
}

export class ModelDownloadAbortedError extends Error {
  constructor() {
    super('Model download aborted')
    this.name = 'ModelDownloadAbortedError'
  }
}

export async function ensureManagedModel(
  spec: ManagedModelSpec,
  opts: EnsureManagedModelOpts = {},
): Promise<string> {
  const dir = modelsDir(opts.dataDir)
  fs.mkdirSync(dir, { recursive: true })
  const { final, part } = modelPaths(dir, spec.filename)
  const minBytes = opts.minValidBytes ?? spec.minValidBytes
  const sha = opts.sha256 ?? spec.sha256

  if (await validateFinalFileAsync(final, minBytes, sha)) {
    return final
  }
  if (fs.existsSync(final)) {
    fs.unlinkSync(final)
  }

  assertDiskSpace(opts.dataDir, spec.expectedBytes, opts.freeDiskBytes)

  const fetchFn = opts.fetchImpl ?? fetch
  let offset = fs.existsSync(part) ? fs.statSync(part).size : 0
  let totalBytes = spec.expectedBytes
  let lastProgressMs = 0
  const transferStartMs = Date.now()
  let transferBytes = 0

  const emitProgress = (downloaded: number, force = false) => {
    const now = Date.now()
    if (!force && now - lastProgressMs < PROGRESS_THROTTLE_MS) return
    lastProgressMs = now
    const elapsedSec = Math.max(0.1, (now - transferStartMs) / 1000)
    const bytesPerSec = transferBytes > 0 ? Math.round(transferBytes / elapsedSec) : undefined
    const pct = totalBytes > 0 ? Math.min(100, Math.round((downloaded / totalBytes) * 100)) : 0
    opts.onProgress?.({ downloadedBytes: downloaded, totalBytes, pct, bytesPerSec })
  }

  const throwIfAborted = () => {
    if (opts.signal?.aborted === true) throw new ModelDownloadAbortedError()
  }

  let rangeRetried = false

  while (true) {
    throwIfAborted()
    const headers: Record<string, string> = {}
    if (offset > 0) headers.Range = `bytes=${offset}-`

    let res: Response
    try {
      res = await fetchFn(resolveModelDownloadUrl(spec), { headers, signal: opts.signal })
    } catch (e) {
      if (opts.signal?.aborted === true) throw new ModelDownloadAbortedError()
      throw e
    }
    throwIfAborted()

    if (res.status === 416 && !rangeRetried) {
      if (fs.existsSync(part)) fs.unlinkSync(part)
      offset = 0
      rangeRetried = true
      continue
    }
    if (!res.ok && res.status !== 206) {
      if (fs.existsSync(part)) fs.unlinkSync(part)
      throw new Error(`Model download HTTP ${res.status}`)
    }

    const contentRange = res.headers.get('content-range')
    const contentLength = res.headers.get('content-length')
    if (contentRange !== null) {
      const m = /\/(\d+)\s*$/u.exec(contentRange)
      if (m?.[1] !== undefined) totalBytes = Number.parseInt(m[1], 10)
    } else if (contentLength !== null) {
      const len = Number.parseInt(contentLength, 10)
      totalBytes = res.status === 206 ? offset + len : len
    }

    if (res.status === 200 && offset > 0) {
      fs.unlinkSync(part)
      offset = 0
    }

    const append = res.status === 206 && fs.existsSync(part)
    const outStream = fs.createWriteStream(part, {
      flags: append ? 'a' : 'w',
      highWaterMark: WRITE_HIGH_WATER_MARK,
    })
    let downloaded = offset
    try {
      if (res.body === null) {
        const buf = new Uint8Array(await res.arrayBuffer())
        throwIfAborted()
        outStream.end(buf)
        await new Promise<void>((resolve, reject) => {
          outStream.once('error', reject)
          outStream.once('finish', () => resolve())
        })
        transferBytes += buf.length
        downloaded += buf.length
        emitProgress(downloaded, true)
      } else {
        const src = Readable.fromWeb(res.body as unknown as NodeWebReadableStream, {
          highWaterMark: WRITE_HIGH_WATER_MARK,
        })
        src.on('data', (chunk: Buffer | Uint8Array) => {
          transferBytes += chunk.length
          downloaded += chunk.length
          emitProgress(downloaded, false)
        })
        await pipeline(src, outStream, { signal: opts.signal })
      }
    } catch (e) {
      outStream.destroy()
      if (opts.signal?.aborted === true) throw new ModelDownloadAbortedError()
      throw e
    }

    offset = fs.statSync(part).size
    emitProgress(offset, true)
    break
  }

  const size = fs.statSync(part).size
  if (!ggufMagicAt(readFileHead(part, 4)) || size < minBytes) {
    fs.unlinkSync(part)
    throw new Error('Downloaded file is not a valid GGUF archive')
  }
  if (sha !== undefined) {
    const hash = crypto.createHash('sha256')
    await new Promise<void>((resolve, reject) => {
      const stream = fs.createReadStream(part)
      stream.on('data', (c) => hash.update(c))
      stream.on('error', reject)
      stream.on('end', () => resolve())
    })
    if (hash.digest('hex') !== sha.toLowerCase()) {
      fs.unlinkSync(part)
      throw new Error('SHA-256 mismatch for downloaded model')
    }
  }
  fs.renameSync(part, final)
  return final
}
