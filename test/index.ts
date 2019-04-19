import * as async from 'async'
import Common from 'ethereumjs-common'
import { rlp, toBuffer } from 'ethereumjs-util'
import * as test from 'tape'
import Blockchain from '../src'

import BN = require('bn.js')

const Block = require('ethereumjs-block')
const level = require('level-mem')
const testData = require('./testdata.json')

test('blockchain test', function(t) {
  t.plan(70)
  const blockchain = new Blockchain()
  let genesisBlock: any
  const blocks: any[] = []
  let forkHeader: any
  blockchain.validate = false
  async.series(
    [
      function(done) {
        blockchain.getHead(function(err?: any) {
          if (err) {
            return done(err)
          }
          t.ok(true, 'should not crash on getting head of a blockchain without a genesis')
          done()
        })
      },
      function initialization(done) {
        const common = new Common('ropsten')
        t.throws(
          function() {
            new Blockchain({ chain: 'ropsten', common: common })
          },
          /not allowed!$/,
          'should throw on initialization with chain and common parameter',
        )

        const bc0 = new Blockchain({ chain: 'ropsten' })
        const bc1 = new Blockchain({ common: common })
        async.parallel([cb => bc0.getHead(cb), cb => bc1.getHead(cb)], (err?: any, heads?: any) => {
          if (err) {
            return done(err)
          }
          t.equals(
            heads[0].hash().toString('hex'),
            common.genesis().hash.slice(2),
            'correct genesis hash',
          )
          t.equals(
            heads[0].hash().toString('hex'),
            heads[1].hash().toString('hex'),
            'genesis blocks match',
          )
          done()
        })
      },
      function addgenesis(done) {
        genesisBlock = new Block()
        genesisBlock.setGenesisParams()
        blockchain.putGenesis(genesisBlock, function(err?: any) {
          if (err) {
            return done(err)
          }
          t.equals(
            genesisBlock.hash().toString('hex'),
            blockchain.meta.genesis.toString('hex'),
            'genesis block hash should be correct',
          )
          blocks.push(genesisBlock)
          done()
        })
      },
      function invalidGenesis(done) {
        const badBlock = new Block()
        badBlock.header.number = Buffer.from([])
        blockchain.validate = true
        blockchain.putBlock(
          badBlock,
          function(err?: any) {
            t.ok(err, 'should not validate a block incorrectly flagged as genesis')
            blockchain.validate = false
            done()
          },
          false,
        )
      },
      function addBlocks(done) {
        function addNextBlock(blockNumber: number) {
          const block = new Block()
          block.header.number = toBuffer(blockNumber)
          block.header.difficulty = '0xfffffff'
          block.header.parentHash = blocks[blockNumber - 1].hash()
          blockchain.putBlock(block, function(err?: any) {
            if (err) {
              return done(err)
            }

            blocks.push(block)

            if (blocks.length === 10) {
              t.ok(true, 'added 10 blocks')
              done()
            } else {
              addNextBlock(blockNumber + 1)
            }
          })
        }
        addNextBlock(1)
      },
      function getBlockByNumber(done) {
        blockchain.getBlock(1, function(err?: any, block?: any) {
          if (err) {
            return done(err)
          }
          t.equals(
            block.hash().toString('hex'),
            blocks[1].hash().toString('hex'),
            'should get block by number',
          )
          done()
        })
      },
      function getBlockByHash(done) {
        blockchain.getBlock(genesisBlock.hash(), function(err?: any, block?: any) {
          if (err) {
            return done(err)
          }
          t.equals(
            block.hash().toString('hex'),
            genesisBlock.hash().toString('hex'),
            'should get block by hash',
          )
          done()
        })
      },
      function getBlocks1(done) {
        // start: genesisHash, max: 5, skip: 0, reverse: false
        blockchain.getBlocks(genesisBlock.hash(), 5, 0, false, function(err?: any, blocks?: any) {
          if (err) {
            return done(err)
          }
          t.equals(blocks.length, 5, 'should get 5 blocks')
          t.ok(isConsecutive(blocks), 'blocks should be consecutive')
          done()
        })
      },
      function getBlocks2(done) {
        // start: genesisHash, max: 5, skip: 1, reverse: false
        blockchain.getBlocks(genesisBlock.hash(), 5, 1, false, function(err?: any, blocks?: any) {
          if (err) {
            return done(err)
          }
          t.equals(blocks.length, 5, 'should get 5 blocks')
          t.ok(!isConsecutive(blocks), 'blocks should not be consecutive')
          done()
        })
      },
      function getBlocks3(done) {
        // start: genesisHash, max: 5, skip: 2, reverse: false
        blockchain.getBlocks(genesisBlock.hash(), 5, 2, false, function(err?: any, blocks?: any) {
          if (err) {
            return done(err)
          }
          t.equals(blocks.length, 4, 'should get 4 blocks')
          t.ok(!isConsecutive(blocks), 'blocks should not be consecutive')
          done()
        })
      },
      function getBlocks4(done) {
        // start: genesisHash, max: 12, skip: 0, reverse: false
        blockchain.getBlocks(genesisBlock.hash(), 12, 0, false, function(err?: any, blocks?: any) {
          if (err) {
            return done(err)
          }
          t.equals(blocks.length, 10, 'should get 10 blocks')
          t.ok(isConsecutive(blocks), 'blocks should be consecutive')
          done()
        })
      },
      function getBlocks5(done) {
        // start: 0, max: 5, skip: 0, reverse: false
        blockchain.getBlocks(0, 5, 0, false, function(err?: any, blocks?: any) {
          if (err) {
            return done(err)
          }
          t.equals(blocks.length, 5, 'should get 5 blocks')
          t.ok(isConsecutive(blocks), 'blocks should be consecutive')
          done()
        })
      },
      function getBlocks6(done) {
        // start: 0, max: 5, skip: 1, reverse: false
        blockchain.getBlocks(1, 5, 1, false, function(err?: any, blocks?: any) {
          if (err) {
            return done(err)
          }
          t.equals(blocks.length, 5, 'should get 5 blocks')
          t.ok(!isConsecutive(blocks), 'blocks should not be consecutive')
          done()
        })
      },
      function getBlocks7(done) {
        // start: 0, max: 5, skip: 2, reverse: false
        blockchain.getBlocks(0, 5, 2, false, function(err?: any, blocks?: any) {
          if (err) {
            return done(err)
          }
          t.equals(blocks.length, 4, 'should get 4 blocks')
          t.ok(!isConsecutive(blocks), 'blocks should not be consecutive')
          done()
        })
      },
      function getBlocks8(done) {
        // start: 0, max: 12, skip: 0, reverse: false
        blockchain.getBlocks(0, 12, 0, false, function(err?: any, blocks?: any) {
          if (err) {
            return done(err)
          }
          t.equals(blocks.length, 10, 'should get 10 blocks')
          t.ok(isConsecutive(blocks), 'blocks should be consecutive')
          done()
        })
      },
      function getBlocks9(done) {
        // start: 1, max: 5, skip: 0, reverse: false
        blockchain.getBlocks(1, 5, 0, false, function(err?: any, blocks?: any) {
          if (err) {
            return done(err)
          }
          t.equals(blocks.length, 5, 'should get 5 blocks')
          t.ok(isConsecutive(blocks), 'blocks should be consecutive')
          done()
        })
      },
      function getBlocks10(done) {
        // start: 5, max: 5, skip: 0, reverse: true
        blockchain.getBlocks(5, 5, 0, true, function(err?: any, blocks?: any) {
          if (err) {
            return done(err)
          }
          t.equals(blocks.length, 5, 'should get 5 blocks')
          t.ok(isConsecutive(blocks.reverse()), 'blocks should be consecutive')
          done()
        })
      },
      function getBlocks11(done) {
        // start: 5, max: 10, skip: 0, reverse: true
        blockchain.getBlocks(5, 10, 0, true, function(err?: any, blocks?: any) {
          if (err) {
            return done(err)
          }
          t.equals(blocks.length, 6, 'should get 6 blocks')
          t.ok(isConsecutive(blocks.reverse()), 'blocks should be consecutive')
          done()
        })
      },
      function getBlocks12(done) {
        // start: 5, max: 10, skip: 0, reverse: true
        blockchain.getBlocks(5, 10, 1, true, function(err?: any, blocks?: any) {
          if (err) {
            return done(err)
          }
          t.equals(blocks.length, 3, 'should get 3 blocks')
          t.ok(!isConsecutive(blocks.reverse()), 'blocks should not be consecutive')
          done()
        })
      },
      function selectNeededHashes(done) {
        const neededHash = Buffer.from('abcdef', 'hex')
        blockchain.selectNeededHashes(
          [blocks[0].hash(), blocks[9].hash(), neededHash],
          (err?: any, hashes?: any) => {
            if (err) {
              return done(err)
            }

            t.equals(
              hashes[0].toString('hex'),
              neededHash.toString('hex'),
              'should find needed hash',
            )
            done()
          },
        )
      },
      function iterateBlocks(done) {
        let i = 0
        blockchain.iterator(
          'test',
          function(block: any, _: any, cb: any) {
            if (block.hash().equals(blocks[i + 1].hash())) i++
            cb()
          },
          function() {
            t.equals(i, 9, 'should iterate through 9 blocks')
            done()
          },
        )
      },
      function iterateError(done) {
        blockchain.iterator(
          'error',
          function(_: any, __: any, cb: any) {
            cb(new Error('iterator func error'))
          },
          function(err: Error) {
            t.ok(err, 'should catch iterator func error')
            t.equal(err.message, 'iterator func error', 'should return correct error')
            done()
          },
        )
      },
      function iterateEmpty(done) {
        const blockchain = new Blockchain()
        blockchain.validate = false
        blockchain.iterator(
          'test',
          function() {
            t.ok(false, 'should not call iterator function')
            done()
          },
          function(err?: Error) {
            t.error(err, 'should not return error')
            t.ok(true, 'should finish iterating')
            done()
          },
        )
      },
      function getMeta(done) {
        t.equals(
          blockchain.meta.rawHead.toString('hex'),
          blocks[9].hash().toString('hex'),
          'should get meta.rawHead',
        )
        t.equals(
          blockchain.meta.genesis.toString('hex'),
          genesisBlock.hash().toString('hex'),
          'should get meta.genesis',
        )
        t.ok(blockchain.meta.heads['test'], 'should get meta.heads')
        done()
      },
      function addForkHeaderAndResetStaleHeads(done) {
        forkHeader = new Block.Header()
        forkHeader.number = toBuffer(9)
        forkHeader.difficulty = '0xffffffff'
        forkHeader.parentHash = blocks[8].hash()
        blockchain._heads['staletest'] = blockchain._headHeader
        blockchain.putHeader(forkHeader, (err?: Error) => {
          t.equals(
            blockchain._heads['staletest'].toString('hex'),
            blocks[8].hash().toString('hex'),
            'should update stale head',
          )
          t.equals(
            blockchain._headBlock.toString('hex'),
            blocks[8].hash().toString('hex'),
            'should update stale headBlock',
          )
          t.notOk(err, 'should add new block in fork')
          done()
        })
      },
      function delForkHeader(done) {
        blockchain.delBlock(forkHeader.hash(), (err?: Error) => {
          t.ok(!err, 'should delete fork block')
          t.equals(
            blockchain._headHeader.toString('hex'),
            blocks[8].hash().toString('hex'),
            'should reset headHeader',
          )
          t.equals(
            blockchain._headBlock.toString('hex'),
            blocks[8].hash().toString('hex'),
            'should not change headBlock',
          )
          done()
        })
      },
      function delBlocks(done) {
        function delNextBlock(number: number, cb: any) {
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
          t.ok(!err, 'should delete blocks in canonical chain')
          t.equals(
            blockchain._headHeader.toString('hex'),
            blocks[5].hash().toString('hex'),
            'should have block 5 as head',
          )
          done()
        })
      },
      function delBlockAndChildren(done) {
        blockchain.delBlock(blocks[1].hash(), (err?: Error) => {
          t.ok(!err, 'should delete block and children')
          t.equals(
            blockchain._headHeader.toString('hex'),
            genesisBlock.hash().toString('hex'),
            'should have genesis as head',
          )
          done()
        })
      },
      function putBlocks(done) {
        blockchain.putBlocks(blocks.slice(1), (err?: Error) => {
          t.ok(!err, 'should put multiple blocks at once')
          done()
        })
      },
      function getHeads(done) {
        createTestDB((err?: Error, db?: any, genesis?: any) => {
          if (err) {
            return done(err)
          }
          const blockchain = new Blockchain({ db: db })
          blockchain.getHead((err?: Error, head?: any) => {
            if (err) {
              return done(err)
            }
            t.equals(head.hash().toString('hex'), genesis.hash().toString('hex'), 'should get head')
            t.equals(
              blockchain._heads['head0'].toString('hex'),
              'abcd',
              'should get state root heads',
            )
            done()
          })
        })
      },
      function validate(done) {
        const blockchain = new Blockchain({ validate: true })
        const genesisBlock = new Block()
        genesisBlock.setGenesisParams()
        blockchain.putGenesis(genesisBlock, (err?: Error) => {
          t.notOk(err, 'should validate genesisBlock')
          const invalidBlock = new Block()
          blockchain.putBlock(invalidBlock, (err?: Error) => {
            t.ok(err, 'should not validate an invalid block')
            done()
          })
        })
      },
      function addBlockWithBody(done) {
        const blockchain = new Blockchain({ validate: false })
        const genesisBlock = new Block(Buffer.from(testData.genesisRLP.slice(2), 'hex'))
        blockchain.putGenesis(genesisBlock, (err?: Error) => {
          if (err) {
            return done(err)
          }
          const block = new Block(Buffer.from(testData.blocks[0].rlp.slice(2), 'hex'))
          blockchain.putBlock(block, (err?: Error) => {
            if (err) {
              return done(err)
            }
            t.notOk(err, 'should add block with a body')
            done()
          })
        })
      },
      function uncachedDbOps(done) {
        createTestDB((err?: Error, db?: any, genesis?: any) => {
          if (err) return done(err)
          const blockchain = new Blockchain({ db: db })
          async.series(
            [
              cb =>
                blockchain._hashToNumber(
                  genesisBlock.hash(),
                  (err: Error | undefined, number: BN) => {
                    t.equals(number.toString(10), '0', 'should perform _hashToNumber correctly')
                    cb(err)
                  },
                ),
              cb =>
                blockchain._numberToHash(new BN(0), (err: Error | undefined, hash: Buffer) => {
                  t.equals(
                    genesisBlock.hash().toString('hex'),
                    hash.toString('hex'),
                    'should perform _numberToHash correctly',
                  )
                  cb(err)
                }),
              cb =>
                blockchain._getTd(
                  genesisBlock.hash(),
                  new BN(0),
                  (err: Error | undefined, td: BN) => {
                    t.equals(
                      td.toBuffer().toString('hex'),
                      genesis.header.difficulty.toString('hex'),
                      'should perform _getTd correctly',
                    )
                    cb(err)
                  },
                ),
            ],
            done,
          )
        })
      },
      function saveHeads(done) {
        const db = level()
        let blockchain = new Blockchain({ db: db, validate: false })
        const header = new Block.Header()
        header.number = toBuffer(1)
        header.difficulty = '0xfffffff'
        header.parentHash = blocks[0].hash()
        blockchain.putHeader(header, (err?: any) => {
          if (err) {
            return done(err)
          }
          blockchain = new Blockchain({ db: db, validate: false })
          async.series(
            [
              cb =>
                blockchain.getLatestHeader((err?: any, latest?: any) => {
                  if (err) {
                    return done(err)
                  }
                  t.equals(
                    latest.hash().toString('hex'),
                    header.hash().toString('hex'),
                    'should save headHeader',
                  )
                  cb()
                }),
              cb =>
                blockchain.getLatestBlock((err?: any, latest?: any) => {
                  if (err) {
                    return done(err)
                  }
                  t.equals(
                    latest.hash().toString('hex'),
                    blocks[0].hash().toString('hex'),
                    'should save headBlock',
                  )
                  cb()
                }),
            ],
            done,
          )
        })
      },
      function immutableCachedObjects(done) {
        const blockchain = new Blockchain({ validate: false })
        // clone blocks[1]
        const testBlock = new Block(rlp.decode(rlp.encode(blocks[1].raw)))
        let cachedHash: Buffer
        async.series(
          [
            cb =>
              blockchain.putBlock(testBlock, (err?: any) => {
                if (err) return done(err)
                cachedHash = testBlock.hash()
                cb()
              }),
            cb => {
              // change testBlock's extraData in order to modify its hash
              testBlock.header.extraData = Buffer.from([1])
              blockchain.getBlock(1, (err?: Error, block?: any) => {
                if (err) {
                  return done(err)
                }
                t.equals(
                  cachedHash.toString('hex'),
                  block.hash().toString('hex'),
                  'should not modify cached objects',
                )
                cb()
              })
            },
          ],
          done,
        )
      },
      function getLatest(done) {
        const blockchain = new Blockchain({ validate: false })
        const headers = [new Block.Header(), new Block.Header()]

        headers[0].number = toBuffer(1)
        headers[0].difficulty = '0xfffffff'
        headers[0].parentHash = blocks[0].hash()

        headers[1].number = toBuffer(2)
        headers[1].difficulty = '0xfffffff'
        headers[1].parentHash = headers[0].hash()

        async.series(
          [
            // first, add some headers and make sure the latest block remains the same
            cb =>
              blockchain.putHeaders(headers, (err?: any) => {
                if (err) {
                  return cb(err)
                }
                async.series(
                  [
                    cb =>
                      blockchain.getLatestHeader((err?: any, header?: any) => {
                        if (err) {
                          return done(err)
                        }
                        t.equals(
                          header.hash().toString('hex'),
                          headers[1].hash().toString('hex'),
                          'should update latest header',
                        )
                        cb()
                      }),
                    cb =>
                      blockchain.getLatestBlock((err?: any, block?: any) => {
                        if (err) {
                          return done(err)
                        }
                        t.equals(
                          block.hash().toString('hex'),
                          blocks[0].hash().toString('hex'),
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
              blockchain.putBlock(blocks[1], (err?: Error) => {
                if (err) {
                  return cb(err)
                }
                async.series(
                  [
                    cb =>
                      blockchain.getLatestHeader((err?: Error, header?: any) => {
                        if (err) {
                          return done(err)
                        }
                        t.equals(
                          header.hash().toString('hex'),
                          headers[1].hash().toString('hex'),
                          'should not change latest header',
                        )
                        cb()
                      }),
                    cb =>
                      blockchain.getLatestBlock((err?: Error, block?: any) => {
                        if (err) {
                          return done(err)
                        }
                        t.equals(
                          block.hash().toString('hex'),
                          blocks[1].hash().toString('hex'),
                          'should update latest block',
                        )
                        cb()
                      }),
                  ],
                  cb,
                )
              }),
          ],
          done,
        )
      },
      function mismatchedChains() {
        const common = new Common('rinkeby')
        const blockchain = new Blockchain({ common: common, validate: false })
        const blocks = [
          new Block(null, { common: common }),
          new Block(null, { chain: 'rinkeby' }),
          new Block(null, { chain: 'ropsten' }),
        ]

        blocks[0].setGenesisParams()

        blocks[1].header.number = 1
        blocks[1].header.parentHash = blocks[0].hash()

        blocks[2].header.number = 2
        blocks[2].header.parentHash = blocks[1].hash()

        async.eachOfSeries(blocks, (block, i, cb) => {
          if (i === 0) {
            blockchain.putGenesis(block, cb)
          } else {
            blockchain.putBlock(block, (err: Error) => {
              if (i === 2) {
                t.ok(err.message.match('Chain mismatch'), 'should return chain mismatch error')
              } else {
                t.error(err, 'should not return mismatch error')
              }
              cb()
            })
          }
        })
      },
    ],
    function(err) {
      if (err) {
        t.ok(false, err.message)
      } else {
        t.ok(true, 'no errors')
      }
    },
  )
})

function isConsecutive(blocks: Array<any>) {
  return !blocks.some((block: any, index: number) => {
    if (index === 0) {
      return false
    }
    return Buffer.compare(block.header.parentHash, blocks[index - 1].hash()) !== 0
  })
}

function createTestDB(cb: any) {
  const genesis = new Block()
  genesis.setGenesisParams()
  const db = level()
  db.batch(
    [
      {
        type: 'put',
        key: Buffer.from('6800000000000000006e', 'hex'),
        keyEncoding: 'binary',
        valueEncoding: 'binary',
        value: genesis.hash(),
      },
      {
        type: 'put',
        key: Buffer.from(
          '48d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
          'hex',
        ),
        keyEncoding: 'binary',
        valueEncoding: 'binary',
        value: Buffer.from('00', 'hex'),
      },
      {
        type: 'put',
        key: 'LastHeader',
        keyEncoding: 'binary',
        valueEncoding: 'binary',
        value: genesis.hash(),
      },
      {
        type: 'put',
        key: 'LastBlock',
        keyEncoding: 'binary',
        valueEncoding: 'binary',
        value: genesis.hash(),
      },
      {
        type: 'put',
        key: Buffer.from(
          '680000000000000000d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
          'hex',
        ),
        keyEncoding: 'binary',
        valueEncoding: 'binary',
        value: rlp.encode(genesis.header.raw),
      },
      {
        type: 'put',
        key: Buffer.from(
          '680000000000000000d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa374',
          'hex',
        ),
        keyEncoding: 'binary',
        valueEncoding: 'binary',
        value: rlp.encode(new BN(17179869184).toBuffer()),
      },
      {
        type: 'put',
        key: Buffer.from(
          '620000000000000000d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
          'hex',
        ),
        keyEncoding: 'binary',
        valueEncoding: 'binary',
        value: rlp.encode(genesis.serialize(false).slice(1)),
      },
      {
        type: 'put',
        key: 'heads',
        valueEncoding: 'json',
        value: { head0: { type: 'Buffer', data: [171, 205] } },
      },
    ],
    (err?: Error) => {
      cb(err, db, genesis)
    },
  )
}
