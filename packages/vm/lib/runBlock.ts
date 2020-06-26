import { BaseTrie as Trie } from 'merkle-patricia-tree'
import { BN, toBuffer, bufferToInt } from 'ethereumjs-util'
import { encode } from 'rlp'
import VM from './index'
import Bloom from './bloom'
import { RunTxResult } from './runTx'
import { StateManager } from './state/index'

/**
 * Options for running a block.
 */
export interface RunBlockOpts {
  /**
   * The [`Block`](https://github.com/ethereumjs/ethereumjs-block) to process
   */
  block: any
  /**
   * Root of the state trie
   */
  root?: Buffer
  /**
   * Whether to generate the stateRoot. If false `runBlock` will check the
   * stateRoot of the block against the Trie
   */
  generate?: boolean
  /**
   * If true, will skip block validation
   */
  skipBlockValidation?: boolean
  /**
   * If true, skips the nonce check
   */
  skipNonce?: boolean
  /**
   * If true, skips the balance check
   */
  skipBalance?: boolean
}

/**
 * Result of [[runBlock]]
 */
export interface RunBlockResult {
  /**
   * Receipts generated for transactions in the block
   */
  receipts: (PreByzantiumTxReceipt | PostByzantiumTxReceipt)[]
  /**
   * Results of executing the transactions in the block
   */
  results: RunTxResult[]
}

/**
 * Abstract interface with common transaction receipt fields
 */
interface TxReceipt {
  /**
   * Gas used
   */
  gasUsed: Buffer
  /**
   * Bloom bitvector
   */
  bitvector: Buffer
  /**
   * Logs emitted
   */
  logs: any[]
}

/**
 * Pre-Byzantium receipt type with a field
 * for the intermediary state root
 */
export interface PreByzantiumTxReceipt extends TxReceipt {
  /**
   * Intermediary state root
   */
  stateRoot: Buffer
}

/**
 * Receipt type for Byzantium and beyond replacing the intermediary
 * state root field with a status code field (EIP-658)
 */
export interface PostByzantiumTxReceipt extends TxReceipt {
  /**
   * Status of transaction, `1` if successful, `0` if an exception occured
   */
  status: 0 | 1
}

/**
 * @ignore
 */
export default async function runBlock(this: VM, opts: RunBlockOpts): Promise<RunBlockResult> {
  if (opts === undefined) {
    throw new Error('invalid input, opts must be provided')
  }
  if (!opts.block) {
    throw new Error('invalid input, block must be provided')
  }

  const state = this.stateManager
  const block = opts.block
  const generateStateRoot = !!opts.generate

  /**
   * The `beforeBlock` event.
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
    result = await applyBlock.bind(this)(block, opts)
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
    if (
      result.receiptRoot &&
      result.receiptRoot.toString('hex') !== block.header.receiptTrie.toString('hex')
    ) {
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
  await this._emit('afterBlock', {
    receipts: result.receipts,
    results: result.results,
  })

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
async function applyBlock(this: VM, block: any, opts: RunBlockOpts) {
  // Validate block
  if (!opts.skipBlockValidation) {
    if (new BN(block.header.gasLimit).gte(new BN('8000000000000000', 16))) {
      throw new Error('Invalid block with gas limit greater than (2^63 - 1)')
    } else {
      await block.validate(this.blockchain)
    }
  }
  // Apply transactions
  const txResults = await applyTransactions.bind(this)(block, opts)
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
async function applyTransactions(this: VM, block: any, opts: RunBlockOpts) {
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
    const gasLimitIsHigherThanBlock = new BN(block.header.gasLimit).lt(
      new BN(tx.gasLimit).add(gasUsed),
    )
    if (gasLimitIsHigherThanBlock) {
      throw new Error('tx has a higher gas limit than the block')
    }

    // Run the tx through the VM
    const txRes = await this.runTx({
      tx: tx,
      block: block,
      skipBalance: opts.skipBalance,
      skipNonce: opts.skipNonce,
    })
    txResults.push(txRes)

    // Add to total block gas usage
    gasUsed = gasUsed.add(txRes.gasUsed)
    // Combine blooms via bitwise OR
    bloom.or(txRes.bloom)

    const abstractTxReceipt: TxReceipt = {
      gasUsed: gasUsed.toArrayLike(Buffer),
      bitvector: txRes.bloom.bitvector,
      logs: txRes.execResult.logs || [],
    }
    let txReceipt
    if (this._common.gteHardfork('byzantium')) {
      txReceipt = {
        status: txRes.execResult.exceptionError ? 0 : 1, // Receipts have a 0 as status on error
        ...abstractTxReceipt,
      } as PostByzantiumTxReceipt
    } else {
      // This is just using a dummy place holder for the state root right now.
      // Giving the correct intermediary state root would need a too depp intervention
      // into the current checkpointing mechanism which hasn't been considered
      // to be worth it on a HF backport, 2020-06-26
      txReceipt = {
        stateRoot: Buffer.alloc(32),
        ...abstractTxReceipt,
      } as PreByzantiumTxReceipt
    }

    receipts.push(txReceipt)

    // Add receipt to trie to later calculate receipt root
    await receiptTrie.put(encode(txIdx), encode(Object.values(txReceipt)))
  }

  return {
    bloom,
    gasUsed,
    receiptRoot: receiptTrie.root,
    receipts,
    results: txResults,
  }
}

/**
 * Calculates block rewards for miner and ommers and puts
 * the updated balances of their accounts to state.
 */
async function assignBlockRewards(this: VM, block: any): Promise<void> {
  const state = this.stateManager
  const minerReward = new BN(this._common.param('pow', 'minerReward'))
  const ommers = block.uncleHeaders
  // Reward ommers
  for (const ommer of ommers) {
    const reward = calculateOmmerReward(
      new BN(ommer.number),
      new BN(block.header.number),
      minerReward,
    )
    await rewardAccount(state, ommer.coinbase, reward)
  }
  // Reward miner
  const reward = calculateMinerReward(minerReward, ommers.length)
  await rewardAccount(state, block.header.coinbase, reward)
}

function calculateOmmerReward(ommerBlockNumber: BN, blockNumber: BN, minerReward: BN): BN {
  const heightDiff = blockNumber.sub(ommerBlockNumber)
  let reward = new BN(8).sub(heightDiff).mul(minerReward.divn(8))
  if (reward.ltn(0)) {
    reward = new BN(0)
  }
  return reward
}

function calculateMinerReward(minerReward: BN, ommersNum: number): BN {
  // calculate nibling reward
  const niblingReward = minerReward.divn(32)
  const totalNiblingReward = niblingReward.muln(ommersNum)
  const reward = minerReward.add(totalNiblingReward)
  return reward
}

async function rewardAccount(state: StateManager, address: Buffer, reward: BN): Promise<void> {
  const account = await state.getAccount(address)
  account.balance = toBuffer(new BN(account.balance).add(reward))
  await state.putAccount(address, account)
}
