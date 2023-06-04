import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { EVMErrorMessage } from '@ethereumjs/evm'
import { bytesToBigInt } from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { VM } from '../../../src/vm'

const testCases = [
  { chain: Chain.Mainnet, hardfork: Hardfork.Istanbul, chainId: BigInt(1) },
  { chain: Chain.Mainnet, hardfork: Hardfork.Constantinople, err: EVMErrorMessage.INVALID_OPCODE },
  { chain: Chain.Ropsten, hardfork: Hardfork.Istanbul, chainId: BigInt(3) },
]

// CHAINID PUSH8 0x00 MSTORE8 PUSH8 0x01 PUSH8 0x00 RETURN
const code = ['46', '60', '00', '53', '60', '01', '60', '00', 'f3']

tape('Istanbul: EIP-1344', async (t) => {
  t.test('CHAINID', async (st) => {
    const runCodeArgs = {
      code: hexToBytes(code.join('')),
      gasLimit: BigInt(0xffff),
    }

    for (const testCase of testCases) {
      const { chain, hardfork } = testCase
      const common = new Common({ chain, hardfork })
      const vm = await VM.create({ common })
      try {
        const res = await vm.evm.runCode!(runCodeArgs)
        if (testCase.err !== undefined) {
          st.equal(res.exceptionError?.error, testCase.err)
        } else {
          st.assert(res.exceptionError === undefined)
          st.equal(testCase.chainId, bytesToBigInt(res.returnValue))
        }
      } catch (e: any) {
        st.fail(e.message)
      }
    }

    st.end()
  })
})
