/* eslint @typescript-eslint/no-unused-vars: 0 */
import tape from 'tape'
import StatelessVerkleStateManager from '../../../src/state/statelessVerkleStateManager'
import VM from '../../../src'
import { createAccount, getTransaction } from '../utils'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { Address } from 'ethereumjs-util'

tape('StatelessVerkleStateManager', (t) => {
  t.test('should instantiate', async (st) => {
    const stateManager = new StatelessVerkleStateManager()
    st.equal(stateManager._common.hardfork(), 'petersburg', 'it has default hardfork')
  })

  t.test('initPreState()', async (st) => {
    const stateManager = new StatelessVerkleStateManager()

    // Init pre state (format: address -> RLP serialized account)
    // Here: Caller address from `const tx = getTransaction(vm._common, 0, true)`
    const preState = {
      accounts: {
        '0xbe862ad9abfe6f22bcb087716c7d89a26051f74c':
          'f8478083fff384a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      },
    }
    await stateManager.initPreState(preState)
    const address = Address.fromString('0xbe862ad9abfe6f22bcb087716c7d89a26051f74c')
    const account = await stateManager.getAccount(address)
    st.ok(
      account.balance.toString('hex') === 'fff384',
      'should provide access to pre-state account'
    )
  })

  t.test('checkpoint() / commit() / revert', async (st) => {
    const common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.London })

    const tx = getTransaction(common, 0, true)
    const caller = tx.getSenderAddress()
    const acc = createAccount()

    let stateManager = new StatelessVerkleStateManager({ common })
    await stateManager.initPreState({
      accounts: {},
    })
    await stateManager.checkpoint()
    st.equal((stateManager as any)._checkpoints.length, 1, 'should have set a checkpoint')

    await stateManager.putAccount(caller, acc)
    await stateManager.commit()
    st.equal((stateManager as any)._checkpoints.length, 0, 'should remove checkpoint on commit')
    let isInState =
      '0xbe862ad9abfe6f22bcb087716c7d89a26051f74c' in (stateManager as any)._state.accounts
    st.ok(isInState, 'should have caller account in current state on commit')

    stateManager = new StatelessVerkleStateManager({ common })
    await stateManager.initPreState({
      accounts: {},
    })
    await stateManager.checkpoint()

    await stateManager.putAccount(caller, acc)
    await stateManager.revert()
    st.equal((stateManager as any)._checkpoints.length, 0, 'should remove checkpoint on revert')
    isInState =
      '0xbe862ad9abfe6f22bcb087716c7d89a26051f74c' in (stateManager as any)._state.accounts
    st.ok(!isInState, 'should not have caller account in current state on revert')
  })

  t.test('should run simple transfer-tx (stateful)', async (st) => {
    const common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.London })
    const vm = new VM({ common })
    const tx = getTransaction(vm._common, 0, true)

    const caller = tx.getSenderAddress()
    const acc = createAccount()
    await vm.stateManager.putAccount(caller, acc)

    const res = await vm.runTx({ tx })
    st.pass('Ok, that is something. Passed in stateful mode.')
  })

  t.test('should run simple transfer-tx (stateless)', async (st) => {
    const common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.London })

    // Init pre state (format: address -> RLP serialized account)
    // Here: Caller address -> Account from tx created below
    const preState = {
      accounts: {
        '0xbe862ad9abfe6f22bcb087716c7d89a26051f74c':
          'f8478083fff384a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      },
    }
    const stateManager = new StatelessVerkleStateManager({ common })
    await stateManager.initPreState(preState)

    const vm = new VM({ common, stateManager })
    const tx = getTransaction(vm._common, 0, true)

    const res = await vm.runTx({ tx })

    let address = Address.fromString('0xbe862ad9abfe6f22bcb087716c7d89a26051f74c')
    let account = await stateManager.getAccount(address)
    st.equal(account.nonce.toString('hex'), '1', 'should correctly update caller nonce')

    address = Address.fromString('0x0000000000000000000000000000000000000000')
    account = await stateManager.getAccount(address)
    let msg = 'should correctly update miner account balance'
    st.equal(account.balance.toString('hex'), '1e2418')

    msg = 'should correctly update underlying state datastructure'
    st.ok('0x0000000000000000000000000000000000000000' in (stateManager as any)._state.accounts)
    st.pass('Whohoo, tx passed in stateless mode!!!')
  })
})
