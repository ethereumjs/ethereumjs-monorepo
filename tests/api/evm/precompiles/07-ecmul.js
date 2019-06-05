const BN = require('bn.js')
const tape = require('tape')
const Common = require('ethereumjs-common').default
const util = require('ethereumjs-util')
const VM = require('../../../../dist/index').default
const { getPrecompile } = require('../../../../dist/evm/precompiles')

tape('Precompiles: ECMUL', (t) => {
  t.test('ECMUL', (st) => {
    const common = new Common('mainnet', 'petersburg')
    let vm = new VM({ common: common })
    let ECMUL = getPrecompile('0000000000000000000000000000000000000007')

    let result = ECMUL({
      data: Buffer.alloc(0),
      gasLimit: new BN(0xffff),
      _common: common
    })
    st.deepEqual(result.gasUsed.toNumber(), 40000, 'should use petersburg gas costs')
    st.end()
  })
})