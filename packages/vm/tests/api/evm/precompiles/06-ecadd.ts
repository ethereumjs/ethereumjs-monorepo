import * as tape from 'tape'
import { BN } from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import VM from '../../../../dist'
import { getPrecompile } from '../../../../dist/evm/precompiles'

tape('Precompiles: ECADD', (t) => {
  t.test('ECADD', async (st) => {
    const common = new Common({ chain: 'mainnet', hardfork: 'petersburg' })
    const vm = new VM({ common: common })

    const ECADD = getPrecompile('0000000000000000000000000000000000000006', common)

    const result = await ECADD({
      data: Buffer.alloc(0),
      gasLimit: new BN(0xffff),
      _common: common,
      _VM: vm,
    })

    st.deepEqual(result.gasUsed.toNumber(), 500, 'should use petersburg gas costs')
    st.end()
  })
})
