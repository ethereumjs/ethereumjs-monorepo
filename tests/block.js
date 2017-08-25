const tape = require('tape')
const utils = require('ethereumjs-util')
const params = require('ethereum-common')
const testing = require('ethereumjs-testing')
const Block = require('../index.js')


tape('[Block]: block functions', function (t) {
  const testData = require('./testdata.json')
  
  function testTransactionValidation(st, block) {
    st.equal(block.validateTransactions(), true)
    
    block.genTxTrie(function() {
      st.equal(block.validateTransactionsTrie(), true)
      st.end()
    })
  }
  
  t.test('should test transaction validation', function (st) {
    var block = new Block(Buffer.from(testData.blocks[0].rlp.slice(2), 'hex'))
    testTransactionValidation(st, block)
  })
  
  t.test('should test transaction validation with empty transaction list', function (st) {
    var block = new Block()
    testTransactionValidation(st, block)
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
    st.strictEqual(rlp.toString('hex'), testDataGenesis.genesis_rlp_hex, 'rlp hex match')
    st.strictEqual(genesisBlock.hash().toString('hex'), testDataGenesis.genesis_hash, 'genesis hash match')
    st.end()
  })
  
  t.test('should test toJSON', function (st) {
    var block = new Block()
    st.equal(typeof(block.toJSON()), 'object')
    st.end()
  })
})

