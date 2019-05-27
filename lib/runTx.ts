import BN = require('bn.js')
import { toBuffer } from 'ethereumjs-util'
import Account from 'ethereumjs-account'
import VM from './index'
import Bloom from './bloom'
import { default as Interpreter, InterpreterResult } from './evm/interpreter'
import Message from './evm/message'
import TxContext from './evm/txContext'
import { StorageReader } from './state'
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
  tx: any // TODO: Update ethereumjs-tx
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
 * Callback for `runTx` method
 */
export interface RunTxCb {
  /**
   * @param error - An error that may have happened or `null`
   * @param results - Results of the execution
   */
  (err: Error | null, results: RunTxResult | null): void
}

/**
 * Execution result of a transaction
 */
export interface RunTxResult extends InterpreterResult {
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
export default function runTx(this: VM, opts: RunTxOpts, cb: RunTxCb) {
  if (typeof opts === 'function' && cb === undefined) {
    cb = opts as RunTxCb
    return cb(new Error('invalid input, opts must be provided'), null)
  }

  // tx is required
  if (!opts.tx) {
    return cb(new Error('invalid input, tx is required'), null)
  }

  // create a reasonable default if no block is given
  if (!opts.block) {
    opts.block = new Block()
  }

  if (new BN(opts.block.header.gasLimit).lt(new BN(opts.tx.gasLimit))) {
    return cb(new Error('tx has a higher gas limit than the block'), null)
  }

  this.stateManager.checkpoint(() => {
    _runTx
      .bind(this)(opts)
      .then(results => {
        this.stateManager.commit(function(err: Error) {
          cb(err, results)
        })
      })
      .catch(err => {
        this.stateManager.revert(function() {
          cb(err, null)
        })
      })
  })
}

async function _runTx(this: VM, opts: RunTxOpts): Promise<RunTxResult> {
  const block = opts.block
  const tx = opts.tx
  const state = new PStateManager(this.stateManager)

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
  let fromAccount = await state.getAccount(tx.from)
  if (!opts.skipBalance && new BN(fromAccount.balance).lt(tx.getUpfrontCost())) {
    throw new Error(
      `sender doesn't have enough funds to send tx. The upfront cost is: ${tx
        .getUpfrontCost()
        .toString()}\
      and the sender's account only has: ${new BN(fromAccount.balance).toString()}`,
    )
  } else if (!opts.skipNonce && !new BN(fromAccount.nonce).eq(new BN(tx.nonce))) {
    throw new Error(
      `the tx doesn't have the correct nonce. account has nonce of: ${new BN(
        fromAccount.nonce,
      ).toString()}\
      tx has nonce of: $new BN(tx.nonce).toString()}`,
    )
  }
  // Update from account's nonce and balance
  fromAccount.nonce = toBuffer(new BN(fromAccount.nonce).addn(1))
  fromAccount.balance = toBuffer(
    new BN(fromAccount.balance).sub(new BN(tx.gasLimit).mul(new BN(tx.gasPrice))),
  )
  await state.putAccount(tx.from, fromAccount)

  /*
   * Execute message
   */
  const txContext = new TxContext(tx.gasPrice, tx.from)
  const message = new Message({
    caller: tx.from,
    gasLimit: gasLimit,
    to: tx.to.toString('hex') !== '' ? tx.to : undefined,
    value: tx.value,
    data: tx.data,
  })
  const storageReader = new StorageReader(this.stateManager)
  const interpreter = new Interpreter(this, txContext, block, storageReader)
  const results = (await interpreter.executeMessage(message)) as RunTxResult

  /*
   * Parse results
   */
  // Generate the bloom for the tx
  results.bloom = txLogsBloom(results.vm.logs)
  // Caculate the total gas used
  results.gasUsed = results.gasUsed.add(basefee)
  // Process any gas refund
  results.gasRefund = results.vm.gasRefund
  if (results.gasRefund) {
    if (results.gasRefund.lt(results.gasUsed.divn(2))) {
      results.gasUsed.isub(results.gasRefund)
    } else {
      results.gasUsed.isub(results.gasUsed.divn(2))
    }
  }
  results.amountSpent = results.gasUsed.mul(new BN(tx.gasPrice))

  // Update sender's balance
  fromAccount = await state.getAccount(tx.from)
  const finalFromBalance = new BN(tx.gasLimit)
    .sub(results.gasUsed)
    .mul(new BN(tx.gasPrice))
    .add(new BN(fromAccount.balance))
  fromAccount.balance = toBuffer(finalFromBalance)
  await state.putAccount(toBuffer(tx.from), fromAccount)

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
  if (results.vm.selfdestruct) {
    const keys = Object.keys(results.vm.selfdestruct)
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
