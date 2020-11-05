import { BN } from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import { Block, BlockHeader, BlockOptions } from '@ethereumjs/block'
import tape from 'tape'
import Blockchain from '../src'
import { generateBlockchain, generateBlocks, isConsecutive, createTestDB } from './util'
import * as testData from './testdata.json'

const level = require('level-mem')

tape('blockchain test', (t) => {
  t.test('should not crash on getting head of a blockchain without a genesis', async (st) => {
    const blockchain = new Blockchain({
      validateBlocks: true,
      validatePow: false,
    })
    await blockchain.getHead()
    st.end()
  })

  t.test('should initialize correctly', async (st) => {
    const common = new Common({ chain: 'ropsten' })
    const blockchain = new Blockchain({ common })

    const head = await blockchain.getHead()

    st.equals(head.hash().toString('hex'), common.genesis().hash.slice(2), 'correct genesis hash')
    st.end()
  })

  t.test('should add a genesis block without errors', async (st) => {
    const blockchain = new Blockchain({
      validateBlocks: true,
      validatePow: false,
    })
    const genesis = Block.genesis()
    await blockchain.putGenesis(genesis)
    st.ok(genesis.hash().equals(blockchain.meta.genesis!), 'genesis block hash should be correct')
    st.end()
  })

  t.test('should not validate a block incorrectly flagged as genesis', async (st) => {
    const blockchain = new Blockchain({
      validateBlocks: true,
      validatePow: false,
    })
    const badBlock = Block.fromBlockData({ header: { number: new BN(8) } })
    try {
      await blockchain.putBlock(badBlock, false)
    } catch (error) {
      st.ok(error, 'returned with error')
      st.end()
    }
  })

  t.test('should initialize with a genesis block', async (st) => {
    const blockchain = new Blockchain({
      validateBlocks: true,
      validatePow: false,
    })
    const blocks = await blockchain.getBlocks(0, 5, 0, false)
    st.equal(blocks!.length, 1)
    st.end()
  })

  t.test('should add 10 blocks, one at a time', async (st) => {
    const blockchain = new Blockchain({
      validateBlocks: true,
      validatePow: false,
    })
    const blocks: Block[] = []
    const gasLimit = 8000000

    const genesis = Block.genesis({ header: { gasLimit } })
    blocks.push(genesis)
    await blockchain.putGenesis(genesis)

    const addNextBlock = async (number: number) => {
      const lastBlock = blocks[number - 1]
      const blockData = {
        header: {
          number,
          parentHash: lastBlock.hash(),
          timestamp: lastBlock.header.timestamp.addn(1),
          gasLimit,
        },
      }
      const block = Block.fromBlockData(blockData, { calcDifficultyFromHeader: lastBlock.header })
      await blockchain.putBlock(block)
      blocks.push(block)

      if (blocks.length < 10) {
        await addNextBlock(number + 1)
      } else {
        const getBlocks = await blockchain.getBlocks(blocks[0].hash(), 10, 0, false)
        st.equal(getBlocks.length, 10)
        st.end()
      }
    }

    await addNextBlock(1)
  })

  t.test('should get block by number', async (st) => {
    const blockchain = new Blockchain({
      validateBlocks: true,
      validatePow: false,
    })
    const blocks: Block[] = []
    const gasLimit = 8000000

    const genesis = Block.genesis({ header: { gasLimit } })
    blocks.push(genesis)
    await blockchain.putGenesis(genesis)

    const blockData = {
      header: {
        number: 1,
        parentHash: genesis.hash(),
        timestamp: genesis.header.timestamp.addn(1),
        gasLimit,
      },
    }
    const block = Block.fromBlockData(blockData, {
      calcDifficultyFromHeader: genesis.header,
    })
    blocks.push(block)
    await blockchain.putBlock(block)

    const returnedBlock = await blockchain.getBlock(1)
    if (returnedBlock) {
      st.ok(returnedBlock.hash().equals(blocks[1].hash()))
    } else {
      st.fail('block is not defined!')
    }
    st.end()
  })

  t.test('should get block by hash', async (st) => {
    const blockchain = new Blockchain({
      validateBlocks: true,
      validatePow: false,
    })
    const gasLimit = 8000000

    const genesis = Block.genesis({ header: { gasLimit } })
    await blockchain.putGenesis(genesis)

    const block = await blockchain.getBlock(genesis.hash())
    if (block) {
      st.ok(block.hash().equals(genesis.hash()))
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
    st.ok(blocks[0].header.number.eq(getBlocks[0].header.number))
    st.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
    st.end()
  })

  t.test('should get 5 blocks, skipping 1 apart, starting from genesis hash', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: genesisHash, max: 5, skip: 1, reverse: false
    const getBlocks = await blockchain.getBlocks(blocks[0].hash(), 5, 1, false)
    st.equal(getBlocks!.length, 5, 'should get 5 blocks')
    st.ok(getBlocks![1].header.number.eq(blocks[2].header.number), 'should skip second block')
    st.ok(!isConsecutive(getBlocks!), 'blocks should not be consecutive')
    st.end()
  })

  t.test('should get 4 blocks, skipping 2 apart, starting from genesis hash', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: genesisHash, max: 4, skip: 2, reverse: false
    const getBlocks = await blockchain.getBlocks(blocks[0].hash(), 4, 2, false)
    st.equal(getBlocks!.length, 4, 'should get 4 blocks')
    st.ok(getBlocks![1].header.number.eq(blocks[3].header.number), 'should skip two blocks apart')
    st.ok(!isConsecutive(getBlocks!), 'blocks should not be consecutive')
    st.end()
  })

  t.test('should get 10 consecutive blocks, starting from genesis hash', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(15)
    st.error(error, 'no error')
    // start: genesisHash, max: 17, skip: 0, reverse: false
    const getBlocks = await blockchain.getBlocks(blocks[0].hash(), 17, 0, false)
    st.equal(getBlocks!.length, 15)
    st.ok(getBlocks![0].header.number.eq(blocks[0].header.number))
    st.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
    st.end()
  })

  t.test('should get 5 consecutive blocks, starting from block 0', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 0, max: 5, skip: 0, reverse: false
    const getBlocks = await blockchain.getBlocks(0, 5, 0, false)
    st.equal(getBlocks!.length, 5)
    st.ok(getBlocks![0].header.number.eq(blocks[0].header.number))
    st.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
    st.end()
  })

  t.test('should get 5 blocks, skipping 1 apart, starting from block 1', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 1, max: 5, skip: 1, reverse: false
    const getBlocks = await blockchain.getBlocks(1, 5, 1, false)
    st.equal(getBlocks!.length, 5)
    st.ok(getBlocks![1].header.number.eq(blocks[3].header.number), 'should skip one block')
    st.ok(!isConsecutive(getBlocks!), 'blocks should not be consecutive')
    st.end()
  })

  t.test('should get 5 blocks, skipping 2 apart, starting from block 0', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 0, max: 5, skip: 2, reverse: false
    const getBlocks = await blockchain.getBlocks(0, 5, 2, false)
    st.equal(getBlocks!.length, 5)
    st.ok(getBlocks![1].header.number.eq(blocks[3].header.number), 'should skip two blocks')
    st.ok(!isConsecutive(getBlocks!), 'blocks should not be consecutive')
    st.end()
  })

  t.test('should get 15 consecutive blocks, starting from block 0', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(15)
    st.error(error, 'no error')
    // start: 0, max: 17, skip: 0, reverse: false
    const getBlocks = await blockchain.getBlocks(0, 17, 0, false)
    st.equal(getBlocks!.length, 15)
    st.ok(getBlocks![0].header.number.eq(blocks[0].header.number))
    st.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
    st.end()
  })

  t.test('should get 5 consecutive blocks, starting from block 1', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 1, max: 5, skip: 0, reverse: false
    const getBlocks = await blockchain.getBlocks(1, 5, 0, false)
    st.equal(getBlocks!.length, 5)
    st.ok(getBlocks![0].header.number.eq(blocks[1].header.number))
    st.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
    st.end()
  })

  t.test('should get 5 consecutive blocks, starting from block 5', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 5, max: 5, skip: 0, reverse: false
    const getBlocks = await blockchain.getBlocks(5, 5, 0, false)
    st.equal(getBlocks!.length, 5)
    st.ok(getBlocks![0].header.number.eq(blocks[5].header.number))
    st.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
    st.end()
  })

  t.test('should get 5 consecutive blocks, starting from block 5, reversed', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 5, max: 5, skip: 0, reverse: true
    const getBlocks = await blockchain.getBlocks(5, 5, 0, true)
    st.equal(getBlocks!.length, 5)
    st.ok(getBlocks![0].header.number.eq(blocks[5].header.number))
    st.ok(isConsecutive(getBlocks!.reverse()), 'blocks should be consecutive')
    st.end()
  })

  t.test('should get 6 consecutive blocks, starting from block 5, reversed', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(15)
    st.error(error, 'no error')
    // start: 5, max: 15, skip: 0, reverse: true
    const getBlocks = await blockchain.getBlocks(5, 15, 0, true)
    st.equal(getBlocks!.length, 6)
    st.ok(getBlocks![0].header.number.eq(blocks[5].header.number))
    st.ok(isConsecutive(getBlocks!.reverse()), 'blocks should be consecutive')
    st.end()
  })

  t.test('should get 6 blocks, starting from block 10, reversed, skipping 1 apart', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 10, max: 10, skip: 1, reverse: true
    const getBlocks = await blockchain.getBlocks(10, 10, 1, true)
    st.equal(getBlocks!.length, 6)
    st.ok(getBlocks![1].header.number.eq(blocks[8].header.number), 'should skip one block')
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

  t.test('should iterate through 25 blocks', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    let i = 0
    await blockchain.iterator('test', (block: Block) => {
      if (block.hash().equals(blocks[i + 1].hash())) {
        i++
      }
    })
    st.equals(i, 24)
    st.end()
  })

  t.test('should catch iterator func error', async (st) => {
    const { blockchain, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    try {
      await blockchain.iterator('error', () => {
        throw new Error('iterator func error')
      })
    } catch (error) {
      st.ok(error)
      st.equal(error.message, 'iterator func error', 'should return correct error')
      st.end()
    }
  })

  t.test('should not call iterator function in an empty blockchain', async (st) => {
    const blockchain = new Blockchain({
      validateBlocks: true,
      validatePow: false,
    })

    await blockchain.iterator('test', () => {
      st.fail('should not call iterator function')
    })

    st.pass('should finish iterating')
    st.end()
  })

  t.test('should get meta.genesis', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    st.ok(blockchain.meta.rawHead.equals(blocks[24].hash()), 'should get meta.rawHead')
    st.ok(blockchain.meta.genesis.equals(blocks[0].hash()), 'should get meta.genesis')
    let i = 0
    await blockchain.iterator('test', (block: Block) => {
      if (block.hash().equals(blocks[i + 1].hash())) {
        i++
      }
    })
    st.ok(blockchain.meta.heads['test'], 'should get meta.heads')
    st.end()
  })

  t.test('should add fork header and reset stale heads', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(15)
    st.error(error, 'no error')

    await blockchain.putBlocks(blocks.slice(1))

    const common = new Common({ chain: 'mainnet', hardfork: 'chainstart' })
    const headerData = {
      number: 15,
      parentHash: blocks[14].hash(),
      gasLimit: 8000000,
      timestamp: blocks[14].header.timestamp.addn(1),
    }
    const forkHeader = BlockHeader.fromHeaderData(headerData, {
      common,
      calcDifficultyFromHeader: blocks[14].header,
    })

    blockchain._heads['staletest'] = blockchain._headHeader

    await blockchain.putHeader(forkHeader)

    st.ok(blockchain._heads['staletest'].equals(blocks[14].hash()), 'should update stale head')
    st.ok(blockchain._headBlock.equals(blocks[14].hash()), 'should update stale headBlock')
    st.end()
  })

  t.test('should delete fork header', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(15)
    st.error(error, 'no error')

    const common = new Common({ chain: 'mainnet', hardfork: 'chainstart' })
    const headerData = {
      number: 15,
      parentHash: blocks[14].hash(),
      gasLimit: 8000000,
      timestamp: blocks[14].header.timestamp.addn(1),
    }
    const forkHeader = BlockHeader.fromHeaderData(headerData, {
      common,
      calcDifficultyFromHeader: blocks[14].header,
    })

    blockchain._heads['staletest'] = blockchain._headHeader

    await blockchain.putHeader(forkHeader)

    st.ok(blockchain._heads['staletest'].equals(blocks[14].hash()), 'should update stale head')
    st.ok(blockchain._headBlock.equals(blocks[14].hash()), 'should update stale headBlock')

    await blockchain.delBlock(forkHeader.hash())

    st.ok(blockchain._headHeader.equals(blocks[14].hash()), 'should reset headHeader')
    st.ok(blockchain._headBlock.equals(blocks[14].hash()), 'should not change headBlock')
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
    st.ok(blockchain._headHeader.equals(blocks[5].hash()), 'should have block 5 as head')
    st.end()
  })

  t.test('should delete blocks and children', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    await blockchain.delBlock(blocks[1].hash())
    st.ok(blockchain._headHeader.equals(blocks[0].hash()), 'should have genesis as head')
    st.end()
  })

  t.test('should put one block at a time', async (st) => {
    const blockchain = new Blockchain({
      validateBlocks: true,
      validatePow: false,
    })
    const blocks = generateBlocks(15)
    await blockchain.putGenesis(blocks[0])
    await blockchain.putBlock(blocks[1])
    await blockchain.putBlock(blocks[2])
    await blockchain.putBlock(blocks[3])
    st.end()
  })

  t.test('should put multiple blocks at once', async (st) => {
    const blockchain = new Blockchain({
      validateBlocks: true,
      validatePow: false,
    })
    const blocks: Block[] = []
    const genesis = Block.genesis({ header: { gasLimit: 8000000 } })
    blocks.push(...generateBlocks(15, [genesis]))
    await blockchain.putGenesis(genesis)
    await blockchain.putBlocks(blocks.slice(1))
    st.end()
  })

  t.test('should get heads', async (st) => {
    const [db, genesis] = await createTestDB()
    const blockchain = new Blockchain({ db: db })
    const head = await blockchain.getHead()
    if (genesis) {
      st.ok(head.hash().equals(genesis.hash()), 'should get head')
      st.equals(
        (blockchain as any)._heads['head0'].toString('hex'),
        'abcd',
        'should get state root heads'
      )
      st.end()
    } else {
      st.fail()
    }
  })

  t.test('should validate', async (st) => {
    const blockchain = new Blockchain({
      validateBlocks: true,
      validatePow: false,
    })
    const genesis = Block.genesis({ header: { gasLimit: 8000000 } })
    await blockchain.putGenesis(genesis)

    const invalidBlock = Block.fromBlockData({ header: { number: 50 } })
    try {
      await blockchain.putBlock(invalidBlock)
      st.fail('should not validate an invalid block')
    } catch (error) {
      t.ok(error, 'should not validate an invalid block')
    }
    st.end()
  })

  t.test('should add block with body', async (st) => {
    const blockchain = new Blockchain({
      validateBlocks: true,
      validatePow: false,
    })

    const genesisRlp = Buffer.from(testData.genesisRLP.slice(2), 'hex')
    const genesis = Block.fromRLPSerializedBlock(genesisRlp, {
      initWithGenesisHeader: true,
    })
    await blockchain.putGenesis(genesis)

    const blockRlp = Buffer.from(testData.blocks[0].rlp.slice(2), 'hex')
    const block = Block.fromRLPSerializedBlock(blockRlp)
    await blockchain.putBlock(block)
    st.end()
  })

  t.test('uncached db ops', async (st) => {
    const [db, genesis] = await createTestDB()
    if (!genesis) {
      return st.fail('genesis not defined!')
    }
    const blockchain = new Blockchain({ db })

    const number = await blockchain.dbManager.hashToNumber(genesis?.hash())
    st.ok(number.isZero(), 'should perform _hashToNumber correctly')

    const hash = await blockchain.dbManager.numberToHash(new BN(0))
    st.ok(genesis.hash().equals(hash), 'should perform _numberToHash correctly')

    const td = await blockchain._getTd(genesis.hash(), new BN(0))
    st.ok(td.eq(genesis.header.difficulty), 'should perform _getTd correctly')
    st.end()
  })

  t.test('should save headers', async (st) => {
    const db = level()
    const gasLimit = 8000000

    let blockchain = new Blockchain({
      db,
      validateBlocks: true,
      validatePow: false,
    })

    const genesis = Block.genesis({ header: { gasLimit } })
    await blockchain.putGenesis(genesis)

    const headerData = {
      number: 1,
      parentHash: genesis.hash(),
      gasLimit,
      timestamp: genesis.header.timestamp.addn(1),
    }
    const header = BlockHeader.fromHeaderData(headerData, {
      calcDifficultyFromHeader: genesis.header,
    })
    await blockchain.putHeader(header)

    blockchain = new Blockchain({
      db,
      validateBlocks: true,
      validatePow: false,
    })

    const latestHeader = await blockchain.getLatestHeader()
    st.ok(latestHeader.hash().equals(header.hash()), 'should save headHeader')

    const latestBlock = await blockchain.getLatestBlock()
    st.ok(latestBlock.hash().equals(genesis.hash()), 'should save headBlock')
    st.end()
  })

  t.test('should get latest', async (st) => {
    const blockchain = new Blockchain({
      validateBlocks: true,
      validatePow: false,
    })
    const gasLimit = 8000000
    const common = new Common({ chain: 'mainnet', hardfork: 'chainstart' })
    const opts: BlockOptions = { common }

    const genesis = Block.genesis({ header: { gasLimit } }, opts)
    await blockchain.putGenesis(genesis)

    const blockData = {
      header: {
        number: 1,
        parentHash: genesis.hash(),
        timestamp: genesis.header.timestamp.addn(3),
        gasLimit,
      },
    }
    opts.calcDifficultyFromHeader = genesis.header
    const block = Block.fromBlockData(blockData, opts)

    const headerData1 = {
      number: 1,
      parentHash: genesis.hash(),
      timestamp: genesis.header.timestamp.addn(1),
      gasLimit,
    }
    opts.calcDifficultyFromHeader = genesis.header
    const header1 = BlockHeader.fromHeaderData(headerData1, opts)
    const headers = [header1]

    const headerData2 = {
      number: 2,
      parentHash: header1.hash(),
      timestamp: header1.timestamp.addn(1),
      gasLimit,
    }
    opts.calcDifficultyFromHeader = block.header
    const header2 = BlockHeader.fromHeaderData(headerData2, opts)
    headers.push(header2)

    await blockchain.putHeaders(headers)

    const latestHeader = await blockchain.getLatestHeader()
    st.ok(latestHeader.hash().equals(headers[1].hash()), 'should update latest header')

    const latestBlock = await blockchain.getLatestBlock()
    st.ok(latestBlock.hash().equals(genesis.hash()), 'should not change latest block')

    await blockchain.putBlock(block)

    const latestHeader2 = await blockchain.getLatestHeader()
    st.ok(latestHeader2.hash().equals(headers[1].hash()), 'should not change latest header')

    const getBlock = await blockchain.getLatestBlock()
    st.ok(getBlock!.hash().equals(block.hash()), 'should update latest block')
    st.end()
  })

  t.test('mismatched chains', async (st) => {
    const common = new Common({ chain: 'mainnet', hardfork: 'chainstart' })
    const blockchain = new Blockchain({
      common,
      validateBlocks: true,
      validatePow: false,
    })
    const gasLimit = 8000000

    const genesis = Block.genesis({ header: { gasLimit } }, { common })

    const blockData1 = {
      header: {
        number: 1,
        parentHash: genesis.hash(),
        timestamp: genesis.header.timestamp.addn(1),
        gasLimit,
      },
    }
    const blockData2 = {
      ...blockData1,
      number: 2,
      timestamp: genesis.header.timestamp.addn(2),
    }

    const blocks = [
      genesis,
      Block.fromBlockData(blockData1, { common, calcDifficultyFromHeader: genesis.header }),
      Block.fromBlockData(blockData2, {
        common: new Common({ chain: 'ropsten', hardfork: 'chainstart' }),
        calcDifficultyFromHeader: genesis.header,
      }),
    ]

    for (let i = 0; i < blocks.length; i++) {
      if (i === 0) {
        await blockchain.putGenesis(blocks[i])
      } else {
        let error
        try {
          await blockchain.putBlock(blocks[i])
        } catch (err) {
          error = err
        }
        if (i === 2) {
          st.ok(error.message.match('Chain mismatch'), 'should return chain mismatch error')
        } else {
          st.error(error, 'should not return mismatch error')
        }
      }
    }
    st.end()
  })
})
