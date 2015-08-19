const async = require('async')

/**
 * processes blocks and adds them to the blockchain
 * @method onBlock
 * @param blockchain
 */
module.exports = function (blockchain, cb) {

  if (typeof blockchain === 'function')
    cb = blockchain
  else if (blockchain)
    self.blockain = blockchain

  var self = this
  var block, lastBlock, parentState

  this.blockchain.iterator(
    processBlock,
    'vm',
    cb
  )

  function processBlock(block, reorg, cb) {
    var error;
    async.series([
      function getStartingState(cb2) {
        // if we are just starting or if a chain re-org has happened
        if (!lastBlock || reorg) {
          self.blockchain.getBlock(block.header.parentHash, function (err, b) {
            parentState = b.header.stateRoot
            cb2()
          })
        } else {
          parentSate = lastBlock.header.stateRoot
          cb2()
        }
      },
      function runBlock(cb2) {
        self.runBlock({
          block: block,
          root: parentState
        }, function (err, results) {
          error = err
          lastBlock = block
          cb2()
        })
      },
      function (cb2) {
        if (error)
          self.blockchain.delBlock(block, cb2)
        else
          cb2()
      }
    ], cb)
  }
}
