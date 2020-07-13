const { promisify } = require('util')
const { setupPreConditions, verifyPostConditions } = require('./util.js')
const { addHexPrefix } = require('ethereumjs-util')
const Trie = require('merkle-patricia-tree').SecureTrie
const { Block, BlockHeader } = require('@ethereumjs/block')
const Blockchain = require('@ethereumjs/blockchain').default
const level = require('level')
const levelMem = require('level-mem')

module.exports = async function runBlockchainTest(options, testData, t) {
  // ensure that the test data is the right fork data
  if (testData.network != options.forkConfigTestSuite) {
    t.comment("skipping test: no data available for " + options.forkConfigTestSuite)
    return
  }

  const blockchainDB = levelMem()
  const cacheDB = level('./.cachedb')
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
  const genesisBlock = new Block(undefined, { hardfork: options.forkConfigVM })

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

  // set up pre-state
  await setupPreConditions(vm.stateManager._trie, testData)

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
  const putGenesisAsync = promisify(blockchain.putGenesis).bind(blockchain)
  await putGenesisAsync(genesisBlock)

  async function handleError(error, expectException, cacheDB) {
    if (expectException) {
      t.pass(`Expected exception ${expectException}`)
    } else {
      console.log(error)
      t.fail(error)
    }
    await cacheDB.close()
  }

  for (const raw of testData.blocks) {
    const paramFork = `expectException${options.forkConfigTestSuite}`
    // Two naming conventions in ethereum/tests to indicate "exception occurs on all HFs" semantics
    // Last checked: ethereumjs-testing v1.3.1 (2020-05-11)
    const paramAll1 = 'expectExceptionALL'
    const paramAll2 = 'expectException'
    const expectException = raw[paramFork] ? raw[paramFork] : raw[paramAll1] || raw[paramAll2]

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
      const putBlockAsync = promisify(blockchain.putBlock).bind(blockchain)
      try {
        await putBlockAsync(block)
      } catch (error) {
        await handleError(error, expectException, cacheDB)
        return
      }

      // This is a trick to avoid generating the canonical genesis
      // state. Generating the genesis state is not needed because
      // blockchain tests come with their own `pre` world state.
      // TODO: Add option to `runBlockchain` not to generate genesis state.
      vm._common.genesis().stateRoot = vm.stateManager._trie.root

      await vm.runBlockchain()

      const getHeadAsync = promisify(vm.blockchain.getHead).bind(vm.blockchain)
      const headBlock = await getHeadAsync()

      if (testData.lastblockhash.substr(0, 2) === '0x') {
        // fix for BlockchainTests/GeneralStateTests/stRandom/*
        testData.lastblockhash = testData.lastblockhash.substr(2)
      }
      if (expectException !== undefined) {
        t.equal(headBlock.hash().toString('hex'), testData.lastblockhash, 'last block hash')
      }
      // if the test fails, then block.header is the prej because
      // vm.runBlock has a check that prevents the actual postState from being
      // imported if it is not equal to the expected postState. it is useful
      // for debugging to skip this, so that verifyPostConditions will compare
      // testData.postState to the actual postState, rather than to the preState.
      if (!options.debug) {
        // make sure the state is set before checking post conditions
        vm.stateManager._trie.root = headBlock.header.stateRoot
      }

      if (options.debug) {
        const verifyPostConditionsAsync = promisify(verifyPostConditions)
        await verifyPostConditionsAsync(state, testData.postState, t)
      }
      if (expectException !== undefined) {
        t.equal(
          blockchain.meta.rawHead.toString('hex'),
          testData.lastblockhash,
          'correct header block',
        )
      }
      await cacheDB.close()
    } catch (error) {
      await handleError(error, expectException, cacheDB)
      return
    }
  }
}

function formatBlockHeader(data) {
  const r = {}
  const keys = Object.keys(data)
  keys.forEach(function (key) {
    r[key] = addHexPrefix(data[key])
  })
  return r
}
