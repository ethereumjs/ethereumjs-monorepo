import { verifyMerkleRangeProof } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import { SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE } from '@ethereumjs/statemanager'
import { bytesToBigInt } from '@ethereumjs/util'

import {
  accountRangeRowsFromRaw,
  compareBytes32,
  decodeAccountRangePayload,
} from './syntheticPeer.ts'

export type AccountRangeVerifyResult = {
  ok: boolean
  hasRight: boolean
  count: number
  reason?: string
  lastKey?: Uint8Array
  /** Verified rows packed as `32` hash + `104` binary per account. */
  slab?: Uint8Array
}

export type StorageRangeVerifyResult = {
  ok: boolean
  hasRight: boolean
  lastKey?: Uint8Array
  reason?: string
  slots?: Array<{ slotHash: Uint8Array; value: Uint8Array }>
}

function errorText(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

function asBytes(value: unknown): Uint8Array | undefined {
  if (value instanceof Uint8Array) return value
  if (value instanceof ArrayBuffer) return new Uint8Array(value)
  if (ArrayBuffer.isView(value)) {
    const view = value as ArrayBufferView
    return new Uint8Array(view.buffer, view.byteOffset, view.byteLength)
  }
  return undefined
}

/** CPU-heavy ACCOUNT_RANGE verify (safe to run off the main thread). */
export async function verifyAccountRangeJob(opts: {
  stateRoot: Uint8Array
  origin?: Uint8Array
  payload: Uint8Array
}): Promise<AccountRangeVerifyResult> {
  const decoded = decodeAccountRangePayload(opts.payload)
  if (decoded === undefined) return { ok: false, hasRight: false, count: 0 }
  const { accountsRaw, proof } = decoded
  if (accountsRaw.length === 0) {
    if (opts.origin !== undefined && proof.length > 0) {
      try {
        await verifyMerkleRangeProof(opts.stateRoot, opts.origin, null, [], [], proof)
        return { ok: true, hasRight: false, count: 0 }
      } catch (err: unknown) {
        return { ok: false, hasRight: false, count: 0, reason: errorText(err) }
      }
    }
    return {
      ok: false,
      hasRight: false,
      count: 0,
      reason: 'empty account range without proof',
    }
  }
  try {
    const slab = new Uint8Array(accountsRaw.length * SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE)
    const rows = accountRangeRowsFromRaw(accountsRaw, slab)
    if (rows === undefined) return { ok: false, hasRight: false, count: 0 }
    const { keys, values } = rows
    if (opts.origin !== undefined && compareBytes32(opts.origin, keys[keys.length - 1]!) > 0) {
      return {
        ok: false,
        hasRight: false,
        count: 0,
        reason: 'peer returned accounts below request origin',
      }
    }
    const firstKey = opts.origin ?? keys[0]!
    const lastKey = keys[keys.length - 1]!
    const hasRight = await verifyMerkleRangeProof(
      opts.stateRoot,
      firstKey,
      lastKey,
      keys,
      values,
      proof,
    )
    const lastKeyCopy = new Uint8Array(lastKey)
    return {
      ok: true,
      hasRight,
      count: keys.length,
      lastKey: lastKeyCopy,
      slab,
    }
  } catch (err: unknown) {
    return { ok: false, hasRight: false, count: 0, reason: errorText(err) }
  }
}

/** CPU-heavy STORAGE_RANGES verify (safe to run off the main thread). */
export async function verifyStorageRangeJob(opts: {
  storageRoot: Uint8Array
  replyPayload: Uint8Array
  origin: Uint8Array
}): Promise<StorageRangeVerifyResult> {
  let decoded: unknown[]
  try {
    decoded = RLP.decode(opts.replyPayload) as unknown[]
  } catch {
    return { ok: false, hasRight: false, reason: 'storage RLP decode failed' }
  }
  const ranges = decoded[1] as unknown
  const proofRaw = decoded[2]
  if (!Array.isArray(ranges) || ranges.length === 0) {
    return { ok: true, hasRight: false }
  }
  const slotsNested = ranges[0] as Array<[unknown, unknown]>
  if (!Array.isArray(slotsNested)) {
    return { ok: false, hasRight: false, reason: 'storage slots shape invalid' }
  }
  const keys: Uint8Array[] = []
  const values: Uint8Array[] = []
  const decodedSlots: Array<{ slotHash: Uint8Array; value: Uint8Array }> = []
  for (const [slotHashRaw, slotValueRlp] of slotsNested) {
    if (!(slotHashRaw instanceof Uint8Array) || !(slotValueRlp instanceof Uint8Array)) {
      return { ok: false, hasRight: false, reason: 'storage slot not bytes' }
    }
    if (slotValueRlp.length === 0) {
      return { ok: false, hasRight: false, reason: 'empty storage slot RLP' }
    }
    keys.push(slotHashRaw)
    values.push(slotValueRlp)
    let inner: Uint8Array
    try {
      const dec = RLP.decode(slotValueRlp)
      inner = dec instanceof Uint8Array ? dec : new Uint8Array(0)
    } catch {
      return { ok: false, hasRight: false, reason: 'storage slot inner decode failed' }
    }
    decodedSlots.push({ slotHash: slotHashRaw, value: inner })
  }
  let proof: Uint8Array[] | null = null
  if (Array.isArray(proofRaw)) {
    proof = proofRaw.map((n) => {
      if (!(n instanceof Uint8Array)) throw new Error('proof node not bytes')
      return n
    })
  }
  try {
    let hasRight: boolean
    if (proof !== null && proof.length === 0 && keys.length > 0) {
      hasRight = await verifyMerkleRangeProof(opts.storageRoot, null, null, keys, values, null)
    } else if (proof !== null && proof.length > 0 && keys.length > 0) {
      const lastKey = keys[keys.length - 1]!
      hasRight = await verifyMerkleRangeProof(
        opts.storageRoot,
        opts.origin,
        lastKey,
        keys,
        values,
        proof,
      )
    } else {
      return { ok: true, hasRight: false }
    }
    return { ok: true, hasRight, lastKey: keys[keys.length - 1], slots: decodedSlots }
  } catch (err: unknown) {
    return {
      ok: false,
      hasRight: false,
      reason: err instanceof Error ? err.message : String(err),
    }
  }
}

/** Read snap reply reqId from the outer RLP list header + element 0 in O(1) without decoding all accounts. */
export function snapReplyRequestId(payload: Uint8Array): bigint | undefined {
  if (payload.length < 2) return undefined
  const b0 = payload[0]!
  if (b0 < 0xc0) return undefined
  let pos: number
  if (b0 <= 0xf7) {
    pos = 1
  } else {
    const lenOfLen = b0 - 0xf7
    pos = 1 + lenOfLen
  }
  if (pos >= payload.length) return undefined
  const e0 = payload[pos]!
  if (e0 < 0x80) return BigInt(e0)
  if (e0 === 0x80) return 0n
  if (e0 <= 0xb7) {
    const sLen = e0 - 0x80
    if (pos + 1 + sLen > payload.length) return undefined
    return bytesToBigInt(payload.subarray(pos + 1, pos + 1 + sLen))
  }
  try {
    const decoded = RLP.decode(payload) as unknown[]
    const id = decoded[0]
    if (!(id instanceof Uint8Array)) return undefined
    if (id.length === 0) return 0n
    return bytesToBigInt(id)
  } catch {
    return undefined
  }
}
