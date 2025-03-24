/**
 * External Interfaces for other EthereumJS libraries
 */

import type {
  Account,
  Address,
  BinaryTreeExecutionWitness,
  PrefixedHexString,
  VerkleExecutionWitness,
} from '@ethereumjs/util'

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

export type AccountFields = Partial<
  Pick<Account, 'nonce' | 'balance' | 'storageRoot' | 'codeHash' | 'codeSize'>
>

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

export type BinaryTreeAccessedStateType =
  (typeof BinaryTreeAccessedStateType)[keyof typeof BinaryTreeAccessedStateType]

export const BinaryTreeAccessedStateType = {
  BasicData: 'basicData',
  CodeHash: 'codeHash',
  Code: 'code',
  Storage: 'storage',
} as const

export type RawBinaryTreeAccessedState = {
  address: Address
  treeIndex: number | bigint
  chunkIndex: number
  chunkKey: PrefixedHexString
}

export type BinaryTreeAccessedState =
  | {
      type: Exclude<
        BinaryTreeAccessedStateType,
        typeof BinaryTreeAccessedStateType.Code | typeof BinaryTreeAccessedStateType.Storage
      >
    }
  | { type: typeof BinaryTreeAccessedStateType.Code; codeOffset: number }
  | { type: typeof BinaryTreeAccessedStateType.Storage; slot: bigint }

export type BinaryTreeAccessedStateWithAddress = BinaryTreeAccessedState & {
  address: Address
  chunkKey: PrefixedHexString
}
export interface BinaryTreeAccessWitnessInterface {
  accesses(): Generator<BinaryTreeAccessedStateWithAddress>
  rawAccesses(): Generator<RawBinaryTreeAccessedState>
  debugWitnessCost(): void
  readAccountBasicData(address: Address): bigint
  writeAccountBasicData(address: Address): bigint
  readAccountCodeHash(address: Address): bigint
  writeAccountCodeHash(address: Address): bigint
  readAccountHeader(address: Address): bigint
  writeAccountHeader(address: Address): bigint
  readAccountCodeChunks(contract: Address, startPc: number, endPc: number): bigint
  writeAccountCodeChunks(contract: Address, startPc: number, endPc: number): bigint
  readAccountStorage(contract: Address, storageSlot: bigint): bigint
  writeAccountStorage(contract: Address, storageSlot: bigint): bigint
  merge(accessWitness: BinaryTreeAccessWitnessInterface): void
  commit(): void
  revert(): void
}

export type VerkleAccessedStateType =
  (typeof VerkleAccessedStateType)[keyof typeof VerkleAccessedStateType]

export const VerkleAccessedStateType = {
  BasicData: 'basicData',
  CodeHash: 'codeHash',
  Code: 'code',
  Storage: 'storage',
} as const

export type RawVerkleAccessedState = {
  address: Address
  treeIndex: number | bigint
  chunkIndex: number
  chunkKey: PrefixedHexString
}

export type VerkleAccessedState =
  | {
      type: Exclude<
        VerkleAccessedStateType,
        typeof VerkleAccessedStateType.Code | typeof VerkleAccessedStateType.Storage
      >
    }
  | { type: typeof VerkleAccessedStateType.Code; codeOffset: number }
  | { type: typeof VerkleAccessedStateType.Storage; slot: bigint }

export type VerkleAccessedStateWithAddress = VerkleAccessedState & {
  address: Address
  chunkKey: PrefixedHexString
}
export interface VerkleAccessWitnessInterface {
  accesses(): Generator<VerkleAccessedStateWithAddress>
  rawAccesses(): Generator<RawVerkleAccessedState>
  debugWitnessCost(): void
  readAccountBasicData(address: Address): bigint
  writeAccountBasicData(address: Address): bigint
  readAccountCodeHash(address: Address): bigint
  writeAccountCodeHash(address: Address): bigint
  readAccountHeader(address: Address): bigint
  writeAccountHeader(address: Address): bigint
  readAccountCodeChunks(contract: Address, startPc: number, endPc: number): bigint
  writeAccountCodeChunks(contract: Address, startPc: number, endPc: number): bigint
  readAccountStorage(contract: Address, storageSlot: bigint): bigint
  writeAccountStorage(contract: Address, storageSlot: bigint): bigint
  merge(accessWitness: VerkleAccessWitnessInterface): void
  commit(): void
  revert(): void
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
   * on usage (check for existence)
   */
  // Client RPC
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
  initVerkleExecutionWitness?(
    blockNum: bigint,
    executionWitness?: VerkleExecutionWitness | null,
  ): void
  verifyVerklePostState?(accessWitness: VerkleAccessWitnessInterface): Promise<boolean>
  initBinaryTreeExecutionWitness?(
    blockNum: bigint,
    executionWitness?: BinaryTreeExecutionWitness | null,
  ): void
  verifyBinaryTreePostState?(accessWitness: BinaryTreeAccessWitnessInterface): Promise<boolean>
  checkChunkWitnessPresent?(contract: Address, programCounter: number): Promise<boolean>
  getAppliedKey?(address: Uint8Array): Uint8Array // only for preimages

  /*
   * Utility
   */
  clearCaches(): void
  shallowCopy(downlevelCaches?: boolean): StateManagerInterface
}
