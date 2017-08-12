const testing = require('ethereumjs-testing')
const tape = require('tape')
const Block = require('../')



tape('[Common]: genesis hashes tests', t => {
  let args = {}
  args.file = /genesishashestest/
  const genesisData = testing.getSingleFile('BasicTests/genesishashestest.json');
  var blockGenesis = new Block()
  blockGenesis.setGenesisParams()
  var rlpGenesis = blockGenesis.serialize()
  t.strictEqual(rlpGenesis.toString('hex'), genesisData.genesis_rlp_hex, 'rlp hex mismatch')
  t.strictEqual(blockGenesis.hash().toString('hex'), genesisData.genesis_hash)
  t.end()
})
