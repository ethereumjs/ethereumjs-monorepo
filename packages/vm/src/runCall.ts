import { Address } from 'ethereumjs-util'
import { Block } from '@ethereumjs/block'
import VM from './index'
import TxContext from './evm/txContext'
import Message from './evm/message'
import { default as EVM, EVMResult } from './evm/evm'

/**
 * Options for running a call (or create) operation
 */
export interface RunCallOpts {
  /**
   * The `@ethereumjs/block` the `tx` belongs to. If omitted a default blank block will be used.
   */
  block?: Block
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
   * The gas limit for the call. Defaults to `0xffffff`
   */
  gasLimit?: bigint
  /**
   * The to address. Defaults to the zero address.
   */
  to?: Address
  /**
   * The value in ether that is being sent to `opts.to`. Defaults to `0`
   */
  value?: bigint
  /**
   * The data for the call.
   */
  data?: Buffer
  /**
   * This is for CALLCODE where the code to load is different than the code from the `opts.to` address.
   */
  code?: Buffer
  /**
   * The call depth. Defaults to `0`
   */
  depth?: number
  /**
   * If the code location is a precompile.
   */
  isCompiled?: boolean
  /**
   * If the call should be executed statically. Defaults to false.
   */
  isStatic?: boolean
  /**
   * An optional salt to pass to CREATE2.
   */
  salt?: Buffer
  /**
   * Addresses to selfdestruct. Defaults to none.
   */
  selfdestruct?: { [k: string]: boolean }
  /**
   * Skip balance checks if true. Adds transaction value to balance to ensure execution doesn't fail.
   */
  skipBalance?: boolean
  /**
   * If the call is a DELEGATECALL. Defaults to false.
   */
  delegatecall?: boolean
}

/**
 * @ignore
 */
export default async function runCall(this: VM, opts: RunCallOpts): Promise<EVMResult> {
  const block = opts.block ?? Block.fromBlockData({}, { common: this._common })

  const txContext = new TxContext(
    opts.gasPrice ?? BigInt(0),
    opts.origin ?? opts.caller ?? Address.zero()
  )

  const caller = opts.caller ?? Address.zero()
  const value = opts.value ?? BigInt(0)

  if (opts.skipBalance) {
    // if skipBalance, add `value` to caller balance to ensure sufficient funds
    const callerAccount = await this.stateManager.getAccount(caller)
    callerAccount.balance += value
    await this.stateManager.putAccount(caller, callerAccount)
  }

  const message = new Message({
    caller,
    gasLimit: opts.gasLimit ?? BigInt(0xffffff),
    to: opts.to ?? undefined,
    value,
    data: opts.data,
    code: opts.code,
    depth: opts.depth ?? 0,
    isCompiled: opts.isCompiled ?? false,
    isStatic: opts.isStatic ?? false,
    salt: opts.salt ?? null,
    selfdestruct: opts.selfdestruct ?? {},
    delegatecall: opts.delegatecall ?? false,
  })

  const evm = new EVM(this, txContext, block, {
    common: this._common,
    stateManager: this.stateManager,
  })

  return evm.executeMessage(message)
}
