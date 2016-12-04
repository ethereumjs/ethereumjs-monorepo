'use strict'

const test = require('tape')
const Blockchain = require('..')
const Block = require('ethereumjs-block')
const async = require('async')
const ethUtil = require('ethereumjs-util')

test('blockchain test', function (t) {
  t.plan(30)
  var blockchain = new Blockchain()
  var genesisBlock
  var blocks = []
  blockchain.validate = false
  async.series([

    function (done) {
      blockchain.getHead(function (err, head) {
        if (err) return done(err)
        t.ok(true, 'should not crash on getting head of a blockchain without a genesis')
        done()
      })
    },
    function addgenesis (done) {
      genesisBlock = new Block()
      genesisBlock.setGenesisParams()
      blockchain.putGenesis(genesisBlock, function (err) {
        if (err) return done(err)
        t.equal(genesisBlock.hash().toString('hex'), blockchain.meta.genesis, 'genesis block hash should be correct')
        blocks.push(genesisBlock)
        done()
      })
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
    function getBlocks11 (done) {
      // start: 5, max: 10, skip: 0, reverse: true
      blockchain.getBlocks(5, 10, 1, true, function (err, blocks) {
        if (err) return done(err)
        t.equals(blocks.length, 3, 'should get 3 blocks')
        t.ok(!isConsecutive(blocks.reverse()), 'blocks should not be consecutive')
        done()
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

test('iterator test', function (t) {
  t.plan(1)
  var blockchain = new Blockchain()
  blockchain.validate = false
  blockchain.iterator('test', function (block, done) {
    t.ok(false)
    done()
  }, function () {
    t.ok(true)
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
