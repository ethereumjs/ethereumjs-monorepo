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
