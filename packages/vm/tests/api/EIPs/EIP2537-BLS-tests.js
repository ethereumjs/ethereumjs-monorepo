const BN = require('bn.js')
const tape = require('tape')
const Common = require('@ethereumjs/common').default
const VM = require('../../../dist/index').default
const { isRunningInKarma } = require('../../util')

const precompileAddressStart = 0x0a
const precompileAddressEnd = 0x12

const precompiles = []

for (let address = precompileAddressStart; address <= precompileAddressEnd; address++) {
  precompiles.push(address.toString(16).padStart(40, '0'))
}

const dir = './tests/api/berlin/'

tape('EIP-2537 BLS tests', (t) => {
  t.test('BLS precompiles should not be available if EIP not activated', async (st) => {
    if (isRunningInKarma()) {
      st.skip('BLS does not work in karma')
      return st.end()
    }
    const common = new Common({ chain: 'mainnet', hardfork: 'muirGlacier' })
    const vm = new VM({ common: common })

    for (let address of precompiles) {
      const result = await vm.runCall({
        caller: Buffer.from('0000000000000000000000000000000000000000', 'hex'),
        gasLimit: new BN(0xffffffffff),
        to: Buffer.from(address, 'hex'),
        value: new BN(0),
        data: Buffer.alloc(0),
      })

      if (!result.execResult.gasUsed.eq(new BN(0))) {
        st.fail('BLS precompiles should not use any gas if EIP not activated')
      }

      if (result.execResult.exceptionError) {
        st.fail('BLS precompiles should not throw if EIP not activated')
      }
    }

    st.pass('BLS precompiles unreachable if EIP not activated')
    st.end()
  })

  t.test('BLS precompiles should throw on empty inputs', async (st) => {
    if (isRunningInKarma()) {
      st.skip('BLS does not work in karma')
      return st.end()
    }
    const common = new Common({ chain: 'mainnet', hardfork: 'byzantium', eips: [2537] })
    const vm = new VM({ common: common })
    const gasLimit = new BN(0xffffffffff)

    for (let address of precompiles) {
      const result = await vm.runCall({
        caller: Buffer.from('0000000000000000000000000000000000000000', 'hex'),
        gasLimit: gasLimit,
        to: Buffer.from(address, 'hex'),
        value: new BN(0),
        data: Buffer.alloc(0),
      })

      if (!result.execResult.gasUsed.eq(gasLimit)) {
        st.fail('BLS precompiles should use all gas on empty inputs')
      }

      if (!result.execResult.exceptionError) {
        st.fail('BLS precompiles should throw on empty inputs')
      }
    }

    st.pass('BLS precompiles throw correctly on empty inputs')
    st.end()
  })
})
