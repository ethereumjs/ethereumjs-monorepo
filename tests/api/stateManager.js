const { promisify } = require('util')
const tape = require('tape')
const util = require('ethereumjs-util')
const StateManager = require('../../lib/stateManager')
const { createAccount } = require('./utils')

tape.only('StateManager', (t) => {
  t.test('should instantiate', (st) => {
    const stateManager = new StateManager()

    st.deepEqual(stateManager.trie.root, util.KECCAK256_RLP, 'it has default root')
    stateManager.getStateRoot((err, res) => {
      st.error(err, 'getStateRoot returns no error')
      st.deepEqual(res, util.KECCAK256_RLP, 'it has default root')
    })

    st.equal(stateManager._common.hardfork(), 'byzantium', 'it has default hardfork')
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

    stateManager.cache.clear()

    res = await promisify(stateManager.getAccount.bind(stateManager))(
      'a94f5374fce5edbc8e2a8697c15331677e6ebf0b'
    )

    st.equal(stateManager.cache._cache.keys[0], 'a94f5374fce5edbc8e2a8697c15331677e6ebf0b')

    st.end()
  })

  t.test('should retrieve a cached account, without adding to the underlying cache if the account is not found', async (st) => {
    const stateManager = new StateManager()
    const account = createAccount()

    await promisify(stateManager.putAccount.bind(stateManager))(
      'a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
      account
    )

    let res = await promisify(stateManager.getAccountPure.bind(stateManager))(
      'a94f5374fce5edbc8e2a8697c15331677e6ebf0b'
    )

    st.equal(res.balance.toString('hex'), 'fff384')

    stateManager.cache.clear()

    res = await promisify(stateManager.getAccountPure.bind(stateManager))(
      'a94f5374fce5edbc8e2a8697c15331677e6ebf0b'
    )

    st.notOk(stateManager.cache._cache.keys[0])

    st.end()
  })

  t.test('should call the callback with a boolean representing emptiness, and not cache the account if passed correct params', async (st) => {
    const stateManager = new StateManager()

    const promisifiedAccountIsEmpty = promisify(stateManager.accountIsEmpty.bind(stateManager), function (err, result) {
      return err || result
    })
    let res = await promisifiedAccountIsEmpty('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', true)

    st.ok(res)
    st.notOk(stateManager.cache._cache.keys[0])

    let res2 = await promisifiedAccountIsEmpty('0x095e7baea6a6c7c4c2dfeb977efac326af552d87')

    st.ok(res2)
    st.equal(stateManager.cache._cache.keys[0], '0x095e7baea6a6c7c4c2dfeb977efac326af552d87')

    st.end()
  })

  t.test('should call the callback with a false boolean representing emptiness when the account is empty', async (st) => {
    const stateManager = new StateManager()
    const account = createAccount('0x1', '0x1')

    await promisify(stateManager.putAccount.bind(stateManager))(
      'a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
      account
    )

    const promisifiedAccountIsEmpty = promisify(stateManager.accountIsEmpty.bind(stateManager), function (err, result) {
      return err || result
    })
    let res = await promisifiedAccountIsEmpty('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', true)

    st.notOk(res)

    st.end()
  })
})
