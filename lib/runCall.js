const async = require('async')
const ethUtil = require('ethereumjs-util')
const BN = ethUtil.BN
const fees = require('ethereum-common')
const constants = require('./constants.js')

const ERROR = constants.ERROR

/**
 * runs a CALL operation
 * @method runCall
 * @param opts
 * @param opts.block {Block}
 * @param opts.caller {Buffer}
 * @param opts.code {Buffer} this is for CALLCODE where the code to load is different than the code from the to account.
 * @param opts.data {Buffer}
 * @param opts.gasLimit {Buffer | BN.js }
 * @param opts.gasPrice {Buffer}
 * @param opts.origin {Buffer} []
 * @param opts.to {Buffer}
 * @param opts.value {Buffer}
 */
module.exports = function (opts, cb) {
  var self = this
  var stateManager = self.stateManager

  var vmResults = {}
  var toAccount
  var toAddress = opts.to
  var createdAddress
  var txValue = opts.value || new Buffer(0)
  var caller = opts.caller
  var account = stateManager.cache.get(caller)
  var block = opts.block
  var code = opts.code
  var txData = opts.data
  var gasLimit = opts.gasLimit || new BN(0xffffff)
  gasLimit = new BN(opts.gasLimit) // make sure is a BN
  var gasPrice = opts.gasPrice
  var gasUsed = new BN(0)
  var origin = opts.origin
  var isCompiled = opts.compiled
  var depth = opts.depth
  // opts.suicides is kept for backward compatiblity with pre-EIP6 syntax
  var selfdestruct = opts.selfdestruct || opts.suicides
  var delegatecall = opts.delegatecall || false

  txValue = new BN(txValue)

  stateManager.checkpoint()

  // run and parse
  subTxValue()

  async.series([
    loadToAccount,
    loadCode,
    runCode,
    saveCode
  ], parseCallResult)

  function loadToAccount (done) {
    // get receiver's account
    // toAccount = stateManager.cache.get(toAddress)
    if (!toAddress) {
      // generate a new contract if no `to`
      code = txData
      txData = undefined
      var newNonce = new BN(account.nonce).subn(1)
      createdAddress = toAddress = ethUtil.generateAddress(caller, newNonce.toArray())
      stateManager.getAccount(createdAddress, function (err, account) {
        toAccount = account
        const NONCE_OFFSET = 1
        toAccount.nonce = new BN(toAccount.nonce).addn(NONCE_OFFSET).toBuffer()
        done(err)
      })
    } else {
      // else load the `to` account
      toAccount = stateManager.cache.get(toAddress)
      done()
    }
  }

  function subTxValue () {
    if (delegatecall) {
      return
    }
    account.balance = new BN(account.balance).sub(txValue)
    stateManager.cache.put(caller, account)
  }

  function addTxValue () {
    if (delegatecall) {
      return
    }
    // add the amount sent to the `to` account
    toAccount.balance = new BN(toAccount.balance).add(txValue)
    stateManager.cache.put(toAddress, toAccount)
    stateManager.touched.push(toAddress)
  }

  function loadCode (cb) {
    addTxValue()
    // loads the contract's code if the account is a contract
    if (code || !(toAccount.isContract() || ethUtil.isPrecompiled(toAddress))) {
      cb()
      return
    }

    if (ethUtil.isPrecompiled(toAddress)) {
      isCompiled = true
      code = self._precompiled[toAddress.toString('hex')]
      cb()
      return
    }

    stateManager.getContractCode(toAddress, function (err, c, comp) {
      if (err) return cb(err)
      isCompiled = comp
      code = c
      cb()
    })
  }

  function runCode (cb) {
    if (!code) {
      vmResults.exception = 1
      stateManager.commit(cb)
      return
    }

    var runCodeOpts = {
      code: code,
      data: txData,
      gasLimit: gasLimit,
      gasPrice: gasPrice,
      address: toAddress,
      origin: origin,
      caller: caller,
      value: new Buffer(txValue.toArray()),
      block: block,
      depth: depth,
      selfdestruct: selfdestruct,
      populateCache: false
    }

    // run Code through vm
    var codeRunner = isCompiled ? self.runJIT : self.runCode
    codeRunner.call(self, runCodeOpts, parseRunResult)

    function parseRunResult (err, results) {
      toAccount = self.stateManager.cache.get(toAddress)
      vmResults = results

      if (createdAddress) {
        // fee for size of the return value
        var returnFee = results.return.length * fees.createDataGas.v
        var totalGas = results.gasUsed.addn(returnFee)
        // if not enough gas
        if (totalGas.cmp(gasLimit) <= 0 && results.return.length <= 24576) {
          results.gasUsed = totalGas
        } else {
          results.return = new Buffer([])
          // since Homestead
          results.exception = 0
          err = results.exceptionError = ERROR.OUT_OF_GAS
          results.gasUsed = gasLimit
        }
      }

      gasUsed = results.gasUsed
      if (err) {
        results.logs = []
        stateManager.revert(cb)
      } else {
        stateManager.commit(cb)
      }
    }
  }

  function saveCode (cb) {
    // store code for a new contract
    if (createdAddress && vmResults.return.toString() !== '') {
      stateManager.putContractCode(createdAddress, vmResults.return, cb)
    } else {
      cb()
    }
  }

  function parseCallResult (err) {
    if (err) return cb(err)
    var results = {
      gasUsed: gasUsed,
      createdAddress: createdAddress,
      vm: vmResults
    }

    cb(null, results)
  }
}
