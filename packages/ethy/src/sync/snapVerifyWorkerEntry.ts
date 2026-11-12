import { parentPort } from 'node:worker_threads'

import { initEthyKeccak } from '../crypto/keccak.ts'
import {
  verifyAccountRangeJob,
  verifyProvenAccountChunkJob,
  verifyStorageRangeJob,
} from './snapVerifyJob.ts'

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

type WorkerResponse = {
  id: number
  result:
    | Awaited<ReturnType<typeof verifyAccountRangeJob>>
    | Awaited<ReturnType<typeof verifyStorageRangeJob>>
    | Awaited<ReturnType<typeof verifyProvenAccountChunkJob>>
}

if (parentPort === null) {
  throw new Error('snapVerifyWorkerEntry must run inside a Worker')
}

const port = parentPort
const ready = initEthyKeccak()

port.on('message', async (msg: WorkerRequest) => {
  try {
    await ready
    if (msg.kind === 'account') {
      const result = await verifyAccountRangeJob({
        stateRoot: msg.stateRoot,
        origin: msg.origin,
        payload: msg.payload,
      })
      const transfer =
        result.slab !== undefined &&
        result.slab.byteOffset === 0 &&
        result.slab.byteLength === result.slab.buffer.byteLength
          ? ([result.slab.buffer] as ArrayBuffer[])
          : []
      const out: WorkerResponse = { id: msg.id, result }
      port.postMessage(out, transfer)
      return
    }
    if (msg.kind === 'provenChunk') {
      const result = await verifyProvenAccountChunkJob({
        chunkStateRoot: msg.chunkStateRoot,
        originHash: msg.originHash,
        binaryAccountsSlab: msg.payload,
        proofNodes: msg.proofNodes,
        hasRightHint: msg.hasRightHint,
      })
      const transfer =
        result.slab !== undefined &&
        result.slab.byteOffset === 0 &&
        result.slab.byteLength === result.slab.buffer.byteLength
          ? ([result.slab.buffer] as ArrayBuffer[])
          : []
      const out: WorkerResponse = { id: msg.id, result }
      port.postMessage(out, transfer)
      return
    }
    const result = await verifyStorageRangeJob({
      storageRoot: msg.storageRoot,
      accounts: msg.accounts,
      origin: msg.origin,
      replyPayload: msg.payload,
    })
    port.postMessage({ id: msg.id, result } satisfies WorkerResponse)
  } catch (err: unknown) {
    port.postMessage({
      id: msg.id,
      result: {
        ok: false,
        hasRight: false,
        count: 0,
        reason: err instanceof Error ? err.message : String(err),
      },
    } satisfies WorkerResponse)
  }
})
