import Common from 'ethereumjs-common'
import tape = require('tape')
import { rlp } from 'ethereumjs-util'

import { Block } from '../src/block'

tape('[Block]: block functions', function(t) {
  t.test('should test block initialization', function(st) {
    const block1 = new Block(undefined, { chain: 'ropsten' })
    const common = new Common('ropsten')
    const block2 = new Block(undefined, { common: common })
    block1.setGenesisParams()
    block2.setGenesisParams()
    st.strictEqual(
      block1.hash().toString('hex'),
      block2.hash().toString('hex'),
      'block hashes match',
    )

    st.throws(
      function() {
        new Block(undefined, { chain: 'ropsten', common: common })
      },
      /not allowed!$/,
      'should throw on initialization with chain and common parameter',
    ) // eslint-disable-line
    st.end()
  })

  const testData = require('./testdata.json')

  async function testTransactionValidation(st: tape.Test, block: Block) {
    st.equal(block.validateTransactions(), true)

    await block.genTxTrie()

    st.equal(block.validateTransactionsTrie(), true)
    st.end()
  }

  t.test('should test transaction validation', async function(st) {
    const block = new Block(rlp.decode(testData.blocks[0].rlp))
    st.plan(2)
    await testTransactionValidation(st, block)
  })

  t.test('should test transaction validation with empty transaction list', async function(st) {
    const block = new Block()
    st.plan(2)
    await testTransactionValidation(st, block)
  })

  const testData2 = require('./testdata2.json')
  t.test('should test uncles hash validation', function(st) {
    const block = new Block(rlp.decode(testData2.blocks[2].rlp))
    st.equal(block.validateUnclesHash(), true)
    st.end()
  })

  t.test('should test isGenesis (mainnet default)', function(st) {
    const block = new Block()
    st.notEqual(block.isGenesis(), true)
    block.header.number = Buffer.from([])
    st.equal(block.isGenesis(), true)
    st.end()
  })

  t.test('should test isGenesis (ropsten)', function(st) {
    const block = new Block(undefined, { chain: 'ropsten' })
    st.notEqual(block.isGenesis(), true)
    block.header.number = Buffer.from([])
    st.equal(block.isGenesis(), true)
    st.end()
  })

  const testDataGenesis = require('./genesishashestest.json').test
  t.test('should test genesis hashes (mainnet default)', function(st) {
    const genesisBlock = new Block()
    genesisBlock.setGenesisParams()
    const rlp = genesisBlock.serialize()
    st.strictEqual(rlp.toString('hex'), testDataGenesis.genesis_rlp_hex, 'rlp hex match')
    st.strictEqual(
      genesisBlock.hash().toString('hex'),
      testDataGenesis.genesis_hash,
      'genesis hash match',
    )
    st.end()
  })

  t.test('should test genesis hashes (ropsten)', function(st) {
    const common = new Common('ropsten')
    const genesisBlock = new Block(undefined, { common: common })
    genesisBlock.setGenesisParams()
    st.strictEqual(
      genesisBlock.hash().toString('hex'),
      common.genesis().hash.slice(2),
      'genesis hash match',
    )
    st.end()
  })

  t.test('should test genesis hashes (rinkeby)', function(st) {
    const common = new Common('rinkeby')
    const genesisBlock = new Block(undefined, { common: common })
    genesisBlock.setGenesisParams()
    st.strictEqual(
      genesisBlock.hash().toString('hex'),
      common.genesis().hash.slice(2),
      'genesis hash match',
    )
    st.end()
  })

  t.test('should test genesis parameters (ropsten)', function(st) {
    const genesisBlock = new Block(undefined, { chain: 'ropsten' })
    genesisBlock.setGenesisParams()
    const ropstenStateRoot = '217b0bbcfb72e2d57e28f33cb361b9983513177755dc3f33ce3e7022ed62b77b'
    st.strictEqual(
      genesisBlock.header.stateRoot.toString('hex'),
      ropstenStateRoot,
      'genesis stateRoot match',
    )
    st.end()
  })

  t.test('should test toJSON', function(st) {
    const block = new Block(rlp.decode(testData2.blocks[2].rlp))
    st.equal(typeof block.toJSON(), 'object')
    st.equal(typeof block.toJSON(true), 'object')
    st.end()
  })
})
