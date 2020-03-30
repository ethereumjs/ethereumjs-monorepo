const promisify = require('util.promisify')
const tape = require('tape')
const Transaction = require('ethereumjs-tx').Transaction
const ethUtil = require('ethereumjs-util')
const runTx = require('../../dist/runTx').default
const PStateManager = require('../../dist/state/promisified').default
const { StateManager } = require('../../dist/state')
const VM = require('../../dist/index').default
const { createAccount } = require('./utils')

function setup (vm = null) {
  if (vm === null) {
    const stateManager = new StateManager({ })
    vm = {
      stateManager,
      pStateManager: new PStateManager(stateManager),
      emit: (e, val, cb) => { cb() },
      _emit: (e, val) => new Promise((resolve, reject) => resolve())
    }
  }

  return {
    vm,
    runTx: runTx.bind(vm),
    putAccount: promisify(vm.stateManager.putAccount.bind(vm.stateManager))
  }
}

tape('runTx', (t) => {
  const suite = setup()

  t.test('should fail to run without opts', async (st) => {
    shouldFail(st, suite.runTx(),
      (e) => st.ok(e.message.includes('invalid input'), 'should fail with appropriate error')
    )
    st.end()
  })

  t.test('should fail to run without tx', async (st) => {
    shouldFail(st, suite.runTx({}),
      (e) => st.ok(e.message.includes('invalid input'), 'should fail with appropriate error')
    )
    st.end()
  })

  t.test('should fail to run without signature', async (st) => {
    const tx = getTransaction(false, true)
    shouldFail(st, suite.runTx({ tx }),
      (e) => st.ok(e.message.toLowerCase().includes('signature'), 'should fail with appropriate error')
    )
    st.end()
  })

  t.test('should fail without sufficient funds', async (st) => {
    const tx = getTransaction(true, true)
    shouldFail(st, suite.runTx({ tx }),
      (e) => st.ok(e.message.toLowerCase().includes('enough funds'), 'error should include "enough funds"')
    )
    st.end()
  })
})

tape('should run simple tx without errors', async (t) => {
  let vm = new VM()
  const suite = setup(vm)

  const tx = getTransaction(true, true)
  const acc = createAccount()
  await suite.putAccount(tx.from.toString('hex'), acc)

  let res = await suite.runTx({ tx, populateCache: true })
  t.true(res.gasUsed.gt(0), 'should have used some gas')

  t.end()
})

tape('should fail when account balance overflows (call)', async t => {
  const vm = new VM()
  const suite = setup(vm)

  const tx = getTransaction(true, true, '0x01')
  const from = createAccount()
  const to = createAccount('0x00', ethUtil.MAX_INTEGER)
  await suite.putAccount(tx.from.toString('hex'), from)
  await suite.putAccount(tx.to, to)

  const res = await suite.runTx({ tx })

  t.equal(res.execResult.exceptionError.error, 'value overflow')
  t.equal(vm.stateManager._checkpointCount, 0)
  t.end()
})

tape('should fail when account balance overflows (create)', async t => {
  const vm = new VM()
  const suite = setup(vm)

  const contractAddress = Buffer.from('37d6c3cdbc9304cad74eef8e18a85ed54263b4e7', 'hex')
  const tx = getTransaction(true, true, '0x01', true)
  const from = createAccount()
  const to = createAccount('0x00', ethUtil.MAX_INTEGER)
  await suite.putAccount(tx.from.toString('hex'), from)
  await suite.putAccount(contractAddress, to)

  const res = await suite.runTx({ tx })

  t.equal(res.execResult.exceptionError.error, 'value overflow')
  t.equal(vm.stateManager._checkpointCount, 0)
  t.end()
})

// The following test tries to verify that running a tx
// would work, even when stateManager is not using a cache.
// It fails at the moment, and has been therefore commented.
// Please refer to https://github.com/ethereumjs/ethereumjs-vm/issues/353
/* tape('should behave the same when not using cache', async (t) => {
  const suite = setup()

  const tx = getTransaction(true, true)
  const acc = createAccount()
  await suite.putAccount(tx.from.toString('hex'), acc)
  await suite.cacheFlush()
  suite.vm.stateManager.cache.clear()

  shouldFail(t,
    suite.runTx({ tx, populateCache: false }),
    (e) => t.equal(e.message, 'test', 'error should be equal to what the mock runCall returns')
  )

  t.end()
}) */

function shouldFail (st, p, onErr) {
  p.then(() => st.fail('runTx didnt return any errors')).catch(onErr)
}

function getTransaction (sign = false, calculageGas = false, value = '0x00', createContract = false) {
  let to = '0x0000000000000000000000000000000000000000'
  let data = '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'

  if (createContract){
    to = undefined
    data = '0x6080604052348015600f57600080fd5b50603e80601d6000396000f3fe6080604052600080fdfea' +
           '265627a7a723158204aed884a44fd1747efccba1447a2aa2d9a4b06dd6021c4a3bbb993021e0a909e' +
           '64736f6c634300050f0032'
  }

  const privateKey = Buffer.from('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex')
  const txParams = {
    nonce: '0x00',
    gasPrice: 100,
    gasLimit: 1000,
    to: to,
    value: value,
    data: data,
    chainId: 3
  }

  const tx = new Transaction(txParams)
  if (sign) {
    tx.sign(privateKey)
  }

  if (calculageGas) {
    tx.gas = tx.getUpfrontCost()
  }

  return tx
}
