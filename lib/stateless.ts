import { promisify } from 'util'
import * as assert from 'assert'
import * as ethUtil from 'ethereumjs-util'
import Account from 'ethereumjs-account'
import VM from './index'
import { default as StateManager, StateManagerOpts } from './state/stateManager'
import runTx from './runTx'

const SecureTrie = require('merkle-patricia-tree/secure')
const verifyProof = promisify(SecureTrie.verifyProof)

export class HookedStateManager extends StateManager {
  proofs: Map<string, Buffer[]>
  codes: Map<string, Buffer>
  storageProofs: Map<string, Map<string, Buffer[]>>
  seenKeys: Set<string>
  preStateRoot: Buffer

  constructor (opts: StateManagerOpts) {
    super(opts)
    this.proofs = new Map()
    this.codes = new Map()
    this.storageProofs = new Map()
    this.seenKeys = new Set()
    this.preStateRoot = ethUtil.KECCAK256_RLP
  }

  getAccount (addr: Buffer, cb: Function) {
    super.getAccount(addr, (err: Error, res: Account) => {
      if (!err && !this.seenKeys.has(addr.toString('hex'))) {
        this.seenKeys.add(addr.toString('hex'))

        const trie = this._trie.copy()
        trie.root = this.preStateRoot
        trie._checkpoints = []

        SecureTrie.prove(trie, addr, (err: Error, proof: Buffer[]) => {
          if (err) {
            return cb(err, null)
          }
          this.proofs.set(addr.toString('hex'), proof)
          cb(null, res)
        })
      } else {
        cb(err, res)
      }
    })
  }

  getContractCode (addr: Buffer, cb: Function) {
    super.getContractCode(addr, (err: Error, code: Buffer) => {
      if (!err && !this.codes.has(addr.toString('hex'))) {
        this.codes.set(addr.toString('hex'), code)
      }
      cb(err, code)
    })
  }

  getContractStorage (addr: Buffer, key: Buffer, cb: Function) {
    super.getContractStorage(addr, key, (err: Error, value: any) => {
      const addrS = addr.toString('hex')
      const keyS = key.toString('hex')
      if (err || value.length === 0) {
        return cb(err, value)
      }

      if (this.storageProofs.has(addrS) && this.storageProofs.get(addrS)!.has(keyS)) {
        return cb(err, value)
      }

      this._getStorageTrie(addr, (err: Error, trie: any) => {
        if (err) return cb(err, null)
        SecureTrie.prove(trie, key, (err: Error, proof: Buffer[]) => {
          if (err) return cb(err, null)
          let storageMap = this.storageProofs.get(addrS)
          if (storageMap === undefined) {
            storageMap = new Map()
            this.storageProofs.set(addrS, storageMap)
          }
          storageMap.set(keyS, proof)
        })
      })

      cb(err, value)
    })
  }

  _isAccountEmpty (account: Account) {
    return account.nonce.toString('hex') === '' &&
      account.balance.toString('hex') === '' &&
      account.codeHash.toString('hex') === ethUtil.KECCAK256_NULL_S
  }
}

export async function proveTx (vm: VM, opts: any) {
  return runTx.bind(vm)(opts)
}

export async function stateFromProofs (preStateRoot: Buffer, data: { accountProofs: Map<string, Buffer[]>, codes: Map<string, Buffer>, storageProofs: Map<string, Map<string, Buffer[]>> }) {
  const { accountProofs, codes, storageProofs } = data
  const stateManager = new StateManager()
  stateManager._trie.root = preStateRoot
  for (const [key, value] of accountProofs.entries()) {
    let keyBuf = Buffer.from(key, 'hex')
    await trieFromProof(stateManager._trie, value)
    const accountRaw = await promisify(stateManager._trie.get.bind(stateManager._trie))(keyBuf)
    const account = new Account(accountRaw)
    if (!account.codeHash.equals(ethUtil.KECCAK256_NULL)) {
      const code = codes.get(key)
      assert(code)
      // There's some issue with how typescript handles promisify and cb types
      // @ts-ignore
      const codeHash = await promisify(account.setCode.bind(account))(stateManager._trie, code)
      assert(codeHash.equals(account.codeHash))
    }
    if (!account.stateRoot.equals(ethUtil.KECCAK256_RLP)) {
      const storageMap = storageProofs.get(key)
      assert(storageMap)
      for (const [k, v] of storageMap!.entries()) {
        const sp = await verifyProof(account.stateRoot, Buffer.from(k, 'hex'), v)
        assert(sp)
        await trieFromProof(stateManager._trie, v)
      }
    }
  }

  return stateManager
}

async function trieFromProof (trie: any, proofNodes: Buffer[]) {
  let opStack = proofNodes.map((nodeValue) => {
    return { type: 'put', key: ethUtil.keccak256(nodeValue), value: ethUtil.toBuffer(nodeValue) }
  })

  return promisify(trie.db.batch.bind(trie.db))(opStack)
}
