const Set = require('core-js-pure/es/set')
import { debug as createDebugLogger } from 'debug'
import { SecureTrie as Trie } from 'merkle-patricia-tree'
import {
  Account,
  Address,
  BN,
  toBuffer,
  keccak256,
  KECCAK256_NULL,
  unpadBuffer,
} from 'ethereumjs-util'
import { encode, decode } from 'rlp'
import Common from '@ethereumjs/common'
import { genesisStateByName } from '@ethereumjs/common/dist/genesisStates'
import { StateManager, StorageDump } from './interface'
import Cache from './cache'
import { ripemdPrecompileAddress } from '../evm/precompiles'
import { short } from '../evm/opcodes'

const debug = createDebugLogger('vm:state')

type AddressHex = string

/**
 * Options for constructing a [[StateManager]].
 */
export interface DefaultStateManagerOpts {
  /**
   * Parameters of the chain ([`Common`](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/common))
   */
  common?: Common
  /**
   * An [`merkle-patricia-tree`](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/trie) instance
   */
  trie?: Trie
}

/**
 * Interface for getting and setting data from an underlying
 * state trie.
 */
export default class DefaultStateManager implements StateManager {
  _common: Common
  _trie: Trie
  _storageTries: { [key: string]: Trie }
  _cache: Cache
  _touched: Set<AddressHex>
  _touchedStack: Set<AddressHex>[]
  _checkpointCount: number
  _originalStorageCache: Map<AddressHex, Map<AddressHex, Buffer>>

  // EIP-2929 address/storage trackers.
  // This maps both the accessed accounts and the accessed storage slots.
  // It is a Map(Address => StorageSlots)
  // It is possible that the storage slots set is empty. This means that the address is warm.
  // It is not possible to have an accessed storage slot on a cold address (which is why this structure works)
  // Each call level tracks their access themselves.
  // In case of a commit, copy everything if the value does not exist, to the level above
  // In case of a revert, discard any warm slots.
  _accessedStorage: Map<string, Set<string>>[]

  /**
   * Instantiate the StateManager interface.
   */
  constructor(opts: DefaultStateManagerOpts = {}) {
    let common = opts.common
    if (!common) {
      common = new Common({ chain: 'mainnet', hardfork: 'petersburg' })
    }
    this._common = common

    this._trie = opts.trie || new Trie()
    this._storageTries = {}
    this._cache = new Cache(this._trie)
    this._touched = new Set()
    this._touchedStack = []
    this._checkpointCount = 0
    this._originalStorageCache = new Map()
    this._accessedStorage = [new Map()]
  }

  /**
   * Copies the current instance of the `StateManager`
   * at the last fully committed point, i.e. as if all current
   * checkpoints were reverted.
   */
  copy(): StateManager {
    return new DefaultStateManager({
      trie: this._trie.copy(false),
      common: this._common,
    })
  }

  /**
   * Gets the account associated with `address`. Returns an empty account if the account does not exist.
   * @param address - Address of the `account` to get
   */
  async getAccount(address: Address): Promise<Account> {
    const account = await this._cache.getOrLoad(address)
    return account
  }

  /**
   * Saves an account into state under the provided `address`.
   * @param address - Address under which to store `account`
   * @param account - The account to store
   */
  async putAccount(address: Address, account: Account): Promise<void> {
    debug(
      `Save account address=${address} nonce=${account.nonce} balance=${account.balance} contract=${
        account.isContract() ? 'yes' : 'no'
      } empty=${account.isEmpty() ? 'yes' : 'no'}`
    )
    this._cache.put(address, account)
    this.touchAccount(address)
  }

  /**
   * Deletes an account from state under the provided `address`. The account will also be removed from the state trie.
   * @param address - Address of the account which should be deleted
   */
  async deleteAccount(address: Address) {
    debug(`Delete account ${address}`)
    this._cache.del(address)
    this.touchAccount(address)
  }

  /**
   * Marks an account as touched, according to the definition
   * in [EIP-158](https://eips.ethereum.org/EIPS/eip-158).
   * This happens when the account is triggered for a state-changing
   * event. Touched accounts that are empty will be cleared
   * at the end of the tx.
   */
  touchAccount(address: Address): void {
    this._touched.add(address.buf.toString('hex'))
  }

  /**
   * Adds `value` to the state trie as code, and sets `codeHash` on the account
   * corresponding to `address` to reference this.
   * @param address - Address of the `account` to add the `code` for
   * @param value - The value of the `code`
   */
  async putContractCode(address: Address, value: Buffer): Promise<void> {
    const codeHash = keccak256(value)

    if (codeHash.equals(KECCAK256_NULL)) {
      return
    }

    await this._trie.db.put(codeHash, value)

    const account = await this.getAccount(address)
    debug(`Update codeHash (-> ${short(codeHash)}) for account ${address}`)
    account.codeHash = codeHash
    await this.putAccount(address, account)
  }

  /**
   * Gets the code corresponding to the provided `address`.
   * @param address - Address to get the `code` for
   * @returns {Promise<Buffer>} -  Resolves with the code corresponding to the provided address.
   * Returns an empty `Buffer` if the account has no associated code.
   */
  async getContractCode(address: Address): Promise<Buffer> {
    const account = await this.getAccount(address)
    if (!account.isContract()) {
      return Buffer.alloc(0)
    }
    const code = await this._trie.db.get(account.codeHash)
    return code || Buffer.alloc(0)
  }

  /**
   * Creates a storage trie from the primary storage trie
   * for an account and saves this in the storage cache.
   * @private
   */
  async _lookupStorageTrie(address: Address): Promise<Trie> {
    // from state trie
    const account = await this.getAccount(address)
    const storageTrie = this._trie.copy(false)
    storageTrie.root = account.stateRoot
    storageTrie.db.checkpoints = []
    return storageTrie
  }

  /**
   * Gets the storage trie for an account from the storage
   * cache or does a lookup.
   * @private
   */
  async _getStorageTrie(address: Address): Promise<Trie> {
    // from storage cache
    const addressHex = address.buf.toString('hex')
    let storageTrie = this._storageTries[addressHex]
    if (!storageTrie) {
      // lookup from state
      storageTrie = await this._lookupStorageTrie(address)
    }
    return storageTrie
  }

  /**
   * Gets the storage value associated with the provided `address` and `key`. This method returns
   * the shortest representation of the stored value.
   * @param address -  Address of the account to get the storage for
   * @param key - Key in the account's storage to get the value for. Must be 32 bytes long.
   * @returns {Promise<Buffer>} - The storage value for the account
   * corresponding to the provided address at the provided key.
   * If this does not exist an empty `Buffer` is returned.
   */
  async getContractStorage(address: Address, key: Buffer): Promise<Buffer> {
    if (key.length !== 32) {
      throw new Error('Storage key must be 32 bytes long')
    }

    const trie = await this._getStorageTrie(address)
    const value = await trie.get(key)
    const decoded = decode(value)
    return decoded as Buffer
  }

  /**
   * Caches the storage value associated with the provided `address` and `key`
   * on first invocation, and returns the cached (original) value from then
   * onwards. This is used to get the original value of a storage slot for
   * computing gas costs according to EIP-1283.
   * @param address - Address of the account to get the storage for
   * @param key - Key in the account's storage to get the value for. Must be 32 bytes long.
   */
  async getOriginalContractStorage(address: Address, key: Buffer): Promise<Buffer> {
    if (key.length !== 32) {
      throw new Error('Storage key must be 32 bytes long')
    }

    const addressHex = address.buf.toString('hex')
    const keyHex = key.toString('hex')

    let map: Map<AddressHex, Buffer>
    if (!this._originalStorageCache.has(addressHex)) {
      map = new Map()
      this._originalStorageCache.set(addressHex, map)
    } else {
      map = this._originalStorageCache.get(addressHex)!
    }

    if (map.has(keyHex)) {
      return map.get(keyHex)!
    } else {
      const current = await this.getContractStorage(address, key)
      map.set(keyHex, current)
      return current
    }
  }

  /**
   * Clears the original storage cache. Refer to [[getOriginalContractStorage]]
   * for more explanation.
   */
  _clearOriginalStorageCache(): void {
    this._originalStorageCache = new Map()
  }

  /**
   * Clears the original storage cache. Refer to [[getOriginalContractStorage]]
   * for more explanation. Alias of the internal _clearOriginalStorageCache
   */
  clearOriginalStorageCache(): void {
    this._clearOriginalStorageCache()
  }

  /**
   * Modifies the storage trie of an account.
   * @private
   * @param address -  Address of the account whose storage is to be modified
   * @param modifyTrie - Function to modify the storage trie of the account
   */
  async _modifyContractStorage(
    address: Address,
    modifyTrie: (storageTrie: Trie, done: Function) => void
  ): Promise<void> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const storageTrie = await this._getStorageTrie(address)

      modifyTrie(storageTrie, async () => {
        // update storage cache
        const addressHex = address.buf.toString('hex')
        this._storageTries[addressHex] = storageTrie

        // update contract stateRoot
        const contract = this._cache.get(address)
        contract.stateRoot = storageTrie.root

        await this.putAccount(address, contract)
        this.touchAccount(address)
        resolve()
      })
    })
  }

  /**
   * Adds value to the state trie for the `account`
   * corresponding to `address` at the provided `key`.
   * @param address -  Address to set a storage value for
   * @param key - Key to set the value at. Must be 32 bytes long.
   * @param value - Value to set at `key` for account corresponding to `address`. Cannot be more than 32 bytes. Leading zeros are stripped. If it is a empty or filled with zeros, deletes the value.
   */
  async putContractStorage(address: Address, key: Buffer, value: Buffer): Promise<void> {
    if (key.length !== 32) {
      throw new Error('Storage key must be 32 bytes long')
    }

    if (value.length > 32) {
      throw new Error('Storage value cannot be longer than 32 bytes')
    }

    value = unpadBuffer(value)

    await this._modifyContractStorage(address, async (storageTrie, done) => {
      if (value && value.length) {
        // format input
        const encodedValue = encode(value)
        debug(`Update contract storage for account ${address} to ${short(value)}`)
        await storageTrie.put(key, encodedValue)
      } else {
        // deleting a value
        debug(`Delete contract storage for account`)
        await storageTrie.del(key)
      }
      done()
    })
  }

  /**
   * Clears all storage entries for the account corresponding to `address`.
   * @param address -  Address to clear the storage of
   */
  async clearContractStorage(address: Address): Promise<void> {
    await this._modifyContractStorage(address, (storageTrie, done) => {
      storageTrie.root = storageTrie.EMPTY_TRIE_ROOT
      done()
    })
  }

  /**
   * Checkpoints the current state of the StateManager instance.
   * State changes that follow can then be committed by calling
   * `commit` or `reverted` by calling rollback.
   */
  async checkpoint(): Promise<void> {
    this._trie.checkpoint()
    this._cache.checkpoint()
    this._touchedStack.push(new Set(Array.from(this._touched)))
    this._accessedStorage.push(new Map())
    this._checkpointCount++
  }

  /**
   * Commits the current change-set to the instance since the
   * last call to checkpoint.
   */
  async commit(): Promise<void> {
    // setup trie checkpointing
    await this._trie.commit()
    // setup cache checkpointing
    this._cache.commit()
    this._touchedStack.pop()
    this._checkpointCount--

    // Copy the contents of the map of the current level to a map higher.

    const storageMap = this._accessedStorage.pop()
    // mapTarget is current level, since the pop operation is above
    const mapTarget = this._accessedStorage[this._accessedStorage.length - 1]

    if (mapTarget) {
      // Note: storageMap is always defined here per definition (TypeScript cannot infer this)
      storageMap?.forEach((slotSet: Set<string>, addressString: string) => {
        const addressExists = mapTarget.get(addressString)
        if (!addressExists) {
          mapTarget.set(addressString, new Set())
        }
        const storageSet = mapTarget.get(addressString)
        slotSet.forEach((value: string) => {
          storageSet!.add(value)
        })
      })
    }

    if (this._checkpointCount === 0) {
      await this._cache.flush()
      this._clearOriginalStorageCache()
    }
  }

  /**
   * Reverts the current change-set to the instance since the
   * last call to checkpoint.
   */
  async revert(): Promise<void> {
    // setup trie checkpointing
    await this._trie.revert()
    // setup cache checkpointing
    this._cache.revert()
    this._storageTries = {}
    this._accessedStorage.pop()
    const touched = this._touchedStack.pop()
    if (!touched) {
      throw new Error('Reverting to invalid state checkpoint failed')
    }
    // Exceptional case due to consensus issue in Geth and Parity.
    // See [EIP issue #716](https://github.com/ethereum/EIPs/issues/716) for context.
    // The RIPEMD precompile has to remain *touched* even when the call reverts,
    // and be considered for deletion.
    if (this._touched.has(ripemdPrecompileAddress)) {
      touched.add(ripemdPrecompileAddress)
    }
    this._touched = touched
    this._checkpointCount--

    if (this._checkpointCount === 0) {
      await this._cache.flush()
      this._clearOriginalStorageCache()
    }
  }

  /**
   * Gets the state-root of the Merkle-Patricia trie representation
   * of the state of this StateManager. Will error if there are uncommitted
   * checkpoints on the instance.
   * @param force - If set to `true`, force a cache flush even if there are uncommited checkpoints (this is set to `true` pre-Byzantium in order to get intermediate state roots for the receipts)
   * @returns {Promise<Buffer>} - Returns the state-root of the `StateManager`
   */
  async getStateRoot(force: boolean = false): Promise<Buffer> {
    if (!force && this._checkpointCount !== 0) {
      throw new Error('Cannot get state root with uncommitted checkpoints')
    }
    await this._cache.flush()
    const stateRoot = this._trie.root
    return stateRoot
  }

  /**
   * Sets the state of the instance to that represented
   * by the provided `stateRoot`. Will error if there are uncommitted
   * checkpoints on the instance or if the state root does not exist in
   * the state trie.
   * @param stateRoot - The state-root to reset the instance to
   */
  async setStateRoot(stateRoot: Buffer): Promise<void> {
    if (this._checkpointCount !== 0) {
      throw new Error('Cannot set state root with uncommitted checkpoints')
    }

    await this._cache.flush()

    if (stateRoot === this._trie.EMPTY_TRIE_ROOT) {
      this._trie.root = stateRoot
      this._cache.clear()
      this._storageTries = {}
      return
    }

    const hasRoot = await this._trie.checkRoot(stateRoot)
    if (!hasRoot) {
      throw new Error('State trie does not contain state root')
    }

    this._trie.root = stateRoot
    this._cache.clear()
    this._storageTries = {}
  }

  /**
   * Dumps the RLP-encoded storage values for an `account` specified by `address`.
   * @param address - The address of the `account` to return storage for
   * @returns {Promise<StorageDump>} - The state of the account as an `Object` map.
   * Keys are are the storage keys, values are the storage values as strings.
   * Both are represented as hex strings without the `0x` prefix.
   */
  async dumpStorage(address: Address): Promise<StorageDump> {
    return new Promise((resolve, reject) => {
      this._getStorageTrie(address)
        .then((trie) => {
          const storage: StorageDump = {}
          const stream = trie.createReadStream()

          stream.on('data', (val: any) => {
            storage[val.key.toString('hex')] = val.value.toString('hex')
          })
          stream.on('end', () => {
            resolve(storage)
          })
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  /**
   * Checks whether the current instance has the canonical genesis state
   * for the configured chain parameters.
   * @returns {Promise<boolean>} - Whether the storage trie contains the
   * canonical genesis state for the configured chain parameters.
   */
  async hasGenesisState(): Promise<boolean> {
    const root = this._common.genesis().stateRoot
    return await this._trie.checkRoot(root)
  }

  /**
   * Generates a canonical genesis state on the instance based on the
   * configured chain parameters. Will error if there are uncommitted
   * checkpoints on the instance.
   */
  async generateCanonicalGenesis(): Promise<void> {
    if (this._checkpointCount !== 0) {
      throw new Error('Cannot create genesis state with uncommitted checkpoints')
    }

    const genesis = await this.hasGenesisState()
    if (!genesis) {
      await this.generateGenesis(genesisStateByName(this._common.chainName()))
    }
  }

  /**
   * Initializes the provided genesis state into the state trie
   * @param initState - Object (address -> balance)
   */
  async generateGenesis(initState: any): Promise<void> {
    if (this._checkpointCount !== 0) {
      throw new Error('Cannot create genesis state with uncommitted checkpoints')
    }

    debug(`Save genesis state into the state trie`)
    const addresses = Object.keys(initState)
    for (const address of addresses) {
      const balance = new BN(toBuffer(initState[address]))
      const account = Account.fromAccountData({ balance })
      const addressBuffer = toBuffer(address)
      await this._trie.put(addressBuffer, account.serialize())
    }
  }

  /**
   * Checks if the `account` corresponding to `address`
   * is empty or non-existent as defined in
   * EIP-161 (https://eips.ethereum.org/EIPS/eip-161).
   * @param address - Address to check
   */
  async accountIsEmpty(address: Address): Promise<boolean> {
    const account = await this.getAccount(address)
    return account.isEmpty()
  }

  /**
   * Checks if the `account` corresponding to `address`
   * exists
   * @param address - Address of the `account` to check
   */
  async accountExists(address: Address): Promise<boolean> {
    const account = this._cache.lookup(address)
    if (account && !this._cache.keyIsDeleted(address)) {
      return true
    }
    if (await this._cache._trie.get(address.buf)) {
      return true
    }
    return false
  }

  /** EIP-2929 logic
   * This should only be called from within the EVM
   */

  /**
   * Returns true if the address is warm in the current context
   * @param address - The address (as a Buffer) to check
   */
  isWarmedAddress(address: Buffer): boolean {
    for (let i = this._accessedStorage.length - 1; i >= 0; i--) {
      const currentMap = this._accessedStorage[i]
      if (currentMap.has(address.toString('hex'))) {
        return true
      }
    }
    return false
  }

  /**
   * Add a warm address in the current context
   * @param address - The address (as a Buffer) to check
   */
  addWarmedAddress(address: Buffer): void {
    const key = address.toString('hex')
    const storageSet = this._accessedStorage[this._accessedStorage.length - 1].get(key)
    if (!storageSet) {
      const emptyStorage = new Set()
      this._accessedStorage[this._accessedStorage.length - 1].set(key, emptyStorage)
    }
  }

  /**
   * Returns true if the slot of the address is warm
   * @param address - The address (as a Buffer) to check
   * @param slot - The slot (as a Buffer) to check
   */
  isWarmedStorage(address: Buffer, slot: Buffer): boolean {
    const addressKey = address.toString('hex')
    const storageKey = slot.toString('hex')

    for (let i = this._accessedStorage.length - 1; i >= 0; i--) {
      const currentMap = this._accessedStorage[i]
      if (currentMap.has(addressKey) && currentMap.get(addressKey)!.has(storageKey)) {
        return true
      }
    }

    return false
  }

  /**
   * Mark the storage slot in the address as warm in the current context
   * @param address - The address (as a Buffer) to check
   * @param slot - The slot (as a Buffer) to check
   */
  addWarmedStorage(address: Buffer, slot: Buffer): void {
    const addressKey = address.toString('hex')
    let storageSet = this._accessedStorage[this._accessedStorage.length - 1].get(addressKey)
    if (!storageSet) {
      storageSet = new Set()
      this._accessedStorage[this._accessedStorage.length - 1].set(addressKey, storageSet!)
    }
    storageSet!.add(slot.toString('hex'))
  }

  /**
   * Clear the warm accounts and storage. To be called after a transaction finished.
   */
  clearWarmedAccounts(): void {
    this._accessedStorage = [new Map()]
  }

  /**
   * Removes accounts form the state trie that have been touched,
   * as defined in EIP-161 (https://eips.ethereum.org/EIPS/eip-161).
   */
  async cleanupTouchedAccounts(): Promise<void> {
    if (this._common.gteHardfork('spuriousDragon')) {
      const touchedArray = Array.from(this._touched)
      for (const addressHex of touchedArray) {
        const address = new Address(Buffer.from(addressHex, 'hex'))
        const empty = await this.accountIsEmpty(address)
        if (empty) {
          this._cache.del(address)
          debug(`Cleanup touched account address=${address.toString()} (>= SpuriousDragon)`)
        }
      }
    }
    this._touched.clear()
  }
}
