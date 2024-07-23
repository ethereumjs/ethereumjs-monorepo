import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { EVMErrorMessage } from '@ethereumjs/evm'
import { bytesToBigInt, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { VM } from '../../../src/index.js'

const testCases = [
  { chain: Chain.Mainnet, hardfork: Hardfork.Istanbul, chainId: BigInt(1) },
  { chain: Chain.Mainnet, hardfork: Hardfork.Constantinople, err: EVMErrorMessage.INVALID_OPCODE },
]

// CHAINID PUSH8 0x00 MSTORE8 PUSH8 0x01 PUSH8 0x00 RETURN
const code = ['46', '60', '00', '53', '60', '01', '60', '00', 'f3']

describe('Istanbul: EIP-1344', () => {
  it('CHAINID', async () => {
    const runCodeArgs = {
      code: hexToBytes(`0x${code.join('')}`),
      gasLimit: BigInt(0xffff),
    }

    for (const testCase of testCases) {
      const { chain, hardfork } = testCase
      const common = new Common({ chain, hardfork })
      const vm = await VM.create({ common })
      try {
        const res = await vm.evm.runCode!(runCodeArgs)
        if (testCase.err !== undefined) {
          assert.equal(res.exceptionError?.error, testCase.err)
        } else {
          assert.ok(res.exceptionError === undefined)
          assert.equal(testCase.chainId, bytesToBigInt(res.returnValue))
        }
      } catch (e: any) {
        assert.fail(e.message)
      }
    }
  })
})
