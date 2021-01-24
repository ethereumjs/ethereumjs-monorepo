import { default as UnsignedEIP2930Transaction } from './unsignedEIP2930Transaction'
import { EIP2930TxData, TxOptions } from './types'
import BN from 'bn.js'
import { Address } from 'ethereumjs-util'

export default class SignedEIP2930Transaction extends UnsignedEIP2930Transaction {
  public static fromTxData(txData: EIP2930TxData, opts?: TxOptions) {
    return new SignedEIP2930Transaction(txData, opts ?? {})
  }

  public static fromValuesArray(values: Buffer[], opts?: TxOptions) {
    if (values.length != 11) {
      throw new Error('Expected 11 elements')
    }

    const [chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, yParity, r, s] = values
    const emptyBuffer = Buffer.from([])

    return new SignedEIP2930Transaction(
      {
        chainId: new BN(chainId),
        nonce: new BN(nonce),
        gasPrice: new BN(gasPrice),
        gasLimit: new BN(gasLimit),
        to: to && to.length > 0 ? new Address(to) : undefined,
        value: new BN(value),
        data: data ?? emptyBuffer,
        accessList: accessList ?? emptyBuffer,
        yParity: !yParity?.equals(emptyBuffer) ? parseInt(yParity.toString('hex'), 16) : undefined,
        r: !r?.equals(emptyBuffer) ? new BN(r) : undefined,
        s: !s?.equals(emptyBuffer) ? new BN(s) : undefined,
      },
      opts ?? {}
    )
  }

  protected constructor(txData: EIP2930TxData, opts: TxOptions) {
    super(txData, opts)

    if (txData.yParity != 0 && txData.yParity != 1) {
      throw new Error('The y-parity of the transaction should either be 0 or 1')
    }

    // TODO: save the extra yParity, r, s data.
    // TODO: verify the signature.
  }
}
