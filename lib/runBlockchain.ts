import BN = require('bn.js')
import Common from 'ethereumjs-common'
import { genesisStateByName } from 'ethereumjs-common/dist/genesisStates'
import Account from 'ethereumjs-account'
import { toBuffer } from 'ethereumjs-util'
import VM from './index'
import { StateManager } from './state'
const async = require('async')

/**
 * @ignore
 */
export default function runBlockchain(this: VM, blockchain: any, cb: any) {
  const self = this
  let headBlock: any
  let parentState: Buffer

  // parse arguments
  if (typeof blockchain === 'function') {
    cb = blockchain
    blockchain = this.blockchain
  }

  blockchain = blockchain || this.blockchain

  // setup blockchain iterator
  blockchain.iterator('vm', processBlock, cb)
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
            return generateCanonicalGenesis(self.stateManager, self._common, cb)
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
      self.runBlock(
        {
          block: block,
          root: parentState,
        },
        function(err) {
          if (err) {
            // remove invalid block
            blockchain.delBlock(block.header.hash(), function() {
              cb(err)
            })
          } else {
            // set as new head block
            headBlock = block
            cb()
          }
        },
      )
    }
  }
}

/**
 * Generates a canonical genesis state on the instance based on the
 * configured chain parameters. Will error if there are uncommitted
 * checkpoints on the instance.
 */
function generateCanonicalGenesis(stateManager: StateManager, common: Common, cb: any): void {
  if (stateManager._checkpointCount !== 0) {
    return cb(new Error('Cannot create genesis state with uncommitted checkpoints'))
  }

  hasGenesisState(stateManager, common, (err: Error | null, genesis: boolean) => {
    if (!genesis && !err) {
      generateGenesis(stateManager, genesisStateByName(common.chainName()), cb)
    } else {
      cb(err)
    }
  })
}

interface hasGenesisStateCallback {
  /**
   * @param err - An error that may have happened or `null`
   * @param hasGenesisState - Whether the storage trie contains the
   * canonical genesis state for the configured chain parameters.
   */
  (err: Error | null, hasGenesisState: boolean): void
}

/**
 * Checks whether the current instance has the canonical genesis state
 * for the configured chain parameters.
 */
function hasGenesisState(
  stateManager: StateManager,
  common: Common,
  cb: hasGenesisStateCallback,
): void {
  const root = common.genesis().stateRoot
  stateManager._trie.checkRoot(root, cb)
}

/**
 * Initializes the provided genesis state into the state trie.
 */
function generateGenesis(stateManager: StateManager, initState: any, cb: any) {
  if (stateManager._checkpointCount !== 0) {
    return cb(new Error('Cannot create genesis state with uncommitted checkpoints'))
  }

  const addresses = Object.keys(initState)
  async.eachSeries(
    addresses,
    (address: string, done: any) => {
      const account = new Account()
      account.balance = new BN(initState[address]).toArrayLike(Buffer)
      const addressBuffer = toBuffer(address)
      stateManager._trie.put(addressBuffer, account.serialize(), done)
    },
    cb,
  )
}
