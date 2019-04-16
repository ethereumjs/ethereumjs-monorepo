import Transaction, { TransactionData, TransactionOptions, BufferLike } from './index.js'
import { toBuffer } from 'ethereumjs-util'
import { Buffer } from 'buffer'

// We extend this interface here as FakeTransactions have one extra field
export interface TransactionObject {
  from?: BufferLike
}

/**
 * Creates a new transaction object that doesn't need to be signed
 * @constructor
 * @class {Buffer|Array} data a transaction can be initiailized with either a buffer containing the RLP serialized transaction or an array of buffers relating to each of the tx Properties, listed in order below in the exmple. Or lastly an Object containing the Properties of the transaction like in the Usage example
 *
 * For Object and Arrays each of the elements can either be a Buffer, a hex-prefixed (0x) String , Number, or an object with a toBuffer method such as Bignum
 * @example
 * var rawTx = {
 *   nonce: '0x00',
 *   gasPrice: '0x09184e72a000',
 *   gasLimit: '0x2710',
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: '0x00',
 *   data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
 *   v: '0x1c',
 *   r: '0x5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
 *   s '0x5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13'
 * };
 * var tx = new Transaction(rawTx);
 * @prop {Buffer} raw The raw rlp decoded transaction
 * @prop {Buffer} nonce
 * @prop {Buffer} to the to address
 * @prop {Buffer} value the amount of ether sent
 * @prop {Buffer} data this will contain the data of the message or the init of a contract
 * @prop {Buffer} v EC recovery ID
 * @prop {Buffer} r EC signature parameter
 * @prop {Buffer} s EC signature parameter
 */
export default class FakeTransaction extends Transaction {
  public from?: Buffer
  constructor(data?: TransactionData, opts?: TransactionOptions) {
    super(data, opts)

    const self = this

    /**
     * @prop {Buffer} from (read/write) Set from address to bypass transaction signing.
     */
    Object.defineProperty(this, 'from', {
      enumerable: true,
      configurable: true,
      get: this.getSenderAddress.bind(self),
      set: function(val) {
        if (val) {
          self._from = toBuffer(val)
        }
      },
    })

    const dataAsTransactionObject = data as TransactionObject
    this.from = toBuffer(dataAsTransactionObject.from)
  }

  /**
   * Computes a sha3-256 hash of the serialized tx, using the sender address to generate a fake signature.
   * @param {Boolean} [includeSignature=true] whether or not to inculde the signature
   * @return {Buffer}
   */
  hash(includeSignature = true) {
    if (includeSignature && this._from && this._from.toString('hex') !== '') {
      // include a fake signature using the from address as a private key
      const fakeKey = Buffer.concat([this._from, this._from.slice(0, 12)])
      this.sign(fakeKey)
    }

    return super.hash(includeSignature)
  }
}
