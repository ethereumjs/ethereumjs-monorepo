/**
 * External Interfaces for other EthereumJS libraries
 */

import type {
  Account,
  Address,
  BALJSONBlockAccessList,
  BinaryTreeExecutionWitness,
  PrefixedHexString,
} from '@ethereumjs/util'

/** Flat map of hashed storage keys to hex values. */
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

/** Partial account fields for {@link StateManagerInterface.modifyAccountFields}. */
export type AccountFields = Partial<
  Pick<Account, 'nonce' | 'balance' | 'storageRoot' | 'codeHash' | 'codeSize'>
>

/** Merkle proof for one storage slot. */
export type StorageProof = {
  key: PrefixedHexString
  proof: PrefixedHexString[]
  value: PrefixedHexString
}

/** Merkle proof bundle for an account and its storage. */
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
 * Binary tree related
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

/** Kind of binary-tree state accessed during execution. */
export type BinaryTreeAccessedStateType =
  (typeof BinaryTreeAccessedStateType)[keyof typeof BinaryTreeAccessedStateType]

/** Kind of binary-tree state accessed during execution. */
export const BinaryTreeAccessedStateType = {
  BasicData: 'basicData',
  CodeHash: 'codeHash',
  Code: 'code',
  Storage: 'storage',
} as const

/** Low-level binary-tree access record before normalization. */
export type RawBinaryTreeAccessedState = {
  address: Address
  treeIndex: number | bigint
  chunkIndex: number
  chunkKey: PrefixedHexString
}

/** Normalized binary-tree access event emitted by the EVM. */
export type BinaryTreeAccessedState =
  | {
      type: Exclude<
        BinaryTreeAccessedStateType,
        typeof BinaryTreeAccessedStateType.Code | typeof BinaryTreeAccessedStateType.Storage
      >
    }
  | { type: typeof BinaryTreeAccessedStateType.Code; codeOffset: number }
  | { type: typeof BinaryTreeAccessedStateType.Storage; slot: bigint }

/** Binary-tree access event including address and chunk key. */
export type BinaryTreeAccessedStateWithAddress = BinaryTreeAccessedState & {
  address: Address
  chunkKey: PrefixedHexString
}
/** Witness interface tracking binary-tree access gas costs. */
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

/**
 * Minimal surface of a binary-tree-backed state manager as required for
 * binary execution witness generation (see `generateBinaryExecutionWitness`
 * in the `@ethereumjs/evm` package).
 *
 * `StatefulBinaryTreeStateManager` from `@ethereumjs/statemanager` implements
 * this interface; custom state managers can implement it to support witness
 * generation without depending on the concrete class.
 *
 * The `tree` shape is structural (rather than referencing the `BinaryTree`
 * class) so that this package does not depend on `@ethereumjs/binarytree`;
 * `BinaryTree` satisfies it.
 */
export interface BinaryTreeStateManagerInterface {
  /**
   * Gets the current state root of the underlying tree.
   */
  getStateRoot(): Promise<Uint8Array>
  /**
   * The underlying binary tree holding the state.
   */
  readonly tree: {
    /**
     * Gets (no argument) and/or sets (`Uint8Array` argument) the current root
     * of the tree.
     */
    root(value?: Uint8Array | null): Uint8Array
    /**
     * Retrieves the values at the given `suffixes` of the node at `stem`.
     */
    get(stem: Uint8Array, suffixes: number[]): Promise<(Uint8Array | null)[]>
    /**
     * Runs `operation` while holding the tree's internal lock, releasing the
     * lock when the returned promise settles.
     */
    withLock<T>(operation: () => Promise<T>): Promise<T>
  }
}

/**
 * Core state access surface implemented by EthereumJS state managers.
 *
 * Matches the `@ethereumjs/statemanager` package API.
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
  /**
   * Apply an EIP-7928 block-level access list onto this state (no EVM execution).
   * Implementations in `@ethereumjs/statemanager` forward to the shared `consumeBAL()` helper.
   *
   * @remarks Experimental (Amsterdam): may change on patch releases.
   */
  consumeBAL?(bal: BALJSONBlockAccessList, expectedStateRoot?: Uint8Array): Promise<void>

  /*
   * EVM/VM Specific Functionality
   */
  originalStorageCache: {
    get(address: Address, key: Uint8Array): Promise<Uint8Array>
    clear(): void
  }
  generateCanonicalGenesis?(initState: any): Promise<void> // TODO make input more typesafe
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
