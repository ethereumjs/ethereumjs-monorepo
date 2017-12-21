const Buffer = require('safe-buffer').Buffer
const async = require('async')
const utils = require('ethereumjs-util')
const BN = utils.BN
const Bloom = require('./bloom.js')
const Block = require('ethereumjs-block')

/**
 * Process a transaction. Run the vm. Transfers eth. Checks balances.
 * @method processTx
 * @param opts
 * @param opts.tx {Transaction} - a transaction
 * @param opts.skipNonce - skips the nonce check
 * @param opts.skipBalance - skips the balance check
 * @param opts.block {Block} needed to process the transaction, if no block is given a default one is created
 * @param cb {Function} - the callback
 */
module.exports = function (opts, cb) {
  var self = this
  var block = opts.block
  var tx = opts.tx
  var gasLimit
  var results
  var basefee

  // create a reasonable default if no block is given
  if (!block) {
    block = new Block()
  }

  if (new BN(block.header.gasLimit).lt(new BN(tx.gasLimit))) {
    cb(new Error('tx has a higher gas limit than the block'))
    return
  }

  if (opts.populateCache === undefined) {
    opts.populateCache = true
  }

  // run everything
  async.series([
    populateCache,
    runTxHook,
    runCall,
    saveTries,
    flushCache,
    runAfterTxHook
  ], function (err) {
    cb(err, results)
  })

  // run the transaction hook
  function runTxHook (cb) {
    self.emit('beforeTx', tx, cb)
  }

  // run the transaction hook
  function runAfterTxHook (cb) {
    self.emit('afterTx', results, cb)
  }

  /**
   * populates the cache with the 'to' and 'from' of the tx
   */
  function populateCache (cb) {
    var accounts = new Set()
    accounts.add(tx.from.toString('hex'))
    accounts.add(block.header.coinbase.toString('hex'))

    if (tx.to.toString('hex') !== '') {
      accounts.add(tx.to.toString('hex'))
      self.stateManager.touched.push(tx.to)
    }

    if (opts.populateCache === false) {
      return cb()
    }

    self.stateManager.warmCache(accounts, cb)
  }

  // sets up the environment and runs a `call`
  function runCall (cb) {
    // check to the sender's account to make sure it has enough wei and the correct nonce
    var fromAccount = self.stateManager.cache.get(tx.from)
    var message

    if (!opts.skipBalance && new BN(fromAccount.balance).lt(tx.getUpfrontCost())) {
      message = "sender doesn't have enough funds to send tx. The upfront cost is: " + tx.getUpfrontCost().toString() + ' and the sender\'s account only has: ' + new BN(fromAccount.balance).toString()
      cb(new Error(message))
      return
    } else if (!opts.skipNonce && !(new BN(fromAccount.nonce).eq(new BN(tx.nonce)))) {
      message = "the tx doesn't have the correct nonce. account has nonce of: " + new BN(fromAccount.nonce).toString() + ' tx has nonce of: ' + new BN(tx.nonce).toString()
      cb(new Error(message))
      return
    }

    // increment the nonce
    fromAccount.nonce = new BN(fromAccount.nonce).addn(1)

    basefee = tx.getBaseFee()
    gasLimit = new BN(tx.gasLimit)
    if (gasLimit.lt(basefee)) {
      return cb(new Error('base fee exceeds gas limit'))
    }
    gasLimit.isub(basefee)

    fromAccount.balance = new BN(fromAccount.balance).sub(new BN(tx.gasLimit).mul(new BN(tx.gasPrice)))
    self.stateManager.cache.put(tx.from, fromAccount)

    var options = {
      caller: tx.from,
      gasLimit: gasLimit,
      gasPrice: tx.gasPrice,
      to: tx.to,
      value: tx.value,
      data: tx.data,
      block: block,
      populateCache: false
    }

    if (tx.to.toString('hex') === '') {
      delete options.to
    }

    // run call
    self.runCall(options, parseResults)

    function parseResults (err, _results) {
      if (err) return cb(err)
      results = _results

      // generate the bloom for the tx
      results.bloom = txLogsBloom(results.vm.logs)
      fromAccount = self.stateManager.cache.get(tx.from)

      // caculate the total gas used
      results.gasUsed = results.gasUsed.add(basefee)

      // process any gas refund
      var gasRefund = results.vm.gasRefund
      if (gasRefund) {
        if (gasRefund.lt(results.gasUsed.divn(2))) {
          results.gasUsed.isub(gasRefund)
        } else {
          results.gasUsed.isub(results.gasUsed.divn(2))
        }
      }

      results.amountSpent = results.gasUsed.mul(new BN(tx.gasPrice))
      // refund the leftover gas amount
      fromAccount.balance = new BN(tx.gasLimit).sub(results.gasUsed)
        .mul(new BN(tx.gasPrice))
        .add(new BN(fromAccount.balance))

      self.stateManager.cache.put(tx.from, fromAccount)
      self.stateManager.touched.push(tx.from)

      var minerAccount = self.stateManager.cache.get(block.header.coinbase)
      // add the amount spent on gas to the miner's account
      minerAccount.balance = new BN(minerAccount.balance)
        .add(results.amountSpent)

      // save the miner's account
      if (!(new BN(minerAccount.balance).isZero())) {
        self.stateManager.cache.put(block.header.coinbase, minerAccount)
      }

      if (!results.vm.selfdestruct) {
        results.vm.selfdestruct = {}
      }

      var keys = Object.keys(results.vm.selfdestruct)

      keys.forEach(function (s) {
        self.stateManager.cache.del(Buffer.from(s, 'hex'))
      })

      // delete all touched accounts
      var touched = self.stateManager.touched
      async.forEach(touched, function (address, next) {
        self.stateManager.accountIsEmpty(address, function (err, empty) {
          if (err) {
            next(err)
            return
          }

          if (empty) {
            self.stateManager.cache.del(address)
          }
          next(null)
        })
      },
      function () {
        self.stateManager.touched = []
        cb()
      })
    }
  }

  function saveTries (cb) {
    self.stateManager.commitContracts(cb)
  }

  function flushCache (cb) {
    self.stateManager.cache.flush(function () {
      if (opts.populateCache) {
        self.stateManager.cache.clear()
      }
      cb()
    })
  }
}

/**
 * @method txLogsBloom
 */
function txLogsBloom (logs) {
  var bloom = new Bloom()
  if (logs) {
    for (var i = 0; i < logs.length; i++) {
      var log = logs[i]
      // add the address
      bloom.add(log[0])
      // add the topics
      var topics = log[1]
      for (var q = 0; q < topics.length; q++) {
        bloom.add(topics[q])
      }
    }
  }
  return bloom
}
