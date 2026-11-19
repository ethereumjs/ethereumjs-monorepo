import { execFileSync, spawn } from 'node:child_process'
import * as fs from 'node:fs'

import type { ModelDownloadProgress } from './modelStore.ts'

let cachedCurlAvailable: boolean | undefined

export function isCurlAvailable(): boolean {
  if (process.env.ETHY_DISABLE_CURL === '1') return false
  if (cachedCurlAvailable !== undefined) return cachedCurlAvailable
  try {
    const cmd = process.platform === 'win32' ? 'where' : 'which'
    execFileSync(cmd, ['curl'], { stdio: 'ignore' })
    cachedCurlAvailable = true
  } catch {
    cachedCurlAvailable = false
  }
  return cachedCurlAvailable
}

export type CurlDownloadOpts = {
  url: string
  partPath: string
  expectedBytes: number
  resume?: boolean
  /** Optional curl `--limit-rate` value (e.g. `'8M'`). */
  rateLimit?: string
  signal?: AbortSignal
  onProgress?: (p: ModelDownloadProgress) => void
  onAbortError: () => Error
  /** Override curl binary for testing. */
  curlBin?: string
}

const POLL_INTERVAL_MS = 300

function fileSizeSafe(p: string): number {
  try {
    return fs.statSync(p).size
  } catch {
    return 0
  }
}

function runCurlOnce(
  curlBin: string,
  args: string[],
  opts: CurlDownloadOpts,
  startSize: number,
): Promise<number> {
  return new Promise((resolve, reject) => {
    if (opts.signal?.aborted === true) {
      reject(opts.onAbortError())
      return
    }

    const proc = spawn(curlBin, args, { stdio: 'ignore' })
    const startMs = Date.now()
    let settled = false

    const emit = (force = false) => {
      const size = fileSizeSafe(opts.partPath)
      const delta = Math.max(0, size - startSize)
      const elapsedSec = Math.max(0.2, (Date.now() - startMs) / 1000)
      const bytesPerSec = delta > 0 ? Math.round(delta / elapsedSec) : undefined
      const total = Math.max(opts.expectedBytes, size)
      const pct = total > 0 ? Math.min(100, Math.round((size / total) * 100)) : 0
      if (force || delta > 0 || size > 0) {
        opts.onProgress?.({ downloadedBytes: size, totalBytes: total, pct, bytesPerSec })
      }
    }

    const timer = setInterval(() => emit(false), POLL_INTERVAL_MS)
    timer.unref?.()

    const killChild = () => {
      try {
        proc.kill('SIGTERM')
      } catch {
        // ignore
      }
    }

    const onAbort = () => {
      killChild()
      cleanup()
      if (!settled) {
        settled = true
        reject(opts.onAbortError())
      }
    }

    const onProcessExit = () => killChild()

    const cleanup = () => {
      clearInterval(timer)
      opts.signal?.removeEventListener('abort', onAbort)
      process.off('exit', onProcessExit)
    }

    opts.signal?.addEventListener('abort', onAbort)
    process.once('exit', onProcessExit)

    proc.once('error', (err) => {
      cleanup()
      if (!settled) {
        settled = true
        reject(err)
      }
    })

    proc.once('close', (code) => {
      cleanup()
      if (settled) return
      settled = true
      if (opts.signal?.aborted === true) {
        reject(opts.onAbortError())
        return
      }
      emit(true)
      resolve(code ?? 1)
    })
  })
}

/**
 * Stream a file to `partPath` using native OS `curl` in an isolated child process,
 * preventing Node.js main-thread / `libuv` thread pool contention during SnapSync.
 */
export async function downloadWithCurl(opts: CurlDownloadOpts): Promise<void> {
  const curlBin = opts.curlBin ?? 'curl'
  const buildArgs = (allowResume: boolean): string[] => {
    const args = ['-f', '-s', '-S', '-L', '--retry', '2', '--connect-timeout', '15']
    if (allowResume && fileSizeSafe(opts.partPath) > 0) {
      args.push('-C', '-')
    }
    if (opts.rateLimit !== undefined && opts.rateLimit.length > 0) {
      args.push('--limit-rate', opts.rateLimit)
    }
    args.push('-o', opts.partPath, opts.url)
    return args
  }

  const initialSize = opts.resume === true ? fileSizeSafe(opts.partPath) : 0
  if (opts.resume !== true && fs.existsSync(opts.partPath)) {
    fs.unlinkSync(opts.partPath)
  }

  let code = await runCurlOnce(curlBin, buildArgs(opts.resume === true), opts, initialSize)
  // Exit code 33 = HTTP range error (server rejected resume offset); retry fresh once
  if (code === 33 && opts.resume === true) {
    if (fs.existsSync(opts.partPath)) fs.unlinkSync(opts.partPath)
    code = await runCurlOnce(curlBin, buildArgs(false), opts, 0)
  }
  if (code !== 0) {
    throw new Error(`curl download failed (exit ${code})`)
  }
}
