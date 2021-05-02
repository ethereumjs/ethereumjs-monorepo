import tape from 'tape'
import { Address, BN } from 'ethereumjs-util'
import VM from '../../../lib'
import Common from '@ethereumjs/common'
import { InterpreterStep } from '../../../lib/evm/interpreter'
import { EIP2929StateManager } from '../../../lib/state/interface'

const address = new Address(Buffer.from('11'.repeat(20), 'hex'))

const testCases = [
  {
    code: '0x60006000556000600055',
    original: 0,
    usedGas: 212,
    effectiveGas: 212,
  },
  {
    code: '0x60006000556001600055',
    original: 0,
    usedGas: 20112,
    effectiveGas: 20112,
  },
  {
    code: '0x60016000556000600055',
    original: 0,
    usedGas: 20112,
    effectiveGas: 212,
  },
  {
    code: '0x60016000556002600055',
    original: 0,
    usedGas: 20112,
    effectiveGas: 20112,
  },
  {
    code: '0x60016000556001600055',
    original: 0,
    usedGas: 20112,
    effectiveGas: 20112,
  },
  {
    code: '0x60006000556000600055',
    original: 1,
    usedGas: 3012,
    effectiveGas: -1788,
  },
  {
    code: '0x60006000556001600055',
    original: 1,
    usedGas: 3012,
    effectiveGas: 212,
  },
  {
    code: '0x60006000556002600055',
    original: 1,
    usedGas: 3012,
    effectiveGas: 3012,
  },
  {
    code: '0x60026000556000600055',
    original: 1,
    usedGas: 3012,
    effectiveGas: -1788,
  },
  {
    code: '0x60026000556003600055',
    original: 1,
    usedGas: 3012,
    effectiveGas: 3012,
  },
  {
    code: '0x60026000556001600055',
    original: 1,
    usedGas: 3012,
    effectiveGas: 212,
  },
  {
    code: '0x60026000556002600055',
    original: 1,
    usedGas: 3012,
    effectiveGas: 3012,
  },
  {
    code: '0x60016000556000600055',
    original: 1,
    usedGas: 3012,
    effectiveGas: -1788,
  },
  {
    code: '0x60016000556002600055',
    original: 1,
    usedGas: 3012,
    effectiveGas: 3012,
  },
  {
    code: '0x600160005560006000556001600055',
    original: 0,
    usedGas: 40118,
    effectiveGas: 20218,
  },
  {
    code: '0x600060005560016000556000600055',
    original: 1,
    usedGas: 5918,
    effectiveGas: -1682,
  },
]

tape('EIP-3529 tests', (t) => {
  const common = new Common({ chain: 'mainnet', hardfork: 'berlin', eips: [3529] })

  // EIP test case 1
  t.test('should jump into a subroutine, back out and stop', async (st) => {
    const vm = new VM({ common })

    let gasRefund: BN
    let gasLeft: BN

    vm.on('step', (step: InterpreterStep) => {
      if (step.opcode.name === 'STOP') {
        gasRefund = step.gasRefund.clone()
        gasLeft = step.gasLeft.clone()
      }
    })

    const gasLimit = new BN(100000)
    const key = Buffer.from('00'.repeat(32), 'hex')

    for (const testCase of testCases) {
      const code = Buffer.from((testCase.code + '00').slice(2), 'hex') // add a STOP opcode (0 gas) so we can find the gas used / effective gas

      await vm.stateManager.putContractStorage(
        address,
        key,
        Buffer.from(testCase.original.toString().padStart(64, '0'), 'hex')
      )

      await vm.stateManager.getContractStorage(address, key)
      ;(<EIP2929StateManager>vm.stateManager).addWarmedStorage(address.toBuffer(), key)

      await vm.runCode({
        code,
        address,
        gasLimit,
      })

      const gasUsed = gasLimit.sub(gasLeft!)
      const effectiveGas = gasUsed.sub(gasRefund!)

      st.equals(effectiveGas.toNumber(), testCase.effectiveGas, 'correct effective gas')
      st.equals(gasUsed.toNumber(), testCase.usedGas, 'correct used gas')

      // clear the storage cache, otherwise next test will use current original value
      vm.stateManager.clearOriginalStorageCache()
    }

    st.end()
  })
})
