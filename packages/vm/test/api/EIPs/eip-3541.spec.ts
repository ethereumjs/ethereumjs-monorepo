import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Transaction } from '@ethereumjs/tx'
import { hexToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { VM } from '../../../src/vm'

import type { InterpreterStep } from '@ethereumjs/evm'
import type { Address } from '@ethereumjs/util'

const pkey = hexToBytes('20'.repeat(32))

tape('EIP 3541 tests', (t) => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin, eips: [3541] })
  const commonNoEIP3541 = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin, eips: [] })

  t.test('deposit 0xEF code if 3541 is active', async (st) => {
    // put 0xEF contract
    const tx = Transaction.fromTxData({
      data: '0x7FEF0000000000000000000000000000000000000000000000000000000000000060005260206000F3',
      gasLimit: 1000000,
    }).sign(pkey)

    let vm = await VM.create({ common })

    let result = await vm.runTx({ tx, skipHardForkValidation: true })
    let created = result.createdAddress

    let code = await vm.stateManager.getContractCode(created!)

    st.equal(code.length, 0, 'did not deposit code')

    // Test if we can put a valid contract

    // put a valid contract starting with SELFDESTRUCT
    const tx1 = Transaction.fromTxData({
      data: '0x7FFF0000000000000000000000000000000000000000000000000000000000000060005260206000F3',
      gasLimit: 1000000,
      nonce: 1,
    }).sign(pkey)

    result = await vm.runTx({ tx: tx1, skipHardForkValidation: true })
    created = result.createdAddress

    code = await vm.stateManager.getContractCode(created!)

    st.ok(code.length > 0, 'did deposit code')

    // check if we can deposit a contract on non-EIP3541 chains

    vm = await VM.create({ common: commonNoEIP3541 })
    const tx2 = Transaction.fromTxData({
      data: '0x7FEF0000000000000000000000000000000000000000000000000000000000000060005260206000F3',
      gasLimit: 1000000,
    }).sign(pkey)

    result = await vm.runTx({ tx: tx2, skipHardForkValidation: true })
    created = result.createdAddress

    code = await vm.stateManager.getContractCode(created!)

    st.ok(code.length > 0, 'did deposit code')

    st.end()
  })

  t.test('deploy contracts starting with 0xEF using CREATE', async (st) => {
    // put 0xEF contract
    const tx = Transaction.fromTxData({
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

    await vm.runTx({ tx, skipHardForkValidation: true })

    let code = await vm.stateManager.getContractCode(address!)

    st.equal(code.length, 0, 'did not deposit code')

    // put 0xFF contract
    const tx1 = Transaction.fromTxData({
      data: '0x7F60FF60005360016000F300000000000000000000000000000000000000000000600052602060006000F000',
      gasLimit: 1000000,
      nonce: 1,
    }).sign(pkey)

    await vm.runTx({ tx: tx1, skipHardForkValidation: true })

    code = await vm.stateManager.getContractCode(address!)

    st.ok(code.length > 0, 'did deposit code')
    st.end()
  })

  t.test('deploy contracts starting with 0xEF using CREATE2', async (st) => {
    // put 0xEF contract
    const tx = Transaction.fromTxData({
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

    await vm.runTx({ tx, skipHardForkValidation: true })

    let code = await vm.stateManager.getContractCode(address!)

    st.equal(code.length, 0, 'did not deposit code')

    // put 0xFF contract
    const tx1 = Transaction.fromTxData({
      data: '0x7F60FF60005360016000F3000000000000000000000000000000000000000000006000526000602060006000F500',
      gasLimit: 1000000,
      nonce: 1,
    }).sign(pkey)

    await vm.runTx({ tx: tx1, skipHardForkValidation: true })

    code = await vm.stateManager.getContractCode(address!)

    st.ok(code.length > 0, 'did deposit code')
    st.end()
  })
})
