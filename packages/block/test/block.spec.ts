import * as tape from 'tape'
import { NestedUint8Array, toBuffer, zeros } from '@ethereumjs/util'
import RLP from 'rlp'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { Block, BlockBuffer } from '../src'
import blockFromRpc from '../src/from-rpc'
import * as testnetMerge from './testdata/testnetMerge.json'
import * as testDataPreLondon from './testdata/testdata_pre-london.json'
import * as testDataPreLondon2 from './testdata/testdata_pre-london-2.json'
import * as testDataGenesis from './testdata/genesishashestest.json'
import * as testDataFromRpcGoerli from './testdata/testdata-from-rpc-goerli.json'

// explicitly import util, needed for karma-typescript bundling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import util from 'util'

tape('[Block]: block functions', function (t) {
  t.test('should test block initialization', function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const genesis = Block.fromBlockData({}, { common })
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

  t.test('initialization -> hardforkByBlockNumber option', function (st) {
    const customChains = [testnetMerge]
    const common = new Common({
      chain: 'testnetMerge',
      hardfork: Hardfork.Istanbul,
      customChains,
    })

    let block = Block.fromBlockData(
      {
        header: {
          number: 12, // Berlin block
          extraData: Buffer.alloc(97),
        },
      },
      { common, hardforkByBlockNumber: true }
    )
    st.equal(block._common.hardfork(), Hardfork.Berlin, 'should use hardforkByBlockNumber option')

    block = Block.fromBlockData(
      {
        header: {
          number: 20, // Future block
        },
      },
      { common, hardforkByTD: 5001 }
    )
    st.equal(
      block._common.hardfork(),
      Hardfork.Merge,
      'should use hardforkByTD option (td > threshold)'
    )

    block = Block.fromBlockData(
      {
        header: {
          number: 12, // Berlin block,
          extraData: Buffer.alloc(97),
        },
      },
      { common, hardforkByTD: 3000 }
    )
    st.equal(
      block._common.hardfork(),
      Hardfork.Berlin,
      'should work with hardforkByTD option (td < threshold)'
    )

    try {
      Block.fromBlockData({}, { common, hardforkByBlockNumber: true, hardforkByTD: 3000 })
      st.fail('should not reach this')
    } catch (e: any) {
      const msg =
        'should throw if hardforkByBlockNumber and hardforkByTD options are used in conjunction'
      st.ok(
        e.message.includes(
          `The hardforkByBlockNumber and hardforkByTD options can't be used in conjunction`
        ),
        msg
      )
    }

    st.end()
  })

  t.test('should initialize with undefined parameters without throwing', function (st) {
    st.doesNotThrow(function () {
      Block.fromBlockData()
    })
    st.end()
  })

  t.test('should initialize with null parameters without throwing', function (st) {
    const common = new Common({ chain: Chain.Ropsten })
    const opts = { common }
    st.doesNotThrow(function () {
      Block.fromBlockData({}, opts)
    })
    st.end()
  })

  t.test(
    'should throw when trying to initialize with uncle headers on a PoA network',
    function (st) {
      const common = new Common({ chain: Chain.Rinkeby })
      const uncleBlock = Block.fromBlockData(
        { header: { extraData: Buffer.alloc(117) } },
        { common }
      )
      st.throws(function () {
        Block.fromBlockData({ uncleHeaders: [uncleBlock.header] }, { common })
      })
      st.end()
    }
  )

  t.test('should test block validation on pow chain', async function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    const blockRlp = toBuffer(testDataPreLondon.blocks[0].rlp)
    try {
      Block.fromRLPSerializedBlock(blockRlp, { common })
      st.pass('should pass')
    } catch (error: any) {
      st.fail('should not throw')
    }
  })

  t.test('should test block validation on poa chain', async function (st) {
    const common = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Chainstart })

    try {
      blockFromRpc(testDataFromRpcGoerli, [], { common })
      st.pass('does not throw')
    } catch (error: any) {
      st.fail('error thrown')
    }
  })

  async function testTransactionValidation(st: tape.Test, block: Block) {
    st.ok(block.validateTransactions())
    st.ok(await block.validateTransactionsTrie())
  }

  t.test('should test transaction validation', async function (st) {
    const blockRlp = toBuffer(testDataPreLondon.blocks[0].rlp)
    const block = Block.fromRLPSerializedBlock(blockRlp, { freeze: false })
    await testTransactionValidation(st, block)
    ;(block.header as any).transactionsTrie = Buffer.alloc(32)
    try {
      await block.validateData()
      st.fail('should throw')
    } catch (error: any) {
      st.ok(error.message.includes('invalid transaction trie'))
    }
  })

  t.test('should test transaction validation with empty transaction list', async function (st) {
    const block = Block.fromBlockData({})
    await testTransactionValidation(st, block)
  })

  t.test('should test transaction validation with legacy tx in london', async function (st) {
    const common = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.London })
    const blockRlp = toBuffer(testDataPreLondon.blocks[0].rlp)
    const block = Block.fromRLPSerializedBlock(blockRlp, { common, freeze: false })
    await testTransactionValidation(st, block)
    ;(block.transactions[0] as any).gasPrice = BigInt(0)
    const result = block.validateTransactions(true)
    st.ok(
      result[0].includes('tx unable to pay base fee (non EIP-1559 tx)'),
      'should throw when legacy tx is unable to pay base fee'
    )
  })

  t.test('should test uncles hash validation', async function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    const blockRlp = toBuffer(testDataPreLondon2.blocks[2].rlp)
    const block = Block.fromRLPSerializedBlock(blockRlp, { common, freeze: false })
    st.equal(block.validateUnclesHash(), true)
    ;(block.header as any).uncleHash = Buffer.alloc(32)
    try {
      await block.validateData()
      st.fail('should throw')
    } catch (error: any) {
      st.ok(error.message.includes('invalid uncle hash'))
    }
  })

  t.test('should test isGenesis (mainnet default)', function (st) {
    const block = Block.fromBlockData({ header: { number: 1 } })
    st.notEqual(block.isGenesis(), true)
    const genesisBlock = Block.fromBlockData({ header: { number: 0 } })
    st.equal(genesisBlock.isGenesis(), true)
    st.end()
  })

  t.test('should test isGenesis (ropsten)', function (st) {
    const common = new Common({ chain: Chain.Ropsten })
    const block = Block.fromBlockData({ header: { number: 1 } }, { common })
    st.notEqual(block.isGenesis(), true)
    const genesisBlock = Block.fromBlockData({ header: { number: 0 } }, { common })
    st.equal(genesisBlock.isGenesis(), true)
    st.end()
  })

  t.test('should test genesis hashes (mainnet default)', function (st) {
    const common = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Chainstart })
    const rlp = Buffer.from(testDataGenesis.test.genesis_rlp_hex, 'hex')
    const hash = Buffer.from(testDataGenesis.test.genesis_hash, 'hex')
    const block = Block.fromRLPSerializedBlock(rlp, { common })
    st.ok(block.hash().equals(hash), 'genesis hash match')
    st.end()
  })

  t.test('should error on invalid params', function (st) {
    st.throws(() => {
      Block.fromRLPSerializedBlock('1' as any)
    }, 'input must be array')
    st.throws(() => {
      Block.fromValuesArray([1, 2, 3, 4] as any)
    }, 'input length must be 3 or less')
    st.end()
  })

  t.test('should return the same block data from raw()', function (st) {
    const block = Block.fromRLPSerializedBlock(toBuffer(testDataPreLondon2.blocks[2].rlp))
    const blockFromRaw = Block.fromValuesArray(block.raw())
    st.ok(block.hash().equals(blockFromRaw.hash()))
    st.end()
  })

  t.test('should test toJSON', function (st) {
    const block = Block.fromRLPSerializedBlock(toBuffer(testDataPreLondon2.blocks[2].rlp))
    st.equal(typeof block.toJSON(), 'object')
    st.end()
  })

  t.test('DAO hardfork', function (st) {
    const blockData = RLP.decode(testDataPreLondon2.blocks[0].rlp) as NestedUint8Array
    // Set block number from test block to mainnet DAO fork block 1920000
    blockData[0][8] = Buffer.from('1D4C00', 'hex')

    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Dao })
    st.throws(
      function () {
        Block.fromValuesArray(blockData as BlockBuffer, { common })
      },
      /Error: extraData should be 'dao-hard-fork'/,
      'should throw on DAO HF block with wrong extra data'
    ) // eslint-disable-line

    // Set extraData to dao-hard-fork
    blockData[0][12] = Buffer.from('64616f2d686172642d666f726b', 'hex')

    st.doesNotThrow(function () {
      Block.fromValuesArray(blockData as BlockBuffer, { common })
    }, 'should not throw on DAO HF block with correct extra data')
    st.end()
  })

  t.test(
    'should set canonical difficulty if I provide a calcDifficultyFromHeader header',
    function (st) {
      const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
      const genesis = Block.fromBlockData({}, { common })

      const nextBlockHeaderData = {
        number: genesis.header.number + BigInt(1),
        timestamp: genesis.header.timestamp + BigInt(10),
      }

      const blockWithoutDifficultyCalculation = Block.fromBlockData({
        header: nextBlockHeaderData,
      })

      // test if difficulty defaults to 0
      st.equal(
        blockWithoutDifficultyCalculation.header.difficulty,
        BigInt(0),
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
        blockWithDifficultyCalculation.header.difficulty > BigInt(0),
        'header difficulty should be set if difficulty header is given'
      )
      st.ok(
        blockWithDifficultyCalculation.header.ethashCanonicalDifficulty(genesis.header) ===
          blockWithDifficultyCalculation.header.difficulty,
        'header difficulty is canonical difficulty if difficulty header is given'
      )

      // test if we can provide a block which is too far ahead to still calculate difficulty
      const noParentHeaderData = {
        number: genesis.header.number + BigInt(1337),
        timestamp: genesis.header.timestamp + BigInt(10),
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
        block_farAhead.header.difficulty > BigInt(0),
        'should allow me to provide a bogus next block to calculate difficulty on when providing a difficulty header'
      )
      st.end()
    }
  )
})
