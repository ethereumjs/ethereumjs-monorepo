import tape from 'tape'
import { Address, setLengthLeft, bigIntToBuffer } from 'ethereumjs-util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import VM from '../../../src'
import { createAccount } from '../utils'

/**
 * Tests taken from https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1283.md
 */

const testCases = [
  { original: BigInt(0), code: '60006000556000600055', used: 412, refund: 0 }, // 0 -> 0 -> 0
  { original: BigInt(0), code: '60006000556001600055', used: 20212, refund: 0 }, // 0 -> 0 -> 1
  { original: BigInt(0), code: '60016000556000600055', used: 20212, refund: 19800 }, // 0 -> 1 -> 0
  { original: BigInt(0), code: '60016000556002600055', used: 20212, refund: 0 }, // 0 -> 1 -> 2
  { original: BigInt(0), code: '60016000556001600055', used: 20212, refund: 0 }, // 0 -> 1 -> 1
  { original: BigInt(1), code: '60006000556000600055', used: 5212, refund: 15000 }, // 1 -> 0 -> 0
  { original: BigInt(1), code: '60006000556001600055', used: 5212, refund: 4800 }, // 1 -> 0 -> 1
  { original: BigInt(1), code: '60006000556002600055', used: 5212, refund: 0 }, // 1 -> 0 -> 2
  { original: BigInt(1), code: '60026000556000600055', used: 5212, refund: 15000 }, // 1 -> 2 -> 0
  { original: BigInt(1), code: '60026000556003600055', used: 5212, refund: 0 }, // 1 -> 2 -> 3
  { original: BigInt(1), code: '60026000556001600055', used: 5212, refund: 4800 }, // 1 -> 2 -> 1
  { original: BigInt(1), code: '60026000556002600055', used: 5212, refund: 0 }, // 1 -> 2 -> 2
  { original: BigInt(1), code: '60016000556000600055', used: 5212, refund: 15000 }, // 1 -> 1 -> 0
  { original: BigInt(1), code: '60016000556002600055', used: 5212, refund: 0 }, // 1 -> 1 -> 2
  { original: BigInt(1), code: '60016000556001600055', used: 412, refund: 0 }, // 1 -> 1 -> 1
  { original: BigInt(0), code: '600160005560006000556001600055', used: 40218, refund: 19800 }, // 0 -> 1 -> 0 -> 1
  { original: BigInt(1), code: '600060005560016000556000600055', used: 10218, refund: 19800 }, // 1 -> 0 -> 1 -> 0
]

tape('Constantinople: EIP-1283', async (t) => {
  t.test('net-metering SSTORE', async (st) => {
    const caller = new Address(Buffer.from('0000000000000000000000000000000000000000', 'hex'))
    const addr = new Address(Buffer.from('00000000000000000000000000000000000000ff', 'hex'))
    const key = setLengthLeft(bigIntToBuffer(BigInt(0)), 32)
    for (const testCase of testCases) {
      const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Constantinople })
      const vm = await VM.create({ common })

      const account = createAccount(BigInt(0), BigInt(0))
      await vm.stateManager.putAccount(addr, account)
      await vm.stateManager.putContractCode(addr, Buffer.from(testCase.code, 'hex'))
      if (testCase.original !== BigInt(0)) {
        await vm.stateManager.putContractStorage(addr, key, bigIntToBuffer(testCase.original))
      }

      const runCallArgs = {
        caller,
        gasLimit: BigInt(0xffffffffff),
        to: addr,
      }

      try {
        const res = await vm.evm.runCall(runCallArgs)
        st.equal(res.execResult.exceptionError, undefined)
        st.equal(res.execResult.gasUsed, BigInt(testCase.used))
        st.equal(res.gasRefund, BigInt(testCase.refund))
      } catch (e: any) {
        st.fail(e.message)
      }
    }

    st.end()
  })
})
