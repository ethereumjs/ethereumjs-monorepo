const Buffer = require('safe-buffer').Buffer
const Trie = require('merkle-patricia-tree/secure.js')
const Common = require('ethereumjs-common').default
const { genesisStateByName } = require('ethereumjs-common/dist/genesisStates')
const async = require('async')
const Account = require('ethereumjs-account')
const Cache = require('./cache.js')
const utils = require('ethereumjs-util')
const BN = utils.BN
const rlp = utils.rlp

/**
 * Interface for getting and setting data from an underlying
 * state trie
 * @interface StateManager
 */

module.exports = StateManager

/**
 * Default implementation of the `StateManager` interface
 * @class DefaultStateManager
 * @implements StateManager
 * @param {Object} [opts={}]
 * @param {Common} [opts.common] - [`Common`](https://github.com/ethereumjs/ethereumjs-common) parameters of the chain
 * @param {Trie} [opts.trie] - a [`merkle-patricia-tree`](https://github.com/ethereumjs/merkle-patricia-tree) instance
 */
function StateManager (opts = {}) {
  var self = this

  var common = opts.common
  if (!common) {
    common = new Common('mainnet', 'byzantium')
  }
  self._common = common

  self._trie = opts.trie || new Trie()
  self._storageTries = {} // the storage trie cache
  self._cache = new Cache(self._trie)
  self._touched = new Set()
  self._touchedStack = []
  self._checkpointCount = 0
}

var proto = StateManager.prototype

/**
 * Copies the current instance of the `DefaultStateManager`
 * at the last fully committed point, i.e. as if all current
 * checkpoints were reverted
 * @memberof DefaultStateManager
 * @method copy
 */
proto.copy = function () {
  return new StateManager({ trie: this._trie.copy() })
}

/**
 * Callback for `getAccount` method
 * @callback getAccount~callback
 * @param {Error} error an error that may have happened or `null`
 * @param {Account} account An [`ethereumjs-account`](https://github.com/ethereumjs/ethereumjs-account)
 * instance corresponding to the provided `address`
 */

/**
 * Gets the [`ethereumjs-account`](https://github.com/ethereumjs/ethereumjs-account)
 * associated with `address`. Returns an empty account if the account does not exist.
 * @memberof StateManager
 * @method getAccount
 * @param {Buffer} address Address of the `account` to get
 * @param {getAccount~callback} cb
 */
proto.getAccount = function (address, cb) {
  this._cache.getOrLoad(address, cb)
}

/**
 * Saves an [`ethereumjs-account`](https://github.com/ethereumjs/ethereumjs-account)
 * into state under the provided `address`
 * @memberof StateManager
 * @method putAccount
 * @param {Buffer} address Address under which to store `account`
 * @param {Account} account The [`ethereumjs-account`](https://github.com/ethereumjs/ethereumjs-account) to store
 * @param {Function} cb Callback function
 */
proto.putAccount = function (address, account, cb) {
  var self = this
  // TODO: dont save newly created accounts that have no balance
  // if (toAccount.balance.toString('hex') === '00') {
  // if they have money or a non-zero nonce or code, then write to tree
  self._cache.put(address, account)
  self._touched.add(address.toString('hex'))
  // self._trie.put(addressHex, account.serialize(), cb)
  cb()
}

/**
 * Adds `value` to the state trie as code, and sets `codeHash` on the account
 * corresponding to `address` to reference this.
 * @memberof StateManager
 * @method putContractCode
 * @param {Buffer} address - Address of the `account` to add the `code` for
 * @param {Buffer} value - The value of the `code`
 * @param {Function} cb Callback function
 */
proto.putContractCode = function (address, value, cb) {
  var self = this
  self.getAccount(address, function (err, account) {
    if (err) {
      return cb(err)
    }
    // TODO: setCode use trie.setRaw which creates a storage leak
    account.setCode(self._trie, value, function (err) {
      if (err) {
        return cb(err)
      }
      self.putAccount(address, account, cb)
    })
  })
}

/**
 * Callback for `getContractCode` method
 * @callback getContractCode~callback
 * @param {Error} error an error that may have happened or `null`
 * @param {Buffer} code The code corresponding to the provided address.
 * Returns an empty `Buffer` if the account has no associated code.
 */

/**
 * Gets the code corresponding to the provided `address`
 * @memberof StateManager
 * @method getContractCode
 * @param {Buffer} address Address to get the `code` for
 * @param {getContractCode~callback} cb
 */
proto.getContractCode = function (address, cb) {
  var self = this
  self.getAccount(address, function (err, account) {
    if (err) {
      return cb(err)
    }
    account.getCode(self._trie, cb)
  })
}

/**
 * Creates a storage trie from the primary storage trie
 * for an account and saves this in the storage cache.
 * @private
 * @memberof DefaultStateManager
 * @method _lookupStorageTrie
 * @param {Buffer} address
 * @param {Function} cb Callback function
 */
proto._lookupStorageTrie = function (address, cb) {
  var self = this
  // from state trie
  self.getAccount(address, function (err, account) {
    if (err) {
      return cb(err)
    }
    var storageTrie = self._trie.copy()
    storageTrie.root = account.stateRoot
    storageTrie._checkpoints = []
    cb(null, storageTrie)
  })
}

/**
 * Gets the storage trie for an account from the storage
 * cache or does a lookup
 * @private
 * @memberof DefaultStateManager
 * @method _getStorageTrie
 * @param {Buffer} address
 * @param {Function} cb Callback function
 */
proto._getStorageTrie = function (address, cb) {
  var self = this
  var storageTrie = self._storageTries[address.toString('hex')]
  // from storage cache
  if (storageTrie) {
    return cb(null, storageTrie)
  }
  // lookup from state
  self._lookupStorageTrie(address, cb)
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
 * Gets the storage value associated with the provided `address` and `key`
 * @memberof StateManager
 * @method getContractStorage
 * @param {Buffer} address Address of the account to get the storage for
 * @param {Buffer} key Key in the account's storage to get the value for
 * @param {getContractCode~callback} cb
 */
proto.getContractStorage = function (address, key, cb) {
  var self = this
  self._getStorageTrie(address, function (err, trie) {
    if (err) {
      return cb(err)
    }
    trie.get(key, function (err, value) {
      if (err) {
        return cb(err)
      }
      var decoded = rlp.decode(value)
      cb(null, decoded)
    })
  })
}

/**
 * Modifies the storage trie of an account
 * @private
 * @memberof DefaultStateManager
 * @method _modifyContractStorage
 * @param {Buffer} address Address of the account whose storage is to be modified
 * @param {Function} modifyTrie function to modify the storage trie of the account
 */
proto._modifyContractStorage = function (address, modifyTrie, cb) {
  var self = this
  self._getStorageTrie(address, function (err, storageTrie) {
    if (err) {
      return cb(err)
    }

    modifyTrie(storageTrie, finalize)

    function finalize (err) {
      if (err) return cb(err)
      // update storage cache
      self._storageTries[address.toString('hex')] = storageTrie
      // update contract stateRoot
      var contract = self._cache.get(address)
      contract.stateRoot = storageTrie.root
      self.putAccount(address, contract, cb)
      self._touched.add(address.toString('hex'))
    }
  })
}

/**
 * Adds value to the state trie for the `account`
 * corresponding to `address` at the provided `key`
 * @memberof StateManager
 * @method putContractStorage
 * @param {Buffer} address Address to set a storage value for
 * @param {Buffer} key Key to set the value at
 * @param {Buffer} value Value to set at `key` for account corresponding to `address`
 * @param {Function} cb Callback function
 */
proto.putContractStorage = function (address, key, value, cb) {
  var self = this
  self._modifyContractStorage(address, function (storageTrie, done) {
    if (value && value.length) {
      // format input
      var encodedValue = rlp.encode(value)
      storageTrie.put(key, encodedValue, done)
    } else {
      // deleting a value
      storageTrie.del(key, done)
    }
  }, cb)
}

/**
 * Clears all storage entries for the account corresponding to `address`
 * @memberof StateManager
 * @method clearContractStorage
 * @param {Buffer} address Address to clear the storage of
 * @param {Function} cb Callback function
 */
proto.clearContractStorage = function (address, cb) {
  var self = this
  self._modifyContractStorage(address, function (storageTrie, done) {
    storageTrie.root = storageTrie.EMPTY_TRIE_ROOT
    done()
  }, cb)
}

/**
 * Checkpoints the current state of the StateManager instance.
 * State changes that follow can then be committed by calling
 * `commit` or `reverted` by calling rollback.
 * @memberof StateManager
 * @method checkpoint
 * @param {Function} cb Callback function
 */
proto.checkpoint = function (cb) {
  var self = this
  self._trie.checkpoint()
  self._cache.checkpoint()
  self._touchedStack.push(new Set([...self._touched]))
  self._checkpointCount++
  cb()
}

/**
 * Commits the current change-set to the instance since the
 * last call to checkpoint.
 * @memberof StateManager
 * @method commit
 * @param {Function} cb Callback function
 */
proto.commit = function (cb) {
  var self = this
  // setup trie checkpointing
  self._trie.commit(function () {
    // setup cache checkpointing
    self._cache.commit()
    self._touchedStack.pop()
    self._checkpointCount--

    if (self._checkpointCount === 0) self._cache.flush(cb)
    else cb()
  })
}

/**
 * Reverts the current change-set to the instance since the
 * last call to checkpoint.
 * @memberof StateManager
 * @method revert
 * @param {Function} cb Callback function
 */
proto.revert = function (cb) {
  var self = this
  // setup trie checkpointing
  self._trie.revert()
  // setup cache checkpointing
  self._cache.revert()
  self._storageTries = {}
  self._touched = self._touchedStack.pop()
  self._checkpointCount--

  if (self._checkpointCount === 0) self._cache.flush(cb)
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
 * @memberof StateManager
 * @method getStateRoot
 * @param {getStateRoot~callback} cb
 */
proto.getStateRoot = function (cb) {
  var self = this

  if (self._checkpointCount !== 0) { return cb(new Error('Cannot get state root with uncommitted checkpoints')) }

  self._cache.flush(function (err) {
    if (err) {
      return cb(err)
    }
    var stateRoot = self._trie.root
    cb(null, stateRoot)
  })
}

/**
 * Sets the state of the instance to that represented
 * by the provided `stateRoot`. Will error if there are uncommitted
 * checkpoints on the instance or if the state root does not exist in
 * the state trie.
 * @memberof StateManager
 * @method setStateRoot
 * @param {Buffer} stateRoot The state-root to reset the instance to
 * @param {Function} cb Callback function
 */
proto.setStateRoot = function (stateRoot, cb) {
  var self = this

  if (self._checkpointCount !== 0) { return cb(new Error('Cannot set state root with uncommitted checkpoints')) }

  self._cache.flush(function (err) {
    if (err) { return cb(err) }
    if (stateRoot === self._trie.EMPTY_TRIE_ROOT) {
      self._trie.root = stateRoot
      self._cache.clear()
      return cb()
    }
    self._trie.checkRoot(stateRoot, function (err, hasRoot) {
      if (err || !hasRoot) {
        cb(err || new Error('State trie does not contain state root'))
      } else {
        self._trie.root = stateRoot
        self._cache.clear()
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
 * Dumps the the storage values for an `account` specified by `address`
 * @memberof DefaultStateManager
 * @method dumpStorage
 * @param {Buffer} address The address of the `account` to return storage for
 * @param {dumpStorage~callback} cb
 */
proto.dumpStorage = function (address, cb) {
  var self = this
  self._getStorageTrie(address, function (err, trie) {
    if (err) {
      return cb(err)
    }
    var storage = {}
    var stream = trie.createReadStream()
    stream.on('data', function (val) {
      storage[val.key.toString('hex')] = val.value.toString('hex')
    })
    stream.on('end', function () {
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
 * @memberof DefaultStateManager
 * @method hasGenesisState
 * @param {hasGenesisState~callback} cb
 */
proto.hasGenesisState = function (cb) {
  const root = this._common.genesis().stateRoot
  this._trie.checkRoot(root, cb)
}

/**
 * Generates a canonical genesis state on the instance based on the
 * configured chain parameters. Will error if there are uncommitted
 * checkpoints on the instance.
 * @memberof StateManager
 * @method generateCanonicalGenesis
 * @param {Function} cb Callback function
 */
proto.generateCanonicalGenesis = function (cb) {
  var self = this

  if (self._checkpointCount !== 0) { return cb(new Error('Cannot create genesis state with uncommitted checkpoints')) }

  this.hasGenesisState(function (err, genesis) {
    if (!genesis && !err) {
      self.generateGenesis(genesisStateByName(self._common.chainName()), cb)
    } else {
      cb(err)
    }
  })
}

/**
 * Initializes the provided genesis state into the state trie
 * @memberof DefaultStateManager
 * @method generateGenesis
 * @param {Object} initState
 * @param {Function} cb Callback function
 */
proto.generateGenesis = function (initState, cb) {
  var self = this

  if (self._checkpointCount !== 0) { return cb(new Error('Cannot create genesis state with uncommitted checkpoints')) }

  var addresses = Object.keys(initState)
  async.eachSeries(addresses, function (address, done) {
    var account = new Account()
    account.balance = new BN(initState[address]).toArrayLike(Buffer)
    address = utils.toBuffer(address)
    self._trie.put(address, account.serialize(), done)
  }, cb)
}

/**
 * Callback for `accountIsEmpty` method
 * @callback accountIsEmpty~callback
 * @param {Error} error an error that may have happened or `null`
 * @param {Boolean} empty True if the account is empty false otherwise
 */

/**
 * Checks if the `account` corresponding to `address` is empty as defined in
 * EIP-161 (https://github.com/ethereum/EIPs/blob/master/EIPS/eip-161.md)
 * @memberof StateManager
 * @method accountIsEmpty
 * @param {Buffer} address Address to check
 * @param {accountIsEmpty~callback} cb
 */
proto.accountIsEmpty = function (address, cb) {
  var self = this
  self.getAccount.bind(this)(address, function (err, account) {
    if (err) {
      return cb(err)
    }

    // should be replaced by account.isEmpty() once updated
    cb(null, account.nonce.toString('hex') === '' && account.balance.toString('hex') === '' && account.codeHash.toString('hex') === utils.KECCAK256_NULL_S)
  })
}

/**
 * Removes accounts form the state trie that have been touched,
 * as defined in EIP-161 (https://github.com/ethereum/EIPs/blob/master/EIPS/eip-161.md).
 * @memberof StateManager
 * @method cleanupTouchedAccounts
 * @param {Function} cb Callback function
 */
proto.cleanupTouchedAccounts = function (cb) {
  var self = this
  var touchedArray = Array.from(self._touched)
  async.forEach(touchedArray, function (addressHex, next) {
    var address = Buffer.from(addressHex, 'hex')
    self.accountIsEmpty(address, function (err, empty) {
      if (err) {
        next(err)
        return
      }

      if (empty) {
        self._cache.del(address)
      }
      next(null)
    })
  },
  function () {
    self._touched.clear()
    cb()
  })
}
