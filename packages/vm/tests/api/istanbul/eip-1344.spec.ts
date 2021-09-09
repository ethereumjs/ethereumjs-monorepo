import tape from 'tape'
import { BN } from 'ethereumjs-util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import VM from '../../../src'
import { ERROR } from '../../../src/exceptions'

const testCases = [
  { chain: Chain.Mainnet, hardfork: Hardfork.Istanbul, chainId: new BN(1) },
  { chain: Chain.Mainnet, hardfork: Hardfork.Constantinople, err: ERROR.INVALID_OPCODE },
  { chain: Chain.Ropsten, hardfork: Hardfork.Istanbul, chainId: new BN(3) },
]

// CHAINID PUSH8 0x00 MSTORE8 PUSH8 0x01 PUSH8 0x00 RETURN
const code = ['46', '60', '00', '53', '60', '01', '60', '00', 'f3']

tape('Istanbul: EIP-1344', async (t) => {
  t.test('CHAINID', async (st) => {
    const runCodeArgs = {
      code: Buffer.from(code.join(''), 'hex'),
      gasLimit: new BN(0xffff),
    }

    for (const testCase of testCases) {
      const { chain, hardfork } = testCase
      const common = new Common({ chain, hardfork })
      const vm = new VM({ common })
      try {
        const res = await vm.runCode(runCodeArgs)
        if (testCase.err) {
          st.equal(res.exceptionError?.error, testCase.err)
        } else {
          st.assert(res.exceptionError === undefined)
          st.assert(testCase.chainId.eq(new BN(res.returnValue)))
        }
      } catch (e: any) {
        st.fail(e.message)
      }
    }

    st.end()
  })
})
