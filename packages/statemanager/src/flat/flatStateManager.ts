// import { Chain } from '@ethereumjs/common'
// import { RLP } from '@ethereumjs/rlp'
import {
  // KECCAK256_NULL,
  // KECCAK256_NULL_S,
  // KECCAK256_RLP,
  // KECCAK256_RLP_S,
  // bigIntToHex,
  // bytesToBigInt,
  // bytesToHex,
  // bytesToUnprefixedHex,
  // concatBytes,
  // equalsBytes,
  // hexToBytes,
  // setLengthLeft,
  // short,
  // toBytes,
  // unpadBytes,
  // unprefixedHexToBytes,
  utf8ToBytes,
} from '@ethereumjs/util'
// import debugDefault from 'debug'
// import { keccak256 } from 'ethereum-cryptography/keccak.js'

// import { AccountCache, CodeCache, StorageCache } from './cache/index.js'
// import { OriginalStorageCache } from './cache/originalStorageCache.js'

import type { CacheType } from '../cache/index.js'
import type { OriginalStorageCache } from '../cache/originalStorageCache.js'
import type {
  AccountFields,
  Common,
  EVMStateManagerInterface,
  StorageDump,
} from '@ethereumjs/common'
import type { StorageRange } from '@ethereumjs/common/src'
import type { Trie } from '@ethereumjs/trie'
import type { Account, Address, /* DB, */ PrefixedHexString } from '@ethereumjs/util'
// import type { Debugger } from 'debug'
// const { debug: createDebugLogger } = debugDefault

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
 * Options for constructing a {@link StateManager}.
 */
export interface DefaultStateManagerOpts {}

/**
 * Default StateManager implementation for the VM.
 *
 * The state manager abstracts from the underlying data store
 * by providing higher level access to accounts, contract code
 * and storage slots.
 *
 * The default state manager implementation uses a
 * `@ethereumjs/trie` trie as a data backend.
 */
export class FlatStateManager implements EVMStateManagerInterface {
  originalStorageCache: OriginalStorageCache

  /**
   * Instantiate the StateManager interface.
   */
  constructor() {
    throw new Error('Not yet implemented')
  }

  /**
   * Gets the account associated with `address` or `undefined` if account does not exist
   * @param address - Address of the `account` to get
   */
  async getAccount(address: Address): Promise<Account | undefined> {
    throw new Error('Not yet implemented')
  }

  /**
   * Saves an account into state under the provided `address`.
   * @param address - Address under which to store `account`
   * @param account - The account to store or undefined if to be deleted
   */
  async putAccount(address: Address, account: Account | undefined): Promise<void> {
    throw new Error('Not yet implemented')
  }

  /**
   * Gets the account associated with `address`, modifies the given account
   * fields, then saves the account into state. Account fields can include
   * `nonce`, `balance`, `storageRoot`, and `codeHash`.
   * @param address - Address of the account to modify
   * @param accountFields - Object containing account fields and values to modify
   */
  async modifyAccountFields(address: Address, accountFields: AccountFields): Promise<void> {
    throw new Error('Not yet implemented')
  }

  /**
   * Deletes an account from state under the provided `address`.
   * @param address - Address of the account which should be deleted
   */
  async deleteAccount(address: Address) {
    throw new Error('Not yet implemented')
  }

  /**
   * Adds `value` to the state trie as code, and sets `codeHash` on the account
   * corresponding to `address` to reference this.
   * @param address - Address of the `account` to add the `code` for
   * @param value - The value of the `code`
   */
  async putContractCode(address: Address, value: Uint8Array): Promise<void> {
    throw new Error('Not yet implemented')
  }

  /**
   * Gets the code corresponding to the provided `address`.
   * @param address - Address to get the `code` for
   * @returns {Promise<Uint8Array>} -  Resolves with the code corresponding to the provided address.
   * Returns an empty `Uint8Array` if the account has no associated code.
   */
  async getContractCode(address: Address): Promise<Uint8Array> {
    throw new Error('Not yet implemented')
  }

  /**
   * Gets the storage value associated with the provided `address` and `key`. This method returns
   * the shortest representation of the stored value.
   * @param address -  Address of the account to get the storage for
   * @param key - Key in the account's storage to get the value for. Must be 32 bytes long.
   * @returns - The storage value for the account
   * corresponding to the provided address at the provided key.
   * If this does not exist an empty `Uint8Array` is returned.
   */
  async getContractStorage(address: Address, key: Uint8Array): Promise<Uint8Array> {
    throw new Error('Not yet implemented')
  }

  /**
   * Adds value to the state trie for the `account`
   * corresponding to `address` at the provided `key`.
   * @param address -  Address to set a storage value for
   * @param key - Key to set the value at. Must be 32 bytes long.
   * @param value - Value to set at `key` for account corresponding to `address`.
   * Cannot be more than 32 bytes. Leading zeros are stripped.
   * If it is a empty or filled with zeros, deletes the value.
   */
  async putContractStorage(address: Address, key: Uint8Array, value: Uint8Array): Promise<void> {
    throw new Error('Not yet implemented')
  }

  /**
   * Clears all storage entries for the account corresponding to `address`.
   * @param address - Address to clear the storage of
   */
  async clearContractStorage(address: Address): Promise<void> {
    throw new Error('Not yet implemented')
  }

  /**
   * Checkpoints the current state of the StateManager instance.
   * State changes that follow can then be committed by calling
   * `commit` or `reverted` by calling rollback.
   */
  async checkpoint(): Promise<void> {
    throw new Error('Not yet implemented')
  }

  /**
   * Commits the current change-set to the instance since the
   * last call to checkpoint.
   */
  async commit(): Promise<void> {
    throw new Error('Not yet implemented')
  }

  /**
   * Reverts the current change-set to the instance since the
   * last call to checkpoint.
   */
  async revert(): Promise<void> {
    throw new Error('Not yet implemented')
  }

  /**
   * Writes all cache items to the trie
   */
  async flush(): Promise<void> {
    throw new Error('Not yet implemented')
  }

  /**
   * Get an EIP-1186 proof
   * @param address address to get proof of
   * @param storageSlots storage slots to get proof of
   */
  async getProof(address: Address, storageSlots: Uint8Array[] = []): Promise<Proof> {
    throw new Error('Not yet implemented')
  }

  /**
   * Verify an EIP-1186 proof. Throws if proof is invalid, otherwise returns true.
   * @param proof the proof to prove
   */
  async verifyProof(proof: Proof): Promise<boolean> {
    throw new Error('Not yet implemented')
  }

  /**
   * Gets the state-root of the Merkle-Patricia trie representation
   * of the state of this StateManager. Will error if there are uncommitted
   * checkpoints on the instance.
   * @returns {Promise<Uint8Array>} - Returns the state-root of the `StateManager`
   */
  async getStateRoot(): Promise<Uint8Array> {
    throw new Error('Not yet implemented')
  }

  /**
   * Sets the state of the instance to that represented
   * by the provided `stateRoot`. Will error if there are uncommitted
   * checkpoints on the instance or if the state root does not exist in
   * the state trie.
   * @param stateRoot - The state-root to reset the instance to
   */
  async setStateRoot(stateRoot: Uint8Array, clearCache: boolean = true): Promise<void> {
    throw new Error('Not yet implemented')
  }

  /**
   * Dumps the RLP-encoded storage values for an `account` specified by `address`.
   * @param address - The address of the `account` to return storage for
   * @returns {Promise<StorageDump>} - The state of the account as an `Object` map.
   * Keys are are the storage keys, values are the storage values as strings.
   * Both are represented as hex strings without the `0x` prefix.
   */
  async dumpStorage(address: Address): Promise<StorageDump> {
    throw new Error('Not yet implemented')
  }

  /**
   Dumps a limited number of RLP-encoded storage values for an account specified by `address`,
   starting from `startKey` or greater.
   @param address - The address of the `account` to return storage for.
   @param startKey - The bigint representation of the smallest storage key that will be returned.
   @param limit - The maximum number of storage values that will be returned.
   @returns {Promise<StorageRange>} - A {@link StorageRange} object that will contain at most `limit` entries in its `storage` field.
   The object will also contain `nextKey`, the next (hashed) storage key after the range included in `storage`.
   */
  async dumpStorageRange(address: Address, startKey: bigint, limit: number): Promise<StorageRange> {
    throw new Error('Not yet implemented')
  }

  /**
   * Initializes the provided genesis state into the state trie.
   * Will error if there are uncommitted checkpoints on the instance.
   * @param initState address -> balance | [balance, code, storage]
   */
  async generateCanonicalGenesis(initState: any): Promise<void> {
    throw new Error('Not yet implemented')
  }

  /**
   * Checks whether there is a state corresponding to a stateRoot
   */
  async hasStateRoot(root: Uint8Array): Promise<boolean> {
    throw new Error('Not yet implemented')
  }

  /**
   * Copies the current instance of the `StateManager`
   * at the last fully committed point, i.e. as if all current
   * checkpoints were reverted.
   *
   * Caches are downleveled (so: adopted for short-term usage)
   * by default.
   *
   * This means in particular:
   * 1. For caches instantiated as an LRU cache type
   * the copy() method will instantiate with an ORDERED_MAP cache
   * instead, since copied instantances are mostly used in
   * short-term usage contexts and LRU cache instantation would create
   * a large overhead here.
   * 2. The underlying trie object is initialized with 0 cache size
   *
   * Both adoptions can be deactivated by setting `downlevelCaches` to
   * `false`.
   *
   * Cache values are generally not copied along regardless of the
   * `downlevelCaches` setting.
   */
  shallowCopy(downlevelCaches: boolean = true): EVMStateManagerInterface {
    throw new Error('Not yet implemented')
  }

  /**
   * Clears all underlying caches
   */
  clearCaches() {
    throw new Error('Not yet implemented')
  }
}
