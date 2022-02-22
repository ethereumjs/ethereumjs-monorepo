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
  block?: Block
  gasPrice?: bigint
  origin?: Address
  caller?: Address
  gasLimit?: bigint
  to?: Address
  value?: bigint
  data?: Buffer
  /**
   * This is for CALLCODE where the code to load is different than the code from the `opts.to` address.
   */
  code?: Buffer
  depth?: number
  compiled?: boolean
  static?: boolean
  salt?: Buffer
  selfdestruct?: { [k: string]: boolean }
  delegatecall?: boolean
}

/**
 * @ignore
 */
export default function runCall(this: VM, opts: RunCallOpts): Promise<EVMResult> {
  const block = opts.block ?? Block.fromBlockData({}, { common: this._common })

  const txContext = new TxContext(
    opts.gasPrice ?? BigInt(0),
    opts.origin ?? opts.caller ?? Address.zero()
  )

  const message = new Message({
    caller: opts.caller ?? Address.zero(),
    gasLimit: opts.gasLimit ?? BigInt(0xffffff),
    to: opts.to ?? undefined,
    value: opts.value,
    data: opts.data,
    code: opts.code,
    depth: opts.depth ?? 0,
    isCompiled: opts.compiled ?? false,
    isStatic: opts.static ?? false,
    salt: opts.salt ?? null,
    selfdestruct: opts.selfdestruct ?? {},
    delegatecall: opts.delegatecall ?? false,
  })

  const evm = new EVM(this, txContext, block)

  return evm.executeMessage(message)
}
