import { debug as createDebugLogger } from 'debug'
import { Address, BN } from 'ethereumjs-util'
import { Block } from '@ethereumjs/block'
import { AccessListItem, AccessListEIP2930Transaction, Transaction } from '@ethereumjs/tx'
import VM from './index'
import Bloom from './bloom'
import { default as EVM, EVMResult } from './evm/evm'
import { short } from './evm/opcodes/util'
import Message from './evm/message'
import TxContext from './evm/txContext'
import { getActivePrecompiles } from './evm/precompiles'
import { EIP2929StateManager } from './state/interface'

const debug = createDebugLogger('vm:tx')
const debugGas = createDebugLogger('vm:tx:gas')

/**
 * Options for the `runTx` method.
 */
export interface RunTxOpts {
  /**
   * The `@ethereumjs/block` the `tx` belongs to. If omitted a default blank block will be used.
   */
  block?: Block
  /**
   * An `@ethereumjs/tx` to run
   */
  tx: Transaction
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
   * The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)
   */
  gasRefund?: BN
}

export interface AfterTxEvent extends RunTxResult {
  /**
   * The transaction which just got finished
   */
  transaction: Transaction
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

  // Ensure we start with a clear warmed accounts Map
  if (this._common.isActivatedEIP(2929)) {
    state.clearWarmedAccounts()
  }

  await state.checkpoint()
  debug('-'.repeat(100))
  debug(`tx checkpoint`)

  // Is it an Access List transaction?
  if (opts.tx.transactionType === 1 && this._common.isActivatedEIP(2929)) {
    if (!this._common.isActivatedEIP(2930)) {
      throw new Error('Cannot run transaction: EIP 2930 is not activated.')
    }

    const castedTx = <AccessListEIP2930Transaction>opts.tx

    castedTx.AccessListJSON.forEach((accessListItem: AccessListItem) => {
      const address = Buffer.from(accessListItem.address.slice(2), 'hex')
      state.addWarmedAddress(address)
      accessListItem.storageKeys.forEach((storageKey: string) => {
        state.addWarmedStorage(address, Buffer.from(storageKey.slice(2), 'hex'))
      })
    })
  }

  try {
    const result = await _runTx.bind(this)(opts)
    await state.commit()
    debug(`tx checkpoint committed`)
    return result
  } catch (e) {
    await state.revert()
    debug(`tx checkpoint reverted`)
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
  debug(`New tx run hash=${opts.tx.hash().toString('hex')} sender=${caller.toString()}`)

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
  debugGas(`Subtracting base fee (${basefee}) from gasLimit (-> ${gasLimit})`)

  // Check from account's balance and nonce
  let fromAccount = await state.getAccount(caller)
  const { nonce, balance } = fromAccount

  if (!opts.skipBalance) {
    const cost = tx.getUpfrontCost()
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

  // Update from account's nonce and balance
  fromAccount.nonce.iaddn(1)
  const txCost = tx.gasLimit.mul(tx.gasPrice)
  fromAccount.balance.isub(txCost)
  await state.putAccount(caller, fromAccount)
  debug(
    `Update fromAccount (caller) nonce (-> ${fromAccount.nonce}) and balance(-> ${fromAccount.balance})`
  )

  /*
   * Execute message
   */
  const txContext = new TxContext(tx.gasPrice, caller)
  const { value, data, to } = tx
  const message = new Message({
    caller,
    gasLimit,
    to,
    value,
    data,
  })
  const evm = new EVM(this, txContext, block)
  debug(
    `Running tx=0x${tx
      .hash()
      .toString('hex')} with caller=${caller.toString()} gasLimit=${gasLimit} to=${
      to ? to.toString() : ''
    } value=${value} data=0x${short(data)}`
  )
  const results = (await evm.executeMessage(message)) as RunTxResult
  debug('-'.repeat(100))
  debug(
    `Received tx results gasUsed=${results.gasUsed} execResult: [ gasUsed=${
      results.gasUsed
    } exceptionError=${
      results.execResult.exceptionError ? results.execResult.exceptionError.error : ''
    } returnValue=${short(results.execResult.returnValue)} gasRefund=${
      results.execResult.gasRefund
    } ]`
  )

  /*
   * Parse results
   */
  // Generate the bloom for the tx
  results.bloom = txLogsBloom(results.execResult.logs)
  debug(`Generated tx bloom with logs=${results.execResult.logs?.length}`)
  // Caculate the total gas used
  results.gasUsed.iadd(basefee)
  debugGas(`tx add baseFee ${basefee} to gasUsed (-> ${results.gasUsed})`)
  // Process any gas refund
  // TODO: determine why the gasRefund from execResult is not used here directly
  let gasRefund = evm._refund
  if (gasRefund.gtn(0)) {
    if (!gasRefund.lt(results.gasUsed.divn(2))) {
      gasRefund = results.gasUsed.divn(2)
    }
    results.gasUsed.isub(gasRefund)
    debug(`Subtract tx gasRefund (${gasRefund}) from gasUsed (-> ${results.gasUsed})`)
  } else {
    debug(`No tx gasRefund`)
  }
  results.amountSpent = results.gasUsed.mul(tx.gasPrice)

  // Update sender's balance
  fromAccount = await state.getAccount(caller)
  const actualTxCost = results.gasUsed.mul(tx.gasPrice)
  const txCostDiff = txCost.sub(actualTxCost)
  fromAccount.balance.iadd(txCostDiff)
  await state.putAccount(caller, fromAccount)
  debug(
    `Refunded txCostDiff (${txCostDiff}) to fromAccount (caller) balance (-> ${fromAccount.balance})`
  )

  // Update miner's balance
  let miner
  if (this._common.consensusType() === 'pow') {
    miner = block.header.coinbase
  } else {
    // Backwards-compatibilty check
    // TODO: can be removed along VM v5 release
    if ('cliqueSigner' in block.header) {
      miner = block.header.cliqueSigner()
    } else {
      miner = Address.zero()
    }
  }
  const minerAccount = await state.getAccount(miner)
  // add the amount spent on gas to the miner's account
  minerAccount.balance.iadd(results.amountSpent)

  // Put the miner account into the state. If the balance of the miner account remains zero, note that
  // the state.putAccount function puts this into the "touched" accounts. This will thus be removed when
  // we clean the touched accounts below in case we are in a fork >= SpuriousDragon
  await state.putAccount(miner, minerAccount)
  debug(`tx update miner account (${miner.toString()}) balance (-> ${minerAccount.balance})`)

  /*
   * Cleanup accounts
   */
  if (results.execResult.selfdestruct) {
    const keys = Object.keys(results.execResult.selfdestruct)
    for (const k of keys) {
      const address = new Address(Buffer.from(k, 'hex'))
      await state.deleteAccount(address)
      debug(`tx selfdestruct on address=${address.toString()}`)
    }
  }
  await state.cleanupTouchedAccounts()
  state.clearOriginalStorageCache()

  /**
   * The `afterTx` event
   *
   * @event Event: afterTx
   * @type {Object}
   * @property {Object} result result of the transaction
   */
  const event: AfterTxEvent = { transaction: tx, ...results }
  await this._emit('afterTx', event)
  debug(`tx run finished hash=${opts.tx.hash().toString('hex')} sender=${caller.toString()}`)

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
