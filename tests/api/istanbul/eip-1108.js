const BN = require('bn.js')
const tape = require('tape')
const Common = require('ethereumjs-common').default
const util = require('ethereumjs-util')
const VM = require('../../../dist/index').default
const { getPrecompile } = require('../../../dist/evm/precompiles')

tape('Istanbul: EIP-1108 tests', (t) => {
  t.test('ECADD', (st) => {
    const common = new Common('mainnet', 'istanbul')
    let vm = new VM({ common: common })
    let ECADD = getPrecompile('0000000000000000000000000000000000000006')

    let result = ECADD({
      data: Buffer.alloc(0),
      gasLimit: new BN(0xffff),
      _common: common
    })
    st.deepEqual(result.gasUsed.toNumber(), 150, 'should use istanbul gas costs')
    st.end()
  })

  t.test('ECMUL', (st) => {
    const common = new Common('mainnet', 'istanbul')
    let vm = new VM({ common: common })
    let ECMUL = getPrecompile('0000000000000000000000000000000000000007')

    let result = ECMUL({
      data: Buffer.alloc(0),
      gasLimit: new BN(0xffff),
      _common: common
    })
    st.deepEqual(result.gasUsed.toNumber(), 6000, 'should use istanbul gas costs')
    st.end()
  })

  t.test('ECPAIRING', (st) => {
    const common = new Common('mainnet', 'istanbul')
    let vm = new VM({ common: common })
    let ECPAIRING = getPrecompile('0000000000000000000000000000000000000008')

    let result = ECPAIRING({
      data: Buffer.from('00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c21800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa000000000000000000000000000000000000000000000000000000000000000130644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd45198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c21800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa', 'hex'),
      gasLimit: new BN(0xffffff),
      _common: common
    })
    st.deepEqual(result.gasUsed.toNumber(), 113000, 'should use petersburg gas costs (k ^= 2 pairings)')
    st.end()
  })
})
