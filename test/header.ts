import tape = require('tape')
import Common from 'ethereumjs-common'
import * as utils from 'ethereumjs-util'
import { rlp } from 'ethereumjs-util'
import { BlockHeader } from '../src/header'
import { Block } from '../src/block'

tape('[Block]: Header functions', function(t) {
  t.test('should create with default constructor', function(st) {
    function compareDefaultHeader(st: tape.Test, header: BlockHeader) {
      st.deepEqual(header.parentHash, utils.zeros(32))
      st.equal(header.uncleHash.toString('hex'), utils.KECCAK256_RLP_ARRAY_S)
      st.deepEqual(header.coinbase, utils.zeros(20))
      st.deepEqual(header.stateRoot, utils.zeros(32))
      st.equal(header.transactionsTrie.toString('hex'), utils.KECCAK256_RLP_S)
      st.equal(header.receiptTrie.toString('hex'), utils.KECCAK256_RLP_S)
      st.deepEqual(header.bloom, utils.zeros(256))
      st.deepEqual(header.difficulty, Buffer.from([]))
      st.deepEqual(header.number, utils.toBuffer(1150000))
      st.deepEqual(header.gasLimit, Buffer.from('ffffffffffffff', 'hex'))
      st.deepEqual(header.gasUsed, Buffer.from([]))
      st.deepEqual(header.timestamp, Buffer.from([]))
      st.deepEqual(header.extraData, Buffer.from([]))
      st.deepEqual(header.mixHash, utils.zeros(32))
      st.deepEqual(header.nonce, utils.zeros(8))
    }

    let header = new BlockHeader()
    compareDefaultHeader(st, header)

    const block = new Block()
    header = block.header
    compareDefaultHeader(st, header)

    st.end()
  })

  t.test('should test header initialization', function(st) {
    const header1 = new BlockHeader(undefined, { chain: 'ropsten' })
    const common = new Common('ropsten')
    const header2 = new BlockHeader(undefined, { common: common })
    header1.setGenesisParams()
    header2.setGenesisParams()
    st.strictEqual(
      header1.hash().toString('hex'),
      header2.hash().toString('hex'),
      'header hashes match',
    )

    st.throws(
      function() {
        new BlockHeader(undefined, { chain: 'ropsten', common: common })
      },
      /not allowed!$/,
      'should throw on initialization with chain and common parameter',
    ) // eslint-disable-line
    st.end()
  })

  t.test('should test validateGasLimit', function(st) {
    const testData = require('./bcBlockGasLimitTest.json').tests
    const bcBlockGasLimigTestData = testData.BlockGasLimit2p63m1

    Object.keys(bcBlockGasLimigTestData).forEach(key => {
      const parentBlock = new Block(rlp.decode(bcBlockGasLimigTestData[key].genesisRLP))
      const block = new Block(rlp.decode(bcBlockGasLimigTestData[key].blocks[0].rlp))
      st.equal(block.header.validateGasLimit(parentBlock), true)
    })

    st.end()
  })

  t.test('should test isGenesis', function(st) {
    const header = new BlockHeader()
    st.equal(header.isGenesis(), false)
    header.number = Buffer.from([])
    st.equal(header.isGenesis(), true)
    st.end()
  })

  const testDataGenesis = require('./genesishashestest.json').test
  t.test('should test genesis hashes (mainnet default)', function(st) {
    const header = new BlockHeader()
    header.setGenesisParams()
    st.strictEqual(
      header.hash().toString('hex'),
      testDataGenesis.genesis_hash,
      'genesis hash match',
    )
    st.end()
  })

  t.test('should test genesis parameters (ropsten)', function(st) {
    const genesisHeader = new BlockHeader(undefined, { chain: 'ropsten' })
    genesisHeader.setGenesisParams()
    const ropstenStateRoot = '217b0bbcfb72e2d57e28f33cb361b9983513177755dc3f33ce3e7022ed62b77b'
    st.strictEqual(
      genesisHeader.stateRoot.toString('hex'),
      ropstenStateRoot,
      'genesis stateRoot match',
    )
    st.end()
  })
})
