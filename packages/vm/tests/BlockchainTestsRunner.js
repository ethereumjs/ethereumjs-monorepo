const level = require('level')
const levelMem = require('level-mem')
const { addHexPrefix, toBuffer } = require('ethereumjs-util')
const Trie = require('merkle-patricia-tree').SecureTrie
const { Block, BlockHeader } = require('@ethereumjs/block')
const Blockchain = require('@ethereumjs/blockchain').default
const Common = require('@ethereumjs/common').default
const { setupPreConditions, verifyPostConditions, getDAOCommon } = require('./util.js')

module.exports = async function runBlockchainTest(options, testData, t) {
  // ensure that the test data is the right fork data
  if (testData.network != options.forkConfigTestSuite) {
    t.comment('skipping test: no data available for ' + options.forkConfigTestSuite)
    return
  }

  const blockchainDB = levelMem()
  const cacheDB = level('./.cachedb')
  const state = new Trie()
  const hardfork = options.forkConfigVM

  let validate = false
  // Only run with block validation when sealEngine present in test file
  // and being set to Ethash PoW validation
  if (testData.sealEngine && testData.sealEngine === 'Ethash') {
    validate = true
  }

  let eips = []
  if (hardfork == 'berlin') {
    // currently, the BLS tests run on the Berlin network, but our VM does not activate EIP2537
    // if you run the Berlin HF
    eips = [2537]
  }

  let common
  if (options.forkConfigTestSuite == 'HomesteadToDaoAt5') {
    common = getDAOCommon(5)
  } else {
    common = new Common({ chain: 'mainnet', hardfork, eips })
  }

  const blockchain = new Blockchain({
    db: blockchainDB,
    common,
    validateBlocks: validate,
    validatePow: validate,
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
    blockchain,
    common,
  })

  const genesisBlock = new Block(undefined, { common })

  // set up pre-state
  await setupPreConditions(vm.stateManager._trie, testData)

  // create and add genesis block
  genesisBlock.header = new BlockHeader(formatBlockHeader(testData.genesisBlockHeader), {
    common,
  })

  t.ok(vm.stateManager._trie.root.equals(genesisBlock.header.stateRoot), 'correct pre stateRoot')

  if (testData.genesisRLP) {
    const rlp = toBuffer(testData.genesisRLP)
    t.ok(genesisBlock.serialize().equals(rlp), 'correct genesis RLP')
  }

  await blockchain.putGenesis(genesisBlock)

  async function handleError(error, expectException, cacheDB) {
    if (expectException) {
      t.pass(`Expected exception ${expectException}`)
    } else {
      console.log(error)
      t.fail(error)
    }
    await cacheDB.close()
  }

  const numBlocks = testData.blocks.length
  let currentBlock = 0
  let lastBlock = false
  for (const raw of testData.blocks) {
    currentBlock++
    lastBlock = currentBlock == numBlocks
    const paramFork = `expectException${options.forkConfigTestSuite}`
    // Two naming conventions in ethereum/tests to indicate "exception occurs on all HFs" semantics
    // Last checked: ethereumjs-testing v1.3.1 (2020-05-11)
    const paramAll1 = 'expectExceptionALL'
    const paramAll2 = 'expectException'
    const expectException = raw[paramFork]
      ? raw[paramFork]
      : raw[paramAll1] || raw[paramAll2] || raw.blockHeader == undefined

    try {
      const block = new Block(Buffer.from(raw.rlp.slice(2), 'hex'), {
        common,
      })

      try {
        await blockchain.putBlock(block)
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

      const headBlock = await vm.blockchain.getHead()

      if (testData.lastblockhash.substr(0, 2) === '0x') {
        // fix for BlockchainTests/GeneralStateTests/stRandom/*
        testData.lastblockhash = testData.lastblockhash.substr(2)
      }
      if (expectException !== undefined && lastBlock) {
        // only check last block hash on last block
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
        await verifyPostConditions(state, testData.postState, t)
      }
      if (expectException !== undefined && lastBlock) {
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
