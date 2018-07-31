const { promisify } = require('util')
const tape = require('tape')
const Transaction = require('ethereumjs-tx')
const Account = require('ethereumjs-account')
const runTx = require('../../lib/runTx')
const StateManager = require('../../lib/stateManager')

tape('runTx', (t) => {
  const vm = { stateManager: new StateManager({ }), emit: (e, val, cb) => { cb() }, runCall: (opts, cb) => cb(new Error('test')) }
  const runTxP = promisify(runTx.bind(vm))
  const putAccountP = promisify(vm.stateManager.putAccount.bind(vm.stateManager))
  const cacheFlushP = promisify(vm.stateManager.cache.flush.bind(vm.stateManager.cache))

  t.test('should fail to run without opts', async (st) => {
    shouldFail(st, runTxP(),
      (e) => st.ok(e.message.includes('invalid input'), 'should fail with appropriate error')
    )
    st.end()
  })

  t.test('should fail to run without tx', async (st) => {
    shouldFail(st, runTxP({}),
      (e) => st.ok(e.message.includes('invalid input'), 'should fail with appropriate error')
    )
    st.end()
  })

  t.test('should fail to run without signature', async (st) => {
    const tx = getTransaction()
    shouldFail(st, runTxP({ tx }),
      (e) => st.ok(e.message.toLowerCase().includes('signature'), 'should fail with appropriate error')
    )
    st.end()
  })

  t.test('should fail without sufficient funds', async (st) => {
    const tx = getTransaction(true, true)
    shouldFail(st, runTxP({ tx }),
      (e) => st.ok(e.message.toLowerCase().includes('enough funds'), 'error should include "enough funds"')
    )
    st.end()
  })

  t.test('should fail when runCall fails', async (st) => {
    const tx = getTransaction(true, true)
    const acc = getAccount()
    await putAccountP(tx.from.toString('hex'), acc)
    await cacheFlushP()

    shouldFail(st,
      runTxP({ tx, populateCache: true }),
      (e) => st.equal(e.message, 'test', 'error should be equal to what the mock runCall returns')
    )

    st.end()
  })

  t.test('should behave the same when not using cache', async (st) => {
    const tx = getTransaction(true, true)
    const acc = getAccount()
    await putAccountP(tx.from.toString('hex'), acc)
    await cacheFlushP()
    vm.stateManager.cache.clear()

    shouldFail(st,
      runTxP({ tx, populateCache: false }),
      (e) => st.equal(e.message, 'test', 'error should be equal to what the mock runCall returns')
    )

    st.end()
  })
})

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

function getAccount () {
  const raw = {
    nonce: '0x00',
    balance: '0xfff384'
  }
  const acc = new Account(raw)
  return acc
}
