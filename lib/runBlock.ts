import BN = require('bn.js')
import { toBuffer, bufferToInt } from 'ethereumjs-util'
import { encode } from 'rlp'
import VM from './index'
import Bloom from './bloom'
import { RunTxResult } from './runTx'
import PStateManager from './state/promisified'
const promisify = require('util.promisify')
const Trie = require('merkle-patricia-tree')

export interface RunBlockOpts {
  block: any
  root?: Buffer
  generate?: boolean
  skipBlockValidation?: boolean
}

export interface RunBlockCb {
  (err: Error | null, result: RunBlockResult | null): void
}

export interface RunBlockResult {
  receipts: TxReceipt[]
  results: RunTxResult[]
}

export interface TxReceipt {
  status: 0 | 1
  gasUsed: Buffer
  bitvector: Buffer
  logs: any[]
}

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
export default function runBlock (this: VM, opts: RunBlockOpts, cb: RunBlockCb): void {
  if (typeof opts === 'function' && cb === undefined) {
    cb = opts as RunBlockCb
    return cb(new Error('invalid input, opts must be provided'), null)
  }
  if (!opts.block) {
    return cb(new Error('invalid input, block must be provided'), null)
  }

  _runBlock.bind(this)(opts)
    .then((results) => cb(null, results))
    .catch((err) => cb(err, null))
}

async function _runBlock (this: VM, opts: RunBlockOpts): Promise<RunBlockResult> {
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
    if (bufferToInt(block.header.gasUsed) !== Number(result.gasUsed)) {
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

  return { receipts: result.receipts, results: result.results }
}

/**
 * Validates and applies a block, computing the results of
 * applying its transactions. This method doesn't modify the
 * block itself. It computes the block rewards and puts
 * them on state (but doesn't persist the changes).
 * @param {Block} block
 * @param {Boolean} [skipBlockValidation=false]
 */
async function applyBlock (this: VM, block: any, skipBlockValidation = false) {
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
  const txResults = await applyTransactions.bind(this)(block)
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
async function applyTransactions (this: VM, block: any) {
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

    const txReceipt: TxReceipt = {
      status: txRes.vm.exception ? 1 : 0, // result.vm.exception is 0 when an exception occurs, and 1 when it doesn't.  TODO make this the opposite
      gasUsed: gasUsed.toArrayLike(Buffer),
      bitvector: txRes.bloom.bitvector,
      logs: txRes.vm.logs || []
    }
    receipts.push(txReceipt)

    // Add receipt to trie to later calculate receipt root
    await promisify(receiptTrie.put).bind(receiptTrie)(encode(txIdx), encode(Object.values(txReceipt)))
  }

  return { bloom, gasUsed, receiptRoot: receiptTrie.root, receipts, results: txResults }
}

/**
 * Calculates block rewards for miner and ommers and puts
 * the updated balances of their accounts to state.
 */
async function assignBlockRewards (this: VM, block: any): Promise<void> {
  const state = new PStateManager(this.stateManager)
  const minerReward = new BN(this._common.param('pow', 'minerReward'))
  const ommers = block.uncleHeaders
  // Reward ommers
  for (let ommer of ommers) {
    const reward = calculateOmmerReward(new BN(ommer.number), new BN(block.header.number), minerReward)
    await rewardAccount(state, ommer.coinbase, reward)
  }
  // Reward miner
  const reward = calculateMinerReward(minerReward, ommers.length)
  await rewardAccount(state, block.header.coinbase, reward)
}

function calculateOmmerReward (ommerBlockNumber: BN, blockNumber: BN, minerReward: BN): BN {
  const heightDiff = blockNumber.sub(ommerBlockNumber)
  let reward = ((new BN(8)).sub(heightDiff)).mul(minerReward.divn(8))
  if (reward.ltn(0)) {
    reward = new BN(0)
  }
  return reward
}

function calculateMinerReward (minerReward: BN, ommersNum: number): BN {
  // calculate nibling reward
  const niblingReward = minerReward.divn(32)
  const totalNiblingReward = niblingReward.muln(ommersNum)
  const reward = minerReward.add(totalNiblingReward)
  return reward
}

async function rewardAccount (state: PStateManager, address: Buffer, reward: BN): Promise<void> {
  const account = await state.getAccount(address)
  account.balance = toBuffer(new BN(account.balance).add(reward))
  await state.putAccount(address, account)
}
