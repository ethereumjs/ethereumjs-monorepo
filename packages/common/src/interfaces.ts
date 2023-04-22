import type { Account, Address, PrefixedHexString } from '@ethereumjs/util'

export interface StorageDump {
  [key: string]: string
}

export type AccountFields = Partial<Pick<Account, 'nonce' | 'balance' | 'storageRoot' | 'codeHash'>>

export type CacheClearingOpts = {
  /**
   * Full cache clearing
   * (overrides the useThreshold option)
   *
   * default: true
   */
  clear: boolean
  /**
   * Clean up the cache by deleting cache elements
   * where stored comparand is below the given
   * threshold.
   */
  useThreshold?: bigint
  /**
   * Comparand stored along a cache element with a
   * read or write access.
   *
   * This can be a block number, timestamp,
   * consecutive number or any other bigint
   * which makes sense as a comparison value.
   */
  comparand?: bigint
}

export type StorageProof = {
  key: PrefixedHexString
  proof: PrefixedHexString[]
  value: PrefixedHexString
}

export type Proof = {
  address: PrefixedHexString
  balance: PrefixedHexString
  codeHash: PrefixedHexString
  nonce: PrefixedHexString
  storageHash: PrefixedHexString
  accountProof: PrefixedHexString[]
  storageProof: StorageProof[]
}

type Stats = {
  cache: {
    size: number
    reads: number
    hits: number
    writes: number
    dels: number
  }
  trie: {
    reads: number
    writes: number
    dels: number
  }
}

export interface CacheInterface {
  getOrLoad(address: Address): Promise<Account | undefined>
  flush(): Promise<void>
  clear(cacheClearingOpts?: CacheClearingOpts): void
  put(address: Address, account: Account | undefined): void
  del(address: Address): void
  checkpoint(): void
  revert(): void
  commit(): void
  stats(reset?: boolean): Stats
}

export interface StateAccess {
  accountExists(address: Address): Promise<boolean>
  getAccount(address: Address): Promise<Account | undefined>
  putAccount(address: Address, account: Account): Promise<void>
  deleteAccount(address: Address): Promise<void>
  modifyAccountFields(address: Address, accountFields: AccountFields): Promise<void>
  putContractCode(address: Address, value: Uint8Array): Promise<void>
  getContractCode(address: Address): Promise<Uint8Array>
  getContractStorage(address: Address, key: Uint8Array): Promise<Uint8Array>
  putContractStorage(address: Address, key: Uint8Array, value: Uint8Array): Promise<void>
  clearContractStorage(address: Address): Promise<void>
  checkpoint(): Promise<void>
  commit(): Promise<void>
  revert(): Promise<void>
  getStateRoot(): Promise<Uint8Array>
  setStateRoot(stateRoot: Uint8Array, clearCache?: boolean): Promise<void>
  getProof?(address: Address, storageSlots: Uint8Array[]): Promise<Proof>
  verifyProof?(proof: Proof): Promise<boolean>
  hasStateRoot(root: Uint8Array): Promise<boolean>
}

export interface StateManagerInterface extends StateAccess {
  cache?: CacheInterface
  copy(): StateManagerInterface
  flush(): Promise<void>
  dumpStorage(address: Address): Promise<StorageDump>
}

/*
 * Access List types
 */

export type AccessListItem = {
  address: PrefixedHexString
  storageKeys: PrefixedHexString[]
}

/*
 * An Access List as a tuple of [address: Uint8Array, storageKeys: Uint8Array[]]
 */
export type AccessListBytesItem = [Uint8Array, Uint8Array[]]
export type AccessListBytes = AccessListBytesItem[]
export type AccessList = AccessListItem[]
