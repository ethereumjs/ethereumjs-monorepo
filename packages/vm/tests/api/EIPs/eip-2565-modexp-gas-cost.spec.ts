import tape from 'tape'
import { Address } from 'ethereumjs-util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import VM from '../../../src'

// See https://github.com/holiman/go-ethereum/blob/2c99023b68c573ba24a5b01db13e000bd9b82417/core/vm/testdata/precompiles/modexp_eip2565.json
const testData = require('../testdata/eip-2565.json')

tape('EIP-2565 ModExp gas cost tests', (t) => {
  t.test('Test return data, gas cost and execution status against testdata', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium, eips: [2565] })
    const vm = await VM.create({ common: common })

    for (const test of testData) {
      const testName = test.Name
      const to = new Address(Buffer.from('0000000000000000000000000000000000000005', 'hex'))
      const result = await vm.evm.runCall({
        caller: Address.zero(),
        gasLimit: BigInt(0xffffffffff),
        to,
        value: BigInt(0),
        data: Buffer.from(test.Input, 'hex'),
      })

      if (result.execResult.gasUsed !== BigInt(test.Gas)) {
        st.fail(
          `[${testName}]: Gas usage incorrect, expected ${test.Gas}, got ${result.execResult.gasUsed}`
        )
        continue
      }

      if (result.execResult.exceptionError) {
        st.fail(`[${testName}]: Call should not fail`)
        continue
      }

      if (!result.execResult.returnValue.equals(Buffer.from(test.Expected, 'hex'))) {
        st.fail(
          `[${testName}]: Return value not the expected value (expected: ${
            test.Expected
          }, recieved: ${result.execResult.returnValue.toString('hex')})`
        )
        continue
      }

      st.pass(`[${testName}]: Call produced the expected results`)
    }

    st.end()
  })
})
