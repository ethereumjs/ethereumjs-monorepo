const { promisify } = require('util')
const tape = require('tape')
const Level = require('levelup')
const util = require('ethereumjs-util')
const Blockchain = require('ethereumjs-blockchain')
const Block = require('ethereumjs-block')
const VM = require('../../lib/index')
const testData = require('./testdata.json')

tape('VM with fake blockchain', (t) => {
  t.test('should insantiate without params', (st) => {
    const vm = new VM()
    st.ok(vm.stateManager)
    st.equal(vm.stateManager.trie.root, util.KECCAK256_RLP, 'it has default trie')
    st.ok(vm.stateManager.blockchain.fake, 'it has fake blockchain by default')
    st.end()
  })

  t.test('should be able to activate precompiles', (st) => {
    let vm = new VM({ activatePrecompiles: true })
    st.notEqual(vm.stateManager.trie.root, util.KECCAK256_RLP, 'it has different root')
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
    const run = promisify(vm.runBlockchain.bind(vm))
    await run()
    st.end()
  })
})

tape('VM with blockchain', (t) => {
  const db = new Level('', {
    db: require('memdown')
  })
  var cacheDB = new Level('./.cachedb')
  const blockchain = new Blockchain(db)
  blockchain.ethash.cacheDB = cacheDB

  const putGenesisP = promisify(blockchain.putGenesis.bind(blockchain))
  const putBlockP = promisify(blockchain.putBlock.bind(blockchain))
  const getHeadP = promisify(blockchain.getHead.bind(blockchain))

  t.test('should instantiate', (st) => {
    const vm = new VM({
      blockchain
    })
    st.equal(vm.stateManager.trie.root, util.KECCAK256_RLP, 'it has default trie')
    st.notOk(vm.stateManager.blockchain.fake, 'it doesn\'t have fake blockchain')
    st.end()
  })

  t.test('should run blockchain without blocks', async (st) => {
    const vm = new VM({ blockchain })
    await runBlockchain(vm)
    st.end()
  })

  t.test('should run blockchain with blocks', async (st) => {
    const vm = new VM({ blockchain })
    const genesis = new Block(Buffer.from(testData.genesisRLP.slice(2), 'hex'))
    const block = new Block(Buffer.from(testData.blocks[0].rlp.slice(2), 'hex'))

    await putGenesisP(genesis)
    st.equal(blockchain.meta.genesis, 'ce1f26f798dd03c8782d63b3e42e79a64eaea5694ea686ac5d7ce3df5171d1ae')

    await putBlockP(block)
    const head = await getHeadP()
    st.equal(
      head.hash().toString('hex'),
      'f53f268d23a71e85c7d6d83a9504298712b84c1a2ba220441c86eeda0bf0b6e3'
    )

    vm.runBlock = (block, cb) => cb(new Error('test'))
    runBlockchain(vm)
      .then(() => st.fail('it hasn\'t returned any errors'))
      .catch((e) => {
        st.equal(e.message, 'test', 'it has correctly propagated runBlock\'s error')
        st.end()
      })
  })
})

const runBlockchain = (vm) => {
  return promisify(vm.runBlockchain.bind(vm))()
}
