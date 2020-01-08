const promisify = require('util.promisify')
const tape = require('tape')
const util = require('ethereumjs-util')
const Block = require('ethereumjs-block')
const Common = require('ethereumjs-common').default
const Trie = require('merkle-patricia-tree/secure')
const VM = require('../../dist/index').default
const { setupVM } = require('./utils')
const { setupPreConditions } = require('../util')
const testData = require('./testdata.json')

tape('VM with default blockchain', (t) => {
  t.test('should instantiate without params', (st) => {
    const vm = new VM()
    st.ok(vm.stateManager)
    st.deepEqual(vm.stateManager._trie.root, util.KECCAK256_RLP, 'it has default trie')
    st.end()
  })

  t.test('should be able to activate precompiles', (st) => {
    let vm = new VM({ activatePrecompiles: true })
    st.notEqual(vm.stateManager._trie.root, util.KECCAK256_RLP, 'it has different root')
    st.end()
  })

  t.test('should work with trie (state) provided', (st) => {
    let trie = new Trie()
    trie.isTestTrie = true
    let vm = new VM({ state: trie, activatePrecompiles: true })
    st.notEqual(vm.stateManager._trie.root, util.KECCAK256_RLP, 'it has different root')
    st.ok(vm.stateManager._trie.isTestTrie, 'it works on trie provided')
    st.end()
  })

  t.test('should only accept common or chain and fork', (st) => {
    const common = new Common('mainnet')

    st.throws(() => new VM({ chain: 'a', common }))
    st.throws(() => new VM({ hardfork: 'a', common }))
    st.throws(() => new VM({ chain: 'a', hardfork: 'a', common }))

    st.end()
  })

  t.test('should accept a common object as option', (st) => {
    const common = new Common('mainnet', 'istanbul')

    const vm = new VM({ common })
    st.equal(vm._common, common)

    st.end()
  })

  t.test('should only accept valid chain and fork', (st) => {
    let vm = new VM({ chain: 'ropsten', hardfork: 'byzantium' })
    st.equal(vm.stateManager._common.param('gasPrices', 'ecAdd'), 500)

    try {
      vm = new VM({ chain: 'mainchain', hardfork: 'homestead' })
      st.fail('should have failed for invalid chain')
    } catch (e) {
      st.ok(e.message.includes('not supported'))
    }

    st.end()
  })

  t.test('should run blockchain without blocks', async (st) => {
    const vm = new VM()
    await vm.runBlockchain()
    st.end()
  })
})

tape('VM with blockchain', (t) => {
  t.test('should instantiate', (st) => {
    const vm = setupVM()
    st.deepEqual(vm.stateManager._trie.root, util.KECCAK256_RLP, 'it has default trie')
    st.end()
  })

  t.test('should run blockchain without blocks', async (st) => {
    const vm = setupVM()
    await vm.runBlockchain()
    st.end()
  })

  t.test('should run blockchain with mocked runBlock', async (st) => {
    const vm = setupVM({ chain: 'goerli' })
    const genesis = new Block(Buffer.from(testData.genesisRLP.slice(2), 'hex'), { common: vm._common })
    const block = new Block(Buffer.from(testData.blocks[0].rlp.slice(2), 'hex'), { common: vm._common })

    await putGenesisP(vm.blockchain, genesis)
    st.equal(vm.blockchain.meta.genesis.toString('hex'), testData.genesisBlockHeader.hash.slice(2))

    await putBlockP(vm.blockchain, block)
    const head = await getHeadP(vm.blockchain)
    st.equal(
      head.hash().toString('hex'),
      testData.blocks[0].blockHeader.hash.slice(2)
    )

    const setupPreP = promisify(setupPreConditions)
    await setupPreP(vm.stateManager._trie, testData)

    vm.runBlock = (block) => new Promise((resolve, reject) => reject(new Error('test')))
    vm.runBlockchain()
      .then(() => st.fail('it hasn\'t returned any errors'))
      .catch((e) => {
        st.equal(e.message, 'test', 'it has correctly propagated runBlock\'s error')
        st.end()
      })
  })

  t.test('should run blockchain with blocks', async (st) => {
    const vm = setupVM({ chain: 'goerli' })
    const genesis = new Block(Buffer.from(testData.genesisRLP.slice(2), 'hex'), { common: vm._common })
    const block = new Block(Buffer.from(testData.blocks[0].rlp.slice(2), 'hex'), { common: vm._common })

    await putGenesisP(vm.blockchain, genesis)
    st.equal(vm.blockchain.meta.genesis.toString('hex'), testData.genesisBlockHeader.hash.slice(2))

    await putBlockP(vm.blockchain, block)
    const head = await getHeadP(vm.blockchain)
    st.equal(
      head.hash().toString('hex'),
      testData.blocks[0].blockHeader.hash.slice(2)
    )

    const setupPreP = promisify(setupPreConditions)
    await setupPreP(vm.stateManager._trie, testData)

    await vm.runBlockchain()

    st.end()
  })

  t.test('should pass the correct Common object when copying the VM', st => {
    const vm = setupVM({ chain: 'goerli', hardfork: 'byzantium' })
    st.equal(vm._common.chainName(), 'goerli')
    st.equal(vm._common.hardfork(), 'byzantium')

    const copiedVM = vm.copy()
    st.equal(copiedVM._common.chainName(), 'goerli')
    st.equal(copiedVM._common.hardfork(), 'byzantium')

    st.end()
  })
})

const putGenesisP = (blockchain, genesis) => promisify(blockchain.putGenesis.bind(blockchain))(genesis)
const putBlockP = (blockchain, block) => promisify(blockchain.putBlock.bind(blockchain))(block)
const getHeadP = (blockchain) => promisify(blockchain.getHead.bind(blockchain))()
