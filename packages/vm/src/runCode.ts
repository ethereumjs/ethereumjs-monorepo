/*

This is the core of the Ethereum Virtual Machine (EVM or just VM).

NOTES:

1. Stack items are lazily duplicated, so you must never directly change a buffer
from the stack, instead you should `copy` it first.

2. Not all stack items are 32 bytes, so if the operation relies on the stack
item length then you must use `utils.pad(<item>, 32)` first.

*/
import { Address } from 'ethereumjs-util'
import { Block } from '@ethereumjs/block'
import VM from './index'
import TxContext from './evm/txContext'
import Message from './evm/message'
import { default as EVM, ExecResult } from './evm/evm'

/**
 * Options for the {@link runCode} method.
 */
export interface RunCodeOpts {
  /**
   * The `@ethereumjs/block` the `tx` belongs to. If omitted a default blank block will be used.
   */
  block?: Block
  /**
   * Pass a custom {@link EVM} to use. If omitted the default {@link EVM} will be used.
   */
  evm?: EVM
  /**
   * The gas price for the call. Defaults to `0`
   */
  gasPrice?: bigint
  /**
   * The address where the call originated from. Defaults to the zero address.
   */
  origin?: Address
  /**
   * The address that ran this code (`msg.sender`). Defaults to the zero address.
   */
  caller?: Address
  /**
   * The EVM code to run.
   */
  code?: Buffer
  /**
   * The input data.
   */
  data?: Buffer
  /**
   * The gas limit for the call.
   */
  gasLimit: bigint
  /**
   * The value in ether that is being sent to `opts.address`. Defaults to `0`
   */
  value?: bigint
  /**
   * The call depth. Defaults to `0`
   */
  depth?: number
  /**
   * If the call should be executed statically. Defaults to false.
   */
  isStatic?: boolean
  /**
   * Addresses to selfdestruct. Defaults to none.
   */
  selfdestruct?: { [k: string]: boolean }
  /**
   * The address of the account that is executing this code (`address(this)`). Defaults to the zero address.
   */
  address?: Address
  /**
   * The initial program counter. Defaults to `0`
   */
  pc?: number
}

/**
 * @ignore
 */
export default function runCode(this: VM, opts: RunCodeOpts): Promise<ExecResult> {
  const block = opts.block ?? Block.fromBlockData({}, { common: this._common })

  const txContext = new TxContext(
    opts.gasPrice ?? BigInt(0),
    opts.origin ?? opts.caller ?? Address.zero()
  )

  const message = new Message({
    code: opts.code,
    data: opts.data,
    gasLimit: opts.gasLimit,
    to: opts.address ?? Address.zero(),
    caller: opts.caller,
    value: opts.value,
    depth: opts.depth ?? 0,
    selfdestruct: opts.selfdestruct ?? {},
    isStatic: opts.isStatic ?? false,
  })

  const evm =
    opts.evm ??
    new EVM(this, txContext, block, { common: this._common, stateManager: this.stateManager })

  return evm.runInterpreter(message, { pc: opts.pc })
}
