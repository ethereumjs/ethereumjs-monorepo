import BN = require('bn.js')
import { zeros } from 'ethereumjs-util'
import VM from './index'
import TxContext from './evm/txContext'
import Message from './evm/message'
import { default as EVM, EVMResult } from './evm/evm'
const Block = require('ethereumjs-block')

/**
 * Options for running a call (or create) operation
 */
export interface RunCallOpts {
  block?: any
  gasPrice?: Buffer
  origin?: Buffer
  caller?: Buffer
  gasLimit?: Buffer
  to?: Buffer
  value?: Buffer
  data?: Buffer
  /**
   * This is for CALLCODE where the code to load is different than the code from the to account
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
  const block = opts.block || new Block()

  const txContext = new TxContext(
    opts.gasPrice || Buffer.alloc(0),
    opts.origin || opts.caller || zeros(32),
  )
  const message = new Message({
    caller: opts.caller,
    gasLimit: opts.gasLimit ? new BN(opts.gasLimit) : new BN(0xffffff),
    to: opts.to && opts.to.toString('hex') !== '' ? opts.to : undefined,
    value: opts.value,
    data: opts.data,
    code: opts.code,
    depth: opts.depth || 0,
    isCompiled: opts.compiled || false,
    isStatic: opts.static || false,
    salt: opts.salt || null,
    selfdestruct: opts.selfdestruct || {},
    delegatecall: opts.delegatecall || false,
  })

  const evm = new EVM(this, txContext, block)
  return evm.executeMessage(message)
}
