const test = require('tape')
const Blockchain = require('..')
const Block = require('ethereumjs-block')
const async = require('async')

test('blockchain test', function (t) {
  t.plan(2)
  var blockchain = new Blockchain()
  blockchain.validate = false
  async.series([

    function (done) {
      blockchain.getHead(function (err, head) {
        t.ok(true, 'should not crash on getting head of a blockchain without a genesis')
        done()
      })
    },
    function (done) {
      var block = new Block()
      block.setGenesisParams()
      blockchain.putBlock(block, function () {
        t.equal(block.hash().toString('hex'), blockchain.meta.genesis)
      })
    }
  ])
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

// var assert = require('assert'),
//   Block = require('../lib/block.js'),
//   Blockchain = require('../lib/blockchain.js'),
//   levelup = require('levelup'),
//   async = require('async'),
//   VM = require('../lib/vm'),
//   Trie = require('merkle-patricia-tree')

// var trie = new Trie(),
//   vm = new VM(trie),
//   blockFixtures = require('./fixtures/blocks.json').slice()

// var blockDB = levelup('', {
//   db: require('memdown')
// })

// var blockchain

// describe('[Blockchain]: Basic functions', function () {
//   it('should create a new block chain', function (done) {
//     blockchain = new Blockchain(blockDB)
//   })

//   it('should create and add genesis block', function (done) {
//     vm.generateGenesis(function () {
//       var block = new Block()
//       block.header.stateRoot = vm.trie.root
//       blockchain.addBlock(block, done)
//     })
//   })

//   it('should add blocks', function (done) {
//     blockFixtures.reverse()
//     async.eachSeries(blockFixtures, function (rawBlock, callback) {
//       blockchain.addBlock(rawBlock.block, callback)
//     }, done)
//   })

//   it('should have added the head correctly', function () {
//     assert(blockchain.meta.head === blockFixtures[blockFixtures.length - 1].hash)
//   })

//   it('should have added the correct height', function () {
//     assert(blockchain.meta.height === blockFixtures.length)
//   })

//   it('should fetch hashes from the chain', function (done) {
//     blockchain.getBlockHashes(blockFixtures[1].hash, 2, function (errs, hashes) {
//       assert(hashes.length === 2, 'number of hashes')
//       assert(blockFixtures[3].hash === hashes[0])
//       assert(blockFixtures[2].hash === hashes[1])
//       done()
//     })
//   })

//   it('should fetch hashes from the chain backwards', function (done) {
//     blockchain.getBlockHashes(blockFixtures[4].hash, -2, function (errs, hashes) {
//       assert(hashes.length === 2, 'number of hashes')
//       assert(blockFixtures[3].hash === hashes[0])
//       assert(blockFixtures[2].hash === hashes[1])
//       done()
//     })
//   })

//   it('should fetch hashes from the chain backwards even when more blocks are requested then exsist', function (done) {
//     blockchain.getBlockHashes(blockFixtures[4].hash, -8, function (errs, hashes) {
//       assert(hashes.length === 5)
//       assert(blockFixtures[3].hash === hashes[0])
//       assert(blockFixtures[2].hash === hashes[1])
//       done()
//     })
//   })

//   it('it should fetch a block from the DB', function (done) {
//     blockchain.getBlock(new Buffer(blockFixtures[4].hash, 'hex'), function (errs, block) {
//       assert(blockFixtures[4].hash === block.hash().toString('hex'))
//       done()
//     })
//   })

//   it('it should fetch blocks from the DB', function (done) {
//     blockchain.getBlocks([new Buffer(blockFixtures[4].hash, 'hex')], function (errs, blocks) {
//       assert(blocks.length === 1)
//       assert(blockFixtures[4].hash === blocks[0].hash().toString('hex'))
//       done()
//     })
//   })

//   it('should retrieve all the blocks in order from newest to oldest', function (done) {
//     blockchain.getBlockChain(blockFixtures[0].hash, blockFixtures.length, function (err, results) {
//       assert(results.length === blockFixtures.length - 1, 'should have correct number of blocks')
//       done(err)
//     })
//   })
// })
