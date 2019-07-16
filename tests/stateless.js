const { promisify } = require('util')
const assert = require('assert')
const ethUtil = require('ethereumjs-util')
const SecureTrie = require('merkle-patricia-tree/secure')
const Account = require('ethereumjs-account').default
const StateManager = require('../dist/state/stateManager').default
const runTx = require('../dist/runTx').default

const verifyProof = promisify(SecureTrie.verifyProof)

class HookedStateManager extends StateManager {
  constructor (opts) {
    super(opts)
    this.proofs = {}
    this.codes = {}
    this.storageProofs = {}
    this.seenKeys = {}
  }

  getAccount (addr, cb) {
    super.getAccount(addr, (err, res) => {
      if (!err && !this.seenKeys[addr.toString('hex')]) {
        this.seenKeys[addr.toString('hex')] = true

        const trie = this._trie.copy()
        trie.root = this.preStateRoot
        trie._checkpoints = []

        SecureTrie.prove(trie, addr, (err, proof) => {
          if (err) {
            return cb(err, null)
          }
          this.proofs[addr.toString('hex')] = proof
          cb(null, res)
        })
      } else {
        cb(err, res)
      }
    })
  }

  getContractCode (addr, cb) {
    super.getContractCode(addr, (err, code) => {
      if (!err && !this.codes[addr.toString('hex')]) {
        this.codes[addr.toString('hex')] = code
      }
      cb(err, code)
    })
  }

  getContractStorage (addr, key, cb) {
    super.getContractStorage(addr, key, (err, value) => {
      const addrS = addr.toString('hex')
      const keyS = key.toString('hex')
      if (err || value.length === 0) {
        return cb(err, value)
      }

      if (this.storageProofs[addrS] && this.storageProofs[addrS][keyS]) {
        return cb(err, value)
      }

      this._getStorageTrie(addr, (err, trie) => {
        if (err) return cb(err, null)
        SecureTrie.prove(trie, key, (err, proof) => {
          if (err) return cb(err, null)
          if (!this.storageProofs[addrS]) {
            this.storageProofs[addrS] = {}
          }
          this.storageProofs[addrS][keyS] = proof
        })
      })

      cb(err, value)
    })
  }

  _isAccountEmpty (account) {
    return account.nonce.toString('hex') === '' &&
      account.balance.toString('hex') === '' &&
      account.codeHash.toString('hex') === ethUtil.KECCAK256_NULL_S
  }
}

async function proveTx (opts) {
  return runTx(opts)
}

async function stateFromProofs (preStateRoot, data) {
  const { accountProofs, codes, storageProofs } = data
  const stateManager = new StateManager()
  stateManager._trie.root = preStateRoot
  for (const key in accountProofs) {
    let keyBuf = Buffer.from(key, 'hex')
    await trieFromProof(stateManager._trie, accountProofs[key])
    const accountRaw = await promisify(stateManager._trie.get.bind(stateManager._trie))(keyBuf)
    const account = new Account(accountRaw)
    if (!account.codeHash.equals(ethUtil.KECCAK256_NULL)) {
      const code = codes[key]
      assert(code)
      const codeHash = await promisify(account.setCode.bind(account))(stateManager._trie, code)
      assert(codeHash.equals(account.codeHash))
    }
    if (!account.stateRoot.equals(ethUtil.KECCAK256_RLP)) {
      for (const k in storageProofs[key]) {
        const v = await verifyProof(account.stateRoot, Buffer.from(k, 'hex'), storageProofs[key][k])
        assert(v)
        await trieFromProof(stateManager._trie, storageProofs[key][k])
      }
    }
  }

  return stateManager
}

async function trieFromProof (trie, proofNodes) {
  let opStack = proofNodes.map((nodeValue) => {
    return { type: 'put', key: ethUtil.keccak256(nodeValue), value: ethUtil.toBuffer(nodeValue) }
  })

  return promisify(trie.db.batch.bind(trie.db))(opStack)
}

module.exports = {
  HookedStateManager,
  proveTx,
  stateFromProofs
}
