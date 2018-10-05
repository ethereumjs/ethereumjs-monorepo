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
  if (typeof opts === 'function' && cb === undefined) {
    cb = opts
    return cb(new Error('invalid input, opts must be provided'))
  }

  var self = this
  var block = opts.block
  var tx = opts.tx
  var gasLimit
  var results
  var basefee

  // tx is required
  if (!tx) {
    return cb(new Error('invalid input, tx is required'))
  }

  // create a reasonable default if no block is given
  if (!block) {
    block = new Block()
  }

  if (new BN(block.header.gasLimit).lt(new BN(tx.gasLimit))) {
    cb(new Error('tx has a higher gas limit than the block'))
    return
  }

  self.stateManager.checkpoint()

  // run everything
  async.series([
    runTxHook,
    updateFromAccount,
    runCall,
    runAfterTxHook
  ], function (err) {
    if (err) self.stateManager.revert(() => cb(err, results))
    else self.stateManager.commit((err) => cb(err, results))
  })

  // run the transaction hook
  function runTxHook (cb) {
    self.emit('beforeTx', tx, cb)
  }

  // run the transaction hook
  function runAfterTxHook (cb) {
    self.emit('afterTx', results, cb)
  }

  function updateFromAccount (cb) {
    self.stateManager.getAccount(tx.from, function (err, fromAccount) {
      if (err) {
        cb(err)
        return
      }

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
      self.stateManager.putAccount(tx.from, fromAccount, cb)
    })
  }

  // sets up the environment and runs a `call`
  function runCall (cb) {
    var options = {
      caller: tx.from,
      gasLimit: gasLimit,
      gasPrice: tx.gasPrice,
      to: tx.to,
      value: tx.value,
      data: tx.data,
      block: block
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

      // caculate the total gas used
      results.gasUsed = results.gasUsed.add(basefee)

      // process any gas refund
      results.gasRefund = results.vm.gasRefund
      if (results.gasRefund) {
        if (results.gasRefund.lt(results.gasUsed.divn(2))) {
          results.gasUsed.isub(results.gasRefund)
        } else {
          results.gasUsed.isub(results.gasUsed.divn(2))
        }
      }

      results.amountSpent = results.gasUsed.mul(new BN(tx.gasPrice))

      async.series([
        loadFromAccount,
        updateFromAccount,
        loadMinerAccount,
        updateMinerAccount,
        cleanupAccounts
      ], cb)

      var fromAccount
      function loadFromAccount (next) {
        self.stateManager.getAccount(tx.from, function (err, account) {
          fromAccount = account
          next(err)
        })
      }

      function updateFromAccount (next) {
        // refund the leftover gas amount
        var finalFromBalance = new BN(tx.gasLimit).sub(results.gasUsed)
          .mul(new BN(tx.gasPrice))
          .add(new BN(fromAccount.balance))
        fromAccount.balance = finalFromBalance

        self.stateManager.putAccountBalance(utils.toBuffer(tx.from), finalFromBalance, next)
      }

      var minerAccount
      function loadMinerAccount (next) {
        self.stateManager.getAccount(block.header.coinbase, function (err, account) {
          minerAccount = account
          next(err)
        })
      }

      function updateMinerAccount (next) {
        // add the amount spent on gas to the miner's account
        minerAccount.balance = new BN(minerAccount.balance)
          .add(results.amountSpent)

        // save the miner's account
        if (!(new BN(minerAccount.balance).isZero())) {
          self.stateManager.cache.put(block.header.coinbase, minerAccount)
        }

        next(null)
      }

      function cleanupAccounts (next) {
        if (!results.vm.selfdestruct) {
          results.vm.selfdestruct = {}
        }

        var keys = Object.keys(results.vm.selfdestruct)

        keys.forEach(function (s) {
          self.stateManager.cache.del(Buffer.from(s, 'hex'))
        })

        self.stateManager.cleanupTouchedAccounts(next)
      }
    }
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
