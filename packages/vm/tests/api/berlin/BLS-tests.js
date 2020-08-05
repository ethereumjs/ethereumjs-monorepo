const BN = require('bn.js')
const tape = require('tape')
const Common = require('@ethereumjs/common').default
const VM = require('../../../dist/index').default

const precompileAddressStart = 0x0a
const precompileAddressEnd = 0x12

const precompiles = []

for (let address = precompileAddressStart; address <= precompileAddressEnd; address++) {
    precompiles.push(address.toString(16).padStart(40, '0'))
}

const dir = "./tests/api/berlin/"

tape('Berlin BLS tests', (t) => {
    t.test('Berlin precompiles not available pre-Berlin', async (st) => {
        const common = new Common('mainnet', 'muirGlacier')
        const vm = new VM({ common: common })

        for (let address of precompiles) {
            const result = await vm.runCall({
                caller: Buffer.from('0000000000000000000000000000000000000000', 'hex'),
                gasLimit: new BN(0xffffffffff),
                to: Buffer.from(address, 'hex'),
                value: new BN(0),
                data: Buffer.alloc(0)
            })
          
            if (!result.execResult.gasUsed.eq(new BN(0))) {
                st.fail("BLS precompiles should not use any gas pre-Berlin")
            }

            if (result.execResult.exceptionError) {
                st.fail('BLS precompiles should not throw pre-Berlin')
            }
        }

        st.pass("Berlin precompiles unreachable pre-Berlin")
        st.end()
    })

    t.test('Berlin precompiles should throw on empty inputs', async (st) => {
        const common = new Common('mainnet', 'berlin')
        const vm = new VM({ common: common })
        const gasLimit = new BN(0xffffffffff)

        for (let address of precompiles) {
            const result = await vm.runCall({
                caller: Buffer.from('0000000000000000000000000000000000000000', 'hex'),
                gasLimit: gasLimit,
                to: Buffer.from(address, 'hex'),
                value: new BN(0),
                data: Buffer.alloc(0)
            })
          
            if (!result.execResult.gasUsed.eq(gasLimit)) {
              st.fail("BLS precompiles should use all gas on empty inputs")
            }

            if (!result.execResult.exceptionError) {
                st.fail('BLS precompiles should throw on empty inputs')
            }
        }

        st.pass("Berlin precompiles throw correctly on empty inputs")
        st.end()
    })

  })

