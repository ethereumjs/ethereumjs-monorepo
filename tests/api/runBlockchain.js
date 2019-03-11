const tape = require('tape')
const level = require('level-mem')
const promisify = require('util.promisify')
const Blockchain = require('ethereumjs-blockchain')
const Block = require('ethereumjs-block')
const util = require('ethereumjs-util')
const runBlockchain = require('../../lib/runBlockchain')
const { StateManager } = require('../../lib/state')
const { createGenesis } = require('./utils')

tape('runBlockchain', (t) => {
  const blockchainDB = level()
  const blockchain = new Blockchain({ db: blockchainDB })
  const vm = { stateManager: new StateManager(), blockchain }

  const putGenesisP = promisify(blockchain.putGenesis.bind(blockchain))
  const putBlockP = promisify(blockchain.putBlock.bind(blockchain))
  const getHeadP = promisify(blockchain.getHead.bind(blockchain))
  const runBlockchainP = promisify(runBlockchain.bind(vm))

  t.test('should run without a blockchain parameter', async (st) => {
    await runBlockchainP()
    st.end()
  })

  t.test('should run without blocks', async (st) => {
    await runBlockchainP(blockchain)
    st.end()
  })

  t.test('should run with genesis block', async (st) => {
    const genesis = createGenesis()

    await putGenesisP(genesis)
    st.ok(blockchain.meta.genesis, 'genesis should be set for blockchain')

    await runBlockchainP(blockchain)
    st.end()
  })

  t.test('should run with valid and invalid blocks', async (st) => {
    // Produce error on the third time runBlock is called
    let runBlockInvocations = 0
    vm.runBlock = (opts, cb) => {
      runBlockInvocations++
      if (runBlockInvocations === 3) {
        return cb(new Error('test'), {})
      }
      cb(null, {})
    }

    const genesis = createGenesis()
    await putGenesisP(genesis)

    const b1 = createBlock(genesis, 1)
    const b2 = createBlock(b1, 2)
    const b3 = createBlock(b2, 3)

    blockchain.validate = false

    await putBlockP(b1)
    await putBlockP(b2)
    await putBlockP(b3)

    let head = await getHeadP()
    st.deepEqual(head.hash(), b3.hash(), 'block3 should be the current head')

    try {
      await runBlockchainP(blockchain)
      st.fail('should have returned error')
    } catch (e) {
      st.equal(e.message, 'test')

      head = await getHeadP()
      st.deepEqual(head.hash(), b2.hash(), 'should have removed invalid block from head')

      st.end()
    }
  })
})

function createBlock (parent = null, n = 0) {
  if (parent === null) {
    return createGenesis()
  }

  const b = new Block()
  b.header.number = util.toBuffer(n)
  b.header.parentHash = parent.hash()
  b.header.difficulty = '0xfffffff'
  b.header.stateRoot = parent.header.stateRoot

  return b
}
