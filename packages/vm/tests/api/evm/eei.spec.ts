import tape from 'tape'
import { Account, Address } from 'ethereumjs-util'
import EEI from '../../../src/evm/eei'
import StateManager from '../../../src/state/stateManager'
import { TransientStorage } from '../../../src/state'

const ZeroAddress = Address.zero()

tape('EEI', (t) => {
  t.test('should return false on non-existing accounts', async (st) => {
    const eei = new EEI(
      undefined!,
      new StateManager(),
      undefined!,
      undefined!,
      undefined!,
      undefined!
    ) // create a dummy EEI (no VM, no EVM, etc.)
    st.notOk(await eei.accountExists(ZeroAddress))
    st.ok(await eei.isAccountEmpty(ZeroAddress))
    st.end()
  })

  t.test(
    'should return false on non-existing accounts which once existed in state but are now gone',
    async (st) => {
      const eei = new EEI(
        undefined!,
        new StateManager(),
        undefined!,
        undefined!,
        undefined!,
        undefined!
      ) // create a dummy EEI (no VM, no EVM, etc.)
      // create empty account
      await eei._state.putAccount(ZeroAddress, new Account())
      st.ok(await eei.accountExists(ZeroAddress))
      st.ok(await eei.isAccountEmpty(ZeroAddress))
      // now put a non-empty account
      const nonEmptyAccount = Account.fromAccountData({ nonce: 1 })
      await eei._state.putAccount(ZeroAddress, nonEmptyAccount)
      st.ok(await eei.accountExists(ZeroAddress))
      st.notOk(await eei.isAccountEmpty(ZeroAddress))
      st.end()
    }
  )

  t.test('should return true on existing accounts', async (st) => {
    const eei = new EEI(
      undefined!,
      new StateManager(),
      undefined!,
      undefined!,
      undefined!,
      undefined!
    ) // create a dummy EEI (no VM, no EVM, etc.)
    // create empty account
    await eei._state.putAccount(ZeroAddress, new Account())
    st.ok(await eei.accountExists(ZeroAddress)) // sanity check: account exists before we delete it
    st.ok(await eei.isAccountEmpty(ZeroAddress)) // it is obviously empty
    await eei._state.deleteAccount(ZeroAddress) // delete the account
    st.notOk(await eei.accountExists(ZeroAddress)) // account should not exist
    st.ok(await eei.isAccountEmpty(ZeroAddress)) // account is empty
    st.end()
  })

  t.test('should work with transient storage', async (st) => {
    const eei = new EEI(
      undefined!,
      new StateManager(),
      undefined!,
      undefined!,
      undefined!,
      new TransientStorage()
    ) // create a dummy EEI (no VM, no EVM, etc.)
    // Set the caller to the zero address
    ;(eei as any)._env = { address: ZeroAddress }

    // Put transient storage
    const key = Buffer.alloc(32, 0x11)
    const value = Buffer.alloc(32, 0x22)
    ;(eei as any).transientStorageStore(key, value)

    // Get transient storage
    const got = (eei as any).transientStorageLoad(key)
    t.deepEqual(value, got)
    st.end()
  })
})
