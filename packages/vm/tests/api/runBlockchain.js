const tape = require('tape')
const level = require('level-mem')
const promisify = require('util.promisify')
const Blockchain = require('ethereumjs-blockchain').default
const Block = require('ethereumjs-block')
const Common = require('ethereumjs-common').default
const util = require('ethereumjs-util')
const runBlockchain = require('../../dist/runBlockchain').default
const PStateManager = require('../../dist/state/promisified').default
const { StateManager } = require('../../dist/state')
const { createGenesis } = require('./utils')

tape('runBlockchain', (t) => {
  const blockchainDB = level()
  const blockchain = new Blockchain({
    db: blockchainDB,
    chain: 'goerli',
    validate: false
  })
  const stateManager = new StateManager({ common: new Common('goerli') });
  const vm = {
    stateManager,
    pStateManager: new PStateManager(stateManager),
    blockchain: blockchain
  }

  const putGenesisP = promisify(blockchain.putGenesis.bind(blockchain))
  const putBlockP = promisify(blockchain.putBlock.bind(blockchain))
  const getHeadP = promisify(blockchain.getHead.bind(blockchain))

  t.test('should run without a blockchain parameter', async (st) => {
    await runBlockchain.bind(vm)()
    st.end()
  })

  t.test('should run without blocks', async (st) => {
    await runBlockchain.bind(vm)(blockchain)
    st.end()
  })

  t.test('should run with genesis block', async (st) => {
    const genesis = createGenesis({ chain: 'goerli' })

    await putGenesisP(genesis)
    st.ok(blockchain.meta.genesis, 'genesis should be set for blockchain')

    await runBlockchain.bind(vm)(blockchain)
    st.end()
  })

  t.test('should run with valid and invalid blocks', async (st) => {
    // Produce error on the third time runBlock is called
    let runBlockInvocations = 0
    vm.runBlock = (opts) => new Promise((resolve, reject) => {
      runBlockInvocations++
      if (runBlockInvocations === 3) {
        return reject(new Error('test'))
      }
      resolve({})
    })

    const genesis = createGenesis({ chain: 'goerli' })
    await putGenesisP(genesis)

    const b1 = createBlock(genesis, 1, { chain: 'goerli' })
    const b2 = createBlock(b1, 2, { chain: 'goerli' })
    const b3 = createBlock(b2, 3, { chain: 'goerli' })

    blockchain.validate = false

    await putBlockP(b1)
    await putBlockP(b2)
    await putBlockP(b3)

    let head = await getHeadP()
    st.deepEqual(head.hash(), b3.hash(), 'block3 should be the current head')

    try {
      await runBlockchain.bind(vm)(blockchain)
      st.fail('should have returned error')
    } catch (e) {
      st.equal(e.message, 'test')

      head = await getHeadP()
      st.deepEqual(head.hash(), b2.hash(), 'should have removed invalid block from head')

      st.end()
    }
  })
})

function createBlock (parent = null, n = 0, opts = {}) {
  opts.chain = opts.chain ? opts.chain : 'mainnet'
  if (parent === null) {
    return createGenesis(opts)
  }

  const b = new Block(null, opts)
  b.header.number = util.toBuffer(n)
  b.header.parentHash = parent.hash()
  b.header.difficulty = '0xfffffff'
  b.header.stateRoot = parent.header.stateRoot

  return b
}
