import tape from 'tape'
import { Address, bufferToBigInt } from 'ethereumjs-util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import VM from '../../../src'
import { ERROR } from '../../../src/exceptions'
import { createAccount } from '../utils'

const testCases = [
  { chain: Chain.Mainnet, hardfork: Hardfork.Istanbul, selfbalance: '0xf1' },
  { chain: Chain.Mainnet, hardfork: Hardfork.Constantinople, err: ERROR.INVALID_OPCODE },
]

// SELFBALANCE PUSH8 0x00 MSTORE8 PUSH8 0x01 PUSH8 0x00 RETURN
const code = ['47', '60', '00', '53', '60', '01', '60', '00', 'f3']
tape('Istanbul: EIP-1884', async (t) => {
  t.test('SELFBALANCE', async (st) => {
    const addr = new Address(Buffer.from('00000000000000000000000000000000000000ff', 'hex'))
    const runCodeArgs = {
      code: Buffer.from(code.join(''), 'hex'),
      gasLimit: BigInt(0xffff),
      address: addr,
    }

    for (const testCase of testCases) {
      const { chain, hardfork } = testCase
      const common = new Common({ chain, hardfork })
      const vm = await VM.create({ common })

      const balance = testCase.selfbalance ? BigInt(testCase.selfbalance) : undefined
      const account = createAccount(BigInt(0), balance)

      await vm.stateManager.putAccount(addr, account)

      try {
        const res = await vm.evm.runCode(runCodeArgs)
        if (testCase.err) {
          st.equal(res.exceptionError?.error, testCase.err)
        } else {
          st.assert(res.exceptionError === undefined)
          st.assert(BigInt(testCase.selfbalance) === bufferToBigInt(res.returnValue))
        }
      } catch (e: any) {
        st.fail(e.message)
      }
    }

    st.end()
  })
})
