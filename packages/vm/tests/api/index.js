const tape = require('tape')
const util = require('ethereumjs-util')
const { Block } = require('@ethereumjs/block')
const Common = require('@ethereumjs/common').default
const Trie = require('merkle-patricia-tree').SecureTrie
const VM = require('../../dist/index').default
const { setupVM } = require('./utils')
const { setupPreConditions, isRunningInKarma } = require('../util')
const testData = require('./testdata.json')

tape('VM with default blockchain', (t) => {
  t.test('should instantiate without params', (st) => {
    const vm = new VM()
    st.ok(vm.stateManager)
    st.deepEqual(vm.stateManager._trie.root, util.KECCAK256_RLP, 'it has default trie')
    st.end()
  })

  t.test('should be able to activate precompiles', async (st) => {
    let vm = new VM({ activatePrecompiles: true })
    await vm.init()
    st.notDeepEqual(vm.stateManager._trie.root, util.KECCAK256_RLP, 'it has different root')
    st.end()
  })

  t.test('should instantiate with async constructor', async (st) => {
    let vm = await VM.create({ activatePrecompiles: true })
    st.notDeepEqual(vm.stateManager._trie.root, util.KECCAK256_RLP, 'it has different root')
    st.end()
  })

  t.test('should work with trie (state) provided', async (st) => {
    let trie = new Trie()
    trie.isTestTrie = true
    let vm = new VM({ state: trie, activatePrecompiles: true })
    await vm.init()
    st.notDeepEqual(vm.stateManager._trie.root, util.KECCAK256_RLP, 'it has different root')
    st.ok(vm.stateManager._trie.isTestTrie, 'it works on trie provided')
    st.end()
  })

  t.test('should accept a common object as option', async (st) => {
    const common = new Common({ chain: 'mainnet', hardfork: 'istanbul' })

    const vm = new VM({ common })
    await vm.init()
    st.equal(vm._common, common)

    st.end()
  })

  t.test('should only accept valid chain and fork', async (st) => {
    let common = new Common({ chain: 'ropsten', hardfork: 'byzantium' })
    let vm = new VM({ common })
    await vm.init()
    st.equal(vm.stateManager._common.param('gasPrices', 'ecAdd'), 500)

    try {
      common = new Common({ chain: 'mainchain', hardfork: 'homestead' })
      vm = new VM({ common })
      st.fail('should have failed for invalid chain')
    } catch (e) {
      st.ok(e.message.includes('not supported'))
    }

    st.end()
  })

  t.test('should accept a supported EIP', async (st) => {
    if (isRunningInKarma()) {
      st.skip('BLS does not work in karma')
      return st.end()
    }
    const common = new Common({ chain: 'mainnet', eips: [ 2537, ] })
    st.doesNotThrow(() => { new VM({ common }) })
    st.end()
  })

  t.test('should run blockchain without blocks', async (st) => {
    const vm = new VM()
    await vm.runBlockchain()
    st.end()
  })
})

tape('VM with blockchain', (t) => {
  t.test('should instantiate', async (st) => {
    const vm = setupVM()
    await vm.init()
    st.deepEqual(vm.stateManager._trie.root, util.KECCAK256_RLP, 'it has default trie')
    st.end()
  })

  t.test('should run blockchain without blocks', async (st) => {
    const vm = setupVM()
    await vm.runBlockchain()
    st.end()
  })

  t.test('should run blockchain with mocked runBlock', async (st) => {
    const vm = setupVM({ common: new Common({ chain: 'goerli' }) })
    await vm.init()

    const genesis = new Block(Buffer.from(testData.genesisRLP.slice(2), 'hex'), {
      common: vm._common,
    })
    const block = new Block(Buffer.from(testData.blocks[0].rlp.slice(2), 'hex'), {
      common: vm._common,
    })

    await vm.blockchain.putGenesis(genesis)
    st.equal(vm.blockchain.meta.genesis.toString('hex'), testData.genesisBlockHeader.hash.slice(2))

    await vm.blockchain.putBlock(block)
    const head = await vm.blockchain.getHead()
    st.equal(head.hash().toString('hex'), testData.blocks[0].blockHeader.hash.slice(2))

    await setupPreConditions(vm.stateManager._trie, testData)

    vm.runBlock = async () => new Promise((resolve, reject) => reject(new Error('test')))

    try {
      await vm.runBlockchain()
      st.fail("it hasn't returned any errors")
    } catch (e) {
      st.equal(e.message, 'test', "it has correctly propagated runBlock's error")
      st.end()
    }
  })

  t.test('should run blockchain with blocks', async (st) => {
    const vm = setupVM({ common: new Common({ chain: 'goerli' }) })
    await vm.init()
    const genesis = new Block(Buffer.from(testData.genesisRLP.slice(2), 'hex'), {
      common: vm._common,
    })
    const block = new Block(Buffer.from(testData.blocks[0].rlp.slice(2), 'hex'), {
      common: vm._common,
    })

    await vm.blockchain.putGenesis(genesis)
    st.equal(vm.blockchain.meta.genesis.toString('hex'), testData.genesisBlockHeader.hash.slice(2))

    await vm.blockchain.putBlock(block)
    const head = await vm.blockchain.getHead()
    st.equal(head.hash().toString('hex'), testData.blocks[0].blockHeader.hash.slice(2))

    await setupPreConditions(vm.stateManager._trie, testData)

    await vm.runBlockchain()

    st.end()
  })

  t.test('should pass the correct Common object when copying the VM', async (st) => {
    const vm = setupVM({ common: new Common({ chain: 'goerli', hardfork: 'byzantium' }) })
    await vm.init()

    st.equal(vm._common.chainName(), 'goerli')
    st.equal(vm._common.hardfork(), 'byzantium')

    const copiedVM = vm.copy()
    st.equal(copiedVM._common.chainName(), 'goerli')
    st.equal(copiedVM._common.hardfork(), 'byzantium')

    st.end()
  })
})
