const tape = require('tape')
const BN = require('bn.js')
const Common = require('ethereumjs-common').default
const VM = require('../../../dist/index').default
const PStateManager = require('../../../dist/state/promisified').default
const { ERROR } = require('../../../dist/exceptions')
const { createAccount } = require('../utils')

const testCases = [
  { original: new BN(0), code: '60006000556000600055', used: 1612, refund: 0 }, // 0 -> 0 -> 0
  { original: new BN(0), code: '60006000556001600055', used: 20812, refund: 0 }, // 0 -> 0 -> 1
  { original: new BN(0), code: '60016000556000600055', used: 20812, refund: 19200 }, // 0 -> 1 -> 0
  { original: new BN(0), code: '60016000556002600055', used: 20812, refund: 0 }, // 0 -> 1 -> 2
  { original: new BN(0), code: '60016000556001600055', used: 20812, refund: 0 }, // 0 -> 1 -> 1
  { original: new BN(1), code: '60006000556000600055', used: 5812, refund: 15000 }, // 1 -> 0 -> 0
  { original: new BN(1), code: '60006000556001600055', used: 5812, refund: 4200 }, // 1 -> 0 -> 1
  { original: new BN(1), code: '60006000556002600055', used: 5812, refund: 0 }, // 1 -> 0 -> 2
  { original: new BN(1), code: '60026000556000600055', used: 5812, refund: 15000 }, // 1 -> 2 -> 0
  { original: new BN(1), code: '60026000556003600055', used: 5812, refund: 0 }, // 1 -> 2 -> 3
  { original: new BN(1), code: '60026000556001600055', used: 5812, refund: 4200 }, // 1 -> 2 -> 1
  { original: new BN(1), code: '60026000556002600055', used: 5812, refund: 0 }, // 1 -> 2 -> 2
  { original: new BN(1), code: '60016000556000600055', used: 5812, refund: 15000 }, // 1 -> 1 -> 0
  { original: new BN(1), code: '60016000556002600055', used: 5812, refund: 0 }, // 1 -> 1 -> 2
  { original: new BN(1), code: '60016000556001600055', used: 1612, refund: 0 }, // 1 -> 1 -> 1
  { original: new BN(0), code: '600160005560006000556001600055', used: 40818, refund: 19200 }, // 0 -> 1 -> 0 -> 1
  { original: new BN(1), code: '600060005560016000556000600055', used: 10818, refund: 19200 }, // 1 -> 0 -> 1 -> 0
  { original: new BN(1), gas: new BN(2306), code: '6001600055', used: 2306, refund: 0, err: ERROR.OUT_OF_GAS }, // 1 -> 1 (2300 sentry + 2xPUSH)
  { original: new BN(1), gas: new BN(2307), code: '6001600055', used: 806, refund: 0 } // 1 -> 1 (2301 sentry + 2xPUSH)
]

tape('Istanbul: EIP-2200: net-metering SSTORE', async (t) => {
  const caller = Buffer.from('0000000000000000000000000000000000000000', 'hex')
  const addr = Buffer.from('00000000000000000000000000000000000000ff', 'hex')
  const key = new BN(0).toArrayLike(Buffer, 'be', 32)
  for (const testCase of testCases) {
    const common = new Common('mainnet', 'istanbul')
    const vm = new VM({ common })
    const state = new PStateManager(vm.stateManager)

    const account = createAccount('0x00', '0x00')
    await state.putAccount(addr, account)
    await state.putContractCode(addr, Buffer.from(testCase.code, 'hex'))
    if (!testCase.original.isZero()) {
      await state.putContractStorage(addr, key, testCase.original)
    }

    const runCallArgs = {
      caller,
      gasLimit: testCase.gas ? testCase.gas : new BN(0xffffffffff),
      to: addr
    }

    try {
      const res = await vm.runCall(runCallArgs)
      if (testCase.err) {
        t.equal(res.execResult.exceptionError.error, testCase.err)
      } else {
        t.assert(res.execResult.exceptionError === undefined)
      }
      t.assert(new BN(testCase.used).eq(res.gasUsed))
      t.assert(new BN(testCase.refund).eq(res.execResult.gasRefund))
    } catch (e) {
      t.fail(e.message)
    }
  }

  t.end()
})
