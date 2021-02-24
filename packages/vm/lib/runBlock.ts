import { debug as createDebugLogger } from 'debug'
import { encode } from 'rlp'
import { BaseTrie as Trie } from 'merkle-patricia-tree'
import { Account, Address, BN } from 'ethereumjs-util'
import { Block } from '@ethereumjs/block'
import VM from './index'
import Bloom from './bloom'
import { RunTxResult } from './runTx'
import { StateManager } from './state'

import * as DAOConfig from './config/dao_fork_accounts_config.json'
import { Log } from './evm/types'
import { short } from './evm/opcodes'

const debug = createDebugLogger('vm:block')

/* DAO account list */
const DAOAccountList = DAOConfig.DAOAccounts
const DAORefundContract = DAOConfig.DAORefundContract

/**
 * Options for running a block.
 */
export interface RunBlockOpts {
  /**
   * The @ethereumjs/block to process
   */
  block: Block
  /**
   * Root of the state trie
   */
  root?: Buffer
  /**
   * Whether to generate the stateRoot. If `true` `runBlock` will check the
   * `stateRoot` of the block against the current Trie, check the `receiptsTrie`,
   * the `gasUsed` and the `logsBloom` after running. If any does not match,
   * `runBlock` throws.
   * Defaults to `false`.
   */
  generate?: boolean
  /**
   * If true, will skip "Block validation":
   * Block validation validates the header (with respect to the blockchain),
   * the transactions, the transaction trie and the uncle hash.
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
  receipts: (PreByzantiumTxReceipt | PostByzantiumTxReceipt | EIP2930Receipt)[]
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
  logs: Log[]
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

// EIP290Receipt, which has the same fields as PostByzantiumTxReceipt
export interface EIP2930Receipt extends PostByzantiumTxReceipt {}

export interface AfterBlockEvent extends RunBlockResult {
  // The block which just finished processing
  block: Block
}

/**
 * @ignore
 */
export default async function runBlock(this: VM, opts: RunBlockOpts): Promise<RunBlockResult> {
  const state = this.stateManager
  const { root } = opts
  let { block } = opts
  const generateStateRoot = !!opts.generate

  /**
   * The `beforeBlock` event.
   *
   * @event Event: beforeBlock
   * @type {Object}
   * @property {Block} block emits the block that is about to be processed
   */
  await this._emit('beforeBlock', block)

  if (this._hardforkByBlockNumber) {
    this._common.setHardforkByBlockNumber(block.header.number.toNumber())
  }
  debug('-'.repeat(100))
  debug(
    `Running blog hash=${block
      .hash()
      .toString(
        'hex'
      )} number=${block.header.number.toNumber()} hardfork=${this._common.hardfork()}`
  )

  // Set state root if provided
  if (root) {
    debug(`Set provided state root ${root.toString('hex')}`)
    await state.setStateRoot(root)
  }

  // check for DAO support and if we should apply the DAO fork
  if (
    this._common.hardforkIsActiveOnChain('dao') &&
    block.header.number.eq(new BN(this._common.hardforkBlock('dao')))
  ) {
    debug(`Apply DAO hardfork`)
    await _applyDAOHardfork(state)
  }

  // Checkpoint state
  await state.checkpoint()
  debug(`block checkpoint`)

  let result
  try {
    result = await applyBlock.bind(this)(block, opts)
    debug(
      `Received block results gasUsed=${result.gasUsed} bloom=${short(result.bloom.bitvector)} (${
        result.bloom.bitvector.length
      } bytes) receiptRoot=${result.receiptRoot.toString('hex')} receipts=${
        result.receipts.length
      } txResults=${result.results.length}`
    )
  } catch (err) {
    await state.revert()
    debug(`block checkpoint reverted`)
    throw err
  }

  // Persist state
  await state.commit()
  debug(`block checkpoint committed`)

  const stateRoot = await state.getStateRoot(false)

  // Given the generate option, either set resulting header
  // values to the current block, or validate the resulting
  // header values against the current block.
  if (generateStateRoot) {
    const bloom = result.bloom.bitvector
    block = Block.fromBlockData({
      ...block,
      header: { ...block.header, stateRoot, bloom },
    })
  } else {
    if (result.receiptRoot && !result.receiptRoot.equals(block.header.receiptTrie)) {
      debug(
        `Invalid receiptTrie received=${result.receiptRoot.toString(
          'hex'
        )} expected=${block.header.receiptTrie.toString('hex')}`
      )
      throw new Error('invalid receiptTrie')
    }
    if (!result.bloom.bitvector.equals(block.header.bloom)) {
      debug(
        `Invalid bloom received=${result.bloom.bitvector.toString(
          'hex'
        )} expected=${block.header.bloom.toString('hex')}`
      )
      throw new Error('invalid bloom')
    }
    if (!result.gasUsed.eq(block.header.gasUsed)) {
      debug(`Invalid gasUsed received=${result.gasUsed} expected=${block.header.gasUsed}`)
      throw new Error('invalid gasUsed')
    }
    if (!stateRoot.equals(block.header.stateRoot)) {
      debug(
        `Invalid stateRoot received=${stateRoot.toString(
          'hex'
        )} expected=${block.header.stateRoot.toString('hex')}`
      )
      throw new Error('invalid block stateRoot')
    }
  }

  const { receipts, results } = result

  const afterBlockEvent: AfterBlockEvent = {
    receipts,
    results,
    block,
  }

  /**
   * The `afterBlock` event
   *
   * @event Event: afterBlock
   * @type {AfterBlockEvent}
   * @property {AfterBlockEvent} result emits the results of processing a block
   */
  await this._emit('afterBlock', afterBlockEvent)
  debug(
    `Running blog finished hash=${block
      .hash()
      .toString(
        'hex'
      )} number=${block.header.number.toNumber()} hardfork=${this._common.hardfork()}`
  )

  return { receipts, results }
}

/**
 * Validates and applies a block, computing the results of
 * applying its transactions. This method doesn't modify the
 * block itself. It computes the block rewards and puts
 * them on state (but doesn't persist the changes).
 * @param {Block} block
 * @param {RunBlockOpts} opts
 */
async function applyBlock(this: VM, block: Block, opts: RunBlockOpts) {
  // Validate block
  if (!opts.skipBlockValidation) {
    if (block.header.gasLimit.gte(new BN('8000000000000000', 16))) {
      throw new Error('Invalid block with gas limit greater than (2^63 - 1)')
    } else {
      debug(`Validate block`)
      await block.validate(this.blockchain)
    }
  }
  // Apply transactions
  debug(`Apply transactions`)
  const blockResults = await applyTransactions.bind(this)(block, opts)
  // Pay ommers and miners
  if (this._common.consensusType() === 'pow') {
    await assignBlockRewards.bind(this)(block)
  }
  return blockResults
}

/**
 * Applies the transactions in a block, computing the receipts
 * as well as gas usage and some relevant data. This method is
 * side-effect free (it doesn't modify the block nor the state).
 * @param {Block} block
 * @param {RunBlockOpts} opts
 */
async function applyTransactions(this: VM, block: Block, opts: RunBlockOpts) {
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

    const gasLimitIsHigherThanBlock = block.header.gasLimit.lt(tx.gasLimit.add(gasUsed))
    if (gasLimitIsHigherThanBlock) {
      throw new Error('tx has a higher gas limit than the block')
    }

    // Run the tx through the VM
    const { skipBalance, skipNonce } = opts
    const txRes = await this.runTx({
      tx,
      block,
      skipBalance,
      skipNonce,
    })
    txResults.push(txRes)
    debug('-'.repeat(100))

    // Add to total block gas usage
    gasUsed = gasUsed.add(txRes.gasUsed)
    debug(`Add tx gas used (${txRes.gasUsed}) to total block gas usage (-> ${gasUsed})`)
    // Combine blooms via bitwise OR
    bloom.or(txRes.bloom)

    const abstractTxReceipt: TxReceipt = {
      gasUsed: gasUsed.toArrayLike(Buffer),
      bitvector: txRes.bloom.bitvector,
      logs: txRes.execResult.logs || [],
    }
    let txReceipt
    let encodedReceipt
    let receiptLog = `Generate tx receipt gasUsed=${gasUsed} bitvector=${short(
      abstractTxReceipt.bitvector
    )} (${abstractTxReceipt.bitvector.length} bytes) logs=${abstractTxReceipt.logs.length}`
    if (tx.transactionType == 0) {
      receiptLog += 'transactionType=0'
      if (this._common.gteHardfork('byzantium')) {
        txReceipt = {
          status: txRes.execResult.exceptionError ? 0 : 1, // Receipts have a 0 as status on error
          ...abstractTxReceipt,
        } as PostByzantiumTxReceipt
        const statusInfo = txRes.execResult.exceptionError ? 'error' : 'ok'
        receiptLog += ` status=${txReceipt.status} (${statusInfo}) (>= Byzantium)`
      } else {
        const stateRoot = await this.stateManager.getStateRoot(true)
        txReceipt = {
          stateRoot: stateRoot,
          ...abstractTxReceipt,
        } as PreByzantiumTxReceipt
        receiptLog += ` stateRoot=${txReceipt.stateRoot.toString('hex')} (< Byzantium)`
      }
      encodedReceipt = encode(Object.values(txReceipt))
    } else if (tx.transactionType == 1) {
      txReceipt = {
        status: txRes.execResult.exceptionError ? 0 : 1,
        ...abstractTxReceipt,
      } as EIP2930Receipt

      // rlp([status, cumulativeGasUsed, logsBloom, logs])

      encodedReceipt = Buffer.concat([Buffer.from('01', 'hex'), encode(Object.values(txReceipt))])
    } else {
      throw new Error(`Unsupported transaction type ${tx.transactionType}`)
    }
    debug(receiptLog)

    receipts.push(txReceipt)

    // Add receipt to trie to later calculate receipt root
    await receiptTrie.put(encode(txIdx), encodedReceipt)
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
async function assignBlockRewards(this: VM, block: Block): Promise<void> {
  debug(`Assign block rewards`)
  const state = this.stateManager
  const minerReward = new BN(this._common.param('pow', 'minerReward'))
  const ommers = block.uncleHeaders
  // Reward ommers
  for (const ommer of ommers) {
    const reward = calculateOmmerReward(ommer.number, block.header.number, minerReward)
    const account = await rewardAccount(state, ommer.coinbase, reward)
    debug(`Add uncle reward ${reward} to account ${ommer.coinbase} (-> ${account.balance})`)
  }
  // Reward miner
  const reward = calculateMinerReward(minerReward, ommers.length)
  const account = await rewardAccount(state, block.header.coinbase, reward)
  debug(`Add miner reward ${reward} to account ${block.header.coinbase} (-> ${account.balance})`)
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

async function rewardAccount(state: StateManager, address: Address, reward: BN): Promise<Account> {
  const account = await state.getAccount(address)
  account.balance.iadd(reward)
  await state.putAccount(address, account)
  return account
}

// apply the DAO fork changes to the VM
async function _applyDAOHardfork(state: StateManager) {
  const DAORefundContractAddress = new Address(Buffer.from(DAORefundContract, 'hex'))
  if (!state.accountExists(DAORefundContractAddress)) {
    await state.putAccount(DAORefundContractAddress, new Account())
  }
  const DAORefundAccount = await state.getAccount(DAORefundContractAddress)

  for (const addr of DAOAccountList) {
    // retrieve the account and add it to the DAO's Refund accounts' balance.
    const address = new Address(Buffer.from(addr, 'hex'))
    const account = await state.getAccount(address)
    DAORefundAccount.balance.iadd(account.balance)
    // clear the accounts' balance
    account.balance = new BN(0)
    await state.putAccount(address, account)
  }

  // finally, put the Refund Account
  await state.putAccount(DAORefundContractAddress, DAORefundAccount)
}
