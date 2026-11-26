import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import { verifyMerkleRangeProof } from '@ethereumjs/mpt'
import { bytesToUnprefixedHex, compareBytes } from '@ethereumjs/util'

function compareBytes32(a: Uint8Array, b: Uint8Array): number {
  const len = Math.min(a.length, b.length)
  for (let i = 0; i < len; i++) {
    if (a[i]! < b[i]!) return -1
    if (a[i]! > b[i]!) return 1
  }
  return a.length - b.length
}
import { ethyKeccak256 } from '../crypto/keccak.ts'
import { appendProofRecordSync, proofSidecarPathForJournal } from '../persist/proofSidecar.ts'
import type { StatyMultiProofGroup } from '../staty/multiProofVerify.ts'
import { MACRO_GENERATION_GRID_BLOCKS } from '../sync/blockCalendar.ts'
import { BucketSubtreeTrie } from './bucketSubtreeTrie.ts'
import { encodeRootBranch } from './rootBranchAssembler.ts'

export type WitnessBuildQuery = { accountHash: Uint8Array; slotHashes: Uint8Array[] }

const MAX_PROOF_NODES = 4096
const MAX_WITNESS_BYTES = 512 * 1024

function dedupeProofNodes(nodes: Uint8Array[]): Uint8Array[] {
  const seen = new Set<string>()
  const out: Uint8Array[] = []
  for (const n of nodes) {
    const id = bytesToUnprefixedHex(ethyKeccak256(n))
    if (seen.has(id)) continue
    seen.add(id)
    out.push(n)
  }
  return out
}

/**
 * Build a single-anchor `0x0c STATE_WITNESS` group from live bucket tries (WP-16f).
 */
export async function buildLiveWitnessGroup(opts: {
  anchorBlock: bigint
  anchorStateRoot: Uint8Array
  rootNodeRlp: Uint8Array
  trie: BucketSubtreeTrie
  armed: boolean
  anchorId?: string | bigint
  queries: readonly WitnessBuildQuery[]
}): Promise<StatyMultiProofGroup | undefined> {
  if (!opts.armed) return undefined
  const accounts: StatyMultiProofGroup['accounts'] = []
  const slots: StatyMultiProofGroup['slots'] = []
  const proofNodes: Uint8Array[] = [opts.rootNodeRlp]
  let bytes = opts.rootNodeRlp.length

  for (const q of opts.queries) {
    if (q.accountHash.length !== 32) continue
    if (q.accountHash[0]! >> 4 !== opts.trie.bucket) continue
    const accountProof = await opts.trie.accountTrie().createProof(q.accountHash, opts.anchorId)
    for (const n of accountProof) {
      bytes += n.length
      if (proofNodes.length >= MAX_PROOF_NODES || bytes > MAX_WITNESS_BYTES) {
        return undefined
      }
      proofNodes.push(n)
    }
    const accountVal = await opts.trie.accountTrie().get(q.accountHash)
    accounts.push({
      accountHash: q.accountHash,
      accountRlpOrEmpty: accountVal ?? new Uint8Array(0),
    })
    const storageTrie = opts.trie.getStorageTrie(q.accountHash)
    for (const slotHash of q.slotHashes) {
      if (storageTrie === undefined) {
        slots.push({ accountHash: q.accountHash, slotHash, slotValOrEmpty: new Uint8Array(0) })
        continue
      }
      const slotProof = await storageTrie.createProof(slotHash, opts.anchorId)
      for (const n of slotProof) {
        bytes += n.length
        if (proofNodes.length >= MAX_PROOF_NODES || bytes > MAX_WITNESS_BYTES) {
          return undefined
        }
        proofNodes.push(n)
      }
      const slotVal = await storageTrie.get(slotHash)
      slots.push({
        accountHash: q.accountHash,
        slotHash,
        slotValOrEmpty: slotVal ?? new Uint8Array(0),
      })
    }
  }

  if (accounts.length === 0 && slots.length === 0) return undefined

  accounts.sort((a, b) => compareBytes32(a.accountHash, b.accountHash))
  slots.sort((a, b) => {
    const ac = compareBytes32(a.accountHash, b.accountHash)
    if (ac !== 0) return ac
    return compareBytes32(a.slotHash, b.slotHash)
  })

  return {
    anchorStateRoot: opts.anchorStateRoot,
    accounts,
    slots,
    proofNodes: dedupeProofNodes(proofNodes),
  }
}

const MAX_CHUNK_SLAB_BYTES = 384 * 1024

export type PivotChunkExportRow = { key: Uint8Array; value: Uint8Array }

export type PivotChunkExportResult = {
  binPath: string
  proofPath: string
  originHash: Uint8Array
  lastHash: Uint8Array
}

/**
 * Macro-grid export: sorted account slab shard + boundary proof sidecar (WP-16f).
 */
export async function exportPivotAccountChunks(opts: {
  trie: BucketSubtreeTrie
  anchorBlock: bigint
  anchorStateRoot: Uint8Array
  rootNodeRlp: Uint8Array
  outDir: string
  bucket: number
  macroGridBlocks?: bigint
  anchorId?: string | bigint
}): Promise<PivotChunkExportResult[]> {
  if (opts.anchorBlock % (opts.macroGridBlocks ?? MACRO_GENERATION_GRID_BLOCKS) !== 0n) {
    return []
  }
  const armed = opts.trie.branchSlotReference().length === 32
  if (!armed) return []

  const rows: PivotChunkExportRow[] = []
  for await (const row of opts.trie.accountTrie().walkLeaves(opts.anchorId)) {
    rows.push({ key: new Uint8Array(row.key), value: new Uint8Array(row.value) })
  }
  rows.sort((a, b) => compareBytes(a.key, b.key))
  if (rows.length === 0) return []

  const out: PivotChunkExportResult[] = []
  let chunkStart = 0
  let slabBytes = 0
  const flushChunk = async (endExclusive: number) => {
    if (endExclusive <= chunkStart) return
    const slice = rows.slice(chunkStart, endExclusive)
    const origin = slice[0]!.key
    const last = slice[slice.length - 1]!.key
    const boundary = await opts.trie
      .accountTrie()
      .createRangeBoundaryProof(origin, last, opts.anchorId)
    const proofNodes = [opts.rootNodeRlp, ...boundary]
    const subtreeRoot = opts.trie.accountTrie().root()
    const ok = await verifyMerkleRangeProof(
      subtreeRoot,
      origin,
      last,
      slice.map((r) => r.key),
      slice.map((r) => r.value),
      boundary,
      ethyKeccak256,
    )
    if (!ok) throw new Error('Pivot chunk range proof failed before write')

    const binName = `accounts/${opts.bucket.toString(16)}.${chunkStart}.bin`
    const binPath = path.join(opts.outDir, binName)
    const proofPath = proofSidecarPathForJournal(binPath)
    await fs.mkdir(path.dirname(binPath), { recursive: true })
    const bodyChunks: Buffer[] = []
    for (const r of slice) {
      bodyChunks.push(Buffer.from(r.key))
      bodyChunks.push(Buffer.from(r.value))
    }
    await fs.writeFile(binPath, Buffer.concat(bodyChunks))
    const slabLen = bodyChunks.reduce((n, b) => n + b.length, 0)
    appendProofRecordSync(proofPath, {
      slabByteOffset: 0,
      slabByteLength: slabLen,
      originHash: origin,
      lastHash: last,
      hasRight: 0,
      chunkStateRoot: opts.anchorStateRoot,
      chunkBlockNumber: opts.anchorBlock,
      proofNodes,
    })
    out.push({ binPath, proofPath, originHash: origin, lastHash: last })
    chunkStart = endExclusive
    slabBytes = 0
  }

  for (let i = 0; i < rows.length; i++) {
    const rowBytes = rows[i]!.key.length + rows[i]!.value.length
    if (slabBytes > 0 && slabBytes + rowBytes > MAX_CHUNK_SLAB_BYTES) {
      await flushChunk(i)
    }
    slabBytes += rowBytes
  }
  await flushChunk(rows.length)
  return out
}

export function encodeRootNodeForChunks(slots: Uint8Array[]): Uint8Array {
  return encodeRootBranch(slots)
}
