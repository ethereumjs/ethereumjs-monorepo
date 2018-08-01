const { promisify } = require('util')
const tape = require('tape')
const Block = require('ethereumjs-block')
const Transaction = require('ethereumjs-tx')
const Common = require('ethereumjs-common')
const util = require('ethereumjs-util')
const runBlock = require('../../lib/runBlock')
const StateManager = require('../../lib/stateManager')
const runTx = require('../../lib/runTx')
const testData = require('./testdata.json')
const { createGenesis, createAccount } = require('./utils')

function setup () {
  const stateManager = new StateManager()
  const vm = {
    stateManager,
    emit: (e, val, cb) => cb(),
    populateCache: stateManager.warmCache.bind(stateManager),
    runTx: (opts, cb) => cb(new Error('test')),
    runCall: (opts, cb) => cb(new Error('test')),
    _common: new Common('mainnet', 'byzantium')
  }

  return {
    vm,
    data: testData,
    p: {
      runBlock: promisify(runBlock.bind(vm)),
      putAccount: promisify(vm.stateManager.putAccount.bind(vm.stateManager)),
      cacheFlush: promisify(vm.stateManager.cache.flush.bind(vm.stateManager.cache))
    }
  }
}

tape('runBlock', async (t) => {
  const suite = setup()

  t.test('should fail without params', async (st) => {
    suite.p.runBlock()
      .then(() => st.fail('should have returned error'))
      .catch((e) => st.ok(e.message.includes('invalid input'), 'correct error'))

    st.end()
  })

  t.test('should fail without opts', async (st) => {
    suite.p.runBlock({})
      .then(() => st.fail('should have returned error'))
      .catch((e) => st.ok(e.message.includes('invalid input'), 'correct error'))

    st.end()
  })

  t.test('should fail when runTx fails', async (st) => {
    const genesis = createGenesis()
    const block = new Block(util.rlp.decode(suite.data.blocks[0].rlp))
    await suite.p.runBlock({ block, root: genesis.header.stateRoot })
      .then(() => t.fail('should have returned error'))
      .catch((e) => t.equal(e.message, 'test'))

    st.end()
  })
})

tape('should fail when tx gas limit higher than block gas limit', async (t) => {
  const suite = setup()

  const genesis = createGenesis()
  const block = new Block(util.rlp.decode(suite.data.blocks[0].rlp))
  block.transactions[0].gasLimit = Buffer.from('033ec6', 'hex')
  suite.p.runBlock({ block, root: genesis.header.stateRoot })
    .then(() => t.fail('should have returned error'))
    .catch((e) => t.ok(e.message.includes('higher gas limit')))

  t.end()
})

tape('should fail when runCall fails', async (t) => {
  const suite = setup()

  const block = new Block(util.rlp.decode(suite.data.blocks[0].rlp))
  // Add some balance to accounts, so they can run txes
  for (let i = 0; i < block.transactions.length; i++) {
    let tx = new Transaction(block.transactions[i])
    const acc = createAccount()
    await suite.p.putAccount(tx.from.toString('hex'), acc)
  }
  await suite.p.cacheFlush()

  suite.vm.runTx = runTx
  await suite.p.runBlock({ block, root: suite.vm.stateManager.trie.root })
    .then(() => t.fail('should have returned error'))
    .catch((e) => t.equal(e.message, 'test'))

  t.end()
})
