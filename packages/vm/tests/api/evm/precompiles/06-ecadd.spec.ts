import tape from 'tape'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import VM from '../../../../src'
import { getActivePrecompiles } from '../../../../src/evm/precompiles'

tape('Precompiles: ECADD', (t) => {
  t.test('ECADD', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Petersburg })
    const vm = await VM.create({ common: common })
    const addressStr = '0000000000000000000000000000000000000006'
    const ECADD = getActivePrecompiles(common).get(addressStr)!

    const result = await ECADD({
      data: Buffer.alloc(0),
      gasLimit: BigInt(0xffff),
      _common: common,
      _EVM: vm.evm,
    })

    st.deepEqual(result.gasUsed, BigInt(500), 'should use petersburg gas costs')
    st.end()
  })
})
