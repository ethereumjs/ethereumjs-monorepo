import * as rlp from 'rlp'
import { KECCAK256_NULL, KECCAK256_RLP, defineProperties } from 'ethereumjs-util'
const Buffer = require('safe-buffer').Buffer

export default class Account {
  /**
   * The account's nonce.
   */
  public nonce!: Buffer

  /**
   * The account's balance in wei.
   */
  public balance!: Buffer

  /**
   * The stateRoot for the storage of the contract.
   */
  public stateRoot!: Buffer

  /**
   * The hash of the code of the contract.
   */
  public codeHash!: Buffer

  /**
   * Creates a new account object
   *
   * ~~~
   * const data = [
   *   '0x02', //nonce
   *   '0x0384', //balance
   *   '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421', //stateRoot
   *   '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470', //codeHash
   * ]
   * const account = new Account(data)
   *
   * const data2 = {
   *   nonce: '0x0',
   *   balance: '0x03e7',
   *   stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
   *   codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
   * }
   * const account2 = new Account(data2)
   * ~~~
   *
   * @param data
   * An account can be initialized with either a `buffer` containing the RLP serialized account.
   * Or an `Array` of buffers relating to each of the account Properties, listed in order below.
   *
   * For `Object` and `Array` each of the elements can either be a `Buffer`, hex `String`, `Number`, or an object with a `toBuffer` method such as `Bignum`.
   */
  constructor(data?: any) {
    const fields = [
      {
        name: 'nonce',
        default: Buffer.alloc(0),
      },
      {
        name: 'balance',
        default: Buffer.alloc(0),
      },
      {
        name: 'stateRoot',
        length: 32,
        default: KECCAK256_RLP,
      },
      {
        name: 'codeHash',
        length: 32,
        default: KECCAK256_NULL,
      },
    ]

    defineProperties(this, fields, data)
  }

  /**
   * Returns the RLP serialization of the account as a `Buffer`.
   */
  serialize(): Buffer {
    return rlp.encode([this.nonce, this.balance, this.stateRoot, this.codeHash])
  }

  /**
   * Returns a `Boolean` deteremining if the account is a contract.
   */
  isContract(): boolean {
    return !this.codeHash.equals(KECCAK256_NULL)
  }

  /**
   * Returns a `Boolean` determining if the account is empty.
   */
  isEmpty(): boolean {
    return (
      this.balance.length === 0 && this.nonce.length === 0 && this.codeHash.equals(KECCAK256_NULL)
    )
  }
}
