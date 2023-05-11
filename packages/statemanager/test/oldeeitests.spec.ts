import { Account, Address } from '@ethereumjs/util'
import * as tape from 'tape'

import { DefaultStateManager } from '../src'

const ZeroAddress = Address.zero()

tape('EEI.copy()', async (t) => {
  const state = new DefaultStateManager()
  const nonEmptyAccount = Account.fromAccountData({ nonce: 1 })
  await state.putAccount(ZeroAddress, nonEmptyAccount)
  await state.checkpoint()
  await state.commit()
  const copy = state.copy()
  t.equal(
    (state as any)._common.hardfork(),
    (copy as any)._common.hardfork(),
    'copied EEI should have the same hardfork'
  )
  t.equal(
    (await copy.getAccount(ZeroAddress))!.nonce,
    (await state.getAccount(ZeroAddress))!.nonce,
    'copy should have same State data'
  )
})

tape('EEI', (t) => {
  t.test('should return false on non-existing accounts', async (st) => {
    const state = new DefaultStateManager()
    st.notOk(await state.accountExists(ZeroAddress))
    st.ok(await state.accountIsEmptyOrNonExistent(ZeroAddress))
    st.end()
  })

  t.test(
    'should return false on non-existing accounts which once existed in state but are now gone',
    async (st) => {
      const state = new DefaultStateManager()
      await state.putAccount(ZeroAddress, new Account())
      st.ok(await state.accountExists(ZeroAddress))
      st.ok(await state.accountIsEmptyOrNonExistent(ZeroAddress))
      // now put a non-empty account
      const nonEmptyAccount = Account.fromAccountData({ nonce: 1 })
      await state.putAccount(ZeroAddress, nonEmptyAccount)
      st.ok(await state.accountExists(ZeroAddress))
      st.notOk(await state.accountIsEmptyOrNonExistent(ZeroAddress))
      st.end()
    }
  )

  t.test('should return true on existing accounts', async (st) => {
    const state = new DefaultStateManager()
    // create empty account
    await state.putAccount(ZeroAddress, new Account())
    st.ok(await state.accountExists(ZeroAddress)) // sanity check: account exists before we delete it
    st.ok(await state.accountIsEmptyOrNonExistent(ZeroAddress)) // it is obviously empty
    await state.deleteAccount(ZeroAddress) // delete the account
    st.notOk(await state.accountExists(ZeroAddress)) // account should not exist
    st.ok(await state.accountIsEmptyOrNonExistent(ZeroAddress)) // account is empty
    st.end()
  })
})
