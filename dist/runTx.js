'use strict';

var Buffer = require('safe-buffer').Buffer;
var async = require('async');
var utils = require('ethereumjs-util');
var BN = utils.BN;
var Bloom = require('./bloom');
var Block = require('ethereumjs-block');
var Account = require('ethereumjs-account');

var _require = require('./state'),
    StorageReader = _require.StorageReader;

/**
 * Process a transaction. Run the vm. Transfers eth. Checks balances.
 * @method vm.runTx
 * @param opts
 * @param {Transaction} opts.tx a [`Transaction`](https://github.com/ethereum/ethereumjs-tx) to run
 * @param {Boolean} opts.skipNonce skips the nonce check
 * @param {Boolean} opts.skipBalance skips the balance check
 * @param {Block} opts.block the block to which the `tx` belongs, if no block is given a default one is created
 * @param {runTx~callback} cb the callback
 */

/**
 * Callback for `runTx` method
 * @callback runTx~callback
 * @param {Error} error an error that may have happened or `null`
 * @param {Object} results
 * @param {BN} results.amountSpent the amount of ether used by this transaction as a `bignum`
 * @param {BN} results.gasUsed the amount of gas as a `bignum` used by the transaction
 * @param {BN} results.gasRefund the amount of gas as a `bignum` that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)
 * @param {VM} vm contains the results from running the code, if any, as described in `vm.runCode(params, cb)`
*/


module.exports = function (opts, cb) {
  if (typeof opts === 'function' && cb === undefined) {
    cb = opts;
    return cb(new Error('invalid input, opts must be provided'));
  }

  var self = this;
  var block = opts.block;
  var tx = opts.tx;
  var gasLimit;
  var results;
  var basefee;
  var storageReader = new StorageReader(self.stateManager);

  // tx is required
  if (!tx) {
    return cb(new Error('invalid input, tx is required'));
  }

  // create a reasonable default if no block is given
  if (!block) {
    block = new Block();
  }

  if (new BN(block.header.gasLimit).lt(new BN(tx.gasLimit))) {
    cb(new Error('tx has a higher gas limit than the block'));
    return;
  }

  // run everything
  async.series([checkpointState, runTxHook, updateFromAccount, runCall, runAfterTxHook], function (err) {
    if (err) {
      self.stateManager.revert(function () {
        cb(err, results);
      });
    } else {
      self.stateManager.commit(function (err) {
        cb(err, results);
      });
    }
  });

  function checkpointState(cb) {
    self.stateManager.checkpoint(cb);
  }

  // run the transaction hook
  function runTxHook(cb) {
    /**
     * The `beforeTx` event
     *
     * @event Event: beforeTx
     * @type {Object}
     * @property {Transaction} tx emits the Transaction that is about to be processed
     */
    self.emit('beforeTx', tx, cb);
  }

  // run the transaction hook
  function runAfterTxHook(cb) {
    /**
     * The `afterTx` event
     *
     * @event Event: afterTx
     * @type {Object}
     * @property {Object} result result of the transaction
     */
    self.emit('afterTx', results, cb);
  }

  function updateFromAccount(cb) {
    self.stateManager.getAccount(tx.from, function (err, fromAccount) {
      if (err) {
        cb(err);
        return;
      }

      var message;
      if (!opts.skipBalance && new BN(fromAccount.balance).lt(tx.getUpfrontCost())) {
        message = "sender doesn't have enough funds to send tx. The upfront cost is: " + tx.getUpfrontCost().toString() + ' and the sender\'s account only has: ' + new BN(fromAccount.balance).toString();
        cb(new Error(message));
        return;
      } else if (!opts.skipNonce && !new BN(fromAccount.nonce).eq(new BN(tx.nonce))) {
        message = "the tx doesn't have the correct nonce. account has nonce of: " + new BN(fromAccount.nonce).toString() + ' tx has nonce of: ' + new BN(tx.nonce).toString();
        cb(new Error(message));
        return;
      }

      // increment the nonce
      fromAccount.nonce = new BN(fromAccount.nonce).addn(1);

      basefee = tx.getBaseFee();
      gasLimit = new BN(tx.gasLimit);
      if (gasLimit.lt(basefee)) {
        return cb(new Error('base fee exceeds gas limit'));
      }
      gasLimit.isub(basefee);

      fromAccount.balance = new BN(fromAccount.balance).sub(new BN(tx.gasLimit).mul(new BN(tx.gasPrice)));
      self.stateManager.putAccount(tx.from, fromAccount, cb);
    });
  }

  // sets up the environment and runs a `call`
  function runCall(cb) {
    var options = {
      caller: tx.from,
      gasLimit: gasLimit,
      gasPrice: tx.gasPrice,
      to: tx.to,
      value: tx.value,
      data: tx.data,
      block: block,
      storageReader: storageReader
    };

    if (tx.to.toString('hex') === '') {
      delete options.to;
    }

    // run call
    self.runCall(options, parseResults);

    function parseResults(err, _results) {
      if (err) return cb(err);
      results = _results;

      // generate the bloom for the tx
      results.bloom = txLogsBloom(results.vm.logs);

      // caculate the total gas used
      results.gasUsed = results.gasUsed.add(basefee);

      // process any gas refund
      results.gasRefund = results.vm.gasRefund;
      if (results.gasRefund) {
        if (results.gasRefund.lt(results.gasUsed.divn(2))) {
          results.gasUsed.isub(results.gasRefund);
        } else {
          results.gasUsed.isub(results.gasUsed.divn(2));
        }
      }

      results.amountSpent = results.gasUsed.mul(new BN(tx.gasPrice));

      async.series([loadFromAccount, updateFromAccount, loadMinerAccount, updateMinerAccount, cleanupAccounts], cb);

      var fromAccount;
      function loadFromAccount(next) {
        self.stateManager.getAccount(tx.from, function (err, account) {
          fromAccount = account;
          next(err);
        });
      }

      function updateFromAccount(next) {
        // refund the leftover gas amount
        var finalFromBalance = new BN(tx.gasLimit).sub(results.gasUsed).mul(new BN(tx.gasPrice)).add(new BN(fromAccount.balance));
        fromAccount.balance = finalFromBalance;

        self.stateManager.putAccount(utils.toBuffer(tx.from), fromAccount, next);
      }

      var minerAccount;
      function loadMinerAccount(next) {
        self.stateManager.getAccount(block.header.coinbase, function (err, account) {
          minerAccount = account;
          next(err);
        });
      }

      function updateMinerAccount(next) {
        // add the amount spent on gas to the miner's account
        minerAccount.balance = new BN(minerAccount.balance).add(results.amountSpent);

        // save the miner's account
        if (!new BN(minerAccount.balance).isZero()) {
          self.stateManager.putAccount(block.header.coinbase, minerAccount, next);
        } else {
          next();
        }
      }

      function cleanupAccounts(next) {
        if (!results.vm.selfdestruct) {
          results.vm.selfdestruct = {};
        }

        var keys = Object.keys(results.vm.selfdestruct);

        async.series([deleteSelfDestructs, cleanTouched], next);

        function deleteSelfDestructs(done) {
          async.each(keys, function (s, cb) {
            self.stateManager.putAccount(Buffer.from(s, 'hex'), new Account(), cb);
          }, done);
        }

        function cleanTouched(done) {
          self.stateManager.cleanupTouchedAccounts(done);
        }
      }
    }
  }
};

/**
 * @method txLogsBloom
 * @private
 */
function txLogsBloom(logs) {
  var bloom = new Bloom();
  if (logs) {
    for (var i = 0; i < logs.length; i++) {
      var log = logs[i];
      // add the address
      bloom.add(log[0]);
      // add the topics
      var topics = log[1];
      for (var q = 0; q < topics.length; q++) {
        bloom.add(topics[q]);
      }
    }
  }
  return bloom;
}