import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Address } from '@ethereumjs/util'
import { bytesToHex, equalsBytes, hexToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { VM } from '../../../src/vm'

// See https://github.com/holiman/go-ethereum/blob/2c99023b68c573ba24a5b01db13e000bd9b82417/core/vm/testdata/precompiles/modexp_eip2565.json
const testData = require('../testdata/eip-2565.json')

tape('EIP-2565 ModExp gas cost tests', (t) => {
  t.test('Test return data, gas cost and execution status against testdata', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium, eips: [2565] })
    const vm = await VM.create({ common })

    for (const test of testData) {
      const testName = test.Name
      const to = new Address(hexToBytes('0000000000000000000000000000000000000005'))
      const result = await vm.evm.runCall({
        caller: Address.zero(),
        gasLimit: BigInt(0xffffffffff),
        to,
        value: BigInt(0),
        data: hexToBytes(test.Input),
      })

      if (result.execResult.executionGasUsed !== BigInt(test.Gas)) {
        st.fail(
          `[${testName}]: Gas usage incorrect, expected ${test.Gas}, got ${result.execResult.executionGasUsed}`
        )
        continue
      }

      if (result.execResult.exceptionError !== undefined) {
        st.fail(`[${testName}]: Call should not fail`)
        continue
      }

      if (!equalsBytes(result.execResult.returnValue, hexToBytes(test.Expected))) {
        st.fail(
          `[${testName}]: Return value not the expected value (expected: ${
            test.Expected
          }, received: ${bytesToHex(result.execResult.returnValue)})`
        )
        continue
      }

      st.pass(`[${testName}]: Call produced the expected results`)
    }

    st.end()
  })
})
