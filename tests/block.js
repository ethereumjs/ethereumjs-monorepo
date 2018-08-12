const tape = require('tape')
const Common = require('ethereumjs-common')
const testing = require('ethereumjs-testing')
const rlp = require('ethereumjs-util').rlp
const Block = require('../index.js')

tape('[Block]: block functions', function (t) {
  t.test('should test block initialization', function (st) {
    const block1 = new Block(null, { 'chain': 'ropsten' })
    const common = new Common('ropsten')
    const block2 = new Block(null, { 'common': common })
    block1.setGenesisParams()
    block2.setGenesisParams()
    st.strictEqual(block1.hash().toString('hex'), block2.hash().toString('hex'), 'block hashes match')

    st.throws(function () { new Block(null, { 'chain': 'ropsten', 'common': common }) }, /not allowed!$/, 'should throw on initialization with chain and common parameter') // eslint-disable-line
    st.end()
  })

  const testData = require('./testdata.json')

  function testTransactionValidation (st, block) {
    st.equal(block.validateTransactions(), true)

    block.genTxTrie(function () {
      st.equal(block.validateTransactionsTrie(), true)
      st.end()
    })
  }

  t.test('should test transaction validation', function (st) {
    var block = new Block(rlp.decode(testData.blocks[0].rlp))
    st.plan(2)
    testTransactionValidation(st, block)
  })

  t.test('should test transaction validation with empty transaction list', function (st) {
    var block = new Block()
    st.plan(2)
    testTransactionValidation(st, block)
  })

  const testData2 = require('./testdata2.json')
  t.test('should test uncles hash validation', function (st) {
    var block = new Block(rlp.decode(testData2.blocks[2].rlp))
    st.equal(block.validateUnclesHash(), true)
    st.end()
  })

  t.test('should test isGenesis (mainnet default)', function (st) {
    var block = new Block()
    st.notEqual(block.isGenesis(), true)
    block.header.number = new Buffer([])
    st.equal(block.isGenesis(), true)
    st.end()
  })

  t.test('should test isGenesis (ropsten)', function (st) {
    var block = new Block(null, { 'chain': 'ropsten' })
    st.notEqual(block.isGenesis(), true)
    block.header.number = new Buffer([])
    st.equal(block.isGenesis(), true)
    st.end()
  })

  const testDataGenesis = testing.getSingleFile('BasicTests/genesishashestest.json')
  t.test('should test genesis hashes (mainnet default)', function (st) {
    var genesisBlock = new Block()
    genesisBlock.setGenesisParams()
    var rlp = genesisBlock.serialize()
    st.strictEqual(rlp.toString('hex'), testDataGenesis.genesis_rlp_hex, 'rlp hex match')
    st.strictEqual(genesisBlock.hash().toString('hex'), testDataGenesis.genesis_hash, 'genesis hash match')
    st.end()
  })

  t.test('should test genesis hashes (ropsten)', function (st) {
    var common = new Common('ropsten')
    var genesisBlock = new Block(null, { common: common })
    genesisBlock.setGenesisParams()
    st.strictEqual(genesisBlock.hash().toString('hex'), common.genesis().hash.slice(2), 'genesis hash match')
    st.end()
  })

  t.test('should test genesis hashes (rinkeby)', function (st) {
    var common = new Common('rinkeby')
    var genesisBlock = new Block(null, { common: common })
    genesisBlock.setGenesisParams()
    st.strictEqual(genesisBlock.hash().toString('hex'), common.genesis().hash.slice(2), 'genesis hash match')
    st.end()
  })

  t.test('should test genesis parameters (ropsten)', function (st) {
    var genesisBlock = new Block(null, { 'chain': 'ropsten' })
    genesisBlock.setGenesisParams()
    let ropstenStateRoot = '217b0bbcfb72e2d57e28f33cb361b9983513177755dc3f33ce3e7022ed62b77b'
    st.strictEqual(genesisBlock.header.stateRoot.toString('hex'), ropstenStateRoot, 'genesis stateRoot match')
    st.end()
  })

  t.test('should test toJSON', function (st) {
    var block = new Block(rlp.decode(testData2.blocks[2].rlp))
    st.equal(typeof (block.toJSON()), 'object')
    st.equal(typeof (block.toJSON(true)), 'object')
    st.end()
  })
})
