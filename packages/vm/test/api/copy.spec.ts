import { Account, Address } from '@ethereumjs/util'
import * as tape from 'tape'

import { setupVM } from './utils'

tape('VM Copy Test', async (t) => {
  t.test('should pass copy of state manager', async (st) => {
    const vm = await setupVM()
    const account = Account.fromAccountData({
      balance: 100n,
      nonce: 5n,
    })
    const address = Address.fromString(`0x` + '1234'.repeat(10))
    await vm.stateManager.putAccount(address, account)

    st.ok(await vm.stateManager.accountExists(address), 'account exists before copy')

    const vmCopy = await vm.copy()

    st.ok(await vmCopy.stateManager.accountExists(address), 'account exists after copy')

    st.end()
  })
})
