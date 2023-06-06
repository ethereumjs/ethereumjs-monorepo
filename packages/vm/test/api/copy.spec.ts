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

    st.ok((await vm.stateManager.getAccount(address)) !== undefined, 'account exists before copy')

    const vmCopy = await vm.copy()
    st.notok(
      (await vmCopy.stateManager.getAccount(address)) !== undefined,
      'non-committed checkpoints will not be copied'
    )

    await vm.stateManager.checkpoint()
    await vm.stateManager.commit()

    const vmCopy2 = await vm.copy()

    st.ok(
      (await vmCopy2.stateManager.getAccount(address)) !== undefined,
      'committed checkpoints will be copied'
    )

    st.end()
  })
})
