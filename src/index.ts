import * as rlp from 'rlp'

const ethUtil = require('ethereumjs-util')
const Buffer = require('safe-buffer').Buffer

interface TrieGetCb {
  (err: any, value: Buffer | null): void
}
interface TriePutCb {
  (err?: any): void
}

interface Trie {
  root: Buffer
  copy(): Trie
  getRaw(key: Buffer, cb: TrieGetCb): void
  putRaw(key: Buffer | string, value: Buffer, cb: TriePutCb): void
  get(key: Buffer | string, cb: TrieGetCb): void
  put(key: Buffer | string, value: Buffer | string, cb: TriePutCb): void
}

export default class Account {
  public nonce!: Buffer
  public balance!: Buffer
  public stateRoot!: Buffer
  public codeHash!: Buffer

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
        default: ethUtil.KECCAK256_RLP,
      },
      {
        name: 'codeHash',
        length: 32,
        default: ethUtil.KECCAK256_NULL,
      },
    ]

    ethUtil.defineProperties(this, fields, data)
  }

  serialize(): Buffer {
    return rlp.encode([this.nonce, this.balance, this.stateRoot, this.codeHash])
  }

  isContract(): boolean {
    return this.codeHash.toString('hex') !== ethUtil.KECCAK256_NULL_S
  }

  getCode(trie: Trie, cb: TrieGetCb): void {
    if (!this.isContract()) {
      cb(null, Buffer.alloc(0))
      return
    }

    trie.getRaw(this.codeHash, cb)
  }

  setCode(trie: Trie, code: Buffer, cb: (err: any, codeHash: Buffer) => void): void {
    this.codeHash = ethUtil.keccak256(code)

    if (this.codeHash.toString('hex') === ethUtil.KECCAK256_NULL_S) {
      cb(null, Buffer.alloc(0))
      return
    }

    trie.putRaw(this.codeHash, code, (err: any) => {
      cb(err, this.codeHash)
    })
  }

  getStorage(trie: Trie, key: Buffer | string, cb: TrieGetCb) {
    const t = trie.copy()
    t.root = this.stateRoot
    t.get(key, cb)
  }

  setStorage(trie: Trie, key: Buffer | string, val: Buffer | string, cb: () => void) {
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
      this.stateRoot.toString('hex') === ethUtil.KECCAK256_RLP_S &&
      this.codeHash.toString('hex') === ethUtil.KECCAK256_NULL_S
    )
  }
}
