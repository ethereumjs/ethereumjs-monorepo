import Common, { Chain, Hardfork, CliqueConfig } from '@ethereumjs/common'
import { Block, BlockHeader, BlockOptions } from '@ethereumjs/block'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { bytesToHex } from 'ethereum-cryptography/utils'
import { Address, toBuffer } from 'ethereumjs-util'
import RLP from 'rlp'
import tape from 'tape'
import Blockchain from '../src'
import {
  generateBlockchain,
  generateBlocks,
  isConsecutive,
  createTestDB,
  createBlock,
} from './util'
import * as testDataPreLondon from './testdata/testdata_pre-london.json'
import blocksData from './testdata/blocks_mainnet.json'
const blocksTestDataPreLondon = require('./testdata/blocks_testdata_pre-london.json')
const blocksTestDataPreLondon2 = require('./testdata/blocks_testdata_pre-london-2.json')

const level = require('level-mem')

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
    if (returnedBlock) {
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
    if (block) {
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

  t.test('should iterate through 24 blocks', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    let i = 0
    const iterated = await blockchain.iterator('test', (block: Block) => {
      if (block.hash().equals(blocks[i + 1].hash())) {
        i++
      }
    })
    st.equal(iterated, 24)
    st.equal(i, 24)
    st.end()
  })

  t.test(
    'should iterate through maxBlocks blocks if maxBlocks parameter is provided',
    async (st) => {
      const { blockchain, blocks, error } = await generateBlockchain(25)
      st.error(error, 'no error')
      let i = 0
      const iterated = await blockchain.iterator(
        'test',
        (block: Block) => {
          if (block.hash().equals(blocks[i + 1].hash())) {
            i++
          }
        },
        5
      )
      st.equal(iterated, 5)
      st.equal(i, 5)
      st.end()
    }
  )

  t.test(
    'should iterate through 0 blocks in case 0 maxBlocks parameter is provided',
    async (st) => {
      const { blockchain, blocks, error } = await generateBlockchain(25)
      st.error(error, 'no error')
      let i = 0
      const iterated = await blockchain
        .iterator(
          'test',
          (block: Block) => {
            if (block.hash().equals(blocks[i + 1].hash())) {
              i++
            }
          },
          0
        )
        .catch(() => {
          st.fail('Promise cannot throw when running 0 blocks')
        })
      st.equal(iterated, 0)
      st.equal(i, 0)
      st.end()
    }
  )

  t.test('should throw on a negative maxBlocks parameter in iterator', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    let i = 0
    await blockchain
      .iterator(
        'test',
        (block: Block) => {
          if (block.hash().equals(blocks[i + 1].hash())) {
            i++
          }
        },
        -1
      )
      .catch(() => {
        st.end()
      })
    // Note: if st.end() is not called (Promise did not throw), then this test fails, as it does not end.
  })

  t.test('should test setIteratorHead method', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')

    const headBlockIndex = 5

    const headHash = blocks[headBlockIndex].hash()
    await blockchain.setIteratorHead('myHead', headHash)
    const currentHeadBlock = await blockchain.getIteratorHead('myHead')

    st.ok(headHash.equals(currentHeadBlock.hash()), 'head hash equals the provided head hash')

    let i = 0
    // check that iterator starts from this head block
    await blockchain.iterator(
      'myHead',
      (block: Block) => {
        if (block.hash().equals(blocks[headBlockIndex + 1].hash())) {
          i++
        }
      },
      5
    )

    st.equal(i, 1)

    st.end()
  })

  t.test('should catch iterator func error', async (st) => {
    const { blockchain, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    try {
      await blockchain.iterator('error', () => {
        throw new Error('iterator func error')
      })
    } catch (error: any) {
      st.ok(error)
      st.equal(error.message, 'iterator func error', 'should return correct error')
      st.end()
    }
  })

  t.test('should not call iterator function in an empty blockchain', async (st) => {
    const blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
    })

    await blockchain.iterator('test', () => {
      st.fail('should not call iterator function')
    })

    st.pass('should finish iterating')
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

  t.test('should get heads', async (st) => {
    const [db, genesis] = await createTestDB()
    const blockchain = await Blockchain.create({ db, genesisBlock: genesis })
    const head = await blockchain.getIteratorHead()
    if (genesis) {
      st.ok(head.hash().equals(genesis.hash()), 'should get head')
      st.equal(
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
    if (!genesis) {
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
    const db = level()
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

tape('block & block header validation tests', (t) => {
  t.test('should validate extraData', async function (st) {
    // PoW
    let common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    let blockchain = await Blockchain.create({ common })
    let genesis = Block.fromBlockData({}, { common })

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
      await blockchain.validateBlockHeader(header)
      st.pass(testCase)
    } catch (error: any) {
      st.fail(testCase)
    }

    // valid extraData: fewer than limit
    testCase = 'pow block should validate with 12 bytes of extraData'
    extraData = Buffer.alloc(12)
    header = BlockHeader.fromHeaderData({ ...data, extraData }, opts)
    try {
      await blockchain.validateBlockHeader(header)
      st.ok(testCase)
    } catch (error: any) {
      st.fail(testCase)
    }

    // extraData beyond limit
    testCase = 'pow block should throw with excess amount of extraData'
    extraData = Buffer.alloc(42)
    try {
      header = BlockHeader.fromHeaderData({ ...data, extraData }, opts)
      st.fail(testCase)
    } catch (error: any) {
      st.ok(error.message.includes('invalid amount of extra data'), testCase)
    }

    // PoA
    common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.Chainstart })
    blockchain = await Blockchain.create({ common })
    genesis = Block.fromBlockData({}, { common })

    parentHash = genesis.hash()
    gasLimit = genesis.header.gasLimit
    data = { number, parentHash, timestamp, gasLimit, difficulty: BigInt(1) } as any
    const cliqueSigner = Buffer.from(
      '64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993',
      'hex'
    )
    opts = { common, cliqueSigner } as any

    // valid extraData (32 byte vanity + 65 byte seal)
    testCase =
      'clique block should validate with valid number of bytes in extraData: 32 byte vanity + 65 byte seal'
    extraData = Buffer.concat([Buffer.alloc(32), Buffer.alloc(65)])
    header = BlockHeader.fromHeaderData({ ...data, extraData }, opts)
    try {
      await blockchain.validateBlockHeader(header)
      t.pass(testCase)
    } catch (error: any) {
      t.fail(testCase)
    }

    // invalid extraData length
    testCase = 'clique block should throw on invalid extraData length'
    extraData = Buffer.alloc(32)
    try {
      header = BlockHeader.fromHeaderData({ ...data, extraData }, { common })
      await blockchain.validateBlockHeader(header)
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
    const epoch = BigInt((common.consensusConfig() as CliqueConfig).epoch)
    try {
      header = BlockHeader.fromHeaderData({ ...data, number: epoch, extraData }, opts)
      await blockchain.validateBlockHeader(header)
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

  // TODO: fix these tests
  // consensus validation is failing because "coinbase must be filled with zeros on epoch transition blocks".
  // problem with testdata or problem with the code?
  t.test('header validation -> poa checks', async function (st) {
    const headerData = blocksTestDataPreLondon.blocks[0].blockHeader

    let common = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Istanbul })

    const cliqueSigner = Buffer.from(
      '64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993',
      'hex'
    )
    let opts = { common, cliqueSigner } as any

    const genesisRlp = toBuffer(blocksTestDataPreLondon.genesisRLP)
    const block = Block.fromRLPSerializedBlock(genesisRlp, opts)
    const blockchain = await Blockchain.create({ common, genesisBlock: block })

    headerData.number = 1
    headerData.timestamp = BigInt(1422494850)
    headerData.extraData = Buffer.alloc(97)
    headerData.mixHash = Buffer.alloc(32)
    headerData.difficulty = BigInt(2)

    let header: BlockHeader, parentHeader: BlockHeader

    let testCase = 'should throw on lower than period timestamp diffs'
    try {
      header = BlockHeader.fromHeaderData(headerData, opts)
      await blockchain.validateBlockHeader(header)
      st.fail(testCase)
    } catch (error: any) {
      st.ok(error.message.includes('invalid timestamp diff (lower than period)'), testCase)
    }

    testCase = 'should not throw on timestamp diff equal to period'
    headerData.timestamp = BigInt(1422494864)
    try {
      header = BlockHeader.fromHeaderData(headerData, opts)
      await blockchain.validateBlockHeader(header)
      st.pass(testCase)
    } catch (error: any) {
      st.fail(testCase)
    }

    testCase = 'should throw on non-zero beneficiary (coinbase) for epoch transition block'
    headerData.number = common.consensusConfig().epoch
    headerData.coinbase = Address.fromString('0x091dcd914fCEB1d47423e532955d1E62d1b2dAEf')
    try {
      header = BlockHeader.fromHeaderData(headerData, opts)
      await blockchain.validateBlockHeader(header)
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
    try {
      header = BlockHeader.fromHeaderData(headerData, opts)
      await blockchain.validateBlockHeader(header)
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
    headerData.difficulty = BigInt(3)
    try {
      header = BlockHeader.fromHeaderData(headerData, opts)
      parentHeader = (await blockchain.getBlock(header.parentHash)).header
      blockchain.validateDifficulty(header, parentHeader)
      st.fail(testCase)
    } catch (error: any) {
      if (error.message.includes('difficulty for clique block must be INTURN (2) or NOTURN (1)')) {
        st.pass('error thrown on invalid clique difficulty')
      } else {
        st.fail('should throw with appropriate error')
      }
    }

    testCase = 'validateCliqueDifficulty() should return true with NOTURN difficulty and one signer'
    headerData.difficulty = BigInt(2)
    common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.Chainstart })
    opts = { common, cliqueSigner } as any

    const poaBlockchain = await Blockchain.create({ common })
    const poaBlock = Block.fromRLPSerializedBlock(blocksTestDataPreLondon.genesisRLP, {
      common,
      cliqueSigner,
    })
    await poaBlockchain.putBlock(poaBlock)

    header = BlockHeader.fromHeaderData(headerData, { common, cliqueSigner })
    parentHeader = (await poaBlockchain.getBlock(header.parentHash)).header
    try {
      const res = poaBlockchain.validateDifficulty(header, parentHeader)
      st.equal(res, true, testCase)
    } catch (error: any) {
      st.fail(testCase)
    }

    testCase =
      'validateCliqueDifficulty() should return false with INTURN difficulty and one signer'
    headerData.difficulty = BigInt(1)
    header = BlockHeader.fromHeaderData(headerData, { common, cliqueSigner })
    parentHeader = (await poaBlockchain.getBlock(header.parentHash)).header
    try {
      const res = poaBlockchain.validateDifficulty(header, parentHeader)
      st.equal(res, false, testCase)
    } catch (error: any) {
      st.fail(testCase)
    }
    st.end()
  })

  t.test('should test validateDifficulty() for pow chains', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const genesis = Block.fromBlockData({}, { common })
    const blockchain = await Blockchain.create({ common })

    const nextBlockHeaderData = {
      number: genesis.header.number + BigInt(1),
      timestamp: genesis.header.timestamp + BigInt(10),
    }

    const blockWithDifficultyCalculation = Block.fromBlockData(
      {
        header: nextBlockHeaderData,
      },
      {
        calcDifficultyFromHeader: genesis.header,
      }
    )

    st.ok(
      blockchain.validateDifficulty(blockWithDifficultyCalculation.header, genesis.header),
      'difficulty should be valid if difficulty header is provided'
    )

    st.end()
  })

  t.test('should test validateGasLimit()', async function (st) {
    const testData = require('./testdata/bcBlockGasLimitTest.json').tests
    const bcBlockGasLimitTestData = testData.BlockGasLimit2p63m1

    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
    const blockchain = await Blockchain.create({ common })

    Object.keys(bcBlockGasLimitTestData).forEach((key) => {
      const genesisRlp = bcBlockGasLimitTestData[key].genesisRLP
      const parentBlock = Block.fromRLPSerializedBlock(genesisRlp)
      const blockRlp = bcBlockGasLimitTestData[key].blocks[0].rlp
      const block = Block.fromRLPSerializedBlock(blockRlp)
      st.equal(blockchain.validateGasLimit(block.header, parentBlock.header), true)
    })

    st.end()
  })

  t.test('should test uncles hash validation', async function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    const blockchain = await Blockchain.create({ common })
    const blockRlp = toBuffer(blocksTestDataPreLondon2.blocks[2].rlp)
    const block = Block.fromRLPSerializedBlock(blockRlp, { common, freeze: false })
    st.equal(block.validateUnclesHash(), true)
    ;(block.header as any).uncleHash = Buffer.alloc(32)
    try {
      await blockchain.validateBlockUncles(block)
      st.fail('should throw')
    } catch (error: any) {
      st.ok(error.message.includes('invalid uncle hash'))
    }
    st.end()
  })

  t.test('should throw if an uncle is listed twice', async function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const blockchain = await Blockchain.create({ common })

    const genesis = Block.fromBlockData({}, { common })

    const uncleBlock1 = createBlock(genesis, 'uncle', [], common)

    const block1 = createBlock(genesis, 'block1', [], common)
    const block2 = createBlock(block1, 'block1', [uncleBlock1.header, uncleBlock1.header], common)

    await blockchain.putBlock(uncleBlock1)
    await blockchain.putBlock(block1)
    await blockchain.putBlock(block2)

    try {
      await blockchain.validateBlockUncles(block2)
      st.fail('cannot reach this')
    } catch (e: any) {
      st.pass('block throws if the uncle is included twice in the block')
    }
  })

  t.test('should throw if an uncle is included before', async function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const blockchain = await Blockchain.create({ common })

    const genesis = Block.fromBlockData({}, { common })

    const uncleBlock = createBlock(genesis, 'uncle', [], common)

    const block1 = createBlock(genesis, 'block1', [], common)
    const block2 = createBlock(block1, 'block2', [uncleBlock.header], common)
    const block3 = createBlock(block2, 'block3', [uncleBlock.header], common)

    await blockchain.putBlock(uncleBlock)
    await blockchain.putBlock(block1)
    await blockchain.putBlock(block2)
    await blockchain.putBlock(block3)

    await blockchain.validateBlockUncles(uncleBlock)

    await blockchain.validateBlockUncles(block1)
    await blockchain.validateBlockUncles(block2)

    try {
      await blockchain.validateBlockUncles(block3)
      st.fail('cannot reach this')
    } catch (e: any) {
      st.pass('block throws if uncle is already included')
    }
  })

  t.test(
    'should throw if the uncle parent block is not part of the canonical chain',
    async function (st) {
      const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
      const blockchain = await Blockchain.create({ common })

      const genesis = Block.fromBlockData({}, { common })

      const emptyBlock = Block.fromBlockData({ header: { number: BigInt(1) } }, { common })

      //assertion
      if (emptyBlock.hash().equals(genesis.hash())) {
        st.fail('should create an unique bogus block')
      }

      await blockchain.putBlock(emptyBlock)

      const uncleBlock = createBlock(emptyBlock, 'uncle', [], common)
      const block1 = createBlock(genesis, 'block1', [], common)
      const block2 = createBlock(block1, 'block2', [], common)
      const block3 = createBlock(block2, 'block3', [uncleBlock.header], common)

      await blockchain.putBlock(uncleBlock)
      await blockchain.putBlock(block1)
      await blockchain.putBlock(block2)
      await blockchain.putBlock(block3)

      try {
        await blockchain.validateBlockUncles(block3)
        st.fail('cannot reach this')
      } catch (e: any) {
        st.pass('block throws if uncle parent hash is not part of the canonical chain')
      }
    }
  )

  t.test('should throw if the uncle is too old', async function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const blockchain = await Blockchain.create({ common })

    const genesis = Block.fromBlockData({}, { common })

    const uncleBlock = createBlock(genesis, 'uncle', [], common)

    let lastBlock = genesis
    for (let i = 0; i < 7; i++) {
      const block = createBlock(lastBlock, 'block' + i.toString(), [], common)
      await blockchain.putBlock(block)
      lastBlock = block
    }

    const blockWithUnclesTooOld = createBlock(
      lastBlock,
      'too-old-uncle',
      [uncleBlock.header],
      common
    )

    try {
      await blockchain.validateBlockUncles(blockWithUnclesTooOld)
      st.fail('cannot reach this')
    } catch (e: any) {
      st.pass('block throws uncle is too old')
    }
  })

  t.test('should throw if uncle is too young', async function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const blockchain = await Blockchain.create({ common })

    const genesis = Block.fromBlockData({}, { common })

    const uncleBlock = createBlock(genesis, 'uncle', [], common)
    const block1 = createBlock(genesis, 'block1', [uncleBlock.header], common)

    await blockchain.putBlock(uncleBlock)
    await blockchain.putBlock(block1)

    try {
      await blockchain.validateBlockUncles(block1)
      st.fail('cannot reach this')
    } catch (e: any) {
      st.pass('block throws uncle is too young')
    }
  })

  t.test('should throw if the uncle header is invalid', async function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const blockchain = await Blockchain.create({ common })

    const genesis = Block.fromBlockData({}, { common })

    const uncleBlock = Block.fromBlockData(
      {
        header: {
          number: genesis.header.number + BigInt(1),
          parentHash: genesis.hash(),
          timestamp: genesis.header.timestamp + BigInt(1),
          gasLimit: BigInt(5000),
          difficulty: BigInt(0), // invalid difficulty
        },
      },
      { common }
    )

    const block1 = createBlock(genesis, 'block1', [], common)
    const block2 = createBlock(block1, 'block2', [uncleBlock.header], common)

    await blockchain.putBlock(uncleBlock)
    await blockchain.putBlock(block1)
    await blockchain.putBlock(block2)

    try {
      await blockchain.validateBlockUncles(block2)
      st.fail('cannot reach this')
    } catch (e: any) {
      st.pass('block throws uncle header is invalid')
    }
  })

  t.test('throws if more than 2 uncles included', async function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const blockchain = await Blockchain.create({ common })

    const genesis = Block.fromBlockData({}, { common })

    const uncleBlock1 = createBlock(genesis, 'uncle1', [], common)
    const uncleBlock2 = createBlock(genesis, 'uncle2', [], common)
    const uncleBlock3 = createBlock(genesis, 'uncle3', [], common)

    // sanity check
    if (
      uncleBlock1.hash().equals(uncleBlock2.hash()) ||
      uncleBlock2.hash().equals(uncleBlock3.hash())
    ) {
      st.fail('uncles 1/2/3 should be unique')
    }

    const block1 = createBlock(genesis, 'block1', [], common)
    const block2 = createBlock(
      block1,
      'block1',
      [uncleBlock1.header, uncleBlock2.header, uncleBlock3.header],
      common
    )

    await blockchain.putBlock(uncleBlock1)
    await blockchain.putBlock(uncleBlock2)
    await blockchain.putBlock(uncleBlock3)
    await blockchain.putBlock(block1)
    await blockchain.putBlock(block2)

    try {
      await blockchain.validateBlockUncles(block2)
      st.fail('cannot reach this')
    } catch (e: any) {
      st.pass('block throws if more than 2 uncles are included')
    }
  })

  t.test('throws if uncle is a canonical block', async function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const blockchain = await Blockchain.create({ common })

    const genesis = Block.fromBlockData({}, { common })

    const block1 = createBlock(genesis, 'block1', [], common)
    const block2 = createBlock(block1, 'block2', [block1.header], common)

    await blockchain.putBlock(block1)
    await blockchain.putBlock(block2)

    try {
      await blockchain.validateBlockUncles(block2)
      st.fail('cannot reach this')
    } catch (e: any) {
      st.pass('block throws if an uncle is a canonical block')
    }
  })

  t.test('successfully validates uncles', async function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const blockchain = await Blockchain.create({ common })

    const genesis = Block.fromBlockData({}, { common })

    const uncleBlock = createBlock(genesis, 'uncle', [], common)
    await blockchain.putBlock(uncleBlock)

    const block1 = createBlock(genesis, 'block1', [], common)
    const block2 = createBlock(block1, 'block2', [uncleBlock.header], common)

    await blockchain.putBlock(block1)
    await blockchain.putBlock(block2)

    await blockchain.validateBlockUncles(block1)
    await blockchain.validateBlockUncles(block2)
    st.pass('uncle blocks validated succesfully')
  })

  t.test(
    'should select the right hardfork for uncles at a hardfork transition',
    async function (st) {
      /**
       * This test creates a chain around mainnet fork blocks:
       *      berlin         london
       *                |     |-> u <---|
       * @ -> @ -> @ ---|---> @ -> @ -> @
       * |-> u <---|               | -> @
       *    ^----------------------------
       * @ = block
       * u = uncle block
       *
       * There are 3 pre-fork blocks, with 1 pre-fork uncle
       * There are 3 blocks after the fork, with 1 uncle after the fork
       *
       * The following situations are tested:
       * Pre-fork block can have legacy uncles
       * London block has london uncles
       * London block has legacy uncles
       * London block has legacy uncles, where hardforkByBlockNumber set to false (this should throw)
       *    In this situation, the london block creates a london uncle, but this london uncle should be
       *    a berlin block, and therefore has no base fee. But, since common is still london, base fee
       *    is expected
       * It is tested that common does not change
       */

      const common = new Common({ chain: Chain.Mainnet })
      common.setHardfork(Hardfork.Berlin)

      const blockchain = await Blockchain.create({ common })

      const mainnetForkBlock = common.hardforkBlock(Hardfork.London)
      const rootBlock = Block.fromBlockData(
        {
          header: {
            number: mainnetForkBlock! - BigInt(3),
            gasLimit: BigInt(5000),
          },
        },
        { common }
      )

      await blockchain.putBlock(rootBlock)

      const unclePreFork = createBlock(rootBlock, 'unclePreFork', [], common)
      const canonicalBlock = createBlock(rootBlock, 'canonicalBlock', [], common)
      await blockchain.putBlock(canonicalBlock)
      const preForkBlock = createBlock(
        canonicalBlock,
        'preForkBlock',
        [unclePreFork.header],
        common
      )
      await blockchain.putBlock(preForkBlock)
      common.setHardfork(Hardfork.London)
      const forkBlock = createBlock(preForkBlock, 'forkBlock', [], common)
      await blockchain.putBlock(forkBlock)
      const uncleFork = createBlock(forkBlock, 'uncleFork', [], common)
      const canonicalBlock2 = createBlock(forkBlock, 'canonicalBlock2', [], common)
      const forkBlock2 = createBlock(canonicalBlock2, 'forkBlock2', [uncleFork.header], common)
      await blockchain.putBlock(canonicalBlock2)
      await blockchain.putBlock(forkBlock)
      await blockchain.validateBlockUncles(preForkBlock)

      st.equal(common.hardfork(), Hardfork.London, 'validation did not change common hardfork')
      await blockchain.validateBlockUncles(forkBlock2)

      st.equal(common.hardfork(), Hardfork.London, 'validation did not change common hardfork')

      const forkBlock2HeaderData = forkBlock2.header.toJSON()
      const uncleHeaderData = unclePreFork.header.toJSON()

      uncleHeaderData.extraData = '0xffff'
      const uncleHeader = BlockHeader.fromHeaderData(uncleHeaderData, {
        common: new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin }),
      })

      forkBlock2HeaderData.uncleHash = '0x' + bytesToHex(keccak256(RLP.encode([uncleHeader.raw()])))

      const forkBlock_ValidCommon = Block.fromBlockData(
        {
          header: forkBlock2HeaderData,
          uncleHeaders: [uncleHeaderData],
        },
        {
          common,
        }
      )

      await blockchain.validateBlockUncles(forkBlock_ValidCommon)

      st.pass('successfully validated a pre-london uncle on a london block')
      st.equal(common.hardfork(), Hardfork.London, 'validation did not change common hardfork')

      const forkBlock_InvalidCommon = Block.fromBlockData(
        {
          header: forkBlock2HeaderData,
          uncleHeaders: [uncleHeaderData],
        },
        {
          common,
          hardforkByBlockNumber: false,
        }
      )

      try {
        await blockchain.validateBlockUncles(forkBlock_InvalidCommon)
        st.fail('cannot reach this')
      } catch (e: any) {
        st.ok(
          e.message.includes('with EIP1559 being activated'),
          'explicitly set hardforkByBlockNumber to false, pre-london block interpreted as london block and succesfully failed'
        )
      }

      st.equal(common.hardfork(), Hardfork.London, 'validation did not change common hardfork')
    }
  )
})

tape('EIP1559 header validation tests', async (t) => {
  const common = new Common({
    eips: [1559],
    chain: Chain.Mainnet,
    hardfork: Hardfork.London,
  })

  const blockchain1 = await Blockchain.create({ common })
  const blockchain2 = await Blockchain.create({ common })

  const genesis = Block.fromBlockData({})

  // Small hack to hack in the activation block number
  // (Otherwise there would be need for a custom chain only for testing purposes)
  common.hardforkBlock = function (hardfork: string | undefined) {
    if (hardfork === 'london') {
      return BigInt(1)
    } else if (hardfork === 'dao') {
      // Avoid DAO HF side-effects
      return BigInt(99)
    }
    return BigInt(0)
  }

  t.test('Initialize test suite', async function (st) {
    await blockchain1.putBlock(genesis)
    await blockchain2.putBlock(genesis)
    st.end()
  })

  t.test('Header -> validate()', async function (st) {
    const header = BlockHeader.fromHeaderData(
      {
        number: BigInt(1),
        parentHash: genesis.hash(),
        gasLimit: genesis.header.gasLimit * BigInt(2), // Special case on EIP-1559 transition block
        timestamp: BigInt(1),
        baseFeePerGas: 100,
      },
      {
        calcDifficultyFromHeader: genesis.header,
        common,
        freeze: false,
      }
    )

    try {
      await blockchain1.validateBlockHeader(header)
      st.fail('should throw when baseFeePerGas is not set to initial base fee')
    } catch (e: any) {
      const expectedError = 'Initial EIP1559 block does not have initial base fee'
      st.ok(
        e.message.includes(expectedError),
        'should throw if base fee is not set to initial value'
      )
    }

    try {
      ;(header as any).baseFeePerGas = undefined
      await blockchain1.validateBlockHeader(header)
    } catch (e: any) {
      const expectedError = 'EIP1559 block has no base fee field'
      st.ok(
        e.message.includes(expectedError),
        'should throw with no base fee field when EIP1559 is activated'
      )
    }

    ;(header as any).baseFeePerGas = BigInt(7) // reset for next test
    const block = Block.fromBlockData({ header }, { common })
    try {
      const blockchain = Object.create(blockchain1)
      await blockchain.putBlock(block)
      const header = BlockHeader.fromHeaderData(
        {
          number: BigInt(2),
          parentHash: block.hash(),
          gasLimit: block.header.gasLimit,
          timestamp: BigInt(10),
          baseFeePerGas: BigInt(1000),
        },
        {
          calcDifficultyFromHeader: block.header,
          common,
        }
      )
      await blockchain.validateBlockHeader(header)
    } catch (e: any) {
      const expectedError = 'Invalid block: base fee not correct'
      st.ok(e.message.includes(expectedError), 'should throw when base fee is not correct')
    }

    st.end()
  })

  const block1 = Block.fromBlockData(
    {
      header: {
        number: BigInt(1),
        parentHash: genesis.hash(),
        gasLimit: genesis.header.gasLimit * BigInt(2), // Special case on EIP-1559 transition block
        timestamp: BigInt(1),
        baseFeePerGas: common.param('gasConfig', 'initialBaseFee'),
      },
    },
    {
      calcDifficultyFromHeader: genesis.header,
      common,
    }
  )

  t.test('Header -> validate() -> success case', async function (st) {
    await blockchain1.validateBlockHeader(block1.header)
    await blockchain2.putBlock(block1)
    st.pass('Valid initial EIP1559 header should be valid')

    st.end()
  })

  t.test('Header -> validate()', async function (st) {
    const header = BlockHeader.fromHeaderData(
      {
        baseFeePerGas: BigInt(1000),
        number: BigInt(1),
        parentHash: genesis.hash(),
        gasLimit: genesis.header.gasLimit * BigInt(2), // Special case on EIP-1559 transition block
        timestamp: BigInt(1),
      },
      {
        calcDifficultyFromHeader: genesis.header,
        common,
      }
    )

    try {
      await blockchain1.validateBlockHeader(header)
      st.fail('should throw')
    } catch (e: any) {
      st.ok(e.message.includes('base fee'), 'should throw on wrong initial base fee')
    }
    st.end()
  })

  t.test('Header -> validate() -> success cases', async function (st) {
    const block = Block.fromBlockData(
      {
        header: {
          number: BigInt(2),
          parentHash: block1.hash(),
          timestamp: BigInt(2),
          gasLimit: genesis.header.gasLimit * BigInt(2), // Special case on EIP-1559 transition block
          baseFeePerGas: Buffer.from('342770c0', 'hex'),
        },
      },
      {
        calcDifficultyFromHeader: block1.header,
        common,
      }
    )
    // blockchain2 has block 1 added at this moment (see test above)
    await blockchain2.validateBlockHeader(block.header)
    st.pass('should correctly validate subsequent EIP-1559 blocks')
    st.end()
  })

  t.test('Header -> validate() -> gas usage', async function (st) {
    const header = BlockHeader.fromHeaderData(
      {
        number: BigInt(1),
        parentHash: genesis.hash(),
        timestamp: BigInt(1),
        gasLimit: genesis.header.gasLimit * BigInt(2), // Special case on EIP-1559 transition block
        gasUsed:
          genesis.header.gasLimit *
            (common.param('gasConfig', 'elasticityMultiplier') ?? BigInt(0)) +
          BigInt(1),
        baseFeePerGas: common.param('gasConfig', 'initialBaseFee'),
      },
      {
        calcDifficultyFromHeader: genesis.header,
        common,
      }
    )

    try {
      await blockchain1.validateBlockHeader(header)
      st.fail('should throw')
    } catch (e: any) {
      st.ok(e.message.includes('too much gas used'), 'should throw when elasticity is exceeded')
    }
    st.end()
  })

  t.test('Header -> validate() -> gas usage', async function (st) {
    const header = BlockHeader.fromHeaderData(
      {
        number: BigInt(1),
        parentHash: genesis.hash(),
        timestamp: BigInt(1),
        gasLimit: genesis.header.gasLimit * BigInt(2), // Special case on EIP-1559 transition block
        gasUsed: genesis.header.gasLimit * BigInt(2),
        baseFeePerGas: common.param('gasConfig', 'initialBaseFee'),
      },
      {
        calcDifficultyFromHeader: genesis.header,
        common,
      }
    )

    await blockchain1.validateBlockHeader(header)
    st.pass('should not throw when elasticity is exactly matched')
    st.end()
  })

  t.test('Header -> validate() -> gasLimit -> success cases', async function (st) {
    let parentGasLimit = genesis.header.gasLimit * BigInt(2)
    let header = BlockHeader.fromHeaderData(
      {
        number: BigInt(1),
        parentHash: genesis.hash(),
        timestamp: BigInt(1),
        gasLimit: parentGasLimit + parentGasLimit / BigInt(1024) - BigInt(1),
        baseFeePerGas: common.param('gasConfig', 'initialBaseFee'),
      },
      {
        calcDifficultyFromHeader: genesis.header,
        common,
      }
    )
    await blockchain1.validateBlockHeader(header)
    st.pass('should not throw if gas limit is between bounds (HF transition block)')

    header = BlockHeader.fromHeaderData(
      {
        number: BigInt(1),
        parentHash: genesis.hash(),
        timestamp: BigInt(1),
        gasLimit: parentGasLimit - parentGasLimit / BigInt(1024) + BigInt(1),
        baseFeePerGas: common.param('gasConfig', 'initialBaseFee'),
      },
      {
        calcDifficultyFromHeader: genesis.header,
        common,
      }
    )
    await blockchain1.validateBlockHeader(header)
    st.pass('should not throw if gas limit is between bounds (HF transition block)')

    parentGasLimit = block1.header.gasLimit
    header = BlockHeader.fromHeaderData(
      {
        number: BigInt(2),
        parentHash: block1.hash(),
        timestamp: BigInt(2),
        gasLimit: parentGasLimit + parentGasLimit / BigInt(1024) - BigInt(1),
        baseFeePerGas: Buffer.from('342770c0', 'hex'),
      },
      {
        calcDifficultyFromHeader: block1.header,
        common,
      }
    )
    await blockchain2.validateBlockHeader(header)
    st.pass('should not throw if gas limit is between bounds (post-HF transition block)')

    header = BlockHeader.fromHeaderData(
      {
        number: BigInt(2),
        parentHash: block1.hash(),
        timestamp: BigInt(2),
        gasLimit: parentGasLimit - parentGasLimit / BigInt(1024) + BigInt(1),
        baseFeePerGas: Buffer.from('342770c0', 'hex'),
      },
      {
        calcDifficultyFromHeader: block1.header,
        common,
      }
    )
    await blockchain2.validateBlockHeader(header)
    st.pass('should not throw if gas limit is between bounds (post-HF transition block)')
    st.end()
  })

  t.test('Header -> validate() -> gasLimit -> error cases', async function (st) {
    let parentGasLimit = genesis.header.gasLimit * BigInt(2)
    let header = BlockHeader.fromHeaderData(
      {
        number: BigInt(1),
        parentHash: genesis.hash(),
        timestamp: BigInt(1),
        gasLimit: parentGasLimit + parentGasLimit / BigInt(1024),
        baseFeePerGas: common.param('gasConfig', 'initialBaseFee'),
      },
      {
        calcDifficultyFromHeader: genesis.header,
        common,
      }
    )
    try {
      await blockchain1.validateBlockHeader(header)
      st.fail('should throw')
    } catch (e: any) {
      st.ok(
        e.message.includes('invalid gas limit'),
        'should throw if gas limit is increased too much (HF transition block)'
      )
    }

    parentGasLimit = block1.header.gasLimit
    header = BlockHeader.fromHeaderData(
      {
        number: BigInt(2),
        parentHash: block1.hash(),
        timestamp: BigInt(2),
        gasLimit: parentGasLimit + parentGasLimit / BigInt(1024),
        baseFeePerGas: Buffer.from('342770c0', 'hex'),
      },
      {
        calcDifficultyFromHeader: block1.header,
        common,
      }
    )
    try {
      await blockchain2.validateBlockHeader(header)
      st.fail('should throw')
    } catch (e: any) {
      st.ok(
        e.message.includes('invalid gas limit'),
        'should throw if gas limit is increased too much (post-HF transition block)'
      )
    }
    st.end()
  })

  t.test('Header -> validate() -> gasLimit -> error cases', async function (st) {
    let parentGasLimit = genesis.header.gasLimit * BigInt(2)
    let header = BlockHeader.fromHeaderData(
      {
        number: BigInt(1),
        parentHash: genesis.hash(),
        timestamp: BigInt(1),
        gasLimit: parentGasLimit - parentGasLimit / BigInt(1024),
        baseFeePerGas: common.param('gasConfig', 'initialBaseFee'),
      },
      {
        calcDifficultyFromHeader: genesis.header,
        common,
      }
    )
    try {
      await blockchain1.validateBlockHeader(header)
      st.fail('should throw')
    } catch (e: any) {
      st.ok(
        e.message.includes('invalid gas limit'),
        'should throw if gas limit is decreased too much (HF transition block)'
      )
    }

    parentGasLimit = block1.header.gasLimit
    header = BlockHeader.fromHeaderData(
      {
        number: BigInt(2),
        parentHash: block1.hash(),
        timestamp: BigInt(2),
        gasLimit: parentGasLimit - parentGasLimit / BigInt(1024),
        baseFeePerGas: Buffer.from('342770c0', 'hex'),
      },
      {
        calcDifficultyFromHeader: block1.header,
        common,
      }
    )
    try {
      await blockchain2.validateBlockHeader(header)
      st.fail('should throw')
    } catch (e: any) {
      st.ok(
        e.message.includes('invalid gas limit'),
        'should throw if gas limit is decreased too much (post-HF transition block)'
      )
    }
    st.end()
  })
})
