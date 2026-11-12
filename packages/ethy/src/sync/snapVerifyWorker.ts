import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { availableParallelism } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Worker } from 'node:worker_threads'

import {
  type AccountRangeVerifyResult,
  type ProvenChunkVerifyResult,
  type StorageRangeVerifyResult,
  verifyAccountRangeJob,
  verifyProvenAccountChunkJob,
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
  resolve: (
    value: AccountRangeVerifyResult | StorageRangeVerifyResult | ProvenChunkVerifyResult,
  ) => void
  reject: (err: Error) => void
}

type WorkerRequest =
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
      origin: Uint8Array
      payload: Uint8Array
      accounts?: Array<{ accountHash: Uint8Array; storageRoot: Uint8Array }>
      storageRoot?: Uint8Array
    }
  | {
      id: number
      kind: 'provenChunk'
      chunkStateRoot: Uint8Array
      originHash: Uint8Array
      payload: Uint8Array
      proofNodes: Uint8Array[]
      hasRightHint: boolean
    }

export function defaultSnapVerifyPoolSize(parallelism?: number): number {
  const p = parallelism ?? availableParallelism()
  return Math.min(6, Math.max(2, p - 2))
}

export type SnapVerifyPoolOpts = {
  inProcess?: boolean
  /** Pass `import.meta.url` from the coordinator when spawning a real Worker. */
  moduleUrl?: string
  poolSize?: number
  /** Test hook: replace real Worker construction. */
  createWorker?: (entry: string, execArgv: string[]) => Worker
}

/**
 * Module URL for resolving {@link SnapVerifyPool} worker entry (tests + coordinator).
 * Prod CJS compile uses `"module": "CommonJS"`, which rejects this syntax.
 * ESM, tsx, and vitest accept it. `@ts-ignore` is a no-op for those builds.
 */
// @ts-ignore TS1343
export const SNAP_VERIFY_POOL_MODULE_URL: string = import.meta.url

type WorkerSlot = {
  worker: Worker
  inFlight: number
  pendingIds: Set<number>
}

export class SnapVerifyPool {
  private readonly inProcess: boolean
  private readonly moduleUrl?: string
  private readonly poolSize: number
  private readonly createWorker: (entry: string, execArgv: string[]) => Worker
  private nextId = 1
  private readonly pending = new Map<number, Pending>()
  private readonly slots: WorkerSlot[] = []

  constructor(opts: SnapVerifyPoolOpts = {}) {
    this.inProcess = opts.inProcess === true
    this.moduleUrl = opts.moduleUrl
    this.poolSize = opts.poolSize ?? defaultSnapVerifyPoolSize()
    this.createWorker = opts.createWorker ?? ((entry, execArgv) => new Worker(entry, { execArgv }))
  }

  verifyAccountRange(opts: {
    stateRoot: Uint8Array
    origin?: Uint8Array
    payload: Uint8Array
  }): Promise<AccountRangeVerifyResult> {
    if (this.inProcess) {
      return verifyAccountRangeJob(opts)
    }
    const payload = this.payloadForWorkerTransfer(opts.payload)
    return this.runWorker({
      id: this.nextId++,
      kind: 'account',
      stateRoot: opts.stateRoot,
      origin: opts.origin,
      payload,
    }) as Promise<AccountRangeVerifyResult>
  }

  verifyStorageRange(opts: {
    storageRoot?: Uint8Array
    accounts?: Array<{ accountHash: Uint8Array; storageRoot: Uint8Array }>
    origin: Uint8Array
    payload: Uint8Array
  }): Promise<StorageRangeVerifyResult> {
    if (this.inProcess) {
      return verifyStorageRangeJob({
        storageRoot: opts.storageRoot,
        accounts: opts.accounts,
        origin: opts.origin,
        replyPayload: opts.payload,
      })
    }
    const payload = this.payloadForWorkerTransfer(opts.payload)
    return this.runWorker({
      id: this.nextId++,
      kind: 'storage',
      storageRoot: opts.storageRoot,
      accounts: opts.accounts,
      origin: opts.origin,
      payload,
    }) as Promise<StorageRangeVerifyResult>
  }

  verifyProvenAccountChunk(opts: {
    chunkStateRoot: Uint8Array
    originHash: Uint8Array
    binaryAccountsSlab: Uint8Array
    proofNodes: Uint8Array[]
    hasRightHint: boolean
  }): Promise<ProvenChunkVerifyResult> {
    if (this.inProcess) {
      return verifyProvenAccountChunkJob(opts)
    }
    const payload = this.payloadForWorkerTransfer(opts.binaryAccountsSlab)
    return this.runWorker({
      id: this.nextId++,
      kind: 'provenChunk',
      chunkStateRoot: opts.chunkStateRoot,
      originHash: opts.originHash,
      payload,
      proofNodes: opts.proofNodes,
      hasRightHint: opts.hasRightHint,
    }) as Promise<ProvenChunkVerifyResult>
  }

  async close(): Promise<void> {
    for (const slot of this.slots) {
      await slot.worker.terminate()
    }
    this.slots.length = 0
    for (const p of this.pending.values()) {
      p.reject(new Error('SnapVerifyPool closed'))
    }
    this.pending.clear()
  }

  private payloadForWorkerTransfer(payload: Uint8Array): Uint8Array {
    if (payload.byteOffset === 0 && payload.byteLength === payload.buffer.byteLength) {
      return payload
    }
    return new Uint8Array(payload)
  }

  private pickSlot(): WorkerSlot {
    for (const slot of this.slots) {
      if (slot.inFlight === 0) return slot
    }
    let best: WorkerSlot | undefined
    for (const slot of this.slots) {
      if (best === undefined || slot.inFlight < best.inFlight) {
        best = slot
      }
    }
    if (best !== undefined && this.slots.length >= this.poolSize) {
      return best
    }
    const moduleUrl = this.moduleUrl ?? SNAP_VERIFY_POOL_MODULE_URL
    const entry = resolveVerifyWorkerEntry(moduleUrl)
    const worker = this.createWorker(entry, workerExecArgv(entry, moduleUrl))
    const slot: WorkerSlot = { worker, inFlight: 0, pendingIds: new Set() }
    worker.on('message', (msg: { id: number; result: AccountRangeVerifyResult }) => {
      slot.pendingIds.delete(msg.id)
      slot.inFlight = slot.pendingIds.size
      const pending = this.pending.get(msg.id)
      if (pending === undefined) return
      this.pending.delete(msg.id)
      pending.resolve(msg.result)
    })
    worker.on('error', (err) => {
      for (const id of slot.pendingIds) {
        const p = this.pending.get(id)
        if (p !== undefined) {
          this.pending.delete(id)
          p.reject(err)
        }
      }
      slot.pendingIds.clear()
      slot.inFlight = 0
      const idx = this.slots.indexOf(slot)
      if (idx >= 0) this.slots.splice(idx, 1)
    })
    this.slots.push(slot)
    return slot
  }

  private runWorker(
    req: WorkerRequest,
  ): Promise<AccountRangeVerifyResult | StorageRangeVerifyResult | ProvenChunkVerifyResult> {
    const promise = new Promise<
      AccountRangeVerifyResult | StorageRangeVerifyResult | ProvenChunkVerifyResult
    >((resolve, reject) => {
      this.pending.set(req.id, { resolve, reject })
    })
    const slot = this.pickSlot()
    slot.pendingIds.add(req.id)
    slot.inFlight = slot.pendingIds.size
    const transfer =
      req.payload.byteOffset === 0 && req.payload.byteLength === req.payload.buffer.byteLength
        ? ([req.payload.buffer] as ArrayBuffer[])
        : []
    slot.worker.postMessage(req, transfer)
    return promise
  }
}
