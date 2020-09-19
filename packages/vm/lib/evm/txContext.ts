import { BN } from 'ethereumjs-util'

export default class TxContext {
  gasPrice: BN
  origin: Buffer

  constructor(gasPrice: BN, origin: Buffer) {
    this.gasPrice = gasPrice
    this.origin = origin
  }
}
