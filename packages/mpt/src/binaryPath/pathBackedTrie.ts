import { RLP } from '@ethereumjs/rlp'
import { MapDB } from '@ethereumjs/util'

import { MerklePatriciaTrie } from '../mpt.ts'
import { BranchMPTNode, ExtensionMPTNode, LeafMPTNode } from '../node/index.ts'
import { bytesToNibbles } from '../util/nibbles.ts'
import { encodeNodeToRlp, packRecord } from './nodeCodec.ts'
import { ownedPathKey, packPath } from './pathKey.ts'

import type { BatchDBOp } from '@ethereumjs/util'

import type { MPTNode, Nibbles } from '../types.ts'
import type { AnchorSnapshotRing } from './snapshots.ts'
import type { BinaryPathBatchOp, BinaryPathKeccak, BinaryPathNodeStore } from './types.ts'

const PATH_STORE_FLUSH = 4096

export type PathWriteHook = (
  pathKey: Uint8Array,
  previous: Uint8Array | null,
  next: Uint8Array,
) => void | Promise<void>

/**
 * Classic {@link MerklePatriciaTrie} that mirrors each persisted stack frame into a path-keyed store.
 * @internal
 */
export class PathBackedTrie extends MerklePatriciaTrie {
  readonly pathStore: BinaryPathNodeStore
  readonly pathKeccak: BinaryPathKeccak
  readonly prefixNibbles: number[]
  readonly interiorOnlyLeaves: boolean
  onPathWrite?: PathWriteHook
  /** Canonical RLP of the root path node (path `[]`), for {@link BinaryPathMPT.branchSlotReference}. */
  lastRootRlp: Uint8Array | null = null

  private readonly _pendingOps: BinaryPathBatchOp[] = []

  constructor(
    pathStore: BinaryPathNodeStore,
    keccak256: BinaryPathKeccak,
    prefixNibbles: readonly number[] = [],
    anchors?: AnchorSnapshotRing,
    interiorOnlyLeaves: boolean = false,
  ) {
    super({ useKeyHashing: false, db: new MapDB(), useNodePruning: false })
    this.pathStore = pathStore
    this.pathKeccak = keccak256
    this.prefixNibbles = [...prefixNibbles]
    this.interiorOnlyLeaves = interiorOnlyLeaves
    this.onPathWrite = async (pathKey, previous, next) => {
      if (anchors) {
        anchors.noteOverwrite(pathKey, previous)
      }
      this._queuePathPut(pathKey, next)
    }
  }

  protected override keyPathNibbles(key: Uint8Array): Nibbles {
    const nib = bytesToNibbles(key)
    if (this.prefixNibbles.length === 0) {
      return nib
    }
    this.assertKeyMatchesPrefix(key)
    return nib.slice(this.prefixNibbles.length)
  }

  assertKeyMatchesPrefix(key: Uint8Array): void {
    if (this.prefixNibbles.length === 0) return
    const nib = bytesToNibbles(key)
    for (let i = 0; i < this.prefixNibbles.length; i++) {
      if (nib[i] !== this.prefixNibbles[i]) {
        throw new Error('Key outside BinaryPathMPT prefix scope')
      }
    }
  }

  override async putSortedLeaves(
    keys: Uint8Array[],
    values: Uint8Array[],
    preallocatedNibbles?: Nibbles[],
  ): Promise<void> {
    const pathNibbles =
      preallocatedNibbles ??
      keys.map((key) => {
        return this.keyPathNibbles(key)
      })
    await super.putSortedLeaves(keys, values, pathNibbles)
    await this.flushPathStore()
  }

  override async saveStack(
    pathNibbles: Nibbles,
    stack: MPTNode[],
    opStack: BatchDBOp[],
  ): Promise<void> {
    const stackSnap = stack.slice()
    const pathSnap = pathNibbles.slice()
    await super.saveStack(pathNibbles, stack, opStack)
    await this._mirrorStackToPathStore(pathSnap, stackSnap)
    if (this._pendingOps.length >= PATH_STORE_FLUSH) {
      await this.flushPathStore()
    }
  }

  override async _createInitialNode(key: Uint8Array, value: Uint8Array): Promise<void> {
    await super._createInitialNode(key, value)
    const leaf = new LeafMPTNode(this.keyPathNibbles(key), value)
    const pathKey = packPath([])
    this.lastRootRlp = encodeNodeToRlp(leaf)
    if (!this.interiorOnlyLeaves) {
      const record = packRecord(leaf, this.pathKeccak)
      const prev = await this.pathStore.getNode(pathKey)
      await this.onPathWrite?.(pathKey, prev, record)
    }
  }

  async flushPathStore(): Promise<void> {
    if (this._pendingOps.length === 0) return
    const ops = this._pendingOps.splice(0)
    await this.pathStore.applyBatch(ops)
  }

  private _queuePathPut(pathKey: Uint8Array, bytes: Uint8Array): void {
    const ownedBytes = new Uint8Array(bytes.length)
    ownedBytes.set(bytes)
    this._pendingOps.push({
      type: 'put',
      pathKey: ownedPathKey(pathKey),
      bytes: ownedBytes,
    })
  }

  private async _mirrorStackToPathStore(pathNibbles: Nibbles, stack: MPTNode[]): Promise<void> {
    if (stack.length === 0) return
    const pathCopy = pathNibbles.slice()
    const work = stack.slice()
    while (work.length > 0) {
      const node = work.pop()!
      if (node instanceof LeafMPTNode || node instanceof ExtensionMPTNode) {
        pathCopy.splice(pathCopy.length - node.key().length)
      }
      if (node instanceof BranchMPTNode && work.length > 0) {
        pathCopy.pop()
      }
      if (pathCopy.length === 0) {
        this.lastRootRlp = encodeNodeToRlpFromNode(node)
      }
      if (node instanceof LeafMPTNode && this.interiorOnlyLeaves) {
        continue
      }
      const pathKey = packPath(pathCopy)
      const record = packRecord(node, this.pathKeccak)
      const prev = await this.pathStore.getNode(pathKey)
      await this.onPathWrite?.(pathKey, prev, record)
    }
  }

  async clearPathStore(): Promise<void> {
    this.lastRootRlp = null
    await this.flushPathStore()
    this._pendingOps.push({ type: 'del', pathKey: packPath([]) })
    await this.flushPathStore()
  }

  /** Hash serialized node RLP (same as classic trie node references). */
  nodeHash(serialized: Uint8Array): Uint8Array {
    return this.hash(serialized)
  }
}

function encodeNodeToRlpFromNode(node: MPTNode): Uint8Array {
  return encodeNodeToRlp(node)
}
