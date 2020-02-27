const Set = require('core-js-pure/es/set')
const Trie = require('merkle-patricia-tree/secure.js')
const asyncLib = require('async')
import * as utils from 'ethereumjs-util'
import BN = require('bn.js')
import { encode, decode } from 'rlp'
import Common from 'ethereumjs-common'
import { genesisStateByName } from 'ethereumjs-common/dist/genesisStates'
import Account from 'ethereumjs-account'
import Cache from './cache'
import { ripemdPrecompileAddress } from '../evm/precompiles'

/**
 * Storage values of an account
 */
export interface StorageDump {
  [key: string]: string
}

/**
 * Options for constructing a [[StateManager]].
 */
export interface StateManagerOpts {
  /**
   * Parameters of the chain ([`Common`](https://github.com/ethereumjs/ethereumjs-common))
   */
  common?: Common
  /**
   * A [`merkle-patricia-tree`](https://github.com/ethereumjs/merkle-patricia-tree) instance
   */
  trie?: any
}

/**
 * Interface for getting and setting data from an underlying
 * state trie.
 */
export default class StateManager {
  _common: Common
  _trie: any
  _storageTries: any
  _cache: Cache
  _touched: Set<string>
  _touchedStack: Set<string>[]
  _checkpointCount: number
  _originalStorageCache: Map<string, Map<string, Buffer>>

  /**
   * Instantiate the StateManager interface.
   */
  constructor(opts: StateManagerOpts = {}) {
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
    return new StateManager({ trie: this._trie.copy(), common: this._common })
  }

  /**
   * Callback for `getAccount` method.
   * @callback getAccount~callback
   * @param error - an error that may have happened or `null`
   * @param account - An [`ethereumjs-account`](https://github.com/ethereumjs/ethereumjs-account)
   * instance corresponding to the provided `address`
   */

  /**
   * Gets the [`ethereumjs-account`](https://github.com/ethereumjs/ethereumjs-account)
   * associated with `address`. Returns an empty account if the account does not exist.
   * @param address - Address of the `account` to get
   * @param {getAccount~callback} cb
   */
  getAccount(address: Buffer, cb: any): void {
    this._cache.getOrLoad(address, cb)
  }

  /**
   * Saves an [`ethereumjs-account`](https://github.com/ethereumjs/ethereumjs-account)
   * into state under the provided `address`.
   * @param address - Address under which to store `account`
   * @param account - The [`ethereumjs-account`](https://github.com/ethereumjs/ethereumjs-account) to store
   * @param cb - Callback function
   */
  putAccount(address: Buffer, account: Account, cb: any): void {
    // TODO: dont save newly created accounts that have no balance
    // if (toAccount.balance.toString('hex') === '00') {
    // if they have money or a non-zero nonce or code, then write to tree
    this._cache.put(address, account)
    this.touchAccount(address)
    // self._trie.put(addressHex, account.serialize(), cb)
    cb()
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
   * @param cb - Callback function
   */
  putContractCode(address: Buffer, value: Buffer, cb: any): void {
    this.getAccount(address, (err: Error, account: Account) => {
      if (err) {
        return cb(err)
      }
      // TODO: setCode use trie.setRaw which creates a storage leak
      account.setCode(this._trie, value, err => {
        if (err) {
          return cb(err)
        }
        this.putAccount(address, account, cb)
      })
    })
  }

  /**
   * Callback for `getContractCode` method
   * @callback getContractCode~callback
   * @param error - an error that may have happened or `null`
   * @param code - The code corresponding to the provided address.
   * Returns an empty `Buffer` if the account has no associated code.
   */

  /**
   * Gets the code corresponding to the provided `address`.
   * @param address - Address to get the `code` for
   * @param {getContractCode~callback} cb
   */
  getContractCode(address: Buffer, cb: any): void {
    this.getAccount(address, (err: Error, account: Account) => {
      if (err) {
        return cb(err)
      }
      account.getCode(this._trie, cb)
    })
  }

  /**
   * Creates a storage trie from the primary storage trie
   * for an account and saves this in the storage cache.
   * @private
   */
  _lookupStorageTrie(address: Buffer, cb: any): void {
    // from state trie
    this.getAccount(address, (err: Error, account: Account) => {
      if (err) {
        return cb(err)
      }
      const storageTrie = this._trie.copy()
      storageTrie.root = account.stateRoot
      storageTrie._checkpoints = []
      cb(null, storageTrie)
    })
  }

  /**
   * Gets the storage trie for an account from the storage
   * cache or does a lookup.
   * @private
   */
  _getStorageTrie(address: Buffer, cb: any): void {
    const storageTrie = this._storageTries[address.toString('hex')]
    // from storage cache
    if (storageTrie) {
      return cb(null, storageTrie)
    }
    // lookup from state
    this._lookupStorageTrie(address, cb)
  }

  /**
   * Callback for `getContractStorage` method
   * @callback getContractStorage~callback
   * @param {Error} error an error that may have happened or `null`
   * @param {Buffer} storageValue The storage value for the account
   * corresponding to the provided address at the provided key.
   * If this does not exists an empty `Buffer` is returned
   */

  /**
   * Gets the storage value associated with the provided `address` and `key`. This method returns
   * the shortest representation of the stored value.
   * @param address -  Address of the account to get the storage for
   * @param key - Key in the account's storage to get the value for. Must be 32 bytes long.
   * @param {getContractCode~callback} cb.
   */
  getContractStorage(address: Buffer, key: Buffer, cb: any): void {
    if (key.length !== 32) {
      return cb(new Error('Storage key must be 32 bytes long'))
    }

    this._getStorageTrie(address, (err: Error, trie: any) => {
      if (err) {
        return cb(err)
      }
      trie.get(key, (err: Error, value: Buffer) => {
        if (err) {
          return cb(err)
        }
        const decoded = decode(value)
        cb(null, decoded)
      })
    })
  }

  /**
   * Caches the storage value associated with the provided `address` and `key`
   * on first invocation, and returns the cached (original) value from then
   * onwards. This is used to get the original value of a storage slot for
   * computing gas costs according to EIP-1283.
   * @param address - Address of the account to get the storage for
   * @param key - Key in the account's storage to get the value for. Must be 32 bytes long.
   */
  getOriginalContractStorage(address: Buffer, key: Buffer, cb: any): void {
    if (key.length !== 32) {
      return cb(new Error('Storage key must be 32 bytes long'))
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
      cb(null, map.get(keyHex))
    } else {
      this.getContractStorage(address, key, (err: Error, current: Buffer) => {
        if (err) return cb(err)

        map.set(keyHex, current)
        cb(null, current)
      })
    }
  }

  /**
   * Modifies the storage trie of an account
   * @private
   * @param address -  Address of the account whose storage is to be modified
   * @param modifyTrie - Function to modify the storage trie of the account
   */
  _modifyContractStorage(address: Buffer, modifyTrie: any, cb: any): void {
    this._getStorageTrie(address, (err: Error, storageTrie: any) => {
      if (err) {
        return cb(err)
      }

      modifyTrie(storageTrie, (err: Error) => {
        if (err) return cb(err)
        // update storage cache
        this._storageTries[address.toString('hex')] = storageTrie
        // update contract stateRoot
        const contract = this._cache.get(address)
        contract.stateRoot = storageTrie.root
        this.putAccount(address, contract, cb)
        this.touchAccount(address)
      })
    })
  }

  /**
   * Adds value to the state trie for the `account`
   * corresponding to `address` at the provided `key`.
   * @param address -  Address to set a storage value for
   * @param key - Key to set the value at. Must be 32 bytes long.
   * @param value - Value to set at `key` for account corresponding to `address`
   * @param cb - Callback function
   */
  putContractStorage(address: Buffer, key: Buffer, value: Buffer, cb: any): void {
    if (key.length !== 32) {
      return cb(new Error('Storage key must be 32 bytes long'))
    }

    this._modifyContractStorage(
      address,
      (storageTrie: any, done: any) => {
        if (value && value.length) {
          // format input
          const encodedValue = encode(value)
          storageTrie.put(key, encodedValue, done)
        } else {
          // deleting a value
          storageTrie.del(key, done)
        }
      },
      cb,
    )
  }

  /**
   * Clears all storage entries for the account corresponding to `address`.
   * @param address -  Address to clear the storage of
   * @param cb - Callback function
   */
  clearContractStorage(address: Buffer, cb: any) {
    this._modifyContractStorage(
      address,
      (storageTrie: any, done: any) => {
        storageTrie.root = storageTrie.EMPTY_TRIE_ROOT
        done()
      },
      cb,
    )
  }

  /**
   * Checkpoints the current state of the StateManager instance.
   * State changes that follow can then be committed by calling
   * `commit` or `reverted` by calling rollback.
   * @param cb - Callback function
   */
  checkpoint(cb: any): void {
    this._trie.checkpoint()
    this._cache.checkpoint()
    this._touchedStack.push(new Set(Array.from(this._touched)))
    this._checkpointCount++
    cb()
  }

  /**
   * Commits the current change-set to the instance since the
   * last call to checkpoint.
   * @param cb - Callback function
   */
  commit(cb: any): void {
    // setup trie checkpointing
    this._trie.commit(() => {
      // setup cache checkpointing
      this._cache.commit()
      this._touchedStack.pop()
      this._checkpointCount--

      if (this._checkpointCount === 0) this._cache.flush(cb)
      else cb()
    })
  }

  /**
   * Reverts the current change-set to the instance since the
   * last call to checkpoint.
   * @param cb - Callback function
   */
  revert(cb: any): void {
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

    if (this._checkpointCount === 0) this._cache.flush(cb)
    else cb()
  }

  /**
   * Callback for `getStateRoot` method
   * @callback getStateRoot~callback
   * @param {Error} error an error that may have happened or `null`.
   * Will be an error if the un-committed checkpoints on the instance.
   * @param {Buffer} stateRoot The state-root of the `StateManager`
   */

  /**
   * Gets the state-root of the Merkle-Patricia trie representation
   * of the state of this StateManager. Will error if there are uncommitted
   * checkpoints on the instance.
   * @param {getStateRoot~callback} cb
   */
  getStateRoot(cb: any): void {
    if (this._checkpointCount !== 0) {
      return cb(new Error('Cannot get state root with uncommitted checkpoints'))
    }

    this._cache.flush((err: Error) => {
      if (err) {
        return cb(err)
      }
      const stateRoot = this._trie.root
      cb(null, stateRoot)
    })
  }

  /**
   * Sets the state of the instance to that represented
   * by the provided `stateRoot`. Will error if there are uncommitted
   * checkpoints on the instance or if the state root does not exist in
   * the state trie.
   * @param stateRoot - The state-root to reset the instance to
   * @param cb - Callback function
   */
  setStateRoot(stateRoot: Buffer, cb: any): void {
    if (this._checkpointCount !== 0) {
      return cb(new Error('Cannot set state root with uncommitted checkpoints'))
    }

    this._cache.flush((err: Error) => {
      if (err) {
        return cb(err)
      }
      if (stateRoot === this._trie.EMPTY_TRIE_ROOT) {
        this._trie.root = stateRoot
        this._cache.clear()
        this._storageTries = {}
        return cb()
      }
      this._trie.checkRoot(stateRoot, (err: Error, hasRoot: boolean) => {
        if (err || !hasRoot) {
          cb(err || new Error('State trie does not contain state root'))
        } else {
          this._trie.root = stateRoot
          this._cache.clear()
          this._storageTries = {}
          cb()
        }
      })
    })
  }

  /**
   * Callback for `dumpStorage` method
   * @callback dumpStorage~callback
   * @param {Error} error an error that may have happened or `null`
   * @param {Object} accountState The state of the account as an `Object` map.
   * Keys are are the storage keys, values are the storage values as strings.
   * Both are represented as hex strings without the `0x` prefix.
   */

  /**
   * Dumps the the storage values for an `account` specified by `address`.
   * @param address - The address of the `account` to return storage for
   * @param {dumpStorage~callback} cb
   */
  dumpStorage(address: Buffer, cb: any): void {
    this._getStorageTrie(address, (err: Error, trie: any) => {
      if (err) {
        return cb(err)
      }
      const storage: StorageDump = {}
      const stream = trie.createReadStream()
      stream.on('data', (val: any) => {
        storage[val.key.toString('hex')] = val.value.toString('hex')
      })
      stream.on('end', () => {
        cb(storage)
      })
    })
  }

  /**
   * Callback for `hasGenesisState` method
   * @callback hasGenesisState~callback
   * @param {Error} error an error that may have happened or `null`
   * @param {Boolean} hasGenesisState Whether the storage trie contains the
   * canonical genesis state for the configured chain parameters.
   */

  /**
   * Checks whether the current instance has the canonical genesis state
   * for the configured chain parameters.
   * @param {hasGenesisState~callback} cb
   */
  hasGenesisState(cb: any): void {
    const root = this._common.genesis().stateRoot
    this._trie.checkRoot(root, cb)
  }

  /**
   * Generates a canonical genesis state on the instance based on the
   * configured chain parameters. Will error if there are uncommitted
   * checkpoints on the instance.
   * @param cb - Callback function
   */
  generateCanonicalGenesis(cb: any): void {
    if (this._checkpointCount !== 0) {
      return cb(new Error('Cannot create genesis state with uncommitted checkpoints'))
    }

    this.hasGenesisState((err: Error, genesis: boolean) => {
      if (!genesis && !err) {
        this.generateGenesis(genesisStateByName(this._common.chainName()), cb)
      } else {
        cb(err)
      }
    })
  }

  /**
   * Initializes the provided genesis state into the state trie
   * @param initState - Object (address -> balance)
   * @param cb - Callback function
   */
  generateGenesis(initState: any, cb: any) {
    if (this._checkpointCount !== 0) {
      return cb(new Error('Cannot create genesis state with uncommitted checkpoints'))
    }

    const addresses = Object.keys(initState)
    asyncLib.eachSeries(
      addresses,
      (address: string, done: any) => {
        const account = new Account()
        if (initState[address].slice(0, 2) === '0x') {
          account.balance = new BN(initState[address].slice(2), 16).toArrayLike(Buffer)
        } else {
          account.balance = new BN(initState[address]).toArrayLike(Buffer)
        }
        const addressBuffer = utils.toBuffer(address)
        this._trie.put(addressBuffer, account.serialize(), done)
      },
      cb,
    )
  }

  /**
   * Callback for `accountIsEmpty` method
   * @callback accountIsEmpty~callback
   * @param {Error} error an error that may have happened or `null`
   * @param {Boolean} empty True if the account is empty false otherwise
   */

  /**
   * Checks if the `account` corresponding to `address` is empty as defined in
   * EIP-161 (https://eips.ethereum.org/EIPS/eip-161).
   * @param address - Address to check
   * @param {accountIsEmpty~callback} cb
   */
  accountIsEmpty(address: Buffer, cb: any): void {
    this.getAccount.bind(this)(address, (err: Error, account: Account) => {
      if (err) {
        return cb(err)
      }

      // should be replaced by account.isEmpty() once updated
      cb(
        null,
        account.nonce.toString('hex') === '' &&
          account.balance.toString('hex') === '' &&
          account.codeHash.toString('hex') === utils.KECCAK256_NULL_S,
      )
    })
  }

  /**
   * Removes accounts form the state trie that have been touched,
   * as defined in EIP-161 (https://eips.ethereum.org/EIPS/eip-161).
   * @param cb - Callback function
   */
  cleanupTouchedAccounts(cb: any): void {
    const touchedArray = Array.from(this._touched)
    asyncLib.forEach(
      touchedArray,
      (addressHex: string, next: any) => {
        const address = Buffer.from(addressHex, 'hex')
        this.accountIsEmpty(address, (err: Error, empty: boolean) => {
          if (err) {
            next(err)
            return
          }

          if (empty) {
            this._cache.del(address)
          }
          next(null)
        })
      },
      () => {
        this._touched.clear()
        cb()
      },
    )
  }

  /**
   * Clears the original storage cache. Refer to [[getOriginalContractStorage]]
   * for more explanation.
   * @ignore
   */
  _clearOriginalStorageCache(): void {
    this._originalStorageCache = new Map()
  }
}
