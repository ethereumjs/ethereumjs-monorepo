import { parentPort } from 'node:worker_threads'

import { initEthyKeccak } from '../crypto/keccak.ts'
import { verifyAccountRangeJob, verifyStorageRangeJob } from './snapVerifyJob.ts'

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
      storageRoot: Uint8Array
      origin: Uint8Array
      payload: Uint8Array
    }

type WorkerResponse = {
  id: number
  result:
    | Awaited<ReturnType<typeof verifyAccountRangeJob>>
    | Awaited<ReturnType<typeof verifyStorageRangeJob>>
  transfer?: ArrayBuffer[]
}

if (parentPort === null) {
  throw new Error('snapVerifyWorkerEntry must run inside a Worker')
}

const port = parentPort

void initEthyKeccak().then(() => {
  port.on('message', async (msg: WorkerRequest) => {
    try {
      if (msg.kind === 'account') {
        const result = await verifyAccountRangeJob({
          stateRoot: msg.stateRoot,
          origin: msg.origin,
          payload: msg.payload,
        })
        const transfer: ArrayBuffer[] = []
        if (result.slab !== undefined) {
          transfer.push(result.slab.buffer.slice(0) as ArrayBuffer)
        }
        const out: WorkerResponse = { id: msg.id, result, transfer }
        port.postMessage(out, transfer)
        return
      }
      const result = await verifyStorageRangeJob({
        storageRoot: msg.storageRoot,
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
})
