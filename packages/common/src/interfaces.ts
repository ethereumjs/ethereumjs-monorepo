import type { Account, Address, PrefixedHexString } from '@ethereumjs/util'

export interface StorageDump {
  [key: string]: string
}

export type AccountFields = Partial<Pick<Account, 'nonce' | 'balance' | 'storageRoot' | 'codeHash'>>

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

export interface StateManagerInterface {
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
  hasStateRoot(root: Uint8Array): Promise<boolean> // only used in client
  copy(): StateManagerInterface
}

export interface EVMStateManagerInterface extends StateManagerInterface {
  // TODO check if all these `touch?` interfaces can be moved into StateManagerInterface
  putAccount(address: Address, account: Account, touch?: boolean): Promise<void>
  deleteAccount(address: Address, touch?: boolean): Promise<void>
  accountIsEmptyOrNonExistent(address: Address): Promise<boolean>

  getOriginalContractStorage(address: Address, key: Uint8Array): Promise<Uint8Array>

  dumpStorage(address: Address): Promise<StorageDump> // only used in client
  putContractStorage(
    address: Address,
    key: Uint8Array,
    value: Uint8Array,
    touch?: boolean
  ): Promise<void>

  clearContractStorage(address: Address, touch?: boolean): Promise<void>

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
