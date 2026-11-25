import { execFileSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import type { ReadableStream as NodeWebReadableStream } from 'node:stream/web'

import { resolveEthyDataDir } from '../persist/ethyDataRoot.ts'
import { downloadWithCurl, isCurlAvailable } from './curlDownload.ts'
import type { ModelDownloadProgress } from './modelStore.ts'

export const LLAMA_CPP_RELEASE_TAG = 'b12535'

export type LlamaServerReleaseAsset = {
  tag: string
  filename: string
  url: string
  expectedBytes: number
  archiveKind: 'tar.gz' | 'zip'
}

const RELEASE_ASSETS: Record<string, LlamaServerReleaseAsset> = {
  'darwin-arm64': {
    tag: LLAMA_CPP_RELEASE_TAG,
    filename: `llama-${LLAMA_CPP_RELEASE_TAG}-bin-macos-arm64.tar.gz`,
    url: `https://github.com/ggml-org/llama.cpp/releases/download/${LLAMA_CPP_RELEASE_TAG}/llama-${LLAMA_CPP_RELEASE_TAG}-bin-macos-arm64.tar.gz`,
    expectedBytes: 17_335_652,
    archiveKind: 'tar.gz',
  },
  'darwin-x64': {
    tag: LLAMA_CPP_RELEASE_TAG,
    filename: `llama-${LLAMA_CPP_RELEASE_TAG}-bin-macos-x64.tar.gz`,
    url: `https://github.com/ggml-org/llama.cpp/releases/download/${LLAMA_CPP_RELEASE_TAG}/llama-${LLAMA_CPP_RELEASE_TAG}-bin-macos-x64.tar.gz`,
    expectedBytes: 13_109_389,
    archiveKind: 'tar.gz',
  },
  'linux-x64': {
    tag: LLAMA_CPP_RELEASE_TAG,
    filename: `llama-${LLAMA_CPP_RELEASE_TAG}-bin-ubuntu-x64.tar.gz`,
    url: `https://github.com/ggml-org/llama.cpp/releases/download/${LLAMA_CPP_RELEASE_TAG}/llama-${LLAMA_CPP_RELEASE_TAG}-bin-ubuntu-x64.tar.gz`,
    expectedBytes: 23_899_232,
    archiveKind: 'tar.gz',
  },
  'win32-x64': {
    tag: LLAMA_CPP_RELEASE_TAG,
    filename: `llama-${LLAMA_CPP_RELEASE_TAG}-bin-win-cpu-x64.zip`,
    url: `https://github.com/ggml-org/llama.cpp/releases/download/${LLAMA_CPP_RELEASE_TAG}/llama-${LLAMA_CPP_RELEASE_TAG}-bin-win-cpu-x64.zip`,
    expectedBytes: 25_696_689,
    archiveKind: 'zip',
  },
}

const PROGRESS_THROTTLE_MS = 300
const WRITE_HIGH_WATER_MARK = 4 * 1024 * 1024

export function llamaServerAssetForPlatform(
  platform: string = process.platform,
  arch: string = process.arch,
): LlamaServerReleaseAsset | undefined {
  const key = `${platform}-${arch}`
  const base = RELEASE_ASSETS[key]
  if (base === undefined) return undefined
  const overrideUrl = process.env.ETHY_LLAMA_SERVER_URL
  if (overrideUrl !== undefined && overrideUrl.length > 0) {
    return {
      ...base,
      url: overrideUrl,
      archiveKind: overrideUrl.endsWith('.zip') ? 'zip' : 'tar.gz',
    }
  }
  return base
}

export function managedLlamaBinRoot(dataDir?: string): string {
  return path.join(resolveEthyDataDir(dataDir), 'bin', `llama-${LLAMA_CPP_RELEASE_TAG}`)
}

function binaryNamesForPlatform(platform: string = process.platform): string[] {
  return platform === 'win32' ? ['llama-server.exe'] : ['llama-server']
}

/** Locate `llama-server` recursively up to depth 3 inside an extracted release folder. */
export function findLlamaServerInDir(
  dir: string,
  platform: string = process.platform,
  depth = 0,
): string | undefined {
  if (depth > 3 || !fs.existsSync(dir)) return undefined
  const targets = new Set(binaryNamesForPlatform(platform))
  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return undefined
  }
  for (const entry of entries) {
    if (entry.isFile() && targets.has(entry.name)) {
      return path.join(dir, entry.name)
    }
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const hit = findLlamaServerInDir(path.join(dir, entry.name), platform, depth + 1)
      if (hit !== undefined) return hit
    }
  }
  return undefined
}

export function resolveLlamaServerBin(dataDir?: string): string | undefined {
  const fromEnv = process.env.ETHY_LLAMA_SERVER_BIN
  if (fromEnv !== undefined && fromEnv.length > 0) {
    if (fs.existsSync(fromEnv)) return fromEnv
  }
  const managedHit = findLlamaServerInDir(managedLlamaBinRoot(dataDir))
  if (managedHit !== undefined) return managedHit
  try {
    const cmd = process.platform === 'win32' ? 'where' : 'which'
    const out = execFileSync(cmd, ['llama-server'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    const first = out.split(/\r?\n/u)[0]?.trim()
    if (first !== undefined && first.length > 0 && fs.existsSync(first)) return first
  } catch {
    // not on PATH
  }
  return undefined
}

export type EnsureLlamaServerBinOpts = {
  dataDir?: string
  signal?: AbortSignal
  onProgress?: (p: ModelDownloadProgress) => void
  fetchImpl?: typeof fetch
  platform?: string
  arch?: string
}

function extractArchive(archivePath: string, destDir: string, kind: 'tar.gz' | 'zip'): void {
  fs.mkdirSync(destDir, { recursive: true })
  if (kind === 'tar.gz') {
    execFileSync('tar', ['-xzf', archivePath, '-C', destDir], { stdio: 'ignore' })
    return
  }
  if (process.platform === 'win32') {
    execFileSync(
      'powershell',
      [
        '-NoProfile',
        '-Command',
        `Expand-Archive -Path '${archivePath}' -DestinationPath '${destDir}' -Force`,
      ],
      { stdio: 'ignore' },
    )
    return
  }
  execFileSync('unzip', ['-o', archivePath, '-d', destDir], { stdio: 'ignore' })
}

/**
 * Resolve an existing `llama-server` or auto-bootstrap the official prebuilt
 * release binary (~17–25 MB) into `<dataDir>/bin/llama-<tag>/`.
 */
export async function ensureLlamaServerBin(
  opts: EnsureLlamaServerBinOpts = {},
): Promise<string | undefined> {
  const existing = resolveLlamaServerBin(opts.dataDir)
  if (existing !== undefined) return existing

  const platform = opts.platform ?? process.platform
  const arch = opts.arch ?? process.arch
  const asset = llamaServerAssetForPlatform(platform, arch)
  if (asset === undefined) return undefined

  const binParent = path.dirname(managedLlamaBinRoot(opts.dataDir))
  const finalDir = managedLlamaBinRoot(opts.dataDir)
  const tmpDir = `${finalDir}.tmp-${Date.now()}`
  const archivePath = path.join(binParent, `${asset.filename}.part`)
  fs.mkdirSync(binParent, { recursive: true })

  const fetchFn = opts.fetchImpl ?? fetch
  let lastProgressMs = 0
  let totalBytes = asset.expectedBytes
  const transferStartMs = Date.now()

  const emitProgress = (downloaded: number, force = false) => {
    const now = Date.now()
    if (!force && now - lastProgressMs < PROGRESS_THROTTLE_MS) return
    lastProgressMs = now
    const elapsedSec = Math.max(0.1, (now - transferStartMs) / 1000)
    const bytesPerSec = downloaded > 0 ? Math.round(downloaded / elapsedSec) : undefined
    const pct = totalBytes > 0 ? Math.min(100, Math.round((downloaded / totalBytes) * 100)) : 0
    opts.onProgress?.({ downloadedBytes: downloaded, totalBytes, pct, bytesPerSec })
  }

  try {
    if (opts.fetchImpl === undefined && isCurlAvailable()) {
      await downloadWithCurl({
        url: asset.url,
        partPath: archivePath,
        expectedBytes: asset.expectedBytes,
        resume: false,
        signal: opts.signal,
        onProgress: opts.onProgress,
        onAbortError: () => new Error('llama-server download aborted'),
      })
    } else {
      const res = await fetchFn(asset.url, { signal: opts.signal })
      if (!res.ok) {
        throw new Error(`llama-server download HTTP ${res.status}`)
      }
      const len = res.headers.get('content-length')
      if (len !== null) {
        const parsed = Number.parseInt(len, 10)
        if (parsed > 0) totalBytes = parsed
      }

      const outStream = fs.createWriteStream(archivePath, { highWaterMark: WRITE_HIGH_WATER_MARK })
      let downloaded = 0
      try {
        if (res.body === null) {
          const buf = new Uint8Array(await res.arrayBuffer())
          outStream.end(buf)
          await new Promise<void>((resolve, reject) => {
            outStream.once('error', reject)
            outStream.once('finish', () => resolve())
          })
          downloaded = buf.length
        } else {
          const src = Readable.fromWeb(res.body as unknown as NodeWebReadableStream, {
            highWaterMark: WRITE_HIGH_WATER_MARK,
          })
          src.on('data', (chunk: Buffer | Uint8Array) => {
            downloaded += chunk.length
            emitProgress(downloaded, false)
          })
          await pipeline(src, outStream, { signal: opts.signal })
        }
      } catch (e) {
        outStream.destroy()
        throw e
      }
      emitProgress(downloaded, true)
    }

    extractArchive(archivePath, tmpDir, asset.archiveKind)
    const extractedBin = findLlamaServerInDir(tmpDir, platform)
    if (extractedBin === undefined) {
      throw new Error('Extracted llama.cpp archive did not contain llama-server')
    }
    if (platform !== 'win32') {
      try {
        fs.chmodSync(extractedBin, 0o755)
      } catch {
        // ignore chmod failures on non-POSIX FS
      }
    }
    if (fs.existsSync(finalDir)) {
      fs.rmSync(finalDir, { recursive: true, force: true })
    }
    fs.renameSync(tmpDir, finalDir)
    return findLlamaServerInDir(finalDir, platform)
  } finally {
    try {
      if (fs.existsSync(archivePath)) fs.unlinkSync(archivePath)
    } catch {
      // ignore cleanup error
    }
    try {
      if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true })
    } catch {
      // ignore cleanup error
    }
  }
}

export function spawnLlamaServerCommand(
  bin: string,
  modelPath: string,
  port: number,
  opts?: { reasoningBudgetZero?: boolean },
): { command: string; args: string[]; cwd: string; env: NodeJS.ProcessEnv } {
  const reasoningBudgetZero = opts?.reasoningBudgetZero !== false
  const normalized = path.resolve(bin)
  const resolvedModelPath = path.resolve(modelPath)
  const binDir = path.dirname(normalized)
  const env: NodeJS.ProcessEnv = { ...process.env }
  if (process.platform === 'darwin') {
    env.DYLD_LIBRARY_PATH = env.DYLD_LIBRARY_PATH ? `${binDir}:${env.DYLD_LIBRARY_PATH}` : binDir
  } else if (process.platform === 'linux') {
    env.LD_LIBRARY_PATH = env.LD_LIBRARY_PATH ? `${binDir}:${env.LD_LIBRARY_PATH}` : binDir
  }
  if (normalized.endsWith('.mjs') || normalized.endsWith('.js')) {
    return {
      command: process.execPath,
      args: [
        normalized,
        '-m',
        resolvedModelPath,
        '--host',
        '127.0.0.1',
        '--port',
        String(port),
        '--ctx-size',
        '4096',
        ...(reasoningBudgetZero ? (['--reasoning-budget', '0'] as const) : []),
      ],
      cwd: binDir,
      env,
    }
  }
  return {
    command: normalized,
    args: [
      '-m',
      resolvedModelPath,
      '--host',
      '127.0.0.1',
      '--port',
      String(port),
      '--ctx-size',
      '4096',
      ...(reasoningBudgetZero ? (['--reasoning-budget', '0'] as const) : []),
    ],
    cwd: binDir,
    env,
  }
}
