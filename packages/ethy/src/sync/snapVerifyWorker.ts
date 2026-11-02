import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Worker } from 'node:worker_threads'

import {
  type AccountRangeVerifyResult,
  type StorageRangeVerifyResult,
  verifyAccountRangeJob,
  verifyStorageRangeJob,
} from './snapVerifyJob.ts'

function resolveVerifyWorkerEntry(fromModuleUrl: string): string {
  const baseDir = dirname(
    fromModuleUrl.startsWith('file:') ? fileURLToPath(fromModuleUrl) : fromModuleUrl,
  )
  const candidates = [
    join(baseDir, 'snapVerifyWorkerEntry.ts'),
    join(baseDir, 'snapVerifyWorkerEntry.js'),
  ]
  for (const path of candidates) {
    if (existsSync(path)) return path
  }
  return join(baseDir, 'snapVerifyWorkerEntry.js')
}

function workerExecArgv(entryPath: string, fromModuleUrl: string): string[] {
  if (entryPath.endsWith('.ts')) {
    try {
      const requireFrom = fromModuleUrl.startsWith('file:')
        ? fromModuleUrl
        : pathToFileURL(fromModuleUrl).href
      createRequire(requireFrom).resolve('tsx')
      return ['--import', 'tsx']
    } catch {
      return []
    }
  }
  return []
}

type Pending = {
  resolve: (value: AccountRangeVerifyResult | StorageRangeVerifyResult) => void
  reject: (err: Error) => void
}

export type SnapVerifyPoolOpts = {
  inProcess?: boolean
  /** Pass `import.meta.url` from the coordinator when spawning a real Worker. */
  moduleUrl?: string
}

/** Module URL for resolving {@link SnapVerifyPool} worker entry (tests + coordinator). */
export const SNAP_VERIFY_POOL_MODULE_URL = import.meta.url

export class SnapVerifyPool {
  private readonly inProcess: boolean
  private readonly moduleUrl?: string
  private worker?: Worker
  private nextId = 1
  private readonly pending = new Map<number, Pending>()
  private jobChain: Promise<void> = Promise.resolve()

  constructor(opts: SnapVerifyPoolOpts = {}) {
    this.inProcess = opts.inProcess === true
    this.moduleUrl = opts.moduleUrl
  }

  verifyAccountRange(opts: {
    stateRoot: Uint8Array
    origin?: Uint8Array
    payload: Uint8Array
  }): Promise<AccountRangeVerifyResult> {
    if (this.inProcess) {
      return verifyAccountRangeJob(opts)
    }
    const payloadCopy = new Uint8Array(opts.payload)
    return this.runWorker({
      id: this.nextId++,
      kind: 'account',
      stateRoot: opts.stateRoot,
      origin: opts.origin,
      payload: payloadCopy,
    }) as Promise<AccountRangeVerifyResult>
  }

  verifyStorageRange(opts: {
    storageRoot: Uint8Array
    origin: Uint8Array
    payload: Uint8Array
  }): Promise<StorageRangeVerifyResult> {
    if (this.inProcess) {
      return verifyStorageRangeJob({
        storageRoot: opts.storageRoot,
        origin: opts.origin,
        replyPayload: opts.payload,
      })
    }
    const payloadCopy = new Uint8Array(opts.payload)
    return this.runWorker({
      id: this.nextId++,
      kind: 'storage',
      storageRoot: opts.storageRoot,
      origin: opts.origin,
      payload: payloadCopy,
    }) as Promise<StorageRangeVerifyResult>
  }

  async close(): Promise<void> {
    await this.jobChain
    if (this.worker !== undefined) {
      await this.worker.terminate()
      this.worker = undefined
    }
    for (const p of this.pending.values()) {
      p.reject(new Error('SnapVerifyPool closed'))
    }
    this.pending.clear()
  }

  private ensureWorker(): Worker {
    if (this.worker !== undefined) return this.worker
    const moduleUrl = this.moduleUrl ?? SNAP_VERIFY_POOL_MODULE_URL
    const entry = resolveVerifyWorkerEntry(moduleUrl)
    this.worker = new Worker(entry, {
      execArgv: workerExecArgv(entry, moduleUrl),
    })
    this.worker.on('message', (msg: { id: number; result: AccountRangeVerifyResult }) => {
      const pending = this.pending.get(msg.id)
      if (pending === undefined) return
      this.pending.delete(msg.id)
      pending.resolve(msg.result)
    })
    this.worker.on('error', (err) => {
      for (const p of this.pending.values()) {
        p.reject(err)
      }
      this.pending.clear()
    })
    return this.worker
  }

  private runWorker(
    req:
      | {
          id: number
          kind: 'account'
          stateRoot: Uint8Array
          origin?: Uint8Array
          payload: Uint8Array
        }
      | {
          id: number
          kind: 'storage'
          storageRoot: Uint8Array
          origin: Uint8Array
          payload: Uint8Array
        },
  ): Promise<AccountRangeVerifyResult | StorageRangeVerifyResult> {
    const promise = new Promise<AccountRangeVerifyResult | StorageRangeVerifyResult>(
      (resolve, reject) => {
        this.pending.set(req.id, { resolve, reject })
      },
    )
    this.jobChain = this.jobChain.then(() => {
      const worker = this.ensureWorker()
      const transfer = [req.payload.buffer.slice(0)] as ArrayBuffer[]
      worker.postMessage(req, transfer)
    })
    return promise
  }
}
