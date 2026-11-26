import { RLP } from '@ethereumjs/rlp'
import { EthereumJSErrorWithoutCode, bytesToUnprefixedHex, equalsBytes } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import {
  type BinaryBranchNode,
  type BinaryChildRef,
  type BinaryExtensionNode,
  type BinaryLeafNode,
  type BinaryPathNode,
  binaryNodeToChildRef,
  decodeRlpToBinaryNode,
  encodeBinaryNodeToRlp,
  packBinaryRecord,
  recordHash,
  unpackBinaryRecord,
} from './nodeCodec.ts'
import {
  appendNibble,
  commonPrefixLen,
  compareKeysLex,
  concatNibbles,
  keyToNibbles,
  nibbleAtKey,
  nibblesToKeyBytes,
  ownedPathKey,
  packPath,
  pathKeyHex,
} from './pathKey.ts'
import {
  createMultiProof as buildMultiProof,
  createProof as buildProof,
  createRangeBoundaryProof as buildRangeProof,
} from './proofs.ts'
import { AnchorSnapshotRing } from './snapshots.ts'
import { InMemoryBinaryPathStore } from './store.ts'

import type { Proof } from '../types.ts'
import type {
  BinaryPathBatchOp,
  BinaryPathKeccak,
  BinaryPathMPTOpts,
  BinaryPathNodeStore,
  ExternalLeafStore,
} from './types.ts'

export type BinaryPathBatchEntry = { key: Uint8Array; value: Uint8Array | null }

const STREAM_FLUSH_BATCH = 4096
const ROOT_PATH_KEY = packPath(new Uint8Array(0))

type StreamFrame = {
  depth: number
  path: Uint8Array
  children: (BinaryChildRef | null)[]
  value: Uint8Array
}

/**
 * In-memory mutable AST used during a single `put`, `del`, or `applyBatch` so dirty interior
 * nodes are hashed at most once per batch before committing to `BinaryPathNodeStore`.
 */
type WorkingBranch = {
  kind: 'branch'
  children: (WorkingChild | null)[]
  value: Uint8Array
  dirty: boolean
}

type WorkingExtension = {
  kind: 'extension'
  path: Uint8Array
  child: WorkingChild
  dirty: boolean
}

type WorkingLeaf = {
  kind: 'leaf'
  path: Uint8Array
  value: Uint8Array
  dirty: boolean
}

type WorkingNode = WorkingBranch | WorkingExtension | WorkingLeaf

type WorkingChild =
  | { loaded: true; node: WorkingNode; wasStoredAtPath: boolean }
  | { loaded: false; ref: BinaryChildRef }

/**
 * Standalone Path-Keyed Binary Merkle Patricia Trie.
 *
 * Stores packed binary nodes directly in `BinaryPathNodeStore` keyed by compact nibble path
 * (zero hash-keyed `MapDB`, zero orphan pruning), supports `O(depth)` streaming sorted-slab
 * construction, optional external flat leaf backing, fixed prefix subtrees (`[b]`), and
 * lock-free reverse-diff historical anchor snapshots for EIP-1186 and range boundary proofs.
 */
export class BinaryPathMPT {
  readonly EMPTY_TRIE_ROOT: Uint8Array
  private readonly _store: BinaryPathNodeStore
  private readonly _keccak: BinaryPathKeccak
  private readonly _prefix: Uint8Array
  private readonly _anchors: AnchorSnapshotRing
  private readonly _leaves: ExternalLeafStore | undefined
  private _root: Uint8Array
  private _rootRlp: Uint8Array | null = null

  constructor(opts: BinaryPathMPTOpts = {}) {
    this._keccak = opts.keccak256 ?? keccak_256
    this.EMPTY_TRIE_ROOT = this._keccak(RLP.encode(new Uint8Array(0)))
    this._store = opts.store ?? new InMemoryBinaryPathStore()
    this._prefix = Uint8Array.from(opts.prefixNibbles ?? [])
    this._anchors = new AnchorSnapshotRing(opts.maxAnchorSnapshots ?? 4)
    this._leaves = opts.leaves
    this._root = new Uint8Array(this.EMPTY_TRIE_ROOT)
  }

  /** Reopen an existing persisted `BinaryPathNodeStore` in O(1) (single root-path read). */
  static async open(opts: BinaryPathMPTOpts): Promise<BinaryPathMPT> {
    const trie = new BinaryPathMPT(opts)
    await trie.loadRoot()
    return trie
  }

  /** Reload cached `root()` and `branchSlotReference()` from the root path record in `store`. */
  async loadRoot(): Promise<Uint8Array> {
    const rec = await this._store.getNode(ROOT_PATH_KEY)
    if (rec === null) {
      this._root = new Uint8Array(this.EMPTY_TRIE_ROOT)
      this._rootRlp = null
      return this.root()
    }
    const h = recordHash(rec)
    const mat = await this._materializeRecord(new Uint8Array(0), rec)
    const rlp = encodeBinaryNodeToRlp(mat)
    this._rootRlp = rlp
    this._root = h !== null ? new Uint8Array(h) : this._keccak(rlp)
    return this.root()
  }

  /**
   * Build a `BinaryPathMPT` from a strictly ascending sorted stream in `O(depth)` (`<= 64` frames)
   * RAM, flushing packed binary nodes in bounded batches of 4,096 ops.
   */
  static async buildFromSortedStream(
    entries:
      | Iterable<{ key: Uint8Array; value: Uint8Array }>
      | AsyncIterable<{ key: Uint8Array; value: Uint8Array }>,
    opts?: BinaryPathMPTOpts,
  ): Promise<BinaryPathMPT> {
    const trie = new BinaryPathMPT(opts)
    const pendingOps: BinaryPathBatchOp[] = []
    const stack: StreamFrame[] = []
    const streamState: {
      prevNibbles: Uint8Array | null
      prevValue: Uint8Array | null
    } = {
      prevNibbles: null,
      prevValue: null,
    }

    const flushIfNeeded = async (force: boolean) => {
      if (pendingOps.length === 0) return
      if (!force && pendingOps.length < STREAM_FLUSH_BATCH) return
      const ops = pendingOps.splice(0)
      await trie._store.applyBatch(ops)
    }

    const emitNode = (
      path: Uint8Array,
      node: BinaryBranchNode | BinaryExtensionNode | BinaryLeafNode,
      isRoot: boolean,
    ): { ref: BinaryChildRef; rlp: Uint8Array; hash: Uint8Array } => {
      const { ref, rlp, hash } = binaryNodeToChildRef(node, trie._keccak)
      if (isRoot || !ref.inline) {
        const storedNode: BinaryPathNode =
          node.kind === 'leaf' && trie._leaves !== undefined
            ? { kind: 'external-leaf', path: node.path }
            : node
        pendingOps.push({
          type: 'put',
          pathKey: ownedPathKey(packPath(path)),
          bytes: packBinaryRecord(storedNode, hash),
        })
      }
      return { ref, rlp, hash }
    }

    const attachLeafToFrame = (frame: StreamFrame, nibbles: Uint8Array, value: Uint8Array) => {
      if (frame.depth === nibbles.length) {
        const valCopy = new Uint8Array(value.length)
        valCopy.set(value)
        frame.value = valCopy
        return
      }
      const nibble = nibbles[frame.depth]!
      const suffix = nibbles.slice(frame.depth + 1)
      const valCopy = new Uint8Array(value.length)
      valCopy.set(value)
      const leaf: BinaryLeafNode = { kind: 'leaf', path: suffix, value: valCopy }
      const leafPath = nibbles.slice(0, frame.depth + 1)
      const { ref } = emitNode(leafPath, leaf, false)
      frame.children[nibble] = ref
    }

    const collapseTopFrame = () => {
      const frame = stack.pop()!
      const branch: BinaryBranchNode = {
        kind: 'branch',
        children: frame.children,
        value: frame.value,
      }
      if (stack.length > 0) {
        const parent = stack[stack.length - 1]!
        const branchRes = emitNode(frame.path, branch, false)
        const childStart = parent.depth + 1
        let parentRef = branchRes.ref
        if (frame.depth > childStart) {
          const extPath = frame.path.slice(childStart, frame.depth)
          const extNode: BinaryExtensionNode = {
            kind: 'extension',
            path: extPath,
            child: branchRes.ref,
          }
          const extRes = emitNode(frame.path.slice(0, childStart), extNode, false)
          parentRef = extRes.ref
        }
        parent.children[frame.path[parent.depth]!] = parentRef
      } else if (frame.depth > 0) {
        const branchRes = emitNode(frame.path, branch, false)
        const rootExt: BinaryExtensionNode = {
          kind: 'extension',
          path: frame.path.slice(0, frame.depth),
          child: branchRes.ref,
        }
        const rootRes = emitNode(new Uint8Array(0), rootExt, true)
        trie._root = new Uint8Array(rootRes.hash)
        trie._rootRlp = rootRes.rlp
      } else {
        const rootRes = emitNode(new Uint8Array(0), branch, true)
        trie._root = new Uint8Array(rootRes.hash)
        trie._rootRlp = rootRes.rlp
      }
    }

    const processRow = async (key: Uint8Array, value: Uint8Array) => {
      if (value.length === 0) return
      trie._assertKeyMatchesPrefix(key)
      const currNibbles = keyToNibbles(key, trie._prefix.length)
      if (trie._leaves?.put !== undefined) {
        const valCopy = new Uint8Array(value.length)
        valCopy.set(value)
        await trie._leaves.put(key, valCopy)
      }
      if (streamState.prevNibbles === null) {
        streamState.prevNibbles = currNibbles
        streamState.prevValue = value
        return
      }
      const prevNibbles = streamState.prevNibbles
      const prevValue = streamState.prevValue!
      const lcp = commonPrefixLen(prevNibbles, currNibbles)
      if (lcp === prevNibbles.length && lcp === currNibbles.length) {
        throw EthereumJSErrorWithoutCode('Duplicate keys in sorted stream')
      }
      if (
        lcp < prevNibbles.length &&
        lcp < currNibbles.length &&
        prevNibbles[lcp]! > currNibbles[lcp]!
      ) {
        throw EthereumJSErrorWithoutCode('Sorted stream keys must be strictly ascending')
      }
      if (lcp === currNibbles.length && prevNibbles.length > currNibbles.length) {
        throw EthereumJSErrorWithoutCode('Sorted stream keys must be strictly ascending')
      }

      if (stack.length > 0 && stack[stack.length - 1]!.depth > lcp) {
        attachLeafToFrame(stack[stack.length - 1]!, prevNibbles, prevValue)
        while (stack.length > 0 && stack[stack.length - 1]!.depth > lcp) {
          if (stack.length === 1 || stack[stack.length - 2]!.depth < lcp) {
            const top = stack.pop()!
            stack.push({
              depth: lcp,
              path: prevNibbles.slice(0, lcp),
              children: new Array(16).fill(null),
              value: new Uint8Array(0),
            })
            stack.push(top)
          }
          collapseTopFrame()
        }
      } else {
        if (stack.length === 0 || stack[stack.length - 1]!.depth < lcp) {
          stack.push({
            depth: lcp,
            path: prevNibbles.slice(0, lcp),
            children: new Array(16).fill(null),
            value: new Uint8Array(0),
          })
        }
        attachLeafToFrame(stack[stack.length - 1]!, prevNibbles, prevValue)
      }
      await flushIfNeeded(false)
      streamState.prevNibbles = currNibbles
      streamState.prevValue = value
    }

    if (Symbol.asyncIterator in Object(entries)) {
      for await (const row of entries as AsyncIterable<{ key: Uint8Array; value: Uint8Array }>) {
        await processRow(row.key, row.value)
      }
    } else {
      for (const row of entries as Iterable<{ key: Uint8Array; value: Uint8Array }>) {
        await processRow(row.key, row.value)
      }
    }

    if (streamState.prevNibbles !== null && streamState.prevValue !== null) {
      if (stack.length === 0) {
        const valCopy = new Uint8Array(streamState.prevValue.length)
        valCopy.set(streamState.prevValue)
        const leaf: BinaryLeafNode = {
          kind: 'leaf',
          path: streamState.prevNibbles.slice(),
          value: valCopy,
        }
        const res = emitNode(new Uint8Array(0), leaf, true)
        trie._root = new Uint8Array(res.hash)
        trie._rootRlp = res.rlp
      } else {
        attachLeafToFrame(stack[stack.length - 1]!, streamState.prevNibbles, streamState.prevValue)
        while (stack.length > 0) {
          collapseTopFrame()
        }
      }
    }
    await flushIfNeeded(true)
    return trie
  }

  /** Access the underlying path-keyed node store. */
  get store(): BinaryPathNodeStore {
    return this._store
  }

  root(): Uint8Array {
    return new Uint8Array(this._root)
  }

  branchSlotReference(): Uint8Array {
    if (equalsBytes(this._root, this.EMPTY_TRIE_ROOT)) {
      return new Uint8Array(0)
    }
    if (this._rootRlp !== null && this._rootRlp.length < 32) {
      return new Uint8Array(this._rootRlp)
    }
    return new Uint8Array(this._root)
  }

  async get(key: Uint8Array): Promise<Uint8Array | null> {
    this._assertKeyMatchesPrefix(key)
    const rootBytes = await this._store.getNode(ROOT_PATH_KEY)
    if (rootBytes === null) return null

    let path: Uint8Array = new Uint8Array(0)
    let rem: Uint8Array = keyToNibbles(key, this._prefix.length)
    let current = await this._materializeRecord(path, rootBytes)

    while (true) {
      if (current.kind === 'leaf') {
        if (
          current.path.length === rem.length &&
          commonPrefixLen(current.path, rem) === rem.length
        ) {
          return new Uint8Array(current.value)
        }
        return null
      }
      if (current.kind === 'extension') {
        if (rem.length < current.path.length) return null
        if (commonPrefixLen(current.path, rem) < current.path.length) return null
        path = concatNibbles(path, current.path)
        rem = rem.subarray(current.path.length)
        if (current.child.inline) {
          current = decodeRlpToBinaryNode(current.child.rlp)
        } else {
          const nextBytes = await this._store.getNode(packPath(path))
          if (nextBytes === null) return null
          current = await this._materializeRecord(path, nextBytes)
        }
        continue
      }
      // Branch
      if (rem.length === 0) {
        return current.value.length > 0 ? new Uint8Array(current.value) : null
      }
      const nibble = rem[0]!
      const childRef = current.children[nibble]
      if (childRef === null || childRef === undefined) return null
      path = appendNibble(path, nibble)
      rem = rem.subarray(1)
      if (childRef.inline) {
        current = decodeRlpToBinaryNode(childRef.rlp)
      } else {
        const nextBytes = await this._store.getNode(packPath(path))
        if (nextBytes === null) return null
        current = await this._materializeRecord(path, nextBytes)
      }
    }
  }

  async put(key: Uint8Array, value: Uint8Array): Promise<void> {
    if (value.length === 0) {
      await this.del(key)
      return
    }
    await this.applyBatch([{ key, value }])
  }

  async del(key: Uint8Array): Promise<void> {
    await this.applyBatch([{ key, value: null }])
  }

  /**
   * Apply a batch of mutations (`value === null` or empty deletes) with last-write-wins semantics,
   * re-hashing every dirty interior node at most once and flushing in a single `store.applyBatch`.
   */
  async applyBatch(mutations: ReadonlyArray<BinaryPathBatchEntry>): Promise<Uint8Array> {
    this._guardLeavesWritable()
    if (mutations.length === 0) return this.root()

    // Last-write-wins deduplication preserving latest entry per key, then unsigned lex sort.
    const dedup = new Map<string, BinaryPathBatchEntry>()
    for (const m of mutations) {
      this._assertKeyMatchesPrefix(m.key)
      dedup.set(bytesToUnprefixedHex(m.key), m)
    }
    const ordered = [...dedup.values()].sort((a, b) => compareKeysLex(a.key, b.key))

    // Load root into mutable working tree (null if empty).
    const rootBytes = await this._store.getNode(ROOT_PATH_KEY)
    let rootWorking: WorkingNode | null =
      rootBytes === null
        ? null
        : toWorkingNode(await this._materializeRecord(new Uint8Array(0), rootBytes))

    const deletedPaths = new Map<string, Uint8Array>()
    const externalLeafSnapshots = new Map<string, Uint8Array>()
    const externalLeafOps: Array<{ key: Uint8Array; value: Uint8Array | null }> = []

    const markDeletedPath = (path: Uint8Array) => {
      const pk = packPath(path)
      deletedPaths.set(pathKeyHex(pk), pk)
    }

    const loadChild = async (parentPath: Uint8Array, child: WorkingChild): Promise<WorkingNode> => {
      if (child.loaded) return child.node
      if (child.ref.inline) {
        return toWorkingNode(decodeRlpToBinaryNode(child.ref.rlp))
      }
      const pk = packPath(parentPath)
      const bytes = await this._store.getNode(pk)
      if (bytes === null) {
        throw EthereumJSErrorWithoutCode(`Missing node in BinaryPathNodeStore at ${pathKeyHex(pk)}`)
      }
      const mat = await this._materializeRecord(parentPath, bytes)
      // If active anchors exist and this is an external leaf that might be overwritten/deleted,
      // cache its materialized 0x03 record before external leaf store mutations overwrite its value.
      if (this._anchors.hasActiveAnchors() && this._leaves !== undefined && mat.kind === 'leaf') {
        const hex = pathKeyHex(pk)
        if (!externalLeafSnapshots.has(hex)) {
          const h = recordHash(bytes) ?? this._keccak(encodeBinaryNodeToRlp(mat))
          externalLeafSnapshots.set(hex, packBinaryRecord(mat, h))
        }
      }
      return toWorkingNode(mat)
    }

    // If root itself is an external leaf and anchors are active, snapshot before mutating leaves.
    if (
      rootBytes !== null &&
      this._anchors.hasActiveAnchors() &&
      this._leaves !== undefined &&
      rootWorking !== null &&
      rootWorking.kind === 'leaf'
    ) {
      const h = recordHash(rootBytes) ?? this._keccak(encodeBinaryNodeToRlp(rootWorking))
      externalLeafSnapshots.set(pathKeyHex(ROOT_PATH_KEY), packBinaryRecord(rootWorking, h))
    }

    const putInto = async (
      node: WorkingNode | null,
      path: Uint8Array,
      rem: Uint8Array,
      value: Uint8Array,
    ): Promise<WorkingNode> => {
      if (node === null) {
        return { kind: 'leaf', path: rem.slice(), value, dirty: true }
      }
      if (node.kind === 'leaf') {
        const lcp = commonPrefixLen(node.path, rem)
        if (lcp === node.path.length && lcp === rem.length) {
          node.value = value
          node.dirty = true
          return node
        }
        const branch: WorkingBranch = {
          kind: 'branch',
          children: new Array(16).fill(null),
          value: new Uint8Array(0),
          dirty: true,
        }
        if (lcp === node.path.length) {
          branch.value = node.value
        } else {
          const oldNibble = node.path[lcp]!
          branch.children[oldNibble] = {
            loaded: true,
            node: { kind: 'leaf', path: node.path.slice(lcp + 1), value: node.value, dirty: true },
            wasStoredAtPath: false,
          }
        }
        if (lcp === rem.length) {
          branch.value = value
        } else {
          const newNibble = rem[lcp]!
          branch.children[newNibble] = {
            loaded: true,
            node: { kind: 'leaf', path: rem.slice(lcp + 1), value, dirty: true },
            wasStoredAtPath: false,
          }
        }
        if (lcp > 0) {
          return {
            kind: 'extension',
            path: node.path.slice(0, lcp),
            child: { loaded: true, node: branch, wasStoredAtPath: false },
            dirty: true,
          }
        }
        return branch
      }
      if (node.kind === 'extension') {
        const lcp = commonPrefixLen(node.path, rem)
        if (lcp === node.path.length) {
          const childPath = concatNibbles(path, node.path)
          const wasStored = node.child.loaded ? node.child.wasStoredAtPath : !node.child.ref.inline
          const childNode = await loadChild(childPath, node.child)
          const updated = await putInto(childNode, childPath, rem.subarray(lcp), value)
          node.child = { loaded: true, node: updated, wasStoredAtPath: wasStored }
          node.dirty = true
          return node
        }
        const branch: WorkingBranch = {
          kind: 'branch',
          children: new Array(16).fill(null),
          value: new Uint8Array(0),
          dirty: true,
        }
        const oldNibble = node.path[lcp]!
        if (lcp + 1 === node.path.length) {
          branch.children[oldNibble] = node.child
        } else {
          branch.children[oldNibble] = {
            loaded: true,
            node: {
              kind: 'extension',
              path: node.path.slice(lcp + 1),
              child: node.child,
              dirty: true,
            },
            wasStoredAtPath: false,
          }
        }
        if (lcp === rem.length) {
          branch.value = value
        } else {
          const newNibble = rem[lcp]!
          branch.children[newNibble] = {
            loaded: true,
            node: { kind: 'leaf', path: rem.slice(lcp + 1), value, dirty: true },
            wasStoredAtPath: false,
          }
        }
        if (lcp > 0) {
          return {
            kind: 'extension',
            path: node.path.slice(0, lcp),
            child: { loaded: true, node: branch, wasStoredAtPath: false },
            dirty: true,
          }
        }
        return branch
      }
      // Branch
      if (rem.length === 0) {
        node.value = value
        node.dirty = true
        return node
      }
      const nibble = rem[0]!
      const childPath = appendNibble(path, nibble)
      const existing = node.children[nibble]
      if (existing === null || existing === undefined) {
        node.children[nibble] = {
          loaded: true,
          node: { kind: 'leaf', path: rem.slice(1), value, dirty: true },
          wasStoredAtPath: false,
        }
      } else {
        const wasStored = existing.loaded ? existing.wasStoredAtPath : !existing.ref.inline
        const childNode = await loadChild(childPath, existing)
        const updated = await putInto(childNode, childPath, rem.subarray(1), value)
        node.children[nibble] = { loaded: true, node: updated, wasStoredAtPath: wasStored }
      }
      node.dirty = true
      return node
    }

    const delFrom = async (
      node: WorkingNode | null,
      path: Uint8Array,
      rem: Uint8Array,
    ): Promise<{ node: WorkingNode | null; changed: boolean }> => {
      if (node === null) return { node: null, changed: false }
      if (node.kind === 'leaf') {
        if (node.path.length === rem.length && commonPrefixLen(node.path, rem) === rem.length) {
          return { node: null, changed: true }
        }
        return { node, changed: false }
      }
      if (node.kind === 'extension') {
        const lcp = commonPrefixLen(node.path, rem)
        if (lcp < node.path.length) return { node, changed: false }
        const childPath = concatNibbles(path, node.path)
        const wasStored = node.child.loaded ? node.child.wasStoredAtPath : !node.child.ref.inline
        const childNode = await loadChild(childPath, node.child)
        const res = await delFrom(childNode, childPath, rem.subarray(lcp))
        if (!res.changed) return { node, changed: false }
        if (res.node === null) {
          if (wasStored) markDeletedPath(childPath)
          return { node: null, changed: true }
        }
        if (res.node.kind === 'leaf') {
          if (wasStored) markDeletedPath(childPath)
          return {
            node: {
              kind: 'leaf',
              path: concatNibbles(node.path, res.node.path),
              value: res.node.value,
              dirty: true,
            },
            changed: true,
          }
        }
        if (res.node.kind === 'extension') {
          if (wasStored) markDeletedPath(childPath)
          return {
            node: {
              kind: 'extension',
              path: concatNibbles(node.path, res.node.path),
              child: res.node.child,
              dirty: true,
            },
            changed: true,
          }
        }
        node.child = { loaded: true, node: res.node, wasStoredAtPath: wasStored }
        node.dirty = true
        return { node, changed: true }
      }
      // Branch
      if (rem.length === 0) {
        if (node.value.length === 0) return { node, changed: false }
        node.value = new Uint8Array(0)
        node.dirty = true
      } else {
        const nibble = rem[0]!
        const existing = node.children[nibble]
        if (existing === null || existing === undefined) return { node, changed: false }
        const childPath = appendNibble(path, nibble)
        const wasStored = existing.loaded ? existing.wasStoredAtPath : !existing.ref.inline
        const childNode = await loadChild(childPath, existing)
        const res = await delFrom(childNode, childPath, rem.subarray(1))
        if (!res.changed) return { node, changed: false }
        if (res.node === null) {
          if (wasStored) markDeletedPath(childPath)
          node.children[nibble] = null
        } else {
          node.children[nibble] = { loaded: true, node: res.node, wasStoredAtPath: wasStored }
        }
        node.dirty = true
      }

      // Collapse branch if <= 1 child remains.
      let childCount = 0
      let onlyIdx = -1
      for (let i = 0; i < 16; i++) {
        if (node.children[i] !== null && node.children[i] !== undefined) {
          childCount++
          onlyIdx = i
        }
      }
      const hasVal = node.value.length > 0
      if (childCount === 0 && !hasVal) {
        return { node: null, changed: true }
      }
      if (childCount === 0 && hasVal) {
        return {
          node: { kind: 'leaf', path: new Uint8Array(0), value: node.value, dirty: true },
          changed: true,
        }
      }
      if (childCount === 1 && !hasVal) {
        const sole = node.children[onlyIdx]!
        const solePath = appendNibble(path, onlyIdx)
        const wasStored = sole.loaded ? sole.wasStoredAtPath : !sole.ref.inline
        const soleNode = await loadChild(solePath, sole)
        if (soleNode.kind === 'leaf') {
          if (wasStored) markDeletedPath(solePath)
          return {
            node: {
              kind: 'leaf',
              path: concatNibbles(Uint8Array.from([onlyIdx]), soleNode.path),
              value: soleNode.value,
              dirty: true,
            },
            changed: true,
          }
        }
        if (soleNode.kind === 'extension') {
          if (wasStored) markDeletedPath(solePath)
          return {
            node: {
              kind: 'extension',
              path: concatNibbles(Uint8Array.from([onlyIdx]), soleNode.path),
              child: soleNode.child,
              dirty: true,
            },
            changed: true,
          }
        }
        // Sole child is a Branch: keep it at `solePath` under Extension([onlyIdx]).
        return {
          node: {
            kind: 'extension',
            path: Uint8Array.from([onlyIdx]),
            child: { loaded: true, node: soleNode, wasStoredAtPath: wasStored },
            dirty: true,
          },
          changed: true,
        }
      }
      return { node, changed: true }
    }

    for (const m of ordered) {
      const rem = keyToNibbles(m.key, this._prefix.length)
      if (m.value === null || m.value.length === 0) {
        const res = await delFrom(rootWorking, new Uint8Array(0), rem)
        rootWorking = res.node
        if (this._leaves?.del !== undefined) {
          externalLeafOps.push({ key: m.key, value: null })
        }
      } else {
        const valCopy = new Uint8Array(m.value.length)
        valCopy.set(m.value)
        rootWorking = await putInto(rootWorking, new Uint8Array(0), rem, valCopy)
        if (this._leaves?.put !== undefined) {
          externalLeafOps.push({ key: m.key, value: valCopy })
        }
      }
    }

    // Single post-order hash + emit pass: every dirty node hashed AT MOST ONCE!
    const writeOps = new Map<string, { pathKey: Uint8Array; bytes: Uint8Array }>()

    const commitWorking = (
      node: WorkingNode,
      path: Uint8Array,
      isRoot: boolean,
      wasStoredAtPath: boolean,
    ): { ref: BinaryChildRef; rlp: Uint8Array; hash: Uint8Array } => {
      let finalized: BinaryBranchNode | BinaryExtensionNode | BinaryLeafNode
      if (node.kind === 'leaf') {
        finalized = { kind: 'leaf', path: node.path, value: node.value }
      } else if (node.kind === 'extension') {
        let childRef: BinaryChildRef
        if (node.child.loaded) {
          const childPath = concatNibbles(path, node.path)
          childRef = commitWorking(
            node.child.node,
            childPath,
            false,
            node.child.wasStoredAtPath,
          ).ref
        } else {
          childRef = node.child.ref
        }
        finalized = { kind: 'extension', path: node.path, child: childRef }
      } else {
        const children: (BinaryChildRef | null)[] = new Array(16).fill(null)
        for (let i = 0; i < 16; i++) {
          const c = node.children[i]
          if (c === null || c === undefined) continue
          if (c.loaded) {
            children[i] = commitWorking(c.node, appendNibble(path, i), false, c.wasStoredAtPath).ref
          } else {
            children[i] = c.ref
          }
        }
        finalized = { kind: 'branch', children, value: node.value }
      }

      const { ref, rlp, hash } = binaryNodeToChildRef(finalized, this._keccak)
      const pk = packPath(path)
      const hex = pathKeyHex(pk)
      if (isRoot || !ref.inline) {
        const storedNode: BinaryPathNode =
          finalized.kind === 'leaf' && this._leaves !== undefined
            ? { kind: 'external-leaf', path: finalized.path }
            : finalized
        deletedPaths.delete(hex)
        writeOps.set(hex, { pathKey: pk, bytes: packBinaryRecord(storedNode, hash) })
      } else if (wasStoredAtPath) {
        // Node shrank from >= 32B (stored on disk) to < 32B (now inlined in parent): clean up old path.
        writeOps.delete(hex)
        deletedPaths.set(hex, pk)
      }
      return { ref, rlp, hash }
    }

    if (rootWorking === null) {
      if (rootBytes !== null) {
        deletedPaths.set(pathKeyHex(ROOT_PATH_KEY), ROOT_PATH_KEY)
      }
      this._root = new Uint8Array(this.EMPTY_TRIE_ROOT)
      this._rootRlp = null
    } else if (rootWorking.dirty) {
      const rootRes = commitWorking(rootWorking, new Uint8Array(0), true, rootBytes !== null)
      this._root = new Uint8Array(rootRes.hash)
      this._rootRlp = rootRes.rlp
    }

    // Record reverse-diff anchor snapshots BEFORE applying mutations to store & external leaves.
    const batchOps: BinaryPathBatchOp[] = []
    if (this._anchors.hasActiveAnchors()) {
      for (const [hex, pk] of deletedPaths) {
        const prev = externalLeafSnapshots.get(hex) ?? (await this._store.getNode(pk))
        this._anchors.noteOverwrite(pk, prev)
      }
      for (const [hex, { pathKey }] of writeOps) {
        const prev = externalLeafSnapshots.get(hex) ?? (await this._store.getNode(pathKey))
        this._anchors.noteOverwrite(pathKey, prev)
      }
    }

    for (const pk of deletedPaths.values()) {
      batchOps.push({ type: 'del', pathKey: ownedPathKey(pk) })
    }
    for (const { pathKey, bytes } of writeOps.values()) {
      batchOps.push({ type: 'put', pathKey: ownedPathKey(pathKey), bytes })
    }
    if (batchOps.length > 0) {
      await this._store.applyBatch(batchOps)
    }

    for (const op of externalLeafOps) {
      if (op.value === null) {
        await this._leaves!.del!(op.key)
      } else {
        await this._leaves!.put!(op.key, op.value)
      }
    }

    return this.root()
  }

  captureAnchor(anchorId: string | bigint): Uint8Array {
    const root = this.root()
    this._anchors.capture(anchorId, root)
    return root
  }

  releaseAnchor(anchorId: string | bigint): void {
    this._anchors.release(anchorId)
  }

  async createProof(key: Uint8Array, anchorId?: string | bigint): Promise<Proof> {
    return buildProof(this, key, anchorId)
  }

  async createMultiProof(keys: Uint8Array[], anchorId?: string | bigint): Promise<Proof> {
    return buildMultiProof(this, keys, anchorId)
  }

  async createRangeBoundaryProof(
    originHash32: Uint8Array,
    lastHash32: Uint8Array,
    anchorId?: string | bigint,
  ): Promise<Proof> {
    return buildRangeProof(this, originHash32, lastHash32, anchorId)
  }

  /** @internal */
  get _anchorRing(): AnchorSnapshotRing {
    return this._anchors
  }

  /** @internal */
  get _prefixLength(): number {
    return this._prefix.length
  }

  /** @internal */
  _hashRlp(rlp: Uint8Array): Uint8Array {
    return this._keccak(rlp)
  }

  /** @internal */
  _assertKeyMatchesPrefix(key: Uint8Array): void {
    if (this._prefix.length === 0) return
    if (key.length << 1 < this._prefix.length) {
      throw new Error('Key shorter than BinaryPathMPT prefix scope')
    }
    for (let i = 0; i < this._prefix.length; i++) {
      if (nibbleAtKey(key, i) !== this._prefix[i]) {
        throw new Error('Key outside BinaryPathMPT prefix scope')
      }
    }
  }

  /** @internal */
  async _readRecordAt(pathKey: Uint8Array, anchorId?: string | bigint): Promise<Uint8Array | null> {
    const live = await this._store.getNode(pathKey)
    if (anchorId === undefined) return live
    return this._anchors.overlayGet(pathKey, anchorId, live)
  }

  /** @internal */
  async _materializeRecord(
    path: Uint8Array,
    bytes: Uint8Array,
  ): Promise<BinaryBranchNode | BinaryExtensionNode | BinaryLeafNode> {
    const { node } = unpackBinaryRecord(bytes)
    if (node.kind !== 'external-leaf') {
      return node
    }
    if (this._leaves === undefined) {
      throw EthereumJSErrorWithoutCode(
        'External leaf pointer encountered without external leaf store',
      )
    }
    const fullNibbles = concatNibbles(concatNibbles(this._prefix, path), node.path)
    const fullKey = nibblesToKeyBytes(fullNibbles)
    const val = await this._leaves.get(fullKey)
    if (val === undefined || val === null) {
      throw EthereumJSErrorWithoutCode(
        `External leaf value missing for key 0x${bytesToUnprefixedHex(fullKey)}`,
      )
    }
    return { kind: 'leaf', path: node.path, value: val }
  }

  private _guardLeavesWritable(): void {
    if (
      this._leaves !== undefined &&
      (this._leaves.put === undefined || this._leaves.del === undefined)
    ) {
      throw EthereumJSErrorWithoutCode('External leaf store is read-only')
    }
  }

  /**
   * Yield every leaf `(key, value)` in unsigned lexicographic key order.
   * Optional `anchorId` reads through the reverse-diff snapshot overlay.
   */
  async *walkLeaves(
    anchorId?: string | bigint,
  ): AsyncGenerator<{ key: Uint8Array; value: Uint8Array }> {
    const rootBytes = await this._readRecordAt(ROOT_PATH_KEY, anchorId)
    if (rootBytes === null) return
    yield* this._walkLeavesDfs(new Uint8Array(0), rootBytes, anchorId)
  }

  private async *_walkLeavesDfs(
    pathNibbles: Uint8Array,
    recordBytes: Uint8Array,
    anchorId?: string | bigint,
  ): AsyncGenerator<{ key: Uint8Array; value: Uint8Array }> {
    const node = await this._materializeRecord(pathNibbles, recordBytes)
    if (node.kind === 'leaf') {
      const fullNibbles = concatNibbles(concatNibbles(this._prefix, pathNibbles), node.path)
      const key = nibblesToKeyBytes(fullNibbles)
      this._assertKeyMatchesPrefix(key)
      yield { key, value: new Uint8Array(node.value) }
      return
    }
    if (node.kind === 'extension') {
      const nextPath = concatNibbles(pathNibbles, node.path)
      if (node.child.inline) {
        const childNode = decodeRlpToBinaryNode(node.child.rlp)
        yield* this._walkLeavesFromNode(nextPath, childNode, anchorId)
      } else {
        const childBytes = await this._readRecordAt(packPath(nextPath), anchorId)
        if (childBytes !== null) {
          yield* this._walkLeavesDfs(nextPath, childBytes, anchorId)
        }
      }
      return
    }
    // Branch
    for (let nibble = 0; nibble < 16; nibble++) {
      const childRef = node.children[nibble]
      if (childRef === null || childRef === undefined) continue
      const childPath = appendNibble(pathNibbles, nibble)
      if (childRef.inline) {
        const childNode = decodeRlpToBinaryNode(childRef.rlp)
        yield* this._walkLeavesFromNode(childPath, childNode, anchorId)
      } else {
        const childBytes = await this._readRecordAt(packPath(childPath), anchorId)
        if (childBytes !== null) {
          yield* this._walkLeavesDfs(childPath, childBytes, anchorId)
        }
      }
    }
  }

  private async *_walkLeavesFromNode(
    pathNibbles: Uint8Array,
    node: BinaryBranchNode | BinaryExtensionNode | BinaryLeafNode,
    anchorId?: string | bigint,
  ): AsyncGenerator<{ key: Uint8Array; value: Uint8Array }> {
    if (node.kind === 'leaf') {
      const fullNibbles = concatNibbles(concatNibbles(this._prefix, pathNibbles), node.path)
      const key = nibblesToKeyBytes(fullNibbles)
      this._assertKeyMatchesPrefix(key)
      yield { key, value: new Uint8Array(node.value) }
      return
    }
    if (node.kind === 'extension') {
      const nextPath = concatNibbles(pathNibbles, node.path)
      if (node.child.inline) {
        yield* this._walkLeavesFromNode(nextPath, decodeRlpToBinaryNode(node.child.rlp), anchorId)
      } else {
        const childBytes = await this._readRecordAt(packPath(nextPath), anchorId)
        if (childBytes !== null) {
          yield* this._walkLeavesDfs(nextPath, childBytes, anchorId)
        }
      }
      return
    }
    for (let nibble = 0; nibble < 16; nibble++) {
      const childRef = node.children[nibble]
      if (childRef === null || childRef === undefined) continue
      const childPath = appendNibble(pathNibbles, nibble)
      if (childRef.inline) {
        yield* this._walkLeavesFromNode(childPath, decodeRlpToBinaryNode(childRef.rlp), anchorId)
      } else {
        const childBytes = await this._readRecordAt(packPath(childPath), anchorId)
        if (childBytes !== null) {
          yield* this._walkLeavesDfs(childPath, childBytes, anchorId)
        }
      }
    }
  }
}

function toWorkingNode(node: BinaryBranchNode | BinaryExtensionNode | BinaryLeafNode): WorkingNode {
  if (node.kind === 'leaf') {
    return { kind: 'leaf', path: node.path, value: node.value, dirty: false }
  }
  if (node.kind === 'extension') {
    return {
      kind: 'extension',
      path: node.path,
      child: { loaded: false, ref: node.child },
      dirty: false,
    }
  }
  return {
    kind: 'branch',
    children: node.children.map((c) => (c === null ? null : { loaded: false, ref: c })),
    value: node.value,
    dirty: false,
  }
}

export function createBinaryPathMPT(opts?: BinaryPathMPTOpts): BinaryPathMPT {
  return new BinaryPathMPT(opts)
}
