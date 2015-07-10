const async = require('async')
const ethUtil = require('ethereumjs-util')
const Bloom = require('../bloom.js')
const Account = require('../account.js')
const rlp = require('rlp')
const Trie = require('merkle-patricia-tree')
const BN = require('bn.js')

const minerReward = new BN('1500000000000000000')
const uncleReward = new BN('1406250000000000000')
const nephewReward = new BN('46875000000000000')

/**
 * process the transaction in a block and pays the miners
 * @param opts
 * @param opts.block {Block} the block we are processing
 * @param opts.blockchain {Blockchain} the current blockchain
 * @param opts.root {Buffer} the state root which to start from
 * @param opts.gen {Boolean} [gen=false] whether to generate
 * @param cb {Function} the callback which is given an error string
 */
module.exports = function(opts, cb) {

  const self = this
  const bloom = new Bloom()
  const receiptTrie = new Trie()

  var gasUsed = new BN(0) //the totally amount of gas used processing this block
  var r = new BN(0)
  var minerAccount //miner account

  this.trie.checkpoint()

  if (opts.root) this.trie.root = opts.root

  //populates the cache with accounts that we konw we will need
  function populateCache(cb) {
    var accounts = new Set()
    accounts.add(opts.block.header.coinbase.toString('hex'))
    opts.block.transactions.forEach(function(tx) {
      accounts.add(tx.getSenderAddress().toString('hex'))
      accounts.add(tx.to.toString('hex'))
    })

    opts.block.uncleHeaders.forEach(function(uh) {
      accounts.add(uh.coinbase.toString('hex'))
    })

    self.populateCache(accounts, cb)
  }

  /**
   * Processes all of the transaction in the block
   * @method processTransaction
   * @param {Function} cb the callback is given error if there are any
   */
  function processTransactions(cb) {
    var results
    var i = 0

    async.eachSeries(opts.block.transactions, function(tx, cb2) {

      if (new BN(opts.block.header.gasLimit).cmp(new BN(tx.gasLimit).add(gasUsed)) === -1)
        return cb2('tx has a higher gas limit than the block')

      //run the tx through the VM
      self.runTx({
          tx: tx,
          block: opts.block,
          blockchain: opts.blockchain,
          populateCache: false
        },
        function(err, r) {
          results = r

          if (!err) {
            gasUsed = gasUsed.add(results.gasUsed)
            //bitwise OR the blooms together
            bloom.or(r.bloom)

            if (opts.gen) {
              opts.block.header.bloom = bloom.bitvector
            }


            //TODO: flush here to generate correct root
            //create the tx receipt
            // self.cache.flush(function(){
            var txLogs = results.vm.logs ? results.vm.logs : []
            var tr = [self.trie.root, new Buffer(gasUsed.toArray()), results.bloom.bitvector, txLogs]

            receiptTrie.put(rlp.encode(i), rlp.encode(tr))
            i++
          }
          // })
          cb2(err)
        })
    }, cb)
  }

  //give the uncles thiers payout
  function payUnclesAndMiner() {
    //iterate over the uncles

    opts.block.uncleHeaders.forEach(function(uncle) {
      //acculmulate the nephewReward
      r = r.add(nephewReward)

      var heightDiff = new BN(opts.block.header.number).sub(new BN(uncle.number))
      var reward = minerReward.sub(minerReward.divn(8).mul(heightDiff)) 

      //get the miners account
      var uncleAccount = self.cache.get(uncle.coinbase)
      uncleAccount.balance = reward.add(new BN(uncleAccount.balance));
      self.cache.put(uncle.coinbase, uncleAccount)
    })

    minerAccount = self.cache.get(opts.block.header.coinbase)
    //gives the mine the block reward and saves the miners account
    minerAccount.balance = new BN(minerAccount.balance)
      .add(minerReward)
      .add(r) //add the accumlated nephewReward


    // console.log('miner coinbase: ' + opts.block.header.coinbase.toString('hex'));
    self.cache.put(opts.block.header.coinbase, minerAccount)
  }

  //run everything
  async.series([
    populateCache,
    processTransactions,
  ], function(err) {


    if (err) {
      self.trie.revert()
      cb(err)
    } else {

      payUnclesAndMiner()

      if (opts.gen) {
        opts.block.header.stateRoot = self.trie.root
      }

      self.trie.commit(function(err) {
        self.cache.flush(function() {
          if (!opts.gen) {
            if (receiptTrie.root && receiptTrie.root.toString('hex') !== opts.block.header.receiptTrie.toString('hex'))
              err += 'invalid receiptTrie '
            else if (bloom.bitvector.toString('hex') !== opts.block.header.bloom.toString('hex'))
              err += 'invalid bloom '
            else if( ethUtil.bufferToInt(opts.block.header.gasUsed) !== Number(gasUsed))
              err += 'invalud gasUsed '
            else if (self.trie.root.toString('hex') !== opts.block.header.stateRoot.toString('hex'))
              err += 'invalid block stateRoot '
          }

          if(!err){
            self.emit('block', opts.block)
          }

          cb(err)
        })
      })
    }
  })
}
