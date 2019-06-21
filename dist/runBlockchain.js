'use strict';

var async = require('async');

/**
 * Processes blocks and adds them to the blockchain
 * @method vm.runBlockchain
 * @param {Blockchain} blockchain A [blockchain](https://github.com/ethereum/ethereumjs-blockchain) that to process
 * @param {Function} cb the callback function
 */
module.exports = function (blockchain, cb) {
  var self = this;
  var headBlock, parentState;

  // parse arguments
  if (typeof blockchain === 'function') {
    cb = blockchain;
    blockchain = undefined;
  }

  blockchain = blockchain || self.blockchain;

  // setup blockchain iterator
  blockchain.iterator('vm', processBlock, cb);
  function processBlock(block, reorg, cb) {
    async.series([getStartingState, runBlock], cb);

    // determine starting state for block run
    function getStartingState(cb) {
      // if we are just starting or if a chain re-org has happened
      if (!headBlock || reorg) {
        blockchain.getBlock(block.header.parentHash, function (err, parentBlock) {
          parentState = parentBlock.header.stateRoot;
          // generate genesis state if we are at the genesis block
          // we don't have the genesis state
          if (!headBlock) {
            return self.stateManager.generateCanonicalGenesis(cb);
          } else {
            cb(err);
          }
        });
      } else {
        parentState = headBlock.header.stateRoot;
        cb();
      }
    }

    // run block, update head if valid
    function runBlock(cb) {
      self.runBlock({
        block: block,
        root: parentState
      }, function (err, results) {
        if (err) {
          // remove invalid block
          blockchain.delBlock(block.header.hash(), function () {
            cb(err);
          });
        } else {
          // set as new head block
          headBlock = block;
          cb();
        }
      });
    }
  }
};