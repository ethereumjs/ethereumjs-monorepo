import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Transaction } from '@ethereumjs/tx'
import { Account, Address } from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { VM } from '../../../src/vm'

import type { InterpreterStep } from '@ethereumjs/evm'

const address = new Address(hexToBytes('11'.repeat(20)))
const pkey = hexToBytes('20'.repeat(32))

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
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin, eips: [3529] })

  t.test('should verify EIP test cases', async (st) => {
    const vm = await VM.create({ common })

    let gasRefund: bigint
    let gasLeft: bigint
    vm.evm.events!.on('step', (step: InterpreterStep) => {
      if (step.opcode.name === 'STOP') {
        gasRefund = step.gasRefund
        gasLeft = step.gasLeft
      }
    })

    const gasLimit = BigInt(100000)
    const key = hexToBytes('00'.repeat(32))

    for (const testCase of testCases) {
      const code = hexToBytes((testCase.code + '00').slice(2)) // add a STOP opcode (0 gas) so we can find the gas used / effective gas

      await vm.stateManager.putAccount(address, new Account())
      await vm.stateManager.putContractStorage(
        address,
        key,
        hexToBytes(testCase.original.toString().padStart(64, '0'))
      )

      await vm.stateManager.getContractStorage(address, key)
      vm.stateManager.addWarmedStorage(address.bytes, key)

      await vm.evm.runCode!({
        code,
        address,
        gasLimit,
      })

      const gasUsed = gasLimit - gasLeft!
      const effectiveGas = gasUsed - gasRefund!
      st.equal(effectiveGas, BigInt(testCase.effectiveGas), 'correct effective gas')
      st.equal(gasUsed, BigInt(testCase.usedGas), 'correct used gas')

      // clear the storage cache, otherwise next test will use current original value
      vm.stateManager.clearOriginalStorageCache()
    }

    st.end()
  })

  t.test('should not refund selfdestructs', async (st) => {
    const vm = await VM.create({ common })

    const tx = Transaction.fromTxData({
      data: '0x6000ff',
      gasLimit: 100000,
    }).sign(pkey)

    const result = await vm.runTx({
      tx,
      skipHardForkValidation: true,
    })

    st.equal(result.execResult.exceptionError, undefined, 'transaction executed successfully')
    st.equal(result.gasRefund, BigInt(0), 'gas refund is zero')
    st.end()
  })

  t.test('refunds are capped at 1/5 of the tx gas used', async (st) => {
    /**
     * This test initializes a contract with slots 0-99 initialized to a nonzero value
     * Then, it resets all these 100 slots back to 0. This is to check if the
     * max gas refund is respected.
     */
    const vm = await VM.create({ common })

    let startGas: bigint
    let finalGas: bigint
    vm.evm.events!.on('step', (step: InterpreterStep) => {
      if (startGas === undefined) {
        startGas = step.gasLeft
      }
      if (step.opcode.name === 'STOP') {
        finalGas = step.gasLeft
      }
    })

    const address = new Address(hexToBytes('20'.repeat(20)))

    const value = hexToBytes('01'.repeat(32))

    let code = ''

    for (let i = 0; i < 100; i++) {
      const key = hexToBytes(i.toString(16).padStart(64, '0'))
      await vm.stateManager.putAccount(address, new Account())
      await vm.stateManager.putContractStorage(address, key, value)
      const hex = i.toString(16).padStart(2, '0')
      // push 0 push <hex> sstore
      code += '600060' + hex + '55'
    }

    code += '00'

    await vm.stateManager.putContractCode(address, hexToBytes(code))

    const tx = Transaction.fromTxData({
      to: address,
      gasLimit: 10000000,
    }).sign(pkey)

    const result = await vm.runTx({ tx, skipHardForkValidation: true })

    const actualGasUsed = startGas! - finalGas! + BigInt(21000)
    const maxRefund = actualGasUsed / BigInt(5)
    const minGasUsed = actualGasUsed - maxRefund
    st.ok(result.gasRefund! > maxRefund, 'refund is larger than the max refund')
    st.ok(result.totalGasSpent >= minGasUsed, 'gas used respects the max refund quotient')
    st.end()
  })
})
