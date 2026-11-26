import {
  type Devp2pWorkerClient,
  EthyMessageCodes,
  type WorkerPeerSnapshot,
} from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import type {
  AccountMissResult,
  CodeMissResult,
  StateResolutionPolicy,
  StorageMissResult,
} from '@ethereumjs/statemanager'
import {
  bigIntToUnpaddedBytes,
  bytesToUnprefixedHex,
  equalsBytes,
  intToUnpaddedBytes,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { ethyKeccak256 } from '../crypto/keccak.ts'
import { peerIdToBytes } from '../net/pivotHeader.ts'
import type { EthySpine } from '../spine/types.ts'
import { verifyStatyMultiProof } from '../staty/multiProofVerify.ts'
import type { StatyWriteIndex } from '../staty/writeIndex.ts'
import { verifyProvenAccountChunkJob } from '../sync/snapVerifyJob.ts'

const RESOLVER_TIMEOUT_MS = 12_000
const ACCOUNT_SLAB_STRIDE = 136

export type CustodyResolverDeps = {
  getClient: () => Devp2pWorkerClient | undefined
  getPeers: () => WorkerPeerSnapshot[]
  spine: EthySpine
  writeIndex: StatyWriteIndex
  snapBootstrapEnabled: boolean
  balEarliestBlock: () => bigint
}

type PendingEthy = {
  resolve: (payload: Uint8Array) => void
  reject: (err: Error) => void
  timer: ReturnType<typeof setTimeout>
}

let nextReqId = 1000n

export class CustodyStateResolver {
  private readonly deps: CustodyResolverDeps
  private readonly pending = new Map<string, PendingEthy>()

  constructor(deps: CustodyResolverDeps) {
    this.deps = deps
  }

  handleEthyResponse(peerId: string, code: number, payload: Uint8Array): void {
    if (
      code !== EthyMessageCodes.PROVEN_ACCOUNT_CHUNK &&
      code !== EthyMessageCodes.PROVEN_STORAGE_OR_CODE &&
      code !== EthyMessageCodes.STATE_WITNESS
    ) {
      return
    }
    const decoded = RLP.decode(payload) as unknown[]
    const reqIdBytes = decoded[0] as Uint8Array
    let reqKey: string
    try {
      reqKey = BigInt(`0x${bytesToUnprefixedHex(reqIdBytes)}`).toString(16)
    } catch {
      reqKey = bytesToUnprefixedHex(reqIdBytes)
    }
    const key = `${peerId}:${reqKey}`
    const row = this.pending.get(key)
    if (row === undefined) return
    clearTimeout(row.timer)
    this.pending.delete(key)
    row.resolve(payload)
  }

  private allocReqId(): bigint {
    nextReqId += 1n
    return nextReqId
  }

  private waitResponse(peerId: string, reqId: bigint): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const key = `${peerId}:${reqId.toString(16)}`
      const timer = setTimeout(() => {
        this.pending.delete(key)
        reject(new Error('custody ethy timeout'))
      }, RESOLVER_TIMEOUT_MS)
      this.pending.set(key, { resolve, reject, timer })
    })
  }

  private sendEthy(peerId: string, code: number, rlp: unknown[]): boolean {
    const client = this.deps.getClient()
    if (client === undefined) return false
    client.sendEthyMessage(peerIdToBytes(peerId), code, RLP.encode(rlp as never))
    return true
  }

  private pickCustodianForBucket(
    bucket: number,
    plane: 'accounts' | 'code' | 'storage',
  ): WorkerPeerSnapshot | undefined {
    const candidates = this.deps.getPeers().filter((p) => {
      if (p.ethySession !== true || p.ethyStatus === undefined) return false
      const st = p.ethyStatus
      const mask =
        plane === 'accounts'
          ? ethyMaskFromStatus(st, 'buckets')
          : plane === 'code'
            ? ethyMaskFromStatus(st, 'code')
            : ethyMaskFromStatus(st, 'storage')
      return (mask & (1 << bucket)) !== 0
    })
    if (candidates.length === 0) return undefined
    candidates.sort((a, b) => {
      const ab = BigInt(a.ethyStatus?.basePivotBlock ?? '0')
      const bb = BigInt(b.ethyStatus?.basePivotBlock ?? '0')
      return ab > bb ? -1 : ab < bb ? 1 : 0
    })
    return candidates[0]
  }

  resolveAccountMiss = async (
    accountHash: Uint8Array,
    policy: StateResolutionPolicy,
  ): Promise<AccountMissResult> => {
    const bucket = accountHash[0]! >> 4
    const witness = await this.tryWitnessAccount(accountHash, bucket)
    if (witness !== undefined) return witness
    const chunk = await this.tryAccountChunk(accountHash, bucket)
    if (chunk !== undefined) return chunk
    if (this.deps.snapBootstrapEnabled && policy === 'full') return undefined
    return undefined
  }

  resolveStorageMiss = async (
    _accountHash: Uint8Array,
    _slotHash: Uint8Array,
    policy: StateResolutionPolicy,
  ): Promise<StorageMissResult> => {
    if (this.deps.snapBootstrapEnabled && policy === 'full') return undefined
    return undefined
  }

  resolveCodeMiss = async (
    codeHash: Uint8Array,
    policy: StateResolutionPolicy,
  ): Promise<CodeMissResult> => {
    const bucket = codeHash[0]! >> 4
    const peer = this.pickCustodianForBucket(bucket, 'code')
    if (peer === undefined) {
      return this.deps.snapBootstrapEnabled && policy === 'full' ? undefined : undefined
    }
    const reqId = this.allocReqId()
    if (
      !this.sendEthy(peer.id, EthyMessageCodes.GET_PROVEN_STORAGE_OR_CODE, [
        bigIntToUnpaddedBytes(reqId),
        intToUnpaddedBytes(0),
        [codeHash],
      ])
    ) {
      return undefined
    }
    try {
      const raw = await this.waitResponse(peer.id, reqId)
      const decoded = RLP.decode(raw) as unknown[]
      if (Number(decoded[1]) !== 0) return undefined
      const pairs = decoded[2] as [Uint8Array, Uint8Array][]
      const row = pairs.find((p) => equalsBytes(p[0], codeHash))
      if (row === undefined) return undefined
      if (!equalsBytes(keccak_256(row[1]), codeHash)) return undefined
      return row[1]
    } catch {
      return undefined
    }
  }

  private async tryWitnessAccount(
    accountHash: Uint8Array,
    bucket: number,
  ): Promise<AccountMissResult | undefined> {
    const peer = this.pickCustodianForBucket(bucket, 'accounts')
    if (peer === undefined) return undefined
    const reqId = this.allocReqId()
    const minAnchor = this.deps.balEarliestBlock()
    if (
      !this.sendEthy(peer.id, EthyMessageCodes.GET_STATE_WITNESS, [
        bigIntToUnpaddedBytes(reqId),
        minAnchor,
        intToUnpaddedBytes(524_288),
        [[accountHash, []]],
      ])
    ) {
      return undefined
    }
    try {
      const raw = await this.waitResponse(peer.id, reqId)
      const decoded = RLP.decode(raw) as unknown[]
      const groups = decoded[1] as unknown[][]
      if (!Array.isArray(groups) || groups.length === 0) return undefined
      const anchorRoot = groups[0]![1] as Uint8Array
      const proofNodes = (decoded[2] as Uint8Array[]) ?? []
      const accounts = ((groups[0]![2] as [Uint8Array, Uint8Array][]) ?? []).map(([h, rlp]) => ({
        accountHash: h,
        accountRlpOrEmpty: rlp,
      }))
      const verified = await verifyStatyMultiProof(
        { anchorStateRoot: anchorRoot, accounts, slots: [], proofNodes },
        ethyKeccak256,
      )
      if (!verified.ok) return undefined
      const hit = accounts.find((a) => equalsBytes(a.accountHash, accountHash))
      if (hit === undefined) return 'empty'
      if (hit.accountRlpOrEmpty.length === 0) return 'empty'
      return hit.accountRlpOrEmpty
    } catch {
      return undefined
    }
  }

  private async tryAccountChunk(
    accountHash: Uint8Array,
    bucket: number,
  ): Promise<AccountMissResult | undefined> {
    const peer = this.pickCustodianForBucket(bucket, 'accounts')
    if (peer === undefined) return undefined
    const st = peer.ethyStatus!
    if (BigInt(st.basePivotBlock) < this.deps.balEarliestBlock()) return undefined
    const reqId = this.allocReqId()
    if (
      !this.sendEthy(peer.id, EthyMessageCodes.GET_PROVEN_ACCOUNT_CHUNK, [
        bigIntToUnpaddedBytes(reqId),
        intToUnpaddedBytes(bucket),
        accountHash,
      ])
    ) {
      return undefined
    }
    try {
      const raw = await this.waitResponse(peer.id, reqId)
      const decoded = RLP.decode(raw) as unknown[]
      const origin = decoded[2] as Uint8Array
      const last = decoded[3] as Uint8Array
      const slab = decoded[7] as Uint8Array
      const proofs = decoded[8] as Uint8Array[]
      const root = decoded[6] as Uint8Array
      const hasRight = Number(decoded[4] ?? 0) !== 0
      const verified = await verifyProvenAccountChunkJob({
        chunkStateRoot: root,
        originHash: origin,
        binaryAccountsSlab: slab,
        proofNodes: proofs,
        hasRightHint: hasRight,
      })
      if (!verified.ok) return undefined
      const binary = findAccountBinaryInSlab(slab, accountHash)
      if (binary !== undefined) return binary
      if (compareBytes32(accountHash, origin) >= 0 && compareBytes32(accountHash, last) <= 0) {
        const touched = this.deps.writeIndex.accountIndex(bytesToUnprefixedHex(accountHash))
        const chunkBlock = Number(st.basePivotBlock)
        if (touched === undefined) return 'empty'
        const lastWrite = Math.max(
          touched.lastBalanceBlock,
          touched.lastNonceBlock,
          touched.lastCodeBlock,
          touched.lastDeletedBlock,
        )
        if (lastWrite <= chunkBlock) return 'empty'
      }
      return undefined
    } catch {
      return undefined
    }
  }
}

export function createCustodyResolverHooks(resolver: CustodyStateResolver): {
  resolveAccountMiss: (
    accountHash: Uint8Array,
    policy: StateResolutionPolicy,
  ) => Promise<AccountMissResult>
  resolveStorageMiss: (
    accountHash: Uint8Array,
    slotHash: Uint8Array,
    policy: StateResolutionPolicy,
  ) => Promise<StorageMissResult>
  resolveCodeMiss: (codeHash: Uint8Array, policy: StateResolutionPolicy) => Promise<CodeMissResult>
} {
  return {
    resolveAccountMiss: (h, p) => resolver.resolveAccountMiss(h, p),
    resolveStorageMiss: (a, s, p) => resolver.resolveStorageMiss(a, s, p),
    resolveCodeMiss: (h, p) => resolver.resolveCodeMiss(h, p),
  }
}

function compareBytes32(a: Uint8Array, b: Uint8Array): number {
  for (let i = 0; i < 32; i++) {
    const d = (a[i] ?? 0) - (b[i] ?? 0)
    if (d !== 0) return d
  }
  return 0
}

function findAccountBinaryInSlab(
  slab: Uint8Array,
  accountHash: Uint8Array,
): Uint8Array | undefined {
  for (let off = 0; off + ACCOUNT_SLAB_STRIDE <= slab.length; off += ACCOUNT_SLAB_STRIDE) {
    if (equalsBytes(slab.subarray(off, off + 32), accountHash)) {
      return slab.subarray(off + 32, off + ACCOUNT_SLAB_STRIDE)
    }
  }
  return undefined
}

type EthyPeerStatusView = NonNullable<WorkerPeerSnapshot['ethyStatus']>

function ethyMaskFromStatus(st: EthyPeerStatusView, plane: 'buckets' | 'code' | 'storage'): number {
  const raw =
    plane === 'buckets'
      ? st.bucketsBitmask
      : plane === 'code'
        ? (st.codeBucketsBitmask ?? '0')
        : (st.storageBucketsBitmask ?? '0')
  if (raw.startsWith('0x')) return Number.parseInt(raw, 16)
  return Number.parseInt(raw, 10)
}
