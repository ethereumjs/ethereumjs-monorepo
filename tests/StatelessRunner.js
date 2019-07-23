const testUtil = require('./util')
const { promisify } = require('util')
const ethUtil = require('ethereumjs-util')
const Account = require('ethereumjs-account').default
const Trie = require('merkle-patricia-tree/secure')
const BN = ethUtil.BN
const { getRequiredForkConfigAlias } = require('./util')
const { HookedStateManager, stateFromProofs } = require('../dist/stateless')
const StateManager = require('../dist/state/stateManager').default

const VM = require('../dist/index.js').default
const PStateManager = require('../dist/state/promisified').default

async function runTestCase (options, testData, t) {
  let expectedPostStateRoot = testData.postStateRoot
  if (expectedPostStateRoot.substr(0, 2) === '0x') {
    expectedPostStateRoot = expectedPostStateRoot.substr(2)
  }

  // Prepare tx and block
  let tx = testUtil.makeTx(testData.transaction)
  let block = testUtil.makeBlockFromEnv(testData.env)
  tx._homestead = true
  tx.enableHomestead = true
  block.isHomestead = function () {
    return true
  }
  if (!tx.validate()) {
    return
  }

  // Hooked state manager proves necessary trie nodes
  // for a stateless execution
  let stateManager = new HookedStateManager()
  // Set up VM
  let vm = new VM({
    stateManager: stateManager,
    hardfork: options.forkConfig.toLowerCase()
  })
  if (options.jsontrace) {
    hookVM(vm, t)
  }
  await promisify(testUtil.setupPreConditions)(stateManager._trie, testData)

  const preStateRoot = stateManager._trie.root
  stateManager.origState = new StateManager({ trie: new Trie(stateManager._trie.db._leveldb, preStateRoot) })

  try {
    await vm.runTx({ tx: tx, block: block })
  } catch (err) {
    await deleteCoinbase(new PStateManager(stateManager), block.header.coinbase)
  }
  t.equal(stateManager._trie.root.toString('hex'), expectedPostStateRoot, 'the state roots should match')

  const proofData = {
    accountProofs: stateManager.proofs,
    codes: stateManager.codes,
    storageProofs: stateManager.storageProofs
  }
  // Now use proofs to construct stateManager
  // and run tx again to make sure it works
  stateManager = await stateFromProofs(preStateRoot, proofData)
  vm = new VM({
    stateManager: stateManager,
    hardfork: options.forkConfig.toLowerCase()
  })
  if (options.jsontrace) {
    hookVM(vm, t)
  }
  try {
    await vm.runTx({ tx: tx, block: block })
  } catch (err) {
    await deleteCoinbase(new PStateManager(stateManager), block.header.coinbase)
  }
  t.equal(stateManager._trie.root.toString('hex'), expectedPostStateRoot, 'the state roots should match')
}

/*
 * If tx is invalid and coinbase is empty, the test harness
 * expects the coinbase account to be deleted from state.
 * Without this ecmul_0-3_5616_28000_96 would fail.
 */
async function deleteCoinbase (pstate, coinbaseAddr) {
  const account = await pstate.getAccount(coinbaseAddr)
  if (new BN(account.balance).isZero()) {
    await pstate.putAccount(coinbaseAddr, new Account())
    await pstate.cleanupTouchedAccounts()
    await promisify(pstate._wrapped._cache.flush.bind(pstate._wrapped._cache))()
  }
}

function hookVM (vm, t) {
  vm.on('step', function (e) {
    let hexStack = []
    hexStack = e.stack.map(item => {
      return '0x' + new BN(item).toString(16, 0)
    })

    var opTrace = {
      'pc': e.pc,
      'op': e.opcode.opcode,
      'gas': '0x' + e.gasLeft.toString('hex'),
      'gasCost': '0x' + e.opcode.fee.toString(16),
      'stack': hexStack,
      'depth': e.depth,
      'opName': e.opcode.name
    }

    t.comment(JSON.stringify(opTrace))
  })
  vm.on('afterTx', function (results) {
    let stateRoot = {
      'stateRoot': vm.stateManager._trie.root.toString('hex')
    }
    t.comment(JSON.stringify(stateRoot))
  })
}

function parseTestCases (forkConfig, testData, data, gasLimit, value) {
  let testCases = []
  if (testData['post'][forkConfig]) {
    testCases = testData['post'][forkConfig].map(testCase => {
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
        'transaction': tx,
        'postStateRoot': testCase['hash'],
        'env': testData['env'],
        'pre': testData['pre']
      }
    })
  }

  testCases = testCases.filter(testCase => {
    return testCase != null
  })

  return testCases
}

module.exports = async function runStateTest (options, testData, t) {
  const forkConfig = getRequiredForkConfigAlias(options.forkConfig)
  try {
    const testCases = parseTestCases(forkConfig, testData, options.data, options.gasLimit, options.value)
    if (testCases.length > 0) {
      for (const testCase of testCases) {
        await runTestCase(options, testCase, t)
      }
    } else {
      t.comment(`No ${forkConfig} post state defined, skip test`)
      return
    }
  } catch (e) {
    t.fail('error running test case for fork: ' + forkConfig)
    console.log('error:', e)
  }
}
