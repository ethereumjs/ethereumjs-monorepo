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
  binaryAccountToAccount,
  bytesToBigInt,
  bytesToUnprefixedHex,
  createAccountFromRLP,
  equalsBytes,
  getBinaryAccountStorageRoot,
  intToUnpaddedBytes,
} from '@ethereumjs/util'

import { ethyKeccak256 } from '../crypto/keccak.ts'
import { peerIdToBytes } from '../net/pivotHeader.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'
import type { EthySpine } from '../spine/types.ts'
import { verifyStatyMultiProof } from '../staty/multiProofVerify.ts'
import { foldWitnessToHead } from '../staty/witnessFold.ts'
import type { WitnessFoldContext } from '../staty/witnessFold.ts'
import type { StatyWriteIndex } from '../staty/writeIndex.ts'
import { verifyProvenAccountChunkJob, verifyProvenStorageKind1Job } from '../sync/snapVerifyJob.ts'
import { pickEthyCodeCustodians, pickEthyCustodianForBucket } from './custodyPeerPick.ts'
import { ethyWireKind, findSlotInKind1Slab, parseProvenCodePairs } from './custodyStorageCodec.ts'
import { accountHashHex, buildWitnessFoldContext } from './custodyWitnessFold.ts'

const RESOLVER_TIMEOUT_MS = 12_000
const ACCOUNT_SLAB_STRIDE = 136
const WITNESS_BYTE_BUDGET = 524_288

export const CUSTODY_WITNESS_BATCH_MS_DEFAULT = 15
export const CUSTODY_WITNESS_BATCH_MS_MIN = 10
export const CUSTODY_WITNESS_BATCH_MS_MAX = 25

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
  /** Coalesce distinct witness lookups (10–25 ms, WP-16d). `0` flushes immediately (tests). */
  witnessBatchWindowMs?: number
}

type WitnessBatchEntry = {
  accountHash: Uint8Array
  callbacks: Array<(value: AccountMissResult | undefined) => void>
}

type WitnessBatchLane = {
  peer: WorkerPeerSnapshot
  bucket: number
  entries: WitnessBatchEntry[]
  timer?: ReturnType<typeof setTimeout>
}

type PendingEthy = {
  resolve: (payload: Uint8Array) => void
  reject: (err: Error) => void
  timer: ReturnType<typeof setTimeout>
}

let nextReqId = 1000n

function pendingEthyKey(peerId: string, reqId: bigint): string {
  return `${peerId.toLowerCase()}:${reqId.toString(16)}`
}

function reqIdFromRlpField(field: unknown): bigint | undefined {
  if (!(field instanceof Uint8Array)) return undefined
  try {
    return bytesToBigInt(field)
  } catch {
    try {
      return BigInt(`0x${bytesToUnprefixedHex(field)}`)
    } catch {
      return undefined
    }
  }
}

export class CustodyStateResolver {
  private readonly deps: CustodyResolverDeps
  private readonly pending = new Map<string, PendingEthy>()
  private readonly witnessBatches = new Map<string, WitnessBatchLane>()
  /** Short-lived storageRoot hint invalidated whenever local BALs touch the account. */
  private readonly storageRootByAccount = new Map<
    string,
    { root: Uint8Array | 'empty'; verifiedAtBlock: number }
  >()
  private readonly witnessBatchWindowMs: number

  constructor(deps: CustodyResolverDeps) {
    this.deps = deps
    const raw = deps.witnessBatchWindowMs ?? CUSTODY_WITNESS_BATCH_MS_DEFAULT
    if (raw === 0) {
      this.witnessBatchWindowMs = 0
    } else {
      this.witnessBatchWindowMs = Math.min(
        CUSTODY_WITNESS_BATCH_MS_MAX,
        Math.max(CUSTODY_WITNESS_BATCH_MS_MIN, raw),
      )
    }
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
    const reqId = reqIdFromRlpField(decoded[0])
    if (reqId === undefined) return
    const key = pendingEthyKey(peerId, reqId)
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
      const key = pendingEthyKey(peerId, reqId)
      const timer = setTimeout(() => {
        this.pending.delete(key)
        reject(new Error('custody ethy timeout'))
      }, RESOLVER_TIMEOUT_MS)
      this.pending.set(key, { resolve, reject, timer })
    })
  }

  private dropPending(peerId: string, reqId: bigint, err?: Error): void {
    const key = pendingEthyKey(peerId, reqId)
    const row = this.pending.get(key)
    if (row === undefined) return
    clearTimeout(row.timer)
    this.pending.delete(key)
    row.reject(err ?? new Error('custody ethy send failed'))
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
    opts?: { preferTrie?: boolean },
  ): WorkerPeerSnapshot | undefined {
    return pickEthyCustodianForBucket(this.deps.getPeers(), bucket, plane, opts)
  }

  private currentHeadBlockNumber(): number {
    return Number(
      this.deps.spine.lastVerifiedBlockNumber ??
        this.deps.spine.headBlockNumber ??
        this.deps.spine.pivotBlockNumber ??
        0n,
    )
  }

  private cacheStorageRoot(accountHash: Uint8Array, root: Uint8Array): void {
    const value = equalsBytes(root, KECCAK256_RLP) ? 'empty' : root
    this.storageRootByAccount.set(bytesToUnprefixedHex(accountHash), {
      root: value,
      verifiedAtBlock: this.currentHeadBlockNumber(),
    })
  }

  private cacheStorageRootFromBinary(accountHash: Uint8Array, binary: Uint8Array): void {
    this.cacheStorageRoot(accountHash, getBinaryAccountStorageRoot(binary))
  }

  private getFreshCachedStorageRoot(
    accountHash: Uint8Array,
    slotHash: Uint8Array,
  ): Uint8Array | 'empty' | undefined {
    const hex = bytesToUnprefixedHex(accountHash)
    const entry = this.storageRootByAccount.get(hex)
    if (entry === undefined) return undefined
    const touched = this.deps.writeIndex.accountIndex(hex)
    if (touched !== undefined) {
      const latestTouch = Math.max(
        touched.lastBalanceBlock,
        touched.lastNonceBlock,
        touched.lastCodeBlock,
        touched.lastDeletedBlock,
      )
      if (latestTouch > entry.verifiedAtBlock) {
        this.storageRootByAccount.delete(hex)
        return undefined
      }
    }
    const slotTouch = this.deps.writeIndex.lastSlotWriteBlock(hex, bytesToUnprefixedHex(slotHash))
    if (slotTouch !== undefined && slotTouch > entry.verifiedAtBlock) {
      this.storageRootByAccount.delete(hex)
      return undefined
    }
    return entry.root
  }

  resolveAccountMiss = async (
    accountHash: Uint8Array,
    policy: StateResolutionPolicy,
  ): Promise<AccountMissResult> => {
    if (policy === 'local-only') return undefined
    const bucket = accountHash[0]! >> 4
    const witness = await this.tryWitnessAccount(accountHash, bucket)
    if (witness instanceof Uint8Array) {
      this.cacheStorageRootFromBinary(accountHash, witness)
      return witness
    }
    if (witness === 'empty') return witness
    const chunk = await this.tryAccountChunk(accountHash, bucket)
    if (chunk instanceof Uint8Array) {
      this.cacheStorageRootFromBinary(accountHash, chunk)
      return chunk
    }
    if (chunk === 'empty') return chunk
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
    const storageRoot = await this.resolveStorageRootForAccount(accountHash, slotHash, bucket)
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
    if (policy === 'local-only') return undefined
    const preferredBucket = codeHash[0]! >> 4
    const peers = pickEthyCodeCustodians(this.deps.getPeers(), preferredBucket)
    if (peers.length === 0) {
      return this.deps.snapBootstrapEnabled && policy === 'full' ? undefined : undefined
    }
    for (const peer of peers.slice(0, 3)) {
      const reqId = this.allocReqId()
      const responsePromise = this.waitResponse(peer.id, reqId)
      if (
        !this.sendEthy(peer.id, EthyMessageCodes.GET_PROVEN_STORAGE_OR_CODE, [
          bigIntToUnpaddedBytes(reqId),
          intToUnpaddedBytes(0),
          [codeHash],
        ])
      ) {
        this.dropPending(peer.id, reqId)
        continue
      }
      try {
        const raw = await responsePromise
        const decoded = RLP.decode(raw) as unknown[]
        const pairs = parseProvenCodePairs(decoded)
        const row = pairs.find((p) => equalsBytes(p[0], codeHash))
        if (row === undefined) continue
        if (!equalsBytes(ethyKeccak256(row[1]), codeHash)) continue
        this.deps.snapStore?.appendCode(codeHash, row[1])
        return row[1]
      } catch {
        continue
      }
    }
    return undefined
  }

  private tryWitnessAccount(
    accountHash: Uint8Array,
    bucket: number,
  ): Promise<AccountMissResult | undefined> {
    const peer = this.pickCustodianForBucket(bucket, 'accounts', { preferTrie: true })
    if (peer === undefined) return Promise.resolve(undefined)
    const laneKey = `${peer.id.toLowerCase()}:${bucket}`
    return new Promise((resolve) => {
      let lane = this.witnessBatches.get(laneKey)
      if (lane === undefined) {
        lane = { peer, bucket, entries: [] }
        this.witnessBatches.set(laneKey, lane)
      }
      const existing = lane.entries.find((e) => equalsBytes(e.accountHash, accountHash))
      if (existing !== undefined) {
        existing.callbacks.push(resolve)
        return
      }
      lane.entries.push({ accountHash, callbacks: [resolve] })
      if (this.witnessBatchWindowMs === 0) {
        void this.flushWitnessBatch(laneKey)
        return
      }
      if (lane.timer === undefined) {
        lane.timer = setTimeout(() => {
          void this.flushWitnessBatch(laneKey)
        }, this.witnessBatchWindowMs)
      }
    })
  }

  private async flushWitnessBatch(laneKey: string): Promise<void> {
    const lane = this.witnessBatches.get(laneKey)
    if (lane === undefined) return
    this.witnessBatches.delete(laneKey)
    if (lane.timer !== undefined) clearTimeout(lane.timer)
    const entries = lane.entries
    if (entries.length === 0) return

    const uniqueHashes = entries.map((e) => e.accountHash)

    const settle = (results: Map<string, AccountMissResult | undefined>) => {
      for (const entry of entries) {
        const key = bytesToUnprefixedHex(entry.accountHash)
        const value = results.get(key)
        for (const cb of entry.callbacks) cb(value)
      }
    }

    const reqId = this.allocReqId()
    const minAnchor = this.deps.balEarliestBlock()
    const queries = uniqueHashes.map((h) => [h, []])
    const responsePromise = this.waitResponse(lane.peer.id, reqId)
    if (
      !this.sendEthy(lane.peer.id, EthyMessageCodes.GET_STATE_WITNESS, [
        bigIntToUnpaddedBytes(reqId),
        bigIntToUnpaddedBytes(minAnchor),
        intToUnpaddedBytes(WITNESS_BYTE_BUDGET),
        queries,
      ])
    ) {
      this.dropPending(lane.peer.id, reqId)
      settle(new Map())
      return
    }
    try {
      const raw = await responsePromise
      const results = await this.accountResultsFromWitness(uniqueHashes, raw, minAnchor)
      settle(results)
    } catch {
      settle(new Map())
    }
  }

  private async accountResultsFromWitness(
    accountHashes: Uint8Array[],
    raw: Uint8Array,
    minAnchor: bigint,
  ): Promise<Map<string, AccountMissResult | undefined>> {
    const out = new Map<string, AccountMissResult | undefined>()
    for (const h of accountHashes) out.set(bytesToUnprefixedHex(h), undefined)

    const decoded = RLP.decode(raw) as unknown[]
    const groups = decoded[1] as unknown[][]
    if (!Array.isArray(groups) || groups.length === 0) return out

    const pending = new Set(accountHashes.map((h) => bytesToUnprefixedHex(h)))
    const ctx =
      this.deps.foldContext?.() ?? buildWitnessFoldContext(this.deps.spine, this.deps.writeIndex)
    const client = this.deps.getClient()

    for (const group of groups) {
      if (!Array.isArray(group) || group.length < 5) continue
      const anchorBlock = fieldToBlockNumber(group[0])
      if (BigInt(anchorBlock) < minAnchor) continue
      const anchorRoot = group[1]
      if (!(anchorRoot instanceof Uint8Array) || anchorRoot.length !== 32) continue
      const expectedRoot = ctx.stateRootAt(anchorBlock)
      if (expectedRoot === undefined || !equalsBytes(expectedRoot, anchorRoot)) continue

      const proofNodes = (group[4] as Uint8Array[]) ?? []
      const wireAccounts = (group[2] as [Uint8Array, Uint8Array][]) ?? []
      const accounts = wireAccounts.map(([h, rlp]) => ({
        accountHash: h,
        accountRlpOrEmpty: rlp,
      }))
      const verified = await verifyStatyMultiProof(
        { anchorStateRoot: anchorRoot, accounts, slots: [], proofNodes },
        ethyKeccak256,
      )
      if (!verified.ok) continue

      for (const accountHash of accountHashes) {
        const key = bytesToUnprefixedHex(accountHash)
        if (!pending.has(key) || out.get(key) !== undefined) continue
        const hit = accounts.find((a) => equalsBytes(a.accountHash, accountHash))
        // Omitted keys in 0x0c STATE_WITNESS are cache misses (NOT proven-empty).
        if (hit === undefined) continue

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
        if (!folded.ok) continue

        if (typeof client?.putEthyWitness === 'function') {
          try {
            client.putEthyWitness({
              accountHash,
              anchorBlock: BigInt(anchorBlock),
              anchorStateRoot: anchorRoot,
              accountRlpOrEmpty: hit.accountRlpOrEmpty,
              slots: [],
              proofNodes,
            })
          } catch {
            // Best-effort witness cache-back for P2P re-serving.
          }
        }

        if (folded.provenEmptyAccount) {
          out.set(key, 'empty')
          pending.delete(key)
          continue
        }
        if (folded.account !== undefined) {
          out.set(key, accountToBinaryAccount(folded.account))
          pending.delete(key)
        }
      }
    }
    return out
  }

  private async resolveStorageRootForAccount(
    accountHash: Uint8Array,
    slotHash: Uint8Array,
    bucket: number,
  ): Promise<Uint8Array | 'empty' | undefined> {
    const cached = this.getFreshCachedStorageRoot(accountHash, slotHash)
    if (cached !== undefined) return cached
    const witness = await this.tryWitnessAccount(accountHash, bucket)
    if (witness === 'empty') {
      this.storageRootByAccount.set(bytesToUnprefixedHex(accountHash), {
        root: 'empty',
        verifiedAtBlock: this.currentHeadBlockNumber(),
      })
      return 'empty'
    }
    if (witness instanceof Uint8Array) {
      const root = getBinaryAccountStorageRoot(witness)
      this.cacheStorageRoot(accountHash, root)
      return equalsBytes(root, KECCAK256_RLP) ? 'empty' : root
    }
    const chunk = await this.tryAccountChunk(accountHash, bucket)
    if (chunk === 'empty') {
      this.storageRootByAccount.set(bytesToUnprefixedHex(accountHash), {
        root: 'empty',
        verifiedAtBlock: this.currentHeadBlockNumber(),
      })
      return 'empty'
    }
    if (chunk instanceof Uint8Array) {
      const root = getBinaryAccountStorageRoot(chunk)
      this.cacheStorageRoot(accountHash, root)
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
    const responsePromise = this.waitResponse(peer.id, reqId)
    if (
      !this.sendEthy(peer.id, EthyMessageCodes.GET_PROVEN_STORAGE_OR_CODE, [
        bigIntToUnpaddedBytes(reqId),
        intToUnpaddedBytes(1),
        accountHash,
        storageRoot,
        slotHash,
      ])
    ) {
      this.dropPending(peer.id, reqId)
      return undefined
    }
    try {
      const raw = await responsePromise
      const decoded = RLP.decode(raw) as unknown[]
      if (ethyWireKind(decoded[1]) !== 1) return undefined
      const responseRoot = decoded[3]
      if (!(responseRoot instanceof Uint8Array) || !equalsBytes(responseRoot, storageRoot)) {
        return undefined
      }
      const chunkBlock =
        fieldToBlockNumber(decoded[4]) || Number(peer.ethyStatus?.basePivotBlock ?? '0')
      const origin = decoded[5] as Uint8Array
      const last = decoded[6] as Uint8Array
      const hasRight = ethyWireKind(decoded[7]) !== 0
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
      if (
        origin instanceof Uint8Array &&
        origin.length === 32 &&
        last instanceof Uint8Array &&
        last.length === 32
      ) {
        this.deps.snapStore?.appendProvenStorageChunk({
          accountHash,
          storageRoot,
          chunkBlockNumber: BigInt(chunkBlock),
          originSlotHash: origin,
          lastSlotHash: last,
          hasRight: hasRight ? 1 : 0,
          slotsSlab64B: slab,
          proofNodes: proofs,
        })
      }
      const accountHex = bytesToUnprefixedHex(accountHash)
      const slotHex = bytesToUnprefixedHex(slotHash)
      const touched = this.deps.writeIndex.lastSlotWriteBlock(accountHex, slotHex)
      const hit = findSlotInKind1Slab(slab, slotHash)
      if (hit !== undefined) {
        if (touched !== undefined && touched > chunkBlock) return undefined
        return hit
      }
      const inInterior =
        slab.length > 0 &&
        compareBytes32(slotHash, origin) >= 0 &&
        compareBytes32(slotHash, last) <= 0
      const pastTail =
        !hasRight &&
        ((slab.length > 0 && compareBytes32(slotHash, last) > 0) ||
          (slab.length === 0 && compareBytes32(slotHash, origin) >= 0))
      if ((inInterior || pastTail) && (touched === undefined || touched <= chunkBlock)) {
        return 'empty'
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
    const responsePromise = this.waitResponse(peer.id, reqId)
    if (
      !this.sendEthy(peer.id, EthyMessageCodes.GET_PROVEN_ACCOUNT_CHUNK, [
        bigIntToUnpaddedBytes(reqId),
        intToUnpaddedBytes(bucket),
        accountHash,
      ])
    ) {
      this.dropPending(peer.id, reqId)
      return undefined
    }
    try {
      const raw = await responsePromise
      const decoded = RLP.decode(raw) as unknown[]
      const origin = decoded[2] as Uint8Array
      const last = decoded[3] as Uint8Array
      const root = decoded[5] as Uint8Array
      const chunkBlock = fieldToBlockNumber(decoded[6]) || Number(st.basePivotBlock)
      if (BigInt(chunkBlock) < this.deps.balEarliestBlock()) return undefined
      const ctx =
        this.deps.foldContext?.() ?? buildWitnessFoldContext(this.deps.spine, this.deps.writeIndex)
      const expectedRoot = ctx.stateRootAt(chunkBlock)
      if (
        expectedRoot === undefined ||
        !(root instanceof Uint8Array) ||
        !equalsBytes(expectedRoot, root)
      ) {
        return undefined
      }
      const slab = decoded[7] as Uint8Array
      const proofs = decoded[8] as Uint8Array[]
      const hasRight = ethyWireKind(decoded[4]) !== 0
      const verified = await verifyProvenAccountChunkJob({
        chunkStateRoot: root,
        originHash: origin,
        binaryAccountsSlab: slab,
        proofNodes: proofs,
        hasRightHint: hasRight,
      })
      if (!verified.ok) return undefined
      const binary = findAccountBinaryInSlab(slab, accountHash)
      if (binary !== undefined) {
        const head = Number(
          this.deps.spine.headBlockNumber ??
            this.deps.spine.lastVerifiedBlockNumber ??
            st.basePivotBlock,
        )
        if (head > chunkBlock) {
          const folded = foldWitnessToHead(
            {
              anchorBlock: chunkBlock,
              anchorStateRoot: root,
              accountHashHex: accountHashHex(accountHash),
              accountRlpOrEmpty: binaryAccountToAccount(binary).serialize(),
            },
            ctx,
          )
          if (!folded.ok) return undefined
          if (folded.provenEmptyAccount) return 'empty'
          if (folded.account !== undefined) {
            return accountToBinaryAccount(folded.account)
          }
          return undefined
        }
        return binary
      }
      const inInterior =
        slab.length > 0 &&
        compareBytes32(accountHash, origin) >= 0 &&
        compareBytes32(accountHash, last) <= 0
      const pastTail =
        !hasRight &&
        ((slab.length > 0 && compareBytes32(accountHash, last) > 0) ||
          (slab.length === 0 && compareBytes32(accountHash, origin) >= 0))
      if (inInterior || pastTail) {
        const touched = this.deps.writeIndex.accountIndex(bytesToUnprefixedHex(accountHash))
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
