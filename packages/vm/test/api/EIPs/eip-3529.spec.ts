import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { Account, Address, bytesToHex, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createVM, runTx } from '../../../src/index.ts'

import type { PrefixedHexString } from '@ethereumjs/util'

const address = new Address(hexToBytes(`0x${'11'.repeat(20)}`))
const pkey = hexToBytes(`0x${'20'.repeat(32)}`)

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

describe('EIP-3529 tests', () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Berlin, eips: [3529] })

  it('should verify EIP test cases', async () => {
    const vm = await createVM({ common })

    let gasRefund: bigint
    let gasLeft: bigint
    vm.evm.events!.on('step', (step, resolve) => {
      if (step.opcode.name === 'STOP') {
        gasRefund = step.gasRefund
        gasLeft = step.gasLeft
      }
      resolve?.()
    })

    const gasLimit = BigInt(100000)
    const key = hexToBytes(`0x${'00'.repeat(32)}`)

    for (const testCase of testCases) {
      const code = hexToBytes(`${testCase.code as PrefixedHexString}00`) // add a STOP opcode (0 gas) so we can find the gas used / effective gas

      await vm.stateManager.putAccount(address, new Account())
      await vm.stateManager.putStorage(
        address,
        key,
        hexToBytes(`0x${testCase.original.toString().padStart(64, '0')}`),
      )

      await vm.stateManager.getStorage(address, key)
      vm.evm.journal.addAlwaysWarmSlot(bytesToHex(address.bytes), bytesToHex(key))

      await vm.evm.runCode!({
        code,
        to: address,
        gasLimit,
      })

      const gasUsed = gasLimit - gasLeft!
      const effectiveGas = gasUsed - gasRefund!
      assert.equal(effectiveGas, BigInt(testCase.effectiveGas), 'correct effective gas')
      assert.equal(gasUsed, BigInt(testCase.usedGas), 'correct used gas')

      // clear the storage cache, otherwise next test will use current original value
      vm.stateManager.originalStorageCache.clear()
    }
  })

  it('should not refund selfdestructs', async () => {
    const vm = await createVM({ common })

    const tx = createLegacyTx({
      data: '0x6000ff',
      gasLimit: 100000,
    }).sign(pkey)

    const result = await runTx(vm, {
      tx,
      skipHardForkValidation: true,
    })

    assert.equal(result.execResult.exceptionError, undefined, 'transaction executed successfully')
    assert.equal(result.gasRefund, BigInt(0), 'gas refund is zero')
  })

  it('refunds are capped at 1/5 of the tx gas used', async () => {
    /**
     * This test initializes a contract with slots 0-99 initialized to a nonzero value
     * Then, it resets all these 100 slots back to 0. This is to check if the
     * max gas refund is respected.
     */
    const vm = await createVM({ common })

    let startGas: bigint
    let finalGas: bigint
    vm.evm.events!.on('step', (step, resolve) => {
      if (startGas === undefined) {
        startGas = step.gasLeft
      }
      if (step.opcode.name === 'STOP') {
        finalGas = step.gasLeft
      }
      resolve?.()
    })

    const address = new Address(hexToBytes(`0x${'20'.repeat(20)}`))

    const value = hexToBytes(`0x${'01'.repeat(32)}`)

    let code: PrefixedHexString = '0x'

    for (let i = 0; i < 100; i++) {
      const key = hexToBytes(`0x${i.toString(16).padStart(64, '0')}`)
      await vm.stateManager.putAccount(address, new Account())
      await vm.stateManager.putStorage(address, key, value)
      const hex = i.toString(16).padStart(2, '0')
      // push 0 push <hex> sstore
      code = `${code}600060${hex}55`
    }

    code = `${code}00`

    await vm.stateManager.putCode(address, hexToBytes(code))

    const tx = createLegacyTx({
      to: address,
      gasLimit: 10000000,
    }).sign(pkey)

    const result = await runTx(vm, { tx, skipHardForkValidation: true })

    const actualGasUsed = startGas! - finalGas! + BigInt(21000)
    const maxRefund = actualGasUsed / BigInt(5)
    const minGasUsed = actualGasUsed - maxRefund
    assert.ok(result.gasRefund! > maxRefund, 'refund is larger than the max refund')
    assert.ok(result.totalGasSpent >= minGasUsed, 'gas used respects the max refund quotient')
  })
})
