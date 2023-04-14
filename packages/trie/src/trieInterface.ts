import type { MapDB } from './db'
import type ReadStream from 'readable-stream'

type BatchDBOp = {
  type: 'del' | 'put'
  key: Uint8Array
  value: Uint8Array
}

export interface IpatriciaMerkleTrie {
  db: MapDB
  store(): Promise<MapDB>
  fromDB(db: MapDB): Promise<IpatriciaMerkleTrie>
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
  batch(ops: BatchDBOp[]): Promise<void>
  copy(): Promise<IpatriciaMerkleTrie>
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
  fromProof(key: Uint8Array, proof: Uint8Array[]): Promise<IpatriciaMerkleTrie>
  fromRangeProof(
    firstKey: Uint8Array | undefined,
    lastKey: Uint8Array | undefined,
    keys: Uint8Array[],
    values: Uint8Array[],
    proof: Uint8Array[]
  ): Promise<IpatriciaMerkleTrie>
  createReadStream(): Promise<ReadStream>
}
