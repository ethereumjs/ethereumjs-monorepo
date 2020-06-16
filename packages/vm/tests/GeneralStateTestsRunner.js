const util = require('util')
const testUtil = require('./util')
const Trie = require('merkle-patricia-tree/secure')
const ethUtil = require('ethereumjs-util')
const Account = require('ethereumjs-account').default
const BN = ethUtil.BN

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
  let block, vm
  let VM
  let Snapshot, FlatStateManager
  if (options.dist) {
    VM = require('../dist/index.js').default
    Snapshot = require('../dist/state/flat/snapshot').Snapshot
    FlatStateManager = require('../dist/state/flat/stateManager').FlatStateManager
  } else {
    VM = require('../lib/index').default
    Snapshot = require('../lib/state/flat/snapshot').Snapshot
    FlatStateManager = require('../lib/state/flat/stateManager').FlatStateManager
  }

  const trie = new Trie()
  const setupPreconditionsAsync = util.promisify(testUtil.setupPreConditions)
  await setupPreconditionsAsync(trie, testData)
  if (options.flat) {
    const snapshot = new Snapshot()
    await testUtil.setupFlatPreConditions(snapshot, testData)
    t.ok(trie._root.equals((await snapshot.merkleize())), 'flat pre condition valid')
    const stateManager = new FlatStateManager({ snapshot })
    vm = new VM({
      stateManager,
      hardfork: options.forkConfigVM,
    })
  } else {
    vm = new VM({
      state: trie,
      hardfork: options.forkConfigVM,
    })
  }

  let tx = testUtil.makeTx(testData.transaction, options.forkConfigVM)
  block = testUtil.makeBlockFromEnv(testData.env)
  tx._homestead = true
  tx.enableHomestead = true
  block.isHomestead = function () {
    return true
  }

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
      if (!options.flat) {
        let stateRoot = {
          stateRoot: vm.stateManager._trie.root.toString('hex'),
        }
        t.comment(JSON.stringify(stateRoot))
      }
    })
  }

  try {
    await vm.runTx({ tx, block })
  } catch(e) {
    // If tx is invalid and coinbase is empty, the test harness
    // expects the coinbase account to be deleted from state.
    // Without this ecmul_0-3_5616_28000_96 would fail.
    const account = await vm.stateManager.getAccount(block.header.coinbase)
    if (new BN(account.balance).isZero()) {
      await vm.stateManager.putAccount(block.header.coinbase, new Account())
      await vm.stateManager.cleanupTouchedAccounts()
      //await vm.stateManager._cache.flush()
    }
  }

  if (testData.postStateRoot.substr(0, 2) === '0x') {
    testData.postStateRoot = testData.postStateRoot.substr(2)
  }
  t.equal(
    (await vm.stateManager.getStateRoot()).toString('hex'),
    testData.postStateRoot,
    'the state roots should match',
  )
  if (options.debug) {
    if (options.flat) {
      vm.stateManager._snapshot.getAccounts().on('data', (data) => console.log('account', data.key, new Account(data.value).toJSON()))
    } else {
      vm.stateManager._trie.createReadStream()
        .on('data', (data) => console.log('account', data.key, new Account(data.value).toJSON()))
    }
  }
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
