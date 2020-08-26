const tape = require('tape')
const { Block } = require('@ethereumjs/block')
const Common = require('@ethereumjs/common').default
const util = require('ethereumjs-util')
const runBlock = require('../../dist/runBlock').default
const { DefaultStateManager } = require('../../dist/state')
const testData = require('./testdata.json')
const { setupVM, createAccount} = require('./utils')
const { setupPreConditions,getDAOCommon } = require('../util')

function setup(vm = null) {
  // Create a mock, if no real VM object provided.
  // The mock includes mocked runTx and runCall which
  // always return an error.
  if (vm === null) {
    const stateManager = new DefaultStateManager()
    vm = {
      stateManager,
      emit: (e, val, cb) => cb(),
      _emit: (e, val) => new Promise((resolve, reject) => resolve()),
      runTx: (opts) => new Promise((resolve, reject) => reject(new Error('test'))),
      _common: new Common('mainnet', 'byzantium'),
    }
  }

  return {
    vm,
    data: testData,
    p: {
      runBlock: runBlock.bind(vm),
      putAccount: vm.stateManager.putAccount.bind(vm.stateManager),
    },
  }
}

tape('runBlock', async (t) => {
  const suite = setup()

  t.test('should fail without params', async (st) => {
    await suite.p
      .runBlock()
      .then(() => st.fail('should have returned error'))
      .catch((e) => st.ok(e.message.includes('invalid input'), 'correct error'))

    st.end()
  })

  t.test('should fail without opts', async (st) => {
    await suite.p
      .runBlock({})
      .then(() => st.fail('should have returned error'))
      .catch((e) => st.ok(e.message.includes('invalid input'), 'correct error'))

    st.end()
  })

  t.test('should fail when runTx fails', async (st) => {
    const block = new Block(util.rlp.decode(suite.data.blocks[0].rlp))

    // The mocked VM uses a mocked runTx
    // which always returns an error.
    await suite.p
      .runBlock({ block, skipBlockValidation: true })
      .then(() => t.fail('should have returned error'))
      .catch((e) => t.equal(e.message, 'test'))

    st.end()
  })
})

tape('should fail when block gas limit higher than 2^63-1', async (t) => {
  const suite = setup()

  const block = new Block({
    header: {
      ...suite.data.blocks[0].header,
      gasLimit: Buffer.from('8000000000000000', 16),
    },
  })
  await suite.p
    .runBlock({ block })
    .then(() => t.fail('should have returned error'))
    .catch((e) => t.ok(e.message.includes('Invalid block')))

  t.end()
})

tape('should fail when block validation fails', async (t) => {
  const suite = setup()

  const block = new Block(util.rlp.decode(suite.data.blocks[0].rlp))
  block.validate = async () => {
    throw new Error('test')
  }

  await suite.p
    .runBlock({ block })
    .then(() => t.fail('should have returned error'))
    .catch((e) => t.ok(e.message.includes('test')))

  t.end()
})

tape('should fail when tx gas limit higher than block gas limit', async (t) => {
  const suite = setup()

  const block = new Block(util.rlp.decode(suite.data.blocks[0].rlp))
  block.transactions[0].gasLimit = Buffer.from('3fefba', 'hex')

  await suite.p
    .runBlock({ block, skipBlockValidation: true })
    .then(() => t.fail('should have returned error'))
    .catch((e) => t.ok(e.message.includes('higher gas limit')))

  t.end()
})

tape('should run valid block', async (t) => {
  const vm = setupVM()
  const suite = setup(vm)

  const genesis = new Block(util.rlp.decode(suite.data.genesisRLP))
  const block = new Block(util.rlp.decode(suite.data.blocks[0].rlp))

  await setupPreConditions(suite.vm.stateManager._trie, suite.data)

  t.equal(
    suite.vm.stateManager._trie.root.toString('hex'),
    genesis.header.stateRoot.toString('hex'),
    'genesis state root should match calculated state root',
  )

  let res = await suite.p.runBlock({
    block,
    root: suite.vm.stateManager._trie.root,
    skipBlockValidation: true,
  })

  t.error(res.error, "runBlock shouldn't have returned error")
  t.equal(
    res.results[0].gasUsed.toString('hex'),
    '5208',
    'actual gas used should equal blockHeader gasUsed',
  )

  t.end()
})

// this test actually checks if the DAO fork works. This is not checked in ethereum/tests
tape('should transfer balance from DAO children to the Refund DAO account in the DAO fork', async (t) => {
  const common = getDAOCommon(1)

  const vm = setupVM({ common })
  const suite = setup(vm)

  const genesis = new Block(util.rlp.decode(suite.data.genesisRLP))
  let block1 = util.rlp.decode(suite.data.blocks[0].rlp)
  // edit extra data of this block to "dao-hard-fork"
  block1[0][12] = Buffer.from('dao-hard-fork')
  const block = new Block(block1)
  await setupPreConditions(suite.vm.stateManager._trie, suite.data)

  // fill two original DAO child-contracts with funds and the recovery account with funds in order to verify that the balance gets summed correctly
  let fundBalance1 = Buffer.from('1111', 'hex') 
  let accountFunded1 = createAccount(Buffer.from('', 'hex'), fundBalance1)
  let DAOFundedContractAddress1 = Buffer.from("d4fe7bc31cedb7bfb8a345f31e668033056b2728", 'hex')
  await suite.vm.stateManager.putAccount(DAOFundedContractAddress1, accountFunded1)

  let fundBalance2 = Buffer.from('2222', 'hex') 
  let accountFunded2 = createAccount(Buffer.from('', 'hex'), fundBalance2)
  let DAOFundedContractAddress2 = Buffer.from("b3fb0e5aba0e20e5c49d252dfd30e102b171a425", 'hex')
  await suite.vm.stateManager.putAccount(DAOFundedContractAddress2, accountFunded2)

  let DAORefundAddress = Buffer.from("bf4ed7b27f1d666546e30d74d50d173d20bca754", 'hex')
  let fundBalanceRefund = Buffer.from('4444', 'hex') 
  let accountRefund = createAccount(Buffer.from('', 'hex'), fundBalanceRefund)
  await suite.vm.stateManager.putAccount(DAORefundAddress, accountRefund)

  let res = await suite.vm.runBlock({
    block,
    skipBlockValidation: true,
    generate: true
  })

  t.error(res.error, "runBlock shouldn't have returned error")

  let DAOFundedContractAccount1 = await suite.vm.stateManager.getAccount(DAOFundedContractAddress1)
  t.true(DAOFundedContractAccount1.balance.equals(Buffer.from('', 'hex'))) // verify our funded account now has 0 balance
  let DAOFundedContractAccount2 = await suite.vm.stateManager.getAccount(DAOFundedContractAddress2)
  t.true(DAOFundedContractAccount2.balance.equals(Buffer.from('', 'hex'))) // verify our funded account now has 0 balance

  let DAORefundAccount = await suite.vm.stateManager.getAccount(DAORefundAddress)
  t.true(DAORefundAccount.balance.equals(Buffer.from('7777', 'hex'))) // verify that the refund account gets the summed balance of the original refund account + two child DAO accounts

  t.end()
})

async function runWithHf(hardfork) {
  const vm = setupVM({ hardfork: hardfork })
  const suite = setup(vm)

  const block = new Block(util.rlp.decode(suite.data.blocks[0].rlp))

  await setupPreConditions(suite.vm.stateManager._trie, suite.data)

  let res = await suite.p.runBlock({
    block,
    generate: true,
    skipBlockValidation: true,
  })
  return res
}
/* This test is now obsolete? The state roots were supposed to be 0 before the intermediate state roots were fixed. The correct state roots are all checked in the blockchain tests.
tape('should return correct HF receipts', async (t) => {
  let res = await runWithHf('byzantium')
  t.equal(res.receipts[0].status, 1, 'should return correct post-Byzantium receipt format')
  
  res = await runWithHf('spuriousDragon')
  t.deepEqual(
    res.receipts[0].stateRoot,
    Buffer.alloc(32),
    'should return correct pre-Byzantium receipt format')

  t.end()
})
*/