import tape from 'tape'
import { Address, setLengthLeft, toBuffer } from 'ethereumjs-util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import VM from '../../../src'
import { createAccount } from '../utils'

const testCases = [
  {
    original: BigInt(0),
    code: '60006000556000600055',
    used: 1612,
    refund: 0,
    gas: undefined,
    err: undefined,
  }, // 0 -> 0 -> 0
  /*{ original:BigInt(0), code: '60006000556001600055', used: 20812, refund: 0 }, // 0 -> 0 -> 1
  { original:BigInt(0), code: '60016000556000600055', used: 20812, refund: 19200 }, // 0 -> 1 -> 0
  { original:BigInt(0), code: '60016000556002600055', used: 20812, refund: 0 }, // 0 -> 1 -> 2
  { original:BigInt(0), code: '60016000556001600055', used: 20812, refund: 0 }, // 0 -> 1 -> 1
  { original:BigInt(1), code: '60006000556000600055', used: 5812, refund: 15000 }, // 1 -> 0 -> 0
  { original:BigInt(1), code: '60006000556001600055', used: 5812, refund: 4200 }, // 1 -> 0 -> 1
  { original:BigInt(1), code: '60006000556002600055', used: 5812, refund: 0 }, // 1 -> 0 -> 2
  { original:BigInt(1), code: '60026000556000600055', used: 5812, refund: 15000 }, // 1 -> 2 -> 0
  { original:BigInt(1), code: '60026000556003600055', used: 5812, refund: 0 }, // 1 -> 2 -> 3
  { original:BigInt(1), code: '60026000556001600055', used: 5812, refund: 4200 }, // 1 -> 2 -> 1
  { original:BigInt(1), code: '60026000556002600055', used: 5812, refund: 0 }, // 1 -> 2 -> 2
  { original:BigInt(1), code: '60016000556000600055', used: 5812, refund: 15000 }, // 1 -> 1 -> 0
  { original:BigInt(1), code: '60016000556002600055', used: 5812, refund: 0 }, // 1 -> 1 -> 2
  { original:BigInt(1), code: '60016000556001600055', used: 1612, refund: 0 }, // 1 -> 1 -> 1
  { original:BigInt(0), code: '600160005560006000556001600055', used: 40818, refund: 19200 }, // 0 -> 1 -> 0 -> 1
  { original:BigInt(1), code: '600060005560016000556000600055', used: 10818, refund: 19200 }, // 1 -> 0 -> 1 -> 08*/
  /*{
    original:BigInt(1),
    gas: BigInt(2306),
    code: '6001600055',
    used: 2306,
    refund: 0,
    err: ERROR.OUT_OF_GAS,
  }, // 1 -> 1 (2300 sentry + 2xPUSH)
  { original:BigInt(1), gas: BigInt(2307), code: '6001600055', used: 806, refund: 0 }, // 1 -> 1 (2301 sentry + 2xPUSH)*/
]

tape('Istanbul: EIP-2200', async (t) => {
  t.test('net-metering SSTORE', async (st) => {
    const caller = new Address(Buffer.from('0000000000000000000000000000000000000000', 'hex'))
    const addr = new Address(Buffer.from('00000000000000000000000000000000000000ff', 'hex'))
    const key = setLengthLeft(toBuffer('0x' + BigInt(0).toString(16)), 32)

    for (const testCase of testCases) {
      const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
      const vm = await VM.create({ common })

      const account = createAccount(BigInt(0), BigInt(0))
      await vm.stateManager.putAccount(addr, account)
      await vm.stateManager.putContractCode(addr, Buffer.from(testCase.code, 'hex'))
      if (testCase.original !== BigInt(0)) {
        await vm.stateManager.putContractStorage(
          addr,
          key,
          toBuffer('0x' + testCase.original.toString(16))
        )
      }

      const runCallArgs = {
        caller,
        gasLimit: testCase.gas ? testCase.gas : BigInt(0xffffffffff),
        to: addr,
      }

      try {
        const res = await vm.evm.runCall(runCallArgs)
        if (testCase.err) {
          st.equal(res.execResult.exceptionError?.error, testCase.err)
        } else {
          st.equal(res.execResult.exceptionError, undefined)
        }
        st.equal(res.execResult.gasUsed, BigInt(testCase.used))
        st.equal(res.gasRefund!, BigInt(testCase.refund))
      } catch (e: any) {
        st.fail(e.message)
      }
    }

    st.end()
  })
})
