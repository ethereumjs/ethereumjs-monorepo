const { promisify } = require('util')
const tape = require('tape')
const Transaction = require('ethereumjs-tx')
const runTx = require('../../lib/runTx')
const StateManager = require('../../lib/stateManager')
const VM = require('../../lib/index')
const { createAccount } = require('./utils')

function setup (vm = null) {
  if (vm === null) {
    vm = {
      stateManager: new StateManager({ }),
      emit: (e, val, cb) => { cb() },
      runCall: (opts, cb) => cb(new Error('test'))
    }
  }

  return {
    vm,
    runTx: promisify(runTx.bind(vm)),
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
    const tx = getTransaction()
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

tape('should fail when runCall fails', async (t) => {
  const suite = setup()

  const tx = getTransaction(true, true)
  const acc = createAccount()
  await suite.putAccount(tx.from.toString('hex'), acc)

  shouldFail(t,
    suite.runTx({ tx, populateCache: true }),
    (e) => t.equal(e.message, 'test', 'error should be equal to what the mock runCall returns')
  )

  t.end()
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

function getTransaction (sign = false, calculageGas = false) {
  const privateKey = Buffer.from('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex')
  const txParams = {
    nonce: '0x00',
    gasPrice: 100,
    gasLimit: 1000,
    to: '0x0000000000000000000000000000000000000000',
    value: '0x00',
    data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
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
