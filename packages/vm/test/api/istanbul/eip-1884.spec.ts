import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { EVMErrorMessage } from '@ethereumjs/evm'
import { Address, bytesToBigInt } from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import { VM } from '../../../src/vm'
import { createAccount } from '../utils'

const testCases = [
  { chain: Chain.Mainnet, hardfork: Hardfork.Istanbul, selfbalance: '0xf1' },
  { chain: Chain.Mainnet, hardfork: Hardfork.Constantinople, err: EVMErrorMessage.INVALID_OPCODE },
]

// SELFBALANCE PUSH8 0x00 MSTORE8 PUSH8 0x01 PUSH8 0x00 RETURN
const code = ['47', '60', '00', '53', '60', '01', '60', '00', 'f3']
describe('Istanbul: EIP-1884', () => {
  it('SELFBALANCE', async () => {
    const addr = new Address(hexToBytes('00000000000000000000000000000000000000ff'))
    const runCodeArgs = {
      code: hexToBytes(code.join('')),
      gasLimit: BigInt(0xffff),
      address: addr,
    }

    for (const testCase of testCases) {
      const { chain, hardfork } = testCase
      const common = new Common({ chain, hardfork })
      const vm = await VM.create({ common })

      const balance = testCase.selfbalance !== undefined ? BigInt(testCase.selfbalance) : undefined
      const account = createAccount(BigInt(0), balance)

      await vm.stateManager.putAccount(addr, account)

      try {
        const res = await vm.evm.runCode!(runCodeArgs)
        if (testCase.err !== undefined) {
          assert.equal(res.exceptionError?.error, testCase.err)
        } else {
          assert.ok(res.exceptionError === undefined)
          assert.ok(BigInt(testCase.selfbalance!) === bytesToBigInt(res.returnValue))
        }
      } catch (e: any) {
        assert.fail(e.message)
      }
    }
  })
})
