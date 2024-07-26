import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { VM, runTx } from '../../../src/index.js'

import type { InterpreterStep } from '@ethereumjs/evm'
import type { Address } from '@ethereumjs/util'

const pkey = hexToBytes(`0x${'20'.repeat(32)}`)

describe('EIP 3541 tests', () => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin, eips: [3541] })
  const commonNoEIP3541 = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin, eips: [] })

  it('deposit 0xEF code if 3541 is active', async () => {
    // put 0xEF contract
    const tx = createLegacyTx({
      data: '0x7FEF0000000000000000000000000000000000000000000000000000000000000060005260206000F3',
      gasLimit: 1000000,
    }).sign(pkey)

    let vm = await VM.create({ common })

    let result = await runTx(vm, { tx, skipHardForkValidation: true })
    let created = result.createdAddress

    let code = await vm.stateManager.getCode(created!)

    assert.equal(code.length, 0, 'did not deposit code')

    // Test if we can put a valid contract

    // put a valid contract starting with SELFDESTRUCT
    const tx1 = createLegacyTx({
      data: '0x7FFF0000000000000000000000000000000000000000000000000000000000000060005260206000F3',
      gasLimit: 1000000,
      nonce: 1,
    }).sign(pkey)

    result = await runTx(vm, { tx: tx1, skipHardForkValidation: true })
    created = result.createdAddress

    code = await vm.stateManager.getCode(created!)

    assert.ok(code.length > 0, 'did deposit code')

    // check if we can deposit a contract on non-EIP3541 chains

    vm = await VM.create({ common: commonNoEIP3541 })
    const tx2 = createLegacyTx({
      data: '0x7FEF0000000000000000000000000000000000000000000000000000000000000060005260206000F3',
      gasLimit: 1000000,
    }).sign(pkey)

    result = await runTx(vm, { tx: tx2, skipHardForkValidation: true })
    created = result.createdAddress

    code = await vm.stateManager.getCode(created!)

    assert.ok(code.length > 0, 'did deposit code')
  })

  it('deploy contracts starting with 0xEF using CREATE', async () => {
    // put 0xEF contract
    const tx = createLegacyTx({
      data: '0x7F60EF60005360016000F300000000000000000000000000000000000000000000600052602060006000F000',
      gasLimit: 1000000,
    }).sign(pkey)

    const vm = await VM.create({ common })
    let address: Address
    vm.evm.events!.on('step', (step: InterpreterStep) => {
      if (step.depth === 1) {
        address = step.address
      }
    })

    await runTx(vm, { tx, skipHardForkValidation: true })

    let code = await vm.stateManager.getCode(address!)

    assert.equal(code.length, 0, 'did not deposit code')

    // put 0xFF contract
    const tx1 = createLegacyTx({
      data: '0x7F60FF60005360016000F300000000000000000000000000000000000000000000600052602060006000F000',
      gasLimit: 1000000,
      nonce: 1,
    }).sign(pkey)

    await runTx(vm, { tx: tx1, skipHardForkValidation: true })

    code = await vm.stateManager.getCode(address!)

    assert.ok(code.length > 0, 'did deposit code')
  })

  it('deploy contracts starting with 0xEF using CREATE2', async () => {
    // put 0xEF contract
    const tx = createLegacyTx({
      data: '0x7F60EF60005360016000F3000000000000000000000000000000000000000000006000526000602060006000F500',
      gasLimit: 1000000,
    }).sign(pkey)

    const vm = await VM.create({ common })
    let address: Address
    vm.evm.events!.on('step', (step: InterpreterStep) => {
      if (step.depth === 1) {
        address = step.address
      }
    })

    await runTx(vm, { tx, skipHardForkValidation: true })

    let code = await vm.stateManager.getCode(address!)

    assert.equal(code.length, 0, 'did not deposit code')

    // put 0xFF contract
    const tx1 = createLegacyTx({
      data: '0x7F60FF60005360016000F3000000000000000000000000000000000000000000006000526000602060006000F500',
      gasLimit: 1000000,
      nonce: 1,
    }).sign(pkey)

    await runTx(vm, { tx: tx1, skipHardForkValidation: true })

    code = await vm.stateManager.getCode(address!)

    assert.ok(code.length > 0, 'did deposit code')
  })
})
