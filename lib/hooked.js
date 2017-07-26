const inherits = require('util').inherits
const async = require('async')
const ethUtil = require('ethereumjs-util')
const Account = require('ethereumjs-account')
const FakeMerklePatriciaTree = require('fake-merkle-patricia-tree')
const VM = require('./index.js')
const ZERO_BUFFER = new Buffer('0000000000000000000000000000000000000000000000000000000000000000', 'hex')

module.exports = createHookedVm
module.exports.fromWeb3Provider = fromWeb3Provider

/*

  This is a helper for creating a vm with modified state lookups
  this should be made obsolete by a better public API for StateManager

  ```js
  var vm = createHookedVm({}, {
    fetchAccountBalance: function(addressHex, cb){ ... },
    fetchAccountNonce: function(addressHex, cb){ ... },
    fetchAccountCode: function(addressHex, cb){ ... },
    fetchAccountStorage: function(addressHex, keyHex, cb){ ... },
  })
  vm.runTx(txParams, cb)
  ```

*/

function createHookedVm (opts, hooks) {
  var codeStore = new FallbackAsyncStore(hooks.fetchAccountCode.bind(hooks))

  var vm = new VM(opts)
  vm.stateManager._lookupStorageTrie = createAccountStorageTrie
  vm.stateManager.cache._lookupAccount = loadAccount
  vm.stateManager.getContractCode = codeStore.get.bind(codeStore)
  vm.stateManager.setContractCode = codeStore.set.bind(codeStore)

  return vm

  function createAccountStorageTrie (address, cb) {
    var addressHex = ethUtil.addHexPrefix(address.toString('hex'))
    var storageTrie = new FallbackStorageTrie({
      fetchStorage: function (key, cb) {
        hooks.fetchAccountStorage(addressHex, ethUtil.addHexPrefix(key), cb)
      }
    })
    cb(null, storageTrie)
  }

  function loadAccount (address, cb) {
    var addressHex = ethUtil.addHexPrefix(address.toString('hex'))
    async.parallel({
      nonce: hooks.fetchAccountNonce.bind(hooks, addressHex),
      balance: hooks.fetchAccountBalance.bind(hooks, addressHex)
    }, function (err, results) {
      if (err) return cb(err)

      results._exists = results.nonce !== '0x0' || results.balance !== '0x0' || results._code !== '0x'
        // console.log('fetch account results:', results)
      var account = new Account(results)
        // not used but needs to be anything but the default (ethUtil.SHA3_NULL)
        // code lookups are handled by `codeStore`
      account.codeHash = ZERO_BUFFER.slice()
      cb(null, account)
    })
  }
}

/*

  Additional helper for creating a vm with rpc state lookups
  blockNumber to query against is fixed

*/

function fromWeb3Provider (provider, blockNumber, opts) {
  return createHookedVm(opts, {
    fetchAccountBalance: createRpcFunction(provider, 'eth_getBalance', blockNumber),
    fetchAccountNonce: createRpcFunction(provider, 'eth_getTransactionCount', blockNumber),
    fetchAccountCode: createRpcFunction(provider, 'eth_getCode', blockNumber),
    fetchAccountStorage: createRpcFunction(provider, 'eth_getStorageAt', blockNumber)
  })

  function createRpcFunction (provider, method, blockNumber) {
    return function sendRpcRequest () {
      // prepare arguments
      var args = [].slice.call(arguments)
      var cb = args.pop()
      args.push(blockNumber)
        // send rpc payload
      provider.sendAsync({
        id: 1,
        jsonrpc: '2.0',
        method: method,
        params: args
      }, function (err, res) {
        if (err) return cb(err)
        cb(null, res.result)
      })
    }
  }
}

//
// FallbackStorageTrie
//
// is a FakeMerklePatriciaTree that will let lookups
// fallback to the fetchStorage fn. writes shadow the underlying fetchStorage value.
// doesn't bother with a stateRoot
//

inherits(FallbackStorageTrie, FakeMerklePatriciaTree)

function FallbackStorageTrie (opts) {
  const self = this
  FakeMerklePatriciaTree.call(self)
  self._fetchStorage = opts.fetchStorage
}

FallbackStorageTrie.prototype.get = function (key, cb) {
  const self = this
  var _super = FakeMerklePatriciaTree.prototype.get.bind(self)

  _super(key, function (err, value) {
    if (err) return cb(err)
    if (value) return cb(null, value)
      // if value not in tree, try network
    var keyHex = key.toString('hex')
    self._fetchStorage(keyHex, function (err, rawValue) {
      if (err) return cb(err)
      var value = ethUtil.toBuffer(rawValue)
      value = ethUtil.unpad(value)
      var encodedValue = ethUtil.rlp.encode(value)
      cb(null, encodedValue)
    })
  })
}

//
// FallbackAsyncStore
//
// is an async key-value store that will let lookups
// fallback to the network. puts are not sent.
//

function FallbackAsyncStore (fetchFn) {
  // console.log('FallbackAsyncStore - new')
  const self = this
  self.fetch = fetchFn
  self.cache = {}
}

FallbackAsyncStore.prototype.get = function (address, cb) {
  // console.log('FallbackAsyncStore - get', arguments)
  const self = this
  var addressHex = '0x' + address.toString('hex')
  var code = self.cache[addressHex]
  if (code !== undefined) {
    cb(null, code)
  } else {
    // console.log('FallbackAsyncStore - fetch init')
    self.fetch(addressHex, function (err, value) {
      // console.log('FallbackAsyncStore - fetch return', arguments)
      if (err) return cb(err)
      value = ethUtil.toBuffer(value)
      self.cache[addressHex] = value
      cb(null, value)
    })
  }
}

FallbackAsyncStore.prototype.set = function (address, code, cb) {
  // console.log('FallbackAsyncStore - set', arguments)
  const self = this
  var addressHex = '0x' + address.toString('hex')
  self.cache[addressHex] = code
  cb()
}
