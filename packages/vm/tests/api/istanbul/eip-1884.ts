import * as tape from 'tape'
import { BN } from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import VM from '../../../dist'
import { ERROR } from '../../../dist/exceptions'
import { createAccount } from '../utils'

const testCases = [
  { chain: 'mainnet', hardfork: 'istanbul', selfbalance: '0xf1' },
  { chain: 'mainnet', hardfork: 'constantinople', err: ERROR.INVALID_OPCODE },
]

// SELFBALANCE PUSH8 0x00 MSTORE8 PUSH8 0x01 PUSH8 0x00 RETURN
const code = ['47', '60', '00', '53', '60', '01', '60', '00', 'f3']
tape('Istanbul: EIP-1884: SELFBALANCE', async (t) => {
  const addr = Buffer.from('00000000000000000000000000000000000000ff', 'hex')
  const runCodeArgs = {
    code: Buffer.from(code.join(''), 'hex'),
    gasLimit: new BN(0xffff).toArrayLike(Buffer),
    address: addr,
  }

  for (const testCase of testCases) {
    const common = new Common({ chain: testCase.chain, hardfork: testCase.hardfork })
    const vm = new VM({ common })
    const account = createAccount(
      new BN(0),
      new BN(Buffer.from(testCase.selfbalance.slice(2), 'hex')),
    )
    await vm.stateManager.putAccount(addr, account)
    try {
      const res = await vm.runCode(runCodeArgs)
      if (testCase.err) {
        t.equal(res.exceptionError.error, testCase.err)
      } else {
        t.assert(res.exceptionError === undefined)
        t.assert(
          new BN(Buffer.from(testCase.selfbalance.slice(2), 'hex')).eq(new BN(res.returnValue)),
        )
      }
    } catch (e) {
      t.fail(e.message)
    }
  }

  t.end()
})
