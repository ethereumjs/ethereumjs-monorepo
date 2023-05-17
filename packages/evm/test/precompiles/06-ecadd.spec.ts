import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import * as tape from 'tape'

import { EVM, getActivePrecompiles } from '../../src'

tape('Precompiles: ECADD', (t) => {
  t.test('ECADD', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Petersburg })
    const evm = await EVM.create({
      common,
      stateManager: new DefaultStateManager(),
    })
    const addressStr = '0000000000000000000000000000000000000006'
    const ECADD = getActivePrecompiles(common).get(addressStr)!

    const result = await ECADD({
      data: new Uint8Array(0),
      gasLimit: BigInt(0xffff),
      _common: common,
      _EVM: evm,
    })

    st.deepEqual(result.executionGasUsed, BigInt(500), 'should use petersburg gas costs')
    st.end()
  })
})
