const tape = require('tape')
const utils = require('ethereumjs-util')
const params = require('ethereum-common')
const testing = require('ethereumjs-testing')
const Block = require('../index.js')


tape('[Block]: block functions', function (t) {
  const testData = require('./testdata.json')

  t.test('should test validateTransactions', function (st) {
    var block = new Block(Buffer.from(testData.blocks[0].rlp.slice(2), 'hex'))
    st.equal(block.validateTransactions(), true)
    st.end()
  })
  
  t.test('should test isGenesis', function (st) {
    var block = new Block()
    st.notEqual(block.isGenesis(), true)
    block.header.number = new Buffer([])
    st.equal(block.isGenesis(), true)
    st.end()
  })
  
  const testDataGenesis = testing.getSingleFile('BasicTests/genesishashestest.json')
  t.test('should test genesis hashes', function(st) {
    var genesisBlock = new Block()
    genesisBlock.setGenesisParams()
    var rlp = genesisBlock.serialize()
    t.strictEqual(rlp.toString('hex'), testDataGenesis.genesis_rlp_hex, 'rlp hex match')
    t.strictEqual(genesisBlock.hash().toString('hex'), testDataGenesis.genesis_hash, 'genesis hash match')
    t.end()
  })
})

