const BN = require('bn.js')
const tape = require('tape')
const Common = require('ethereumjs-common').default
const util = require('ethereumjs-util')
const VM = require('../../../../dist/index').default
const { getPrecompile } = require('../../../../dist/evm/precompiles')

tape('Precompiles: ECADD', (t) => {
  t.test('ECADD', (st) => {
    const common = new Common('mainnet', 'petersburg')
    let vm = new VM({ common: common })
    let ECADD = getPrecompile('0000000000000000000000000000000000000006')

    let result = ECADD({
      data: Buffer.alloc(0),
      gasLimit: new BN(0xffff),
      _common: common
    })
    st.deepEqual(result.gasUsed.toNumber(), 500, 'should use petersburg gas costs')
    st.end()
  })
})