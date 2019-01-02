import * as rlp from 'rlp'
import BinaryValue from './binary'

const ethUtil = require('ethereumjs-util')
const Buffer = require('safe-buffer').Buffer

export default class Account {
  _nonce: BinaryValue
  _balance: BinaryValue
  _stateRoot: BinaryValue
  _codeHash: BinaryValue

  constructor(data?: any) {
    // Set default values
    this._nonce = new BinaryValue(Buffer.alloc(0))
    this._balance = new BinaryValue(Buffer.alloc(0))
    this._stateRoot = new BinaryValue(ethUtil.SHA3_RLP, 32)
    this._codeHash = new BinaryValue(ethUtil.SHA3_NULL, 32)

    if (data) {
      if (typeof data === 'string') {
        data = Buffer.from(ethUtil.stripHexPrefix(data), 'hex')
      }

      if (typeof data !== 'undefined' && Buffer.isBuffer(data)) {
        data = rlp.decode(data)
      }

      if (Array.isArray(data)) {
        if (data.length > 4) {
          throw new Error('wrong number of fields in data')
        }

        this._nonce.set(data[0])
        this._balance.set(data[1])
        this._stateRoot.set(data[2])
        this._codeHash.set(data[3])
      } else if (data !== null && typeof data === 'object') {
        if ('nonce' in data) this._nonce.set(data.nonce)
        if ('balance' in data) this._balance.set(data.balance)
        if ('stateRoot' in data) this._stateRoot.set(data.stateRoot)
        if ('codeHash' in data) this._codeHash.set(data.codeHash)
      } else {
        throw new Error('invalid data')
      }
    }
  }

  get nonce(): Buffer {
    return this._nonce.get()
  }

  get balance(): Buffer {
    return this._balance.get()
  }

  get stateRoot(): Buffer {
    return this._stateRoot.get()
  }

  get codeHash(): Buffer {
    return this._codeHash.get()
  }

  serialize(): Buffer {
    return rlp.encode([this.nonce, this.balance, this.stateRoot, this.codeHash])
  }

  isContract(): boolean {
    return this.codeHash.toString('hex') !== ethUtil.SHA3_NULL_S
  }

  getCode(trie: any, cb: any): void {
    if (!this.isContract()) {
      cb(null, Buffer.alloc(0))
      return
    }

    trie.getRaw(this.codeHash, cb)
  }

  setCode(trie: any, code: any, cb: any): void {
    this._codeHash.set(ethUtil.sha3(code))

    if (this.codeHash.toString('hex') === ethUtil.SHA3_NULL_S) {
      cb(null, Buffer.alloc(0))
      return
    }

    trie.putRaw(this.codeHash, code, (err: any) => {
      cb(err, this.codeHash)
    })
  }

  getStorage(trie: any, key: any, cb: any) {
    const t = trie.copy()
    t.root = this.stateRoot
    t.get(key, cb)
  }

  setStorage(trie: any, key: any, val: any, cb: any) {
    const t = trie.copy()
    t.root = this.stateRoot
    t.put(key, val, (err: any) => {
      if (err) return cb()
      this._stateRoot.set(t.root)
      cb()
    })
  }

  isEmpty() {
    return (
      this.balance.toString('hex') === '' &&
      this.nonce.toString('hex') === '' &&
      this.stateRoot.toString('hex') === ethUtil.SHA3_RLP_S &&
      this.codeHash.toString('hex') === ethUtil.SHA3_NULL_S
    )
  }
}
