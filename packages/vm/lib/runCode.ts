/*

This is the core of the Ethereum Virtual Machine (EVM or just VM).

NOTES:

stack items are lazily duplicated.
So you must never directly change a buffer from the stack,
instead you should `copy` it first

not all stack items are 32 bytes, so if the operation relies on the stack
item length then you must use utils.pad(<item>, 32) first.
*/
import { zeros } from 'ethereumjs-util'
import VM from './index'
import TxContext from './evm/txContext'
import Message from './evm/message'
import { default as EVM, ExecResult } from './evm/evm'
const Block = require('ethereumjs-block')

/**
 * Options for the [[runCode]] method.
 */
export interface RunCodeOpts {
  /**
   * The [`Block`](https://github.com/ethereumjs/ethereumjs-block) the `tx` belongs to. If omitted a blank block will be used
   */
  block?: any
  evm?: EVM
  txContext?: TxContext
  gasPrice?: Buffer
  /**
   * The address where the call originated from. The address should be a `Buffer` of 20 bits. Defaults to `0`
   */
  origin?: Buffer
  message?: Message
  /**
   * The address that ran this code. The address should be a `Buffer` of 20 bits. Defaults to `0`
   */
  caller?: Buffer
  /**
   * The EVM code to run
   */
  code?: Buffer
  /**
   * The input data
   */
  data?: Buffer
  /**
   * Gas limit
   */
  gasLimit?: Buffer
  /**
   * The value in ether that is being sent to `opt.address`. Defaults to `0`
   */
  value?: Buffer
  depth?: number
  isStatic?: boolean
  selfdestruct?: { [k: string]: boolean }
  /**
   * The address of the account that is executing this code. The address should be a `Buffer` of bytes. Defaults to `0`
   */
  address?: Buffer
  /**
   * The initial program counter. Defaults to `0`
   */
  pc?: number
}

/**
 * @ignore
 */
export default function runCode(this: VM, opts: RunCodeOpts): Promise<ExecResult> {
  if (!opts.block) {
    opts.block = new Block()
  }

  // Backwards compatibility
  if (!opts.txContext) {
    opts.txContext = new TxContext(
      opts.gasPrice || Buffer.alloc(0),
      opts.origin || opts.caller || zeros(32),
    )
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
      isStatic: opts.isStatic || false,
    })
  }

  let evm = opts.evm
  if (!evm) {
    evm = new EVM(this, opts.txContext, opts.block)
  }

  return evm.runInterpreter(opts.message, { pc: opts.pc })
}
