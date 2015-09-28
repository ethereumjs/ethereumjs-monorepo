const async = require('async')
const BN = require('bn.js')
const Bloom = require('./bloom.js')
const Account = require('ethereumjs-account')
const Block = require('ethereumjs-block')

/**
 * Process a transaction. Run the vm. Transfers eth. checks balaces
 * @method processTx
 * @param opts
 * @param opts.tx {Transaciton} - a transaction
 * @param opts.skipNonce - skips the nonce check
 * @param opts.block {Block} needed to process the transaction, if no block is given a default one is created
 * @param opts.blockchain {Blockchain} needed to for BLOCKHASH
 * @param cb {Function} - the callback
 */
module.exports = function (opts, cb) {
  var self = this
  var gasLimit
  var results
  var basefee

  if (!opts.block) {
    opts.block = new Block()
  }

  // run everything
  async.series([
    populateCache,
    runTxHook,
    runCall,
    saveTries,
    runAfterTxHook,
    function (cb) {
      self.cache.flush(cb)
    }
  ], function (err) {
    cb(err, results)
  })

  // run the transaction hook
  function runTxHook (cb) {
    if (self.onTx)
      self.onTx(opts.tx, cb)
    else
      cb()
  }

  // run the transaction hook
  function runAfterTxHook (cb) {
    if (self.afterTx)
      self.afterTx(results, cb)
    else
      cb()
  }

  /**
   * populates the cache with the two and from of the tx
   */
  function populateCache (cb) {
    var accounts = new Set()
    accounts.add(opts.tx.from.toString('hex'))
    accounts.add(opts.tx.to.toString('hex'))
    accounts.add(opts.block.header.coinbase.toString('hex'))

    if (opts.populateCache === false) {
      return cb()
    }

    self.stateManager.warmCache(accounts, cb)
  }

  // sets up the envorment and runs a `call`
  function runCall (cb) {
    // check to the sender's account to make sure it has enought wei and the
    // correct nonce
    var fromAccount = self.cache.get(opts.tx.from)

    if (new BN(fromAccount.balance).cmp(opts.tx.getUpfrontCost()) === -1) {
      cb("sender doesn't have enougth funds to send tx. The upfront cost is: " + opts.tx.getUpfrontCost().toString() + ' and the sender\s account only has: ' + new BN(fromAccount.balance).toString())
      return
    } else if (!opts.skipNonce && new BN(fromAccount.nonce).cmp(new BN(opts.tx.nonce)) !== 0) {
      cb("the tx doesn't have the correct nonce. account has nonce of: " + new BN(fromAccount.nonce).toString() + ' tx has nonce of: ' + new BN(opts.tx.nonce).toString())
      return
    }

    // increment the nonce
    fromAccount.nonce = new BN(fromAccount.nonce).add(new BN(1))
    basefee = opts.tx.getBaseFee()
    gasLimit = new BN(opts.tx.gasLimit).sub(basefee)
    fromAccount.balance = new BN(fromAccount.balance).sub(new BN(opts.tx.gasLimit).mul(new BN(opts.tx.gasPrice)))

    var options = {
      caller: opts.tx.from,
      account: fromAccount,
      gasLimit: gasLimit,
      gasPrice: opts.tx.gasPrice,
      to: opts.tx.to,
      value: new BN(opts.tx.value),
      data: opts.tx.data,
      block: opts.block,
      blockchain: opts.blockchain,
      populateCache: false
    }

    if (opts.tx.to.toString('hex') === '') {
      delete options.to
    }

    // run call
    self.runCall(options, parseResults)

    function parseResults (err, _results) {
      results = _results

      // generate the bloom for the tx
      results.bloom = txLogsBloom(results.vm.logs)
      fromAccount = self.cache.get(opts.tx.from)

      // caculate the totall gas used
      results.gasUsed = results.gasUsed.add(basefee)

      // refund the account
      var gasRefund = results.vm.gasRefund
      if (gasRefund) {
        if (gasRefund.cmp(results.gasUsed.div(new BN(2))) === -1) {
          results.gasUsed = results.gasUsed.sub(gasRefund)
        } else {
          results.gasUsed = results.gasUsed.sub(results.gasUsed.div(new BN(2)))
        }
      }

      // refund the left over gas amount
      gasLimit = new BN(opts.tx.gasLimit)
      fromAccount.balance = new BN(fromAccount.balance)
        .add(gasLimit.sub(results.gasUsed).mul(new BN(opts.tx.gasPrice)))

      results.amountSpent = results.gasUsed.mul(new BN(opts.tx.gasPrice))

      self.cache.put(opts.tx.from, fromAccount)

      var minerAccount = self.cache.get(opts.block.header.coinbase)
      // add the amount spent on gas to the miner's account
      minerAccount.balance = new BN(minerAccount.balance)
        .add(results.amountSpent)

      // save the miner's account
      self.cache.put(opts.block.header.coinbase, minerAccount)

      if (!results.vm.suicides) {
        results.vm.suicides = {}
      }

      var keys = Object.keys(results.vm.suicides)

      keys.forEach(function (s) {
        self.cache.del(new Buffer(s, 'hex'))
      })

      cb(err)
    }

  }

  function saveTries (cb) {
    self.stateManager.commitContracts(cb)
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
      for (var q = 0; q < topics.length; q++)
        bloom.add(topics[q])
    }
  }
  return bloom
}
