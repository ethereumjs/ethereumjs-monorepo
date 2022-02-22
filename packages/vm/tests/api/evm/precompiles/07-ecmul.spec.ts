import tape from 'tape'
import { Address } from 'ethereumjs-util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import VM from '../../../../src'
import { getPrecompile } from '../../../../src/evm/precompiles'

tape('Precompiles: ECMUL', (t) => {
  t.test('ECMUL', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Petersburg })
    const vm = new VM({ common: common })
    const address = new Address(Buffer.from('0000000000000000000000000000000000000007', 'hex'))
    const ECMUL = getPrecompile(address, common)

    const result = await ECMUL({
      data: Buffer.alloc(0),
      gasLimit: BigInt(0xffff),
      _common: common,
      _VM: vm,
    })

    st.deepEqual(result.gasUsed, BigInt(40000), 'should use petersburg gas costs')
    st.end()
  })
})
