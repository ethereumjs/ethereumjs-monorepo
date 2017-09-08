const async = require('async')

/**
 * processes blocks and adds them to the blockchain
 * @method onBlock
 * @param blockchain
 */
module.exports = function (blockchain, cb) {
  var self = this
  var headBlock, parentState

  // parse arguments
  if (typeof blockchain === 'function') {
    cb = blockchain
  } else if (blockchain) {
    self.blockchain = blockchain
  }

  // setup blockchain iterator
  this.stateManager.blockchain.iterator('vm', processBlock, cb)
  function processBlock (block, reorg, cb) {
    async.series([
      getStartingState,
      runBlock
    ], cb)

    // determine starting state for block run
    function getStartingState (cb) {
      // if we are just starting or if a chain re-org has happened
      if (!headBlock || reorg) {
        self.stateManager.blockchain.getBlock(block.header.parentHash, function (err, parentBlock) {
          parentState = parentBlock.header.stateRoot
          // generate genesis state if we are at the genesis block
          // we don't have the genesis state
          if (!headBlock) {
            return self.stateManager.generateCanonicalGenesis(cb)
          } else {
            cb(err)
          }
        })
      } else {
        parentState = headBlock.header.stateRoot
        cb()
      }
    }

    // run block, update head if valid
    function runBlock (cb) {
      self.runBlock({
        block: block,
        root: parentState
      }, function (err, results) {
        if (err) {
          // remove invalid block
          console.log('Invalid block error:', err)
          self.stateManager.blockchain.delBlock(block.header.hash(), cb)
        } else {
          // set as new head block
          headBlock = block
          cb()
        }
      })
    }
  }
}
