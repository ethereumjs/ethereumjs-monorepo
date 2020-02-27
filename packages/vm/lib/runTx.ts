import BN = require('bn.js')
import { toBuffer } from 'ethereumjs-util'
import Account from 'ethereumjs-account'
import { Transaction } from 'ethereumjs-tx'
import VM from './index'
import Bloom from './bloom'
import { default as EVM, EVMResult } from './evm/evm'
import Message from './evm/message'
import TxContext from './evm/txContext'
import PStateManager from './state/promisified'
const Block = require('ethereumjs-block')

/**
 * Options for the `runTx` method.
 */
export interface RunTxOpts {
  /**
   * The block to which the `tx` belongs
   */
  block?: any
  /**
   * A [`Transaction`](https://github.com/ethereum/ethereumjs-tx) to run
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

/**
 * @ignore
 */
export default async function runTx(this: VM, opts: RunTxOpts): Promise<RunTxResult> {
  if (opts === undefined) {
    throw new Error('invalid input, opts must be provided')
  }

  // tx is required
  if (!opts.tx) {
    throw new Error('invalid input, tx is required')
  }

  // create a reasonable default if no block is given
  if (!opts.block) {
    opts.block = new Block()
  }

  if (new BN(opts.block.header.gasLimit).lt(new BN(opts.tx.gasLimit))) {
    throw new Error('tx has a higher gas limit than the block')
  }

  const state = this.pStateManager

  await state.checkpoint()

  try {
    const result = await _runTx.bind(this)(opts)
    await state.commit()
    return result
  } catch (e) {
    await state.revert()
    throw e
  }
}

async function _runTx(this: VM, opts: RunTxOpts): Promise<RunTxResult> {
  const block = opts.block
  const tx = opts.tx
  const state = this.pStateManager

  /**
   * The `beforeTx` event
   *
   * @event Event: beforeTx
   * @type {Object}
   * @property {Transaction} tx emits the Transaction that is about to be processed
   */
  await this._emit('beforeTx', tx)

  // Validate gas limit against base fee
  const basefee = tx.getBaseFee()
  const gasLimit = new BN(tx.gasLimit)
  if (gasLimit.lt(basefee)) {
    throw new Error('base fee exceeds gas limit')
  }
  gasLimit.isub(basefee)

  // Check from account's balance and nonce
  let fromAccount = await state.getAccount(tx.getSenderAddress())
  if (!opts.skipBalance && new BN(fromAccount.balance).lt(tx.getUpfrontCost())) {
    throw new Error(
      `sender doesn't have enough funds to send tx. The upfront cost is: ${tx
        .getUpfrontCost()
        .toString()}` +
        ` and the sender's account only has: ${new BN(fromAccount.balance).toString()}`,
    )
  } else if (!opts.skipNonce && !new BN(fromAccount.nonce).eq(new BN(tx.nonce))) {
    throw new Error(
      `the tx doesn't have the correct nonce. account has nonce of: ${new BN(
        fromAccount.nonce,
      ).toString()} tx has nonce of: ${new BN(tx.nonce).toString()}`,
    )
  }
  // Update from account's nonce and balance
  fromAccount.nonce = toBuffer(new BN(fromAccount.nonce).addn(1))
  fromAccount.balance = toBuffer(
    new BN(fromAccount.balance).sub(new BN(tx.gasLimit).mul(new BN(tx.gasPrice))),
  )
  await state.putAccount(tx.getSenderAddress(), fromAccount)

  /*
   * Execute message
   */
  const txContext = new TxContext(tx.gasPrice, tx.getSenderAddress())
  const message = new Message({
    caller: tx.getSenderAddress(),
    gasLimit: gasLimit,
    to: tx.to.toString('hex') !== '' ? tx.to : undefined,
    value: tx.value,
    data: tx.data,
  })
  state._wrapped._clearOriginalStorageCache()
  const evm = new EVM(this, txContext, block)
  const results = (await evm.executeMessage(message)) as RunTxResult

  /*
   * Parse results
   */
  // Generate the bloom for the tx
  results.bloom = txLogsBloom(results.execResult.logs)
  // Caculate the total gas used
  results.gasUsed = results.gasUsed.add(basefee)
  // Process any gas refund
  const gasRefund = evm._refund
  if (gasRefund) {
    if (gasRefund.lt(results.gasUsed.divn(2))) {
      results.gasUsed.isub(gasRefund)
    } else {
      results.gasUsed.isub(results.gasUsed.divn(2))
    }
  }
  results.amountSpent = results.gasUsed.mul(new BN(tx.gasPrice))

  // Update sender's balance
  fromAccount = await state.getAccount(tx.getSenderAddress())
  const finalFromBalance = new BN(tx.gasLimit)
    .sub(results.gasUsed)
    .mul(new BN(tx.gasPrice))
    .add(new BN(fromAccount.balance))
  fromAccount.balance = toBuffer(finalFromBalance)
  await state.putAccount(toBuffer(tx.getSenderAddress()), fromAccount)

  // Update miner's balance
  const minerAccount = await state.getAccount(block.header.coinbase)
  // add the amount spent on gas to the miner's account
  minerAccount.balance = toBuffer(new BN(minerAccount.balance).add(results.amountSpent))
  if (!new BN(minerAccount.balance).isZero()) {
    await state.putAccount(block.header.coinbase, minerAccount)
  }

  /*
   * Cleanup accounts
   */
  if (results.execResult.selfdestruct) {
    const keys = Object.keys(results.execResult.selfdestruct)
    for (const k of keys) {
      await state.putAccount(Buffer.from(k, 'hex'), new Account())
    }
  }
  await state.cleanupTouchedAccounts()

  /**
   * The `afterTx` event
   *
   * @event Event: afterTx
   * @type {Object}
   * @property {Object} result result of the transaction
   */
  await this._emit('afterTx', results)

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
