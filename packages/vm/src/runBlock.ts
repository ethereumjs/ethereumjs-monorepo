import { Block } from '@ethereumjs/block'
import { ConsensusType, Hardfork } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { Trie } from '@ethereumjs/trie'
import {
  Account,
  Address,
  GWEI_TO_WEI,
  bigIntToBytes,
  bytesToHex,
  concatBytesNoTypeCheck,
  equalsBytes,
  intToBytes,
  short,
} from '@ethereumjs/util'
import { debug as createDebugLogger } from 'debug'
import { hexToBytes } from 'ethereum-cryptography/utils'

import { Bloom } from './bloom'
import * as DAOConfig from './config/dao_fork_accounts_config.json'

import type {
  AfterBlockEvent,
  PostByzantiumTxReceipt,
  PreByzantiumTxReceipt,
  RunBlockOpts,
  RunBlockResult,
  TxReceipt,
} from './types'
import type { VM } from './vm'
import type { EVM } from '@ethereumjs/evm'

const debug = createDebugLogger('vm:block')

/* DAO account list */
const DAOAccountList = DAOConfig.DAOAccounts
const DAORefundContract = DAOConfig.DAORefundContract

/**
 * @ignore
 */
export async function runBlock(this: VM, opts: RunBlockOpts): Promise<RunBlockResult> {
  const state = this.stateManager
  const { root } = opts
  const clearCache = opts.clearCache ?? true
  let { block } = opts
  const generateFields = opts.generate === true

  /**
   * The `beforeBlock` event.
   *
   * @event Event: beforeBlock
   * @type {Object}
   * @property {Block} block emits the block that is about to be processed
   */
  await this._emit('beforeBlock', block)

  if (
    this._hardforkByBlockNumber ||
    this._hardforkByTTD !== undefined ||
    opts.hardforkByTTD !== undefined
  ) {
    this._common.setHardforkByBlockNumber(
      block.header.number,
      opts.hardforkByTTD ?? this._hardforkByTTD,
      block.header.timestamp
    )
  }

  if (this.DEBUG) {
    debug('-'.repeat(100))
    debug(
      `Running block hash=${bytesToHex(block.hash())} number=${
        block.header.number
      } hardfork=${this._common.hardfork()}`
    )
  }

  // Set state root if provided
  if (root) {
    if (this.DEBUG) {
      debug(`Set provided state root ${bytesToHex(root)} clearCache=${clearCache}`)
    }
    await state.setStateRoot(root, clearCache)
  }

  // check for DAO support and if we should apply the DAO fork
  if (
    this._common.hardforkIsActiveOnBlock(Hardfork.Dao, block.header.number) === true &&
    block.header.number === this._common.hardforkBlock(Hardfork.Dao)!
  ) {
    if (this.DEBUG) {
      debug(`Apply DAO hardfork`)
    }
    await this.evm.journal.checkpoint()
    await _applyDAOHardfork(this.evm)
    await this.evm.journal.commit()
  }

  // Checkpoint state
  await this.evm.journal.checkpoint()
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
        } bytes) receiptsRoot=${bytesToHex(result.receiptsRoot)} receipts=${
          result.receipts.length
        } txResults=${result.results.length}`
      )
    }
  } catch (err: any) {
    await this.evm.journal.revert()
    if (this.DEBUG) {
      debug(`block checkpoint reverted`)
    }
    throw err
  }

  // Persist state
  await this.evm.journal.commit()
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
    const receiptTrie = result.receiptsRoot
    const transactionsTrie = await _genTxTrie(block)
    const generatedFields = { stateRoot, bloom, gasUsed, receiptTrie, transactionsTrie }
    const blockData = {
      ...block,
      header: { ...block.header, ...generatedFields },
    }
    block = Block.fromBlockData(blockData, { common: this._common })
  } else {
    if (equalsBytes(result.receiptsRoot, block.header.receiptTrie) === false) {
      if (this.DEBUG) {
        debug(
          `Invalid receiptTrie received=${bytesToHex(result.receiptsRoot)} expected=${bytesToHex(
            block.header.receiptTrie
          )}`
        )
      }
      const msg = _errorMsg('invalid receiptTrie', this, block)
      throw new Error(msg)
    }
    if (!(equalsBytes(result.bloom.bitvector, block.header.logsBloom) === true)) {
      if (this.DEBUG) {
        debug(
          `Invalid bloom received=${bytesToHex(result.bloom.bitvector)} expected=${bytesToHex(
            block.header.logsBloom
          )}`
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
    if (!(equalsBytes(stateRoot, block.header.stateRoot) === true)) {
      if (this.DEBUG) {
        debug(
          `Invalid stateRoot received=${bytesToHex(stateRoot)} expected=${bytesToHex(
            block.header.stateRoot
          )}`
        )
      }
      const msg = _errorMsg('invalid block stateRoot', this, block)
      throw new Error(msg)
    }
  }

  const results: RunBlockResult = {
    receipts: result.receipts,
    logsBloom: result.bloom.bitvector,
    results: result.results,
    stateRoot,
    gasUsed: result.gasUsed,
    receiptsRoot: result.receiptsRoot,
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
      `Running block finished hash=${bytesToHex(block.hash())} number=${
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
  if (opts.skipBlockValidation !== true) {
    if (block.header.gasLimit >= BigInt('0x8000000000000000')) {
      const msg = _errorMsg('Invalid block with gas limit greater than (2^63 - 1)', this, block)
      throw new Error(msg)
    } else {
      if (this.DEBUG) {
        debug(`Validate block`)
      }
      // TODO: decide what block validation method is appropriate here
      if (opts.skipHeaderValidation !== true) {
        if (typeof (<any>this.blockchain).validateHeader === 'function') {
          await (<any>this.blockchain).validateHeader(block.header)
        } else {
          throw new Error('cannot validate header: blockchain has no `validateHeader` method')
        }
      }
      await block.validateData()
    }
  }
  // Apply transactions
  if (this.DEBUG) {
    debug(`Apply transactions`)
  }
  const blockResults = await applyTransactions.bind(this)(block, opts)
  if (this._common.isActivatedEIP(4895)) {
    await assignWithdrawals.bind(this)(block)
    await this.evm.journal.cleanup()
  }
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
    if (this._common.isActivatedEIP(1559) === true) {
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
    const { skipBalance, skipNonce, skipHardForkValidation } = opts

    const txRes = await this.runTx({
      tx,
      block,
      skipBalance,
      skipNonce,
      skipHardForkValidation,
      blockGasUsed: gasUsed,
    })
    txResults.push(txRes)
    if (this.DEBUG) {
      debug('-'.repeat(100))
    }

    // Add to total block gas usage
    gasUsed += txRes.totalGasSpent
    if (this.DEBUG) {
      debug(`Add tx gas used (${txRes.totalGasSpent}) to total block gas usage (-> ${gasUsed})`)
    }

    // Combine blooms via bitwise OR
    bloom.or(txRes.bloom)

    // Add receipt to trie to later calculate receipt root
    receipts.push(txRes.receipt)
    const encodedReceipt = encodeReceipt(txRes.receipt, tx.type)
    await receiptTrie.put(RLP.encode(txIdx), encodedReceipt)
  }

  return {
    bloom,
    gasUsed,
    receiptsRoot: receiptTrie.root(),
    receipts,
    results: txResults,
  }
}

async function assignWithdrawals(this: VM, block: Block): Promise<void> {
  const withdrawals = block.withdrawals!
  for (const withdrawal of withdrawals) {
    const { address, amount } = withdrawal
    // Withdrawal amount is represented in Gwei so needs to be
    // converted to wei
    // Note: event if amount is 0, still reward the account
    // such that the account is touched and marked for cleanup if it is empty
    await rewardAccount(this.evm, address, amount * GWEI_TO_WEI)
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
  const minerReward = this._common.param('pow', 'minerReward')
  const ommers = block.uncleHeaders
  // Reward ommers
  for (const ommer of ommers) {
    const reward = calculateOmmerReward(ommer.number, block.header.number, minerReward)
    const account = await rewardAccount(this.evm, ommer.coinbase, reward)
    if (this.DEBUG) {
      debug(`Add uncle reward ${reward} to account ${ommer.coinbase} (-> ${account.balance})`)
    }
  }
  // Reward miner
  const reward = calculateMinerReward(minerReward, ommers.length)
  const account = await rewardAccount(this.evm, block.header.coinbase, reward)
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

export async function rewardAccount(evm: EVM, address: Address, reward: bigint): Promise<Account> {
  let account = await evm.stateManager.getAccount(address)
  if (account === undefined) {
    account = new Account()
  }
  account.balance += reward
  await evm.journal.putAccount(address, account)
  return account
}

/**
 * Returns the encoded tx receipt.
 */
export function encodeReceipt(receipt: TxReceipt, txType: number) {
  const encoded = RLP.encode([
    (receipt as PreByzantiumTxReceipt).stateRoot ??
      ((receipt as PostByzantiumTxReceipt).status === 0 ? Uint8Array.from([]) : hexToBytes('01')),
    bigIntToBytes(receipt.cumulativeBlockGasUsed),
    receipt.bitvector,
    receipt.logs,
  ])

  if (txType === 0) {
    return encoded
  }

  // Serialize receipt according to EIP-2718:
  // `typed-receipt = tx-type || receipt-data`
  return concatBytesNoTypeCheck(intToBytes(txType), encoded)
}

/**
 * Apply the DAO fork changes to the VM
 */
async function _applyDAOHardfork(evm: EVM) {
  const state = evm.stateManager
  const DAORefundContractAddress = new Address(hexToBytes(DAORefundContract))
  if ((await state.getAccount(DAORefundContractAddress)) === undefined) {
    await evm.journal.putAccount(DAORefundContractAddress, new Account())
  }
  let DAORefundAccount = await state.getAccount(DAORefundContractAddress)
  if (DAORefundAccount === undefined) {
    DAORefundAccount = new Account()
  }

  for (const addr of DAOAccountList) {
    // retrieve the account and add it to the DAO's Refund accounts' balance.
    const address = new Address(hexToBytes(addr))
    let account = await state.getAccount(address)
    if (account === undefined) {
      account = new Account()
    }
    DAORefundAccount.balance += account.balance
    // clear the accounts' balance
    account.balance = BigInt(0)
    await evm.journal.putAccount(address, account)
  }

  // finally, put the Refund Account
  await evm.journal.putAccount(DAORefundContractAddress, DAORefundAccount)
}

async function _genTxTrie(block: Block) {
  const trie = new Trie()
  for (const [i, tx] of block.transactions.entries()) {
    await trie.put(RLP.encode(i), tx.serialize())
  }
  return trie.root()
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
