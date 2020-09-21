import * as tape from 'tape'
import Common from '@ethereumjs/common'
import { rlp, toBuffer, zeros, KECCAK256_RLP, KECCAK256_RLP_ARRAY } from 'ethereumjs-util'
import { BlockHeader } from '../src/header'
import { Block } from '../src/block'

tape('[Block]: Header functions', function (t) {
  t.test('should create with default constructor', function (st) {
    function compareDefaultHeader(st: tape.Test, header: BlockHeader) {
      st.deepEqual(header.parentHash, zeros(32))
      st.ok(header.uncleHash.equals(KECCAK256_RLP_ARRAY))
      st.deepEqual(header.coinbase, zeros(20))
      st.deepEqual(header.stateRoot, zeros(32))
      st.ok(header.transactionsTrie.equals(KECCAK256_RLP))
      st.ok(header.receiptTrie.equals(KECCAK256_RLP))
      st.deepEqual(header.bloom, zeros(256))
      st.deepEqual(header.difficulty, Buffer.from([]))
      st.deepEqual(header.number, toBuffer(1150000))
      st.deepEqual(header.gasLimit, Buffer.from('ffffffffffffff', 'hex'))
      st.deepEqual(header.gasUsed, Buffer.from([]))
      st.deepEqual(header.timestamp, Buffer.from([]))
      st.deepEqual(header.extraData, Buffer.from([]))
      st.deepEqual(header.mixHash, zeros(32))
      st.deepEqual(header.nonce, zeros(8))
    }

    let header = new BlockHeader()
    compareDefaultHeader(st, header)

    const block = new Block()
    header = block.header
    compareDefaultHeader(st, header)

    st.end()
  })

  t.test('should test header initialization', function (st) {
    const common = new Common({ chain: 'ropsten', hardfork: 'chainstart' })
    const block1 = new Block(undefined, { common: common, initWithGenesisHeader: true })
    st.ok(block1.hash().toString('hex'), 'block should initialize')
    st.end()
  })

  t.test('should test validateGasLimit', function (st) {
    const testData = require('./testdata/bcBlockGasLimitTest.json').tests
    const bcBlockGasLimigTestData = testData.BlockGasLimit2p63m1

    Object.keys(bcBlockGasLimigTestData).forEach((key) => {
      const parentBlock = new Block(rlp.decode(bcBlockGasLimigTestData[key].genesisRLP))
      const block = new Block(rlp.decode(bcBlockGasLimigTestData[key].blocks[0].rlp))
      st.equal(block.header.validateGasLimit(parentBlock), true)
    })

    st.end()
  })

  t.test('should test isGenesis', function (st) {
    const header = new BlockHeader()
    st.equal(header.isGenesis(), false)
    header.number = Buffer.from([])
    st.equal(header.isGenesis(), true)
    st.end()
  })

  const testDataGenesis = require('./testdata/genesishashestest.json').test
  t.test('should test genesis hashes (mainnet default)', function (st) {
    const header = new BlockHeader(undefined, { initWithGenesisHeader: true })
    st.strictEqual(
      header.hash().toString('hex'),
      testDataGenesis.genesis_hash,
      'genesis hash match',
    )
    st.end()
  })

  t.test('should test genesis parameters (ropsten)', function (st) {
    const common = new Common({ chain: 'ropsten', hardfork: 'chainstart' })
    const genesisHeader = new BlockHeader(undefined, { common, initWithGenesisHeader: true })
    const ropstenStateRoot = '217b0bbcfb72e2d57e28f33cb361b9983513177755dc3f33ce3e7022ed62b77b'
    st.strictEqual(
      genesisHeader.stateRoot.toString('hex'),
      ropstenStateRoot,
      'genesis stateRoot match',
    )
    st.end()
  })
})
