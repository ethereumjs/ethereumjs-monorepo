import { Address, BN, toBuffer } from 'ethereumjs-util'
import { Block } from '@ethereumjs/block'
import {
  AccessList,
  AccessListItem,
  AccessListEIP2930Transaction,
  FeeMarketEIP1559Transaction,
  Transaction,
  TypedTransaction,
} from '@ethereumjs/tx'
import VM from './index'
import Bloom from './bloom'
import { default as EVM, EVMResult } from './evm/evm'
import Message from './evm/message'
import TxContext from './evm/txContext'
import { getActivePrecompiles } from './evm/precompiles'
import { EIP2929StateManager } from './state/interface'
import type {
  TxReceipt,
  BaseTxReceipt,
  PreByzantiumTxReceipt,
  PostByzantiumTxReceipt,
  EIP2930Receipt,
  EIP1559Receipt,
} from './types'

/**
 * Options for the `runTx` method.
 */
export interface RunTxOpts {
  /**
   * The `@ethereumjs/block` the `tx` belongs to.
   * If omitted, a default blank block will be used.
   * To obtain an accurate `TxReceipt`, please pass a block
   * with the header field `gasUsed` set to the value
   * prior to this tx being run.
   */
  block?: Block
  /**
   * An `@ethereumjs/tx` to run
   */
  tx: TypedTransaction
  /**
   * If true, skips the nonce check
   */
  skipNonce?: boolean
  /**
   * If true, skips the balance check
   */
  skipBalance?: boolean

  /**
   * If true, skips the validation of the tx's gas limit
   * agains the block's gas limit.
   */
  skipBlockGasLimitValidation?: boolean

  /**
   * If true, adds a generated EIP-2930 access list
   * to the `RunTxResult` returned.
   *
   * Option works with all tx types. EIP-2929 needs to
   * be activated (included in `berlin` HF).
   *
   * Note: if this option is used with a custom `StateManager` implementation
   * the `generateAccessList()` method must be implemented.
   */
  reportAccessList?: boolean

  /**
   * Optional clique Address: if the consensus algorithm is on clique,
   * and this parameter is provided, use this as the beneficiary of transaction fees
   * If it is not provided and the consensus algorithm is clique, instead
   * get it from the block using `cliqueSigner()`
   */
  cliqueBeneficiary?: Address
}

/**
 * Execution result of a transaction
 */
export interface RunTxResult extends EVMResult {
  /**
   * Bloom filter resulted from transaction
   */
  bloom: Bloom

  /**
   * The amount of ether used by this transaction
   */
  amountSpent: BN

  /**
   * The tx receipt
   */
  receipt: TxReceipt

  /**
   * The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)
   */
  gasRefund?: BN

  /**
   * EIP-2930 access list generated for the tx (see `reportAccessList` option)
   */
  accessList?: AccessList
}

export interface AfterTxEvent extends RunTxResult {
  /**
   * The transaction which just got finished
   */
  transaction: TypedTransaction
}

/**
 * @ignore
 */
export default async function runTx(this: VM, opts: RunTxOpts): Promise<RunTxResult> {
  // tx is required
  if (!opts.tx) {
    throw new Error('invalid input, tx is required')
  }

  // create a reasonable default if no block is given
  opts.block = opts.block ?? Block.fromBlockData({}, { common: opts.tx.common })

  if (
    opts.skipBlockGasLimitValidation !== true &&
    opts.block.header.gasLimit.lt(opts.tx.gasLimit)
  ) {
    throw new Error('tx has a higher gas limit than the block')
  }

  // Have to cast as `EIP2929StateManager` to access clearWarmedAccounts
  const state: EIP2929StateManager = <EIP2929StateManager>this.stateManager
  if (opts.reportAccessList && !('generateAccessList' in state)) {
    throw new Error(
      'reportAccessList needs a StateManager implementing the generateAccessList() method'
    )
  }

  // Ensure we start with a clear warmed accounts Map
  if (this._common.isActivatedEIP(2929)) {
    state.clearWarmedAccounts()
  }

  await state.checkpoint()

  // Typed transaction specific setup tasks
  if (opts.tx.transactionType !== 0 && this._common.isActivatedEIP(2718)) {
    // Is it an Access List transaction?
    if (!this._common.isActivatedEIP(2930)) {
      await state.revert()
      throw new Error('Cannot run transaction: EIP 2930 is not activated.')
    }
    if (opts.reportAccessList && !('generateAccessList' in state)) {
      await state.revert()
      throw new Error(
        'StateManager needs to implement generateAccessList() when running with reportAccessList option'
      )
    }
    if (opts.tx.transactionType === 2 && !this._common.isActivatedEIP(1559)) {
      await state.revert()
      throw new Error('Cannot run transaction: EIP 1559 is not activated.')
    }

    const castedTx = <AccessListEIP2930Transaction>opts.tx

    castedTx.AccessListJSON.forEach((accessListItem: AccessListItem) => {
      const address = toBuffer(accessListItem.address)
      state.addWarmedAddress(address)
      accessListItem.storageKeys.forEach((storageKey: string) => {
        state.addWarmedStorage(address, toBuffer(storageKey))
      })
    })
  }

  try {
    const result = await _runTx.bind(this)(opts)
    await state.commit()
    if (this._common.isActivatedEIP(2929) && opts.reportAccessList) {
      const { tx } = opts
      // Do not include sender address in access list
      const removed = [tx.getSenderAddress()]
      // Only include to address on present storage slot accesses
      const onlyStorage = tx.to ? [tx.to] : []
      result.accessList = state.generateAccessList!(removed, onlyStorage)
    }
    return result
  } catch (e) {
    await state.revert()
    throw e
  } finally {
    if (this._common.isActivatedEIP(2929)) {
      state.clearWarmedAccounts()
    }
  }
}

async function _runTx(this: VM, opts: RunTxOpts): Promise<RunTxResult> {
  // Casted as `any` to access the EIP2929 methods
  const state: any = this.stateManager
  const { tx, block } = opts

  if (!block) {
    throw new Error('block required')
  }

  /**
   * The `beforeTx` event
   *
   * @event Event: beforeTx
   * @type {Object}
   * @property {Transaction} tx emits the Transaction that is about to be processed
   */
  await this._emit('beforeTx', tx)

  const caller = tx.getSenderAddress()

  if (this._common.isActivatedEIP(2929)) {
    // Add origin and precompiles to warm addresses
    getActivePrecompiles(this._common).forEach((address: Address) =>
      state.addWarmedAddress(address.buf)
    )
    state.addWarmedAddress(caller.buf)
    if (tx.to) {
      // Note: in case we create a contract, we do this in EVMs `_executeCreate` (this is also correct in inner calls, per the EIP)
      state.addWarmedAddress(tx.to.buf)
    }
  }

  // Validate gas limit against base fee
  const basefee = tx.getBaseFee()
  const gasLimit = tx.gasLimit.clone()
  if (gasLimit.lt(basefee)) {
    throw new Error('base fee exceeds gas limit')
  }
  gasLimit.isub(basefee)

  // Check from account's balance and nonce
  let fromAccount = await state.getAccount(caller)
  const { nonce, balance } = fromAccount

  if (!opts.skipBalance) {
    const cost = tx.getUpfrontCost(block.header.baseFeePerGas)
    if (balance.lt(cost)) {
      throw new Error(
        `sender doesn't have enough funds to send tx. The upfront cost is: ${cost} and the sender's account only has: ${balance}`
      )
    }
  } else if (!opts.skipNonce) {
    if (!nonce.eq(tx.nonce)) {
      throw new Error(
        `the tx doesn't have the correct nonce. account has nonce of: ${nonce} tx has nonce of: ${tx.nonce}`
      )
    }
  }

  let gasPrice
  let inclusionFeePerGas
  // EIP-1559 tx
  if (tx.transactionType === 2) {
    const baseFee = block.header.baseFeePerGas
    inclusionFeePerGas = BN.min(
      (<FeeMarketEIP1559Transaction>tx).maxInclusionFeePerGas,
      (<FeeMarketEIP1559Transaction>tx).maxFeePerGas.sub(baseFee!)
    )
    gasPrice = inclusionFeePerGas.add(baseFee!)
  } else {
    // Have to cast it as legacy transaction: EIP1559 transaction does not have gas price
    gasPrice = (<Transaction>tx).gasPrice
    if (this._common.isActivatedEIP(1559)) {
      const baseFee = block.header.baseFeePerGas
      inclusionFeePerGas = (<Transaction>tx).gasPrice.sub(baseFee!)
    }
  }

  // Update from account's nonce and balance
  fromAccount.nonce.iaddn(1)
  const txCost = tx.gasLimit.mul(gasPrice)
  fromAccount.balance.isub(txCost)
  await state.putAccount(caller, fromAccount)

  /*
   * Execute message
   */
  const txContext = new TxContext(gasPrice, caller)
  const { value, data, to } = tx
  const message = new Message({
    caller,
    gasLimit,
    to,
    value,
    data,
  })
  const evm = new EVM(this, txContext, block)

  const results = (await evm.executeMessage(message)) as RunTxResult

  /*
   * Parse results
   */
  // Generate the bloom for the tx
  results.bloom = txLogsBloom(results.execResult.logs)

  // Caculate the total gas used
  results.gasUsed.iadd(basefee)

  // Process any gas refund
  // TODO: determine why the gasRefund from execResult is not used here directly
  let gasRefund = evm._refund
  const maxRefundQuotient = this._common.param('gasConfig', 'maxRefundQuotient')
  if (!gasRefund.isZero()) {
    const maxRefund = results.gasUsed.divn(maxRefundQuotient)
    gasRefund = BN.min(gasRefund, maxRefund)
    results.gasUsed.isub(gasRefund)
  }
  results.amountSpent = results.gasUsed.mul(gasPrice)

  // Update sender's balance
  fromAccount = await state.getAccount(caller)
  const actualTxCost = results.gasUsed.mul(gasPrice)
  const txCostDiff = txCost.sub(actualTxCost)
  fromAccount.balance.iadd(txCostDiff)
  await state.putAccount(caller, fromAccount)

  // Update miner's balance
  let miner
  if (this._common.consensusType() === 'pow') {
    miner = block.header.coinbase
  } else {
    // Backwards-compatibilty check
    // TODO: can be removed along VM v5 release
    if (opts.cliqueBeneficiary) {
      miner = opts.cliqueBeneficiary
    } else {
      if ('cliqueSigner' in block.header) {
        miner = block.header.cliqueSigner()
      } else {
        miner = Address.zero()
      }
    }
  }
  const minerAccount = await state.getAccount(miner)
  // add the amount spent on gas to the miner's account

  if (this._common.isActivatedEIP(1559)) {
    minerAccount.balance.iadd(results.gasUsed.mul(<BN>inclusionFeePerGas))
  } else {
    minerAccount.balance.iadd(results.amountSpent)
  }

  // Put the miner account into the state. If the balance of the miner account remains zero, note that
  // the state.putAccount function puts this into the "touched" accounts. This will thus be removed when
  // we clean the touched accounts below in case we are in a fork >= SpuriousDragon
  await state.putAccount(miner, minerAccount)

  /*
   * Cleanup accounts
   */
  if (results.execResult.selfdestruct) {
    const keys = Object.keys(results.execResult.selfdestruct)
    for (const k of keys) {
      const address = new Address(Buffer.from(k, 'hex'))
      await state.deleteAccount(address)
    }
  }
  await state.cleanupTouchedAccounts()
  state.clearOriginalStorageCache()

  // Generate the tx receipt
  const blockGasUsed = block.header.gasUsed.add(results.gasUsed)
  results.receipt = await generateTxReceipt.bind(this)(tx, results, blockGasUsed)

  /**
   * The `afterTx` event
   *
   * @event Event: afterTx
   * @type {Object}
   * @property {Object} result result of the transaction
   */
  const event: AfterTxEvent = { transaction: tx, ...results }
  await this._emit('afterTx', event)

  return results
}

/**
 * @method txLogsBloom
 * @private
 */
function txLogsBloom(logs?: any[]): Bloom {
  const bloom = new Bloom()
  if (logs) {
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i]
      // add the address
      bloom.add(log[0])
      // add the topics
      const topics = log[1]
      for (let q = 0; q < topics.length; q++) {
        bloom.add(topics[q])
      }
    }
  }
  return bloom
}

/**
 * Returns the tx receipt.
 * @param this The vm instance
 * @param tx The transaction
 * @param txResult The tx result
 * @param blockGasUsed The amount of gas used in the block up until this tx
 */
export async function generateTxReceipt(
  this: VM,
  tx: TypedTransaction,
  txResult: RunTxResult,
  blockGasUsed: BN
): Promise<TxReceipt> {
  const baseReceipt: BaseTxReceipt = {
    gasUsed: blockGasUsed.toArrayLike(Buffer),
    bitvector: txResult.bloom.bitvector,
    logs: txResult.execResult.logs ?? [],
  }

  let receipt

  if (!('transactionType' in tx) || tx.transactionType === 0) {
    // Legacy transaction
    if (this._common.gteHardfork('byzantium')) {
      // Post-Byzantium
      receipt = {
        status: txResult.execResult.exceptionError ? 0 : 1, // Receipts have a 0 as status on error
        ...baseReceipt,
      } as PostByzantiumTxReceipt
    } else {
      // Pre-Byzantium
      const stateRoot = await this.stateManager.getStateRoot(true)
      receipt = {
        stateRoot: stateRoot,
        ...baseReceipt,
      } as PreByzantiumTxReceipt
    }
  } else if ('transactionType' in tx && tx.transactionType === 1) {
    // EIP2930 Transaction
    receipt = {
      status: txResult.execResult.exceptionError ? 0 : 1,
      ...baseReceipt,
    } as EIP2930Receipt
  } else if ('transactionType' in tx && tx.transactionType === 2) {
    // EIP1559 Transaction
    receipt = {
      status: txResult.execResult.exceptionError ? 0 : 1,
      ...baseReceipt,
    } as EIP1559Receipt
  } else {
    throw new Error(
      `Unsupported transaction type ${'transactionType' in tx ? tx.transactionType : 'NaN'}`
    )
  }

  return receipt
}
