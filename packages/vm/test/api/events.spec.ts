import { Block } from '@ethereumjs/block'
import { createFeeMarket1559Tx } from '@ethereumjs/tx'
import { Account, bytesToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { SIGNER_A } from '@ethereumjs/testdata'
import { createVM, runBlock, runTx } from '../../src/index.ts'

describe('VM events', () => {
  it('should emit the Block before running it', async () => {
    const vm = await createVM()

    let emitted
    vm.events.on('beforeBlock', (val) => {
      emitted = val
    })

    const block = new Block()

    await runBlock(vm, {
      block,
      generate: true,
      skipBlockValidation: true,
    })

    assert.strictEqual(emitted, block)
  })

  it('should emit a RunBlockResult after running a block', async () => {
    const vm = await createVM()

    let emitted
    vm.events.on('afterBlock', (val) => {
      emitted = val
    })

    const block = new Block()

    await runBlock(vm, {
      block,
      generate: true,
      skipBlockValidation: true,
    })

    assert.deepEqual((emitted as any).receipts, [])
    assert.deepEqual((emitted as any).results, [])
  })

  it('should emit the Transaction before running it', async () => {
    const vm = await createVM()

    let emitted
    vm.events.on('beforeTx', (val) => {
      emitted = val
    })

    const tx = createFeeMarket1559Tx({
      gasLimit: 90000,
      maxFeePerGas: 40000,
      to: '0x1111111111111111111111111111111111111111',
    }).sign(SIGNER_A.privateKey)

    await runTx(vm, { tx, skipBalance: true, skipHardForkValidation: true })

    assert.strictEqual(emitted, tx)
  })

  it('should emit RunTxResult after running a tx', async () => {
    const vm = await createVM()
    await vm.stateManager.putAccount(SIGNER_A.address, new Account(BigInt(0), BigInt(0x11111111)))
    let emitted: any
    vm.events.on('afterTx', (val: any) => {
      emitted = val
    })

    const tx = createFeeMarket1559Tx({
      gasLimit: 90000,
      maxFeePerGas: 40000,
      to: '0x1111111111111111111111111111111111111111',
      value: 1,
    }).sign(SIGNER_A.privateKey)

    await runTx(vm, { tx, skipBalance: true, skipHardForkValidation: true })

    assert.strictEqual(bytesToHex(emitted.execResult.returnValue), '0x')
  })

  it('should emit the Message before running it', async () => {
    const vm = await createVM()
    await vm.stateManager.putAccount(SIGNER_A.address, new Account(BigInt(0), BigInt(0x11111111)))
    let emitted: any
    vm.evm.events!.on('beforeMessage', (val, resolve) => {
      emitted = val
      resolve?.()
    })

    const tx = createFeeMarket1559Tx({
      gasLimit: 90000,
      maxFeePerGas: 40000,
      to: '0x1111111111111111111111111111111111111111',
      value: 1,
    }).sign(SIGNER_A.privateKey)

    await runTx(vm, { tx, skipBalance: true, skipHardForkValidation: true })

    assert.strictEqual(emitted.to.toString(), '0x1111111111111111111111111111111111111111')
    assert.strictEqual(bytesToHex(emitted.code), '0x')
  })

  it('should emit EVMResult after running a message', async () => {
    const vm = await createVM()
    await vm.stateManager.putAccount(SIGNER_A.address, new Account(BigInt(0), BigInt(0x11111111)))
    let emitted: any
    vm.evm.events!.on('afterMessage', (val, resolve) => {
      emitted = val
      resolve?.()
    })

    const tx = createFeeMarket1559Tx({
      gasLimit: 90000,
      maxFeePerGas: 40000,
      to: '0x1111111111111111111111111111111111111111',
      value: 1,
    }).sign(SIGNER_A.privateKey)

    await runTx(vm, { tx, skipBalance: true, skipHardForkValidation: true })

    assert.strictEqual(bytesToHex(emitted.execResult.returnValue), '0x')
  })

  it('should emit InterpreterStep on each step', async () => {
    const vm = await createVM()

    let lastEmitted: any
    vm.evm.events!.on('step', (val, resolve) => {
      lastEmitted = val
      resolve?.()
    })

    // This is a deployment transaction that pushes 0x41 (i.e. ascii A) followed by 31 0s to
    // the stack, stores that in memory, and then returns the first byte from memory.
    // This deploys a contract which has a single byte of code, 0x41.
    const tx = createFeeMarket1559Tx({
      gasLimit: 90000,
      maxFeePerGas: 40000,
      data: '0x7f410000000000000000000000000000000000000000000000000000000000000060005260016000f3',
    }).sign(SIGNER_A.privateKey)

    await runTx(vm, { tx, skipBalance: true, skipHardForkValidation: true })

    assert.strictEqual(lastEmitted.opcode.name, 'RETURN')
  })

  it('should emit a NewContractEvent on new contracts', async () => {
    const vm = await createVM()

    let emitted: any
    vm.evm.events!.on('newContract', (val, resolve) => {
      emitted = val
      resolve?.()
    })

    // This is a deployment transaction that pushes 0x41 (i.e. ascii A) followed by 31 0s to
    // the stack, stores that in memory, and then returns the first byte from memory.
    // This deploys a contract which has a single byte of code, 0x41.
    const tx = createFeeMarket1559Tx({
      gasLimit: 90000,
      maxFeePerGas: 40000,
      data: '0x7f410000000000000000000000000000000000000000000000000000000000000060005260016000f3',
    }).sign(SIGNER_A.privateKey)

    await runTx(vm, { tx, skipBalance: true, skipHardForkValidation: true })

    assert.strictEqual(
      bytesToHex(emitted.code),
      '0x7f410000000000000000000000000000000000000000000000000000000000000060005260016000f3',
    )
  })
})
