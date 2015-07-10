const async = require('async')
const BN = require('bn.js')
const Bloom = require('../bloom.js')
const Account = require('../account')
const Block = require('../block.js')

/**
 * @method txLogsBloom
 */
function txLogsBloom(logs) {

  var bloom = new Bloom()

  if (logs) {
    for (var i = 0; i < logs.length; i++) {
      var log = logs[i]
      //add the address
      bloom.add(log[0])
      //add the topics
      var topics = log[1]
      for (var q = 0; q < topics.length; q++)
        bloom.add(topics[q])
    }
  }
  return bloom
}

/**
 * Process a transaction. Run the vm. Transfers eth. checks balaces
 * @method processTx
 * @param opts
 * @param opts.tx {Transaciton} - a transaction
 * @param opts.skipNonce - skips the nonce check
 * @param opts.block {Block} needed to process the transaction
 * @param opts.blockchain {Blockchain} needed to for BLOCKHASH
 * @param cb {Function} - the callback
 */
module.exports = function(opts, cb) {

  var self = this
  var gasLimit
  var results
  var basefee

  if(!opts.block)
    opts.block = new Block()

  //run the transaction hook
  //TODO: remove
  function runTxHook(cb) {
    self.emit('beforeTx', opts.tx)
    if (self.onTx)
      self.onTx(opts.tx, cb)
    else
      cb()
  }

  /**
   * populates the cache with the two and from of the tx
   */
  function populateCache(cb) {
    var accounts = new Set()
    accounts.add(opts.tx.from.toString('hex'))
    accounts.add(opts.tx.to.toString('hex'))

    if(opts.populateCache === false)
      return cb()

    //shim till async supports iterators
    var accountArr = []
    accounts.forEach(function(val) {
      if (val) accountArr.push(val)
    })

    async.eachSeries(accountArr, function(acnt, done) {
      acnt = new Buffer(acnt, 'hex')
      self.trie.get(acnt, function(err, val) {
        val = new Account(val)
        self.cache.put(acnt, val)
        done()
      })
    }, cb)
  }

  //sets up the envorment and runs a `call`
  function runCall(done) {
    //check to the sender's account to make sure it has enought wei and the
    //correct nonce
    var fromAccount = self.cache.get(opts.tx.from)

    if (new BN(fromAccount.balance).cmp(opts.tx.getUpfrontCost()) === -1){
      done('sender doesn\'t have enougth funds to send tx. The upfront cost is: ' + opts.tx.getUpfrontCost().toString()
          + ' and the sender\s account only has: ' + new BN(fromAccount.balance).toString())
     }else if (!opts.skipNonce && new BN(fromAccount.nonce).cmp(new BN(opts.tx.nonce)) !== 0) {
      done('the tx doesn\'t have the correct nonce. account has nonce of: ' + new BN(fromAccount.nonce).toString()
          + ' tx has nonce of: ' + new BN(opts.tx.nonce).toString())
     }else{

      //increment the nonce
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

      if (opts.tx.to.toString('hex') === '')
        delete options.to

      //run call
      self.runCall(options, function(err, r) {

        results = r

        //generate the bloom for the tx
        r.bloom = txLogsBloom(r.vm.logs)

        if (r.vm.logs && r.vm.logs.length) {
          self.emit('logs', {
            logs: results.vm.logs,
            bloom: results.bloom,
            tx: opts.tx,
            block: opts.block,
          })
        }

        fromAccount = self.cache.get(opts.tx.from)

        //caculate the totall gas used
        results.gasUsed = results.gasUsed.add(basefee)

        //refund the account
        var gasRefund = results.vm.gasRefund
        if (gasRefund) {
          if (gasRefund.cmp(results.gasUsed.div(new BN(2))) === -1)
            results.gasUsed = results.gasUsed.sub(gasRefund)
          else
            results.gasUsed = results.gasUsed.sub(results.gasUsed.div(new BN(2)))
        }

        //refund the left over gas amount
        gasLimit = new BN(opts.tx.gasLimit)
        fromAccount.balance = new BN(fromAccount.balance)
          .add(gasLimit.sub(results.gasUsed).mul(new BN(opts.tx.gasPrice)))

        results.amountSpent = results.gasUsed.mul(new BN(opts.tx.gasPrice))

        self.cache.put(opts.tx.from, fromAccount)

        
        async.each(r.vm.storageTries, function(trie, cb){
          trie.commit(cb) 
        }, function(){
          done(err)
        })
      })
    } 
  }

  function rewardSuicides(done) {

    //TODO: suicides should be a set
    if (!results.vm.suicides) {
      results.vm.suicides = []
    }

    var suicides = {}
    results.vm.suicides.forEach(function(s){
      suicides[s.account.toString('hex')] = s
    })

    var keys = Object.keys(suicides)
    async.eachSeries(keys , function(key, cb2) {
      var s = suicides[key]
      var suicideAccount = self.cache.get(s.account)
      //load to account
      self.cache.getOrLoad(s.to, function(err, suicideToAccount) {
        //add to the balance
        suicideToAccount.balance = new BN(suicideToAccount.balance)
          .add(new BN(suicideAccount.balance))

        self.cache.put(s.to, suicideToAccount)

        cb2()
      })
    }, function(){
    
      //reward the miner account
      //get miner acccount
      var minerAccount = self.cache.get(opts.block.header.coinbase)
      //add the amount spent on gas to the miner's account
      minerAccount.balance = new BN(minerAccount.balance)
        .add(results.amountSpent)

      //save the miner's account
      self.cache.put(opts.block.header.coinbase, minerAccount)

      results.vm.suicides.forEach(function(s){
        self.cache.del(s.account)
      })

      done()
    
    })
  }

  //run everything
  async.series([
    populateCache,
    runTxHook,
    runCall,
    rewardSuicides,
    function(cb){
      if(opts.poplateCache === false)
        return cb()

      self.cache.flush(cb)
    }
  ], function(err) {
    self.emit('afterTx', opts.tx)
    cb(err, results)
  })
}
