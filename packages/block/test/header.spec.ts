import tape from 'tape'
import { Address, BN, zeros, KECCAK256_RLP, KECCAK256_RLP_ARRAY } from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import { BlockHeader } from '../src/header'
import { Block } from '../src'
import { Mockchain } from './mockchain'
const testData = require('./testdata/testdata.json')
const blocksMainnet = require('./testdata/blocks_mainnet.json')
const blocksGoerli = require('./testdata/blocks_goerli.json')

tape('[Block]: Header functions', function (t) {
  t.test('should create with default constructor', function (st) {
    function compareDefaultHeader(st: tape.Test, header: BlockHeader) {
      st.ok(header.parentHash.equals(zeros(32)))
      st.ok(header.uncleHash.equals(KECCAK256_RLP_ARRAY))
      st.ok(header.coinbase.equals(Address.zero()))
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
    st.ok(header.hash().toString('hex'), 'genesis block should initialize')
    st.equal(header._common.hardfork(), 'chainstart', 'should initialize with correct HF provided')

    common.setHardfork('byzantium')
    st.equal(
      header._common.hardfork(),
      'chainstart',
      'should stay on correct HF if outer common HF changes'
    )

    header = BlockHeader.fromHeaderData({}, { common })
    st.ok(header.hash().toString('hex'), 'default block should initialize')

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

  t.test('should test header initialization -> clique', function (st) {
    const common = new Common({ chain: 'rinkeby', hardfork: 'chainstart' })
    let header = BlockHeader.genesis(undefined, { common })
    st.ok(header.hash().toString('hex'), 'genesis block should initialize')

    header = BlockHeader.fromHeaderData({}, { common })
    st.ok(header.hash().toString('hex'), 'default block should initialize')

    st.end()
  })

  t.test('should validate extraData', async function (st) {
    // PoW
    let blockchain = new Mockchain()
    let common = new Common({ chain: 'mainnet', hardfork: 'chainstart' })
    let genesis = Block.genesis({}, { common })
    await blockchain.putBlock(genesis)

    const number = 1
    let parentHash = genesis.hash()
    const timestamp = Date.now()
    let { gasLimit } = genesis.header
    let data = { number, parentHash, timestamp, gasLimit }
    let opts = { common, calcDifficultyFromHeader: genesis.header }

    // valid extraData: at limit
    let testCase = 'pow block should validate with 32 bytes of extraData'
    let extraData = Buffer.alloc(32)
    let header = BlockHeader.fromHeaderData({ ...data, extraData }, opts)
    try {
      await header.validate(blockchain)
      st.pass(testCase)
    } catch (error) {
      st.fail(testCase)
    }

    // valid extraData: fewer than limit
    testCase = 'pow block should validate with 12 bytes of extraData'
    extraData = Buffer.alloc(12)
    header = BlockHeader.fromHeaderData({ ...data, extraData }, opts)
    try {
      await header.validate(blockchain)
      st.ok(testCase)
    } catch (error) {
      st.fail(testCase)
    }

    // extraData beyond limit
    testCase = 'pow block should throw with excess amount of extraData'
    extraData = Buffer.alloc(42)
    header = BlockHeader.fromHeaderData({ ...data, extraData }, opts)
    try {
      await header.validate(blockchain)
      st.fail(testCase)
    } catch (error) {
      st.ok(error.message.includes('invalid amount of extra data'), testCase)
    }

    // PoA
    blockchain = new Mockchain()
    common = new Common({ chain: 'rinkeby', hardfork: 'chainstart' })
    genesis = Block.genesis({}, { common })
    await blockchain.putBlock(genesis)

    parentHash = genesis.hash()
    gasLimit = genesis.header.gasLimit
    data = { number, parentHash, timestamp, gasLimit, difficulty: new BN(1) } as any
    opts = { common } as any

    // valid extraData (32 byte vanity + 65 byte seal)
    testCase =
      'clique block should validate with valid number of bytes in extraData: 32 byte vanity + 65 byte seal'
    extraData = Buffer.concat([Buffer.alloc(32), Buffer.alloc(65)])
    header = BlockHeader.fromHeaderData({ ...data, extraData }, opts)
    try {
      await header.validate(blockchain)
      t.pass(testCase)
    } catch (error) {
      t.fail(testCase)
    }

    // invalid extraData length
    testCase = 'clique block should throw on invalid extraData length'
    extraData = Buffer.alloc(32)
    header = BlockHeader.fromHeaderData({ ...data, extraData }, opts)
    try {
      await header.validate(blockchain)
      t.fail(testCase)
    } catch (error) {
      t.ok(
        error.message.includes(
          'extraData must be 97 bytes on non-epoch transition blocks, received 32 bytes'
        ),
        testCase
      )
    }

    // signer list indivisible by 20
    testCase = 'clique blocks should throw on invalid extraData length: indivisible by 20'
    extraData = Buffer.concat([
      Buffer.alloc(32),
      Buffer.alloc(65),
      Buffer.alloc(20),
      Buffer.alloc(21),
    ])
    const epoch = new BN(common.consensusConfig().epoch)
    header = BlockHeader.fromHeaderData({ ...data, number: epoch, extraData }, opts)
    try {
      await header.validate(blockchain)
      st.fail(testCase)
    } catch (error) {
      st.ok(
        error.message.includes(
          'invalid signer list length in extraData, received signer length of 41 (not divisible by 20)'
        ),
        testCase
      )
    }

    st.end()
  })

  t.test('header validation -> poa checks', async function (st) {
    const headerData = testData.blocks[0].blockHeader

    const common = new Common({ chain: 'goerli' })
    const blockchain = new Mockchain()

    const block = Block.fromRLPSerializedBlock(testData.genesisRLP, { common })
    await blockchain.putBlock(block)

    headerData.number = 1
    headerData.timestamp = new BN(1422494850)
    headerData.extraData = Buffer.alloc(97)
    headerData.mixHash = Buffer.alloc(32)
    headerData.difficulty = new BN(2)

    let testCase = 'should throw on lower than period timestamp diffs'
    let header = BlockHeader.fromHeaderData(headerData, { common })
    try {
      await header.validate(blockchain)
      st.fail(testCase)
    } catch (error) {
      st.equals(error.message, 'invalid timestamp diff (lower than period)', testCase)
    }

    testCase = 'should not throw on timestamp diff equal to period'
    headerData.timestamp = new BN(1422494864)
    header = BlockHeader.fromHeaderData(headerData, { common })
    try {
      await header.validate(blockchain)
      st.pass(testCase)
    } catch (error) {
      st.fail(testCase)
    }

    testCase = 'should throw on non-zero beneficiary (coinbase) for epoch transition block'
    headerData.number = common.consensusConfig().epoch
    headerData.coinbase = Address.fromString('0x091dcd914fCEB1d47423e532955d1E62d1b2dAEf')
    header = BlockHeader.fromHeaderData(headerData, { common })
    try {
      await header.validate(blockchain)
      st.fail('should throw')
    } catch (error) {
      if (error.message.includes('coinbase must be filled with zeros on epoch transition blocks')) {
        st.pass('error thrown')
      } else {
        st.fail('should throw with appropriate error')
      }
    }
    headerData.number = 1
    headerData.coinbase = Address.zero()

    testCase = 'should throw on non-zero mixHash'
    headerData.mixHash = Buffer.alloc(32).fill(1)
    header = BlockHeader.fromHeaderData(headerData, { common })
    try {
      await header.validate(blockchain)
      st.fail('should throw')
    } catch (error) {
      if (error.message.includes('mixHash must be filled with zeros')) {
        st.pass('error thrown')
      } else {
        st.fail('should throw with appropriate error')
      }
    }
    headerData.mixHash = Buffer.alloc(32)

    st.end()
  })

  t.test('should test validateGasLimit()', function (st) {
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

  t.test('should test hash() function', function (st) {
    let common = new Common({ chain: 'mainnet', hardfork: 'chainstart' })
    let header = BlockHeader.fromHeaderData(blocksMainnet[0]['header'], { common })
    st.equal(
      header.hash().toString('hex'),
      '88e96d4537bea4d9c05d12549907b32561d3bf31f45aae734cdc119f13406cb6',
      'correct PoW hash (mainnet block 1)'
    )

    common = new Common({ chain: 'goerli', hardfork: 'chainstart' })
    header = BlockHeader.fromHeaderData(blocksGoerli[0]['header'], { common })
    st.equal(
      header.hash().toString('hex'),
      '8f5bab218b6bb34476f51ca588e9f4553a3a7ce5e13a66c660a5283e97e9a85a',
      'correct PoA clique hash (goerli block 1)'
    )
    st.end()
  })
})
