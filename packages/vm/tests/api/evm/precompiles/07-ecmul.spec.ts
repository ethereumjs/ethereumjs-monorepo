import tape from 'tape'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import VM from '../../../../src'
import { getActivePrecompiles } from '../../../../src/evm/precompiles'

tape('Precompiles: ECMUL', (t) => {
  t.test('ECMUL', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Petersburg })
    const vm = await VM.create({ common: common })
    const ECMUL = getActivePrecompiles(common).get('0000000000000000000000000000000000000007')!

    const result = await ECMUL({
      data: Buffer.alloc(0),
      gasLimit: BigInt(0xffff),
      _common: common,
      _EVM: vm.evm,
    })

    st.deepEqual(result.gasUsed, BigInt(40000), 'should use petersburg gas costs')
    st.end()
  })
})
