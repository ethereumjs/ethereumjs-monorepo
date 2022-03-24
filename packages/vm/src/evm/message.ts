import { Address } from 'ethereumjs-util'
import { PrecompileFunc } from './precompiles'

interface MessageOpts {
  to?: Address
  value?: bigint
  caller: Address
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
}

export type MessageWithTo = Message & Pick<Required<Message>, 'to'>
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

  constructor(opts: MessageOpts) {
    const defaults = {
      value: BigInt(0),
      data: Buffer.alloc(0),
      depth: 0,
      isStatic: false,
      isCompiled: false,
      delegatecall: false,
    }

    this.to = opts.to
    this.value = opts.value ?? defaults.value
    this.caller = opts.caller ?? Address.zero()
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

    if (this.value < 0) {
      throw new Error(`value field cannot be negative, received ${this.value}`)
    }
  }

  get codeAddress(): Address {
    return this._codeAddress ?? this.to!
  }
}
