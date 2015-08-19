const async = require('async')
const testUtil = require('./util.js')
const Trie = require('merkle-patricia-tree/secure')
const assert = require('assert')
const Block = require('ethereumjs-block')
const Blockchain = require('ethereumjs-blockchain')
const BlockHeader = require('ethereumjs-block/header.js')
const VM = require('../')
const level = require('levelup')

var cacheDB = new level('./.cachedb')
module.exports = function runBlockchainTest(testData, options, cb){
  var blockchainDB = new level('', { db: require('memdown') })
  var state = new Trie()
  var blockchain = new Blockchain(blockchainDB)
  blockchain.ethash.cacheDB = cacheDB
  var t = options.t
  var vm = new VM(state, blockchain)

  async.series([
    //set up pre-state
    function(done) {
      testUtil.setupPreConditions(state, testData, function() {
        done()
      })
    },
    function(done) {
      //create and add genesis block
      var genesisBlock = new Block()
      genesisBlock.header = new BlockHeader(testData.genesisBlockHeader)
      t.equal(state.root.toString('hex'), genesisBlock.header.stateRoot.toString('hex'), 'correct pre stateRoot')
      if(testData.genesisRLP)
        t.equal(genesisBlock.serialize().toString('hex'), testData.genesisRLP.slice(2), 'correct genesis RLP')

      blockchain.addBlock(genesisBlock, done)
    },
    function(done) {
      async.eachSeries(testData.blocks, function(raw, cb){
        try{
          var block = new Block(new Buffer(raw.rlp.slice(2), 'hex'))
          blockchain.addBlock(block, function(){
            cb()
          })
        }catch(err){
          cb()
        }

      }, function(){done()})
    },
    function runBlockchain(done){
      vm.runBlockchain(done)
    },
    function getHead(done){
      vm.blockchain.getHead(function(err, block){
        t.equal(block.hash().toString('hex'), testData.lastblockhash, 'last block hash')
        //make sure the state is set beofore checking post conditions
        state.root = block.header.stateRoot
        done();
      })
    },
    function(done){
      // state.root = blockchain.head.header.stateRoot
      testUtil.verifyPostConditions(state, testData.postState, t, done)
    }
  ], function(){
    t.equal(blockchain.meta.rawHead.toString('hex'), testData.lastblockhash, 'correct header block')
    cb();
  })
}
