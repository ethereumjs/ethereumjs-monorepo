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
  BINARY_ACCOUNT_SIZE,
  KECCAK256_RLP,
  accountToBinaryAccount,
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToUnprefixedHex,
  createAccountFromRLP,
  equalsBytes,
  getBinaryAccountStorageRoot,
  intToUnpaddedBytes,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { ethyKeccak256 } from '../crypto/keccak.ts'
import { peerIdToBytes } from '../net/pivotHeader.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'
import type { EthySpine } from '../spine/types.ts'
import { verifyStatyMultiProof } from '../staty/multiProofVerify.ts'
import { foldWitnessToHead } from '../staty/witnessFold.ts'
import type { WitnessFoldContext } from '../staty/witnessFold.ts'
import type { StatyWriteIndex } from '../staty/writeIndex.ts'
import { verifyProvenAccountChunkJob, verifyProvenStorageKind1Job } from '../sync/snapVerifyJob.ts'
import { pickEthyCustodianForBucket } from './custodyPeerPick.ts'
import { findSlotInKind1Slab, parseProvenCodePairs } from './custodyStorageCodec.ts'
import { accountHashHex, buildWitnessFoldContext } from './custodyWitnessFold.ts'

const RESOLVER_TIMEOUT_MS = 12_000
const ACCOUNT_SLAB_STRIDE = 136

export type CustodyResolverDeps = {
  getClient: () => Devp2pWorkerClient | undefined
  getPeers: () => WorkerPeerSnapshot[]
  spine: EthySpine
  writeIndex: StatyWriteIndex
  snapStore?: SnapPivotStore
  snapBootstrapEnabled: boolean
  balEarliestBlock: () => bigint
  /** Optional fold context override (defaults to spine + writeIndex builder). */
  foldContext?: () => WitnessFoldContext
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
    return pickEthyCustodianForBucket(this.deps.getPeers(), bucket, plane)
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
    accountHash: Uint8Array,
    slotHash: Uint8Array,
    policy: StateResolutionPolicy,
  ): Promise<StorageMissResult> => {
    if (policy === 'local-only') return undefined
    const bucket = accountHash[0]! >> 4
    const storageRoot = await this.resolveStorageRootForAccount(accountHash, bucket)
    if (storageRoot === 'empty') return 'empty'
    if (storageRoot === undefined) {
      return this.deps.snapBootstrapEnabled && policy === 'full' ? undefined : undefined
    }
    const peer = this.pickCustodianForBucket(bucket, 'storage')
    if (peer === undefined) {
      return this.deps.snapBootstrapEnabled && policy === 'full' ? undefined : undefined
    }
    return this.tryStorageKind1(peer, accountHash, storageRoot, slotHash)
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
      const pairs = parseProvenCodePairs(decoded)
      const row = pairs.find((p) => equalsBytes(p[0], codeHash))
      if (row === undefined) return undefined
      if (!equalsBytes(keccak_256(row[1]), codeHash)) return undefined
      this.deps.snapStore?.appendCode(codeHash, row[1])
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
      const anchorBlock = Number(peer.ethyStatus?.basePivotBlock ?? minAnchor)
      const ctx =
        this.deps.foldContext?.() ?? buildWitnessFoldContext(this.deps.spine, this.deps.writeIndex)
      const folded = foldWitnessToHead(
        {
          anchorBlock,
          anchorStateRoot: anchorRoot,
          accountHashHex: accountHashHex(accountHash),
          accountRlpOrEmpty: hit.accountRlpOrEmpty,
          slotWitnesses: [],
        },
        ctx,
      )
      if (folded.ok && folded.provenEmptyAccount) return 'empty'
      if (folded.ok && folded.account !== undefined) {
        return accountToBinaryAccount(folded.account)
      }
      return accountMissFromRlpOrBinary(hit.accountRlpOrEmpty)
    } catch {
      return undefined
    }
  }

  private async resolveStorageRootForAccount(
    accountHash: Uint8Array,
    bucket: number,
  ): Promise<Uint8Array | 'empty' | undefined> {
    const witness = await this.tryWitnessAccount(accountHash, bucket)
    if (witness === 'empty') return 'empty'
    if (witness instanceof Uint8Array) {
      const root = getBinaryAccountStorageRoot(witness)
      return equalsBytes(root, KECCAK256_RLP) ? 'empty' : root
    }
    const chunk = await this.tryAccountChunk(accountHash, bucket)
    if (chunk === 'empty') return 'empty'
    if (chunk instanceof Uint8Array) {
      const root = getBinaryAccountStorageRoot(chunk)
      return equalsBytes(root, KECCAK256_RLP) ? 'empty' : root
    }
    return undefined
  }

  private async tryStorageKind1(
    peer: WorkerPeerSnapshot,
    accountHash: Uint8Array,
    storageRoot: Uint8Array,
    slotHash: Uint8Array,
  ): Promise<StorageMissResult> {
    const reqId = this.allocReqId()
    if (
      !this.sendEthy(peer.id, EthyMessageCodes.GET_PROVEN_STORAGE_OR_CODE, [
        bigIntToUnpaddedBytes(reqId),
        intToUnpaddedBytes(1),
        accountHash,
        storageRoot,
        slotHash,
      ])
    ) {
      return undefined
    }
    try {
      const raw = await this.waitResponse(peer.id, reqId)
      const decoded = RLP.decode(raw) as unknown[]
      if (Number(decoded[1]) !== 1) return undefined
      const responseRoot = decoded[3]
      if (!(responseRoot instanceof Uint8Array) || !equalsBytes(responseRoot, storageRoot)) {
        return undefined
      }
      const chunkBlock = fieldToBlockNumber(decoded[4])
      const origin = decoded[5] as Uint8Array
      const last = decoded[6] as Uint8Array
      const hasRight = Number(decoded[7] ?? 0) !== 0
      const slab = (decoded[8] as Uint8Array) ?? new Uint8Array(0)
      const proofs = (decoded[9] as Uint8Array[]) ?? []
      const verified = await verifyProvenStorageKind1Job({
        storageRoot,
        originSlotHash: origin,
        slotsSlab64B: slab,
        proofNodes: proofs,
        hasRightHint: hasRight,
      })
      if (!verified.ok) return undefined
      const hit = findSlotInKind1Slab(slab, slotHash)
      if (hit !== undefined) return hit
      if (
        compareBytes32(slotHash, origin) >= 0 &&
        compareBytes32(slotHash, last) <= 0 &&
        slab.length > 0
      ) {
        const accountHex = bytesToUnprefixedHex(accountHash)
        const slotHex = bytesToUnprefixedHex(slotHash)
        const touched = this.deps.writeIndex.lastSlotWriteBlock(accountHex, slotHex)
        const pivotBlock = Number(peer.ethyStatus?.basePivotBlock ?? chunkBlock)
        if (touched === undefined || touched <= chunkBlock || touched <= pivotBlock) {
          return 'empty'
        }
      }
      return undefined
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

export function accountMissFromRlpOrBinary(body: Uint8Array): AccountMissResult {
  if (body.length === 0) return 'empty'
  if (body.length === BINARY_ACCOUNT_SIZE) return body
  return accountToBinaryAccount(createAccountFromRLP(body))
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

function fieldToBlockNumber(field: unknown): number {
  if (field instanceof Uint8Array) {
    try {
      return Number(bytesToBigInt(field))
    } catch {
      return 0
    }
  }
  return 0
}
