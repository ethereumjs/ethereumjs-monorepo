'use strict'

const test = require('tape')
const Blockchain = require('..')
const Block = require('ethereumjs-block')
const async = require('async')
const ethUtil = require('ethereumjs-util')
const levelup = require('levelup')
const memdown = require('memdown')
const testData = require('./testdata.json')
const BN = require('bn.js')

test('blockchain test', function (t) {
  t.plan(61)
  var blockchain = new Blockchain()
  var genesisBlock
  var blocks = []
  var forkBlock
  blockchain.validate = false
  async.series([

    function (done) {
      blockchain.getHead(function (err, head) {
        if (err) return done(err)
        t.ok(true, 'should not crash on getting head of a blockchain without a genesis')
        done()
      })
    },
    function alternateConstructors (done) {
      var db = levelup('', { db: memdown })
      var blockchain = new Blockchain(db)
      t.equals(db, blockchain.db, 'support constructor with db parameter')
      blockchain = new Blockchain({detailsDb: db, blockDb: db})
      t.equals(db, blockchain.db, 'support blockDb and detailsDb params')
      t.notOk(blockchain.detailsDb, 'ignore detailsDb param')
      done()
    },
    function addgenesis (done) {
      genesisBlock = new Block()
      genesisBlock.setGenesisParams()
      blockchain.putGenesis(genesisBlock, function (err) {
        if (err) return done(err)
        t.equals(genesisBlock.hash().toString('hex'), blockchain.meta.genesis.toString('hex'), 'genesis block hash should be correct')
        blocks.push(genesisBlock)
        done()
      })
    },
    function invalidGenesis (done) {
      var badBlock = new Block()
      badBlock.header.number = Buffer.from([])
      blockchain.validate = true
      blockchain.putBlock(badBlock, function (err) {
        t.ok(err, 'should not validate a block incorrectly flagged as genesis')
        blockchain.validate = false
        done()
      }, false)
    },
    function addBlocks (done) {
      function addNextBlock (blockNumber) {
        var block = new Block()
        block.header.number = ethUtil.toBuffer(blockNumber)
        block.header.difficulty = '0xfffffff'
        block.header.parentHash = blocks[blockNumber - 1].hash()
        blockchain.putBlock(block, function (err) {
          if (err) return done(err)

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
    function getBlockByNumber (done) {
      blockchain.getBlock(1, function (err, block) {
        if (err) return done(err)
        t.equals(block.hash().toString('hex'), blocks[1].hash().toString('hex'), 'should get block by number')
        done()
      })
    },
    function getBlockByHash (done) {
      blockchain.getBlock(genesisBlock.hash(), function (err, block) {
        if (err) return done(err)
        t.equals(block.hash().toString('hex'), genesisBlock.hash().toString('hex'), 'should get block by hash')
        done()
      })
    },
    function getBlocks1 (done) {
      // start: genesisHash, max: 5, skip: 0, reverse: false
      blockchain.getBlocks(genesisBlock.hash(), 5, 0, false, function (err, blocks) {
        if (err) return done(err)
        t.equals(blocks.length, 5, 'should get 5 blocks')
        t.ok(isConsecutive(blocks), 'blocks should be consecutive')
        done()
      })
    },
    function getBlocks2 (done) {
      // start: genesisHash, max: 5, skip: 1, reverse: false
      blockchain.getBlocks(genesisBlock.hash(), 5, 1, false, function (err, blocks) {
        if (err) return done(err)
        t.equals(blocks.length, 5, 'should get 5 blocks')
        t.ok(!isConsecutive(blocks), 'blocks should not be consecutive')
        done()
      })
    },
    function getBlocks3 (done) {
      // start: genesisHash, max: 5, skip: 2, reverse: false
      blockchain.getBlocks(genesisBlock.hash(), 5, 2, false, function (err, blocks) {
        if (err) return done(err)
        t.equals(blocks.length, 4, 'should get 4 blocks')
        t.ok(!isConsecutive(blocks), 'blocks should not be consecutive')
        done()
      })
    },
    function getBlocks4 (done) {
      // start: genesisHash, max: 12, skip: 0, reverse: false
      blockchain.getBlocks(genesisBlock.hash(), 12, 0, false, function (err, blocks) {
        if (err) return done(err)
        t.equals(blocks.length, 10, 'should get 10 blocks')
        t.ok(isConsecutive(blocks), 'blocks should be consecutive')
        done()
      })
    },
    function getBlocks5 (done) {
      // start: 0, max: 5, skip: 0, reverse: false
      blockchain.getBlocks(0, 5, 0, false, function (err, blocks) {
        if (err) return done(err)
        t.equals(blocks.length, 5, 'should get 5 blocks')
        t.ok(isConsecutive(blocks), 'blocks should be consecutive')
        done()
      })
    },
    function getBlocks6 (done) {
      // start: 0, max: 5, skip: 1, reverse: false
      blockchain.getBlocks(1, 5, 1, false, function (err, blocks) {
        if (err) return done(err)
        t.equals(blocks.length, 5, 'should get 5 blocks')
        t.ok(!isConsecutive(blocks), 'blocks should not be consecutive')
        done()
      })
    },
    function getBlocks7 (done) {
      // start: 0, max: 5, skip: 2, reverse: false
      blockchain.getBlocks(0, 5, 2, false, function (err, blocks) {
        if (err) return done(err)
        t.equals(blocks.length, 4, 'should get 4 blocks')
        t.ok(!isConsecutive(blocks), 'blocks should not be consecutive')
        done()
      })
    },
    function getBlocks8 (done) {
      // start: 0, max: 12, skip: 0, reverse: false
      blockchain.getBlocks(0, 12, 0, false, function (err, blocks) {
        if (err) return done(err)
        t.equals(blocks.length, 10, 'should get 10 blocks')
        t.ok(isConsecutive(blocks), 'blocks should be consecutive')
        done()
      })
    },
    function getBlocks9 (done) {
      // start: 1, max: 5, skip: 0, reverse: false
      blockchain.getBlocks(1, 5, 0, false, function (err, blocks) {
        if (err) return done(err)
        t.equals(blocks.length, 5, 'should get 5 blocks')
        t.ok(isConsecutive(blocks), 'blocks should be consecutive')
        done()
      })
    },
    function getBlocks10 (done) {
      // start: 5, max: 5, skip: 0, reverse: true
      blockchain.getBlocks(5, 5, 0, true, function (err, blocks) {
        if (err) return done(err)
        t.equals(blocks.length, 5, 'should get 5 blocks')
        t.ok(isConsecutive(blocks.reverse()), 'blocks should be consecutive')
        done()
      })
    },
    function getBlocks11 (done) {
      // start: 5, max: 10, skip: 0, reverse: true
      blockchain.getBlocks(5, 10, 0, true, function (err, blocks) {
        if (err) return done(err)
        t.equals(blocks.length, 6, 'should get 6 blocks')
        t.ok(isConsecutive(blocks.reverse()), 'blocks should be consecutive')
        done()
      })
    },
    function getBlocks12 (done) {
      // start: 5, max: 10, skip: 0, reverse: true
      blockchain.getBlocks(5, 10, 1, true, function (err, blocks) {
        if (err) return done(err)
        t.equals(blocks.length, 3, 'should get 3 blocks')
        t.ok(!isConsecutive(blocks.reverse()), 'blocks should not be consecutive')
        done()
      })
    },
    function selectNeededHashes (done) {
      var neededHash = Buffer.from('abcdef', 'hex')
      blockchain.selectNeededHashes([
        blocks[0].hash(),
        blocks[9].hash(),
        neededHash
      ], (err, hashes) => {
        if (err) return done(err)
        t.equals(hashes[0].toString('hex'), neededHash.toString('hex'), 'should find needed hash')
        done()
      })
    },
    function iterateBlocks (done) {
      var i = 0
      blockchain.iterator('test', function (block, reorg, cb) {
        if (block.hash().equals(blocks[i + 1].hash())) i++
        cb()
      }, function () {
        t.equals(i, 9, 'should iterate through 9 blocks')
        done()
      })
    },
    function iterateError (done) {
      blockchain.iterator('error', function (block, reorg, cb) {
        cb(new Error('iterator func error'))
      }, function (err) {
        t.ok(err, 'should catch iterator func error')
        t.equal(err.message, 'iterator func error', 'should return correct error')
        done()
      })
    },
    function iterateEmpty (done) {
      var blockchain = new Blockchain()
      blockchain.validate = false
      blockchain.iterator('test', function () {
        t.ok(false, 'should not call iterator function')
        done()
      }, function () {
        t.ok(true, 'should finish iterating')
        done()
      })
    },
    function getMeta (done) {
      t.equals(blockchain.meta.rawHead.toString('hex'), blocks[9].hash().toString('hex'), 'should get meta.rawHead')
      t.equals(blockchain.meta.genesis.toString('hex'), genesisBlock.hash().toString('hex'), 'should get meta.genesis')
      t.ok(blockchain.meta.heads['test'], 'should get meta.heads')
      done()
    },
    function addForkBlockAndResetStaleHeads (done) {
      forkBlock = new Block()
      forkBlock.header.number = ethUtil.toBuffer(9)
      forkBlock.header.difficulty = '0xffffffff'
      forkBlock.header.parentHash = blocks[8].hash()
      blockchain._heads['staletest'] = blockchain._headHeader
      blockchain.putBlock(forkBlock, function (err) {
        t.equals(blockchain._heads['staletest'].toString('hex'), blocks[8].hash().toString('hex'), 'should update stale head')
        t.notOk(err, 'should add new block in fork')
        done()
      })
    },
    function delForkBlock (done) {
      blockchain.delBlock(forkBlock.hash(), (err) => {
        t.ok(!err, 'should delete fork block')
        t.equals(blockchain._headHeader.toString('hex'), blocks[8].hash().toString('hex'), 'should not change head')
        done()
      })
    },
    function delBlocks (done) {
      function delNextBlock (number, cb) {
        var block = blocks[number]
        blockchain.delBlock(block.hash(), (err) => {
          if (err) return cb(err)
          if (number > 6) {
            return delNextBlock(--number, cb)
          }
          cb()
        })
      }
      delNextBlock(9, (err) => {
        t.ok(!err, 'should delete blocks in canonical chain')
        t.equals(blockchain._headHeader.toString('hex'), blocks[5].hash().toString('hex'), 'should have block 5 as head')
        done()
      })
    },
    function delBlockAndChildren (done) {
      blockchain.delBlock(blocks[1].hash(), (err) => {
        t.ok(!err, 'should delete block and children')
        t.equals(blockchain._headHeader.toString('hex'), genesisBlock.hash().toString('hex'), 'should have genesis as head')
        done()
      })
    },
    function putBlocks (done) {
      blockchain.putBlocks(blocks.slice(1), (err) => {
        t.ok(!err, 'should put multiple blocks at once')
        done()
      })
    },
    function getHeads (done) {
      createTestDB((err, db, genesis) => {
        if (err) return done(err)
        var blockchain = new Blockchain({db: db})
        blockchain.getHead((err, head) => {
          if (err) return done(err)
          t.equals(head.hash().toString('hex'), genesis.hash().toString('hex'), 'should get head')
          t.equals(blockchain._heads['head0'].toString('hex'), 'abcd', 'should get state root heads')
          done()
        })
      })
    },
    function validate (done) {
      var blockchain = new Blockchain({validate: true})
      var genesisBlock = new Block()
      genesisBlock.setGenesisParams()
      blockchain.putGenesis(genesisBlock, function (err) {
        t.notOk(err, 'should validate genesisBlock')
        var invalidBlock = new Block()
        blockchain.putBlock(invalidBlock, function (err) {
          t.ok(err, 'should not validate an invalid block')
          done()
        })
      })
    },
    function addBlockWithBody (done) {
      var blockchain = new Blockchain({validate: false})
      var genesisBlock = new Block(Buffer.from(testData.genesisRLP.slice(2), 'hex'))
      blockchain.putGenesis(genesisBlock, function (err) {
        if (err) return done(err)
        var block = new Block(Buffer.from(testData.blocks[0].rlp.slice(2), 'hex'))
        blockchain.putBlock(block, function (err) {
          if (err) return done(err)
          t.notOk(err, 'should add block with a body')
          done()
        })
      })
    },
    function uncachedDbOps (done) {
      createTestDB((err, db, genesis) => {
        if (err) return done(err)
        var blockchain = new Blockchain({db: db})
        async.series([
          cb => blockchain._hashToNumber(genesisBlock.hash(), (err, number) => {
            t.equals(number.toString(10), '0', 'should perform _hashToNumber correctly')
            cb(err)
          }),
          cb => blockchain._numberToHash(new BN(0), (err, hash) => {
            t.equals(genesisBlock.hash().toString('hex'), hash.toString('hex'), 'should perform _numberToHash correctly')
            cb(err)
          }),
          cb => blockchain._getTd(genesisBlock.hash(), new BN(0), (err, td) => {
            t.equals(td.toBuffer().toString('hex'), genesis.header.difficulty.toString('hex'), 'should perform _getTd correctly')
            cb(err)
          })
        ], done)
      })
    },
    function saveHeads (done) {
      var db = levelup('', { db: memdown })
      var blockchain = new Blockchain({db: db, validate: false})

      blockchain.putBlock(blocks[1], (err) => {
        if (err) return done(err)
        blockchain = new Blockchain({db: db, validate: false})
        async.series([
          (cb) => blockchain.getLatestHeader((err, header) => {
            if (err) return done(err)
            t.equals(header.hash().toString('hex'), blocks[1].hash().toString('hex'), 'should get latest header')
            cb()
          }),
          (cb) => blockchain.getLatestBlock((err, headBlock) => {
            if (err) return done(err)
            t.equals(headBlock.hash().toString('hex'), blocks[1].hash().toString('hex'), 'should get latest block')
            cb()
          })
        ], done)
      })
    }
  ], function (err) {
    if (err) {
      t.ok(false, err)
    } else {
      t.ok(true, 'no errors')
    }
  })
})

function isConsecutive (blocks) {
  var isConsecutive = true
  blocks.some(function (block, index) {
    if (index === 0) return false
    if (Buffer.compare(block.header.parentHash, blocks[index - 1].hash()) !== 0) {
      isConsecutive = false
      return true
    }
  })
  return isConsecutive
}

function createTestDB (cb) {
  var genesis = new Block()
  genesis.setGenesisParams()
  var db = levelup('', { db: memdown })
  db.batch([{
    type: 'put',
    key: Buffer.from('6800000000000000006e', 'hex'),
    keyEncoding: 'binary',
    valueEncoding: 'binary',
    value: genesis.hash()
  }, {
    type: 'put',
    key: Buffer.from('48d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3', 'hex'),
    keyEncoding: 'binary',
    valueEncoding: 'binary',
    value: Buffer.from('00', 'hex')
  }, {
    type: 'put',
    key: 'LastHeader',
    keyEncoding: 'binary',
    valueEncoding: 'binary',
    value: genesis.hash()
  }, {
    type: 'put',
    key: 'LastBlock',
    keyEncoding: 'binary',
    valueEncoding: 'binary',
    value: genesis.hash()
  }, {
    type: 'put',
    key: Buffer.from('680000000000000000d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3', 'hex'),
    keyEncoding: 'binary',
    valueEncoding: 'binary',
    value: ethUtil.rlp.encode(genesis.header.raw)
  }, {
    type: 'put',
    key: Buffer.from('680000000000000000d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa374', 'hex'),
    keyEncoding: 'binary',
    valueEncoding: 'binary',
    value: ethUtil.rlp.encode(new BN(17179869184).toBuffer())
  }, {
    type: 'put',
    key: Buffer.from('620000000000000000d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3', 'hex'),
    keyEncoding: 'binary',
    valueEncoding: 'binary',
    value: ethUtil.rlp.encode(genesis.serialize(false).slice(1))
  }, {
    type: 'put',
    key: 'heads',
    valueEncoding: 'json',
    value: { 'head0': { 'type': 'Buffer', 'data': [171, 205] } }
  }], (err) => {
    cb(err, db, genesis)
  })
}
