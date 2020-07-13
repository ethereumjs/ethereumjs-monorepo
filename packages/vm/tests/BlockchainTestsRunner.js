const level = require('level')
const levelMem = require('level-mem')
const { promisify } = require('util')
const { addHexPrefix, toBuffer } = require('ethereumjs-util')
const Trie = require('merkle-patricia-tree').SecureTrie
const { Block, BlockHeader } = require('@ethereumjs/block')
const Blockchain = require('@ethereumjs/blockchain').default
const Common = require('@ethereumjs/common').default
const { setupPreConditions, verifyPostConditions } = require('./util.js')

module.exports = async function runBlockchainTest(options, testData, t) {
  const state = new Trie()
  const blockchainDB = levelMem()
  const cacheDB = level('./.cachedb')

  let validate = false
  // Only run with block validation when sealEngine present in test file
  // and being set to Ethash PoW validation
  if (testData.sealEngine && testData.sealEngine === 'Ethash') {
    validate = true
  }

  const hardfork = options.forkConfigVM
  const common = new Common('mainnet', hardfork)

  const blockchain = new Blockchain({
    db: blockchainDB,
    common,
    validate,
  })

  if (validate) {
    blockchain.ethash.cacheDB = cacheDB
  }

  const VM = options.dist ? require('../dist/index.js').default : require('../lib/index').default

  const vm = new VM({
    state,
    blockchain,
    hardfork,
  })

  const genesisBlock = new Block(undefined, { common })

  // set up pre-state
  await setupPreConditions(vm.stateManager._trie, testData)

  // create and add genesis block
  const formattedBlockHeaderData = formatBlockHeader(testData.genesisBlockHeader)
  genesisBlock.header = new BlockHeader(formattedBlockHeaderData, { common })

  const stateManagerStateRoot = vm.stateManager._trie.root

  t.ok(stateManagerStateRoot.equals(genesisBlock.header.stateRoot), 'correct pre stateRoot')

  if (testData.genesisRLP) {
    const rlp = toBuffer(testData.genesisRLP)
    t.ok(genesisBlock.serialize().equals(rlp), 'correct genesis RLP')
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
      const block = new Block(toBuffer(raw.rlp), { common })
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

      const lastblockhash = toBuffer(testData.lastblockhash)

      if (expectException !== undefined) {
        t.ok(headBlock.hash().equals(lastblockhash), 'correct last block hash')
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
        const rawHead = toBuffer(blockchain.meta.rawHead)
        t.ok(rawHead.equals(lastblockhash), 'correct header block')
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
