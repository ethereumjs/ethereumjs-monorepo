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

export interface EVMStateManagerInterface {
  checkpoint(): Promise<void>
  commit(): Promise<void>
  revert(): Promise<void>

  getAccount(address: Address): Promise<Account | undefined>
  putAccount(address: Address, account: Account, touch?: boolean): Promise<void>
  deleteAccount(address: Address, touch?: boolean): Promise<void>
  modifyAccountFields(address: Address, accountFields: AccountFields): Promise<void>
  accountIsEmptyOrNonExistent(address: Address): Promise<boolean>
  accountExists(address: Address): Promise<boolean>

  getContractStorage(address: Address, key: Uint8Array): Promise<Uint8Array>
  getOriginalContractStorage(address: Address, key: Uint8Array): Promise<Uint8Array>
  dumpStorage(address: Address): Promise<StorageDump> // only used in client
  putContractStorage(
    address: Address,
    key: Uint8Array,
    value: Uint8Array,
    touch?: boolean
  ): Promise<void>
  clearContractStorage(address: Address, touch: boolean): Promise<void>

  putContractCode(address: Address, value: Uint8Array): Promise<void>
  getContractCode(address: Address): Promise<Uint8Array>

  setStateRoot(stateRoot: Uint8Array, clearCache?: boolean): Promise<void>
  getStateRoot(): Promise<Uint8Array>
  hasStateRoot(root: Uint8Array): Promise<boolean> // only used in client

  clearWarmedAccounts(): void
  cleanupTouchedAccounts(): Promise<void>
  clearOriginalStorageCache(): void

  addWarmedAddress(address: Uint8Array): void
  isWarmedAddress(address: Uint8Array): boolean
  addWarmedStorage(address: Uint8Array, slot: Uint8Array): void
  isWarmedStorage(address: Uint8Array, slot: Uint8Array): boolean

  generateCanonicalGenesis(initState: any): Promise<void> // TODO make input more typesafe
  generateAccessList(addressesRemoved: Address[], addressesOnlyStorage: Address[]): AccessList
  getProof(address: Address, storageSlots?: Uint8Array[]): Promise<Proof>

  copy(): EVMStateManagerInterface
}
