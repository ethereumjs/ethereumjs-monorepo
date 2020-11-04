import tape from 'tape'
import { rlp, zeros } from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import { Block, BlockBuffer } from '../src'
import { Mockchain } from './mockchain'

tape('[Block]: block functions', function (t) {
  t.test('should test block initialization', function (st) {
    const common = new Common({ chain: 'ropsten', hardfork: 'chainstart' })
    const genesis = Block.genesis({}, { common })
    st.ok(genesis.hash().toString('hex'), 'block should initialize')

    // test default freeze values
    // also test if the options are carried over to the constructor
    let block = Block.fromBlockData({})
    st.ok(Object.isFrozen(block), 'block should be frozen by default')

    block = Block.fromBlockData({}, { freeze: false })
    st.ok(!Object.isFrozen(block), 'block should not be frozen when freeze deactivated in options')

    const rlpBlock = block.serialize()
    block = Block.fromRLPSerializedBlock(rlpBlock)
    st.ok(Object.isFrozen(block), 'block should be frozen by default')

    block = Block.fromRLPSerializedBlock(rlpBlock, { freeze: false })
    st.ok(!Object.isFrozen(block), 'block should not be frozen when freeze deactivated in options')

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

    const valuesArray = <BlockBuffer>[headerArray, [], []]

    block = Block.fromValuesArray(valuesArray)
    st.ok(Object.isFrozen(block), 'block should be frozen by default')

    block = Block.fromValuesArray(valuesArray, { freeze: false })
    st.ok(!Object.isFrozen(block), 'block should not be frozen when freeze deactivated in options')

    st.end()
  })

  t.test('should initialize with undefined parameters without throwing', function (st) {
    st.doesNotThrow(function () {
      Block.fromBlockData()
    })
    st.end()
  })

  t.test('should initialize with null parameters without throwing', function (st) {
    st.doesNotThrow(function () {
      const common = new Common({ chain: 'ropsten' })
      const opts = { common }
      Block.fromBlockData({}, opts)
      st.end()
    })
  })

  const testData = require('./testdata/testdata.json')

  t.test('should test block validation on pow chain', async function (st) {
    const blockRlp = testData.blocks[0].rlp
    const block = Block.fromRLPSerializedBlock(blockRlp)
    const blockchain = new Mockchain()
    await blockchain.putBlock(Block.fromRLPSerializedBlock(testData.genesisRLP))
    st.doesNotThrow(async () => {
      await block.validate(blockchain)
      st.end()
    })
  })

  t.test('should test block validation on poa chain', async function (st) {
    const blockRlp = testData.blocks[0].rlp
    const common = new Common({ chain: 'goerli' })
    const block = Block.fromRLPSerializedBlock(blockRlp, { common })
    try {
      await block.validate()
    } catch (error) {
      st.ok(error.toString().match(/block validation is currently only supported on PoW chains/))
    }
    st.end()
  })

  async function testTransactionValidation(st: tape.Test, block: Block) {
    st.ok(block.validateTransactions())
    st.ok(await block.validateTransactionsTrie())
    st.end()
  }

  t.test('should test transaction validation', async function (st) {
    const blockRlp = testData.blocks[0].rlp
    const block = Block.fromRLPSerializedBlock(blockRlp)
    st.plan(2)
    await testTransactionValidation(st, block)
  })

  t.test('should test transaction validation with empty transaction list', async function (st) {
    const block = Block.fromBlockData({})
    st.plan(2)
    await testTransactionValidation(st, block)
  })

  const testData2 = require('./testdata/testdata2.json')
  t.test('should test uncles hash validation', function (st) {
    const blockRlp = testData2.blocks[2].rlp
    const block = Block.fromRLPSerializedBlock(blockRlp)
    st.equal(block.validateUnclesHash(), true)
    st.end()
  })

  t.test('should test isGenesis (mainnet default)', function (st) {
    const block = Block.fromBlockData({ header: { number: 1 } })
    st.notEqual(block.isGenesis(), true)
    const genesisBlock = Block.fromBlockData({ header: { number: 0 } })
    st.equal(genesisBlock.isGenesis(), true)
    st.end()
  })

  t.test('should test isGenesis (ropsten)', function (st) {
    const common = new Common({ chain: 'ropsten' })
    const block = Block.fromBlockData({ header: { number: 1 } }, { common })
    st.notEqual(block.isGenesis(), true)
    const genesisBlock = Block.fromBlockData({ header: { number: 0 } }, { common })
    st.equal(genesisBlock.isGenesis(), true)
    st.end()
  })

  const testDataGenesis = require('./testdata/genesishashestest.json').test
  t.test('should test genesis hashes (mainnet default)', function (st) {
    const genesis = Block.genesis()
    const genesisRlp = genesis.serialize()
    st.strictEqual(genesisRlp.toString('hex'), testDataGenesis.genesis_rlp_hex, 'rlp hex match')
    st.strictEqual(
      genesis.hash().toString('hex'),
      testDataGenesis.genesis_hash,
      'genesis hash match'
    )
    st.end()
  })

  t.test('should test genesis hashes (ropsten)', function (st) {
    const common = new Common({ chain: 'ropsten', hardfork: 'chainstart' })
    const genesis = Block.genesis({}, { common })
    st.strictEqual(
      genesis.hash().toString('hex'),
      common.genesis().hash.slice(2),
      'genesis hash match'
    )
    st.end()
  })

  t.test('should test genesis hashes (rinkeby)', function (st) {
    const common = new Common({ chain: 'rinkeby', hardfork: 'chainstart' })
    const genesis = Block.genesis({}, { common })
    st.strictEqual(
      genesis.hash().toString('hex'),
      common.genesis().hash.slice(2),
      'genesis hash match'
    )
    st.end()
  })

  t.test('should test genesis parameters (ropsten)', function (st) {
    const common = new Common({ chain: 'ropsten', hardfork: 'chainstart' })
    const genesis = Block.genesis({}, { common })
    const ropstenStateRoot = '217b0bbcfb72e2d57e28f33cb361b9983513177755dc3f33ce3e7022ed62b77b'
    st.strictEqual(
      genesis.header.stateRoot.toString('hex'),
      ropstenStateRoot,
      'genesis stateRoot match'
    )
    st.end()
  })

  t.test('should test toJSON', function (st) {
    const block = Block.fromRLPSerializedBlock(testData2.blocks[2].rlp)
    st.equal(typeof block.toJSON(), 'object')
    st.end()
  })

  t.test('DAO hardfork', function (st) {
    const blockData: any = rlp.decode(testData2.blocks[0].rlp)
    // Set block number from test block to mainnet DAO fork block 1920000
    blockData[0][8] = Buffer.from('1D4C00', 'hex')

    const common = new Common({ chain: 'mainnet', hardfork: 'dao' })
    st.throws(
      function () {
        Block.fromValuesArray(blockData, { common })
      },
      /Error: extraData should be 'dao-hard-fork'$/,
      'should throw on DAO HF block with wrong extra data'
    ) // eslint-disable-line

    // Set extraData to dao-hard-fork
    blockData[0][12] = Buffer.from('64616f2d686172642d666f726b', 'hex')

    st.doesNotThrow(function () {
      Block.fromValuesArray(blockData, { common })
    }, 'should not throw on DAO HF block with correct extra data')
    st.end()
  })

  t.test(
    'should set canonical difficulty if I provide a calcDifficultyFromHeader header',
    function (st) {
      const common = new Common({ chain: 'mainnet', hardfork: 'chainstart' })
      const genesis = Block.genesis({}, { common })

      const nextBlockHeaderData = {
        number: genesis.header.number.addn(1),
        timestamp: genesis.header.timestamp.addn(10),
      }

      const blockWithoutDifficultyCalculation = Block.fromBlockData({
        header: nextBlockHeaderData,
      })

      // test if difficulty defaults to 0
      st.ok(
        blockWithoutDifficultyCalculation.header.difficulty.eqn(0),
        'header difficulty should default to 0'
      )

      // test if we set difficulty if we have a "difficulty header" in options; also verify this is equal to reported canonical difficulty.
      const blockWithDifficultyCalculation = Block.fromBlockData(
        {
          header: nextBlockHeaderData,
        },
        {
          calcDifficultyFromHeader: genesis.header,
        }
      )

      st.ok(
        blockWithDifficultyCalculation.header.difficulty.gtn(0),
        'header difficulty should be set if difficulty header is given'
      )
      st.ok(
        blockWithDifficultyCalculation.header
          .canonicalDifficulty(genesis.header)
          .eq(blockWithDifficultyCalculation.header.difficulty),
        'header difficulty is canonical difficulty if difficulty header is given'
      )
      st.ok(
        blockWithDifficultyCalculation.header.validateDifficulty(genesis.header),
        'difficulty should be valid if difficulty header is provided'
      )

      // test if we can provide a block which is too far ahead to still calculate difficulty
      const noParentHeaderData = {
        number: genesis.header.number.addn(1337),
        timestamp: genesis.header.timestamp.addn(10),
      }

      const block_farAhead = Block.fromBlockData(
        {
          header: noParentHeaderData,
        },
        {
          calcDifficultyFromHeader: genesis.header,
        }
      )

      st.ok(
        block_farAhead.header.difficulty.gtn(0),
        'should allow me to provide a bogus next block to calculate difficulty on when providing a difficulty header'
      )
      st.end()
    }
  )
})
