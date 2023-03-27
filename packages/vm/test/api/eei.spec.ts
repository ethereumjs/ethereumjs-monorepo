import { Blockchain } from '@ethereumjs/blockchain'
import { Common } from '@ethereumjs/common'
import { EEI } from '@ethereumjs/evm'
import { DefaultStateManager as StateManager } from '@ethereumjs/statemanager'
import { Account, Address } from '@ethereumjs/util'
import * as tape from 'tape'

const ZeroAddress = Address.zero()

tape('EEI.copy()', async (t) => {
  const eei = new EEI(
    new StateManager(),
    new Common({ chain: 'mainnet', hardfork: 'shanghai' }),
    await Blockchain.create()
  )
  const nonEmptyAccount = Account.fromAccountData({ nonce: 1 })
  await eei.putAccount(ZeroAddress, nonEmptyAccount)
  await eei.checkpoint()
  await eei.commit()
  const copy = eei.copy()
  t.equal(
    (eei as any)._common.hardfork(),
    (copy as any)._common.hardfork(),
    'copied EEI should have the same hardfork'
  )
  t.equal(
    (await copy.getAccount(ZeroAddress))!.nonce,
    (await eei.getAccount(ZeroAddress))!.nonce,
    'copy should have same State data'
  )
})

tape('EEI', (t) => {
  t.test('should return false on non-existing accounts', async (st) => {
    const eei = new EEI(
      new StateManager(),
      new Common({ chain: 'mainnet' }),
      await Blockchain.create()
    ) // create a dummy EEI (no VM, no EVM, etc.)
    st.notOk(await eei.accountExists(ZeroAddress))
    st.ok(await eei.accountIsEmptyOrNonExistent(ZeroAddress))
    st.end()
  })

  t.test(
    'should return false on non-existing accounts which once existed in state but are now gone',
    async (st) => {
      const eei = new EEI(
        new StateManager(),
        new Common({ chain: 'mainnet' }),
        await Blockchain.create()
      ) // create a dummy EEI (no VM, no EVM, etc.)
      // create empty account
      await eei.putAccount(ZeroAddress, new Account())
      st.ok(await eei.accountExists(ZeroAddress))
      st.ok(await eei.accountIsEmptyOrNonExistent(ZeroAddress))
      // now put a non-empty account
      const nonEmptyAccount = Account.fromAccountData({ nonce: 1 })
      await eei.putAccount(ZeroAddress, nonEmptyAccount)
      st.ok(await eei.accountExists(ZeroAddress))
      st.notOk(await eei.accountIsEmptyOrNonExistent(ZeroAddress))
      st.end()
    }
  )

  t.test('should return true on existing accounts', async (st) => {
    const eei = new EEI(
      new StateManager(),
      new Common({ chain: 'mainnet' }),
      await Blockchain.create()
    ) // create a dummy EEI (no VM, no EVM, etc.)
    // create empty account
    await eei.putAccount(ZeroAddress, new Account())
    st.ok(await eei.accountExists(ZeroAddress)) // sanity check: account exists before we delete it
    st.ok(await eei.accountIsEmptyOrNonExistent(ZeroAddress)) // it is obviously empty
    await eei.deleteAccount(ZeroAddress) // delete the account
    st.notOk(await eei.accountExists(ZeroAddress)) // account should not exist
    st.ok(await eei.accountIsEmptyOrNonExistent(ZeroAddress)) // account is empty
    st.end()
  })
})
