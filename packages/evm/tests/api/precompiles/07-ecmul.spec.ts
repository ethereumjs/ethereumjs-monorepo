import * as tape from 'tape'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { getActivePrecompiles } from '../../../src/precompiles'
import { getEEI } from '../../utils'
import EVM from '../../../src'

tape('Precompiles: ECMUL', (t) => {
  t.test('ECMUL', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Petersburg })
    const eei = await getEEI()
    const evm = await EVM.create({ common, eei })
    const ECMUL = getActivePrecompiles(common).get('0000000000000000000000000000000000000007')!

    const result = await ECMUL({
      data: Buffer.alloc(0),
      gasLimit: BigInt(0xffff),
      _common: common,
      _EVM: evm,
    })

    st.deepEqual(result.executionGasUsed, BigInt(40000), 'should use petersburg gas costs')
    st.end()
  })
})
