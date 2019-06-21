'use strict';

var Buffer = require('safe-buffer').Buffer;
var async = require('async');
var ethUtil = require('ethereumjs-util');
var Bloom = require('./bloom');
var rlp = ethUtil.rlp;
var Trie = require('merkle-patricia-tree');
var BN = ethUtil.BN;

/**
 * Processes the `block` running all of the transactions it contains and updating the miner's account
 * @method vm.runBlock
 * @param opts
 * @param {Block} opts.block the [`Block`](https://github.com/ethereumjs/ethereumjs-block) to process
 * @param {Boolean} opts.generate [gen=false] whether to generate the stateRoot, if false `runBlock` will check the stateRoot of the block against the Trie
 * @param {runBlock~callback} cb callback
 */

/**
 * Callback for `runBlock` method
 * @callback runBlock~callback
 * @param {Error} error an error that may have happened or `null`
 * @param {Object} results
 * @param {Array} results.receipts the receipts from the transactions in the block
 * @param {Array} results.results
*/
module.exports = function (opts, cb) {
  if (typeof opts === 'function' && cb === undefined) {
    cb = opts;
    return cb(new Error('invalid input, opts must be provided'));
  }
  if (!opts.block) {
    return cb(new Error('invalid input, block must be provided'));
  }

  var self = this;

  // parse options
  var block = opts.block;
  var skipBlockValidation = opts.skipBlockValidation || false;
  var generateStateRoot = !!opts.generate;
  var validateStateRoot = !generateStateRoot;
  var bloom = new Bloom();
  var receiptTrie = new Trie();
  // the total amount of gas used processing this block
  var gasUsed = new BN(0);
  var checkpointedState = false;
  var receipts = [];
  var txResults = [];
  var result;

  // run everything
  async.series([beforeBlock, validateBlock, setStateRoot, checkpointState, processTransactions, payOmmersAndMiner], parseBlockResults);

  function beforeBlock(cb) {
    /**
     * The `beforeBlock` event
     *
     * @event Event: beforeBlock
     * @type {Object}
     * @property {Block} block emits the block that is about to be processed
     */
    self.emit('beforeBlock', opts.block, cb);
  }

  function afterBlock(cb) {
    /**
     * The `afterBlock` event
     *
     * @event Event: afterBlock
     * @type {Object}
     * @property {Object} result emits the results of processing a block
     */
    self.emit('afterBlock', result, cb);
  }

  function validateBlock(cb) {
    if (skipBlockValidation) {
      cb();
    } else {
      if (new BN(block.header.gasLimit).gte(new BN('8000000000000000', 16))) {
        cb(new Error('Invalid block with gas limit greater than (2^63 - 1)'));
      } else {
        block.validate(self.blockchain, cb);
      }
    }
  }

  function setStateRoot(cb) {
    if (opts.root) {
      self.stateManager.setStateRoot(opts.root, cb);
    } else {
      cb(null);
    }
  }

  function checkpointState(cb) {
    checkpointedState = true;
    self.stateManager.checkpoint(cb);
  }

  /**
   * Processes all of the transaction in the block
   * @method processTransaction
   * @private
   * @param {Function} cb the callback is given error if there are any
   */
  function processTransactions(cb) {
    var validReceiptCount = 0;

    async.eachSeries(block.transactions, processTx, cb);

    function processTx(tx, cb) {
      var gasLimitIsHigherThanBlock = new BN(block.header.gasLimit).lt(new BN(tx.gasLimit).add(gasUsed));
      if (gasLimitIsHigherThanBlock) {
        cb(new Error('tx has a higher gas limit than the block'));
        return;
      }

      // run the tx through the VM
      self.runTx({
        tx: tx,
        block: block
      }, parseTxResult);

      function parseTxResult(err, result) {
        txResults.push(result);
        // var receiptResult = new BN(1)

        // abort if error
        if (err) {
          receipts.push(null);
          cb(err);
          return;
        }

        gasUsed = gasUsed.add(result.gasUsed);
        // combine blooms via bitwise OR
        bloom.or(result.bloom);

        if (generateStateRoot) {
          block.header.bloom = bloom.bitvector;
        }

        var txLogs = result.vm.logs || [];

        var rawTxReceipt = [result.vm.exception ? 1 : 0, // result.vm.exception is 0 when an exception occurs, and 1 when it doesn't.  TODO make this the opposite
        gasUsed.toArrayLike(Buffer), result.bloom.bitvector, txLogs];
        var txReceipt = {
          status: rawTxReceipt[0],
          gasUsed: rawTxReceipt[1],
          bitvector: rawTxReceipt[2],
          logs: rawTxReceipt[3]
        };

        receipts.push(txReceipt);
        receiptTrie.put(rlp.encode(validReceiptCount), rlp.encode(rawTxReceipt), function () {
          validReceiptCount++;
          cb();
        });
      }
    }
  }

  // credit all block rewards
  function payOmmersAndMiner(cb) {
    var ommers = block.uncleHeaders;

    // pay each ommer
    async.series([rewardOmmers, rewardMiner], cb);

    function rewardOmmers(done) {
      async.each(block.uncleHeaders, function (ommer, next) {
        // calculate reward
        var minerReward = new BN(self._common.param('pow', 'minerReward'));
        var heightDiff = new BN(block.header.number).sub(new BN(ommer.number));
        var reward = new BN(8).sub(heightDiff).mul(minerReward.divn(8));

        if (reward.ltn(0)) {
          reward = new BN(0);
        }

        rewardAccount(ommer.coinbase, reward, next);
      }, done);
    }

    function rewardMiner(done) {
      // calculate nibling reward
      var minerReward = new BN(self._common.param('pow', 'minerReward'));
      var niblingReward = minerReward.divn(32);
      var totalNiblingReward = niblingReward.muln(ommers.length);
      var reward = minerReward.add(totalNiblingReward);
      rewardAccount(block.header.coinbase, reward, done);
    }

    function rewardAccount(address, reward, done) {
      self.stateManager.getAccount(address, function (err, account) {
        if (err) return done(err);
        // give miner the block reward
        account.balance = new BN(account.balance).add(reward);
        self.stateManager.putAccount(address, account, done);
      });
    }
  }

  // handle results or error from block run
  function parseBlockResults(err) {
    if (err) {
      if (checkpointedState) {
        self.stateManager.revert(function () {
          cb(err);
        });
      } else {
        cb(err);
      }
      return;
    }

    self.stateManager.commit(function (err) {
      if (err) return cb(err);

      self.stateManager.getStateRoot(function (err, stateRoot) {
        if (err) return cb(err);

        // credit all block rewards
        if (generateStateRoot) {
          block.header.stateRoot = stateRoot;
        }

        if (validateStateRoot) {
          if (receiptTrie.root && receiptTrie.root.toString('hex') !== block.header.receiptTrie.toString('hex')) {
            err = new Error((err || '') + 'invalid receiptTrie ');
          }
          if (bloom.bitvector.toString('hex') !== block.header.bloom.toString('hex')) {
            err = new Error((err || '') + 'invalid bloom ');
          }
          if (ethUtil.bufferToInt(block.header.gasUsed) !== Number(gasUsed)) {
            err = new Error((err || '') + 'invalid gasUsed ');
          }
          if (stateRoot.toString('hex') !== block.header.stateRoot.toString('hex')) {
            err = new Error((err || '') + 'invalid block stateRoot ');
          }
        }

        result = {
          receipts: receipts,
          results: txResults,
          error: err
        };

        afterBlock(cb.bind(this, err, result));
      });
    });
  }
};