import BN = require('bn.js')

export default class Message {
  to: Buffer
  value: BN
  caller: Buffer
  gasLimit: BN
  data: Buffer
  depth: number
  code: Buffer
  _codeAddress: Buffer
  isStatic: boolean
  isCompiled: boolean
  salt: Buffer
  selfdestruct: any
  delegatecall: boolean

  constructor (opts: any) {
    this.to = opts.to
    this.value = opts.value ? new BN(opts.value) : new BN(0)
    this.caller = opts.caller
    this.gasLimit = opts.gasLimit
    this.data = opts.data
    this.depth = opts.depth || 0
    this.code = opts.code
    this._codeAddress = opts.codeAddress
    this.isStatic = opts.isStatic || false
    this.isCompiled = opts.isCompiled || false // For CALLCODE, TODO: Move from here
    this.salt = opts.salt // For CREATE2, TODO: Move from here
    this.selfdestruct = opts.selfdestruct // TODO: Move from here
    this.delegatecall = opts.delegatecall || false
  }

  get codeAddress (): Buffer {
    return this._codeAddress ? this._codeAddress : this.to
  }
}
