const { promisify } = require('util')
const tape = require('tape')
const util = require('ethereumjs-util')
const StateManager = require('../../lib/stateManager')
const { createAccount } = require('./utils')

tape('StateManager', (t) => {
  t.test('should instantiate', (st) => {
    const stateManager = new StateManager()

    st.equal(stateManager.trie.root, util.KECCAK256_RLP, 'it has default root')
    stateManager.getStateRoot((err, res) => {
      st.error(err, 'getStateRoot returns no error')
      st.equal(res, util.KECCAK256_RLP, 'it has default root')
    })

    st.equal(stateManager._common.hardfork(), 'byzantium', 'it has default hardfork')
    st.end()
  })

  t.test('should put and get account', async (st) => {
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
    st.end()
  })
})
