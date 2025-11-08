import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { EVMError } from '@ethereumjs/evm'
import { Address, bytesToBigInt, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createVM } from '../../../src/index.ts'
import { createAccountWithDefaults } from '../utils.ts'

const testCases = [
  { chain: Mainnet, hardfork: Hardfork.Istanbul, selfbalance: '0xf1' },
  { chain: Mainnet, hardfork: Hardfork.Constantinople, err: EVMError.errorMessages.INVALID_OPCODE },
]

// SELFBALANCE PUSH8 0x00 MSTORE8 PUSH8 0x01 PUSH8 0x00 RETURN
const code = ['47', '60', '00', '53', '60', '01', '60', '00', 'f3']
describe('Istanbul: EIP-1884', () => {
  it('SELFBALANCE', async () => {
    const addr = new Address(hexToBytes('0x00000000000000000000000000000000000000ff'))
    const runCodeArgs = {
      code: hexToBytes(`0x${code.join('')}`),
      gasLimit: BigInt(0xffff),
      to: addr,
    }

    for (const testCase of testCases) {
      const { chain, hardfork } = testCase
      const common = new Common({ chain, hardfork })
      const vm = await createVM({ common })

      const balance = testCase.selfbalance !== undefined ? BigInt(testCase.selfbalance) : undefined
      const account = createAccountWithDefaults(BigInt(0), balance)

      await vm.stateManager.putAccount(addr, account)

      try {
        const res = await vm.evm.runCode!(runCodeArgs)
        if (testCase.err !== undefined) {
          assert.strictEqual(res.exceptionError?.error, testCase.err)
        } else {
          assert.isTrue(res.exceptionError === undefined)
          assert.strictEqual(BigInt(testCase.selfbalance!), bytesToBigInt(res.returnValue))
        }
      } catch (e: any) {
        assert.fail(e.message)
      }
    }
  })
})
