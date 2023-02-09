import { Block, BlockHeader } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { MemoryLevel } from 'memory-level'
import * as tape from 'tape'

import { Blockchain } from '../src'

import * as blocksData from './testdata/blocks_mainnet.json'
import * as testDataPreLondon from './testdata/testdata_pre-london.json'
import { createTestDB, generateBlockchain, generateBlocks, isConsecutive } from './util'

import type { BlockOptions } from '@ethereumjs/block'

tape('blockchain test', (t) => {
  t.test('should not crash on getting head of a blockchain without a genesis', async (st) => {
    const blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
    })
    await blockchain.getIteratorHead()
    st.end()
  })

  t.test('should initialize correctly', async (st) => {
    const common = new Common({ chain: Chain.Ropsten })
    let blockchain = await Blockchain.create({ common })

    const iteratorHead = await blockchain.getIteratorHead()

    st.ok(
      iteratorHead.hash().equals(blockchain.genesisBlock.hash()),
      'correct genesis hash (getIteratorHead())'
    )

    blockchain = await Blockchain.create({ common, hardforkByHeadBlockNumber: true })
    st.equal(
      common.hardfork(),
      'tangerineWhistle',
      'correct HF setting with hardforkByHeadBlockNumber option'
    )
    st.end()
  })

  t.test('should initialize correctly with Blockchain.fromBlocksData()', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const blockchain = await Blockchain.fromBlocksData(blocksData, {
      validateBlocks: true,
      validateConsensus: false,
      common,
    })
    const head = await blockchain.getIteratorHead()
    st.equals(head.header.number, BigInt(0), 'correct block number')
    st.end()
  })

  t.test('should only initialize with supported consensus validation options', async (st) => {
    let common = new Common({ chain: Chain.Mainnet })
    try {
      await Blockchain.create({ common, validateConsensus: true })
      await Blockchain.create({ common, validateBlocks: true })
      common = new Common({ chain: Chain.Goerli })
      await Blockchain.create({ common, validateConsensus: true })
      await Blockchain.create({ common, validateBlocks: true })
      st.pass('should not throw')
    } catch (error) {
      st.fail('show not have thrown')
    }
  })

  t.test('should add a genesis block without errors', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const genesisBlock = Block.fromBlockData({ header: { number: 0 } }, { common })
    const blockchain = await Blockchain.create({
      common,
      validateBlocks: true,
      validateConsensus: false,
      genesisBlock,
    })
    st.ok(
      genesisBlock.hash().equals((await blockchain.getCanonicalHeadHeader()).hash()),
      'genesis block hash should be correct'
    )
    st.end()
  })

  t.test('should not validate a block incorrectly flagged as genesis', async (st) => {
    const genesisBlock = Block.fromBlockData({ header: { number: BigInt(8) } })
    try {
      await Blockchain.create({
        validateBlocks: true,
        validateConsensus: false,
        genesisBlock,
      })
    } catch (error: any) {
      st.ok(error, 'returned with error')
      st.end()
    }
  })

  t.test('should initialize with a genesis block', async (st) => {
    const blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
    })
    const blocks = await blockchain.getBlocks(0, 5, 0, false)
    st.equal(blocks!.length, 1)
    st.end()
  })

  t.test('should add 12 blocks, one at a time', async (st) => {
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
        st.equal(getBlocks.length, 12)
        st.equal(common.hardfork(), 'spuriousDragon', 'correct HF updates along block additions')
        st.end()
      }
    }

    await addNextBlock(1)
  })

  t.test('should get block by number', async (st) => {
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
      st.ok(returnedBlock.hash().equals(blocks[1].hash()))
    } else {
      st.fail('block is not defined!')
    }
    st.end()
  })

  t.test('should get block by hash', async (st) => {
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
    if (typeof block !== 'undefined') {
      st.ok(block.hash().equals(genesisBlock.hash()))
    } else {
      st.fail('block is not defined!')
    }
    st.end()
  })

  t.test('should get 5 consecutive blocks, starting from genesis hash', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: genesisHash, max: 5, skip: 0, reverse: false
    const getBlocks = await blockchain.getBlocks(blocks[0].hash(), 5, 0, false)
    st.equal(getBlocks!.length, 5)
    st.equal(blocks[0].header.number, getBlocks[0].header.number)
    st.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
    st.end()
  })

  t.test('should get 5 blocks, skipping 1 apart, starting from genesis hash', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: genesisHash, max: 5, skip: 1, reverse: false
    const getBlocks = await blockchain.getBlocks(blocks[0].hash(), 5, 1, false)
    st.equal(getBlocks!.length, 5, 'should get 5 blocks')
    st.equal(getBlocks![1].header.number, blocks[2].header.number, 'should skip second block')
    st.ok(!isConsecutive(getBlocks!), 'blocks should not be consecutive')
    st.end()
  })

  t.test('should get 4 blocks, skipping 2 apart, starting from genesis hash', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: genesisHash, max: 4, skip: 2, reverse: false
    const getBlocks = await blockchain.getBlocks(blocks[0].hash(), 4, 2, false)
    st.equal(getBlocks!.length, 4, 'should get 4 blocks')
    st.equal(getBlocks![1].header.number, blocks[3].header.number, 'should skip two blocks apart')
    st.ok(!isConsecutive(getBlocks!), 'blocks should not be consecutive')
    st.end()
  })

  t.test('should get 10 consecutive blocks, starting from genesis hash', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(15)
    st.error(error, 'no error')
    // start: genesisHash, max: 17, skip: 0, reverse: false
    const getBlocks = await blockchain.getBlocks(blocks[0].hash(), 17, 0, false)
    st.equal(getBlocks!.length, 15)
    st.equal(getBlocks![0].header.number, blocks[0].header.number)
    st.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
    st.end()
  })

  t.test('should get 5 consecutive blocks, starting from block 0', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 0, max: 5, skip: 0, reverse: false
    const getBlocks = await blockchain.getBlocks(0, 5, 0, false)
    st.equal(getBlocks!.length, 5)
    st.equal(getBlocks![0].header.number, blocks[0].header.number)
    st.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
    st.end()
  })

  t.test('should get 5 blocks, skipping 1 apart, starting from block 1', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 1, max: 5, skip: 1, reverse: false
    const getBlocks = await blockchain.getBlocks(1, 5, 1, false)
    st.equal(getBlocks!.length, 5)
    st.equal(getBlocks![1].header.number, blocks[3].header.number, 'should skip one block')
    st.ok(!isConsecutive(getBlocks!), 'blocks should not be consecutive')
    st.end()
  })

  t.test('should get 5 blocks, skipping 2 apart, starting from block 0', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 0, max: 5, skip: 2, reverse: false
    const getBlocks = await blockchain.getBlocks(0, 5, 2, false)
    st.equal(getBlocks!.length, 5)
    st.equal(getBlocks![1].header.number, blocks[3].header.number, 'should skip two blocks')
    st.ok(!isConsecutive(getBlocks!), 'blocks should not be consecutive')
    st.end()
  })

  t.test('should get 15 consecutive blocks, starting from block 0', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(15)
    st.error(error, 'no error')
    // start: 0, max: 17, skip: 0, reverse: false
    const getBlocks = await blockchain.getBlocks(0, 17, 0, false)
    st.equal(getBlocks!.length, 15)
    st.equal(getBlocks![0].header.number, blocks[0].header.number)
    st.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
    st.end()
  })

  t.test('should get 5 consecutive blocks, starting from block 1', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 1, max: 5, skip: 0, reverse: false
    const getBlocks = await blockchain.getBlocks(1, 5, 0, false)
    st.equal(getBlocks!.length, 5)
    st.equal(getBlocks![0].header.number, blocks[1].header.number)
    st.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
    st.end()
  })

  t.test('should get 5 consecutive blocks, starting from block 5', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 5, max: 5, skip: 0, reverse: false
    const getBlocks = await blockchain.getBlocks(5, 5, 0, false)
    st.equal(getBlocks!.length, 5)
    st.equal(getBlocks![0].header.number, blocks[5].header.number)
    st.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
    st.end()
  })

  t.test('should get 5 consecutive blocks, starting from block 5, reversed', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 5, max: 5, skip: 0, reverse: true
    const getBlocks = await blockchain.getBlocks(5, 5, 0, true)
    st.equal(getBlocks!.length, 5)
    st.equal(getBlocks![0].header.number, blocks[5].header.number)
    st.ok(isConsecutive(getBlocks!.reverse()), 'blocks should be consecutive')
    st.end()
  })

  t.test('should get 6 consecutive blocks, starting from block 5, reversed', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(15)
    st.error(error, 'no error')
    // start: 5, max: 15, skip: 0, reverse: true
    const getBlocks = await blockchain.getBlocks(5, 15, 0, true)
    st.equal(getBlocks!.length, 6)
    st.equal(getBlocks![0].header.number, blocks[5].header.number)
    st.ok(isConsecutive(getBlocks!.reverse()), 'blocks should be consecutive')
    st.end()
  })

  t.test('should get 6 blocks, starting from block 10, reversed, skipping 1 apart', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 10, max: 10, skip: 1, reverse: true
    const getBlocks = await blockchain.getBlocks(10, 10, 1, true)
    st.equal(getBlocks!.length, 6)
    st.equal(getBlocks![1].header.number, blocks[8].header.number, 'should skip one block')
    st.ok(!isConsecutive(getBlocks!.reverse()), 'blocks should not be consecutive')
    st.end()
  })

  t.test('should find needed hashes', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    const neededHash = Buffer.from('abcdef', 'hex')
    const hashes = await blockchain.selectNeededHashes([
      blocks[0].hash(),
      blocks[9].hash(),
      neededHash,
    ])
    st.ok(hashes[0].equals(neededHash))
    st.end()
  })

  t.test('should add fork header and reset stale heads', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(15)
    st.error(error, 'no error')

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

    st.ok(blockchain._heads['staletest'].equals(blocks[14].hash()), 'should update stale head')
    st.ok(blockchain._headBlockHash.equals(blocks[14].hash()), 'should update stale headBlock')
    st.end()
  })

  t.test('should delete fork header', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(15)
    st.error(error, 'no error')

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

    st.ok(blockchain._heads['staletest'].equals(blocks[14].hash()), 'should update stale head')
    st.ok(blockchain._headBlockHash.equals(blocks[14].hash()), 'should update stale headBlock')

    await blockchain.delBlock(forkHeader.hash())

    st.ok(blockchain._headHeaderHash.equals(blocks[14].hash()), 'should reset headHeader')
    st.ok(blockchain._headBlockHash.equals(blocks[14].hash()), 'should not change headBlock')
    st.end()
  })

  t.test('should delete blocks', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')

    const delNextBlock = async (number: number): Promise<any> => {
      const block = blocks[number]
      await blockchain.delBlock(block.hash())
      if (number > 6) {
        return delNextBlock(--number)
      }
    }

    await delNextBlock(9)
    st.ok(blockchain._headHeaderHash.equals(blocks[5].hash()), 'should have block 5 as head')
    st.end()
  })

  t.test('should delete blocks and children', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    await blockchain.delBlock(blocks[1].hash())
    st.ok(blockchain._headHeaderHash.equals(blocks[0].hash()), 'should have genesis as head')
    st.end()
  })

  t.test('should put one block at a time', async (st) => {
    const blocks = generateBlocks(15)
    const blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
      genesisBlock: blocks[0],
    })
    await blockchain.putBlock(blocks[1])
    await blockchain.putBlock(blocks[2])
    await blockchain.putBlock(blocks[3])
    st.end()
  })

  t.test('should put multiple blocks at once', async (st) => {
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
    st.end()
  })

  t.test('should validate', async (st) => {
    const genesisBlock = Block.fromBlockData({ header: { gasLimit: 8000000 } })
    const blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
      genesisBlock,
    })

    const invalidBlock = Block.fromBlockData({ header: { number: 50 } })
    try {
      await blockchain.putBlock(invalidBlock)
      st.fail('should not validate an invalid block')
    } catch (error: any) {
      t.ok(error, 'should not validate an invalid block')
    }
    st.end()
  })

  t.test('should add block with body', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    const genesisRlp = Buffer.from(testDataPreLondon.genesisRLP.slice(2), 'hex')
    const genesisBlock = Block.fromRLPSerializedBlock(genesisRlp, { common })
    const blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
      genesisBlock,
    })

    const blockRlp = Buffer.from(testDataPreLondon.blocks[0].rlp.slice(2), 'hex')
    const block = Block.fromRLPSerializedBlock(blockRlp, { common })
    await blockchain.putBlock(block)
    st.end()
  })

  t.test('uncached db ops', async (st) => {
    const [db, genesis] = await createTestDB()
    if (typeof genesis === 'undefined') {
      return st.fail('genesis not defined!')
    }
    const blockchain = await Blockchain.create({ db, genesisBlock: genesis })

    const number = await blockchain.dbManager.hashToNumber(genesis?.hash())
    st.equal(number, BigInt(0), 'should perform _hashToNumber correctly')

    const hash = await blockchain.dbManager.numberToHash(BigInt(0))
    st.ok(genesis.hash().equals(hash), 'should perform _numberToHash correctly')

    // cast the blockchain as <any> in order to get access to the private getTotalDifficulty
    const td = await (<any>blockchain).getTotalDifficulty(genesis.hash(), BigInt(0))
    st.equal(td, genesis.header.difficulty, 'should perform getTotalDifficulty correctly')
    st.end()
  })

  t.test('should save headers', async (st) => {
    const db = new MemoryLevel<string | Buffer, string | Buffer>()
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
    st.ok(latestHeader.hash().equals(header.hash()), 'should save headHeader')

    const latestBlock = await blockchain.getCanonicalHeadBlock()
    st.ok(latestBlock.hash().equals(genesisBlock.hash()), 'should save headBlock')
    st.end()
  })

  t.test('should get latest', async (st) => {
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
    st.ok(latestHeader.hash().equals(headers[1].hash()), 'should update latest header')

    const latestBlock = await blockchain.getCanonicalHeadBlock()
    st.ok(latestBlock.hash().equals(genesisBlock.hash()), 'should not change latest block')

    await blockchain.putBlock(block)

    const latestHeader2 = await blockchain.getCanonicalHeadHeader()
    st.ok(latestHeader2.hash().equals(headers[1].hash()), 'should not change latest header')

    const getBlock = await blockchain.getCanonicalHeadBlock()
    st.ok(getBlock!.hash().equals(block.hash()), 'should update latest block')
    st.end()
  })

  t.test('mismatched chains', async (st) => {
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
        st.ok(error.message.match('Chain mismatch'), 'should return chain mismatch error')
      } else {
        st.error(error, 'should not return mismatch error')
      }
    }
    st.end()
  })
})

tape('initialization tests', (t) => {
  t.test('should read genesis from database', async (st) => {
    const common = new Common({
      chain: Chain.Ropsten,
      hardfork: Hardfork.Chainstart,
    })
    const blockchain = await Blockchain.create({ common })
    const genesisHash = blockchain.genesisBlock.hash()

    st.ok(
      (await blockchain.getIteratorHead()).hash().equals(genesisHash),
      'head hash should equal expected ropsten genesis hash'
    )

    const db = blockchain.db

    const newBlockchain = await Blockchain.create({ db, common })

    st.ok(
      (await newBlockchain.getIteratorHead()).hash().equals(genesisHash),
      'head hash should be read from the provided db'
    )
    st.end()
  })

  t.test('should allow to put a custom genesis block', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const genesisBlock = Block.fromBlockData(
      {
        header: {
          extraData: Buffer.from('custom extra data'),
        },
      },
      { common }
    )
    const hash = genesisBlock.hash()
    const blockchain = await Blockchain.create({ common, genesisBlock })
    const db = blockchain.db

    st.ok(
      (await blockchain.getIteratorHead()).hash().equals(hash),
      'blockchain should put custom genesis block'
    )

    const newBlockchain = await Blockchain.create({ db, genesisBlock })
    st.ok(
      (await newBlockchain.getIteratorHead()).hash().equals(hash),
      'head hash should be read from the provided db'
    )
    st.end()
  })

  t.test('should not allow to change the genesis block in the database', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const genesisBlock = Block.fromBlockData(
      {
        header: {
          extraData: Buffer.from('custom extra data'),
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
          extraData: Buffer.from('other extra data'),
        },
      },
      { common }
    )

    // assert that this is a block with a new hash
    if (otherGenesisBlock.hash().equals(hash)) {
      st.fail('other genesis block should have a different hash than the genesis block')
    }

    // try to put a new genesis block should throw
    try {
      await blockchain.putBlock(otherGenesisBlock)
      st.fail('putting a genesis block did not throw')
    } catch (e: any) {
      st.pass('putting a genesis block did throw')
    }

    // trying to input a genesis block which differs from the one in db should throw on creation
    try {
      await Blockchain.create({ genesisBlock: otherGenesisBlock, db })
      st.fail('creating blockchain with different genesis block than in db did not throw')
    } catch (e: any) {
      st.pass('creating blockchain with different genesis block than in db throws')
    }

    st.end()
  })

  t.test('should correctly derive ropsten genesis block hash and stateRoot', async (st) => {
    const common = new Common({ chain: Chain.Ropsten })
    const blockchain = await Blockchain.create({ common })
    const ropstenGenesisBlockHash = Buffer.from(
      '41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d',
      'hex'
    )
    const ropstenGenesisStateRoot = Buffer.from(
      '217b0bbcfb72e2d57e28f33cb361b9983513177755dc3f33ce3e7022ed62b77b',
      'hex'
    )
    st.ok(blockchain.genesisBlock.hash().equals(ropstenGenesisBlockHash))
    st.ok(blockchain.genesisBlock.header.stateRoot.equals(ropstenGenesisStateRoot))
    st.end()
  })
})
