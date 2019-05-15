/*

This is the core of the Ethereum Virtual Machine (EVM or just VM).

NOTES:

stack items are lazily duplicated.
So you must never directly change a buffer from the stack,
instead you should `copy` it first

not all stack items are 32 bytes, so if the operation realies on the stack
item length then you must use utils.pad(<item>, 32) first.
*/
import { zeros } from 'ethereumjs-util'
import VM from './index'
import TxContext from './evm/txContext'
import Message from './evm/message'
import { default as Interpreter, ExecResult } from './evm/interpreter'
import { StorageReader } from './state'
const Block = require('ethereumjs-block')

export interface RunCodeOpts {
  block?: any
  storageReader?: StorageReader
  interpreter?: Interpreter
  txContext?: TxContext
  gasPrice?: Buffer
  origin?: Buffer
  message?: Message
  caller?: Buffer
  code?: Buffer
  data?: Buffer
  gasLimit?: Buffer
  value?: Buffer
  depth?: number
  isStatic?: boolean
  selfdestruct?: {[k: string]: boolean}
  address?: Buffer
  pc?: number
}

export interface RunCodeCb {
  (err: Error | null, res: ExecResult | null): void
}

/**
 * Runs EVM code
 * @method vm.runCode
 * @param {Object} opts
 * @param {Account} opts.account the [`Account`](https://github.com/ethereumjs/ethereumjs-account) that the executing code belongs to. If omitted an empty account will be used
 * @param {Buffer} opts.address the address of the account that is executing this code. The address should be a `Buffer` of bytes. Defaults to `0`
 * @param {Block} opts.block the [`Block`](https://github.com/ethereumjs/ethereumjs-block) the `tx` belongs to. If omitted a blank block will be used
 * @param {Buffer} opts.caller the address that ran this code. The address should be a `Buffer` of 20bits. Defaults to `0`
 * @param {Buffer} opts.code the EVM code to run given as a `Buffer`
 * @param {Buffer} opts.data the input data
 * @param {Buffer} opts.gasLimit the gas limit for the code
 * @param {Buffer} opts.origin the address where the call originated from. The address should be a `Buffer` of 20bits. Defaults to `0`
 * @param {Buffer} opts.value the value in ether that is being sent to `opt.address`. Defaults to `0`
 * @param {Number} opts.pc the initial program counter. Defaults to `0`
 * @param {runCode~callback} cb callback
 */

 /**
  * Callback for `runCode` method
  * @callback runCode~callback
  * @param {Error} error an error that may have happened or `null`
  * @param {Object} results
  * @param {BN} results.gas the amount of gas left
  * @param {BN} results.gasUsed the amount of gas as a `bignum` the code used to run
  * @param {BN} results.gasRefund a `bignum` containing the amount of gas to refund from deleting storage values
  * @param {Object} results.selfdestruct an `Object` with keys for accounts that have selfdestructed and values for balance transfer recipient accounts
  * @param {Array} results.logs an `Array` of logs that the contract emitted
  * @param {Number} results.exception `0` if the contract encountered an exception, `1` otherwise
  * @param {String} results.exceptionError a `String` describing the exception if there was one
  * @param {Buffer} results.return a `Buffer` containing the value that was returned by the contract
 */
export default function runCode (this: VM, opts: RunCodeOpts, cb: RunCodeCb): void {
  if (!opts.block) {
    opts.block = new Block()
  }

  if (!opts.storageReader) {
    opts.storageReader = new StorageReader(this.stateManager)
  }

  // Backwards compatibility
  if (!opts.txContext) {
    opts.txContext = new TxContext(opts.gasPrice || Buffer.alloc(0), opts.origin || opts.caller || zeros(32))
  }
  if (!opts.message) {
    opts.message = new Message({
      code: opts.code,
      data: opts.data,
      gasLimit: opts.gasLimit,
      to: opts.address || zeros(32),
      caller: opts.caller,
      value: opts.value,
      depth: opts.depth || 0,
      selfdestruct: opts.selfdestruct || {},
      isStatic: opts.isStatic || false
    })
  }

  let interpreter = opts.interpreter
  if (!interpreter) {
    interpreter = new Interpreter(this, opts.txContext, opts.block, opts.storageReader)
  }

  interpreter.runLoop(opts.message, { pc: opts.pc })
    .then((res) => cb(null, res))
    .catch((err) => cb(err, null))
}
