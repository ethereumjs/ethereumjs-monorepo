const { Block } = require('@ethereumjs/block')
const Account = require('@ethereumjs/account').default
const Blockchain = require('@ethereumjs/blockchain').default
const level = require('level-mem')
const VM = require('../../dist/index').default

function createGenesis (common) {
  const genesis = new Block(undefined, { common, initWithGenesisHeader: true })

  return genesis
}

function createAccount (nonce, balance) {
  const raw = {
    nonce: nonce || '0x00',
    balance: balance || '0xfff384'
  }
  const acc = new Account(raw)
  return acc
}

function setupVM (opts = {}) {
  const db = level()
  opts.blockchain = opts.blockchain
    ? opts.blockchain
    : new Blockchain({ db, validateBlocks: false, validatePow: false })
  const vm = new VM(opts)
  vm.blockchain._common = vm._common
  vm.blockchain.dbManager._common = vm._common

  return vm
}

module.exports = {
  createGenesis,
  createAccount,
  setupVM
}
