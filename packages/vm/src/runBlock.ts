import { debug as createDebugLogger } from 'debug'
import { BaseTrie as Trie } from 'merkle-patricia-tree'
import { Account, Address, bigIntToBuffer, bufArrToArr, intToBuffer, short } from 'ethereumjs-util'
import RLP from 'rlp'
import { Block } from '@ethereumjs/block'
import { ConsensusType, Hardfork } from '@ethereumjs/common'
import VM from './index'
import Bloom from './bloom'
import type { RunTxResult } from './runTx'
import type { TxReceipt, PreByzantiumTxReceipt, PostByzantiumTxReceipt } from './types'
import DAOConfig from './config/dao_fork_accounts_config.json'
import { VmState } from './vmState'

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
   * Whether to generate the stateRoot and other related fields.
   * If `true`, `runBlock` will set the fields `stateRoot`, `receiptTrie`, `gasUsed`, and `bloom` (logs bloom) after running the block.
   * If `false`, `runBlock` throws if any fields do not match.
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
  /**
   * For merge transition support, pass the chain TD up to the block being run
   */
  hardforkByTD?: bigint
}

/**
 * Result of {@link runBlock}
 */
export interface RunBlockResult {
  /**
   * Receipts generated for transactions in the block
   */
  receipts: TxReceipt[]
  /**
   * Results of executing the transactions in the block
   */
  results: RunTxResult[]
  /**
   * The stateRoot after executing the block
   */
  stateRoot: Buffer
  /**
   * The gas used after executing the block
   */
  gasUsed: bigint
  /**
   * The bloom filter of the LOGs (events) after executing the block
   */
  logsBloom: Buffer
  /**
   * The receipt root after executing the block
   */
  receiptRoot: Buffer
}

export interface AfterBlockEvent extends RunBlockResult {
  // The block which just finished processing
  block: Block
}

/**
 * @ignore
 */
export default async function runBlock(this: VM, opts: RunBlockOpts): Promise<RunBlockResult> {
  const state = this.vmState
  const { root } = opts
  let { block } = opts
  const generateFields = !!opts.generate

  /**
   * The `beforeBlock` event.
   *
   * @event Event: beforeBlock
   * @type {Object}
   * @property {Block} block emits the block that is about to be processed
   */
  await this._emit('beforeBlock', block)

  if (this._hardforkByBlockNumber || this._hardforkByTD || opts.hardforkByTD) {
    this._common.setHardforkByBlockNumber(
      block.header.number,
      opts.hardforkByTD ?? this._hardforkByTD
    )
  }

  if (this.DEBUG) {
    debug('-'.repeat(100))
    debug(
      `Running block hash=${block.hash().toString('hex')} number=${
        block.header.number
      } hardfork=${this._common.hardfork()}`
    )
  }

  // Set state root if provided
  if (root) {
    if (this.DEBUG) {
      debug(`Set provided state root ${root.toString('hex')}`)
    }
    await state.setStateRoot(root)
  }

  // check for DAO support and if we should apply the DAO fork
  if (
    this._common.hardforkIsActiveOnBlock(Hardfork.Dao, block.header.number) &&
    block.header.number === this._common.hardforkBlock(Hardfork.Dao)!
  ) {
    if (this.DEBUG) {
      debug(`Apply DAO hardfork`)
    }
    await _applyDAOHardfork(state)
  }

  // Checkpoint state
  await state.checkpoint()
  if (this.DEBUG) {
    debug(`block checkpoint`)
  }

  let result
  try {
    result = await applyBlock.bind(this)(block, opts)
    if (this.DEBUG) {
      debug(
        `Received block results gasUsed=${result.gasUsed} bloom=${short(result.bloom.bitvector)} (${
          result.bloom.bitvector.length
        } bytes) receiptRoot=${result.receiptRoot.toString('hex')} receipts=${
          result.receipts.length
        } txResults=${result.results.length}`
      )
    }
  } catch (err: any) {
    await state.revert()
    if (this.DEBUG) {
      debug(`block checkpoint reverted`)
    }
    throw err
  }

  // Persist state
  await state.commit()
  if (this.DEBUG) {
    debug(`block checkpoint committed`)
  }

  const stateRoot = await state.getStateRoot()

  // Given the generate option, either set resulting header
  // values to the current block, or validate the resulting
  // header values against the current block.
  if (generateFields) {
    const bloom = result.bloom.bitvector
    const gasUsed = result.gasUsed
    const receiptTrie = result.receiptRoot
    const transactionsTrie = await _genTxTrie(block)
    const generatedFields = { stateRoot, bloom, gasUsed, receiptTrie, transactionsTrie }
    const blockData = {
      ...block,
      header: { ...block.header, ...generatedFields },
    }
    block = Block.fromBlockData(blockData, { common: this._common })
  } else {
    if (result.receiptRoot && !result.receiptRoot.equals(block.header.receiptTrie)) {
      if (this.DEBUG) {
        debug(
          `Invalid receiptTrie received=${result.receiptRoot.toString(
            'hex'
          )} expected=${block.header.receiptTrie.toString('hex')}`
        )
      }
      const msg = _errorMsg('invalid receiptTrie', this, block)
      throw new Error(msg)
    }
    if (!result.bloom.bitvector.equals(block.header.logsBloom)) {
      if (this.DEBUG) {
        debug(
          `Invalid bloom received=${result.bloom.bitvector.toString(
            'hex'
          )} expected=${block.header.logsBloom.toString('hex')}`
        )
      }
      const msg = _errorMsg('invalid bloom', this, block)
      throw new Error(msg)
    }
    if (result.gasUsed !== block.header.gasUsed) {
      if (this.DEBUG) {
        debug(`Invalid gasUsed received=${result.gasUsed} expected=${block.header.gasUsed}`)
      }
      const msg = _errorMsg('invalid gasUsed', this, block)
      throw new Error(msg)
    }
    if (!stateRoot.equals(block.header.stateRoot)) {
      if (this.DEBUG) {
        debug(
          `Invalid stateRoot received=${stateRoot.toString(
            'hex'
          )} expected=${block.header.stateRoot.toString('hex')}`
        )
      }
      const msg = _errorMsg('invalid block stateRoot', this, block)
      throw new Error(msg)
    }
  }

  const results: RunBlockResult = {
    receipts: result.receipts,
    results: result.results,
    stateRoot,
    gasUsed: result.gasUsed,
    logsBloom: result.bloom.bitvector,
    receiptRoot: result.receiptRoot,
  }

  const afterBlockEvent: AfterBlockEvent = { ...results, block }

  /**
   * The `afterBlock` event
   *
   * @event Event: afterBlock
   * @type {AfterBlockEvent}
   * @property {AfterBlockEvent} result emits the results of processing a block
   */
  await this._emit('afterBlock', afterBlockEvent)
  if (this.DEBUG) {
    debug(
      `Running block finished hash=${block.hash().toString('hex')} number=${
        block.header.number
      } hardfork=${this._common.hardfork()}`
    )
  }

  return results
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
    if (block.header.gasLimit >= BigInt('0x8000000000000000')) {
      const msg = _errorMsg('Invalid block with gas limit greater than (2^63 - 1)', this, block)
      throw new Error(msg)
    } else {
      if (this.DEBUG) {
        debug(`Validate block`)
      }
      await block.validate(this.blockchain)
    }
  }
  // Apply transactions
  if (this.DEBUG) {
    debug(`Apply transactions`)
  }
  const blockResults = await applyTransactions.bind(this)(block, opts)
  // Pay ommers and miners
  if (block._common.consensusType() === ConsensusType.ProofOfWork) {
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
  let gasUsed = BigInt(0)
  const receiptTrie = new Trie()
  const receipts = []
  const txResults = []

  /*
   * Process transactions
   */
  for (let txIdx = 0; txIdx < block.transactions.length; txIdx++) {
    const tx = block.transactions[txIdx]

    let maxGasLimit
    if (this._common.isActivatedEIP(1559)) {
      maxGasLimit = block.header.gasLimit * this._common.param('gasConfig', 'elasticityMultiplier')
    } else {
      maxGasLimit = block.header.gasLimit
    }
    const gasLimitIsHigherThanBlock = maxGasLimit < tx.gasLimit + gasUsed
    if (gasLimitIsHigherThanBlock) {
      const msg = _errorMsg('tx has a higher gas limit than the block', this, block)
      throw new Error(msg)
    }

    // Run the tx through the VM
    const { skipBalance, skipNonce } = opts

    const txRes = await this.runTx({
      tx,
      block,
      skipBalance,
      skipNonce,
      blockGasUsed: gasUsed,
    })
    txResults.push(txRes)
    if (this.DEBUG) {
      debug('-'.repeat(100))
    }

    // Add to total block gas usage
    gasUsed += txRes.gasUsed
    if (this.DEBUG) {
      debug(`Add tx gas used (${txRes.gasUsed}) to total block gas usage (-> ${gasUsed})`)
    }

    // Combine blooms via bitwise OR
    bloom.or(txRes.bloom)

    // Add receipt to trie to later calculate receipt root
    receipts.push(txRes.receipt)
    const encodedReceipt = encodeReceipt(txRes.receipt, tx.type)
    await receiptTrie.put(Buffer.from(RLP.encode(txIdx)), encodedReceipt)
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
  if (this.DEBUG) {
    debug(`Assign block rewards`)
  }
  const state = this.vmState
  const minerReward = this._common.param('pow', 'minerReward')
  const ommers = block.uncleHeaders
  // Reward ommers
  for (const ommer of ommers) {
    const reward = calculateOmmerReward(ommer.number, block.header.number, minerReward)
    const account = await rewardAccount(state, ommer.coinbase, reward)
    if (this.DEBUG) {
      debug(`Add uncle reward ${reward} to account ${ommer.coinbase} (-> ${account.balance})`)
    }
  }
  // Reward miner
  const reward = calculateMinerReward(minerReward, ommers.length)
  const account = await rewardAccount(state, block.header.coinbase, reward)
  if (this.DEBUG) {
    debug(`Add miner reward ${reward} to account ${block.header.coinbase} (-> ${account.balance})`)
  }
}

function calculateOmmerReward(
  ommerBlockNumber: bigint,
  blockNumber: bigint,
  minerReward: bigint
): bigint {
  const heightDiff = blockNumber - ommerBlockNumber
  let reward = ((BigInt(8) - heightDiff) * minerReward) / BigInt(8)
  if (reward < BigInt(0)) {
    reward = BigInt(0)
  }
  return reward
}

export function calculateMinerReward(minerReward: bigint, ommersNum: number): bigint {
  // calculate nibling reward
  const niblingReward = minerReward / BigInt(32)
  const totalNiblingReward = niblingReward * BigInt(ommersNum)
  const reward = minerReward + totalNiblingReward
  return reward
}

export async function rewardAccount(
  state: VmState,
  address: Address,
  reward: bigint
): Promise<Account> {
  const account = await state.getAccount(address)
  account.balance += reward
  await state.putAccount(address, account)
  return account
}

/**
 * Returns the encoded tx receipt.
 */
export function encodeReceipt(receipt: TxReceipt, txType: number) {
  const encoded = Buffer.from(
    RLP.encode(
      bufArrToArr([
        (receipt as PreByzantiumTxReceipt).stateRoot ??
          ((receipt as PostByzantiumTxReceipt).status === 0
            ? Buffer.from([])
            : Buffer.from('01', 'hex')),
        bigIntToBuffer(receipt.gasUsed),
        receipt.bitvector,
        receipt.logs,
      ])
    )
  )

  if (txType === 0) {
    return encoded
  }

  // Serialize receipt according to EIP-2718:
  // `typed-receipt = tx-type || receipt-data`
  return Buffer.concat([intToBuffer(txType), encoded])
}

/**
 * Apply the DAO fork changes to the VM
 */
async function _applyDAOHardfork(state: VmState) {
  const DAORefundContractAddress = new Address(Buffer.from(DAORefundContract, 'hex'))
  if (!state.accountExists(DAORefundContractAddress)) {
    await state.putAccount(DAORefundContractAddress, new Account())
  }
  const DAORefundAccount = await state.getAccount(DAORefundContractAddress)

  for (const addr of DAOAccountList) {
    // retrieve the account and add it to the DAO's Refund accounts' balance.
    const address = new Address(Buffer.from(addr, 'hex'))
    const account = await state.getAccount(address)
    DAORefundAccount.balance += account.balance
    // clear the accounts' balance
    account.balance = BigInt(0)
    await state.putAccount(address, account)
  }

  // finally, put the Refund Account
  await state.putAccount(DAORefundContractAddress, DAORefundAccount)
}

async function _genTxTrie(block: Block) {
  const trie = new Trie()
  for (const [i, tx] of block.transactions.entries()) {
    await trie.put(Buffer.from(RLP.encode(i)), tx.serialize())
  }
  return trie.root
}

/**
 * Internal helper function to create an annotated error message
 *
 * @param msg Base error message
 * @hidden
 */
function _errorMsg(msg: string, vm: VM, block: Block) {
  const blockErrorStr = 'errorStr' in block ? block.errorStr() : 'block'

  const errorMsg = `${msg} (${vm.errorStr()} -> ${blockErrorStr})`
  return errorMsg
}
