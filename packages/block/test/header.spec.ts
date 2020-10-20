import tape from 'tape'
import { Address, BN, zeros, KECCAK256_RLP, KECCAK256_RLP_ARRAY } from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import { BlockHeader } from '../src/header'
import { Block } from '../src'

tape('[Block]: Header functions', function (t) {
  t.test('should create with default constructor', function (st) {
    function compareDefaultHeader(st: tape.Test, header: BlockHeader) {
      st.ok(header.parentHash.equals(zeros(32)))
      st.ok(header.uncleHash.equals(KECCAK256_RLP_ARRAY))
      st.ok(header.coinbase.buf.equals(Address.zero().buf))
      st.ok(header.stateRoot.equals(zeros(32)))
      st.ok(header.transactionsTrie.equals(KECCAK256_RLP))
      st.ok(header.receiptTrie.equals(KECCAK256_RLP))
      st.ok(header.bloom.equals(zeros(256)))
      st.ok(header.difficulty.isZero())
      st.ok(header.number.isZero())
      st.ok(header.gasLimit.eq(new BN(Buffer.from('ffffffffffffff', 'hex'))))
      st.ok(header.gasUsed.isZero())
      st.ok(header.timestamp.isZero())
      st.ok(header.extraData.equals(Buffer.from([])))
      st.ok(header.mixHash.equals(zeros(32)))
      st.ok(header.nonce.equals(zeros(8)))
    }

    const header = BlockHeader.fromHeaderData()
    compareDefaultHeader(st, header)

    const block = new Block()
    compareDefaultHeader(st, block.header)

    st.end()
  })

  t.test('should test header initialization', function (st) {
    const common = new Common({ chain: 'ropsten', hardfork: 'chainstart' })
    const header = BlockHeader.genesis(undefined, { common })
    st.ok(header.hash().toString('hex'), 'block should initialize')
    st.end()
  })

  t.test('should test validateGasLimit', function (st) {
    const testData = require('./testdata/bcBlockGasLimitTest.json').tests
    const bcBlockGasLimitTestData = testData.BlockGasLimit2p63m1

    Object.keys(bcBlockGasLimitTestData).forEach((key) => {
      const genesisRlp = bcBlockGasLimitTestData[key].genesisRLP
      const parentBlock = Block.fromRLPSerializedBlock(genesisRlp)
      const blockRlp = bcBlockGasLimitTestData[key].blocks[0].rlp
      const block = Block.fromRLPSerializedBlock(blockRlp)
      st.equal(block.validateGasLimit(parentBlock), true)
    })

    st.end()
  })

  t.test('should test isGenesis', function (st) {
    const header1 = BlockHeader.fromHeaderData({ number: 1 })
    st.equal(header1.isGenesis(), false)

    const header2 = BlockHeader.genesis()
    st.equal(header2.isGenesis(), true)
    st.end()
  })

  t.test('should test genesis hashes (mainnet default)', function (st) {
    const testDataGenesis = require('./testdata/genesishashestest.json').test
    const header = BlockHeader.genesis()
    st.strictEqual(
      header.hash().toString('hex'),
      testDataGenesis.genesis_hash,
      'genesis hash match'
    )
    st.end()
  })

  t.test('should test genesis parameters (ropsten)', function (st) {
    const common = new Common({ chain: 'ropsten', hardfork: 'chainstart' })
    const genesis = BlockHeader.genesis({}, { common })
    const ropstenStateRoot = '217b0bbcfb72e2d57e28f33cb361b9983513177755dc3f33ce3e7022ed62b77b'
    st.strictEqual(genesis.stateRoot.toString('hex'), ropstenStateRoot, 'genesis stateRoot match')
    st.end()
  })
})
