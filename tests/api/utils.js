const Block = require('ethereumjs-block')
const Account = require('ethereumjs-account')
const Level = require('levelup')
const Blockchain = require('ethereumjs-blockchain')
const VM = require('../../lib/index')

function createGenesis () {
  const genesis = new Block()
  genesis.setGenesisParams()

  return genesis
}

function createAccount () {
  const raw = {
    nonce: '0x00',
    balance: '0xfff384'
  }
  const acc = new Account(raw)
  return acc
}

function setupVM () {
  const db = new Level('', {
    db: require('memdown')
  })
  const cacheDB = new Level('./.cachedb')
  const blockchain = new Blockchain(db)
  blockchain.ethash.cachedb = cacheDB

  const vm = new VM({
    blockchain
  })

  return vm
}

module.exports = {
  createGenesis,
  createAccount,
  setupVM
}
