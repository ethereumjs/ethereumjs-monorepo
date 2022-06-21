import * as tape from 'tape'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import EVM from '../../../src'
import { getActivePrecompiles } from '../../../src/precompiles'
import { getEEI } from '../../utils'

tape('Precompiles: ECADD', (t) => {
  t.test('ECADD', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Petersburg })
    const eei = await getEEI()
    const evm = await EVM.create({ common, eei })
    const addressStr = '0000000000000000000000000000000000000006'
    const ECADD = getActivePrecompiles(common).get(addressStr)!

    const result = await ECADD({
      data: Buffer.alloc(0),
      gasLimit: BigInt(0xffff),
      _common: common,
      _EVM: evm,
    })

    st.deepEqual(result.executionGasUsed, BigInt(500), 'should use petersburg gas costs')
    st.end()
  })
})
