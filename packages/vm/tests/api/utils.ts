import level from 'level-mem'
import { BN } from 'ethereumjs-util'
import { Block, BlockOptions } from '@ethereumjs/block'
import Account from '@ethereumjs/account'
import Blockchain from '@ethereumjs/blockchain'
import VM from '../../dist/index'
import { VMOpts } from '../../lib'

export function createGenesis(opts: BlockOptions) {
  const genesis = new Block(undefined, { ...opts, initWithGenesisHeader: true })
  return genesis
}

export function createAccount(nonce: BN = new BN(0), balance: BN = new BN(0xfff384)) {
  const raw = { nonce, balance }
  const acc = new Account(raw)
  return acc
}

export function setupVM(opts: VMOpts = {}) {
  const db = level()

  if (!opts.blockchain) {
    opts.blockchain = new Blockchain({ db, validateBlocks: false, validatePow: false })
  }

  const vm = new VM(opts)
  ;(<any>vm.blockchain)._common = vm._common
  vm.blockchain.dbManager._common = vm._common

  return vm
}
