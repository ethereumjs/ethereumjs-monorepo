import { Account, BN } from 'ethereumjs-util'
import Blockchain from '@ethereumjs/blockchain'
import VM from '../../lib/index'
import { VMOpts } from '../../lib'
import { Block } from '@ethereumjs/block'

const level = require('level-mem')

export function createAccount(nonce: BN = new BN(0), balance: BN = new BN(0xfff384)) {
  return new Account(nonce, balance)
}

export function setupVM(opts: VMOpts & { genesisBlock?: Block } = {}) {
  const db = level()
  const { common, genesisBlock } = opts
  if (!opts.blockchain) {
    opts.blockchain = new Blockchain({
      db,
      validateBlocks: false,
      validateConsensus: false,
      common,
      genesisBlock,
    })
  }
  return new VM({
    selectHardforkByBlockNumber: false,
    ...opts,
  })
}
