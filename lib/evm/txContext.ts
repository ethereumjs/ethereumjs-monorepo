export default class TxContext {
  gasPrice: Buffer
  origin: Buffer

  constructor(gasPrice: Buffer, origin: Buffer) {
    this.gasPrice = gasPrice
    this.origin = origin
  }
}
