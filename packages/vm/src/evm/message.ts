import { Address } from 'ethereumjs-util'
import { PrecompileFunc } from './precompiles'

const defaults = {
  value: BigInt(0),
  caller: Address.zero(),
  data: Buffer.alloc(0),
  depth: 0,
  isStatic: false,
  isCompiled: false,
  delegatecall: false,
}

interface MessageOpts {
  to?: Address
  value?: bigint
  caller?: Address
  gasLimit: bigint
  data?: Buffer
  depth?: number
  code?: Buffer | PrecompileFunc
  codeAddress?: Address
  isStatic?: boolean
  isCompiled?: boolean
  salt?: Buffer
  selfdestruct?: { [key: string]: boolean } | { [key: string]: Buffer }
  delegatecall?: boolean
  authcallOrigin?: Address
}

export default class Message {
  to?: Address
  value: bigint
  caller: Address
  gasLimit: bigint
  data: Buffer
  depth: number
  code?: Buffer | PrecompileFunc
  _codeAddress?: Address
  isStatic: boolean
  isCompiled: boolean
  salt?: Buffer
  selfdestruct?: { [key: string]: boolean } | { [key: string]: Buffer }
  delegatecall: boolean
  /**
   * This is used to store the origin of the AUTHCALL,
   * the purpose is to figure out where `value` should be taken from (not from `caller`)
   */
  authcallOrigin?: Address

  constructor(opts: MessageOpts) {
    this.to = opts.to
    this.value = opts.value ?? defaults.value
    this.caller = opts.caller ?? defaults.caller
    this.gasLimit = opts.gasLimit
    this.data = opts.data ?? defaults.data
    this.depth = opts.depth ?? defaults.depth
    this.code = opts.code
    this._codeAddress = opts.codeAddress
    this.isStatic = opts.isStatic ?? defaults.isStatic
    this.isCompiled = opts.isCompiled ?? defaults.isCompiled
    this.salt = opts.salt
    this.selfdestruct = opts.selfdestruct
    this.delegatecall = opts.delegatecall ?? defaults.delegatecall
    this.authcallOrigin = opts.authcallOrigin

    if (this.value < 0) {
      throw new Error(`value field cannot be negative, received ${this.value}`)
    }
  }

  /**
   * Note: should only be called in instances where `_codeAddress` or `to` is defined.
   */
  get codeAddress(): Address {
    const codeAddress = this._codeAddress ?? this.to
    if (!codeAddress) {
      throw new Error('Missing codeAddress')
    }
    return codeAddress
  }
}

export type MessageWithTo = Message & Pick<Required<MessageOpts>, 'to'>
