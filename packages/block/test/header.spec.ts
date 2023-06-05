import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import {
  Address,
  KECCAK256_RLP,
  KECCAK256_RLP_ARRAY,
  bytesToHex,
  concatBytes,
  equalsBytes,
  hexStringToBytes,
  toBytes,
  zeros,
} from '@ethereumjs/util'
import * as tape from 'tape'

import { Block } from '../src'
import { BlockHeader } from '../src/header'

import type { CliqueConfig } from '@ethereumjs/common'

const blocksGoerli = require('./testdata/blocks_goerli.json')
const blocksMainnet = require('./testdata/blocks_mainnet.json')

tape('[Block]: Header functions', function (t) {
  t.test('should create with default constructor', function (st) {
    function compareDefaultHeader(st: tape.Test, header: BlockHeader) {
      st.ok(equalsBytes(header.parentHash, zeros(32)))
      st.ok(equalsBytes(header.uncleHash, KECCAK256_RLP_ARRAY))
      st.ok(header.coinbase.equals(Address.zero()))
      st.ok(equalsBytes(header.stateRoot, zeros(32)))
      st.ok(equalsBytes(header.transactionsTrie, KECCAK256_RLP))
      st.ok(equalsBytes(header.receiptTrie, KECCAK256_RLP))
      st.ok(equalsBytes(header.logsBloom, zeros(256)))
      st.equal(header.difficulty, BigInt(0))
      st.equal(header.number, BigInt(0))
      st.equal(header.gasLimit, BigInt('0xffffffffffffff'))
      st.equal(header.gasUsed, BigInt(0))
      st.equal(header.timestamp, BigInt(0))
      st.ok(equalsBytes(header.extraData, new Uint8Array(0)))
      st.ok(equalsBytes(header.mixHash, zeros(32)))
      st.ok(equalsBytes(header.nonce, zeros(8)))
    }

    const header = BlockHeader.fromHeaderData()
    compareDefaultHeader(st, header)

    const block = new Block()
    compareDefaultHeader(st, block.header)

    st.end()
  })

  t.test('Initialization -> fromHeaderData()', function (st) {
    const common = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Chainstart })
    let header = BlockHeader.fromHeaderData(undefined, { common })
    st.ok(bytesToHex(header.hash()), 'genesis block should initialize')
    st.equal(header._common.hardfork(), 'chainstart', 'should initialize with correct HF provided')

    common.setHardfork(Hardfork.Byzantium)
    st.equal(
      header._common.hardfork(),
      'chainstart',
      'should stay on correct HF if outer common HF changes'
    )

    header = BlockHeader.fromHeaderData({}, { common })
    st.ok(bytesToHex(header.hash()), 'default block should initialize')

    // test default freeze values
    // also test if the options are carried over to the constructor
    header = BlockHeader.fromHeaderData({})
    st.ok(Object.isFrozen(header), 'block should be frozen by default')

    header = BlockHeader.fromHeaderData({}, { freeze: false })
    st.ok(!Object.isFrozen(header), 'block should not be frozen when freeze deactivated in options')
    st.end()
  })

  t.test('Initialization -> fromRLPSerializedHeader()', function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
    let header = BlockHeader.fromHeaderData({}, { common, freeze: false })

    const rlpHeader = header.serialize()
    header = BlockHeader.fromRLPSerializedHeader(rlpHeader, {
      common,
    })
    st.ok(Object.isFrozen(header), 'block should be frozen by default')

    header = BlockHeader.fromRLPSerializedHeader(rlpHeader, {
      common,
      freeze: false,
    })
    st.ok(!Object.isFrozen(header), 'block should not be frozen when freeze deactivated in options')

    st.throws(
      () =>
        BlockHeader.fromRLPSerializedHeader(rlpHeader, {
          common,
          freeze: false,
          hardforkByTTD: 1n, // Added to bypass defaulting hardforkByBlockNumber to true in static constructor
        }),
      (err: any) => err.message.includes('A base fee'),
      'throws when RLP serialized block with no base fee on default hardfork (london) and hardforkByBlockNumber left undefined'
    )

    header = BlockHeader.fromRLPSerializedHeader(
      hexStringToBytes(
        'f90214a00000000000000000000000000000000000000000000000000000000000000000a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347940000000000000000000000000000000000000000a0d7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000850400000000808213888080a011bbe8db4e347b4e8c937c1c8370e4b5ed33adb3db69cbdb7a38e1e50b1b82faa00000000000000000000000000000000000000000000000000000000000000000880000000000000042'
      ),
      { common, hardforkByBlockNumber: false }
    )
    st.equal(
      bytesToHex(header.hash()),
      'f0f936910ebf101b7b168bbe08e3f166ce1e75e16f513dd5a97af02fbe7de7c0',
      'genesis block should produce incorrect hash since default hardfork is london'
    )
    st.end()
  })

  t.test('Initialization -> fromRLPSerializedHeader() -> error cases', function (st) {
    try {
      BlockHeader.fromRLPSerializedHeader(RLP.encode('a'))
    } catch (e: any) {
      const expectedError = 'Invalid serialized header input. Must be array'
      st.ok(e.message.includes(expectedError), 'should throw with header as rlp encoded string')
    }
    st.end()
  })

  t.test('Initialization -> fromValuesArray()', function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
    const zero = new Uint8Array(0)
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

    let header = BlockHeader.fromValuesArray(headerArray, { common })
    st.ok(Object.isFrozen(header), 'block should be frozen by default')

    header = BlockHeader.fromValuesArray(headerArray, { common, freeze: false })
    st.ok(!Object.isFrozen(header), 'block should not be frozen when freeze deactivated in options')
    st.end()
  })

  t.test('Initialization -> fromValuesArray() -> error cases', function (st) {
    const headerArray = Array(20).fill(new Uint8Array(0))

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
    const header = BlockHeader.fromHeaderData({ extraData: new Uint8Array(97) }, { common })
    st.ok(bytesToHex(header.hash()), 'default block should initialize')

    st.end()
  })

  t.test('should validate extraData', async function (st) {
    // PoW
    let common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    let genesis = Block.fromBlockData({}, { common })

    const number = 1
    let parentHash = genesis.hash()
    const timestamp = Date.now()
    let { gasLimit } = genesis.header
    let data = { number, parentHash, timestamp, gasLimit }
    let opts = { common, calcDifficultyFromHeader: genesis.header }

    // valid extraData: at limit
    let testCase = 'pow block should validate with 32 bytes of extraData'
    let extraData = new Uint8Array(32)

    try {
      BlockHeader.fromHeaderData({ ...data, extraData }, opts)
      st.pass(testCase)
    } catch (error: any) {
      st.fail(testCase)
    }

    // valid extraData: fewer than limit
    testCase = 'pow block should validate with 12 bytes of extraData'
    extraData = new Uint8Array(12)

    try {
      BlockHeader.fromHeaderData({ ...data, extraData }, opts)
      st.ok(testCase)
    } catch (error: any) {
      st.fail(testCase)
    }

    // extraData beyond limit
    testCase = 'pow block should throw with excess amount of extraData'
    extraData = new Uint8Array(42)

    try {
      BlockHeader.fromHeaderData({ ...data, extraData }, opts)
      st.fail(testCase)
    } catch (error: any) {
      st.ok((error.message as string).includes('invalid amount of extra data'), testCase)
    }

    // PoA
    common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.Chainstart })
    genesis = Block.fromBlockData({ header: { extraData: new Uint8Array(97) } }, { common })

    parentHash = genesis.hash()
    gasLimit = genesis.header.gasLimit
    data = { number, parentHash, timestamp, gasLimit, difficulty: BigInt(1) } as any
    opts = { common } as any

    // valid extraData (32 byte vanity + 65 byte seal)
    testCase =
      'clique block should validate with valid number of bytes in extraData: 32 byte vanity + 65 byte seal'
    extraData = concatBytes(new Uint8Array(32), new Uint8Array(65))
    try {
      BlockHeader.fromHeaderData({ ...data, extraData }, opts)
      t.pass(testCase)
    } catch (error: any) {
      t.fail(testCase)
    }

    // invalid extraData length
    testCase = 'clique block should throw on invalid extraData length'
    extraData = new Uint8Array(32)
    try {
      BlockHeader.fromHeaderData({ ...data, extraData }, opts)
      t.fail(testCase)
    } catch (error: any) {
      t.ok(
        (error.message as string).includes(
          'extraData must be 97 bytes on non-epoch transition blocks, received 32 bytes'
        ),
        testCase
      )
    }

    // signer list indivisible by 20
    testCase = 'clique blocks should throw on invalid extraData length: indivisible by 20'
    extraData = concatBytes(
      new Uint8Array(32),
      new Uint8Array(65),
      new Uint8Array(20),
      new Uint8Array(21)
    )
    const epoch = BigInt((common.consensusConfig() as CliqueConfig).epoch)
    try {
      BlockHeader.fromHeaderData({ ...data, number: epoch, extraData }, opts)
      st.fail(testCase)
    } catch (error: any) {
      st.ok(
        (error.message as string).includes(
          'invalid signer list length in extraData, received signer length of 41 (not divisible by 20)'
        ),
        testCase
      )
    }

    st.end()
  })

  t.test('should skip consensusFormatValidation if flag is set to false', (st) => {
    const common = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Chainstart })
    const extraData = concatBytes(new Uint8Array(1))

    try {
      BlockHeader.fromHeaderData({ extraData }, { common, skipConsensusFormatValidation: true })
      st.pass(
        'should instantiate header with invalid extraData when skipConsensusFormatValidation === true'
      )
    } catch (error: any) {
      st.fail('should not throw')
    }

    st.end()
  })

  t.test('_genericFormatValidation checks', (st) => {
    const badHash = new Uint8Array(31)

    st.throws(
      () => BlockHeader.fromHeaderData({ parentHash: badHash }),
      (err: any) => err.message.includes('parentHash must be 32 bytes'),
      'throws on invalid parent hash length'
    )
    st.throws(
      () => BlockHeader.fromHeaderData({ stateRoot: badHash }),
      (err: any) => err.message.includes('stateRoot must be 32 bytes'),
      'throws on invalid state root hash length'
    )
    st.throws(
      () => BlockHeader.fromHeaderData({ transactionsTrie: badHash }),
      (err: any) => err.message.includes('transactionsTrie must be 32 bytes'),
      'throws on invalid transactionsTrie root hash length'
    )

    st.throws(
      () => BlockHeader.fromHeaderData({ nonce: new Uint8Array(5) }),
      (err: any) => err.message.includes('nonce must be 8 bytes'),
      'contains nonce length error message'
    )
    st.end()
  })
  /*
  TODO: Decide if we need to move these tests to blockchain
  t.test('header validation -> poa checks', async function (st) {
    const headerData = testDataPreLondon.blocks[0].blockHeader

    const common = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Istanbul })
    const blockchain = new Mockchain()

    const genesisRlp = toBytes(testDataPreLondon.genesisRLP)
    const block = Block.fromRLPSerializedBlock(genesisRlp, { common })
    await blockchain.putBlock(block)

    headerData.number = 1
    headerData.timestamp = BigInt(1422494850)
    headerData.extraData = new Uint8Array(97)
    headerData.mixHash = new Uint8Array(32)
    headerData.difficulty = BigInt(2)

    let testCase = 'should throw on lower than period timestamp diffs'
    let header = BlockHeader.fromHeaderData(headerData, { common })
    try {
      await header.validate(blockchain)
      st.fail(testCase)
    } catch (error: any) {
      st.ok((error.message as string).includes('invalid timestamp diff (lower than period)'), testCase)
    }

    testCase = 'should not throw on timestamp diff equal to period'
    headerData.timestamp = BigInt(1422494864)
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
      if ((error.message as string).includes('coinbase must be filled with zeros on epoch transition blocks')) {
        st.pass('error thrown')
      } else {
        st.fail('should throw with appropriate error')
      }
    }
    headerData.number = 1
    headerData.coinbase = Address.zero()

    testCase = 'should throw on non-zero mixHash'
    headerData.mixHash = new Uint8Array(32).fill(1)
    header = BlockHeader.fromHeaderData(headerData, { common })
    try {
      await header.validate(blockchain)
      st.fail('should throw')
    } catch (error: any) {
      if ((error.message as string).includes('mixHash must be filled with zeros')) {
        st.pass('error thrown')
      } else {
        st.fail('should throw with appropriate error')
      }
    }
    headerData.mixHash = new Uint8Array(32)

    testCase = 'should throw on invalid clique difficulty'
    headerData.difficulty = BigInt(3)
    header = BlockHeader.fromHeaderData(headerData, { common })
    try {
      header.validateCliqueDifficulty(blockchain)
      st.fail(testCase)
    } catch (error: any) {
      if ((error.message as string).includes('difficulty for clique block must be INTURN (2) or NOTURN (1)')) {
        st.pass('error thrown on invalid clique difficulty')
      } else {
        st.fail('should throw with appropriate error')
      }
    }

    testCase = 'validateCliqueDifficulty() should return true with NOTURN difficulty and one signer'
    headerData.difficulty = BigInt(2)
    const poaBlockchain = new PoaMockchain()
    const cliqueSigner = hexToBytes(
      '64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993'
    )
    const poaBlock = Block.fromRLPSerializedBlock(genesisRlp, { common, cliqueSigner })
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
    headerData.difficulty = BigInt(1)
    header = BlockHeader.fromHeaderData(headerData, { common, cliqueSigner })
    try {
      const res = header.validateCliqueDifficulty(poaBlockchain)
      st.equal(res, false, testCase)
    } catch (error: any) {
      st.fail(testCase)
    }
    st.end()
  })
*/
  t.test('should test validateGasLimit()', function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
    const testData = require('./testdata/bcBlockGasLimitTest.json').tests
    const bcBlockGasLimitTestData = testData.BlockGasLimit2p63m1

    for (const key of Object.keys(bcBlockGasLimitTestData)) {
      const genesisRlp = toBytes(bcBlockGasLimitTestData[key].genesisRLP)
      const parentBlock = Block.fromRLPSerializedBlock(genesisRlp, { common })
      const blockRlp = toBytes(bcBlockGasLimitTestData[key].blocks[0].rlp)
      const block = Block.fromRLPSerializedBlock(blockRlp, { common })
      st.doesNotThrow(() => block.validateGasLimit(parentBlock))
    }

    st.end()
  })

  t.test('should test isGenesis()', function (st) {
    const header1 = BlockHeader.fromHeaderData({ number: 1 })
    st.equal(header1.isGenesis(), false)

    const header2 = BlockHeader.fromHeaderData()
    st.equal(header2.isGenesis(), true)
    st.end()
  })

  t.test('should test hash() function', function (st) {
    let common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    let header = BlockHeader.fromHeaderData(blocksMainnet[0]['header'], { common })
    st.equal(
      bytesToHex(header.hash()),
      '88e96d4537bea4d9c05d12549907b32561d3bf31f45aae734cdc119f13406cb6',
      'correct PoW hash (mainnet block 1)'
    )

    common = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Chainstart })
    header = BlockHeader.fromHeaderData(blocksGoerli[0]['header'], { common })
    st.equal(
      bytesToHex(header.hash()),
      '8f5bab218b6bb34476f51ca588e9f4553a3a7ce5e13a66c660a5283e97e9a85a',
      'correct PoA clique hash (goerli block 1)'
    )
    st.end()
  })

  t.test(
    'should be able to initialize shanghai header with correct hardfork defaults',
    function (st) {
      const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai })
      const header = BlockHeader.fromHeaderData({}, { common })
      st.equal(header._common.hardfork(), Hardfork.Shanghai, 'hardfork should be set to shanghai')
      st.equal(header.baseFeePerGas, BigInt(7), 'baseFeePerGas should be set to minimum default')
      st.deepEqual(
        header.withdrawalsRoot,
        KECCAK256_RLP,
        'withdrawalsRoot should be set to KECCAK256_RLP'
      )
      st.end()
    }
  )
})
