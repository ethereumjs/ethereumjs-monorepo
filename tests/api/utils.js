const Block = require('ethereumjs-block')
const Account = require('ethereumjs-account')
const level = require('level-mem')
const Blockchain = require('ethereumjs-blockchain')
const VM = require('../../lib/index')

function createGenesis () {
  const genesis = new Block()
  genesis.setGenesisParams()

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
  opts.blockchain = opts.blockchain ? opts.blockchain : new Blockchain({ db, validate: false })
  const vm = new VM(opts)

  return vm
}

module.exports = {
  createGenesis,
  createAccount,
  setupVM
}
