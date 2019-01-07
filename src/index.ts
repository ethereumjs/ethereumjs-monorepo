import * as rlp from 'rlp'

const ethUtil = require('ethereumjs-util')
const Buffer = require('safe-buffer').Buffer

export default class Account {
  public nonce!: Buffer
  public balance!: Buffer
  public stateRoot!: Buffer
  public codeHash!: Buffer

  constructor(data?: any) {
    const fields = [{
      name: 'nonce',
      default: Buffer.alloc(0)
    }, {
      name: 'balance',
      default: Buffer.alloc(0)
    }, {
      name: 'stateRoot',
      length: 32,
      default: ethUtil.SHA3_RLP
    }, {
      name: 'codeHash',
      length: 32,
      default: ethUtil.SHA3_NULL
    }]

    ethUtil.defineProperties(this, fields, data)
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
    this.codeHash = ethUtil.sha3(code)

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
      this.stateRoot = t.root
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
