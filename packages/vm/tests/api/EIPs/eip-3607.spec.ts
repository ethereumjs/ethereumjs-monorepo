import * as tape from 'tape'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { Transaction } from '@ethereumjs/tx'
import { Address } from '@ethereumjs/util'
import { VM } from '../../../src/vm'

tape('EIP-3607 tests', (t) => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin, eips: [3607] })
  const commonNoEIP3607 = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin, eips: [] })
  const precompileAddr = Address.fromString('0x0000000000000000000000000000000000000001')

  t.test('should reject txs from senders with deployed code when EIP is enabled', async (st) => {
    const vm = await VM.create({ common })
    await vm.stateManager.putContractCode(precompileAddr, Buffer.alloc(32, 1))
    const tx = Transaction.fromTxData({ gasLimit: 100000 }, { freeze: false })
    tx.getSenderAddress = () => precompileAddr
    try {
      await vm.runTx({ tx })
      st.fail('runTx should have thrown')
    } catch (error: any) {
      if (error.message.includes('EIP-3607')) {
        st.pass('threw correct error')
      } else {
        st.fail('did not throw correct error')
      }
    }
    st.end()
  })

  t.test(
    'should not reject txs from senders with deployed code when EIP is not enabled',
    async (st) => {
      const vm = await VM.create({ common: commonNoEIP3607 })
      await vm.stateManager.putContractCode(precompileAddr, Buffer.alloc(32, 1))
      const tx = Transaction.fromTxData({ gasLimit: 100000 }, { freeze: false })
      tx.getSenderAddress = () => precompileAddr
      try {
        await vm.runTx({ tx })
        st.ok('runTx successfully ran')
      } catch (error: any) {
        st.fail('threw an unexpected error')
      }
      st.end()
    }
  )
})
