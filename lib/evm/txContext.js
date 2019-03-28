module.exports = class TxContext {
  constructor (gasPrice, origin) {
    this.gasPrice = gasPrice
    this.origin = origin
  }
}
