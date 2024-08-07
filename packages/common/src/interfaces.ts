/**
 * External Interfaces for other EthereumJS libraries
 */

import type { Account, Address, PrefixedHexString } from '@ethereumjs/util'

export interface StorageDump {
  [key: string]: string
}

/**
 * Object that can contain a set of storage keys associated with an account.
 */
export interface StorageRange {
  /**
   * A dictionary where the keys are hashed storage keys, and the values are
   * objects containing the preimage of the hashed key (in `key`) and the
   * storage key (in `value`). Currently, there is no way to retrieve preimages,
   * so they are always `null`.
   */
  storage: {
    [key: string]: {
      key: string | null
      value: string
    }
  }
  /**
   * The next (hashed) storage key after the greatest storage key
   * contained in `storage`.
   */
  nextKey: string | null
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

/**
 * Authorization list types
 */
export type AuthorizationListItem = {
  chainId: PrefixedHexString
  address: PrefixedHexString
  nonce: PrefixedHexString[]
  yParity: PrefixedHexString
  r: PrefixedHexString
  s: PrefixedHexString
}

// Tuple of [chain_id, address, [nonce], y_parity, r, s]
export type AuthorizationListBytesItem = [
  Uint8Array,
  Uint8Array,
  Uint8Array[],
  Uint8Array,
  Uint8Array,
  Uint8Array,
]
export type AuthorizationListBytes = AuthorizationListBytesItem[]
export type AuthorizationList = AuthorizationListItem[]

/**
 * Verkle related
 *
 * Experimental (do not implement)
 */
export type AccessEventFlags = {
  stemRead: boolean
  stemWrite: boolean
  chunkRead: boolean
  chunkWrite: boolean
  chunkFill: boolean
}

/**
 * Verkle related
 *
 * Experimental (do not implement)
 */
export interface AccessWitnessInterface {
  touchAndChargeProofOfAbsence(address: Address): bigint
  touchAndChargeMessageCall(address: Address): bigint
  touchAndChargeValueTransfer(caller: Address, target: Address): bigint
  touchAndChargeContractCreateInit(address: Address): bigint
  touchAndChargeContractCreateCompleted(address: Address): bigint
  touchTxOriginAndComputeGas(origin: Address): bigint
  touchTxTargetAndComputeGas(target: Address, { sendsValue }: { sendsValue?: boolean }): bigint
  touchCodeChunksRangeOnReadAndChargeGas(contact: Address, startPc: number, endPc: number): bigint
  touchCodeChunksRangeOnWriteAndChargeGas(contact: Address, startPc: number, endPc: number): bigint
  touchAddressOnWriteAndComputeGas(
    address: Address,
    treeIndex: number | bigint,
    subIndex: number | Uint8Array,
  ): bigint
  touchAddressOnReadAndComputeGas(
    address: Address,
    treeIndex: number | bigint,
    subIndex: number | Uint8Array,
  ): bigint
  touchAddressAndChargeGas(
    address: Address,
    treeIndex: number | bigint,
    subIndex: number | Uint8Array,
    { isWrite }: { isWrite?: boolean },
  ): bigint
  touchAddress(
    address: Address,
    treeIndex: number | bigint,
    subIndex: number | Uint8Array,
    { isWrite }: { isWrite?: boolean },
  ): AccessEventFlags
  shallowCopy(): AccessWitnessInterface
  merge(accessWitness: AccessWitnessInterface): void
}

/*
 * Generic StateManager interface corresponding with the @ethereumjs/statemanager package
 *
 */
export interface StateManagerInterface {
  /*
   * Core Access Functionality
   */
  // Account methods
  getAccount(address: Address): Promise<Account | undefined>
  putAccount(address: Address, account?: Account): Promise<void>
  deleteAccount(address: Address): Promise<void>
  modifyAccountFields(address: Address, accountFields: AccountFields): Promise<void>

  // Code methods
  putCode(address: Address, value: Uint8Array): Promise<void>
  getCode(address: Address): Promise<Uint8Array>
  getCodeSize(address: Address): Promise<number>

  // Storage methods
  getStorage(address: Address, key: Uint8Array): Promise<Uint8Array>
  putStorage(address: Address, key: Uint8Array, value: Uint8Array): Promise<void>
  clearStorage(address: Address): Promise<void>

  /*
   * Checkpointing Functionality
   */
  checkpoint(): Promise<void>
  commit(): Promise<void>
  revert(): Promise<void>

  /*
   * State Root Functionality
   */
  getStateRoot(): Promise<Uint8Array>
  setStateRoot(stateRoot: Uint8Array, clearCache?: boolean): Promise<void>
  hasStateRoot(root: Uint8Array): Promise<boolean> // only used in client

  /*
   * Extra Functionality
   *
   * Optional non-essential methods, these methods should always be guarded
   * on usage (check for existance)
   */
  // Client RPC
  getProof?(address: Address, storageSlots: Uint8Array[]): Promise<Proof>
  dumpStorage?(address: Address): Promise<StorageDump>
  dumpStorageRange?(address: Address, startKey: bigint, limit: number): Promise<StorageRange>

  /*
   * EVM/VM Specific Functionality
   */
  originalStorageCache: {
    get(address: Address, key: Uint8Array): Promise<Uint8Array>
    clear(): void
  }
  generateCanonicalGenesis?(initState: any): Promise<void> // TODO make input more typesafe
  // only Verkle/EIP-6800 (experimental)
  checkChunkWitnessPresent?(contract: Address, programCounter: number): Promise<boolean>
  getAppliedKey?(address: Uint8Array): Uint8Array // only for preimages

  /*
   * Utility
   */
  clearCaches(): void
  shallowCopy(downlevelCaches?: boolean): StateManagerInterface
}
