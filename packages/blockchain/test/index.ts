import * as async from 'async'
import Common from 'ethereumjs-common'
import { toBuffer, bufferToInt } from 'ethereumjs-util'
import * as test from 'tape'
import Blockchain, { Block } from '../src'
import { generateBlockchain, generateBlocks, isConsecutive, createTestDB } from './util'

import BN = require('bn.js')

const Block = require('ethereumjs-block')
const level = require('level-mem')
const testData = require('./testdata.json')

test('blockchain test', t => {
  t.test('should not crash on getting head of a blockchain without a genesis', st => {
    const blockchain = new Blockchain({ validateBlocks: true, validatePow: false })
    blockchain.getHead((err?: Error) => {
      st.error(err, 'no error')
      st.end()
    })
  })

  t.test('should throw on initialization with chain and common parameter', st => {
    const common = new Common('ropsten')

    st.throws(() => {
      new Blockchain({ chain: 'ropsten', common })
    }, /not allowed!$/)

    const blockchain0 = new Blockchain({ chain: 'ropsten' })
    const blockchain1 = new Blockchain({ common })

    async.parallel(
      [cb => blockchain0.getHead(cb), cb => blockchain1.getHead(cb)],
      (err?: any, heads?: any) => {
        st.error(err, 'no error initializing with one parameter')
        st.equals(
          heads[0].hash().toString('hex'),
          common.genesis().hash.slice(2),
          'correct genesis hash',
        )
        st.equals(
          heads[0].hash().toString('hex'),
          heads[1].hash().toString('hex'),
          'genesis blocks match',
        )
        st.end()
      },
    )
  })

  t.test('should add a genesis block without errors', st => {
    const blockchain = new Blockchain({ validateBlocks: true, validatePow: false })
    const genesisBlock = new Block()
    genesisBlock.setGenesisParams()
    blockchain.putGenesis(genesisBlock, (err?: Error) => {
      st.error(err, 'no error')
      st.equals(
        genesisBlock.hash().toString('hex'),
        blockchain.meta.genesis.toString('hex'),
        'genesis block hash should be correct',
      )
      st.end()
    })
  })

  t.test('should not validate a block incorrectly flagged as genesis', st => {
    const blockchain = new Blockchain({ validateBlocks: true, validatePow: false })
    const badBlock = new Block()
    badBlock.header.number = Buffer.from([])

    blockchain.putBlock(
      badBlock,
      (err?: Error) => {
        st.ok(err, 'returned with error')
        st.end()
      },
      false,
    )
  })

  t.test('should initialize with a genesis block', st => {
    const blockchain = new Blockchain({ validateBlocks: true, validatePow: false })
    blockchain.getBlocks(0, 5, 0, false, (err?: Error, getBlocks?: Block[]) => {
      st.equal(getBlocks!.length, 1)
      st.end()
    })
  })

  t.test('should add 10 blocks, one at a time', st => {
    const blockchain = new Blockchain({ validateBlocks: true, validatePow: false })
    const blocks: any[] = []
    const genesisBlock = new Block()
    genesisBlock.setGenesisParams()
    genesisBlock.header.gasLimit = toBuffer(8000000)
    blocks.push(genesisBlock)

    const addNextBlock = (blockNumber: number) => {
      const block = new Block()
      block.header.number = toBuffer(blockNumber)
      block.header.parentHash = blocks[blockNumber - 1].hash()
      block.header.difficulty = block.header.canonicalDifficulty(blocks[blockNumber - 1])
      block.header.gasLimit = toBuffer(8000000)
      block.header.timestamp = toBuffer(bufferToInt(blocks[blockNumber - 1].header.timestamp) + 1)
      blockchain.putBlock(block, (err?: Error) => {
        if (err) {
          return st.error(err)
        }
        blocks.push(block)
        if (blocks.length < 10) {
          addNextBlock(blockNumber + 1)
        } else {
          st.equal(blocks.length, 10)
          st.end()
        }
      })
    }

    blockchain.putGenesis(genesisBlock, (err?: Error) => {
      st.error(err, 'no error')
      addNextBlock(1)
    })
  })

  t.test('should get block by number', st => {
    const blockchain = new Blockchain({ validateBlocks: true, validatePow: false })
    const blocks: Block[] = []
    const genesisBlock = new Block()
    genesisBlock.setGenesisParams()
    genesisBlock.header.gasLimit = toBuffer(8000000)
    blocks.push(genesisBlock)
    const block = new Block()
    block.header.number = toBuffer(1)
    block.header.parentHash = blocks[0].hash()
    block.header.difficulty = block.header.canonicalDifficulty(blocks[0])
    block.header.gasLimit = toBuffer(8000000)
    block.header.timestamp = toBuffer(bufferToInt(blocks[0].header.timestamp) + 1)
    blocks.push(block)
    blockchain.putGenesis(genesisBlock, (err?: Error) => {
      st.error(err, 'no error')
      blockchain.putBlock(block, (err?: Error) => {
        st.error(err, 'no error')
        blockchain.getBlock(1, (err?: Error, block?: Block) => {
          st.error(err, 'no error')
          st.equal(block.hash().toString('hex'), blocks[1].hash().toString('hex'))
          st.end()
        })
      })
    })
  })

  t.test('should get block by hash', st => {
    const blockchain = new Blockchain({ validateBlocks: true, validatePow: false })
    const genesisBlock = new Block()
    genesisBlock.setGenesisParams()
    genesisBlock.header.gasLimit = toBuffer(8000000)
    blockchain.putGenesis(genesisBlock, (err?: Error) => {
      st.error(err, 'no error')
      blockchain.getBlock(genesisBlock.hash(), (err?: Error, block?: Block) => {
        st.error(err, 'no error')
        st.equal(block.hash().toString('hex'), genesisBlock.hash().toString('hex'))
        st.end()
      })
    })
  })

  t.test('should get 5 consecutive blocks, starting from genesis hash', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: genesisHash, max: 5, skip: 0, reverse: false
    blockchain.getBlocks(blocks[0].hash(), 5, 0, false, (err?: Error, getBlocks?: Block[]) => {
      st.error(err, 'no error')
      st.equal(getBlocks!.length, 5)
      st.ok(getBlocks![0].header.number.equals(blocks[0].header.number))
      st.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
      st.end()
    })
  })

  t.test('should get 5 blocks, skipping 1 apart, starting from genesis hash', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: genesisHash, max: 5, skip: 1, reverse: false
    blockchain.getBlocks(blocks[0].hash(), 5, 1, false, (err?: Error, getBlocks?: Block[]) => {
      st.error(err, 'no error')
      st.equal(getBlocks!.length, 5, 'should get 5 blocks')
      st.ok(getBlocks![1].header.number.equals(blocks[2].header.number), 'should skip second block')
      st.ok(!isConsecutive(getBlocks!), 'blocks should not be consecutive')
      st.end()
    })
  })

  t.test('should get 4 blocks, skipping 2 apart, starting from genesis hash', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: genesisHash, max: 4, skip: 2, reverse: false
    blockchain.getBlocks(blocks[0].hash(), 4, 2, false, (err?: Error, getBlocks?: Block[]) => {
      st.error(err, 'no error')
      st.equal(getBlocks!.length, 4, 'should get 4 blocks')
      st.ok(
        getBlocks![1].header.number.equals(blocks[3].header.number),
        'should skip two blocks apart',
      )
      st.ok(!isConsecutive(getBlocks!), 'blocks should not be consecutive')
      st.end()
    })
  })

  t.test('should get 10 consecutive blocks, starting from genesis hash', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(15)
    st.error(error, 'no error')
    // start: genesisHash, max: 17, skip: 0, reverse: false
    blockchain.getBlocks(blocks[0].hash(), 17, 0, false, (err?: Error, getBlocks?: Block[]) => {
      st.error(err, 'no error')
      st.equal(getBlocks!.length, 15)
      st.ok(getBlocks![0].header.number.equals(blocks[0].header.number))
      st.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
      st.end()
    })
  })

  t.test('should get 5 consecutive blocks, starting from block 0', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 0, max: 5, skip: 0, reverse: false
    blockchain.getBlocks(0, 5, 0, false, (err?: Error, getBlocks?: Block[]) => {
      st.error(err, 'no error')
      st.equal(getBlocks!.length, 5)
      st.ok(getBlocks![0].header.number.equals(blocks[0].header.number))
      st.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
      st.end()
    })
  })

  t.test('should get 5 blocks, skipping 1 apart, starting from block 1', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 1, max: 5, skip: 1, reverse: false
    blockchain.getBlocks(1, 5, 1, false, (err?: Error, getBlocks?: Block[]) => {
      st.error(err, 'no error')
      st.equal(getBlocks!.length, 5)
      st.ok(getBlocks![1].header.number.equals(blocks[3].header.number), 'should skip one block')
      st.ok(!isConsecutive(getBlocks!), 'blocks should not be consecutive')
      st.end()
    })
  })

  t.test('should get 5 blocks, skipping 2 apart, starting from block 0', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 0, max: 5, skip: 2, reverse: false
    blockchain.getBlocks(0, 5, 2, false, (err?: Error, getBlocks?: Block[]) => {
      st.error(err, 'no error')
      st.equal(getBlocks!.length, 5)
      st.ok(getBlocks![1].header.number.equals(blocks[3].header.number), 'should skip two blocks')
      st.ok(!isConsecutive(getBlocks!), 'blocks should not be consecutive')
      st.end()
    })
  })

  t.test('should get 15 consecutive blocks, starting from block 0', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(15)
    st.error(error, 'no error')
    // start: 0, max: 17, skip: 0, reverse: false
    blockchain.getBlocks(0, 17, 0, false, (err?: Error, getBlocks?: Block[]) => {
      st.error(err, 'no error')
      st.equal(getBlocks!.length, 15)
      st.ok(getBlocks![0].header.number.equals(blocks[0].header.number))
      st.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
      st.end()
    })
  })

  t.test('should get 5 consecutive blocks, starting from block 1', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 1, max: 5, skip: 0, reverse: false
    blockchain.getBlocks(1, 5, 0, false, (err?: Error, getBlocks?: Block[]) => {
      st.error(err, 'no error')
      st.equal(getBlocks!.length, 5)
      st.ok(getBlocks![0].header.number.equals(blocks[1].header.number))
      st.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
      st.end()
    })
  })

  t.test('should get 5 consecutive blocks, starting from block 5', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 5, max: 5, skip: 0, reverse: false
    blockchain.getBlocks(5, 5, 0, false, (err?: Error, getBlocks?: Block[]) => {
      st.error(err, 'no error')
      st.equal(getBlocks!.length, 5)
      st.ok(getBlocks![0].header.number.equals(blocks[5].header.number))
      st.ok(isConsecutive(getBlocks!), 'blocks should be consecutive')
      st.end()
    })
  })

  t.test('should get 5 consecutive blocks, starting from block 5, reversed', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 5, max: 5, skip: 0, reverse: true
    blockchain.getBlocks(5, 5, 0, true, (err?: Error, getBlocks?: Block[]) => {
      st.error(err, 'no error')
      st.equal(getBlocks!.length, 5)
      st.ok(getBlocks![0].header.number.equals(blocks[5].header.number))
      st.ok(isConsecutive(getBlocks!.reverse()), 'blocks should be consecutive')
      st.end()
    })
  })

  t.test('should get 6 consecutive blocks, starting from block 5, reversed', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(15)
    st.error(error, 'no error')
    // start: 5, max: 15, skip: 0, reverse: true
    blockchain.getBlocks(5, 15, 0, true, (err?: Error, getBlocks?: Block[]) => {
      st.error(err, 'no error')
      st.equal(getBlocks!.length, 6)
      st.ok(getBlocks![0].header.number.equals(blocks[5].header.number))
      st.ok(isConsecutive(getBlocks!.reverse()), 'blocks should be consecutive')
      st.end()
    })
  })

  t.test('should get 6 blocks, starting from block 10, reversed, skipping 1 apart', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    // start: 10, max: 10, skip: 1, reverse: true
    blockchain.getBlocks(10, 10, 1, true, (err?: Error, getBlocks?: Block[]) => {
      st.error(err, 'no error')
      st.equal(getBlocks!.length, 6)
      st.ok(getBlocks![1].header.number.equals(blocks[8].header.number), 'should skip one block')
      st.ok(!isConsecutive(getBlocks!.reverse()), 'blocks should not be consecutive')
      st.end()
    })
  })

  t.test('should find needed hashes', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    const neededHash = Buffer.from('abcdef', 'hex')
    blockchain.selectNeededHashes(
      [blocks[0].hash(), blocks[9].hash(), neededHash],
      (err?: Error, hashes?: any) => {
        st.error(err, 'no error')
        st.equals(hashes[0].toString('hex'), neededHash.toString('hex'))
        st.end()
      },
    )
  })

  t.test('should iterate through 25 blocks', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    let i = 0
    blockchain.iterator(
      'test',
      (block: Block, _: any, cb: any) => {
        if (block.hash().equals(blocks[i + 1].hash())) {
          i++
        }
        cb()
      },
      () => {
        st.equals(i, 24)
        st.end()
      },
    )
  })

  t.test('should catch iterator func error', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    blockchain.iterator(
      'error',
      (_block: Block, _: any, cb: any) => {
        cb(new Error('iterator func error'))
      },
      (err: Error) => {
        st.ok(err)
        st.equal(err.message, 'iterator func error', 'should return correct error')
        st.end()
      },
    )
  })

  t.test('should not call iterator function in an empty blockchain', st => {
    const blockchain = new Blockchain({ validateBlocks: true, validatePow: false })
    blockchain.iterator(
      'test',
      () => {
        st.fail('should not call iterator function')
        st.end()
      },
      (err?: Error) => {
        st.error(err, 'should not return error')
        st.pass('should finish iterating')
        st.end()
      },
    )
  })

  t.test('should get meta.genesis', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    st.equals(
      blockchain.meta.rawHead.toString('hex'),
      blocks[24].hash().toString('hex'),
      'should get meta.rawHead',
    )
    st.equals(
      blockchain.meta.genesis.toString('hex'),
      blocks[0].hash().toString('hex'),
      'should get meta.genesis',
    )
    let i = 0
    blockchain.iterator(
      'test',
      (block: Block, _: any, cb: any) => {
        if (block.hash().equals(blocks[i + 1].hash())) {
          i++
        }
        cb()
      },
      () => {
        st.ok(blockchain.meta.heads['test'], 'should get meta.heads')
        st.end()
      },
    )
  })

  t.test('should add fork header and reset stale heads', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(15)
    st.error(error, 'no error')
    blockchain.putBlocks(blocks.slice(1), (err?: Error) => {
      if (err) {
        return st.error(err)
      }
      const forkHeader = new Block.Header()
      forkHeader.number = toBuffer(15)
      forkHeader.parentHash = blocks[14].hash()
      forkHeader.difficulty = forkHeader.canonicalDifficulty(blocks[14])
      forkHeader.gasLimit = toBuffer(8000000)
      forkHeader.timestamp = toBuffer(bufferToInt(blocks[14].header.timestamp) + 1)
      blockchain._heads['staletest'] = blockchain._headHeader
      blockchain.putHeader(forkHeader, (err?: Error) => {
        st.equals(
          blockchain._heads['staletest'].toString('hex'),
          blocks[14].hash().toString('hex'),
          'should update stale head',
        )
        st.equals(
          blockchain._headBlock.toString('hex'),
          blocks[14].hash().toString('hex'),
          'should update stale headBlock',
        )
        st.error(err, 'should add new block in fork')
        st.end()
      })
    })
  })

  t.test('should delete fork header', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(15)
    st.error(error, 'no error')
    const forkHeader = new Block.Header()
    forkHeader.number = toBuffer(15)
    forkHeader.parentHash = blocks[14].hash()
    forkHeader.difficulty = forkHeader.canonicalDifficulty(blocks[14])
    forkHeader.gasLimit = toBuffer(8000000)
    forkHeader.timestamp = toBuffer(bufferToInt(blocks[14].header.timestamp) + 1)
    blockchain._heads['staletest'] = blockchain._headHeader
    blockchain.putHeader(forkHeader, (err?: Error) => {
      st.equals(
        blockchain._heads['staletest'].toString('hex'),
        blocks[14].hash().toString('hex'),
        'should update stale head',
      )
      st.equals(
        blockchain._headBlock.toString('hex'),
        blocks[14].hash().toString('hex'),
        'should update stale headBlock',
      )
      st.error(err, 'should add new block in fork')

      blockchain.delBlock(forkHeader.hash(), (err?: Error) => {
        st.error(err, 'should delete fork block')
        st.equals(
          blockchain._headHeader.toString('hex'),
          blocks[14].hash().toString('hex'),
          'should reset headHeader',
        )
        st.equals(
          blockchain._headBlock.toString('hex'),
          blocks[14].hash().toString('hex'),
          'should not change headBlock',
        )
        st.end()
      })
    })
  })

  t.test('should delete blocks', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')

    const delNextBlock = (number: number, cb: any) => {
      const block = blocks[number]
      blockchain.delBlock(block.hash(), (err?: Error) => {
        if (err) return cb(err)
        if (number > 6) {
          return delNextBlock(--number, cb)
        }
        cb()
      })
    }

    delNextBlock(9, (err?: Error) => {
      st.error(err, 'should delete blocks in canonical chain')
      st.equals(
        blockchain._headHeader.toString('hex'),
        blocks[5].hash().toString('hex'),
        'should have block 5 as head',
      )
      st.end()
    })
  })

  t.test('should delete blocks and children', async st => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    blockchain.delBlock(blocks[1].hash(), (err?: Error) => {
      st.error(err, 'should delete block and children')
      st.equals(
        blockchain._headHeader.toString('hex'),
        blocks[0].hash().toString('hex'),
        'should have genesis as head',
      )
      st.end()
    })
  })

  t.test('should put one block at a time', st => {
    const blockchain = new Blockchain({ validateBlocks: true, validatePow: false })
    const blocks = generateBlocks(15)
    blockchain.putGenesis(blocks[0], (err?: Error) => {
      st.error(err, 'no error')
      blockchain.putBlock(blocks[1], (err?: Error) => {
        st.error(err, 'no error')
        blockchain.putBlock(blocks[2], (err?: Error) => {
          st.error(err, 'no error')
          blockchain.putBlock(blocks[3], (err?: Error) => {
            st.error(err, 'no error')
            st.end()
          })
        })
      })
    })
  })

  t.test('should put multiple blocks at once', st => {
    const blockchain = new Blockchain({ validateBlocks: true, validatePow: false })
    const blocks: Block[] = []
    const genesisBlock = new Block()
    genesisBlock.setGenesisParams()
    genesisBlock.header.gasLimit = toBuffer(8000000)
    blocks.push(...generateBlocks(15, [genesisBlock]))
    blockchain.putGenesis(genesisBlock, (err?: Error) => {
      st.error(err, 'no error')
      blockchain.putBlocks(blocks.slice(1), (err?: Error) => {
        st.error(err, 'no error')
        st.end()
      })
    })
  })

  t.test('should get heads', st => {
    createTestDB((err?: Error, db?: any, genesis?: Block) => {
      if (err) {
        return st.error(err)
      }
      const blockchain = new Blockchain({ db: db })
      blockchain.getHead((err?: Error, head?: any) => {
        if (err) {
          return st.error(err)
        }
        st.equals(head.hash().toString('hex'), genesis.hash().toString('hex'), 'should get head')
        st.equals(blockchain._heads['head0'].toString('hex'), 'abcd', 'should get state root heads')
        st.end()
      })
    })
  })

  t.test('should validate', st => {
    const blockchain = new Blockchain({ validateBlocks: true, validatePow: false })
    const genesisBlock = new Block()
    genesisBlock.setGenesisParams()
    genesisBlock.header.gasLimit = toBuffer(8000000)
    blockchain.putGenesis(genesisBlock, (err?: Error) => {
      st.error(err, 'should validate genesisBlock')
      const invalidBlock = new Block()
      blockchain.putBlock(invalidBlock, (err?: Error) => {
        t.ok(err, 'should not validate an invalid block')
        st.end()
      })
    })
  })

  t.test('should add block with body', st => {
    const blockchain = new Blockchain({ validateBlocks: true, validatePow: false })
    const genesisBlock = new Block(Buffer.from(testData.genesisRLP.slice(2), 'hex'))
    blockchain.putGenesis(genesisBlock, (err?: Error) => {
      if (err) {
        return st.error(err)
      }
      const block = new Block(Buffer.from(testData.blocks[0].rlp.slice(2), 'hex'))
      blockchain.putBlock(block, (err?: Error) => {
        st.error(err, 'no error')
        st.end()
      })
    })
  })

  t.test('uncached db ops', st => {
    createTestDB((err?: Error, db?: any, genesis?: Block) => {
      if (err) {
        return st.error(err)
      }
      const blockchain = new Blockchain({ db: db })
      async.series(
        [
          cb =>
            blockchain._hashToNumber(genesis.hash(), (err: Error | undefined, number: BN) => {
              st.equals(number.toString(10), '0', 'should perform _hashToNumber correctly')
              cb(err)
            }),
          cb =>
            blockchain._numberToHash(new BN(0), (err: Error | undefined, hash: Buffer) => {
              st.equals(
                genesis.hash().toString('hex'),
                hash.toString('hex'),
                'should perform _numberToHash correctly',
              )
              cb(err)
            }),
          cb =>
            blockchain._getTd(genesis.hash(), new BN(0), (err: Error | undefined, td: BN) => {
              st.equals(
                td.toBuffer().toString('hex'),
                genesis.header.difficulty.toString('hex'),
                'should perform _getTd correctly',
              )
              cb(err)
            }),
        ],
        st.end,
      )
    })
  })

  t.test('should save headers', st => {
    const db = level()
    let blockchain = new Blockchain({ db: db, validateBlocks: true, validatePow: false })
    const genesisBlock = new Block()
    genesisBlock.setGenesisParams()
    genesisBlock.header.gasLimit = toBuffer(8000000)
    blockchain.putGenesis(genesisBlock, (err?: Error) => {
      if (err) {
        return st.error(err)
      }
      const header = new Block.Header()
      header.number = toBuffer(1)
      header.parentHash = genesisBlock.hash()
      header.difficulty = header.canonicalDifficulty(genesisBlock)
      header.gasLimit = toBuffer(8000000)
      header.timestamp = toBuffer(bufferToInt(genesisBlock.header.timestamp) + 1)
      blockchain.putHeader(header, (err?: Error) => {
        if (err) {
          return st.error(err)
        }
        blockchain = new Blockchain({ db: db, validateBlocks: true, validatePow: false })
        async.series(
          [
            cb =>
              blockchain.getLatestHeader((err?: Error, latest?: any) => {
                if (err) {
                  return st.error(err)
                }
                st.equals(
                  latest.hash().toString('hex'),
                  header.hash().toString('hex'),
                  'should save headHeader',
                )
                cb()
              }),
            cb =>
              blockchain.getLatestBlock((err?: Error, latest?: any) => {
                if (err) {
                  return st.error(err)
                }
                st.equals(
                  latest.hash().toString('hex'),
                  genesisBlock.hash().toString('hex'),
                  'should save headBlock',
                )
                cb()
              }),
          ],
          st.end,
        )
      })
    })
  })

  t.test('immutable cached objects', st => {
    const blockchain = new Blockchain({ validateBlocks: true, validatePow: false })
    const genesisBlock = new Block()
    genesisBlock.setGenesisParams()
    genesisBlock.header.gasLimit = toBuffer(8000000)
    blockchain.putGenesis(genesisBlock, (err?: Error) => {
      if (err) {
        return st.error(err)
      }
      const block = new Block()
      block.header.number = toBuffer(1)
      block.header.parentHash = genesisBlock.hash()
      block.header.difficulty = block.header.canonicalDifficulty(genesisBlock)
      block.header.gasLimit = toBuffer(8000000)
      block.header.timestamp = toBuffer(bufferToInt(genesisBlock.header.timestamp) + 1)
      let cachedHash: Buffer
      async.series(
        [
          cb =>
            blockchain.putBlock(block, (err?: Error) => {
              if (err) {
                return st.error(err)
              }
              cachedHash = block.hash()
              cb()
            }),
          cb => {
            // change block's extraData in order to modify its hash
            block.header.extraData = Buffer.from([1])
            blockchain.getBlock(1, (err?: Error, block?: Block) => {
              if (err) {
                return st.error(err)
              }
              st.equals(
                cachedHash.toString('hex'),
                block.hash().toString('hex'),
                'should not modify cached objects',
              )
              cb()
            })
          },
        ],
        st.end,
      )
    })
  })

  t.test('should get latest', st => {
    const blockchain = new Blockchain({ validateBlocks: true, validatePow: false })
    const headers = [new Block.Header(), new Block.Header()]
    const genesisBlock = new Block()
    genesisBlock.setGenesisParams()
    genesisBlock.header.gasLimit = toBuffer(8000000)
    blockchain.putGenesis(genesisBlock, (err?: Error) => {
      if (err) {
        return st.error(err)
      }

      const block = new Block()
      block.header.number = toBuffer(1)
      block.header.parentHash = genesisBlock.hash()
      block.header.difficulty = block.header.canonicalDifficulty(genesisBlock)
      block.header.gasLimit = toBuffer(8000000)
      block.header.timestamp = toBuffer(bufferToInt(genesisBlock.header.timestamp) + 1)

      headers[0].number = toBuffer(1)
      headers[0].parentHash = genesisBlock.hash()
      headers[0].difficulty = headers[0].canonicalDifficulty(genesisBlock)
      headers[0].gasLimit = toBuffer(8000000)
      headers[0].timestamp = toBuffer(bufferToInt(genesisBlock.header.timestamp) + 1)

      headers[1].number = toBuffer(2)
      headers[1].parentHash = headers[0].hash()
      headers[1].difficulty = headers[1].canonicalDifficulty(block)
      headers[1].gasLimit = toBuffer(8000000)
      headers[1].timestamp = toBuffer(bufferToInt(block.header.timestamp) + 1)

      async.series(
        [
          // first, add some headers and make sure the latest block remains the same
          cb =>
            blockchain.putHeaders(headers, (err?: Error) => {
              if (err) {
                return cb(err)
              }
              async.series(
                [
                  cb =>
                    blockchain.getLatestHeader((err?: any, header?: any) => {
                      if (err) {
                        return st.error(err)
                      }
                      st.equals(
                        header.hash().toString('hex'),
                        headers[1].hash().toString('hex'),
                        'should update latest header',
                      )
                      cb()
                    }),
                  cb =>
                    blockchain.getLatestBlock((err?: any, block?: any) => {
                      if (err) {
                        return st.error(err)
                      }
                      t.equals(
                        block.hash().toString('hex'),
                        genesisBlock.hash().toString('hex'),
                        'should not change latest block',
                      )
                      cb()
                    }),
                ],
                cb,
              )
            }),
          // then, add a full block and make sure the latest header remains the same
          cb =>
            blockchain.putBlock(block, (err?: Error) => {
              if (err) {
                return cb(err)
              }
              async.series(
                [
                  cb =>
                    blockchain.getLatestHeader((err?: Error, header?: any) => {
                      if (err) {
                        return st.error(err)
                      }
                      st.equals(
                        header.hash().toString('hex'),
                        headers[1].hash().toString('hex'),
                        'should not change latest header',
                      )
                      cb()
                    }),
                  cb =>
                    blockchain.getLatestBlock((err?: Error, getBlock?: Block) => {
                      if (err) {
                        return st.error(err)
                      }
                      t.equals(
                        getBlock.hash().toString('hex'),
                        block.hash().toString('hex'),
                        'should update latest block',
                      )
                      cb()
                    }),
                ],
                cb,
              )
            }),
        ],
        st.end,
      )
    })
  })

  t.test('mismatched chains', st => {
    const common = new Common('mainnet')
    const blockchain = new Blockchain({ common: common, validateBlocks: true, validatePow: false })
    const blocks = [
      new Block(null, { common: common }),
      new Block(null, { chain: 'mainnet' }),
      new Block(null, { chain: 'ropsten' }),
    ]

    blocks[0].setGenesisParams()
    blocks[0].header.gasLimit = toBuffer(8000000)

    blocks[1].header.number = toBuffer(1)
    blocks[1].header.parentHash = blocks[0].hash()
    blocks[1].header.difficulty = blocks[1].header.canonicalDifficulty(blocks[0])
    blocks[1].header.gasLimit = toBuffer(8000000)
    blocks[1].header.timestamp = toBuffer(bufferToInt(blocks[0].header.timestamp) + 1)

    blocks[2].header.number = toBuffer(2)
    blocks[2].header.parentHash = blocks[1].hash()
    blocks[2].header.difficulty = blocks[2].header.canonicalDifficulty(blocks[0])
    blocks[2].header.gasLimit = toBuffer(8000000)
    blocks[2].header.timestamp = toBuffer(bufferToInt(blocks[0].header.timestamp) + 2)

    async.eachOfSeries(
      blocks,
      (block, i, cb) => {
        if (i === 0) {
          blockchain.putGenesis(block, cb)
        } else {
          blockchain.putBlock(block, (err: Error) => {
            if (i === 2) {
              st.ok(err.message.match('Chain mismatch'), 'should return chain mismatch error')
            } else {
              st.error(err, 'should not return mismatch error')
            }
            cb()
          })
        }
      },
      st.end,
    )
  })
})
