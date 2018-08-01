const Block = require('ethereumjs-block')
const Account = require('ethereumjs-account')

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

module.exports = {
  createGenesis,
  createAccount
}
