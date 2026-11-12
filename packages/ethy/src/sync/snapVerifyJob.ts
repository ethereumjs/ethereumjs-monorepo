import { type HashKeysFunction, verifyMerkleRangeProof } from '@ethereumjs/mpt'

import { RLP } from '@ethereumjs/rlp'
import { SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE } from '@ethereumjs/statemanager'
import { binaryAccountToRLP, bytesToBigInt, equalsBytes } from '@ethereumjs/util'
import { ethyKeccak256, initEthyKeccak } from '../crypto/keccak.ts'

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
  /** Range origin used for Merkle verify (request origin or first key). */
  rangeOrigin?: Uint8Array
  proofNodes?: Uint8Array[]
}

export type ProvenChunkVerifyResult = {
  ok: boolean
  hasRight: boolean
  count: number
  reason?: string
  lastKey?: Uint8Array
  slab?: Uint8Array
  rangeOrigin?: Uint8Array
}

export type StorageAccountVerifyResult = {
  accountIndex: number
  ok: boolean
  hasRight: boolean
  lastKey?: Uint8Array
  reason?: string
  slots?: Array<{ slotHash: Uint8Array; value: Uint8Array }>
}

export type StorageRangeVerifyResult = {
  ok: boolean
  hasRight: boolean
  lastKey?: Uint8Array
  reason?: string
  slots?: Array<{ slotHash: Uint8Array; value: Uint8Array }>
  perAccount?: StorageAccountVerifyResult[]
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
export async function verifyAccountRangeJob(
  opts: {
    stateRoot: Uint8Array
    origin?: Uint8Array
    payload: Uint8Array
  },
  useKeyHashingFunction: HashKeysFunction = ethyKeccak256,
): Promise<AccountRangeVerifyResult> {
  await initEthyKeccak()
  const decoded = decodeAccountRangePayload(opts.payload)
  if (decoded === undefined) return { ok: false, hasRight: false, count: 0 }
  const { accountsRaw, proof } = decoded
  if (accountsRaw.length === 0) {
    if (opts.origin !== undefined && proof.length > 0) {
      try {
        await verifyMerkleRangeProof(
          opts.stateRoot,
          opts.origin,
          null,
          [],
          [],
          proof,
          useKeyHashingFunction,
        )
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
    if (rows === undefined) {
      return {
        ok: false,
        hasRight: false,
        count: 0,
        reason: 'malformed account range entry',
      }
    }
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
      useKeyHashingFunction,
    )
    const lastKeyCopy = new Uint8Array(lastKey)
    const originCopy = new Uint8Array(firstKey)
    const proofCopy = proof.map((node) => {
      const copy = new Uint8Array(node.length)
      copy.set(node)
      return copy
    })
    return {
      ok: true,
      hasRight,
      count: keys.length,
      lastKey: lastKeyCopy,
      slab,
      rangeOrigin: originCopy,
      proofNodes: proofCopy,
    }
  } catch (err: unknown) {
    return { ok: false, hasRight: false, count: 0, reason: errorText(err) }
  }
}

/** CPU-heavy ETHY/0 PROVEN_ACCOUNT_CHUNK verify (safe off the main thread). */
export async function verifyProvenAccountChunkJob(
  opts: {
    chunkStateRoot: Uint8Array
    originHash: Uint8Array
    binaryAccountsSlab: Uint8Array
    proofNodes: Uint8Array[]
    hasRightHint: boolean
  },
  useKeyHashingFunction: HashKeysFunction = ethyKeccak256,
): Promise<ProvenChunkVerifyResult> {
  await initEthyKeccak()
  const slab = opts.binaryAccountsSlab
  if (slab.length === 0 || slab.length % SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE !== 0) {
    return { ok: false, hasRight: false, count: 0, reason: 'invalid proven chunk slab length' }
  }
  const count = slab.length / SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE
  const keys: Uint8Array[] = []
  const values: Uint8Array[] = []
  for (let i = 0; i < count; i++) {
    const off = i * SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE
    const accountHash = slab.subarray(off, off + 32)
    keys.push(new Uint8Array(accountHash))
    values.push(binaryAccountToRLP(slab, off + 32))
  }
  if (compareBytes32(opts.originHash, keys[0]!) > 0) {
    return { ok: false, hasRight: false, count: 0, reason: 'chunk origin mismatch' }
  }
  const lastKey = keys[keys.length - 1]!
  try {
    const hasRight = await verifyMerkleRangeProof(
      opts.chunkStateRoot,
      opts.originHash,
      lastKey,
      keys,
      values,
      opts.proofNodes,
      useKeyHashingFunction,
    )
    const ownedSlab = new Uint8Array(slab)
    return {
      ok: true,
      hasRight: opts.hasRightHint || hasRight,
      count,
      lastKey: new Uint8Array(lastKey),
      slab: ownedSlab,
      rangeOrigin: new Uint8Array(opts.originHash),
    }
  } catch (err: unknown) {
    return { ok: false, hasRight: false, count: 0, reason: errorText(err) }
  }
}

function decodeSlotList(slotsNested: unknown):
  | {
      ok: true
      keys: Uint8Array[]
      values: Uint8Array[]
      decodedSlots: Array<{ slotHash: Uint8Array; value: Uint8Array }>
    }
  | { ok: false; reason: string } {
  if (!Array.isArray(slotsNested)) {
    return { ok: false, reason: 'storage slots shape invalid' }
  }
  const keys: Uint8Array[] = []
  const values: Uint8Array[] = []
  const decodedSlots: Array<{ slotHash: Uint8Array; value: Uint8Array }> = []
  for (const row of slotsNested) {
    if (!Array.isArray(row) || row.length < 2) {
      return { ok: false, reason: 'storage slot row invalid' }
    }
    const slotHashRaw = row[0]
    const slotValueRlp = row[1]
    if (!(slotHashRaw instanceof Uint8Array) || !(slotValueRlp instanceof Uint8Array)) {
      return { ok: false, reason: 'storage slot not bytes' }
    }
    if (slotValueRlp.length === 0) {
      return { ok: false, reason: 'empty storage slot RLP' }
    }
    keys.push(slotHashRaw)
    values.push(slotValueRlp)
    let inner: Uint8Array
    try {
      const dec = RLP.decode(slotValueRlp)
      inner = dec instanceof Uint8Array ? dec : new Uint8Array(0)
    } catch {
      return { ok: false, reason: 'storage slot inner decode failed' }
    }
    decodedSlots.push({ slotHash: slotHashRaw, value: inner })
  }
  return { ok: true, keys, values, decodedSlots }
}

async function verifyAccountSlotList(
  storageRoot: Uint8Array,
  origin: Uint8Array,
  keys: Uint8Array[],
  values: Uint8Array[],
  proof: Uint8Array[] | null,
  isLastInReply: boolean,
  useKeyHashingFunction: HashKeysFunction,
): Promise<{ ok: true; hasRight: boolean } | { ok: false; reason: string }> {
  if (keys.length === 0) {
    return { ok: true, hasRight: false }
  }
  try {
    let hasRight: boolean
    if (proof !== null && proof.length === 0) {
      hasRight = await verifyMerkleRangeProof(
        storageRoot,
        null,
        null,
        keys,
        values,
        null,
        useKeyHashingFunction,
      )
    } else if (isLastInReply && proof !== null && proof.length > 0) {
      const lastKey = keys[keys.length - 1]!
      hasRight = await verifyMerkleRangeProof(
        storageRoot,
        origin,
        lastKey,
        keys,
        values,
        proof,
        useKeyHashingFunction,
      )
    } else {
      hasRight = await verifyMerkleRangeProof(
        storageRoot,
        null,
        null,
        keys,
        values,
        null,
        useKeyHashingFunction,
      )
    }
    return { ok: true, hasRight }
  } catch (err: unknown) {
    return { ok: false, reason: errorText(err) }
  }
}

/** CPU-heavy STORAGE_RANGES verify (safe to run off the main thread). */
export async function verifyStorageRangeJob(
  opts: {
    storageRoot?: Uint8Array
    accounts?: Array<{ accountHash: Uint8Array; storageRoot: Uint8Array }>
    replyPayload: Uint8Array
    origin: Uint8Array
  },
  useKeyHashingFunction: HashKeysFunction = ethyKeccak256,
): Promise<StorageRangeVerifyResult> {
  await initEthyKeccak()
  const accounts =
    opts.accounts ??
    (opts.storageRoot !== undefined
      ? [{ accountHash: new Uint8Array(32), storageRoot: opts.storageRoot }]
      : [])
  let decoded: unknown[]
  try {
    decoded = RLP.decode(opts.replyPayload) as unknown[]
  } catch {
    return { ok: false, hasRight: false, reason: 'storage RLP decode failed' }
  }
  const ranges = decoded[1] as unknown
  const proofRaw = decoded[2]
  if (!Array.isArray(ranges)) {
    return { ok: false, hasRight: false, reason: 'storage ranges not array' }
  }
  let proof: Uint8Array[] | null = null
  if (Array.isArray(proofRaw)) {
    try {
      proof = proofRaw.map((n) => {
        if (!(n instanceof Uint8Array)) throw new Error('proof node not bytes')
        return n
      })
    } catch (err: unknown) {
      return { ok: false, hasRight: false, reason: errorText(err) }
    }
  }
  if (ranges.length === 0) {
    if (proof !== null && proof.length > 0 && accounts.length > 0) {
      try {
        await verifyMerkleRangeProof(
          accounts[0]!.storageRoot,
          opts.origin,
          null,
          [],
          [],
          proof,
          useKeyHashingFunction,
        )
        return {
          ok: true,
          hasRight: false,
          perAccount: [{ accountIndex: 0, ok: true, hasRight: false, slots: [] }],
        }
      } catch (err: unknown) {
        return {
          ok: true,
          hasRight: false,
          perAccount: [{ accountIndex: 0, ok: false, hasRight: false, reason: errorText(err) }],
        }
      }
    }
    return { ok: false, hasRight: false, reason: 'empty storage range without proof' }
  }
  const perAccount: StorageAccountVerifyResult[] = []
  let flightHasRight = false
  for (let i = 0; i < ranges.length; i++) {
    const parsed = decodeSlotList(ranges[i])
    if (!parsed.ok) {
      return { ok: false, hasRight: false, reason: parsed.reason }
    }
    const storageRoot = accounts[i]?.storageRoot ?? accounts[0]?.storageRoot
    if (storageRoot === undefined) {
      return { ok: false, hasRight: false, reason: 'storage account root missing' }
    }
    const isLast = i === ranges.length - 1
    const verified = await verifyAccountSlotList(
      storageRoot,
      opts.origin,
      parsed.keys,
      parsed.values,
      proof,
      isLast,
      useKeyHashingFunction,
    )
    if (!verified.ok) {
      perAccount.push({
        accountIndex: i,
        ok: false,
        hasRight: false,
        reason: verified.reason,
      })
      continue
    }
    const hasRight = verified.hasRight
    if (hasRight) flightHasRight = true
    perAccount.push({
      accountIndex: i,
      ok: true,
      hasRight,
      lastKey: parsed.keys[parsed.keys.length - 1],
      slots: parsed.decodedSlots,
    })
  }
  const first = perAccount[0]
  return {
    ok: true,
    hasRight: flightHasRight,
    lastKey: first?.lastKey,
    slots: first?.slots,
    perAccount,
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
