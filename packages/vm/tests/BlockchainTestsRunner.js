const async = require('async')
const testUtil = require('./util.js')
const ethUtil = require('ethereumjs-util')
const Trie = require('merkle-patricia-tree/secure')
const Block = require('ethereumjs-block')
const Blockchain = require('ethereumjs-blockchain').default
const BlockHeader = require('ethereumjs-block/header.js')
const level = require('level')
const levelMem = require('level-mem')

const cacheDB = level('./.cachedb')
module.exports = function runBlockchainTest(options, testData, t, cb) {
  const blockchainDB = levelMem()
  const state = new Trie()
  let validate = false
  // Only run with block validation when sealEngine present in test file
  // and being set to Ethash PoW validation
  if (testData.sealEngine && testData.sealEngine === 'Ethash') {
    validate = true
  }
  const blockchain = new Blockchain({
    db: blockchainDB,
    hardfork: options.forkConfigVM,
    validate: validate,
  })
  if (validate) {
    blockchain.ethash.cacheDB = cacheDB
  }
  let VM
  if (options.dist) {
    VM = require('../dist/index.js').default
  } else {
    VM = require('../lib/index').default
  }
  const vm = new VM({
    state,
    blockchain: blockchain,
    hardfork: options.forkConfigVM,
  })
  const genesisBlock = new Block({ hardfork: options.forkConfigVM })

  testData.homestead = true
  if (testData.homestead) {
    vm.on('beforeTx', function (tx) {
      tx._homestead = true
    })
    vm.on('beforeBlock', function (block) {
      block.header.isHomestead = function () {
        return true
      }
    })
  }
  async.series(
    [
      // set up pre-state
      function (done) {
        testUtil.setupPreConditions(state, testData, function () {
          done()
        })
      },
      function (done) {
        // create and add genesis block
        genesisBlock.header = new BlockHeader(formatBlockHeader(testData.genesisBlockHeader), {
          hardfork: options.forkConfigVM,
        })
        t.equal(
          vm.stateManager._trie.root.toString('hex'),
          genesisBlock.header.stateRoot.toString('hex'),
          'correct pre stateRoot',
        )
        if (testData.genesisRLP) {
          t.equal(
            genesisBlock.serialize().toString('hex'),
            testData.genesisRLP.slice(2),
            'correct genesis RLP',
          )
        }
        blockchain.putGenesis(genesisBlock, function (err) {
          done(err)
        })
      },
      function (done) {
        async.eachSeries(
          testData.blocks,
          function (raw, cb) {
            try {
              const block = new Block(Buffer.from(raw.rlp.slice(2), 'hex'), {
                hardfork: options.forkConfigVM,
              })
              // forces the block into thinking they are homestead
              if (testData.homestead) {
                block.header.isHomestead = function () {
                  return true
                }
                block.uncleHeaders.forEach(function (uncle) {
                  uncle.isHomestead = function () {
                    return true
                  }
                })
              }
              blockchain.putBlock(block, function (err) {
                cb(err)
              })
            } catch (err) {
              if (err) {
                t.fail(err)
              }
              cb()
            }
          },
          function () {
            done()
          },
        )
      },
      function setGenesisStateRoot(done) {
        // This is a trick to avoid generating the canonical genesis
        // state. Generating the genesis state is not needed because
        // blockchain tests come with their own `pre` world state.
        // TODO: Add option to `runBlockchain` not to generate genesis state.
        vm._common.genesis().stateRoot = vm.stateManager._trie.root
        done()
      },
      function runBlockchain(done) {
        vm.runBlockchain()
          .then(() => done())
          .catch(() => done())
      },
      function getHead(done) {
        vm.blockchain.getHead(function (err, block) {
          if (testData.lastblockhash.substr(0, 2) === '0x') {
            // fix for BlockchainTests/GeneralStateTests/stRandom/*
            testData.lastblockhash = testData.lastblockhash.substr(2)
          }
          t.equal(block.hash().toString('hex'), testData.lastblockhash, 'last block hash')
          // if the test fails, then block.header is the prej because
          // vm.runBlock has a check that prevents the actual postState from being
          // imported if it is not equal to the expected postState. it is useful
          // for debugging to skip this, so that verifyPostConditions will compare
          // testData.postState to the actual postState, rather than to the preState.
          if (!options.debug) {
            // make sure the state is set before checking post conditions
            vm.stateManager._trie.root = block.header.stateRoot
          }
          done(err)
        })
      },
      function (done) {
        if (options.debug) {
          testUtil.verifyPostConditions(state, testData.postState, t, done)
        } else {
          done()
        }
      },
    ],
    function () {
      t.equal(
        blockchain.meta.rawHead.toString('hex'),
        testData.lastblockhash,
        'correct header block',
      )
      cb()
    },
  )
}

function formatBlockHeader(data) {
  const r = {}
  const keys = Object.keys(data)
  keys.forEach(function (key) {
    r[key] = ethUtil.addHexPrefix(data[key])
  })
  return r
}
