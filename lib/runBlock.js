const Buffer = require('safe-buffer').Buffer
const async = require('async')
const ethUtil = require('ethereumjs-util')
const Bloom = require('./bloom.js')
const common = require('ethereum-common')
const rlp = ethUtil.rlp
const Trie = require('merkle-patricia-tree')
const BN = ethUtil.BN

const minerReward = new BN(common.minerReward.v)

/**
 * process the transaction in a block and pays the miners
 * @param opts
 * @param opts.block {Block} the block we are processing
 * @param opts.generate {Boolean} [gen=false] whether to generate the stateRoot
 * @param cb {Function} the callback which is given an error string
 */
module.exports = function (opts, cb) {
  const self = this

  // parse options
  const block = opts.block
  const generateStateRoot = !!opts.generate
  const validateStateRoot = !generateStateRoot
  const bloom = new Bloom()
  const receiptTrie = new Trie()
  // the total amount of gas used processing this block
  var gasUsed = new BN(0)
  // miner account
  var minerAccount
  var receipts = []
  var txResults = []
  var result

  if (opts.root) {
    self.stateManager.trie.root = opts.root
  }

  this.trie.checkpoint()

  // run everything
  async.series([
    beforeBlock,
    populateCache,
    processTransactions
  ], parseBlockResults)

  function beforeBlock (cb) {
    self.emit('beforeBlock', opts.block, cb)
  }

  function afterBlock (cb) {
    self.emit('afterBlock', result, cb)
  }

  // populates the cache with accounts that we know we will need
  function populateCache (cb) {
    var accounts = new Set()
    accounts.add(block.header.coinbase.toString('hex'))
    block.transactions.forEach(function (tx) {
      accounts.add(tx.getSenderAddress().toString('hex'))
      accounts.add(tx.to.toString('hex'))
    })

    block.uncleHeaders.forEach(function (uh) {
      accounts.add(uh.coinbase.toString('hex'))
    })

    self.populateCache(accounts, cb)
  }

  /**
   * Processes all of the transaction in the block
   * @method processTransaction
   * @param {Function} cb the callback is given error if there are any
   */
  function processTransactions (cb) {
    var validReceiptCount = 0

    async.eachSeries(block.transactions, processTx, cb)

    function processTx (tx, cb) {
      var gasLimitIsHigherThanBlock = new BN(block.header.gasLimit).lt(new BN(tx.gasLimit).add(gasUsed))
      if (gasLimitIsHigherThanBlock) {
        cb(new Error('tx has a higher gas limit than the block'))
        return
      }

      // run the tx through the VM
      self.runTx({
        tx: tx,
        block: block,
        populateCache: false
      }, parseTxResult)

      function parseTxResult (err, result) {
        txResults.push(result)
        // var receiptResult = new BN(1)

        // abort if error
        if (err) {
          receipts.push(null)
          cb(err)
          return
        }

        gasUsed = gasUsed.add(result.gasUsed)
        // combine blooms via bitwise OR
        bloom.or(result.bloom)

        if (generateStateRoot) {
          block.header.bloom = bloom.bitvector
        }

        var txLogs = result.vm.logs || []

        var rawTxReceipt = [
          result.vm.exception ? 1 : 0, // result.vm.exception is 0 when an exception occurs, and 1 when it doesn't.  TODO make this the opposite
          gasUsed.toArrayLike(Buffer),
          result.bloom.bitvector,
          txLogs
        ]
        var txReceipt = {
          status: rawTxReceipt[0],
          gasUsed: rawTxReceipt[1],
          bitvector: rawTxReceipt[2],
          logs: rawTxReceipt[3]
        }

        receipts.push(txReceipt)
        receiptTrie.put(rlp.encode(validReceiptCount), rlp.encode(rawTxReceipt))
        validReceiptCount++
        cb()
      }
    }
  }

  // handle results or error from block run
  function parseBlockResults (err) {
    if (err) {
      self.trie.revert()
      cb(err)
      return
    }

    // credit all block rewards
    payOmmersAndMiner()

    // credit all block rewards
    if (generateStateRoot) {
      block.header.stateRoot = self.trie.root
    }

    self.trie.commit(function (err) {
      self.stateManager.cache.flush(function () {
        if (validateStateRoot) {
          if (receiptTrie.root && receiptTrie.root.toString('hex') !== block.header.receiptTrie.toString('hex')) {
            err = new Error((err || '') + 'invalid receiptTrie ')
          }
          if (bloom.bitvector.toString('hex') !== block.header.bloom.toString('hex')) {
            err = new Error((err || '') + 'invalid bloom ')
          }
          if (ethUtil.bufferToInt(block.header.gasUsed) !== Number(gasUsed)) {
            err = new Error((err || '') + 'invalid gasUsed ')
          }
          if (self.trie.root.toString('hex') !== block.header.stateRoot.toString('hex')) {
            err = new Error((err || '') + 'invalid block stateRoot ')
          }
        }

        self.stateManager.cache.clear()

        result = {
          receipts: receipts,
          results: txResults,
          error: err
        }

        afterBlock(cb.bind(this, err, result))
      })
    })
  }

  // credit all block rewards
  function payOmmersAndMiner () {
    var ommers = block.uncleHeaders
    // pay each ommer
    ommers.forEach(rewardOmmer)

    // calculate nibling reward
    var niblingReward = minerReward.div(new BN(32))
    var totalNiblingReward = niblingReward.mul(new BN(ommers.length))
    minerAccount = self.stateManager.cache.get(block.header.coinbase)
    // give miner the block reward
    minerAccount.balance = new BN(minerAccount.balance)
      .add(minerReward)
      .add(totalNiblingReward)
    self.stateManager.cache.put(block.header.coinbase, minerAccount)
  }

  // credit ommer
  function rewardOmmer (ommer) {
    // calculate reward
    var heightDiff = new BN(block.header.number).sub(new BN(ommer.number))
    var reward = ((new BN(8)).sub(heightDiff)).mul(minerReward.div(new BN(8)))

    if (reward.lt(new BN(0))) {
      reward = new BN(0)
    }

    // credit miners account
    var ommerAccount = self.stateManager.cache.get(ommer.coinbase)
    ommerAccount.balance = reward.add(new BN(ommerAccount.balance))
    self.stateManager.cache.put(ommer.coinbase, ommerAccount)
  }
}
