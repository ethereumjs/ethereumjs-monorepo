import Common from '@ethereumjs/common'
import tape = require('tape')
import { rlp } from 'ethereumjs-util'

import { Block } from '../src/block'

tape('[Block]: block functions', function (t) {
  t.test('should test block initialization', function (st) {
    const common = new Common({ chain: 'ropsten', hardfork: 'chainstart' })
    const block1 = new Block(undefined, { common: common, initWithGenesisHeader: true })
    st.ok(block1.hash().toString('hex'), 'block should initialize')
    st.end()
  })

  t.test('should initialize with undefined parameters without throwing', function (st) {
    st.doesNotThrow(function () {
      new Block()
      st.end()
    })
  })

  t.test('should initialize with null parameters without throwing', function (st) {
    st.doesNotThrow(function () {
      const common = new Common({ chain: 'ropsten' })
      const opts = { common }
      new Block(undefined, opts)
      st.end()
    })
  })

  const testData = require('./testdata/testdata.json')

  async function testTransactionValidation(st: tape.Test, block: Block) {
    st.equal(block.validateTransactions(), true)

    await block.genTxTrie()

    st.equal(block.validateTransactionsTrie(), true)
    st.end()
  }

  t.test('should test transaction validation', async function (st) {
    const block = new Block(rlp.decode(testData.blocks[0].rlp))
    st.plan(2)
    await testTransactionValidation(st, block)
  })

  t.test('should test transaction validation with empty transaction list', async function (st) {
    const block = new Block()
    st.plan(2)
    await testTransactionValidation(st, block)
  })

  const testData2 = require('./testdata/testdata2.json')
  t.test('should test uncles hash validation', function (st) {
    const block = new Block(rlp.decode(testData2.blocks[2].rlp))
    st.equal(block.validateUnclesHash(), true)
    st.end()
  })

  t.test('should test isGenesis (mainnet default)', function (st) {
    const block = new Block()
    st.notEqual(block.isGenesis(), true)
    block.header.number = Buffer.from([])
    st.equal(block.isGenesis(), true)
    st.end()
  })

  t.test('should test isGenesis (ropsten)', function (st) {
    const common = new Common({ chain: 'ropsten' })
    const block = new Block(undefined, { common })
    st.notEqual(block.isGenesis(), true)
    block.header.number = Buffer.from([])
    st.equal(block.isGenesis(), true)
    st.end()
  })

  const testDataGenesis = require('./testdata/genesishashestest.json').test
  t.test('should test genesis hashes (mainnet default)', function (st) {
    const genesisBlock = new Block(undefined, { initWithGenesisHeader: true })
    const rlp = genesisBlock.serialize()
    st.strictEqual(rlp.toString('hex'), testDataGenesis.genesis_rlp_hex, 'rlp hex match')
    st.strictEqual(
      genesisBlock.hash().toString('hex'),
      testDataGenesis.genesis_hash,
      'genesis hash match',
    )
    st.end()
  })

  t.test('should test genesis hashes (ropsten)', function (st) {
    const common = new Common({ chain: 'ropsten', hardfork: 'chainstart' })
    const genesisBlock = new Block(undefined, { common: common, initWithGenesisHeader: true })
    st.strictEqual(
      genesisBlock.hash().toString('hex'),
      common.genesis().hash.slice(2),
      'genesis hash match',
    )
    st.end()
  })

  t.test('should test genesis hashes (rinkeby)', function (st) {
    const common = new Common({ chain: 'rinkeby', hardfork: 'chainstart' })
    const genesisBlock = new Block(undefined, { common: common, initWithGenesisHeader: true })
    st.strictEqual(
      genesisBlock.hash().toString('hex'),
      common.genesis().hash.slice(2),
      'genesis hash match',
    )
    st.end()
  })

  t.test('should test genesis parameters (ropsten)', function (st) {
    const common = new Common({ chain: 'ropsten', hardfork: 'chainstart' })
    const genesisBlock = new Block(undefined, { common, initWithGenesisHeader: true })
    const ropstenStateRoot = '217b0bbcfb72e2d57e28f33cb361b9983513177755dc3f33ce3e7022ed62b77b'
    st.strictEqual(
      genesisBlock.header.stateRoot.toString('hex'),
      ropstenStateRoot,
      'genesis stateRoot match',
    )
    st.end()
  })

  t.test('should test toJSON', function (st) {
    const block = new Block(rlp.decode(testData2.blocks[2].rlp))
    st.equal(typeof block.toJSON(), 'object')
    st.equal(typeof block.toJSON(true), 'object')
    st.end()
  })

  t.test('DAO hardfork', function (st) {
    const blockData: any = rlp.decode(testData2.blocks[0].rlp)
    // Set block number from test block to mainnet DAO fork block 1920000
    blockData[0][8] = Buffer.from('1D4C00', 'hex')

    const common = new Common({ chain: 'mainnet', hardfork: 'dao' })
    st.throws(
      function () {
        new Block(blockData, { common: common })
      },
      /Error: extraData should be 'dao-hard-fork'$/,
      'should throw on DAO HF block with wrong extra data',
    ) // eslint-disable-line

    // Set extraData to dao-hard-fork
    blockData[0][12] = Buffer.from('64616f2d686172642d666f726b', 'hex')
    st.doesNotThrow(function () {
      new Block(blockData, { common: common })
    }, 'should not throw on DAO HF block with correct extra data')
    st.end()
  })
})
