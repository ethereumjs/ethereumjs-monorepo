import type {
  BatchDBOpV,
  CreateTrieOptsV,
  DBv,
  EmbeddedNodeV,
  FoundNodeFunctionV,
  NibblesV,
  PathV,
  TrieNodeV,
  TrieVersion,
} from './v1Types'
import type { ReadStream } from 'fs'

export interface IexternalTrieV<TVersion extends TrieVersion> {
  db: DBv<TVersion>
  store(): Promise<DBv<TVersion>>
  fromDB(db: DBv<TVersion>): Promise<IexternalTrieV<TVersion>>
  root(): Promise<Uint8Array>
  persistRoot(): Promise<void>
  checkRoot(root: Uint8Array): Promise<boolean>
  get(key: Uint8Array): Promise<Uint8Array | undefined>
  put(key: Uint8Array, value: Uint8Array): Promise<void>
  del(key: Uint8Array): Promise<void>
  flush(): Promise<void>
  checkpoint(): Promise<void>
  commit(): Promise<void>
  revert(): Promise<void>
  flushCheckpoints(): Promise<void>
  batch(ops: BatchDBOpV<0>[]): Promise<void>
  copy(includeCheckpoints?: boolean): Promise<IexternalTrieV<TVersion>>
  createProof(key: Uint8Array): Promise<Uint8Array[] | undefined>
  createRangeProof(
    firstKey: Uint8Array | undefined,
    lastKey: Uint8Array | undefined
  ): Promise<Uint8Array[] | undefined>
  verifyProof(
    rootHash: Uint8Array,
    key: Uint8Array,
    value: Uint8Array,
    proof: Uint8Array[] | undefined
  ): Promise<boolean>
  verifyRangeProof(
    rootHash: Uint8Array,
    firstKey: Uint8Array | undefined,
    lastKey: Uint8Array | undefined,
    keys: Uint8Array[],
    values: Uint8Array[],
    proof: Uint8Array[] | undefined
  ): Promise<boolean>
  fromProof(key: Uint8Array, proof: Uint8Array[]): Promise<IexternalTrieV<TVersion>>
  fromRangeProof(
    firstKey: Uint8Array | undefined,
    lastKey: Uint8Array | undefined,
    keys: Uint8Array[],
    values: Uint8Array[],
    proof: Uint8Array[]
  ): Promise<IexternalTrieV<TVersion>>
  createReadStream(): Promise<ReadStream>
}

export interface IprevTrie extends IexternalTrieV<0> {
  create(opts: CreateTrieOptsV<0>): Promise<IprevTrie>
  database(db?: DBv<0>): Promise<DBv<0>>
  findPath(key: Uint8Array): Promise<PathV<0>>
  walkTrie(root: Uint8Array, onFound: FoundNodeFunctionV<0>): Promise<void>
  _createInitialNode(key: Uint8Array, value: Uint8Array): Promise<void>
  lookupNode(node: Uint8Array | Uint8Array[]): Promise<TrieNodeV<0> | null>
  _updateNode(
    k: Uint8Array,
    value: Uint8Array,
    keyRemainder: NibblesV<0>,
    stack: TrieNodeV<0>[]
  ): Promise<void>
  _deleteNode(k: Uint8Array, stack: TrieNodeV<0>[]): Promise<void>
  _saveStack(key: NibblesV<0>, stack: TrieNodeV<0>[], opStack: BatchDBOpV<0>[]): Promise<void>
  _formatNode(
    node: TrieNodeV<0>,
    topLevel: boolean,
    opStack: BatchDBOpV<0>[],
    remove?: boolean
  ): Uint8Array | (EmbeddedNodeV<0> | null)[]
  verifyPrunedIntegrity(): Promise<boolean>
  _findDbNodes(onFound: FoundNodeFunctionV<0>): Promise<void>
  appliedKey(key: Uint8Array): Uint8Array
  hash(msg: Uint8Array): Uint8Array
  hasCheckpoints(): boolean
}
