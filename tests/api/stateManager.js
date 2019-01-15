const { promisify } = require('util')
const tape = require('tape')
const util = require('ethereumjs-util')
const StateManager = require('../../lib/stateManager')
const { createAccount } = require('./utils')

tape('StateManager', (t) => {
  t.test('should instantiate', (st) => {
    const stateManager = new StateManager()

    st.deepEqual(stateManager._trie.root, util.KECCAK256_RLP, 'it has default root')
    stateManager.getStateRoot((err, res) => {
      st.error(err, 'getStateRoot returns no error')
      st.deepEqual(res, util.KECCAK256_RLP, 'it has default root')
    })

    st.equal(stateManager._common.hardfork(), 'byzantium', 'it has default hardfork')
    st.end()
  })

  t.test('should clear the cache when the state root is set', async (st) => {
    const stateManager = new StateManager()
    const addressBuffer = Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex')
    const account = createAccount()

    const getStateRoot = promisify((...args) => stateManager.getStateRoot(...args))
    const checkpoint = promisify((...args) => stateManager.checkpoint(...args))
    const putAccount = promisify((...args) => stateManager.putAccount(...args))
    const getAccount = promisify((...args) => stateManager.getAccount(...args))
    const commit = promisify((...args) => stateManager.commit(...args))
    const setStateRoot = promisify((...args) => stateManager.setStateRoot(...args))

    const initialStateRoot = await getStateRoot()
    await checkpoint()
    await putAccount(addressBuffer, account)

    const account0 = await getAccount(addressBuffer)
    st.equal(account0.balance.toString('hex'), account.balance.toString('hex'), 'account value is set in the cache')

    await commit()
    const account1 = await getAccount(addressBuffer)
    st.equal(account1.balance.toString('hex'), account.balance.toString('hex'), 'account value is set in the state trie')

    await setStateRoot(initialStateRoot)
    const account2 = await getAccount(addressBuffer)
    st.equal(account2.balance.toString('hex'), '', 'account value is set to 0 in original state root')

    st.end()
  })

  t.test('should put and get account, and add to the underlying cache if the account is not found', async (st) => {
    const stateManager = new StateManager()
    const account = createAccount()

    await promisify(stateManager.putAccount.bind(stateManager))(
      'a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
      account
    )

    let res = await promisify(stateManager.getAccount.bind(stateManager))(
      'a94f5374fce5edbc8e2a8697c15331677e6ebf0b'
    )

    st.equal(res.balance.toString('hex'), 'fff384')

    stateManager._cache.clear()

    res = await promisify(stateManager.getAccount.bind(stateManager))(
      'a94f5374fce5edbc8e2a8697c15331677e6ebf0b'
    )

    st.equal(stateManager._cache._cache.keys[0], 'a94f5374fce5edbc8e2a8697c15331677e6ebf0b')

    st.end()
  })

  t.test('should call the callback with a boolean representing emptiness, when the account is empty', async (st) => {
    const stateManager = new StateManager()

    const promisifiedAccountIsEmpty = promisify(stateManager.accountIsEmpty.bind(stateManager), function (err, result) {
      return err || result
    })
    let res = await promisifiedAccountIsEmpty('a94f5374fce5edbc8e2a8697c15331677e6ebf0b')

    st.ok(res)

    st.end()
  })

  t.test('should call the callback with a false boolean representing non-emptiness when the account is not empty', async (st) => {
    const stateManager = new StateManager()
    const account = createAccount('0x1', '0x1')

    await promisify(stateManager.putAccount.bind(stateManager))(
      'a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
      account
    )

    const promisifiedAccountIsEmpty = promisify(stateManager.accountIsEmpty.bind(stateManager), function (err, result) {
      return err || result
    })
    let res = await promisifiedAccountIsEmpty('a94f5374fce5edbc8e2a8697c15331677e6ebf0b')

    st.notOk(res)

    st.end()
  })
})
