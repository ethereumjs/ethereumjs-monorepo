import tape from 'tape'
import { Address, BN, zeros, KECCAK256_RLP, KECCAK256_RLP_ARRAY } from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import { BlockHeader } from '../src/header'
import { Block } from '../src'
import { Mockchain } from './mockchain'
const testData = require('./testdata/testdata.json')

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
    let header = BlockHeader.genesis(undefined, { common })
    st.ok(header.hash().toString('hex'), 'block should initialize')

    // test default freeze values
    // also test if the options are carried over to the constructor
    header = BlockHeader.fromHeaderData({})
    st.ok(Object.isFrozen(header), 'block should be frozen by default')

    header = BlockHeader.fromHeaderData({}, { freeze: false })
    st.ok(!Object.isFrozen(header), 'block should not be frozen when freeze deactivated in options')

    const rlpHeader = header.serialize()
    header = BlockHeader.fromRLPSerializedHeader(rlpHeader)
    st.ok(Object.isFrozen(header), 'block should be frozen by default')

    header = BlockHeader.fromRLPSerializedHeader(rlpHeader, { freeze: false })
    st.ok(!Object.isFrozen(header), 'block should not be frozen when freeze deactivated in options')

    const zero = Buffer.alloc(0)
    const headerArray = []
    for (let item = 0; item < 15; item++) {
      headerArray.push(zero)
    }

    // mock header data (if set to zeros(0) header throws)
    headerArray[0] = zeros(32) //parentHash
    headerArray[2] = zeros(20) //coinbase
    headerArray[3] = zeros(32) //stateRoot
    headerArray[4] = zeros(32) //transactionsTrie
    headerArray[5] = zeros(32) //receiptTrie
    headerArray[13] = zeros(32) // mixHash
    headerArray[14] = zeros(8) // nonce

    header = BlockHeader.fromValuesArray(headerArray)
    st.ok(Object.isFrozen(header), 'block should be frozen by default')

    header = BlockHeader.fromValuesArray(headerArray, { freeze: false })
    st.ok(!Object.isFrozen(header), 'block should not be frozen when freeze deactivated in options')

    st.end()
  })

  t.test('header validation -> poa timestamp check', async function (st) {
    const headerData = testData.blocks[0].blockHeader
    const common = new Common({ chain: 'goerli' })
    const blockchain = new Mockchain()
    await blockchain.putBlock(Block.fromRLPSerializedBlock(testData.genesisRLP, { common }))
    const msg = 'invalid timestamp diff (lower than period)'

    headerData.timestamp = new BN(1422494850)
    let header = BlockHeader.fromHeaderData(headerData, { common })
    try {
      await header.validate(blockchain)
    } catch (error) {
      st.equal(error.message, msg, 'should throw on lower than period diffs')
    }
    headerData.timestamp = new BN(1422494864)
    header = BlockHeader.fromHeaderData(headerData, { common })
    try {
      await header.validate(blockchain)
      st.pass('should not throw on diff equal to period ')
    } catch (error) {
      st.notOk('thrown but should not throw')
    }
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

  t.test('should test isGenesis()', function (st) {
    const header1 = BlockHeader.fromHeaderData({ number: 1 })
    st.equal(header1.isGenesis(), false)

    const header2 = BlockHeader.genesis()
    st.equal(header2.isGenesis(), true)
    st.end()
  })

  t.test('should test isEpochTransition()', function (st) {
    let header = BlockHeader.fromHeaderData({ number: 1 })
    st.throws(() => {
      header.isEpochTransition()
    }, 'should throw on PoW networks')

    const common = new Common({ chain: 'rinkeby', hardfork: 'chainstart' })
    header = BlockHeader.genesis({}, { common })
    st.ok(header.isEpochTransition(), 'should indicate an epoch transition for the genesis block')
    header = BlockHeader.fromHeaderData({ number: 1 }, { common })
    st.notOk(header.isEpochTransition(), 'should correctly identify a non-epoch block')
    header = BlockHeader.fromHeaderData({ number: 60000 }, { common })
    st.ok(header.isEpochTransition(), 'should correctly identify an epoch block')

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
