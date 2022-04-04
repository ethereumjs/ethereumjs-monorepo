import { Address } from 'ethereumjs-util'
import { PrecompileFunc } from './precompiles'

export default class Message {
  to: Address
  value: bigint
  caller: Address
  gasLimit: bigint
  data: Buffer
  depth: number
  code: Buffer | PrecompileFunc
  _codeAddress: Address
  isStatic: boolean
  isCompiled: boolean
  salt: Buffer
  selfdestruct: any
  delegatecall: boolean
  /**
   * This is used to store the origin of the AUTHCALL,
   * the purpose is to figure out where `value` should be taken from (not from `caller`)
   */
  authcallOrigin?: Address

  constructor(opts: any) {
    this.to = opts.to
    this.value = opts.value ? opts.value : BigInt(0)
    this.caller = opts.caller
    this.gasLimit = opts.gasLimit
    this.data = opts.data || Buffer.alloc(0)
    this.depth = opts.depth || 0
    this.code = opts.code
    this._codeAddress = opts.codeAddress
    this.isStatic = opts.isStatic || false
    this.isCompiled = opts.isCompiled || false // For CALLCODE, TODO: Move from here
    this.salt = opts.salt // For CREATE2, TODO: Move from here
    this.selfdestruct = opts.selfdestruct // TODO: Move from here
    this.delegatecall = opts.delegatecall || false
    this.authcallOrigin = opts.authcallOrigin

    if (this.value < 0) {
      throw new Error(`value field cannot be negative, received ${this.value}`)
    }
  }

  get codeAddress(): Address {
    return this._codeAddress ? this._codeAddress : this.to
  }
}
