import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { bytesToHex, equalsBytes, hexStringToBytes, toBytes, zeros } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'
// explicitly import util, needed for karma-typescript bundling
// eslint-disable-next-line @typescript-eslint/no-unused-vars, simple-import-sort/imports

import { blockFromRpc } from '../src/from-rpc.js'
import { Block } from '../src/index.js'

import * as testDataGenesis from './testdata/genesishashestest.json'
import * as testDataFromRpcGoerli from './testdata/testdata-from-rpc-goerli.json'
import * as testDataPreLondon2 from './testdata/testdata_pre-london-2.json'
import * as testDataPreLondon from './testdata/testdata_pre-london.json'
import * as testnetMerge from './testdata/testnetMerge.json'

import type { BlockBytes } from '../src/index.js'
import type { NestedUint8Array } from '@ethereumjs/util'

describe('[Block]: block functions', () => {
  it('should test block initialization', () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const genesis = Block.fromBlockData({}, { common })
    assert.ok(bytesToHex(genesis.hash()), 'block should initialize')

    // test default freeze values
    // also test if the options are carried over to the constructor
    let block = Block.fromBlockData({})
    assert.ok(Object.isFrozen(block), 'block should be frozen by default')

    block = Block.fromBlockData({}, { freeze: false })
    assert.ok(
      !Object.isFrozen(block),
      'block should not be frozen when freeze deactivated in options'
    )

    const rlpBlock = block.serialize()
    block = Block.fromRLPSerializedBlock(rlpBlock)
    assert.ok(Object.isFrozen(block), 'block should be frozen by default')

    block = Block.fromRLPSerializedBlock(rlpBlock, { freeze: false })
    assert.ok(
      !Object.isFrozen(block),
      'block should not be frozen when freeze deactivated in options'
    )

    const zero = new Uint8Array(0)
    const headerArray = []
    for (let item = 0; item < 15; item++) {
      headerArray.push(zero)
    }

    // mock header data (if set to zeros(0) header throws)
    headerArray[0] = zeros(32) // parentHash
    headerArray[2] = zeros(20) // coinbase
    headerArray[3] = zeros(32) // stateRoot
    headerArray[4] = zeros(32) // transactionsTrie
    headerArray[5] = zeros(32) // receiptTrie
    headerArray[13] = zeros(32) // mixHash
    headerArray[14] = zeros(8) // nonce

    const valuesArray = <BlockBytes>[headerArray, [], []]

    block = Block.fromValuesArray(valuesArray, { common })
    assert.ok(Object.isFrozen(block), 'block should be frozen by default')

    block = Block.fromValuesArray(valuesArray, { common, freeze: false })
    assert.ok(
      !Object.isFrozen(block),
      'block should not be frozen when freeze deactivated in options'
    )
  })

  it('initialization -> setHardfork option', () => {
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
          extraData: new Uint8Array(97),
        },
      },
      { common, setHardfork: true }
    )
    assert.equal(block._common.hardfork(), Hardfork.Berlin, 'should use setHardfork option')

    block = Block.fromBlockData(
      {
        header: {
          number: 20, // Future block
        },
      },
      { common, setHardfork: 5001 }
    )
    assert.equal(
      block._common.hardfork(),
      Hardfork.Paris,
      'should use setHardfork option (td > threshold)'
    )

    block = Block.fromBlockData(
      {
        header: {
          number: 12, // Berlin block,
          extraData: new Uint8Array(97),
        },
      },
      { common, setHardfork: 3000 }
    )
    assert.equal(
      block._common.hardfork(),
      Hardfork.Berlin,
      'should work with setHardfork option (td < threshold)'
    )
  })

  it('should initialize with undefined parameters without throwing', () => {
    assert.doesNotThrow(function () {
      Block.fromBlockData()
    })
  })

  it('should initialize with null parameters without throwing', () => {
    const common = new Common({ chain: Chain.Ropsten })
    const opts = { common }
    assert.doesNotThrow(function () {
      Block.fromBlockData({}, opts)
    })
  })

  it('should throw when trying to initialize with uncle headers on a PoA network', () => {
    const common = new Common({ chain: Chain.Rinkeby })
    const uncleBlock = Block.fromBlockData(
      { header: { extraData: new Uint8Array(117) } },
      { common }
    )
    assert.throws(function () {
      Block.fromBlockData({ uncleHeaders: [uncleBlock.header] }, { common })
    })
  })

  it('should test block validation on pow chain', async () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    const blockRlp = toBytes(testDataPreLondon.blocks[0].rlp)
    try {
      Block.fromRLPSerializedBlock(blockRlp, { common })
      assert.ok(true, 'should pass')
    } catch (error: any) {
      assert.fail('should not throw')
    }
  })

  it('should test block validation on poa chain', async () => {
    const common = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Chainstart })

    try {
      blockFromRpc(testDataFromRpcGoerli, [], { common })
      assert.ok(true, 'does not throw')
    } catch (error: any) {
      assert.fail('error thrown')
    }
  })

  async function testTransactionValidation(block: Block) {
    assert.ok(block.validateTransactions())
    assert.ok(await block.validateTransactionsTrie())
  }

  it('should test transaction validation', async () => {
    const blockRlp = toBytes(testDataPreLondon.blocks[0].rlp)
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
    const block = Block.fromRLPSerializedBlock(blockRlp, { common, freeze: false })
    await testTransactionValidation(block)
    ;(block.header as any).transactionsTrie = new Uint8Array(32)
    try {
      await block.validateData()
      assert.fail('should throw')
    } catch (error: any) {
      assert.ok((error.message as string).includes('invalid transaction trie'))
    }
  })

  it('should test transaction validation with empty transaction list', async () => {
    const block = Block.fromBlockData({})
    await testTransactionValidation(block)
  })

  it('should test transaction validation with legacy tx in london', async () => {
    const common = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.London })
    const blockRlp = toBytes(testDataPreLondon.blocks[0].rlp)
    const block = Block.fromRLPSerializedBlock(blockRlp, { common, freeze: false })
    await testTransactionValidation(block)
    ;(block.transactions[0] as any).gasPrice = BigInt(0)
    const result = block.validateTransactions(true)
    assert.ok(
      result[0].includes('tx unable to pay base fee (non EIP-1559 tx)'),
      'should throw when legacy tx is unable to pay base fee'
    )
  })

  it('should test uncles hash validation', async () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    const blockRlp = toBytes(testDataPreLondon2.blocks[2].rlp)
    const block = Block.fromRLPSerializedBlock(blockRlp, { common, freeze: false })
    assert.equal(block.validateUnclesHash(), true)
    ;(block.header as any).uncleHash = new Uint8Array(32)
    try {
      await block.validateData()
      assert.fail('should throw')
    } catch (error: any) {
      assert.ok((error.message as string).includes('invalid uncle hash'))
    }
  })

  it('should test isGenesis (mainnet default)', () => {
    const block = Block.fromBlockData({ header: { number: 1 } })
    assert.notEqual(block.isGenesis(), true)
    const genesisBlock = Block.fromBlockData({ header: { number: 0 } })
    assert.equal(genesisBlock.isGenesis(), true)
  })

  it('should test isGenesis (ropsten)', () => {
    const common = new Common({ chain: Chain.Ropsten })
    const block = Block.fromBlockData({ header: { number: 1 } }, { common })
    assert.notEqual(block.isGenesis(), true)
    const genesisBlock = Block.fromBlockData({ header: { number: 0 } }, { common })
    assert.equal(genesisBlock.isGenesis(), true)
  })

  it('should test genesis hashes (mainnet default)', () => {
    const common = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Chainstart })
    const rlp = hexStringToBytes(testDataGenesis.test.genesis_rlp_hex)
    const hash = hexStringToBytes(testDataGenesis.test.genesis_hash)
    const block = Block.fromRLPSerializedBlock(rlp, { common })
    assert.ok(equalsBytes(block.hash(), hash), 'genesis hash match')
  })

  it('should error on invalid params', () => {
    assert.throws(
      () => {
        Block.fromRLPSerializedBlock('1' as any)
      },
      undefined,
      undefined,
      'input must be array'
    )
    assert.throws(
      () => {
        Block.fromValuesArray([1, 2, 3, 4] as any)
      },
      undefined,
      undefined,
      'input length must be 3 or less'
    )
  })

  it('should return the same block data from raw()', () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    const block = Block.fromRLPSerializedBlock(toBytes(testDataPreLondon2.blocks[2].rlp), {
      common,
    })
    const blockFromRaw = Block.fromValuesArray(block.raw(), { common })
    assert.ok(equalsBytes(block.hash(), blockFromRaw.hash()))
  })

  it('should test toJSON', () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    const block = Block.fromRLPSerializedBlock(toBytes(testDataPreLondon2.blocks[2].rlp), {
      common,
    })
    assert.equal(typeof block.toJSON(), 'object')
  })

  it('DAO hardfork', () => {
    const blockData = RLP.decode(testDataPreLondon2.blocks[0].rlp) as NestedUint8Array
    // Set block number from test block to mainnet DAO fork block 1920000
    blockData[0][8] = hexStringToBytes('1D4C00')

    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Dao })
    assert.throws(
      function () {
        Block.fromValuesArray(blockData as BlockBytes, { common })
      },
      /extraData should be 'dao-hard-fork/,
      undefined,
      'should throw on DAO HF block with wrong extra data'
    ) // eslint-disable-line

    // Set extraData to dao-hard-fork
    blockData[0][12] = hexStringToBytes('64616f2d686172642d666f726b')

    assert.doesNotThrow(function () {
      Block.fromValuesArray(blockData as BlockBytes, { common })
    }, 'should not throw on DAO HF block with correct extra data')
  })

  it('should set canonical difficulty if I provide a calcDifficultyFromHeader header', () => {
    let common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const genesis = Block.fromBlockData({}, { common })

    const nextBlockHeaderData = {
      number: genesis.header.number + BigInt(1),
      timestamp: genesis.header.timestamp + BigInt(10),
    }

    common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
    const blockWithoutDifficultyCalculation = Block.fromBlockData(
      {
        header: nextBlockHeaderData,
      },
      { common }
    )

    // test if difficulty defaults to 0
    assert.equal(
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
        common,
        calcDifficultyFromHeader: genesis.header,
      }
    )

    assert.ok(
      blockWithDifficultyCalculation.header.difficulty > BigInt(0),
      'header difficulty should be set if difficulty header is given'
    )
    assert.ok(
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
        common,
        calcDifficultyFromHeader: genesis.header,
      }
    )

    assert.ok(
      block_farAhead.header.difficulty > BigInt(0),
      'should allow me to provide a bogus next block to calculate difficulty on when providing a difficulty header'
    )
  })

  it('should be able to initialize shanghai blocks with correct hardfork defaults', () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai })
    const block = Block.fromBlockData({}, { common })
    assert.equal(block._common.hardfork(), Hardfork.Shanghai, 'hardfork should be set to shanghai')
    assert.deepEqual(block.withdrawals, [], 'withdrawals should be set to default empty array')
  })
})
