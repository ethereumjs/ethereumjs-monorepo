import * as tape from 'tape'
import { BN } from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import VM from '../../../../dist'
import { getPrecompile } from '../../../../dist/evm/precompiles'

tape('Precompiles: ECMUL', (t) => {
  t.test('ECMUL', async (st) => {
    const common = new Common({ chain: 'mainnet', hardfork: 'petersburg' })
    const vm = new VM({ common: common })

    const ECMUL = getPrecompile('0000000000000000000000000000000000000007', common)

    const result = await ECMUL({
      data: Buffer.alloc(0),
      gasLimit: new BN(0xffff),
      _common: common,
      _VM: vm,
    })

    st.deepEqual(result.gasUsed.toNumber(), 40000, 'should use petersburg gas costs')
    st.end()
  })
})
