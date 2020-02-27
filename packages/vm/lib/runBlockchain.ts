import Blockchain from 'ethereumjs-blockchain'
import VM from './index'
const async = require('async')

/**
 * @ignore
 */
export default function runBlockchain(this: VM, blockchain: Blockchain): Promise<void> {
  return new Promise((resolve, reject) => {
    const self = this
    let headBlock: any
    let parentState: Buffer

    blockchain = blockchain || this.blockchain

    // setup blockchain iterator
    blockchain.iterator('vm', processBlock, (err: Error) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })

    function processBlock(block: any, reorg: boolean, cb: any) {
      async.series([getStartingState, runBlock], cb)

      // determine starting state for block run
      function getStartingState(cb: any) {
        // if we are just starting or if a chain re-org has happened
        if (!headBlock || reorg) {
          blockchain.getBlock(block.header.parentHash, function(err: any, parentBlock: any) {
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
      function runBlock(cb: any) {
        self
          .runBlock({
            block: block,
            root: parentState,
          })
          .then(() => {
            // set as new head block
            headBlock = block
            cb()
          })
          .catch(err => {
            // remove invalid block
            blockchain.delBlock(block.header.hash(), function() {
              cb(err)
            })
          })
      }
    }
  })
}
