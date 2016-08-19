const test = require('tape')
const Blockchain = require('..')
const Block = require('ethereumjs-block')
const async = require('async')

test('blockchain test', function (t) {
  t.plan(5)
  var blockchain = new Blockchain()
  var genesisBlock
  var blocks = []
  blockchain.validate = false
  async.series([

    function (done) {
      blockchain.getHead(function (err, head) {
        if(err) return done(err)
        t.ok(true, 'should not crash on getting head of a blockchain without a genesis')
        done()
      })
    },
    function addgenesis (done) {
      genesisBlock = new Block()
      genesisBlock.setGenesisParams()
      blockchain.putBlock(genesisBlock, function (err) {
        if(err) return done(err)
        t.equal(genesisBlock.hash().toString('hex'), blockchain.meta.genesis, 'genesis block hash should be correct')
        blocks.push(genesisBlock)
        done()
      })
    },
    function addBlocks (done) {
      function addNextBlock(blockNumber){
        var block = new Block()
        block.header.number = blockNumber
        block.header.difficulty = '0xfffffff'
        block.header.parentHash = blocks[blockNumber - 1].hash()
        blockchain.putBlock(block, function (err) {
          
          if(err) return done(err)

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
    function getBlockByHash (done){
      blockchain.getBlock(genesisBlock.hash(), function (err, block) {
        if(err) return done(err)
        t.equals(block.hash().toString('hex'), genesisBlock.hash().toString('hex'), 'should get block by hash')
        done()
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
