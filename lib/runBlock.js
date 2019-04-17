const promisify = require('util.promisify')
const ethUtil = require('ethereumjs-util')
const Bloom = require('./bloom').default
const rlp = ethUtil.rlp
const Trie = require('merkle-patricia-tree')
const BN = ethUtil.BN
const PStateManager = require('./state/promisified').default

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
    cb = opts
    return cb(new Error('invalid input, opts must be provided'))
  }
  if (!opts.block) {
    return cb(new Error('invalid input, block must be provided'))
  }

  _runBlock.bind(this)(opts)
    .then((results) => cb(null, results))
    .catch(cb)
}

async function _runBlock (opts) {
  const state = new PStateManager(this.stateManager)
  const block = opts.block
  const generateStateRoot = !!opts.generate

  /**
   * The `beforeBlock` event
   *
   * @event Event: beforeBlock
   * @type {Object}
   * @property {Block} block emits the block that is about to be processed
   */
  await this._emit('beforeBlock', opts.block)

  // Set state root if provided
  if (opts.root) {
    await state.setStateRoot(opts.root)
  }

  // Checkpoint state
  await state.checkpoint()
  let result
  try {
    result = await applyBlock.bind(this)(block, opts.skipBlockValidation)
  } catch (err) {
    await state.revert()
    throw err
  }

  // Persist state
  await state.commit()
  const stateRoot = await state.getStateRoot()

  // Given the generate option, either set resulting header
  // values to the current block, or validate the resulting
  // header values against the current block.
  if (generateStateRoot) {
    block.header.stateRoot = stateRoot
    block.header.bloom = result.bloom.bitvector
  } else {
    if (result.receiptRoot && result.receiptRoot.toString('hex') !== block.header.receiptTrie.toString('hex')) {
      throw new Error('invalid receiptTrie ')
    }
    if (result.bloom.bitvector.toString('hex') !== block.header.bloom.toString('hex')) {
      throw new Error('invalid bloom ')
    }
    if (ethUtil.bufferToInt(block.header.gasUsed) !== Number(result.gasUsed)) {
      throw new Error('invalid gasUsed ')
    }
    if (stateRoot.toString('hex') !== block.header.stateRoot.toString('hex')) {
      throw new Error('invalid block stateRoot ')
    }
  }

  /**
   * The `afterBlock` event
   *
   * @event Event: afterBlock
   * @type {Object}
   * @property {Object} result emits the results of processing a block
   */
  await this._emit('afterBlock', { receipts: result.receipts, results: result.results })

  return result
}

/**
 * Validates and applies a block, computing the results of
 * applying its transactions. This method doesn't modify the
 * block itself. It computes the block rewards and puts
 * them on state (but doesn't persist the changes).
 * @param {Block} block
 * @param {Boolean} [skipBlockValidation=false]
 */
async function applyBlock (block, skipBlockValidation = false) {
  const state = new PStateManager(this.stateManager)
  // Validate block
  if (!skipBlockValidation) {
    if (new BN(block.header.gasLimit).gte(new BN('8000000000000000', 16))) {
      throw new Error('Invalid block with gas limit greater than (2^63 - 1)')
    } else {
      await promisify(block.validate).bind(block)(this.blockchain)
    }
  }
  // Apply transactions
  const txResults = await applyTransactions.bind(this)(block, state)
  // Pay ommers and miners
  await assignBlockRewards.bind(this)(block)
  return txResults
}

/**
 * Applies the transactions in a block, computing the receipts
 * as well as gas usage and some relevant data. This method is
 * side-effect free (it doesn't modify the block nor the state).
 * @param {Block} block
 */
async function applyTransactions (block) {
  const bloom = new Bloom()
  // the total amount of gas used processing these transactions
  let gasUsed = new BN(0)
  const receiptTrie = new Trie()
  const receipts = []
  const txResults = []

  /*
   * Process transactions
   */
  for (let txIdx = 0; txIdx < block.transactions.length; txIdx++) {
    const tx = block.transactions[txIdx]
    const gasLimitIsHigherThanBlock = new BN(block.header.gasLimit).lt(new BN(tx.gasLimit).add(gasUsed))
    if (gasLimitIsHigherThanBlock) {
      throw new Error('tx has a higher gas limit than the block')
    }

    // Run the tx through the VM
    let txRes = await promisify(this.runTx).bind(this)({ tx: tx, block: block })
    txResults.push(txRes)

    // Add to total block gas usage
    gasUsed = gasUsed.add(txRes.gasUsed)
    // Combine blooms via bitwise OR
    bloom.or(txRes.bloom)

    const txReceipt = {
      status: txRes.vm.exception ? 1 : 0, // result.vm.exception is 0 when an exception occurs, and 1 when it doesn't.  TODO make this the opposite
      gasUsed: gasUsed.toArrayLike(Buffer),
      bitvector: txRes.bloom.bitvector,
      logs: txRes.vm.logs || []
    }
    receipts.push(txReceipt)

    // Add receipt to trie to later calculate receipt root
    await promisify(receiptTrie.put).bind(receiptTrie)(rlp.encode(txIdx), rlp.encode(Object.values(txReceipt)))
  }

  return { bloom, gasUsed, receiptRoot: receiptTrie.root, receipts, results: txResults }
}

/**
 * Calculates block rewards for miner and ommers and puts
 * the updated balances of their accounts to state.
 */
async function assignBlockRewards (block) {
  const state = new PStateManager(this.stateManager)
  const minerReward = new BN(this._common.param('pow', 'minerReward'))
  const ommers = block.uncleHeaders
  // Reward ommers
  for (let ommer of ommers) {
    const reward = calculateOmmerReward(ommer, block.header.number, minerReward)
    await rewardAccount(state, ommer.coinbase, reward)
  }
  // Reward miner
  const reward = calculateMinerReward(minerReward, ommers)
  await rewardAccount(state, block.header.coinbase, reward)
}

function calculateOmmerReward (ommer, blockNumber, minerReward) {
  const heightDiff = new BN(blockNumber).sub(new BN(ommer.number))
  let reward = ((new BN(8)).sub(heightDiff)).mul(minerReward.divn(8))
  if (reward.ltn(0)) {
    reward = new BN(0)
  }
  return reward
}

function calculateMinerReward (minerReward, ommers) {
  // calculate nibling reward
  const niblingReward = minerReward.divn(32)
  const totalNiblingReward = niblingReward.muln(ommers.length)
  const reward = minerReward.add(totalNiblingReward)
  return reward
}

async function rewardAccount (state, address, reward, done) {
  const account = await state.getAccount(address)
  account.balance = new BN(account.balance).add(reward)
  await state.putAccount(address, account)
}
