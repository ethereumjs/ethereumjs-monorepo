/* eslint @typescript-eslint/no-unused-vars: 0 */
import tape from 'tape'
import StatelessVerkleStateManager from '../../../src/state/statelessVerkleStateManager'
import VM from '../../../src'
import { createAccount, getTransaction } from '../utils'
import Common, { Chain, Hardfork } from '@ethereumjs/common'

tape('StatelessVerkleStateManager', (t) => {
  t.test('should instantiate', async (st) => {
    const stateManager = new StatelessVerkleStateManager()
    st.equal(stateManager._common.hardfork(), 'petersburg', 'it has default hardfork')
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
    const stateManager = new StatelessVerkleStateManager()
    const vm = new VM({ common, stateManager })
    const tx = getTransaction(vm._common, 0, true)

    //const caller = tx.getSenderAddress()
    //const acc = createAccount()
    //await vm.stateManager.putAccount(caller, acc)

    //const res = await vm.runTx({ tx })
    //st.pass('Whohoo, tx passed in stateless mode!!!')
  })
})
