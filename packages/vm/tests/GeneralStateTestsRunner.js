const { setupPreConditions, makeTx, makeBlockFromEnv } = require('./util')
const Trie = require('merkle-patricia-tree').SecureTrie
const { BN } = require('ethereumjs-util')
const { default: Common } = require('@ethereumjs/common')
const Account = require('@ethereumjs/account').default

function parseTestCases(forkConfigTestSuite, testData, data, gasLimit, value) {
  let testCases = []
  if (testData['post'][forkConfigTestSuite]) {
    testCases = testData['post'][forkConfigTestSuite].map((testCase) => {
      let testIndexes = testCase['indexes']
      let tx = { ...testData.transaction }
      if (data !== undefined && testIndexes['data'] !== data) {
        return null
      }

      if (value !== undefined && testIndexes['value'] !== value) {
        return null
      }

      if (gasLimit !== undefined && testIndexes['gas'] !== gasLimit) {
        return null
      }

      tx.data = testData.transaction.data[testIndexes['data']]
      tx.gasLimit = testData.transaction.gasLimit[testIndexes['gas']]
      tx.value = testData.transaction.value[testIndexes['value']]
      return {
        transaction: tx,
        postStateRoot: testCase['hash'],
        env: testData['env'],
        pre: testData['pre'],
      }
    })
  }

  testCases = testCases.filter((testCase) => {
    return testCase != null
  })

  return testCases
}

async function runTestCase(options, testData, t) {
  const state = new Trie()
  let block, vm
  let VM
  if (options.dist) {
    VM = require('../dist/index.js').default
  } else {
    VM = require('../lib/index').default
  }

  let eips = []
  if (options.forkConfigVM == 'berlin') {
    eips = ['EIP2537'] // currently, the BLS tests run on the Berlin network, but our VM does not activate EIP2537 if you run the Berlin HF
  }

  const common = new Common({ chain: 'mainnet', hardfork: options.forkConfigVM })
  vm = new VM({
    state,
    common: common,
    eips
  })

  await setupPreConditions(vm.stateManager._trie, testData)

  let tx = makeTx(testData.transaction, { common })
  block = makeBlockFromEnv(testData.env)

  if (!tx.validate()) {
    return
  }

  if (options.jsontrace) {
    vm.on('step', function (e) {
      let hexStack = []
      hexStack = e.stack.map((item) => {
        return '0x' + new BN(item).toString(16, 0)
      })

      const opTrace = {
        pc: e.pc,
        op: e.opcode.opcode,
        gas: '0x' + e.gasLeft.toString('hex'),
        gasCost: '0x' + e.opcode.fee.toString(16),
        stack: hexStack,
        depth: e.depth,
        opName: e.opcode.name,
      }

      t.comment(JSON.stringify(opTrace))
    })
    vm.on('afterTx', () => {
      let stateRoot = {
        stateRoot: vm.stateManager._trie.root.toString('hex'),
      }
      t.comment(JSON.stringify(stateRoot))
    })
  }

  try {
    await vm.runTx({ tx, block })
  } catch (e) {
    // If tx is invalid and coinbase is empty, the test harness
    // expects the coinbase account to be deleted from state.
    // Without this ecmul_0-3_5616_28000_96 would fail.
    const account = await vm.stateManager.getAccount(block.header.coinbase)
    if (new BN(account.balance).isZero()) {
      await vm.stateManager.putAccount(block.header.coinbase, new Account())
      await vm.stateManager.cleanupTouchedAccounts()
      await vm.stateManager._cache.flush()
    }
  }

  if (testData.postStateRoot.substr(0, 2) === '0x') {
    testData.postStateRoot = testData.postStateRoot.substr(2)
  }
  t.equal(
    vm.stateManager._trie.root.toString('hex'),
    testData.postStateRoot,
    'the state roots should match',
  )
}

module.exports = async function runStateTest(options, testData, t) {
  try {
    const testCases = parseTestCases(
      options.forkConfigTestSuite,
      testData,
      options.data,
      options.gasLimit,
      options.value,
    )
    if (testCases.length === 0) {
      t.comment(`No ${options.forkConfigTestSuite} post state defined, skip test`)
      return
    }
    for (let testCase of testCases) {
      await runTestCase(options, testCase, t)
    }
  } catch (e) {
    console.log(e)
    t.fail('error running test case for fork: ' + options.forkConfigTestSuite)
  }
}
