import { Address } from 'ethereumjs-util'

export default class TxContext {
  gasPrice: bigint
  origin: Address

  constructor(gasPrice: bigint, origin: Address) {
    this.gasPrice = gasPrice
    this.origin = origin
  }
}
