import tape from 'tape'
import { Address, BN, zeros, KECCAK256_RLP, KECCAK256_RLP_ARRAY, rlp } from 'ethereumjs-util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { BlockHeader } from '../src/header'
import { Block } from '../src'
import { Mockchain } from './mockchain'
import { PoaMockchain } from './poaMockchain'
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
      st.ok(header.logsBloom.equals(zeros(256)))
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

  t.test('Initialization -> fromHeaderData()', function (st) {
    const common = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Chainstart })
    let header = BlockHeader.genesis(undefined, { common })
    st.ok(header.hash().toString('hex'), 'genesis block should initialize')
    st.equal(header._common.hardfork(), 'chainstart', 'should initialize with correct HF provided')

    common.setHardfork(Hardfork.Byzantium)
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
    st.end()
  })

  t.test('Initialization -> fromRLPSerializedHeader()', function (st) {
    let header = BlockHeader.fromHeaderData({}, { freeze: false })

    const rlpHeader = header.serialize()
    header = BlockHeader.fromRLPSerializedHeader(rlpHeader)
    st.ok(Object.isFrozen(header), 'block should be frozen by default')

    header = BlockHeader.fromRLPSerializedHeader(rlpHeader, { freeze: false })
    st.ok(!Object.isFrozen(header), 'block should not be frozen when freeze deactivated in options')

    st.end()
  })

  t.test('Initialization -> fromRLPSerializedHeader() -> error cases', function (st) {
    try {
      BlockHeader.fromRLPSerializedHeader(rlp.encode('a'))
    } catch (e: any) {
      const expectedError = 'Invalid serialized header input. Must be array'
      st.ok(e.message.includes(expectedError), 'should throw with header as rlp encoded string')
    }
    st.end()
  })

  t.test('Initialization -> fromValuesArray()', function (st) {
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

    let header = BlockHeader.fromValuesArray(headerArray)
    st.ok(Object.isFrozen(header), 'block should be frozen by default')

    header = BlockHeader.fromValuesArray(headerArray, { freeze: false })
    st.ok(!Object.isFrozen(header), 'block should not be frozen when freeze deactivated in options')
    st.end()
  })

  t.test('Initialization -> fromValuesArray() -> error cases', function (st) {
    const headerArray = Array(17).fill(Buffer.alloc(0))

    // mock header data (if set to zeros(0) header throws)
    headerArray[0] = zeros(32) //parentHash
    headerArray[2] = zeros(20) //coinbase
    headerArray[3] = zeros(32) //stateRoot
    headerArray[4] = zeros(32) //transactionsTrie
    headerArray[5] = zeros(32) //receiptTrie
    headerArray[13] = zeros(32) // mixHash
    headerArray[14] = zeros(8) // nonce
    headerArray[15] = zeros(4) // bad data
    try {
      BlockHeader.fromValuesArray(headerArray)
    } catch (e: any) {
      const expectedError = 'invalid header. More values than expected were received'
      st.ok(e.message.includes(expectedError), 'should throw on more values than expected')
    }

    try {
      BlockHeader.fromValuesArray(headerArray.slice(0, 5))
    } catch (e: any) {
      const expectedError = 'invalid header. Less values than expected were received'
      st.ok(e.message.includes(expectedError), 'should throw on less values than expected')
    }
    st.end()
  })

  t.test('Initialization -> Clique Blocks', function (st) {
    const common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.Chainstart })
    let header = BlockHeader.genesis(undefined, { common })
    st.ok(header.hash().toString('hex'), 'genesis block should initialize')

    header = BlockHeader.fromHeaderData({}, { common })
    st.ok(header.hash().toString('hex'), 'default block should initialize')

    st.end()
  })

  t.test('should validate extraData', async function (st) {
    // PoW
    let blockchain = new Mockchain()
    let common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
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
    } catch (error: any) {
      st.fail(testCase)
    }

    // valid extraData: fewer than limit
    testCase = 'pow block should validate with 12 bytes of extraData'
    extraData = Buffer.alloc(12)
    header = BlockHeader.fromHeaderData({ ...data, extraData }, opts)
    try {
      await header.validate(blockchain)
      st.ok(testCase)
    } catch (error: any) {
      st.fail(testCase)
    }

    // extraData beyond limit
    testCase = 'pow block should throw with excess amount of extraData'
    extraData = Buffer.alloc(42)
    header = BlockHeader.fromHeaderData({ ...data, extraData }, opts)
    try {
      await header.validate(blockchain)
      st.fail(testCase)
    } catch (error: any) {
      st.ok(error.message.includes('invalid amount of extra data'), testCase)
    }

    // PoA
    blockchain = new Mockchain()
    common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.Chainstart })
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
    } catch (error: any) {
      t.fail(testCase)
    }

    // invalid extraData length
    testCase = 'clique block should throw on invalid extraData length'
    extraData = Buffer.alloc(32)
    header = BlockHeader.fromHeaderData({ ...data, extraData }, opts)
    try {
      await header.validate(blockchain)
      t.fail(testCase)
    } catch (error: any) {
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
    } catch (error: any) {
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

    const common = new Common({ chain: Chain.Goerli })
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
    } catch (error: any) {
      st.ok(error.message.includes('invalid timestamp diff (lower than period)'), testCase)
    }

    testCase = 'should not throw on timestamp diff equal to period'
    headerData.timestamp = new BN(1422494864)
    header = BlockHeader.fromHeaderData(headerData, { common })
    try {
      await header.validate(blockchain)
      st.pass(testCase)
    } catch (error: any) {
      st.fail(testCase)
    }

    testCase = 'should throw on non-zero beneficiary (coinbase) for epoch transition block'
    headerData.number = common.consensusConfig().epoch
    headerData.coinbase = Address.fromString('0x091dcd914fCEB1d47423e532955d1E62d1b2dAEf')
    header = BlockHeader.fromHeaderData(headerData, { common })
    try {
      await header.validate(blockchain)
      st.fail('should throw')
    } catch (error: any) {
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
    } catch (error: any) {
      if (error.message.includes('mixHash must be filled with zeros')) {
        st.pass('error thrown')
      } else {
        st.fail('should throw with appropriate error')
      }
    }
    headerData.mixHash = Buffer.alloc(32)

    testCase = 'should throw on invalid clique difficulty'
    headerData.difficulty = new BN(3)
    header = BlockHeader.fromHeaderData(headerData, { common })
    try {
      header.validateCliqueDifficulty(blockchain)
      st.fail(testCase)
    } catch (error: any) {
      if (error.message.includes('difficulty for clique block must be INTURN (2) or NOTURN (1)')) {
        st.pass('error thrown on invalid clique difficulty')
      } else {
        st.fail('should throw with appropriate error')
      }
    }

    testCase = 'validateCliqueDifficulty() should return true with NOTURN difficulty and one signer'
    headerData.difficulty = new BN(2)
    const poaBlockchain = new PoaMockchain()
    const cliqueSigner = Buffer.from(
      '64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993',
      'hex'
    )
    const poaBlock = Block.fromRLPSerializedBlock(testData.genesisRLP, { common, cliqueSigner })
    await poaBlockchain.putBlock(poaBlock)

    header = BlockHeader.fromHeaderData(headerData, { common, cliqueSigner })
    try {
      const res = header.validateCliqueDifficulty(poaBlockchain)
      st.equal(res, true, testCase)
    } catch (error: any) {
      st.fail(testCase)
    }

    testCase =
      'validateCliqueDifficulty() should return false with INTURN difficulty and one signer'
    headerData.difficulty = new BN(1)
    header = BlockHeader.fromHeaderData(headerData, { common, cliqueSigner })
    try {
      const res = header.validateCliqueDifficulty(poaBlockchain)
      st.equal(res, false, testCase)
    } catch (error: any) {
      st.fail(testCase)
    }
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
    const common = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Chainstart })
    const genesis = BlockHeader.genesis({}, { common })
    const ropstenStateRoot = '217b0bbcfb72e2d57e28f33cb361b9983513177755dc3f33ce3e7022ed62b77b'
    st.strictEqual(genesis.stateRoot.toString('hex'), ropstenStateRoot, 'genesis stateRoot match')
    st.end()
  })

  t.test('should test hash() function', function (st) {
    let common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    let header = BlockHeader.fromHeaderData(blocksMainnet[0]['header'], { common })
    st.equal(
      header.hash().toString('hex'),
      '88e96d4537bea4d9c05d12549907b32561d3bf31f45aae734cdc119f13406cb6',
      'correct PoW hash (mainnet block 1)'
    )

    common = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Chainstart })
    header = BlockHeader.fromHeaderData(blocksGoerli[0]['header'], { common })
    st.equal(
      header.hash().toString('hex'),
      '8f5bab218b6bb34476f51ca588e9f4553a3a7ce5e13a66c660a5283e97e9a85a',
      'correct PoA clique hash (goerli block 1)'
    )
    st.end()
  })

  t.test('should return the baseFeePerGas from genesis if defined', function (st) {
    const common = Common.custom(
      {
        genesis: {
          hash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
          timestamp: null,
          gasLimit: 5000,
          difficulty: 17179869184,
          nonce: '0x0000000000000042',
          extraData: '0x11bbe8db4e347b4e8c937c1c8370e4b5ed33adb3db69cbdb7a38e1e50b1b82fa',
          stateRoot: '0xd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544',
          baseFeePerGas: '0x1000',
        },
      },
      { baseChain: Chain.Mainnet, hardfork: Hardfork.London }
    )
    const header = BlockHeader.fromHeaderData({}, { common, initWithGenesisHeader: true })
    st.ok(header.baseFeePerGas!.eq(new BN('1000', 16)), 'correct baseFeePerGas')
    st.end()
  })
})
