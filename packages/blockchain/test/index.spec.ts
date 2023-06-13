import { Block, BlockHeader } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { MapDB } from '@ethereumjs/util'
import { bytesToHex, equalsBytes, hexToBytes, utf8ToBytes } from 'ethereum-cryptography/utils.js'
import { assert, describe, it } from 'vitest'

import { Blockchain } from '../src/index.js'

import blocksData from './testdata/blocks_mainnet.json'
import * as testDataPreLondon from './testdata/testdata_pre-london.json'
import { createTestDB, generateBlockchain, generateBlocks, isConsecutive } from './util.js'

import type { BlockOptions } from '@ethereumjs/block'

describe('blockchain test', () => {
  it('should not crash on getting head of a blockchain without a genesis', async () => {
    const blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
    })
    await blockchain.getIteratorHead()
  })

  it('should initialize correctly', async () => {
    const common = new Common({ chain: Chain.Ropsten })
    let blockchain = await Blockchain.create({ common })

    const iteratorHead = await blockchain.getIteratorHead()

    assert.deepEqual(
      iteratorHead.hash(),
      blockchain.genesisBlock.hash(),
      'correct genesis hash (getIteratorHead())'
    )

    blockchain = await Blockchain.create({ common, hardforkByHeadBlockNumber: true })
    assert.equal(
      common.hardfork(),
      'tangerineWhistle',
      'correct HF setting with hardforkByHeadBlockNumber option'
    )
  })

  it('should initialize correctly with Blockchain.fromBlocksData()', async () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const blockchain = await Blockchain.fromBlocksData(blocksData, {
      validateBlocks: true,
      validateConsensus: false,
      common,
    })
    const head = await blockchain.getIteratorHead()
    assert.equal(head.header.number, BigInt(0), 'correct block number')
  })

  it('should only initialize with supported consensus validation options', async () => {
    let common = new Common({ chain: Chain.Mainnet })
    try {
      await Blockchain.create({ common, validateConsensus: true })
      await Blockchain.create({ common, validateBlocks: true })
      common = new Common({ chain: Chain.Goerli })
      await Blockchain.create({ common, validateConsensus: true })
      const chain = await Blockchain.create({ common, validateBlocks: true })
      assert.ok(chain instanceof Blockchain, 'should not throw')
    } catch (error) {
      assert.fail('show not have thrown')
    }
  })

  it('should add a genesis block without errors', async () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const genesisBlock = Block.fromBlockData({ header: { number: 0 } }, { common })
    const blockchain = await Blockchain.create({
      common,
      validateBlocks: true,
      validateConsensus: false,
      genesisBlock,
    })
    assert.deepEqual(
      genesisBlock.hash(),
      (await blockchain.getCanonicalHeadHeader()).hash(),
      'genesis block hash should be correct'
    )
  })

  it('should not validate a block incorrectly flagged as genesis', async () => {
    const genesisBlock = Block.fromBlockData({ header: { number: BigInt(8) } })
    try {
      await Blockchain.create({
        validateBlocks: true,
        validateConsensus: false,
        genesisBlock,
      })
    } catch (error: any) {
      assert.ok(error, 'returned with error')
    }
  })

  it('should initialize with a genesis block', async () => {
    const blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
    })
    const blocks = await blockchain.getBlocks(0, 5, 0, false)
    assert.equal(blocks!.length, 1)
  })

  it('should add 12 blocks, one at a time', async () => {
    const blocks: Block[] = []
    const gasLimit = 8000000
    const common = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Istanbul })

    const genesisBlock = Block.fromBlockData({ header: { gasLimit } }, { common })
    blocks.push(genesisBlock)

    const blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
      genesisBlock,
      common,
      hardforkByHeadBlockNumber: true,
    })

    const addNextBlock = async (number: number) => {
      const lastBlock = blocks[number - 1]
      const blockData = {
        header: {
          number,
          parentHash: lastBlock.hash(),
          timestamp: lastBlock.header.timestamp + BigInt(1),
          gasLimit,
        },
      }
      const block = Block.fromBlockData(blockData, {
        calcDifficultyFromHeader: lastBlock.header,
        common,
      })
      await blockchain.putBlock(block)
      blocks.push(block)

      if (blocks.length < 12) {
        await addNextBlock(number + 1)
      } else {
        const getBlocks = await blockchain.getBlocks(blocks[0].hash(), 12, 0, false)
        assert.equal(getBlocks.length, 12)
        assert.equal(
          common.hardfork(),
          'spuriousDragon',
          'correct HF updates along block additions'
        )
      }
    }

    await addNextBlock(1)
  })

  it('getBlock(): should get block by number', async () => {
    const blocks: Block[] = []
    const gasLimit = 8000000
    const common = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Istanbul })

    const genesisBlock = Block.fromBlockData({ header: { gasLimit } }, { common })
    blocks.push(genesisBlock)

    const blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
      genesisBlock,
      common,
    })

    const blockData = {
      header: {
        number: 1,
        parentHash: genesisBlock.hash(),
        timestamp: genesisBlock.header.timestamp + BigInt(1),
        gasLimit,
      },
    }
    const block = Block.fromBlockData(blockData, {
      calcDifficultyFromHeader: genesisBlock.header,
      common,
    })
    blocks.push(block)
    await blockchain.putBlock(block)

    const returnedBlock = await blockchain.getBlock(1)
    if (typeof returnedBlock !== 'undefined') {
      assert.deepEqual(returnedBlock.hash(), blocks[1].hash())
    } else {
      assert.fail('block is not defined!')
    }
  })

  it('getBlock(): should get block by hash / not existing', async () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const gasLimit = 8000000
    const genesisBlock = Block.fromBlockData({ header: { gasLimit } }, { common })

    const blockchain = await Blockchain.create({
      common,
      validateBlocks: true,
      validateConsensus: false,
      genesisBlock,
    })
    const block = await blockchain.getBlock(genesisBlock.hash())
    assert.deepEqual(block.hash(), genesisBlock.hash())

    try {
      await blockchain.getBlock(5)
      assert.fail('should throw an exception')
    } catch (e: any) {
      assert.ok(
        e.message.includes('not found in DB'),
        `should throw for non-existing block-by-number request`
      )
    }

    try {
      await blockchain.getBlock(hexToBytes('1234'))
      assert.fail('should throw an exception')
    } catch (e: any) {
      assert.ok(
        e.message.includes('not found in DB'),
        `should throw for non-existing block-by-hash request`
      )
    }
  })

  it('should get 5 consecutive blocks, starting from genesis hash', async () => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    assert.equal(error, null, 'no error')
    // start: genesisHash, max: 5, skip: 0, reverse: false
    const getBlocks = await blockchain.getBlocks(blocks[0].hash(), 5, 0, false)
    assert.equal(getBlocks!.length, 5)
    assert.equal(blocks[0].header.number, getBlocks[0].header.number)
    assert.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')

    const canonicalHeaderOriginal = await blockchain.getCanonicalHeadHeader()
    assert.equal(canonicalHeaderOriginal.number, BigInt(24), 'block 24 should be canonical header')
    const block22 = await blockchain.getBlock(22)
    assert.equal(block22.header.number, BigInt(22), 'should fetch block by number')

    await blockchain.resetCanonicalHead(BigInt(4))
    let canonicalHeader = await blockchain.getCanonicalHeadHeader()
    assert.equal(canonicalHeader.number, BigInt(4), 'block 4 should be new canonical header')

    try {
      await blockchain.getBlock(22)
      assert.fail('canonical references should have been deleted')
    } catch (err: any) {
      assert.ok(err.message.includes('not found in DB'), 'canonical references correctly deleted')
    }

    try {
      await blockchain.getCanonicalHeader(BigInt(22))
      assert.fail('canonical references should have been deleted')
    } catch (err: any) {
      assert.equal(
        err.message,
        'header with number 22 not found in canonical chain',
        'canonical references correctly deleted'
      )
    }

    await blockchain.putHeader(canonicalHeaderOriginal)
    canonicalHeader = await blockchain.getCanonicalHeadHeader()
    assert.equal(canonicalHeader.number, BigInt(24), 'block 24 should be new canonical header')

    const newblock22 = await blockchain.getBlock(22)
    assert.equal(newblock22.header.number, BigInt(22), 'canonical references should be restored')
    assert.equal(
      bytesToHex(newblock22.hash()),
      bytesToHex(newblock22.hash()),
      'fetched block should match'
    )
    const newheader22 = await blockchain.getCanonicalHeader(BigInt(22))
    assert.equal(newheader22.number, BigInt(22), 'canonical references should be restored')
  })

  it('should get 5 blocks, skipping 1 apart, starting from genesis hash', async () => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    assert.equal(error, null, 'no error')
    // start: genesisHash, max: 5, skip: 1, reverse: false
    const getBlocks = await blockchain.getBlocks(blocks[0].hash(), 5, 1, false)
    assert.equal(getBlocks!.length, 5, 'should get 5 blocks')
    assert.equal(getBlocks![1].header.number, blocks[2].header.number, 'should skip second block')
    assert.ok(!isConsecutive(getBlocks!), 'blocks should not be consecutive')
  })

  it('should get 4 blocks, skipping 2 apart, starting from genesis hash', async () => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    assert.equal(error, null, 'no error')
    // start: genesisHash, max: 4, skip: 2, reverse: false
    const getBlocks = await blockchain.getBlocks(blocks[0].hash(), 4, 2, false)
    assert.equal(getBlocks!.length, 4, 'should get 4 blocks')
    assert.equal(
      getBlocks![1].header.number,
      blocks[3].header.number,
      'should skip two blocks apart'
    )
    assert.ok(!isConsecutive(getBlocks!), 'blocks should not be consecutive')
  })

  it('should get 10 consecutive blocks, starting from genesis hash', async () => {
    const { blockchain, blocks, error } = await generateBlockchain(15)
    assert.equal(error, null, 'no error')
    // start: genesisHash, max: 17, skip: 0, reverse: false
    const getBlocks = await blockchain.getBlocks(blocks[0].hash(), 17, 0, false)
    assert.equal(getBlocks!.length, 15)
    assert.equal(getBlocks![0].header.number, blocks[0].header.number)
    assert.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
  })

  it('should get 5 consecutive blocks, starting from block 0', async () => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    assert.equal(error, null, 'no error')
    // start: 0, max: 5, skip: 0, reverse: false
    const getBlocks = await blockchain.getBlocks(0, 5, 0, false)
    assert.equal(getBlocks!.length, 5)
    assert.equal(getBlocks![0].header.number, blocks[0].header.number)
    assert.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
  })

  it('should get 5 blocks, skipping 1 apart, starting from block 1', async () => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    assert.equal(error, null, 'no error')
    // start: 1, max: 5, skip: 1, reverse: false
    const getBlocks = await blockchain.getBlocks(1, 5, 1, false)
    assert.equal(getBlocks!.length, 5)
    assert.equal(getBlocks![1].header.number, blocks[3].header.number, 'should skip one block')
    assert.ok(!isConsecutive(getBlocks!), 'blocks should not be consecutive')
  })

  it('should get 5 blocks, skipping 2 apart, starting from block 0', async () => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    assert.equal(error, null, 'no error')
    // start: 0, max: 5, skip: 2, reverse: false
    const getBlocks = await blockchain.getBlocks(0, 5, 2, false)
    assert.equal(getBlocks!.length, 5)
    assert.equal(getBlocks![1].header.number, blocks[3].header.number, 'should skip two blocks')
    assert.ok(!isConsecutive(getBlocks!), 'blocks should not be consecutive')
  })

  it('should get 15 consecutive blocks, starting from block 0', async () => {
    const { blockchain, blocks, error } = await generateBlockchain(15)
    assert.equal(error, null, 'no error')
    // start: 0, max: 17, skip: 0, reverse: false
    const getBlocks = await blockchain.getBlocks(0, 17, 0, false)
    assert.equal(getBlocks!.length, 15)
    assert.equal(getBlocks![0].header.number, blocks[0].header.number)
    assert.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
  })

  it('should get 5 consecutive blocks, starting from block 1', async () => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    assert.equal(error, null, 'no error')
    // start: 1, max: 5, skip: 0, reverse: false
    const getBlocks = await blockchain.getBlocks(1, 5, 0, false)
    assert.equal(getBlocks!.length, 5)
    assert.equal(getBlocks![0].header.number, blocks[1].header.number)
    assert.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
  })

  it('should get 5 consecutive blocks, starting from block 5', async () => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    assert.equal(error, null, 'no error')
    // start: 5, max: 5, skip: 0, reverse: false
    const getBlocks = await blockchain.getBlocks(5, 5, 0, false)
    assert.equal(getBlocks!.length, 5)
    assert.equal(getBlocks![0].header.number, blocks[5].header.number)
    assert.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
  })

  it('should get 5 consecutive blocks, starting from block 5, reversed', async () => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    assert.equal(error, null, 'no error')
    // start: 5, max: 5, skip: 0, reverse: true
    const getBlocks = await blockchain.getBlocks(5, 5, 0, true)
    assert.equal(getBlocks!.length, 5)
    assert.equal(getBlocks![0].header.number, blocks[5].header.number)
    assert.ok(isConsecutive(getBlocks!.reverse()), 'blocks should be consecutive')
  })

  it('should get 6 consecutive blocks, starting from block 5, reversed', async () => {
    const { blockchain, blocks, error } = await generateBlockchain(15)
    assert.equal(error, null, 'no error')
    // start: 5, max: 15, skip: 0, reverse: true
    const getBlocks = await blockchain.getBlocks(5, 15, 0, true)
    assert.equal(getBlocks!.length, 6)
    assert.equal(getBlocks![0].header.number, blocks[5].header.number)
    assert.ok(isConsecutive(getBlocks!.reverse()), 'blocks should be consecutive')
  })

  it('should get 6 blocks, starting from block 10, reversed, skipping 1 apart', async () => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    assert.equal(error, null, 'no error')
    // start: 10, max: 10, skip: 1, reverse: true
    const getBlocks = await blockchain.getBlocks(10, 10, 1, true)
    assert.equal(getBlocks!.length, 6)
    assert.equal(getBlocks![1].header.number, blocks[8].header.number, 'should skip one block')
    assert.ok(!isConsecutive(getBlocks!.reverse()), 'blocks should not be consecutive')
  })

  it('should find needed hashes', async () => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    assert.equal(error, null, 'no error')
    const neededHash = hexToBytes('abcdef')
    const hashes = await blockchain.selectNeededHashes([
      blocks[0].hash(),
      blocks[9].hash(),
      neededHash,
    ])
    assert.deepEqual(hashes[0], neededHash)
  })

  it('should add fork header and reset stale heads', async () => {
    const { blockchain, blocks, error } = await generateBlockchain(15)
    assert.equal(error, null, 'no error')

    await blockchain.putBlocks(blocks.slice(1))

    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const headerData = {
      number: 15,
      parentHash: blocks[14].hash(),
      gasLimit: 8000000,
      timestamp: BigInt(blocks[14].header.timestamp) + BigInt(1),
    }
    const forkHeader = BlockHeader.fromHeaderData(headerData, {
      common,
      calcDifficultyFromHeader: blocks[14].header,
    })

    blockchain._heads['staletest'] = blockchain._headHeaderHash

    await blockchain.putHeader(forkHeader)

    assert.deepEqual(blockchain._heads['staletest'], blocks[14].hash(), 'should update stale head')
    assert.deepEqual(blockchain._headBlockHash, blocks[14].hash(), 'should update stale headBlock')
  })

  it('should delete fork header', async () => {
    const { blockchain, blocks, error } = await generateBlockchain(15)
    assert.equal(error, null, 'no error')

    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const headerData = {
      number: 15,
      parentHash: blocks[14].hash(),
      gasLimit: 8000000,
      //eslint-disable-next-line
      timestamp: BigInt(blocks[14].header.timestamp) + BigInt(1),
    }
    const forkHeader = BlockHeader.fromHeaderData(headerData, {
      common,
      calcDifficultyFromHeader: blocks[14].header,
    })

    blockchain._heads['staletest'] = blockchain._headHeaderHash

    await blockchain.putHeader(forkHeader)

    assert.deepEqual(blockchain._heads['staletest'], blocks[14].hash(), 'should update stale head')
    assert.deepEqual(blockchain._headBlockHash, blocks[14].hash(), 'should update stale headBlock')

    await blockchain.delBlock(forkHeader.hash())

    assert.deepEqual(blockchain._headHeaderHash, blocks[14].hash(), 'should reset headHeader')
    assert.deepEqual(blockchain._headBlockHash, blocks[14].hash(), 'should not change headBlock')
  })

  it('should delete blocks', async () => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    assert.equal(error, null, 'no error')

    const delNextBlock = async (number: number): Promise<any> => {
      const block = blocks[number]
      await blockchain.delBlock(block.hash())
      if (number > 6) {
        return delNextBlock(--number)
      }
    }

    await delNextBlock(9)
    assert.deepEqual(blockchain._headHeaderHash, blocks[5].hash(), 'should have block 5 as head')
  })

  it('should delete blocks and children', async () => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    assert.equal(error, null, 'no error')
    await blockchain.delBlock(blocks[1].hash())
    assert.deepEqual(blockchain._headHeaderHash, blocks[0].hash(), 'should have genesis as head')
  })

  it('should put one block at a time', async () => {
    const blocks = generateBlocks(15)
    const blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
      genesisBlock: blocks[0],
    })
    await blockchain.putBlock(blocks[1])
    await blockchain.putBlock(blocks[2])
    await blockchain.putBlock(blocks[3])
  })

  it('should test nil bodies / throw', async () => {
    const blocks = generateBlocks(3)
    const blockchain = await Blockchain.create({
      validateBlocks: false,
      validateConsensus: false,
      genesisBlock: blocks[0],
    })
    await blockchain.putHeader(blocks[1].header)
    // Should be able to get the block
    await blockchain.getBlock(BigInt(1))

    const block2HeaderValuesArray = blocks[2].header.raw()

    block2HeaderValuesArray[1] = new Uint8Array(32)
    const block2Header = BlockHeader.fromValuesArray(block2HeaderValuesArray, {
      common: blocks[2]._common,
    })
    await blockchain.putHeader(block2Header)
    try {
      await blockchain.getBlock(BigInt(2))
      assert.fail('block should not be constucted')
    } catch (e: any) {
      assert.equal(
        e.message,
        'uncle hash should be equal to hash of empty array',
        'block not constructed from empty bodies'
      )
    }
  })

  it('should put multiple blocks at once', async () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const blocks: Block[] = []
    const genesisBlock = Block.fromBlockData({ header: { gasLimit: 8000000 } }, { common })
    blocks.push(...generateBlocks(15, [genesisBlock]))
    const blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
      genesisBlock,
    })
    await blockchain.putBlocks(blocks.slice(1))
  })

  it('should validate', async () => {
    const genesisBlock = Block.fromBlockData({ header: { gasLimit: 8000000 } })
    const blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
      genesisBlock,
    })

    const invalidBlock = Block.fromBlockData({ header: { number: 50 } })
    try {
      await blockchain.putBlock(invalidBlock)
      assert.fail('should not validate an invalid block')
    } catch (error: any) {
      assert.ok(error, 'should not validate an invalid block')
    }
  })

  it('should add block with body', async () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    const genesisRlp = hexToBytes(testDataPreLondon.genesisRLP.slice(2))
    const genesisBlock = Block.fromRLPSerializedBlock(genesisRlp, { common })
    const blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
      genesisBlock,
    })

    const blockRlp = hexToBytes(testDataPreLondon.blocks[0].rlp.slice(2))
    const block = Block.fromRLPSerializedBlock(blockRlp, { common })
    await blockchain.putBlock(block)
  })

  it('uncached db ops', async () => {
    const [db, genesis] = await createTestDB()
    if (typeof genesis === 'undefined') {
      return assert.fail('genesis not defined!')
    }
    const blockchain = await Blockchain.create({ db, genesisBlock: genesis })

    const number = await blockchain.dbManager.hashToNumber(genesis?.hash())
    assert.equal(number, BigInt(0), 'should perform _hashToNumber correctly')

    const hash = await blockchain.dbManager.numberToHash(BigInt(0))
    assert.deepEqual(genesis.hash(), hash, 'should perform _numberToHash correctly')

    // cast the blockchain as <any> in order to get access to the private getTotalDifficulty
    const td = await (<any>blockchain).getTotalDifficulty(genesis.hash(), BigInt(0))
    assert.equal(td, genesis.header.difficulty, 'should perform getTotalDifficulty correctly')
  })

  it('should save headers', async () => {
    const db = new MapDB()
    const gasLimit = 8000000

    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    const genesisBlock = Block.fromBlockData({ header: { gasLimit } }, { common })
    let blockchain = await Blockchain.create({
      db,
      validateBlocks: true,
      validateConsensus: false,
      genesisBlock,
    })

    const headerData = {
      number: 1,
      parentHash: genesisBlock.hash(),
      gasLimit,
      timestamp: genesisBlock.header.timestamp + BigInt(1),
    }
    const header = BlockHeader.fromHeaderData(headerData, {
      calcDifficultyFromHeader: genesisBlock.header,
      common,
    })
    await blockchain.putHeader(header)

    blockchain = await Blockchain.create({
      db,
      validateBlocks: true,
      validateConsensus: false,
      genesisBlock,
    })

    const latestHeader = await blockchain.getCanonicalHeadHeader()
    assert.deepEqual(latestHeader.hash(), header.hash(), 'should save headHeader')

    const latestBlock = await blockchain.getCanonicalHeadBlock()
    assert.deepEqual(latestBlock.hash(), genesisBlock.hash(), 'should save headBlock')
  })

  it('should get latest', async () => {
    const gasLimit = 8000000
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const opts: BlockOptions = { common }

    const genesisBlock = Block.fromBlockData({ header: { gasLimit } }, opts)
    const blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
      genesisBlock,
    })

    const blockData = {
      header: {
        number: 1,
        parentHash: genesisBlock.hash(),
        timestamp: genesisBlock.header.timestamp + BigInt(3),
        gasLimit,
      },
    }
    opts.calcDifficultyFromHeader = genesisBlock.header
    const block = Block.fromBlockData(blockData, opts)

    const headerData1 = {
      number: 1,
      parentHash: genesisBlock.hash(),
      timestamp: genesisBlock.header.timestamp + BigInt(1),
      gasLimit,
    }
    opts.calcDifficultyFromHeader = genesisBlock.header
    const header1 = BlockHeader.fromHeaderData(headerData1, opts)
    const headers = [header1]

    const headerData2 = {
      number: 2,
      parentHash: header1.hash(),
      timestamp: header1.timestamp + BigInt(1),
      gasLimit,
    }
    opts.calcDifficultyFromHeader = block.header
    const header2 = BlockHeader.fromHeaderData(headerData2, opts)
    headers.push(header2)

    await blockchain.putHeaders(headers)

    const latestHeader = await blockchain.getCanonicalHeadHeader()
    assert.deepEqual(latestHeader.hash(), headers[1].hash(), 'should update latest header')

    const latestBlock = await blockchain.getCanonicalHeadBlock()
    assert.deepEqual(latestBlock.hash(), genesisBlock.hash(), 'should not change latest block')

    await blockchain.putBlock(block)

    const latestHeader2 = await blockchain.getCanonicalHeadHeader()
    assert.deepEqual(latestHeader2.hash(), headers[1].hash(), 'should not change latest header')

    const getBlock = await blockchain.getCanonicalHeadBlock()
    assert.deepEqual(getBlock!.hash(), block.hash(), 'should update latest block')
  })

  it('mismatched chains', async () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const gasLimit = 8000000

    const genesisBlock = Block.fromBlockData({ header: { gasLimit } }, { common })

    const blockData1 = {
      header: {
        number: 1,
        parentHash: genesisBlock.hash(),
        timestamp: genesisBlock.header.timestamp + BigInt(1),
        gasLimit,
      },
    }
    const blockData2 = {
      ...blockData1,
      number: 2,
      timestamp: genesisBlock.header.timestamp + BigInt(2),
    }

    const blocks = [
      genesisBlock,
      Block.fromBlockData(blockData1, { common, calcDifficultyFromHeader: genesisBlock.header }),
      Block.fromBlockData(blockData2, {
        common: new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Chainstart }),
        calcDifficultyFromHeader: genesisBlock.header,
      }),
    ]

    const blockchain = await Blockchain.create({
      common,
      validateBlocks: true,
      validateConsensus: false,
      genesisBlock,
    })

    for (let i = 1; i < blocks.length; i++) {
      let error
      try {
        await blockchain.putBlock(blocks[i])
      } catch (err: any) {
        error = err
      }
      if (i === 2) {
        assert.ok(error.message.match('Chain mismatch'), 'should return chain mismatch error')
      } else {
        assert.isUndefined(error, 'should not return mismatch error')
      }
    }
  })
})

describe('initialization tests', () => {
  it('should read genesis from database', async () => {
    const common = new Common({
      chain: Chain.Ropsten,
      hardfork: Hardfork.Chainstart,
    })
    const blockchain = await Blockchain.create({ common })
    const genesisHash = blockchain.genesisBlock.hash()

    assert.deepEqual(
      (await blockchain.getIteratorHead()).hash(),
      genesisHash,
      'head hash should equal expected ropsten genesis hash'
    )

    const db = blockchain.db

    const newBlockchain = await Blockchain.create({ db, common })

    assert.deepEqual(
      (await newBlockchain.getIteratorHead()).hash(),
      genesisHash,
      'head hash should be read from the provided db'
    )
  })

  it('should allow to put a custom genesis block', async () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const genesisBlock = Block.fromBlockData(
      {
        header: {
          extraData: utf8ToBytes('custom extra data'),
        },
      },
      { common }
    )
    const hash = genesisBlock.hash()
    const blockchain = await Blockchain.create({ common, genesisBlock })
    const db = blockchain.db

    assert.deepEqual(
      (await blockchain.getIteratorHead()).hash(),
      hash,
      'blockchain should put custom genesis block'
    )

    const newBlockchain = await Blockchain.create({ db, genesisBlock })
    assert.deepEqual(
      (await newBlockchain.getIteratorHead()).hash(),
      hash,
      'head hash should be read from the provided db'
    )
  })

  it('should not allow to change the genesis block in the database', async () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const genesisBlock = Block.fromBlockData(
      {
        header: {
          extraData: utf8ToBytes('custom extra data'),
        },
      },
      { common }
    )
    const hash = genesisBlock.hash()
    const blockchain = await Blockchain.create({ common, genesisBlock })
    const db = blockchain.db

    const otherGenesisBlock = Block.fromBlockData(
      {
        header: {
          extraData: utf8ToBytes('other extra data'),
        },
      },
      { common }
    )

    // assert that this is a block with a new hash
    if (equalsBytes(otherGenesisBlock.hash(), hash)) {
      assert.fail('other genesis block should have a different hash than the genesis block')
    }

    // try to put a new genesis block should throw
    try {
      await blockchain.putBlock(otherGenesisBlock)
      assert.fail('putting a genesis block did not throw')
    } catch (e: any) {
      assert.equal(
        e.message,
        'Cannot put a genesis block: create a new Blockchain',
        'putting a genesis block did throw (otherGenesisBlock not found in chain)'
      )
    }

    // trying to input a genesis block which differs from the one in db should throw on creation
    try {
      await Blockchain.create({ genesisBlock: otherGenesisBlock, db })
      assert.fail('creating blockchain with different genesis block than in db did not throw')
    } catch (e: any) {
      assert.equal(
        e.message,
        'The genesis block in the DB has a different hash than the provided genesis block.',
        'creating blockchain with different genesis block than in db throws'
      )
    }
  })

  it('should correctly derive ropsten genesis block hash and stateRoot', async () => {
    const common = new Common({ chain: Chain.Ropsten })
    const blockchain = await Blockchain.create({ common })
    const ropstenGenesisBlockHash = hexToBytes(
      '41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d'
    )
    const ropstenGenesisStateRoot = hexToBytes(
      '217b0bbcfb72e2d57e28f33cb361b9983513177755dc3f33ce3e7022ed62b77b'
    )
    assert.deepEqual(blockchain.genesisBlock.hash(), ropstenGenesisBlockHash)
    assert.deepEqual(blockchain.genesisBlock.header.stateRoot, ropstenGenesisStateRoot)
  })
})
