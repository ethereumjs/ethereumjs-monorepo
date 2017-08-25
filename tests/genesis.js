const testing = require('ethereumjs-testing')
const tape = require('tape')
const Block = require('../')

tape('[Common]: genesis hashes tests', t => {
  const testData = testing.getSingleFile('BasicTests/genesishashestest.json')
  var genesisBlock = new Block()
  genesisBlock.setGenesisParams()
  var rlp = genesisBlock.serialize()
  t.strictEqual(rlp.toString('hex'), testData.genesis_rlp_hex, 'rlp hex match')
  t.strictEqual(genesisBlock.hash().toString('hex'), testData.genesis_hash, 'genesis hash match')
  t.end()
})
