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
  seenKeys: Set<string>
  origState: StateManager
  proofNodes: Map<string, Buffer>

  constructor(opts: StateManagerOpts) {
    super(opts)
    this.seenKeys = new Set()
    this.origState = new StateManager()
    this.proofNodes = new Map()
  }

  getAccount(addr: Buffer, cb: Function) {
    super.getAccount(addr, (err: Error, res: Account) => {
      if (!err && !this.seenKeys.has(addr.toString('hex'))) {
        this.seenKeys.add(addr.toString('hex'))

        const trie = this.origState._trie.copy()

        SecureTrie.prove(trie, addr, (err: Error, proof: Buffer[]) => {
          if (err) {
            return cb(err, null)
          }
          for (const n of proof) {
            const h = ethUtil.keccak256(n)
            this.proofNodes.set(h.toString('hex'), n)
          }
          cb(null, res)
        })
      } else {
        cb(err, res)
      }
    })
  }

  getContractCode(addr: Buffer, cb: Function) {
    super.getContractCode(addr, (err: Error, code: Buffer) => {
      if (!err) {
        const h = ethUtil.keccak256(code)
        this.proofNodes.set(h.toString('hex'), code)
      }
      cb(err, code)
    })
  }

  getContractStorage(addr: Buffer, key: Buffer, cb: Function) {
    super.getContractStorage(addr, key, (err: Error, value: any) => {
      const addrS = addr.toString('hex')
      const keyS = key.toString('hex')
      if (err) {
        return cb(err, value)
      }

      if (this.seenKeys.has(addrS.concat(keyS))) {
        return cb(err, value)
      }

      this.seenKeys.add(addrS.concat(keyS))

      // Use state previous to running this transaction to fetch storage trie for account
      // because account could be modified during current transaction.
      this.origState._getStorageTrie(addr, (err: Error, trie: any) => {
        if (err) return cb(err, null)

        if (trie.root.equals(ethUtil.KECCAK256_RLP)) {
          return cb(null, value)
        }

        SecureTrie.prove(trie, key, (err: Error, proof: Buffer[]) => {
          if (err) return cb(err, null)
          for (const n of proof) {
            const h = ethUtil.keccak256(n)
            this.proofNodes.set(h.toString('hex'), n)
          }
        })
      })

      cb(err, value)
    })
  }

  _isAccountEmpty(account: Account) {
    return (
      account.nonce.toString('hex') === '' &&
      account.balance.toString('hex') === '' &&
      account.codeHash.toString('hex') === ethUtil.KECCAK256_NULL_S
    )
  }
}
