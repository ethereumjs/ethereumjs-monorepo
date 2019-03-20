const BN = require('bn.js')

module.exports = class Message {
  constructor (opts) {
    this.to = opts.to
    this.value = opts.value ? new BN(opts.value) : new BN(0)
    this.caller = opts.caller
    this.gas = opts.gasLimit
    this.data = opts.data
    this.depth = opts.depth || 0
    this.code = opts.code
    this.isStatic = opts.isStatic || false
    this.delegatecall = opts.delegatecall || false
  }

  async execute () {
  }
}
