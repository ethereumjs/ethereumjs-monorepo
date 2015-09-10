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
 * @param opts.populateCache {Blockchain} needed to for BLOCKHASH
 * @param cb {Function} - the callback
 */
module.exports = function (opts, cb) {
  var self = this

  var gasLimit = undefined
  var basefee = undefined
  var block = opts.block || new Block()
  var blockchain = opts.blockchain
  var tx = opts.tx
  var populateCache = opts.populateCache
  var skipNonce = opts.skipNonce
  var results = undefined

  // run everything
  async.series([
    maybePopulateCache,
    runTxHook,
    runCall,
    saveTries,
    runAfterTxHook,
    maybeFlushCache,
  ], function (err) {
    cb(err, results)
  })


  // run the transaction hook
  function runTxHook(cb) {
    if (self.onTx) {
      self.onTx(tx, cb)
    } else {
      cb()
    }
  }

  // run the transaction hook
  function runAfterTxHook(cb) {
    if (self.afterTx) {
      self.afterTx(results, cb)
    } else {
      cb()
    }
  }

  /**
   * populates the cache with the two and from of the tx
   */
  function maybePopulateCache(cb) {
    var accounts = new Set()
    accounts.add(tx.from.toString('hex'))
    accounts.add(tx.to.toString('hex'))
    accounts.add(block.header.coinbase.toString('hex'))

    if (populateCache === false) {
      return cb()
    }

    // shim till async supports iterators
    var accountArr = []
    accounts.forEach(function (val) {
      if (val) accountArr.push(val)
    })

    async.eachSeries(accountArr, function (acnt, done) {
      acnt = new Buffer(acnt, 'hex')
      self.trie.get(acnt, function (err, val) {
        val = new Account(val)
        self.cache.put(acnt, val)
        done()
      })
    }, cb)
  }

  // sets up the envorment and runs a `call`
  function runCall(cb) {
    // check to the sender's account to make sure it has enought wei and the
    // correct nonce
    var fromAccount = self.cache.get(tx.from)

    if (new BN(fromAccount.balance).cmp(tx.getUpfrontCost()) === -1) {
      cb('sender doesn\'t have enougth funds to send tx. The upfront cost is: ' + tx.getUpfrontCost().toString() + ' and the sender\s account only has: ' + new BN(fromAccount.balance).toString())
      return
    } else if (!skipNonce && new BN(fromAccount.nonce).cmp(new BN(tx.nonce)) !== 0) {
      cb('the tx doesn\'t have the correct nonce. account has nonce of: ' + new BN(fromAccount.nonce).toString() + ' tx has nonce of: ' + new BN(tx.nonce).toString())
      return
    }

    // increment the nonce
    fromAccount.nonce = new BN(fromAccount.nonce).add(new BN(1))
    basefee = tx.getBaseFee()
    gasLimit = new BN(tx.gasLimit).sub(basefee)
    fromAccount.balance = new BN(fromAccount.balance).sub(new BN(tx.gasLimit).mul(new BN(tx.gasPrice)))

    var options = {
      caller: tx.from,
      account: fromAccount,
      gasLimit: gasLimit,
      gasPrice: tx.gasPrice,
      to: tx.to,
      value: new BN(tx.value),
      data: tx.data,
      block: block,
      blockchain: blockchain,
      populateCache: false,
    }

    if (tx.to.toString('hex') === '') {
      delete options.to
    }

    // run call
    self.runCall(options, function (err, _results) {

      // save results
      results = _results
      results.bloom = txLogsBloom(results.vm.logs)
      
      // calculate gas usage
      results.gasUsed = results.gasUsed.add(basefee)
      // credit the gas refund
      var gasRefund = results.vm.gasRefund
      if (gasRefund) {
        if (gasRefund.cmp(results.gasUsed.div(new BN(2))) === -1) {
          results.gasUsed = results.gasUsed.sub(gasRefund)
        } else {
          results.gasUsed = results.gasUsed.sub(results.gasUsed.div(new BN(2)))
        }
      }

      //refund the left over gas amount
      gasLimit = new BN(tx.gasLimit)
      fromAccount = self.cache.get(tx.from)
      fromAccount.balance = new BN(fromAccount.balance)
        .add(gasLimit.sub(results.gasUsed).mul(new BN(tx.gasPrice)))
      results.amountSpent = results.gasUsed.mul(new BN(tx.gasPrice))
      self.cache.put(tx.from, fromAccount)

      // add gas expenditures to the miner's account
      var minerAccount = self.cache.get(block.header.coinbase)
      minerAccount.balance = new BN(minerAccount.balance)
        .add(results.amountSpent)
      self.cache.put(block.header.coinbase, minerAccount)

      // delete suicided contracts 
      if (!results.vm.suicides) {
        results.vm.suicides = {}
      }
      var keys = Object.keys(results.vm.suicides)
      keys.forEach(function (address) {
        self.cache.del(new Buffer(address, 'hex'))
      })

      cb(err)
    })

  }

  function saveTries(cb) {
    async.each(results.vm.storageTries, function (trie, cb) {
      trie.commit(cb)
    }, cb)
  }

  function maybeFlushCache(cb) {
    if (populateCache === false) {
      return cb()
    }
    self.cache.flush(cb)
  }

}

/**
 * @method txLogsBloom
 */
function txLogsBloom(logs) {
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
