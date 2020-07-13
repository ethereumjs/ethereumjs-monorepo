const Set = require('core-js-pure/es/set')
import { SecureTrie as Trie } from 'merkle-patricia-tree'
import { BN, toBuffer, keccak256, KECCAK256_NULL } from 'ethereumjs-util'
import { encode, decode } from 'rlp'
import Common from '@ethereumjs/common'
import { genesisStateByName } from '@ethereumjs/common/dist/genesisStates'
import Account from '@ethereumjs/account'
import { StateManager, StorageDump } from './interface'
import Cache from './cache'
import { ripemdPrecompileAddress } from '../evm/precompiles'

/**
 * Options for constructing a [[StateManager]].
 */
export interface DefaultStateManagerOpts {
  /**
   * Parameters of the chain ([`Common`](https://github.com/ethereumjs/ethereumjs-common))
   */
  common?: Common
  /**
   * A [`merkle-patricia-tree`](https://github.com/ethereumjs/merkle-patricia-tree) instance
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
  _storageTries: any
  _cache: Cache
  _touched: Set<string>
  _touchedStack: Set<string>[]
  _checkpointCount: number
  _originalStorageCache: Map<string, Map<string, Buffer>>

  /**
   * Instantiate the StateManager interface.
   */
  constructor(opts: DefaultStateManagerOpts = {}) {
    let common = opts.common
    if (!common) {
      common = new Common('mainnet', 'petersburg')
    }
    this._common = common

    this._trie = opts.trie || new Trie()
    this._storageTries = {} // the storage trie cache
    this._cache = new Cache(this._trie)
    this._touched = new Set()
    this._touchedStack = []
    this._checkpointCount = 0
    this._originalStorageCache = new Map()
  }

  /**
   * Copies the current instance of the `StateManager`
   * at the last fully committed point, i.e. as if all current
   * checkpoints were reverted.
   */
  copy(): StateManager {
    return new DefaultStateManager({ trie: this._trie.copy(false), common: this._common })
  }

  /**
   * Gets the [`@ethereumjs/account`](https://github.com/ethereumjs/ethereumjs-vm/tree/master/packages/account)
   * associated with `address`. Returns an empty account if the account does not exist.
   * @param address - Address of the `account` to get
   */
  async getAccount(address: Buffer): Promise<Account> {
    const account = (await this._cache.getOrLoad(address)) as Account
    return account
  }

  /**
   * Saves an [`@ethereumjs/account`](https://github.com/ethereumjs/ethereumjs-vm/tree/master/packages/account)
   * into state under the provided `address`.
   * @param address - Address under which to store `account`
   * @param account - The [`@ethereumjs/account`](https://github.com/ethereumjs/ethereumjs-vm/tree/master/packages/account) to store
   */
  async putAccount(address: Buffer, account: Account): Promise<void> {
    // TODO: dont save newly created accounts that have no balance
    // if (toAccount.balance.toString('hex') === '00') {
    // if they have money or a non-zero nonce or code, then write to tree
    this._cache.put(address, account)
    this.touchAccount(address)
  }

  async deleteAccount(address: Buffer) {
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
  touchAccount(address: Buffer): void {
    this._touched.add(address.toString('hex'))
  }

  /**
   * Adds `value` to the state trie as code, and sets `codeHash` on the account
   * corresponding to `address` to reference this.
   * @param address - Address of the `account` to add the `code` for
   * @param value - The value of the `code`
   */
  async putContractCode(address: Buffer, value: Buffer): Promise<void> {
    const codeHash = keccak256(value)

    if (codeHash.equals(KECCAK256_NULL)) {
      //return
    }

    const account = await this.getAccount(address)
    account.codeHash = codeHash

    await this._trie._mainDB.put(codeHash, value)
    await this.putAccount(address, account)
  }

  /**
   * Gets the code corresponding to the provided `address`.
   * @param address - Address to get the `code` for
   * @returns {Promise<Buffer>} -  Resolves with the code corresponding to the provided address.
   * Returns an empty `Buffer` if the account has no associated code.
   */
  async getContractCode(address: Buffer): Promise<Buffer> {
    const account = await this.getAccount(address)
    if (!account.isContract()) {
      return Buffer.alloc(0)
    }
    const code = await this._trie._mainDB.get(account.codeHash)
    return code || Buffer.alloc(0)
  }

  /**
   * Creates a storage trie from the primary storage trie
   * for an account and saves this in the storage cache.
   * @private
   */
  async _lookupStorageTrie(address: Buffer): Promise<Trie> {
    // from state trie
    const account = await this.getAccount(address)
    const storageTrie = this._trie.copy(false)
    storageTrie.root = account.stateRoot
    storageTrie._checkpoints = []
    return storageTrie
  }

  /**
   * Gets the storage trie for an account from the storage
   * cache or does a lookup.
   * @private
   */
  async _getStorageTrie(address: Buffer): Promise<Trie> {
    // from storage cache
    let storageTrie = this._storageTries[address.toString('hex')]
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
  async getContractStorage(address: Buffer, key: Buffer): Promise<Buffer> {
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
  async getOriginalContractStorage(address: Buffer, key: Buffer): Promise<Buffer> {
    if (key.length !== 32) {
      throw new Error('Storage key must be 32 bytes long')
    }

    const addressHex = address.toString('hex')
    const keyHex = key.toString('hex')

    let map: Map<string, Buffer>
    if (!this._originalStorageCache.has(addressHex)) {
      map = new Map()
      this._originalStorageCache.set(addressHex, map)
    } else {
      map = this._originalStorageCache.get(addressHex) as Map<string, Buffer>
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
   * Modifies the storage trie of an account.
   * @private
   * @param address -  Address of the account whose storage is to be modified
   * @param modifyTrie - Function to modify the storage trie of the account
   */
  async _modifyContractStorage(
    address: Buffer,
    modifyTrie: (storageTrie: Trie, done: Function) => void,
  ): Promise<void> {
    return new Promise(async (resolve) => {
      const storageTrie = await this._getStorageTrie(address)

      modifyTrie(storageTrie, async () => {
        // update storage cache
        this._storageTries[address.toString('hex')] = storageTrie

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
   * @param value - Value to set at `key` for account corresponding to `address`
   */
  async putContractStorage(address: Buffer, key: Buffer, value: Buffer): Promise<void> {
    if (key.length !== 32) {
      throw new Error('Storage key must be 32 bytes long')
    }

    await this._modifyContractStorage(address, async (storageTrie, done) => {
      if (value && value.length) {
        // format input
        const encodedValue = encode(value)
        await storageTrie.put(key, encodedValue)
      } else {
        // deleting a value
        await storageTrie.del(key)
      }
      done()
    })
  }

  /**
   * Clears all storage entries for the account corresponding to `address`.
   * @param address -  Address to clear the storage of
   */
  async clearContractStorage(address: Buffer): Promise<void> {
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
    this._trie.revert()
    // setup cache checkpointing
    this._cache.revert()
    this._storageTries = {}
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
   * @returns {Promise<Buffer>} - Returns the state-root of the `StateManager`
   */
  async getStateRoot(): Promise<Buffer> {
    if (this._checkpointCount !== 0) {
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
   * Dumps the the storage values for an `account` specified by `address`.
   * @param address - The address of the `account` to return storage for
   * @returns {Promise<StorageDump>} - The state of the account as an `Object` map.
   * Keys are are the storage keys, values are the storage values as strings.
   * Both are represented as hex strings without the `0x` prefix.
   */
  async dumpStorage(address: Buffer): Promise<StorageDump> {
    return new Promise(async (resolve) => {
      const trie = await this._getStorageTrie(address)
      const storage: StorageDump = {}
      const stream = trie.createReadStream()

      stream.on('data', (val: any) => {
        storage[val.key.toString('hex')] = val.value.toString('hex')
      })
      stream.on('end', () => {
        resolve(storage)
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

    const addresses = Object.keys(initState)
    for (const address of addresses) {
      const account = new Account()
      if (initState[address].slice(0, 2) === '0x') {
        account.balance = new BN(initState[address].slice(2), 16).toArrayLike(Buffer)
      } else {
        account.balance = new BN(initState[address]).toArrayLike(Buffer)
      }
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
  async accountIsEmpty(address: Buffer): Promise<boolean> {
    const account = await this.getAccount(address)
    return account.isEmpty()
  }

  /**
   * Checks if the `account` corresponding to `address`
   * exists
   * @param address - Address of the `account` to check
   */
  async accountExists(address: Buffer): Promise<boolean> {
    const account = await this._cache.lookup(address)
    if (account) {
      return true
    }
    if (await this._cache._trie.get(address)) {
      return true
    }
    return false
  }

  /**
   * Removes accounts form the state trie that have been touched,
   * as defined in EIP-161 (https://eips.ethereum.org/EIPS/eip-161).
   */
  async cleanupTouchedAccounts(): Promise<void> {
    if (this._common.gteHardfork('spuriousDragon')) {
      const touchedArray = Array.from(this._touched)
      for (const addressHex of touchedArray) {
        const address = Buffer.from(addressHex, 'hex')
        const empty = await this.accountIsEmpty(address)
        if (empty) {
          this._cache.del(address)
        }
      }
    }
    this._touched.clear()
  }
}
