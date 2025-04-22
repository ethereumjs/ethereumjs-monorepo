import { readFileSync } from 'fs'
import { assert, describe, expect, it } from 'vitest'

import { TransitionTool } from '../../t8n/t8ntool.ts'

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { MerkleStateManager } from '@ethereumjs/statemanager'
import { createTx } from '@ethereumjs/tx'
import { Account, createAddressFromPrivateKey, hexToBytes, randomBytes } from '@ethereumjs/util'
import { createVM, runTx } from '../../../src/index.ts'
import { stepTraceJSON, summaryTraceJSON } from '../../t8n/helpers.ts'
import type { T8NOptions } from '../../t8n/types.ts'
const t8nDir = 'test/t8n/testdata/'

const args: T8NOptions = {
  state: {
    fork: 'shanghai',
    reward: BigInt(0),
    chainid: BigInt(1),
  },
  input: {
    alloc: `${t8nDir}input/alloc.json`,
    txs: `${t8nDir}input/txs.json`,
    env: `${t8nDir}input/env.json`,
  },
  output: {
    basedir: t8nDir,
    result: `output/resultTEST.json`,
    alloc: `output/allocTEST.json`,
  },
  log: false,
  trace: false,
}

// This test is generated using `execution-spec-tests` commit 88cab2521322191b2ec7ef7d548740c0b0a264fc, running:
// fill -k test_push0_contracts[fork_Shanghai-blockchain_test-key_sstore] --fork Shanghai tests/shanghai/eip3855_push0 --evm-bin=<ETHEREUMJS_T8NTOOL_LAUNCHER.sh>

// The test will run the TransitionTool using the inputs, and then compare if the output matches

describe('test runner config tests', () => {
  it('should run t8ntool with inputs and report the expected output', async () => {
    await TransitionTool.run(args)
    const expectedResult = JSON.parse(readFileSync(`${t8nDir}output/result.json`).toString())
    const expectedAlloc = JSON.parse(readFileSync(`${t8nDir}output/alloc.json`).toString())
    const reportedResult = JSON.parse(readFileSync(`${t8nDir}output/resultTEST.json`).toString())
    const reportedAlloc = JSON.parse(readFileSync(`${t8nDir}output/allocTEST.json`).toString())
    assert.deepStrictEqual(reportedResult, expectedResult, 'result matches expected result')
    assert.deepStrictEqual(reportedAlloc, expectedAlloc, 'alloc matches expected alloc')
  })
})
describe('trace tests', async () => {
  it('should produce a valid step trace for a legacy contract', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun })
    const sm = new MerkleStateManager({ common })
    const vm = await createVM({ common, stateManager: sm })
    const bytecode = hexToBytes('0x604260005260206000F3') // PUSH1 42 PUSH1 00 MSTORE PUSH1 20 PUSH1 00 RETURN
    const contractAddress = createAddressFromPrivateKey(randomBytes(32))
    await vm.stateManager.putAccount(contractAddress)
    await vm.stateManager.putCode(contractAddress, bytecode)
    const trace: string[] = []
    vm.evm.events!.on('step', (step) => {
      trace.push(JSON.stringify(stepTraceJSON(step, true)))
    })
    vm.events!.on('afterTx', async (event) => {
      trace.push(JSON.stringify(await summaryTraceJSON(event, vm)))
    })
    const tx = await createTx({
      to: contractAddress,
      data: bytecode,
      gasLimit: 0xffffffff,
      gasPrice: 0xf,
    }).sign(randomBytes(32))
    await runTx(vm, { tx, skipBalance: true, skipBlockGasLimitValidation: true, skipNonce: true })
    assert.equal(trace.length, 7, 'trace length is 7')
    assert.equal(JSON.parse(trace[6]).gasUsed, 21154)
  })
  it('should produce a trace of the correct length', async () => {
    const common = new Common({
      hardfork: Hardfork.Prague,
      eips: [663, 3540, 3670, 4200, 4750, 5450, 6206, 7069, 7480, 7620, 7692, 7698],
      chain: Mainnet,
    })
    const sm = new MerkleStateManager({ common })
    const vm = await createVM({ common, stateManager: sm })
    const code = hexToBytes('0xef000101000402000100030400010000800001305000ef')

    const pk = randomBytes(32)
    const caller = createAddressFromPrivateKey(pk) // caller address
    const contractAddress = createAddressFromPrivateKey(randomBytes(32)) // contract address

    await vm.stateManager.putCode(contractAddress, code)
    await vm.stateManager.putAccount(caller, new Account(BigInt(0), BigInt(0x11111111)))

    const tx = await createTx({
      gasLimit: BigInt(0xffff),
      gasPrice: 0x7,
      to: contractAddress,
    }).sign(pk)
    const trace: string[] = []
    vm.evm.events!.on('step', (step) => {
      trace.push(JSON.stringify(stepTraceJSON(step, true)))
    })
    vm.events!.on('afterTx', async (event) => {
      trace.push(JSON.stringify(await summaryTraceJSON(event, vm)))
    })
    const result = await runTx(vm, {
      tx,
      skipBalance: true,
      skipNonce: true,
      skipBlockGasLimitValidation: true,
    })
    assert.equal(result.execResult.executionGasUsed, BigInt(4))
    assert.equal(trace.length, 4)
  })
  it('should produce a trace with storage activated', async () => {
    const bytecode = hexToBytes('0x604260005560206000f3') // PUSH1 42 PUSH1 00 MSTORE PUSH1 20 PUSH1 00 RETURN
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun })
    const sm = new MerkleStateManager({ common })
    const vm = await createVM({ common, stateManager: sm })
    const contractAddress = createAddressFromPrivateKey(randomBytes(32))
    await vm.stateManager.putAccount(contractAddress)
    await vm.stateManager.putCode(contractAddress, bytecode)
    const trace: string[] = []
    vm.evm.events!.on('step', (step) => {
      trace.push(JSON.stringify(stepTraceJSON(step, false, true)))
    })
    vm.events!.on('afterTx', async (event) => {
      trace.push(JSON.stringify(await summaryTraceJSON(event, vm)))
    })
    const tx = await createTx({
      to: contractAddress,
      gasLimit: 0xffffffff,
      gasPrice: 0xf,
    }).sign(randomBytes(32))

    await runTx(vm, { tx, skipBalance: true, skipBlockGasLimitValidation: true, skipNonce: true })
    assert.equal(trace.length, 7, 'trace length is 7')

    // First step trace should have empty storage
    const traceStepWithoutStorage = JSON.parse(trace[0])
    expect(traceStepWithoutStorage.storage.length).toBe(0)

    // Last step trace should have storage with actual value
    const traceStepWithStorage = JSON.parse(trace[5])
    assert.exists(traceStepWithStorage.storage)
    expect(traceStepWithStorage.storage).toMatchObject([['0x0', '0x42']])
    assert.equal(JSON.parse(trace[6]).gasUsed, 43115)
  })
  it('should execute an EOF contract with 2 code sections linked by RJUMP', async () => {
    const common = new Common({
      hardfork: Hardfork.Prague,
      eips: [663, 3540, 3670, 4200, 4750, 5450, 6206, 7069, 7480, 7620, 7692, 7698],
      chain: Mainnet,
    })
    const sm = new MerkleStateManager({ common })
    const vm = await createVM({ common, stateManager: sm })

    // EOF contract with 2 code sections linked by RJUMP
    // Section 1: ADDRESS, POP, RJUMP to section 2, PUSH1 1, STOP (PUSH1 and STOP are skipped) - 8 bytes
    // Section 2: ADDRESS, POP, STOP - 3 bytes
    const code = hexToBytes(
      '0xef000101000802000200080003040000000080000100080001305000e000036001003050',
    )

    const pk = randomBytes(32)
    const caller = createAddressFromPrivateKey(pk)
    const contractAddress = createAddressFromPrivateKey(randomBytes(32))

    await vm.stateManager.putCode(contractAddress, code)
    await vm.stateManager.putAccount(caller, new Account(BigInt(0), BigInt(0x11111111)))

    const tx = await createTx({
      gasLimit: BigInt(0xffff),
      gasPrice: 0x7,
      to: contractAddress,
    }).sign(pk)

    const trace: string[] = []
    vm.evm.events!.on('step', (step) => {
      trace.push(JSON.stringify(stepTraceJSON(step, true, true)))
    })
    vm.events!.on('afterTx', async (event) => {
      trace.push(JSON.stringify(await summaryTraceJSON(event, vm)))
    })

    const result = await runTx(vm, {
      tx,
      skipBalance: true,
      skipNonce: true,
      skipBlockGasLimitValidation: true,
    })

    // Expected trace length is 7:
    // 1. ADDRESS in code section 1
    // 2. POP in code section 1
    // 3. RJUMP to code section 2
    // 4. ADDRESS in code section 2
    // 5. POP in code section 2
    // 6. STOP in code section 2
    // Plus the summary trace
    assert.equal(trace.length, 7, 'trace length should be 7')

    // The execution should use exactly 6 gas
  })
})
